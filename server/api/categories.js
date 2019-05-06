const router = require('express').Router()
const { Preference } = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
    try {
        const prefs = await Preference.findAll()
        res.send(prefs.map(({ id, category }) => ({ id, category })))
    } catch (e) {
        next(e)
    }
})
router.post('/', async (req, res, next) => {
    try {
        const { category } = req.body
        const pref = await Preference.create({ category })
        res.status(201).send({ id: pref.id, category })
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        await Preference.destroy({ where: { id } })
        res.sendStatus(204)
    } catch (e) {
        next(e)
    }
})