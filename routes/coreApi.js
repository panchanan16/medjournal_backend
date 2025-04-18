const express = require('express');
const coreRouter = express.Router();
const { uploadSingleFile, uploadMultipleFiles } = require('@/middlewares/uploadFiles')

const editorBoardController = require('@/controllers/core/editorBoard')

// Editor Board API ----
coreRouter.post('/editorBoard/create', uploadSingleFile('editorImg', 'editorBoard'), editorBoardController.create)


module.exports = coreRouter

