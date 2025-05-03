const pool = require('@/config/db.config')


class OnlineFirstController {
    /*
     * Create a new online first entry ---
     */
    static async create(req, res) {
        try {
            const { title, content } = req.body;
            const [result] = await pool.execute(
                'INSERT INTO onlinefirst (title, content) VALUES (?, ?)',
                [title, content]
            );

            return res.status(201).json({
                status: true,
                message: 'Online first entry created successfully',
                data: {
                    of_id: result.insertId,
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating online first entry:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create online first entry',
                error: error.message
            });
        }
    }

    /*
     * Update an existing online first entry
     */
    static async update(req, res) {
        try {
            const { of_id } = req.params;
            const { title, content } = req.body;

            const [rows] = await pool.execute(
                'SELECT * FROM onlinefirst WHERE of_id = ?',
                [of_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Online first entry not found'
                });
            }

            // Execute the update query
            await pool.execute(
                'UPDATE onlinefirst SET title = ?, content = ? WHERE of_id = ?',
                [title, content, of_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Online first entry updated successfully',
                data: {
                    of_id: parseInt(of_id),
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error updating online first entry:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update online first entry',
                error: error.message
            });
        }
    }

    /*
     * Delete an online first entry
     */
    static async remove(req, res) {
        try {
            const { of_id } = req.query;
            const [rows] = await pool.execute(
                'SELECT * FROM onlinefirst WHERE of_id = ?',
                [of_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Online first entry not found'
                });
            }

            // Execute the delete query
            await pool.execute(
                'DELETE FROM onlinefirst WHERE of_id = ?',
                [of_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Online first entry deleted successfully'
            })
        } catch (error) {
            console.error('Error deleting online first entry:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete online first entry',
                error: error.message
            });
        }
    }

    /*
     * Find all online first entries
     */
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM onlinefirst');

            return res.status(200).json({
                status: true,
                count: rows.length,
                data: rows
            });
        } catch (error) {
            console.error('Error finding all online first entries:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to find all online first entries',
                error: error.message
            });
        }
    }
}

module.exports = OnlineFirstController;