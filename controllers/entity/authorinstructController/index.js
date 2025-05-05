const pool = require('@/config/db.config')

class AuthorInstructController {
    /*
     * Create a new author instruction
     */
    static async create(req, res) {
        try {
            const { title, content } = req.body;
            if (!title || !content) {
                return res.status(400).json({
                    status: false,
                    message: "Title and content are required"
                });
            }

            const [result] = await pool.execute(
                'INSERT INTO author_instruction (title, content) VALUES (?, ?)',
                [title, content]
            );

            // Return success response
            return res.status(201).json({
                status: true,
                message: "Author instruction created successfully",
                data: {
                    ai_id: result.insertId,
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating author instruction:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to create author instruction",
                error: error.message
            });
        }
    }

    /*
     * Update an existing author instruction
     */
    static async update(req, res) {
        try {
            const { ai_id } = req.query;
            const { title, content } = req.body;

            // Check if required fields are provided
            if (!title && !content) {
                return res.status(400).json({
                    status: false,
                    message: "At least one field (title or content) is required for update"
                });
            }

            let query = 'UPDATE author_instruction SET ';
            const values = [];

            if (title) {
                query += 'title = ?';
                values.push(title);
            }

            if (content) {
                query += title ? ', content = ?' : 'content = ?';
                values.push(content);
            }

            query += ' WHERE ai_id = ?';
            values.push(ai_id);

            // Execute update query
            const [result] = await pool.execute(query, values);

            // Check if record exists
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: "Author instruction not found"
                });
            }

            // Return success response
            return res.status(200).json({
                status: true,
                message: "Author instruction updated successfully",
                data: {
                    ai_id: parseInt(ai_id),
                    ...(title && { title }),
                    ...(content && { content })
                }
            });
        } catch (error) {
            console.error('Error updating author instruction:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to update author instruction",
                error: error.message
            });
        }
    }

    /*
     * Delete an author instruction
     */
    static async delete(req, res) {
        try {
            const { ai_id } = req.params
            const [result] = await pool.execute(
                'DELETE FROM author_instruction WHERE ai_id = ?',
                [ai_id]
            );

            // Check if record exists
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: "Author instruction not found"
                });
            }

            // Return success response
            return res.status(200).json({
                status: true,
                message: "Author instruction deleted successfully"
            });

        } catch (error) {
            console.error('Error deleting author instruction:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to delete author instruction",
                error: error.message
            });
        }
    }

    /*
     * Find all author instructions
     */
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM author_instruction');
            // Return success response
            return res.status(200).json({
                status: true,
                count: rows.length,
                data: rows
            });

        } catch (error) {
            console.error('Error finding author instructions:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to find author instructions",
                error: error.message
            });
        }
    }
}

module.exports = AuthorInstructController;