const router = require('express').Router()
const { UserLocation, Location, } = require('../db/models')
const { authGateWay } = require('./gateway')
module.exports = router


router.post('/', async (req, res, next) => {
    try {
        const { locations } = req.body
        if (!locations || !Array.isArray(locations)) {
            const err = new Error('"locations" must be provided as an array')
            err.status = 400
            throw err
        }

        const newLocations = await Location.bulkCreate(locations.map((name) => ({ name })), { returning: true })
        res.status(201).send(newLocations)
    } catch (e) {
        next(e)
    }
})


router.post('/me', authGateWay, async (req, res, next) => {
    try {
        const { locations } = req.body
        if (!locations || !Array.isArray(locations)) {
            const err = new Error('"locations" must be provided as an array')
            err.status = 400
            throw err
        }
        const userId = req.user.id
        await UserLocation.destroy({
            where: {
                userId
            }
        })
        const newLocs = locations.map(locationId => ({ userId, locationId }))
        await UserLocation.bulkCreate(newLocs)
        res.status(201).send(locations)
    } catch (e) {
        next(e)
    }
})
