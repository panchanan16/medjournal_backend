const pool = require('@/config/db.config');


class CoreVolumeControllers {
    // Create a new volume
    static async create(req, res) {
        try {
            const { volume_name, volume_img_link, volume_year } = req.body;

            const VolumeImgFile = req.file || req.files && req.filePaths['volume_img'] ? req.filePaths['volume_img'][0] : volume_img_link

            if (!volume_name) {
                return res.status(400).json({
                    status: false,
                    message: 'Volume name is required'
                });
            }

            const [result] = await pool.execute(
                'INSERT INTO volume (volume_name, volume_img, volume_year) VALUES (?, ?, ?)',
                [volume_name, VolumeImgFile, volume_year]
            );

            return res.status(201).json({
                status: true,
                message: 'Volume created successfully',
                data: {
                    volume_id: result.insertId,
                    volume_name,
                    VolumeImgFile,
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

    // Update a volume
    static async update(req, res) {
        try {
            const { volume_id } = req.query
            const { volume_name, volume_img_link, volume_year } = req.body;

            const VolumeImgFile = req.file || req.files && req.filePaths['volume_img'] ? req.filePaths['volume_img'][0] : volume_img_link

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
                [volume_name, VolumeImgFile, volume_year, volume_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Volume updated successfully',
                data: {
                    volume_id: parseInt(volume_id),
                    volume_name,
                    VolumeImgFile,
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
}

module.exports = CoreVolumeControllers;