const pool = require('@/config/db.config');

class NewsControllers {
    // Create a new news article
    static create = async (req, res) => {
        try {
            const { heading, content } = req.body;
            const [result] = await pool.query(
                'INSERT INTO our_news (heading, content) VALUES (?, ?)',
                [heading, content]
            );

            res.status(201).json({
                status: true,
                message: 'News article created successfully',
                data: {
                    news_id: result.insertId,
                    heading,
                    content
                }
            });
        } catch (error) {
            console.error('Error creating news article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create news article',
                error: error.message
            });
        }
    };


    // Get all news articles
    static findAll = async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM our_news');

            res.json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching news:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch news articles',
                error: error.message
            });
        }
    };

    // Get a single news article by ID
    static findOne = async (req, res) => {
        try {
            const { id } = req.query;
            const [rows] = await pool.query('SELECT * FROM our_news WHERE news_id = ?', [id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'News article not found'
                });
            }

            res.json({
                status: true,
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching news article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch news article',
                error: error.message
            });
        }
    };

    // Update a news article
    static update = async (req, res) => {
        try {
            const { id } = req.params;
            const { heading, content } = req.body;

            const [result] = await pool.query(
                'UPDATE our_news SET heading = ?, content = ? WHERE news_id = ?',
                [heading, content, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'News article not found'
                });
            }

            res.json({
                status: true,
                message: 'News article updated successfully',
                data: {
                    news_id: parseInt(id),
                    heading,
                    content
                }
            });
        } catch (error) {
            console.error('Error updating news article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update news article',
                error: error.message
            });
        }
    };

    // Delete a news article
    static remove = async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM our_news WHERE news_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'News article not found'
                });
            }

            res.json({
                status: true,
                message: 'News article deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting news article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete news article',
                error: error.message
            });
        }
    };
}

module.exports = NewsControllers
