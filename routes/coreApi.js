const express = require('express');
const coreRouter = express.Router();
const { uploadSingleFile, uploadMultipleFiles, uploadMultipleFields } = require('@/middlewares/uploadFiles')

const editorBoardController = require('@/controllers/core/editorBoard')
const articleMainController = require('@/controllers/core/articleMain')
const articleFullController = require('@/controllers/core/articleDetails')
const specialIssueFullController = require('@/controllers/core/specialIssue')
const journalController = require('@/controllers/core/journal')
const newsAnnouncementController = require('@/controllers/core/newsAnnouncement')
const headerController = require('@/controllers/core/headerController')

// Editor Board API ----
coreRouter.post('/editorBoard/create', uploadSingleFile('editor_img', 'editorBoard'), editorBoardController.create)
coreRouter.put('/editorBoard/update', uploadSingleFile('editor_img', 'editorBoard'), editorBoardController.update)

// Article main API ----
coreRouter.post('/articleMain/create', uploadMultipleFields([{ name: 'pdfFile', maxCount: 1 }, { name: 'xmlFile', maxCount: 1 }], 'testarticle'), articleMainController.create)
coreRouter.get('/getByVolumeId/readAll', articleMainController.getArticlesWithVolumeId)
coreRouter.put('/articleMain/update', uploadMultipleFields([{ name: 'pdfFile', maxCount: 1 }, { name: 'xmlFile', maxCount: 1 }], 'testarticle'),  articleMainController.update)

// Article full version ----
coreRouter.get('/articlefull/readOne/:id', articleFullController.getArticleById)

// Article Section GET api
coreRouter.get('/articleSection/readOne', articleFullController.getArticleSectionById)

// Special issue with articles and authors
coreRouter.get('/specialissuefull/readOne', specialIssueFullController.getSpecialIssueDetails)


// MainJournal Api ----------
coreRouter.post('/journal/create', uploadMultipleFields([{ name: 'logo_img', maxCount: 1 }, { name: 'thumbnail_img', maxCount: 1 }], 'journal'), journalController.create)
coreRouter.get('/journal/readAll', journalController.findAll)
coreRouter.put('/journal/update', uploadMultipleFields([{ name: 'logo_img', maxCount: 1 }, { name: 'thumbnail_img', maxCount: 1 }], 'journal'), journalController.update)


// Get both Article and News ----
coreRouter.get('/newsAnnouncement/readAll', newsAnnouncementController.getAllAnnouncementsAndNews)


//Header controller --------
coreRouter.get('/header/readOne', headerController.findOne)

module.exports = coreRouter

