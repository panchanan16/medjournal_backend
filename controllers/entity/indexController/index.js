const pool = require('@/config/db.config');

class IndexControllers {
    static async create(req, res) {
        try {
            const { index_name, link, imgUrl, isDisplay } = req.body;

            const [result] = await pool.query(
                'INSERT INTO index_ing (index_name, link, imgUrl, isDisplay) VALUES (?, ?, ?, ?)',
                [index_name, link, imgUrl, isDisplay ?? true]
            );

            res.status(201).json({
                status: true,
                message: 'Index created successfully',
                data: {
                    ind_id: result.insertId,
                    index_name,
                    link,
                    imgUrl,
                    isDisplay
                }
            });
        } catch (error) {
            console.error('Error creating index:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to create index',
                error: error.message
            });
        }
    };


    // Get all indexes
    static async findAll(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM index_ing');

            res.json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching indexes:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch indexes',
                error: error.message
            });
        }
    };


    // Get all indexes
    static async findOne(req, res) {
        try {
            const { ind_id } = req.query
            const [rows] = await pool.query('SELECT * FROM index_ing WHERE ind_id = ?', [ind_id]);

            res.json({
                status: true,
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching indexes:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to fetch indexes',
                error: error.message
            });
        }
    };

    // UPDATE controllers 

    static async update(req, res) {
        try {
            const { ind_id } = req.query;
            const { index_name, link, imgUrl, isDisplay } = req.body;

            const [result] = await pool.query(
                'UPDATE index_ing SET index_name = ?, link = ?, imgUrl = ?, isDisplay = ? WHERE ind_id = ?',
                [index_name, link, imgUrl, isDisplay, ind_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Index not found'
                });
            }

            res.json({
                status: true,
                message: 'Index updated successfully',
                data: {
                    ind_id: ind_id,
                    index_name,
                    link,
                    imgUrl,
                    isDisplay
                }
            });
        } catch (error) {
            console.error('Error updating index:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to update index',
                error: error.message
            });
        }
    };


    // DELETE controllers 
    static async remove(req, res) {
        try {
            const { id } = req.params;

            const [result] = await pool.query('DELETE FROM index_ing WHERE ind_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Index not found'
                });
            }

            res.json({
                status: true,
                message: 'Index deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting index:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to delete index',
                error: error.message
            });
        }
    };
}

module.exports = IndexControllers