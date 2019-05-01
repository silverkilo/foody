function gatewayCreator(condition) {
  return (req, res, next) => {
    try {
      if (condition(req)) {
        next()
      } else {
        res.send('no')
      }
    } catch (err) {
      next(err)
    }
  }
}

const adminGateway = gatewayCreator(req => req.user && req.user.isAdmin)
const userGateway = gatewayCreator(
  req => req.user && req.user.id === req.params.userId
)
const userOrAdminGateway = gatewayCreator(
  req => req.user && (req.user.isAdmin || req.user.id === req.params.userId)
)

module.exports = {adminGateway, userGateway, userOrAdminGateway}
