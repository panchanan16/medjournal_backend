class FileControllers {
    static async uploadFileFromTextEditor(req, res) {
        const filepath = req.file || req.files && req.filePaths['otherfile'] ? req.filePaths['otherfile'][0] : ""
        res.status(200).json({ location: filepath })
    }
}


module.exports = FileControllers;