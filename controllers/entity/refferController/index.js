const pool = require('@/config/db.config');

class RefferController {
    static async create(req, res) {
        try {
            // Validate request
            if (!req.body.title || !req.body.content) {
                return res.status(400).send({
                    status: false,
                    message: "Title and content are required fields!"
                });
            }

            // Extract data from request
            const { title, content } = req.body;

            // SQL query to insert a new section
            const [result] = await pool.execute(
                'INSERT INTO reffer_style (title, content) VALUES (?, ?)',
                [title, content]
            );

            res.status(201).send({
                status: true,
                message: "Refer style created successfully",
                data: {
                    ref_id: result.insertId,
                    title,
                    content
                }
            });
        } catch (err) {
            res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while creating the section."
            });
        }
    };


    // Get all clients
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM reffer_style');

            res.status(200).send({
                status: true,
                message: "Refer style retrieved successfully",
                data: rows
            });
        } catch (err) {
            res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while retrieving."
            });
        }
    };

    // findOne Controllers
    static async findOne(req, res) {
        try {
            const { ref_id } = req.query;

            const [rows] = await pool.execute(
                'SELECT * FROM reffer_style WHERE ref_id = ?',
                [ref_id]
            );

            if (rows.length > 0) {
                res.status(200).send({
                    message: "Refer style retrieved successfully",
                    data: rows[0]
                });
            } else {
                res.status(404).send({
                    message: `Process with id ${ref_id} not found.`
                });
            }
        } catch (err) {
            res.status(500).send({
                message: err.message || "Error retrieving section."
            });
        }
    };

    // UPDATE controllers 

    static async update(req, res) {
        try {
            const { ref_id } = req.query;

            // Validate request
            if (!req.body.title && !req.body.content) {
                return res.status(400).send({
                    message: "At least one field must be provided for update!"
                });
            }

            // Build the SQL query dynamically based on provided fields
            let updateQuery = 'UPDATE reffer_style SET ';
            let params = [];

            if (req.body.title) {
                updateQuery += 'title = ?, ';
                params.push(req.body.title);
            }

            if (req.body.content) {
                updateQuery += 'content = ?, ';
                params.push(req.body.content);
            }

            // Remove trailing comma and space
            updateQuery = updateQuery.slice(0, -2);

            // Add WHERE clause
            updateQuery += ' WHERE ref_id = ?';
            params.push(ref_id);

            // Execute the query
            const [result] = await pool.execute(updateQuery, params);

            if (result.affectedRows > 0) {
                // Get the updated section
                const [updatedSection] = await pool.execute(
                    'SELECT * FROM reffer_style WHERE ref_id = ?',
                    [ref_id]
                );

                res.status(200).send({
                    status: true,
                    message: "Refer style was updated successfully",
                    data: updatedSection[0]
                });
            } else {
                res.status(404).send({
                    status: false,
                    message: `Refer style with id ${ref_id} not found or no changes were made.`
                });
            }
        } catch (err) {
            res.status(500).send({
                status: false, message: err.message || "Error updating section."
            });
        }
    };

    // DELETE controllers 
    static async remove(req, res) {
        try {
            const { ref_id } = req.query;

            const [result] = await pool.execute(
                'DELETE FROM reffer_style WHERE ref_id = ?',
                [ref_id]
            );

            if (result.affectedRows > 0) {
                res.status(200).send({
                    message: "Section was deleted successfully"
                });
            } else {
                res.status(404).send({
                    message: `Section with id ${ref_id} not found.`
                });
            }
        } catch (err) {
            res.status(500).send({
                message: err.message || "Error deleting section."
            });
        }
    };
}


module.exports = RefferController