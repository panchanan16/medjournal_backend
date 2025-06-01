const express = require('express');
const authRouter = express.Router();
const { uploadSingleFile, uploadMultipleFields } = require('@/middlewares/uploadFiles')


const authController = require('@/controllers/auth/index');
const SendMail = require('@/utils/email');


authRouter.post('/auth/create', uploadMultipleFields([{ name: 'profile_img', maxCount: 1 }], 'profile'), authController.create)
authRouter.post('/auth/login', authController.login)
authRouter.get('/auth/readOne', authController.findOne)
authRouter.get('/auth/readAll', authController.findAll)
authRouter.put('/auth/update', uploadMultipleFields([{ name: 'profile_img', maxCount: 1 }], 'profile'), authController.update)
authRouter.delete('/auth/remove', authController.delete)
authRouter.delete('/auth/logout', authController.logout)
authRouter.get('/auth/verifyemail', authController.verifyUserByEmail)



authRouter.get('/auth/sendEmail', async (req, res) => {
    const resposne = await SendMail.SendMailUsingBravo('https://theinternational/auth/emailverify/kjdhghighi', 'dekapanchanan16@gmail.com', 'Panchanan Deka')
    console.log(resposne)
    res.send({msg: "email sended"})
})



module.exports = authRouter