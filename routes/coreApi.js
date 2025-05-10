const express = require('express');
const coreRouter = express.Router();
const { uploadSingleFile, uploadMultipleFiles, uploadMultipleFields } = require('@/middlewares/uploadFiles')

const editorBoardController = require('@/controllers/core/editorBoard')
const articleMainController = require('@/controllers/core/articleMain')
const articleFullController = require('@/controllers/core/articleDetails')

// Editor Board API ----
coreRouter.post('/editorBoard/create', uploadSingleFile('editorImg', 'editorBoard'), editorBoardController.create)

// Article main API ----
coreRouter.post('/articleMain/create', uploadMultipleFields([{ name: 'pdflink', maxCount: 1 }, { name: 'xmllink', maxCount: 1 }], 'testarticle'), articleMainController.create)


// Article full version ----
coreRouter.get('/articlefull/readOne/:id', articleFullController.getArticleById)


module.exports = coreRouter

