const router = require('express').Router()
const { User } = require('../db/models')
const { authGateWay } = require('./gateway')
module.exports = router



router.post('/:id', async (req, res, next) => {
    try {
        let { latitude, longitude } = req.body
        latitude = Math.round(Number(latitude) * 1e7)
        longitude = Math.round(Number(longitude) * 1e7)
        if (!latitude || !longitude) {
            const err = new Error('"latitiude and longitude must be provided" must be provided as an array')
            err.status = 400
            throw err
        }
        const id = Number(req.params.id)
        const [, [updatedUser]] = await User.update({
            latitude, longitude
        }, {
                where: {
                    id
                },
                returning: true
            })
        res.status(201).send(updatedUser)
    } catch (e) {
        next(e)
    }
})
