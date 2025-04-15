const pool = require('@/config/db.config');

class AdPolicyControllers {
    static create = async (req, res) => {
        try {
            const { title, content } = req.body;

            const [result] = await pool.query(
                'INSERT INTO adpolicy (title, content) VALUES (?, ?)',
                [title, content]
            );

            res.status(201).json({
                status: true,
                message: 'Ad policy created successfully',
                data: {
                    ad_id: result.insertId,
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating ad policy:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create ad policy',
                error: error.message
            });
        }
    };


    // Get all ad policies
    static findAll = async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM adpolicy');
            res.json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching ad policies:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve ad policies',
                error: error.message
            });
        }
    };

   // update adpolicy
    static update = async (req, res) => {
        try {
            const { title, content } = req.body;
            const adId = req.params.id;

            const [result] = await pool.query(
                'UPDATE adpolicy SET title = ?, content = ? WHERE ad_id = ?',
                [title, content, adId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Ad policy not found'
                });
            }

            res.json({
                status: true,
                message: 'Ad policy updated successfully',
                data: {
                    ad_id: parseInt(adId),
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Error updating ad policy:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update ad policy',
                error: error.message
            });
        }
    };

      // Delete an ad policy
      static remove = async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM adpolicy WHERE ad_id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Ad policy not found'
                });
            }

            res.json({
                status: true,
                message: 'Ad policy deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting ad policy:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete ad policy',
                error: error.message
            });
        }
    };


}

module.exports = AdPolicyControllers