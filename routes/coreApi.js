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
const manuscriptController = require('@/controllers/core/manuscriptController')
const sliderControllers = require('@/controllers/core/sliderController')
const corevolumeControllers = require('@/controllers/core/volumeController')

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


// Manuscript Controllers ----
coreRouter.post('/manuscript/create', uploadMultipleFields([{ name: 'article_file', maxCount: 1 }, { name: 'acceptance_letter', maxCount: 1 }, { name: 'invoice', maxCount: 1 }, { name: 'additional_file', maxCount: 1 }], 'manuscript'), manuscriptController.create)
coreRouter.post('/manuscript/createByUser', uploadMultipleFields([{ name: 'article_file', maxCount: 1 }], 'manuscript'), manuscriptController.createByUser)
coreRouter.put('/manuscript/update', uploadMultipleFields([{ name: 'article_file', maxCount: 1 }, { name: 'acceptance_letter', maxCount: 1 }, { name: 'invoice', maxCount: 1 }, { name: 'additional_file', maxCount: 1 }], 'manuscript'), manuscriptController.update)
coreRouter.get('/manuscript/readAll', manuscriptController.findAll)
coreRouter.get('/manuscript/readOne', manuscriptController.findOne)




// Slider Controllers -------
coreRouter.post('/slider/create', uploadMultipleFields([{ name: 'slider_img', maxCount: 1 }], 'slider'), sliderControllers.create)
coreRouter.put('/slider/update', uploadMultipleFields([{ name: 'slider_img', maxCount: 1 }], 'slider'), sliderControllers.update)
coreRouter.get('/slider/readAll', sliderControllers.findAll)
coreRouter.get('/slider/readOne', sliderControllers.findOne)



// Volume Controllers --------
coreRouter.post('/volume/create', uploadMultipleFields([{ name: 'volume_img', maxCount: 1 }], 'volume'), corevolumeControllers.create)
coreRouter.put('/volume/update', uploadMultipleFields([{ name: 'volume_img', maxCount: 1 }], 'volume'), corevolumeControllers.update)


module.exports = coreRouter

