const pool = require('@/config/db.config')

class SpecialIssueController {
    // Create a new special issue
    static async create(req, res) {
        try {
            const {
                issueId,
                isSpecial,
                isPublished,
                publish_date,
                submission_deadline,
                issueCoverImgUrl,
                special_issue_title,
                special_issue_about
            } = req.body;

            // Validate required fields
            if (!issueId || !special_issue_title) {
                return res.status(400).json({
                    status: false,
                    message: 'issueId and special issue title are required fields'
                });
            }

            const [result] = await pool.execute(
                `INSERT INTO special_issues (
                        issueId, 
                        isSpecial, 
                        isPublished, 
                        publish_date, 
                        submission_deadline, 
                        issueCoverImgUrl, 
                        special_issue_title, 
                        special_issue_about
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    issueId,
                    isSpecial || false,
                    isPublished || false,
                    publish_date || null,
                    submission_deadline || null,
                    issueCoverImgUrl || null,
                    special_issue_title,
                    special_issue_about || null
                ]
            );

            return res.status(201).json({
                status: true,
                message: 'Special issue created successfully',
                data: {
                    sp_issue_id: result.insertId,
                    ...req.body
                }
            });

        } catch (error) {
            console.error('Error creating special issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Error creating special issue',
                error: error.message
            });
        }
    }

    // Get all special issues
    static async findAll(req, res) {
        try {
            const { isPublished } = req.query
            const [rows] = await pool.execute(`SELECT * FROM special_issues WHERE isPublished = ?`, [isPublished]);

            return res.status(200).json({
                status: true,
                message: 'Special issues retrieved successfully',
                data: rows
            });

        } catch (error) {
            console.error('Error retrieving special issues:', error);
            return res.status(500).json({
                status: false,
                message: 'Error retrieving special issues',
                error: error.message
            });
        }
    }

    // Get a single special issue by ID
    static async findOne(req, res) {
        try {
            const { issueId } = req.query;
            const [rows] = await pool.execute(
                'SELECT * FROM special_issues WHERE issueId = ?',
                [issueId]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Special issue not found'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Special issue retrieved successfully',
                data: rows[0]
            });

        } catch (error) {
            console.error('Error retrieving special issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Error retrieving special issue',
                error: error.message
            });
        }
    }

    // Update a special issue by sp_issue_id
    static async update(req, res) {
        try {
            const { sp_issue_id } = req.query;
            console.log(req.body)
            const {
                issueId,
                isSpecial,
                isPublished,
                publish_date,
                submission_deadline,
                issueCoverImgUrl,
                special_issue_title,
                special_issue_about
            } = req.body;


            const [existingRows] = await pool.execute(
                'SELECT * FROM special_issues WHERE sp_issue_id = ?',
                [sp_issue_id]
            );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Special issue not found'
                });
            }

            // Build the update query dynamically
            const updateFields = [];
            const values = [];

            if (issueId !== undefined) {
                updateFields.push('issueId = ?');
                values.push(issueId);
            }

            if (isSpecial !== undefined) {
                updateFields.push('isSpecial = ?');
                values.push(isSpecial);
            }

            if (isPublished !== undefined) {
                updateFields.push('isPublished = ?');
                values.push(isPublished);
            }

            if (publish_date !== undefined) {
                updateFields.push('publish_date = ?');
                values.push(publish_date);
            }

            if (submission_deadline !== undefined) {
                updateFields.push('submission_deadline = ?');
                values.push(submission_deadline);
            }

            if (issueCoverImgUrl !== undefined) {
                updateFields.push('issueCoverImgUrl = ?');
                values.push(issueCoverImgUrl);
            }

            if (special_issue_title !== undefined) {
                updateFields.push('special_issue_title = ?');
                values.push(special_issue_title);
            }

            if (special_issue_about !== undefined) {
                updateFields.push('special_issue_about = ?');
                values.push(special_issue_about);
            }

            // If no fields to update
            if (updateFields.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'No fields to update'
                });
            }

            // Add sp_issue_id to values array
            values.push(sp_issue_id);

            const [result] = await pool.execute(
                `UPDATE special_issues SET ${updateFields.join(', ')} WHERE sp_issue_id = ?`,
                values
            );

            return res.status(200).json({
                status: true,
                message: 'Special issue updated successfully',
                data: {
                    affectedRows: result.affectedRows
                }
            });

        } catch (error) {
            console.error('Error updating special issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Error updating special issue',
                error: error.message
            });
        }
    }

    // Delete a special issue by sp_issue_id
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const [existingRows] = await pool.execute(
                'SELECT * FROM special_issues WHERE sp_issue_id = ?',
                [id]
            );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Special issue not found'
                });
            }

            const [result] = await pool.execute(
                'DELETE FROM special_issues WHERE sp_issue_id = ?',
                [id]
            );

            return res.status(200).json({
                status: true,
                message: 'Special issue deleted successfully',
                data: {
                    affectedRows: result.affectedRows
                }
            });

        } catch (error) {
            console.error('Error deleting special issue:', error);
            return res.status(500).json({
                status: false,
                message: 'Error deleting special issue',
                error: error.message
            });
        }
    }
}

module.exports = SpecialIssueController;