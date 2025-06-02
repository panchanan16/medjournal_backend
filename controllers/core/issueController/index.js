const pool = require('@/config/db.config')

class IssueControllers {
    static async findById(req, res) {
        try {
            const { is_id } = req.query;

            // Check if the volume exists
            const [rows] = await pool.execute(
                'SELECT * FROM vol_issue WHERE is_id = ?',
                [is_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Issue not found'
                });
            }

            return res.status(200).json({
                status: true,
                data: rows[0]
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
}


module.exports = IssueControllers