const pool = require('@/config/db.config')


class BlogControllers {

    // Create a new blog
    static async create(req, res) {
        try {
            const { blog_title, blog_thumbnail_link, blog_details, posted_on } = req.body;

            const blogThumbnail = req.file || req.files && req.filePaths['blog_thumbnail'] ? req.filePaths['blog_thumbnail'][0] : blog_thumbnail_link

            const [result] = await pool.execute(
                'INSERT INTO featuredblogs (blog_title, blog_thumbnail, blog_details, posted_on) VALUES (?, ?, ?, ?)',
                [blog_title, blogThumbnail, blog_details, posted_on]
            );

            res.status(201).json({
                status: true,
                message: 'Blog created successfully',
                data: {
                    blog_id: result.insertId,
                    blog_title,
                    blogThumbnail,
                    blog_details,
                    posted_on
                }
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error creating blog',
                error: error.message
            });
        }
    }

    // Update a blog
    static async update(req, res) {
        try {
            const { blog_id } = req.query;
            const { blog_title, blog_thumbnail_link, blog_details, posted_on } = req.body;

                const blogThumbnail = req.file || req.files && req.filePaths['blog_thumbnail'] ? req.filePaths['blog_thumbnail'][0] : blog_thumbnail_link

            const [result] = await pool.execute(
                'UPDATE featuredblogs SET blog_title = ?, blog_thumbnail = ?, blog_details = ?, posted_on = ? WHERE blog_id = ?',
                [blog_title, blogThumbnail, blog_details, posted_on, blog_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Blog not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Blog updated successfully',
                data: {
                    blog_id: blog_id,
                    blog_title,
                    blog_thumbnail_link,
                    blog_details,
                    posted_on
                }
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error updating blog',
                error: error.message
            });
        }
    }

    // Delete a blog
    static async delete(req, res) {
        try {
            const { blog_id } = req.query;

            const [result] = await pool.execute(
                'DELETE FROM featuredblogs WHERE blog_id = ?',
                [blog_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Blog not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Blog deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error deleting blog',
                error: error.message
            });
        }
    }

    // Find one blog by blog_id
    static async findOne(req, res) {
        try {
            const { blog_id } = req.query;

            const [rows] = await pool.execute(
                'SELECT * FROM featuredblogs WHERE blog_id = ?',
                [blog_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Blog not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Blog found successfully',
                data: rows[0]
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error finding blog',
                error: error.message
            });
        }
    }

    // Find all blogs
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM featuredblogs ORDER BY blog_id DESC');

            res.status(200).json({
                status: true,
                message: 'Blogs retrieved successfully',
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error retrieving blogs',
                error: error.message
            });
        }
    }
}

module.exports = BlogControllers;