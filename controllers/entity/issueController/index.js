const pool = require('@/config/db.config');

class IssueControllers {
    // Create a new issue
    static async create(req, res) {
        try {
            const { volume_id, issue_name } = req.body;

            if (!volume_id || !issue_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Volume ID and issue name are required'
                });
            }

            // Check if the volume exists
            const [volumeCheck] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [volume_id]
            );

            if (volumeCheck.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            const [result] = await pool.execute(
                'INSERT INTO vol_issue (volume_id, issue_name) VALUES (?, ?)',
                [volume_id, issue_name]
            );


            return res.status(201).json({
                status: true,
                message: 'Issue created successfully',
                data: {
                    is_id: result.insertId,
                    volume_id,
                    issue_name
                }
            });
        } catch (error) {
            console.error('Error creating issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create issue',
                error: error.message
            });
        }
    }

    // Find all issues
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute(`
        SELECT i.*, v.volume_name 
        FROM vol_issue i
        JOIN volume v ON i.volume_id = v.volume_id
      `);

            return res.status(200).json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching issues:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch issues',
                error: error.message
            });
        }
    }

    // Update an issue
    static async update(req, res) {
        try {
            const { is_id } = req.query
            const { volume_id, issue_name } = req.body;

            if (!volume_id || !issue_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Volume ID and issue name are required'
                });
            }

            // Check if the issue exists
            const [issueCheck] = await pool.execute(
                'SELECT * FROM vol_issue WHERE is_id = ?',
                [is_id]
            );

            if (issueCheck.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Issue not found'
                });
            }

            // Check if the volume exists
            const [volumeCheck] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [volume_id]
            );

            if (volumeCheck.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            const [result] = await pool.execute(
                'UPDATE vol_issue SET volume_id = ?, issue_name = ? WHERE is_id = ?',
                [volume_id, issue_name, is_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Issue updated successfully',
                data: {
                    is_id: parseInt(is_id),
                    volume_id,
                    issue_name
                }
            });
        } catch (error) {
            console.error('Error updating issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update issue',
                error: error.message
            });
        }
    }

    // Delete an issue
    static async remove(req, res) {
        try {
            const { id } = req.query;

            // Check if the issue exists
            const [check] = await pool.execute(
                'SELECT * FROM vol_issue WHERE is_id = ?',
                [id]
            );

            if (check.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Issue not found'
                });
            }

            await pool.execute(
                'DELETE FROM vol_issue WHERE is_id = ?',
                [id]
            );

            return res.status(200).json({
                status: true,
                message: 'Issue deleted successfully',
                data: {
                    is_id: id
                }
            });
        } catch (error) {
            console.error('Error deleting issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete issue',
                error: error.message
            });
        }
    }

    // Find all issues by volume ID
    static async findOne(req, res) {
        try {
            const { volumeId } = req.query;

            // Check if the volume exists
            const [volumeCheck] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [volumeId]
            );

            if (volumeCheck.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            const [rows] = await pool.execute(
                'SELECT * FROM vol_issue WHERE volume_id = ?',
                [volumeId]
            );

            return res.status(200).json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching issues by volume:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch issues',
                error: error.message
            });
        }
    }

}

module.exports = IssueControllers;