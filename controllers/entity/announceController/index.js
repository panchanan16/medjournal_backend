const pool = require('@/config/db.config');


class AnnouncementControllers {
    // create announcement
    static create = async (req, res) => {
        try {
            const { heading, content } = req.body;

            // Execute query
            const [result] = await pool.execute(
                'INSERT INTO announcement (heading, content) VALUES (?, ?)',
                [heading, content]
            );

            res.status(201).json({
                status: true,
                message: 'Announcement created successfully',
                data: {
                    id: result.insertId,
                    heading,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating announcement:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create announcement',
                error: error.message
            });
        }
    };


    // GET annopuncement 
    static findAll = async (req, res) => {
        try {
            // Execute query
            const [rows] = await pool.execute('SELECT * FROM announcement');

            res.status(200).json({
                status: true,
                message: 'Announcements retrieved successfully',
                data: rows
            });
        } catch (error) {
            console.error('Error fetching announcements:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve announcements',
                error: error.message
            });
        }
    };


    // Get a single announcement by ID
    static findOne = async (req, res) => {
        try {
            const { id } = req.query;

            // Execute query
            const [rows] = await pool.execute(
                'SELECT * FROM announcement WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Announcement not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Announcement retrieved successfully',
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching announcement:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve announcement',
                error: error.message
            });
        }
    };

    // Update an announcement
    static update = async (req, res) => {
        try {
            const { id, heading, content } = req.body;

            // Execute query
            const [result] = await pool.execute(
                'UPDATE announcement SET heading = ?, content = ? WHERE id = ?',
                [heading, content, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Announcement not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Announcement updated successfully',
                data: {
                    id: parseInt(id),
                    heading,
                    content
                }
            });
        } catch (error) {
            console.error('Error updating announcement:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update announcement',
                error: error.message
            });
        }
    };


    // Delete an announcement
    remove = async (req, res) => {
        try {
            const { id } = req.query;
            // Execute query
            const [result] = await pool.execute(
                'DELETE FROM announcement WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Announcement not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Announcement deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting announcement:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete announcement',
                error: error.message
            });
        }
    };


}

module.exports = AnnouncementControllers