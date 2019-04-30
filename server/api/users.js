const router = require('express').Router()
const {User} = require('../db/models')

router.get('/:userId', async (req, res, next) {
    try {
        const userId = await Number(req.params.userId)
        const user = await User.findByPk(userId)
        res.json({
            id: user.id,
            email: user.email,
        })
    } catch (err) {
        next(err)
    }
})