const router = require('express').Router()
const db = require('../db')
const { Op, fn, col, literal } = require('sequelize')
const { Preference, User, UserPreference, Match } = require('../db/models')
const { authGateWay } = require('./gateway')
module.exports = router


router.post('/match/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { matchee } = req.body
        const didMatch = req.body.didMatch || !!(await Match.findOne({
            where: {
                matcheeId: id,
                matcherId: matchee
            }
        }))
        if (didMatch) {
            await Promise.all([User.update({
                hasMatched: matchee
            }, {
                    where: {
                        id
                    },
                }),
            User.update({
                hasMatched: id
            }, {
                    where: {
                        id: matchee
                    },
                })])
            const matcher = await User.findByPk(id, {
                attributes: ['id', 'firstName', 'lastName', 'location', 'hasMatched'],
                include: [
                    {
                        model: Preference,
                        attributes: ['id', 'category']
                    }
                ]
            })
            const matcheeInfo = await User.findByPk(matchee, {
                attributes: ['id', 'firstName', 'lastName', 'location', 'hasMatched'],
                include: [
                    {
                        model: Preference,
                        where: {
                            id: {
                                [Op.in]: matcher.preferences.map(({ id }) => id)
                            }
                        },
                        attributes: ['id', 'category']
                    }
                ]
            })
            return res.status(201).send({ didMatch, matcher, matchee: matcheeInfo })
        } else {
            await Match.create({
                matcherId: id,
                matcheeId: matchee
            })
        }
        res.status(201).send({ didMatch })

    } catch (error) {
        next(error)
    }
})


router.post('/potential/:id', async (req, res, next) => {
    //Get all users that have at least one location and preference in common with the user, prioritize users that have swiped right on the user, exclude users already swiped on
    try {
        const id = Number(req.params.id)
        const exclude = (req.body.exclude || []).concat([id])
        //get the current user, aggregate their preferences into an array, get their location
        const [[user]] = await db.query(`
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
        `, { replacements: [id] })

        // get all users who have preferences in common with the user and who have chosen to match with the current user 
        // get their preferences
        // sort them by distance from the current user
        // exclude the current user and any other exclusion

        // ** `ST_Distance("user"."location", 'SRID=26918;POINT(? ?)'::geometry) as distance` <- for seeing the actual distance, we dont normally want Postgis to actually do this calculation
        // if doing ST_Distance, prepend user.location.coordiates[0] and user.location.coordiates[1] to the replacements array
        // this can also be done for the following query
        const [matchers] = await db.query(`
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
        `, { replacements: [user.preferences, user.id, exclude, user.location.coordinates[0], user.location.coordinates[1]] })

        if (matchers.length < 5) {
            // get all users and their preferences who have at least one preference in common with the user, sort them by distance
            const [moreMatchers] = await db.query(`
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
        `, { replacements: [user.preferences, exclude.concat(matchers.map(({ id }) => id)), user.location.coordinates[0], user.location.coordinates[1], 5 - matchers.length] })
            matchers.push(...moreMatchers)
        }

        res.send(matchers)
    } catch (e) {
        next(e)
    }
})

