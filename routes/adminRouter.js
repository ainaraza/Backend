const adminController = require('../controllers/adminController.js')

const router = require('express').Router()

router.post('/loginadmin', adminController.login)

router.post('/logoutadmin', adminController.logout)


module.exports = router