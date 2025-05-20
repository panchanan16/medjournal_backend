const pool = require('@/config/db.config');


class VolumeControllers {
    // Create a new volume
    static async create(req, res) {
        try {
            const { volume_name, volume_img, volume_year } = req.body;

            if (!volume_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Volume name is required'
                });
            }

            const [result] = await pool.execute(
                'INSERT INTO volume (volume_name, volume_img, volume_year) VALUES (?, ?, ?)',
                [volume_name, volume_img, volume_year]
            );

            return res.status(201).json({
                status: true,
                message: 'Volume created successfully',
                data: {
                    volume_id: result.insertId,
                    volume_name,
                    volume_img,
                    volume_year
                }
            });
        } catch (error) {
            console.error('Error creating volume:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create volume',
                error: error.message
            });
        }
    }

    // Find all volumes
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM volume');

            return res.status(200).json({
                status: true,
                data: rows
            });
        } catch (error) {
            console.error('Error fetching volumes:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch volumes',
                error: error.message
            });
        }
    }

    // Find one volume by ID
    static async findOne(req, res) {
        try {
            const { volume_id } = req.query;
            const [rows] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [volume_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            return res.status(200).json({
                status: true,
                data: rows[0]
            });
        } catch (error) {
            console.error('Error fetching volume:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch volume',
                error: error.message
            });
        }
    }

    // Update a volume
    static async update(req, res) {
        try {
            const { volume_id, volume_name, volume_img, volume_year } = req.body;

            if (!volume_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Volume name is required'
                });
            }

            // Check if the volume exists
            const [check] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [volume_id]
            );

            if (check.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            const [result] = await pool.execute(
                'UPDATE volume SET volume_name = ?, volume_img = ?, volume_year = ? WHERE volume_id = ?',
                [volume_name, volume_img, volume_year, volume_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Volume updated successfully',
                data: {
                    volume_id: parseInt(volume_id),
                    volume_name,
                    volume_img,
                    volume_year
                }
            });
        } catch (error) {
            console.error('Error updating volume:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update volume',
                error: error.message
            });
        }
    }

    // Delete a volume
    static async remove(req, res) {
        try {
            const { id } = req.query;

            // Check if the volume exists
            const [check] = await pool.execute(
                'SELECT * FROM volume WHERE volume_id = ?',
                [id]
            );

            if (check.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Volume not found'
                });
            }

            await pool.execute(
                'DELETE FROM volume WHERE volume_id = ?',
                [id]
            );

            return res.status(200).json({
                status: true,
                message: 'Volume deleted successfully',
                data: {
                    volume_id: id
                }
            });
        } catch (error) {
            console.error('Error deleting volume:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete volume',
                error: error.message
            });
        }
    }
}

module.exports = VolumeControllers;
