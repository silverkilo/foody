const router = require('express').Router()
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
        const user = await User.findByPk(id, {
            include: [{
                model: Preference
            }]
        })
        const userPrefs = user.preferences.map(({ id, }) => id)
        const distanceCalc = literal(`sqrt(pow(${user.latitude} - "user"."latitude", 2) + pow(${user.longitude} - "user"."longitude", 2))`)
        const matchers = await user.getMatcher({
            attributes: ['firstName', 'lastName', 'id', 'latitude', 'longitude', [distanceCalc, 'distance']],
            where: {
                id: {
                    [Op.notIn]: exclude
                },
                hasMatched: false
            },
            include: [{
                model: Preference,
                where: {
                    id: {
                        [Op.in]: userPrefs
                    }
                },
            }],
            order: col('distance')
        })
        const rest = await User.findAll({
            attributes: ['firstName', 'lastName', 'id', 'latitude', 'longitude', [distanceCalc, 'distance']],
            include: [{
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
        })
        res.send(matchers.concat(rest))
    } catch (e) {
        next(e)
    }
})

