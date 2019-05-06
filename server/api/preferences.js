const router = require('express').Router()
// const cache = require('../cache')
const { Preference, User, UserPreference } = require('../db/models')
module.exports = router


router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(Number(req.params.id), {
            include: [
                { model: Preference }
            ]
        })
        res.send(user.preferences.map(({ id, category }) => ({ id, category })))
    } catch (e) {
        next(e)
    }
})

router.post('/:id', async (req, res, next) => {
    try {
        const { preferences } = req.body
        const id = Number(req.params.id)
        await UserPreference.destroy({
            where: {
                userId: id
            }
        })
        const newPrefs = preferences.map(preferenceId => ({ userId: id, preferenceId }))
        await UserPreference.bulkCreate(newPrefs)
        res.status(201).send(preferences)
    } catch (e) {
        next(e)
    }
})

