const pool = require('@/config/db.config')

class SettingsController {
    static async create(req, res) {
        try {
            const {
                phone,
                whatsapp,
                submissionEmail,
                supportEmail,
                FooterCopyright,
                AboutUs,
                ContactUs,
                PrivacyPolicy,
                TermsCondition,
                Copyright,
                CookiePrefer
            } = req.body;

            const [result] = await pool.execute(
                `INSERT INTO site_settings 
          (phone, whatsapp, submissionEmail, supportEmail, FooterCopyright, 
          AboutUs, ContactUs, PrivacyPolicy, TermsCondition, Copyright, CookiePrefer) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [phone, whatsapp, submissionEmail, supportEmail, FooterCopyright,
                    AboutUs, ContactUs, PrivacyPolicy, TermsCondition, Copyright, CookiePrefer]
            );

            return res.status(201).json({
                status: true,
                message: 'Settings created successfully',
                data: { settings_id: result.insertId }
            });
        } catch (error) {
            console.error('Error creating settings:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to create settings',
                error: error.message
            });
        }
    }

    // Find all settings records
    static async findAll(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM site_settings');

            return res.status(200).json({
                status: true,
                message: 'Settings retrieved successfully',
                data: rows
            });

        } catch (error) {
            console.error('Error retrieving settings:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to retrieve settings',
                error: error.message
            });
        }
    }

    // Find one settings record by ID
    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await pool.execute(
                'SELECT * FROM site_settings WHERE settings_id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Settings not found'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Settings retrieved successfully',
                data: rows[0]
            });

        } catch (error) {
            console.error('Error retrieving settings:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to retrieve settings',
                error: error.message
            });
        }
    }

    // Update a settings record
    static async update(req, res) {
        try {
            const { settings_id } = req.query;
            const {
                phone,
                whatsapp,
                submissionEmail,
                supportEmail,
                FooterCopyright,
                AboutUs,
                ContactUs,
                PrivacyPolicy,
                TermsCondition,
                Copyright,
                CookiePrefer
            } = req.body;

            const [checkResult] = await pool.execute(
                'SELECT * FROM site_settings WHERE settings_id = ?',
                [settings_id]
            );

            if (checkResult.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Settings not found'
                });
            }

            // Update the settings record
            await pool.execute(
                `UPDATE site_settings SET 
          phone = ?, 
          whatsapp = ?, 
          submissionEmail = ?, 
          supportEmail = ?, 
          FooterCopyright = ?, 
          AboutUs = ?, 
          ContactUs = ?, 
          PrivacyPolicy = ?, 
          TermsCondition = ?, 
          Copyright = ?, 
          CookiePrefer = ? 
          WHERE settings_id = ?`,
                [phone, whatsapp, submissionEmail, supportEmail, FooterCopyright,
                    AboutUs, ContactUs, PrivacyPolicy, TermsCondition, Copyright,
                    CookiePrefer, settings_id]
            );

            return res.status(200).json({
                status: true,
                message: 'Settings updated successfully'
            });
        } catch (error) {
            console.error('Error updating settings:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to update settings',
                error: error.message
            });
        }
    }

    // Delete a settings record
    static async delete(req, res) {
        try {
            const { id } = req.params
            try {
                // Check if the settings record exists
                const [checkResult] = await pool.execute(
                    'SELECT * FROM site_settings WHERE settings_id = ?',
                    [id]
                );

                if (checkResult.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Settings not found'
                    });
                }

                // Delete the settings record
                await pool.execute(
                    'DELETE FROM site_settings WHERE settings_id = ?',
                    [id]
                );

                return res.status(200).json({
                    status: true,
                    message: 'Settings deleted successfully'
                });
            } finally {
                pool.release();
            }
        } catch (error) {
            console.error('Error deleting settings:', error);
            return res.status(500).json({
                status: false,
                message: 'Failed to delete settings',
                error: error.message
            });
        }
    }
}

module.exports = SettingsController;