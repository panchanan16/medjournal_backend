const pool = require('@/config/db.config')



async function findOne(req, res) {
    try {
        const { mj_id, settings_id } = req.query;
        const [rows] = await pool.query(
            'SELECT mj.journal_name FROM main_journals mj WHERE mj_id = ?; SELECT ss.phone, ss.supportEmail, ss.FooterCopyright FROM site_settings ss WHERE settings_id = ?',
            [mj_id, settings_id]
        );

        return res.status(200).json({
            status: true,
            data: {
                journal: rows[0][0],
                setings: rows[1][0]
            }
        });

    } catch (error) {
        console.error('Error finding journal:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to find journal',
            error: error.message
        });
    }
}

module.exports = { findOne }