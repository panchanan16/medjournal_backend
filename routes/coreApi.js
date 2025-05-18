const express = require('express');
const coreRouter = express.Router();
const { uploadSingleFile, uploadMultipleFiles, uploadMultipleFields } = require('@/middlewares/uploadFiles')

const editorBoardController = require('@/controllers/core/editorBoard')
const articleMainController = require('@/controllers/core/articleMain')
const articleFullController = require('@/controllers/core/articleDetails')
const specialIssueFullController = require('@/controllers/core/specialIssue')
const journalController = require('@/controllers/core/journal')

// Editor Board API ----
coreRouter.post('/editorBoard/create', uploadSingleFile('editor_img', 'editorBoard'), editorBoardController.create)
coreRouter.put('/editorBoard/update', uploadSingleFile('editor_img', 'editorBoard'), editorBoardController.update)

// Article main API ----
coreRouter.post('/articleMain/create', uploadMultipleFields([{ name: 'pdflink', maxCount: 1 }, { name: 'xmllink', maxCount: 1 }], 'testarticle'), articleMainController.create)
coreRouter.get('/getByVolumeId/readAll', articleMainController.getArticlesWithVolumeId)


// Article full version ----
coreRouter.get('/articlefull/readOne/:id', articleFullController.getArticleById)

// Special issue with articles and authors
coreRouter.get('/specialissuefull/readOne', specialIssueFullController.getSpecialIssueDetails)


// MainJournal Api ----------
coreRouter.post('/journal/create', uploadMultipleFields([{ name: 'logo_img', maxCount: 1 }, { name: 'thumbnail_img', maxCount: 1 }], 'journal'), journalController.create)
coreRouter.get('/journal/readAll', journalController.findAll)
coreRouter.put('/journal/update', uploadMultipleFields([{ name: 'logo_img', maxCount: 1 }, { name: 'thumbnail_img', maxCount: 1 }], 'journal'), journalController.update)


module.exports = coreRouter

