const router = require('express').Router()
const { Op, fn, col } = require('sequelize')
const { Preference, User, UserPreference, Location, UserLocation, Match } = require('../db/models')
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
            return res.status(201).send({ didMatch })
        } else {
            await Match.create({
                matcherId: id,
                matcheeId: matchee
            })
        }


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
            }, {
                model: Location
            }]
        })
        const userPrefs = user.preferences.map(({ id, }) => id)
        const userLocs = user.locations.map(({ id }) => id)
        const matchers = await user.getMatcher({
            where: {
                id: {
                    [Op.notIn]: exclude
                }
            },
            include: [{
                model: Preference,
                where: {
                    id: {
                        [Op.in]: userPrefs
                    }
                },
            }, {
                model: Location,
                where: {
                    id: {
                        [Op.in]: userLocs
                    }
                }
            }],
            order: col('preferences')
        })
        const rest = await User.findAll({
            include: [{
                model: Preference,
                where: {
                    id: {
                        [Op.in]: userPrefs
                    }
                },
            }, {
                model: Location,
                where: {
                    id: {
                        [Op.in]: userLocs
                    }
                }
            }],
            where: [{
                id: {
                    [Op.notIn]: exclude.concat(matchers.map(({ id }) => id))
                }
            }],
            order: col('preferences')
        })
        res.send(matchers.concat(rest))
    } catch (e) {
        next(e)
    }
})

