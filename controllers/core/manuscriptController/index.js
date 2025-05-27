const pool = require('@/config/db.config')

class ManuscriptControllers {
    // Create a new manuscript
    static async create(req, res) {
        try {
            const {
                manu_type,
                status,
                pay_status,
                user,
                user_name,
                user_number,
                MRN_number,
                email,
                manuscript_title,
                abstract,
                keywords,
                article_file_link,
                acceptance_letter_link,
                invoice_link,
                additional_file_link,
                editorial_comment,
                published_link,
                isReminder,
                submitted_on,
                updated_on
            } = req.body;

            const articleFile = req.file || req.files && req.filePaths['article_file'] ? req.filePaths['article_file'][0] : article_file_link
            const AcceptanceLetter = req.file || req.files && req.filePaths['acceptance_letter'] ? req.filePaths['acceptance_letter'][0] : acceptance_letter_link
            const InvoiceFile = req.file || req.files && req.filePaths['invoice'] ? req.filePaths['invoice'][0] : invoice_link
            const AdditionalFile = req.file || req.files && req.filePaths['additional_file'] ? req.filePaths['additional_file'][0] : additional_file_link

            const [rows] = await pool.execute('SELECT MAX(manu_id) AS maxId FROM manuscripts');
            const lastId = rows[0].maxId || 0;
            const nextId = lastId + 1;
            const MRN = `EZCP-${String(nextId).padStart(6, '0')}`

            const [result] = await pool.query(
                `INSERT INTO manuscripts 
        (manu_type, status, pay_status, user, user_name, user_number, MRN_number, email, manuscript_title, 
        abstract, keywords, article_file, acceptance_letter, invoice, 
        additional_file, editorial_comment, published_link, isReminder, 
        submitted_on, updated_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    manu_type,
                    status,
                    pay_status,
                    user,
                    user_name,
                    user_number,
                    MRN,
                    email,
                    manuscript_title,
                    abstract,
                    keywords,
                    articleFile,
                    AcceptanceLetter,
                    InvoiceFile,
                    AdditionalFile,
                    editorial_comment,
                    published_link,
                    isReminder || 0,
                    submitted_on || new Date(),
                    updated_on || new Date()
                ]
            );

            res.status(201).json({
                status: true,
                message: 'Manuscript created successfully',
                data: {
                    manu_id: result.insertId
                }
            });
        } catch (error) {
            console.error('Error creating manuscript:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create manuscript',
                error: error.message
            });
        }
    }


    static async createByUser(req, res) {
        try {
            const {
                manu_type,
                user,
                user_name,
                user_number,
                email,
                manuscript_title,
                abstract,
                keywords,
                article_file_link,
                submitted_on,
            } = req.body;

            const articleFile = req.file || req.files && req.filePaths['article_file'] ? req.filePaths['article_file'][0] : article_file_link

            const [rows] = await pool.query('SELECT MAX(manu_id) AS maxId FROM manuscripts');
            const lastId = rows[0].maxId || 0;
            const nextId = lastId + 1;
            const MRN = `EZCP-${String(nextId).padStart(6, '0')}`

            console.log(MRN)

            const [result] = await pool.query(
                `INSERT INTO manuscripts 
        (manu_type, status, pay_status, user, user_name, user_number, MRN_number, email, manuscript_title, 
        abstract, keywords, article_file, 
        submitted_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    manu_type,
                    "Pending",
                    "Unpaid",
                    user,
                    user_name,
                    user_number,
                    MRN,
                    email,
                    manuscript_title,
                    abstract,
                    keywords,
                    articleFile,
                    submitted_on || new Date(),
                ]
            );

            res.status(201).json({
                status: true,
                message: 'Manuscript created successfully',
                data: {
                    manu_id: result.insertId
                }
            });
        } catch (error) {
            console.error('Error creating manuscript:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create manuscript',
                error: error.message
            });
        }
    }

    // Find all manuscripts
    static async findAll(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM manuscripts');

            res.status(200).json({
                status: true,
                message: 'Manuscripts retrieved successfully',
                data: rows
            });
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch manuscripts',
                error: error.message
            });
        }
    }


    // Find all manuscripts By user id
    static async findAllByUser(req, res) {
        try {
            const { user } = req.query
            const [rows] = await pool.query('SELECT * FROM manuscripts WHERE user = ?', [user]);

            res.status(200).json({
                status: true,
                message: 'Manuscripts retrieved successfully',
                data: rows
            });
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch manuscripts',
                error: error.message
            });
        }
    }

    // Find one manuscript by ID
    static async findOne(req, res) {
        try {
            const { manu_id } = req.query;
            const [rows] = await pool.query('SELECT * FROM manuscripts WHERE manu_id = ?', [manu_id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Manuscript not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Manuscript retrieved successfully',
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching manuscript:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch manuscript',
                error: error.message
            });
        }
    }

    // Update a manuscript
    static async update(req, res) {
        try {
            const { manu_id } = req.query;
            const {
                manu_type,
                status,
                pay_status,
                user,
                user_name,
                user_number,
                MRN_number,
                email,
                manuscript_title,
                abstract,
                keywords,
                article_file_link,
                acceptance_letter_link,
                invoice_link,
                additional_file_link,
                editorial_comment,
                published_link,
                isReminder,
                submitted_on
            } = req.body;

            const articleFile = req.file || req.files && req.filePaths['article_file'] ? req.filePaths['article_file'][0] : article_file_link
            const AcceptanceLetter = req.file || req.files && req.filePaths['acceptance_letter'] ? req.filePaths['acceptance_letter'][0] : acceptance_letter_link
            const InvoiceFile = req.file || req.files && req.filePaths['invoice'] ? req.filePaths['invoice'][0] : invoice_link
            const AdditionalFile = req.file || req.files && req.filePaths['additional_file'] ? req.filePaths['additional_file'][0] : additional_file_link

            // First check if the manuscript exists
            const [checkResult] = await pool.query('SELECT * FROM manuscripts WHERE manu_id = ?', [manu_id]);

            if (checkResult.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Manuscript not found'
                });
            }

            const updated_on = new Date().toISOString();

            const [result] = await pool.query(
                `UPDATE manuscripts SET
        manu_type = IFNULL(?, manu_type), 
        status = IFNULL(?, status),
        pay_status = IFNULL(?, pay_status),
        user = IFNULL(?, user),
        user_name = IFNULL(?, user_name), 
        user_number = IFNULL(?, user_number),
        MRN_number = IFNULL(?, MRN_number),
        email = IFNULL(?, email),
        manuscript_title = IFNULL(?, manuscript_title),
        abstract = IFNULL(?, abstract),
        keywords = IFNULL(?, keywords),
        article_file = IFNULL(?, article_file),
        acceptance_letter = IFNULL(?, acceptance_letter),
        invoice = IFNULL(?, invoice),
        additional_file = IFNULL(?, additional_file),
        editorial_comment = IFNULL(?, editorial_comment),
        published_link = IFNULL(?, published_link),
        isReminder = IFNULL(?, isReminder),
        submitted_on = IFNULL(?, submitted_on),
        updated_on = ?
        WHERE manu_id = ?`,
                [
                    manu_type,
                    status,
                    pay_status,
                    user,
                    user_name,
                    user_number,
                    MRN_number,
                    email,
                    manuscript_title,
                    abstract,
                    keywords,
                    articleFile,
                    AcceptanceLetter,
                    InvoiceFile,
                    AdditionalFile,
                    editorial_comment,
                    published_link,
                    isReminder || 0,
                    submitted_on,
                    updated_on,
                    manu_id
                ]
            );

            res.status(200).json({
                status: true,
                message: 'Manuscript updated successfully',
                data: {
                    affectedRows: result.affectedRows
                }
            });
        } catch (error) {
            console.error('Error updating manuscript:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update manuscript',
                error: error.message
            });
        }
    }

    // Delete a manuscript
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // First check if the manuscript exists
            const [checkResult] = await pool.query('SELECT * FROM manuscripts WHERE manu_id = ?', [id]);

            if (checkResult.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Manuscript not found'
                });
            }

            const [result] = await pool.query('DELETE FROM manuscripts WHERE manu_id = ?', [id]);

            res.status(200).json({
                status: true,
                message: 'Manuscript deleted successfully',
                data: {
                    affectedRows: result.affectedRows
                }
            });
        } catch (error) {
            console.error('Error deleting manuscript:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete manuscript',
                error: error.message
            });
        }
    }
}

module.exports = ManuscriptControllers;