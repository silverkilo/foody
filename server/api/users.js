const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router
const {userGateway} = require('./gateway')

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = await Number(req.params.userId)
    const user = await User.findByPk(userId)
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      googleId: null,
      password: req.body.password
    })
    res.status(201).send(newUser)
  } catch (err) {
    next(err)
  }
})

router.put(
  '/:userId/:newPassword',
  userGateway,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId)
      if (!user) {
        res.sendStatus(404)
      } else {
        await user.update({password: req.params.newPassword})
        res.json('success')
      }
    } catch (err) {
      next(err)
    }
  }
)

