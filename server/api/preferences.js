const router = require('express').Router()
const cache = require('../cache')
module.exports = router


router.get('/:id', async (req, res, next) => {
    try {
        const userPreferences = await cache.preferences.get(req.params.id)
        res.send(userPreferences)
    } catch (e) {
        next(e)
    }
})

router.post('/:id', async (req, res, next) => {
    try {
        await cache.preferences.set(req.params.id, req.body.preferences)
        const prefs = await cache.preferences.get(req.params.id)
        res.status(201).send(prefs)
    } catch (e) {
        next(e)
    }
})

