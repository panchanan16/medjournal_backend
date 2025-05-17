const pool = require('@/config/db.config')

class MainJournalControllers {
    // Create a new journal
    static async create(req, res) {
        try {
            const {
                journal_name,
                abbreviation_name,
                subjects,
                issn_print,
                issn_online,
                email,
                thumbnail,
                about,
                aim_scope,
                processingCharge,
                cite_score,
                cite_score_link,
                impact_factor,
                impact_factor_link,
                accepted_rate,
                time_first_decision,
                acceptance_to_publication,
                review_time,
                logo_journal
            } = req.body;

            const log_link = req.file || req.files && req.filePaths['logo_img'] ? req.filePaths['logo_img'][0] : logo_journal
            const thumb_link = req.file || req.files && req.filePaths['thumbnail_img'] ? req.filePaths['thumbnail_img'][0] : thumbnail

            const [result] = await pool.execute(
                `INSERT INTO main_journals (
            journal_name, abbreviation_name, subjects, issn_print, issn_online,
            email, thumbnail, about, aim_scope, processingCharge, cite_score,
            cite_score_link, impact_factor, impact_factor_link, accepted_rate,
            time_first_decision, acceptance_to_publication, review_time, logo_journal
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    journal_name,
                    abbreviation_name,
                    subjects,
                    issn_print,
                    issn_online,
                    email,
                    thumb_link,
                    about,
                    aim_scope,
                    processingCharge,
                    cite_score,
                    cite_score_link,
                    impact_factor,
                    impact_factor_link,
                    accepted_rate,
                    time_first_decision,
                    acceptance_to_publication,
                    review_time,
                    log_link
                ]
            );

            return res.status(201).json({
                status: true,
                message: 'Journal created successfully',
                data: {
                    id: result.insertId
                }
            });

        } catch (error) {
            console.error('Error creating journal:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create journal',
                error: error.message
            });
        }
    }

    // Update a journal by ID
    static async update(req, res) {
        try {
            const { mj_id } = req.query;
            const {
                journal_name,
                abbreviation_name,
                subjects,
                issn_print,
                issn_online,
                email,
                thumbnail,
                about,
                aim_scope,
                processingCharge,
                cite_score,
                cite_score_link,
                impact_factor,
                impact_factor_link,
                accepted_rate,
                time_first_decision,
                acceptance_to_publication,
                review_time,
                logo_journal
            } = req.body;

            const log_link = req.file || req.files && req.filePaths['logo_img'] ? req.filePaths['logo_img'][0] : logo_journal
            const thumb_link = req.file || req.files && req.filePaths['thumbnail_img'] ? req.filePaths['thumbnail_img'][0] : thumbnail

            // Build update query dynamically based on provided fields
            let updateFields = [];
            let queryParams = [];

            if (journal_name !== undefined) {
                updateFields.push('journal_name = ?');
                queryParams.push(journal_name);
            }

            if (abbreviation_name !== undefined) {
                updateFields.push('abbreviation_name = ?');
                queryParams.push(abbreviation_name);
            }

            if (subjects !== undefined) {
                updateFields.push('subjects = ?');
                queryParams.push(subjects);
            }

            if (issn_print !== undefined) {
                updateFields.push('issn_print = ?');
                queryParams.push(issn_print);
            }

            if (issn_online !== undefined) {
                updateFields.push('issn_online = ?');
                queryParams.push(issn_online);
            }

            if (email !== undefined) {
                updateFields.push('email = ?');
                queryParams.push(email);
            }

            if (thumbnail !== undefined) {
                updateFields.push('thumbnail = ?');
                queryParams.push(thumb_link);
            }

            if (about !== undefined) {
                updateFields.push('about = ?');
                queryParams.push(about);
            }

            if (aim_scope !== undefined) {
                updateFields.push('aim_scope = ?');
                queryParams.push(aim_scope);
            }

            if (processingCharge !== undefined) {
                updateFields.push('processingCharge = ?');
                queryParams.push(processingCharge);
            }

            if (cite_score !== undefined) {
                updateFields.push('cite_score = ?');
                queryParams.push(cite_score);
            }

            if (cite_score_link !== undefined) {
                updateFields.push('cite_score_link = ?');
                queryParams.push(cite_score_link);
            }

            if (impact_factor !== undefined) {
                updateFields.push('impact_factor = ?');
                queryParams.push(impact_factor);
            }

            if (impact_factor_link !== undefined) {
                updateFields.push('impact_factor_link = ?');
                queryParams.push(impact_factor_link);
            }

            if (accepted_rate !== undefined) {
                updateFields.push('accepted_rate = ?');
                queryParams.push(accepted_rate);
            }

            if (time_first_decision !== undefined) {
                updateFields.push('time_first_decision = ?');
                queryParams.push(time_first_decision);
            }

            if (acceptance_to_publication !== undefined) {
                updateFields.push('acceptance_to_publication = ?');
                queryParams.push(acceptance_to_publication);
            }

            if (review_time !== undefined) {
                updateFields.push('review_time = ?');
                queryParams.push(review_time);
            }

            if (logo_journal !== undefined) {
                updateFields.push('logo_journal = ?');
                queryParams.push(log_link);
            }

            // If no fields to update
            if (updateFields.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'No fields provided for update'
                });
            }

            // Add id to query params
            queryParams.push(mj_id);

            const [result] = await pool.execute(
                `UPDATE main_journals SET ${updateFields.join(', ')} WHERE mj_id = ?`,
                queryParams
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Journal not found'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Journal updated successfully'
            });

        } catch (error) {
            console.error('Error updating journal:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update journal',
                error: error.message
            });
        }
    }

    // Delete a journal by ID
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const [result] = await pool.execute(
                'DELETE FROM main_journals WHERE mj_id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Journal not found'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Journal deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting journal:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete journal',
                error: error.message
            });
        }
    }

    // Find a journal by ID
    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await pool.execute(
                'SELECT * FROM main_journals WHERE mj_id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Journal not found'
                });
            }

            return res.status(200).json({
                status: true,
                data: rows[0]
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

    // Find all journals with optional pagination
    static async findAll(req, res) {
        try {
            // Get paginated results
            const [rows] = await pool.execute(
                'SELECT * FROM main_journals;',
            );

            return res.status(200).json({
                status: true,
                data: rows,
            });

        } catch (error) {
            console.error('Error fetching journals:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch journals',
                error: error.message
            });
        }
    }
}

module.exports = MainJournalControllers;