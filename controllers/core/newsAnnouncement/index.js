// combinedController.js
const pool = require('@/config/db.config');

exports.getAllAnnouncementsAndNews = async (req, res) => {
    try {
        const [announcements] = await pool.query('SELECT * FROM announcement');
        const [news] = await pool.query('SELECT * FROM our_news');

        res.status(200).json({
            status: true,
            data: {
                announcements,
                news
            }

        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ status: false, data: null, msg: 'Failed to retrieve data' });
    }
};
