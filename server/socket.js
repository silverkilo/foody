const socketIO = require("socket.io");
const db = require("./db");
const { Op } = require("sequelize");
const { Preference, User, Match } = require("./db/models");

const exclusions = {};

User.findAll().then(users => {
  for (let user of users) {
    Match.findAll({
      where: {
        matcherId: user.id
      }
    }).then(matches => {
      exclusions[user.id] = [user.id].concat(
        matches.map(({ matcheeId }) => matcheeId)
      );
    });
  }
});

module.exports = function socketio(server, sessionMiddleware) {
  const io = socketIO(server);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on("connect", async socket => {
    let userId;
    if (
      socket.request &&
      socket.request.session &&
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      userId = socket.request.session.passport.user;
      await User.update(
        { socketId: socket.id },
        {
          where: {
            id: userId
          }
        }
      );
      exclusions[userId] = exclusions[userId] || [userId];
      socket.emit("ready");
    } else return;

    // CLIENT asks for potential matches
    // RETURNS a list of potential matches and their preferences
    socket.on("getPotentialMatches", async () => {
      try {
        //get the current user, aggregate their preferences into an array, get their location
        const [[user]] = await db.query(
          `
                    SELECT 
                        users.id, location,
                        array_agg(preferences.id) as preferences
                    FROM users
                    INNER JOIN user_preferences
                        ON "user_preferences"."userId" = users.id
                    INNER JOIN preferences 
                        ON "preferences"."id" = "user_preferences"."preferenceId"
                    WHERE users.id = ?
                    GROUP BY users.id
                `,
          { replacements: [userId] }
        );
        // get all users who have preferences in common with the user and who have chosen to match with the current user
        // get their preferences
        // sort them by distance from the current user
        // exclude the current user and any other exclusion

        // ** `ST_Distance("user"."location", 'SRID=26918;POINT(? ?)'::geometry) AS distance` <- for seeing the actual distance, we dont normally want Postgis to actually do this calculation
        // if doing ST_Distance, prepend user.location.coordiates[0] and user.location.coordiates[1] to the replacements array
        // this can also be done for the following query
        const [matchers] = await db.query(
          `
                    SELECT 
                        "user"."id", "user"."firstName", "user"."lastName", 
                        array_agg("preferences"."category") as preferences,
                        TRUE as match
                    FROM "users" AS "user" 
                        INNER JOIN (
                            "user_preferences" AS "preferences->user_preference"
                            INNER JOIN "preferences" AS "preferences" ON "preferences"."id" = "preferences->user_preference"."preferenceId"
                            ) 
                        ON "user"."id" = "preferences->user_preference"."userId" AND "preferences"."id" IN (?) 
                        INNER JOIN "matches" AS "match" ON "user"."id" = "match"."matcherId" AND "match"."matcheeId" = ? 
                    WHERE (("user"."id" NOT IN (?) AND "user"."hasMatched" IS NULL))
                    GROUP BY "user"."id"
                    ORDER BY "user"."location" <-> 'SRID=26918;POINT(? ?)'::geometry
                    LIMIT 5;
                ;
                `,
          {
            replacements: [
              user.preferences,
              user.id,
              exclusions[userId],
              user.location.coordinates[0],
              user.location.coordinates[1]
            ]
          }
        );
        if (matchers.length < 5) {
          // get all users and their preferences who have at least one preference in common with the user, sort them by distance
          const [moreMatchers] = await db.query(
            `
                        SELECT 
                            "user"."id",  "user"."firstName", "user"."lastName", 
                            array_agg("preferences"."category") AS preferences, 
                            FALSE AS match
                        FROM "users" AS "user" INNER JOIN (
                        "user_preferences" AS "preferences->user_preference"
                        INNER JOIN "preferences" AS "preferences" ON "preferences"."id" = "preferences->user_preference"."preferenceId"
                        )
                        ON "user"."id" = "preferences->user_preference"."userId" AND "preferences"."id" IN (?)
                        WHERE (("user"."id" NOT IN (?) AND "user"."hasMatched" IS NULL))
                        GROUP BY "user"."id"
                        ORDER BY "user"."location" <-> 'SRID=26918;POINT(? ?)'::geometry
                        LIMIT ?;
                `,
            {
              replacements: [
                user.preferences,
                exclusions[userId].concat(matchers.map(({ id }) => id)),
                user.location.coordinates[0],
                user.location.coordinates[1],
                5 - matchers.length
              ]
            }
          );
          matchers.push(...moreMatchers);
        }
        socket.emit("potentialMatches", matchers);
      } catch (e) {
        console.log(e);
        socket.emit("errorMessage", "There was an error getting matches");
      }
    });
    // CLIENT asks for whether the user has matched
    // EMITS whether the user has matched (matched: boolean) and if true also emits the info of the matchee and matcher
    socket.on("haveIMatched", async () => {
      try {
        const user = await User.findByPk(userId);
        if (user.hasMatched) {
          const matcherInfo = await User.findByPk(userId, {
            attributes: [
              "id",
              "firstName",
              "lastName",
              "location",
              "hasMatched"
            ],
            include: [
              {
                model: Preference,
                attributes: ["id", "category"]
              }
            ]
          });
          const matcheeInfo = await User.findByPk(matcherInfo.hasMatched, {
            attributes: [
              "id",
              "firstName",
              "lastName",
              "location",
              "hasMatched"
            ],
            include: [
              {
                model: Preference,
                where: {
                  id: {
                    [Op.in]: matcherInfo.preferences.map(({ id }) => id)
                  }
                },
                attributes: ["id", "category"]
              }
            ]
          });
          if (matcheeInfo.socketId) {
            socket.emit("didMatch", { matched: true, matcheeInfo });
            return socket
              .to(matcheeInfo.socketId)
              .emit("didMatch", { matched: true, matcherInfo: user });
          }
        }
        return socket.emit({ matched: false });
      } catch (e) {
        console.log(e);
        socket.emit("errorMessage", "There was an error processing the swipe");
      }
    });

    //recieves whether or not the user swiped right or left (value: boolean), the matchee id (matchee: number)
    // and whether a match happened and the CLIENT already knew about it
    // EMITS whether there was a match, and if there was and both users are connected, emits the corresponding matcher/matchee to the client
    socket.on("swipe", async ({ value, matchee, matched }) => {
      try {
        exclusions[userId].push(matchee);
        if (value) {
          matched =
            matched ||
            !!(await Match.findOne({
              where: {
                matcheeId: userId,
                matcherId: matchee
              }
            }));
          if (matched) {
            await Promise.all([
              User.update(
                {
                  hasMatched: matchee
                },
                {
                  where: {
                    id: userId
                  }
                }
              ),
              User.update(
                {
                  hasMatched: userId
                },
                {
                  where: {
                    id: matchee
                  }
                }
              )
            ]).catch(e => console.log(e));
            const matcherInfo = await User.findByPk(userId, {
              attributes: [
                "id",
                "firstName",
                "lastName",
                "location",
                "hasMatched",
                "socketId"
              ],
              include: [
                {
                  model: Preference,
                  attributes: ["id", "category"]
                }
              ]
            });
            const matcheeInfo = await User.findByPk(matchee, {
              attributes: [
                "id",
                "firstName",
                "lastName",
                "location",
                "hasMatched",
                "socketId"
              ],
              include: [
                {
                  model: Preference,
                  where: {
                    id: {
                      [Op.in]: matcherInfo.preferences.map(({ id }) => id)
                    }
                  },
                  attributes: ["id", "category"]
                }
              ]
            });
            if (matcherInfo.socketId && matcheeInfo.socketId) {
              socket.emit("didMatch", { matched, matcheeInfo });
              return socket
                .to(matcheeInfo.socketId)
                .emit("didMatch", { matched, matcherInfo });
            } else {
              return socket.emit("didMatch", { matched: false });
            }
          } else {
            await Match.create({
              matcherId: userId,
              matcheeId: matchee
            });
          }
        } else {
          matched = false;
        }
        return socket.emit("didMatch", { matched });
      } catch (error) {
        console.log(error);
        socket.emit("errorMessage", "There was an error processing the swipe");
      }
    });

    //removes socketIds from disconnected users

    socket.on("disconnect", async () => {
      console.log("disconnected", socket.id);
      await User.update(
        { socketId: null },
        {
          where: {
            id: userId
          }
        }
      );
    });
  });
};
