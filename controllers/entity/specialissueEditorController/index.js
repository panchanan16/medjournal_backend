const pool = require('@/config/db.config')

class SpecialIssueEditorControllers {
    // Create a new special author
    static async create(req, res) {
        try {
            const authorsToCreate = Array.isArray(req.body) ? req.body : [req.body];

            const validAuthors = [];
            const errors = [];

            for (const author of authorsToCreate) {
                const {
                    issueId,
                    name,
                    email,
                    orchid_id,
                    afflication,
                    qualification
                } = author;

                // Validate required fields
                if (!issueId || !name || !email) {
                    errors.push({
                        author,
                        message: 'issueId, name, and email are required fields'
                    });
                    continue;
                }

                validAuthors.push([
                    issueId,
                    name,
                    email,
                    orchid_id || null,
                    afflication || null,
                    qualification || null
                ]);
            }

            // If no valid authors, return error
            if (validAuthors.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'No valid special authors to create',
                    errors
                });
            }

            const placeholders = validAuthors.map(() =>
                '(?, ?, ?, ?, ?, ?)'
            ).join(', ');

            // Flatten the validAuthors array for query execution
            const flattenedValues = validAuthors.flat();

            const [result] = await pool.execute(
                `INSERT INTO special_authors (
                    issueId, 
                    name, 
                    email, 
                    orchid_id, 
                    afflication, 
                    qualification
                ) VALUES ${placeholders}`,
                flattenedValues
            );

            // Prepare response data
            const responseData = {
                status: true,
                message: 'Special author(s) created successfully',
                data: {
                    insertedCount: result.affectedRows,
                    insertedIds: [],
                    errors
                }
            };

            // If single insertion, add more detailed response
            if (validAuthors.length === 1) {
                responseData.data.insertedIds.push(result.insertId);
                responseData.data.createdAuthor = {
                    sp_auth_id: result.insertId,
                    ...authorsToCreate[0]
                };
            } else {
                // For multiple insertions, calculate first insert ID
                const firstInsertId = result.insertId;
                responseData.data.insertedIds = validAuthors.map((_, index) =>
                    firstInsertId + index
                );
            }

            return res.status(201).json(responseData);

        } catch (error) {
            console.error('Error creating special author(s):', error);
            return res.status(500).json({
                status: false,
                message: 'Error creating special author(s)',
                error: error.message
            });
        }
    }

    // Get all special authors
    static async findAll(req, res) {
        try {
            const { issueId } = req.query;
            const [rows] = await pool.execute('SELECT * FROM special_authors WHERE issueId = ?', [issueId]);
            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'No Special Issue Editors found!',
                    data: rows
                });
            }
            return res.status(200).json({
                status: true,
                message: 'Special authors retrieved successfully',
                data: rows
            });

        } catch (error) {
            console.error('Error retrieving special authors:', error);
            return res.status(500).json({
                status: false,
                message: 'Error retrieving special authors',
                error: error.message
            });
        }
    }

    // Get a single special author by ID
    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const [rows] = await pool.execute(
                'SELECT * FROM special_authors WHERE sp_auth_id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Special author not found'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Special author retrieved successfully',
                data: rows[0]
            });

        } catch (error) {
            console.error('Error retrieving special author:', error);
            return res.status(500).json({
                status: false,
                message: 'Error retrieving special author',
                error: error.message
            });
        }
    }

    // Update a special author by ID
    static async update(req, res) {
        try {
            // Check if input is an array or a single object
            const authorsToUpdate = Array.isArray(req.body)
                ? req.body
                : [{ ...req.body, id: req.params.id }];

            const updateResults = [];
            const errors = [];

            for (const author of authorsToUpdate) {
                const {
                    id,
                    issueId,
                    name,
                    email,
                    orchid_id,
                    afflication,
                    qualification
                } = author;

                // Validate ID
                if (!id) {
                    errors.push({
                        author,
                        message: 'ID is required for update'
                    });
                    continue;
                }

                // Check if author exists
                const [existingRows] = await pool.execute(
                    'SELECT * FROM special_authors WHERE sp_auth_id = ?',
                    [id]
                );

                if (existingRows.length === 0) {
                    errors.push({
                        author,
                        message: `Special author with ID ${id} not found`
                    });
                    continue;
                }


                const updateFields = [];
                const values = [];

                if (issueId !== undefined) {
                    updateFields.push('issueId = ?');
                    values.push(issueId);
                }

                if (name !== undefined) {
                    updateFields.push('name = ?');
                    values.push(name);
                }

                if (email !== undefined) {
                    updateFields.push('email = ?');
                    values.push(email);
                }

                if (orchid_id !== undefined) {
                    updateFields.push('orchid_id = ?');
                    values.push(orchid_id);
                }

                if (afflication !== undefined) {
                    updateFields.push('afflication = ?');
                    values.push(afflication);
                }

                if (qualification !== undefined) {
                    updateFields.push('qualification = ?');
                    values.push(qualification);
                }

                // If no fields to update
                if (updateFields.length === 0) {
                    errors.push({
                        author,
                        message: 'No fields to update'
                    });
                    continue;
                }

                // Add ID to values array
                values.push(id);

                const [result] = await pool.execute(
                    `UPDATE special_authors SET ${updateFields.join(', ')} WHERE sp_auth_id = ?`,
                    values
                );

                updateResults.push({
                    id,
                    affectedRows: result.affectedRows
                });
            }

            // Prepare response
            const responseData = {
                status: updateResults.length > 0,
                message: updateResults.length > 0
                    ? 'Special author(s) updated successfully'
                    : 'No special authors were updated',
                data: {
                    updateResults,
                    errors
                }
            };

            // Determine appropriate status code
            const statusCode = updateResults.length > 0
                ? (errors.length > 0 ? 206 : 200)
                : 400;

            return res.status(statusCode).json(responseData);

        } catch (error) {
            console.error('Error updating special author(s):', error);
            return res.status(500).json({
                status: false,
                message: 'Error updating special author(s)',
                error: error.message
            });
        }
    }

    // Delete a special author by ID
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const [existingRows] = await pool.execute(
                'SELECT * FROM special_authors WHERE sp_auth_id = ?',
                [id]
            );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Special author not found'
                });
            }

            const [result] = await pool.execute(
                'DELETE FROM special_authors WHERE sp_auth_id = ?',
                [id]
            );

            return res.status(200).json({
                status: true,
                message: 'Special author deleted successfully',
                data: {
                    affectedRows: result.affectedRows
                }
            });

        } catch (error) {
            console.error('Error deleting special author:', error);
            return res.status(500).json({
                status: false,
                message: 'Error deleting special author',
                error: error.message
            });
        }
    }
}

module.exports = SpecialIssueEditorControllers;