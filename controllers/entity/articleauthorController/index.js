const pool = require('@/config/db.config')


class ArticleAuthorController {

    /*
     * Create new article author
     */
    static async create(req, res) {
        try {
            const data = req.body;
            if (Array.isArray(data)) {
                const results = [];

                for (const author of data) {
                    const [result] = await pool.query(
                        `INSERT INTO article_authors (
              ariticle_id, authors_prefix, authors_name, authors_middlename, 
              authors_lastname, author_email, orchid_id, afflication, qualification
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            author.ariticle_id,
                            author.authors_prefix || null,
                            author.authors_name,
                            author.authors_middlename || null,
                            author.authors_lastname || null,
                            author.author_email || null,
                            author.orchid_id || null,
                            author.afflication || null,
                            author.qualification || null
                        ]
                    );

                    results.push({
                        ar_author_id: result.insertId,
                        ...author
                    });
                }

                return res.status(201).json({
                    status: true,
                    message: 'Authors created successfully',
                    data: results
                });
            } else {
                const [result] = await pool.query(
                    `INSERT INTO article_authors (
            ariticle_id, authors_prefix, authors_name, authors_middlename, 
            authors_lastname, author_email, orchid_id, afflication, qualification
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.ariticle_id,
                        data.authors_prefix || null,
                        data.authors_name,
                        data.authors_middlename || null,
                        data.authors_lastname || null,
                        data.author_email || null,
                        data.orchid_id || null,
                        data.afflication || null,
                        data.qualification || null
                    ]
                );

                return res.status(201).json({
                    status: true,
                    message: 'Author created successfully',
                    data: {
                        ar_author_id: result.insertId,
                        ...data
                    }
                });
            }
        } catch (error) {
            console.error('Error creating article author(s):', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create article author(s)',
                error: error.message
            });
        }
    }

    /*
     * Update article author(s)
     */
    static async update(req, res) {
        try {
            const data = req.body;

            if (Array.isArray(data)) {
                const results = [];

                for (const author of data) {
                    const [result] = await pool.query(
                        `UPDATE article_authors SET 
                        ariticle_id = ?,
                        authors_prefix = ?,
                        authors_name = ?,
                        authors_middlename = ?,
                        authors_lastname = ?,
                        author_email = ?,
                        orchid_id = ?,
                        afflication = ?,
                        qualification = ?
                        WHERE ar_author_id = ?`,
                        [
                            author.ariticle_id,
                            author.authors_prefix || null,
                            author.authors_name,
                            author.authors_middlename || null,
                            author.authors_lastname || null,
                            author.author_email || null,
                            author.orchid_id || null,
                            author.afflication || null,
                            author.qualification || null,
                            author.ar_author_id
                        ]
                    );

                    if (result.affectedRows > 0) {
                        results.push({
                            ar_author_id: author.ar_author_id,
                            ...author,
                            updated: true
                        });
                    } else {
                        results.push({
                            ar_author_id: author.ar_author_id,
                            updated: false
                        });
                    }
                }

                return res.status(200).json({
                    status: true,
                    message: 'Authors updated successfully',
                    data: results
                });
            } else {
                // Handle single author
                if (!data.ar_author_id) {
                    return res.status(400).json({
                        status: false,
                        message: 'Author ID is required for update'
                    });
                }

                const [result] = await pool.query(
                    `UPDATE article_authors SET 
                    ariticle_id = ?,
                    authors_prefix = ?,
                    authors_name = ?,
                    authors_middlename = ?,
                    authors_lastname = ?,
                    author_email = ?,
                    orchid_id = ?,
                    afflication = ?,
                    qualification = ?
                    WHERE ar_author_id = ?`,
                    [
                        data.ariticle_id,
                        data.authors_prefix || null,
                        data.authors_name,
                        data.authors_middlename || null,
                        data.authors_lastname || null,
                        data.author_email || null,
                        data.orchid_id || null,
                        data.afflication || null,
                        data.qualification || null,
                        data.ar_author_id
                    ]
                );

                if (result.affectedRows > 0) {
                    return res.status(200).json({
                        status: true,
                        message: 'Author updated successfully',
                        data: {
                            ...data,
                            updated: true
                        }
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: 'Author not found or no changes made',
                        data: {
                            ar_author_id: data.ar_author_id,
                            updated: false
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error updating article author(s):', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update article author(s)',
                error: error.message
            });
        }
    }

    /*
     * Delete an article author
     */
    static async remove(req, res) {
        try {
            const { author_id } = req.query;

            if (!author_id) {
                return res.status(400).json({
                    status: false,
                    message: 'Author ID is required for deletion'
                });
            }
            const [result] = await pool.query(
                'DELETE FROM article_authors WHERE ar_author_id = ?',
                [author_id]
            );


            if (result.affectedRows > 0) {
                return res.status(200).json({
                    status: true,
                    message: 'Author deleted successfully',
                    data: {
                        ar_author_id: author_id,
                        deleted: true
                    }
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: 'Author not found',
                    data: {
                        ar_author_id: author_id,
                        deleted: false
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting article author:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete article author',
                error: error.message
            });
        }
    }

    /*
     * Find one article author by ID
     */
    static async findOne(req, res) {
        try {
            const { author_id } = req.query;

            if (!author_id) {
                return res.status(400).json({
                    status: false,
                    message: 'Author ID is required'
                });
            }

            const [rows] = await pool.query(
                'SELECT * FROM article_authors WHERE ar_author_id = ?',
                [author_id]
            );

            if (rows.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: 'Author found',
                    data: rows[0]
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: 'Author not found',
                    data: null
                });
            }
        } catch (error) {
            console.error('Error finding article author:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to find article author',
                error: error.message
            });
        }
    }

    /*
     * Find all article authors, with optional filtering by article ID
     */
    static async findAll(req, res) {
        try {
            const { article_id } = req.query;

            let query = 'SELECT * FROM article_authors';
            let params = [];

            if (article_id) {
                query += ' WHERE ariticle_id = ?';
                params.push(article_id);
            }

            query += ' ORDER BY ar_author_id ASC';

            const [rows] = await pool.query(query, params);

            return res.status(200).json({
                status: true,
                message: 'Authors retrieved successfully',
                count: rows.length,
                data: rows
            });
        } catch (error) {
            console.error('Error finding article authors:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to find article authors',
                error: error.message
            });
        }
    }
}

module.exports = ArticleAuthorController;