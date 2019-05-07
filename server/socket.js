const socketIO = require('socket.io')
const { Op, fn, col, literal } = require('sequelize')
const { Preference, User, UserPreference, Match } = require('./db/models')
module.exports = function (server, sessionMiddleware) {
    const io = socketIO(server,
        // { origins: 'http://localhost:3000' }
    )
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    io.on('connect', (socket) => {
        console.log('connected', socket.request.session)
        socket.on('getMatches', async ({ id, exclude }) => {
            try {
                exclude = (exclude || []).concat([id])
                const user = await User.findByPk(id, {
                    include: [{
                        model: Preference
                    }]
                })
                const userPrefs = user.preferences.map(({ id, }) => id)
                const distanceCalc = literal(`sqrt(pow(${user.latitude} - "user"."latitude", 2) + pow(${user.longitude} - "user"."longitude", 2))`)
                let matchers = await user.getMatcher({
                    attributes: ['firstName', 'lastName', 'id', 'latitude', 'longitude', [distanceCalc, 'distance']],
                    where: {
                        id: {
                            [Op.notIn]: exclude
                        },
                        hasMatched: false
                    },
                    include: [{
                        attributes: ['id', 'category'],
                        model: Preference,
                        where: {
                            id: {
                                [Op.in]: userPrefs
                            },
                        },
                    }],
                    order: col('distance'),
                    limit: 5
                })
                matchers = matchers.map(matcher => ({ ...matcher, match: true }))
                const remainder = 5 - matchers.length
                let rest = []
                if (remainder > 0) {
                    rest = await User.findAll({
                        attributes: ['firstName', 'lastName', 'id', 'latitude', 'longitude', [distanceCalc, 'distance']],
                        include: [{
                            attributes: ['id', 'category'],
                            model: Preference,
                            where: {
                                id: {
                                    [Op.in]: userPrefs
                                }
                            },
                        }],
                        where: [{
                            id: {
                                [Op.notIn]: exclude.concat(matchers.map(({ id }) => id))
                            },
                            hasMatched: false,
                        }],
                        order: col('distance'),
                        limit: remainder
                    })
                }
                socket.emit('potentialMatches', matchers.concat(rest))
            } catch (e) {
                socket.emit('error', new Error('There was an error getting matches'))
            }
        })
        socket.on('swipe', async ({ value, id, matchee, matched }) => {
            try {
                if (value) {
                    matched = matched || !!(await Match.findOne({
                        where: {
                            matcheeId: id,
                            matcherId: matchee
                        }
                    }))
                    if (matched) {
                        User.update({
                            hasMatched: true
                        }, {
                                where: {
                                    id: {
                                        [Op.in]: [id, matchee]
                                    }
                                }
                            }).catch(e => console.log(e))
                    } else {
                        await Match.create({
                            matcherId: id,
                            matcheeId: matchee
                        })
                    }
                }
                socket.emit('match', { matched })
            } catch (error) {
                socket.emit('match', { matched })
            }
        })
        socket.on('disconnect', () => {
            console.log('disconnected', socket.id)
        })
    })
}