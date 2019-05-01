const router = require('express').Router()
const cache = require('../cache')
module.exports = router

router.get('/', async (req, res, next) => {
    try {
        const categories = await cache.categories.get()
        res.send(categories)
    } catch (e) {
        next(e)
    }
})
router.post('/', async (req, res, next) => {
    try {
        const categories = await cache.categories.get()
        categories.push(req.body.preference)
        await cache.categories.set('all', categories)
        res.send(categories)
    } catch (e) {
        next(e)
    }
})

router.delete('/:name', async (req, res, next) => {
    try {
        const categories = await cache.categories.get()
        await cache.categories.set('all', categories.filter(cat => cat !== req.params.name))
        res.sendStatus(204)
    } catch (e) {
        next(e)
    }
})