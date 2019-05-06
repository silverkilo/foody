const router = require('express').Router()
const { Preference, User, UserPreference } = require('../db/models')
module.exports = router


router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(Number(req.params.id), {
            include: [
                { model: Preference }
            ]
        })
        res.send(user.preferences)
    } catch (e) {
        next(e)
    }
})

router.post('/:userId', async (req, res, next) => {
    try {
        const { preferences } = req.body
        if (!preferences || !Array.isArray(preferences)) {
            const err = new Error('"preferences" must be an array')
            err.status = 400
            throw err
        }
        const userId = Number(req.params.userId)
        await UserPreference.destroy({
            where: {
                userId
            }
        })
        const newPrefs = preferences.map(preferenceId => ({ userId, preferenceId }))
        await UserPreference.bulkCreate(newPrefs)
        res.status(201).send(preferences)
    } catch (e) {
        next(e)
    }
})

