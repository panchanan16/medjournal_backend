const express = require('express');
const authRouter = express.Router();
const { uploadSingleFile, uploadMultipleFields } = require('@/middlewares/uploadFiles')


const authController = require('@/controllers/auth/index')


authRouter.post('/auth/create', uploadMultipleFields([{name: 'profile_img', maxCount: 1}], 'profile'), authController.create)
authRouter.post('/auth/login', authController.login)
authRouter.get('/auth/readOne', authController.findOne)
authRouter.get('/auth/readAll', authController.findAll)
authRouter.put('/auth/update',  uploadMultipleFields([{name: 'profile_img', maxCount: 1}], 'profile'), authController.update)
authRouter.delete('/auth/remove', authController.delete)
authRouter.delete('/auth/logout', authController.logout)



module.exports = authRouter