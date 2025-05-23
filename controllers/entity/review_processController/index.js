const pool = require('@/config/db.config');


class PeerReviewContollers {
    /**
     * Create a new review process
     */
    static async create(req, res) {
        try {
            const { title, content } = req.body;

            const [result] = await pool.query(
                'INSERT INTO review_process (title, content) VALUES (?, ?)',
                [title, content]
            );

            res.status(201).json({
                status: true,
                message: 'Review process created successfully',
                data: {
                    prp_id: result.insertId,
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating review process:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create review process',
                error: error.message
            });
        }
    }

    /**
     * Update an existing review process
     */
    static async update(req, res) {
        try {
            const { prp_id } = req.query
            const { title, content } = req.body;

            const [result] = await pool.query(
                'UPDATE review_process SET title = ?, content = ? WHERE prp_id = ?',
                [title, content, prp_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Review process not found'
                });
            }

            res.json({
                status: true,
                message: 'Review process updated successfully',
                data: {
                    prp_id: parseInt(prp_id),
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error updating review process:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update review process',
                error: error.message
            });
        }
    }

    /**
     * Delete a review process
     */
    static async remove(req, res) {
        try {
            const { id } = req.query;

            const [result] = await pool.query(
                'DELETE FROM review_process WHERE prp_id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Review process not found'
                });
            }

            res.json({
                status: true,
                message: 'Review process deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting review process:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete review process',
                error: error.message
            });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.query;

            const [rows] = await pool.query(
                'SELECT * FROM review_process WHERE prp_id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Review process not found'
                });
            }

            res.json({
                status: true,
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching review process:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch review process',
                error: error.message
            });
        }
    }

    static async findAll(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM review_process');

            res.json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching review processes:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch review processes',
                error: error.message
            });
        }
    }
}

module.exports = PeerReviewContollers;