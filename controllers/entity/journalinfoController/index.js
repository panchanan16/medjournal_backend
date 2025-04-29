const pool = require('@/config/db.config');


class JournalInfoController {
  /**
   * Create a new journal
   */
  static async create(req, res) {
    try {
      const {
        journal_name,
        abb_name,
        subjects,
        journal_url,
        issn_print,
        issn_online,
        email,
        thumbnail,
        about,
        aim_scope,
        Porocess_charge,
        cite_score,
        cite_score_link,
        impact_factor,
        impact_factor_link,
        accepted_rate,
        time_first_desicision,
        acceptance_to_publication,
        review_time,
        logo_journal
      } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO journal_info (
          journal_name, abb_name, subjects, journal_url, issn_print,
          issn_online, email, thumbnail, about, aim_scope,
          Porocess_charge, cite_score, cite_score_link, impact_factor,
          impact_factor_link, accepted_rate, time_first_desicision,
          acceptance_to_publication, review_time, logo_journal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          journal_name,
          abb_name,
          subjects,
          journal_url,
          issn_print,
          issn_online,
          email,
          thumbnail,
          about,
          aim_scope,
          Porocess_charge,
          cite_score,
          cite_score_link,
          impact_factor,
          impact_factor_link,
          accepted_rate,
          time_first_desicision,
          acceptance_to_publication,
          review_time,
          logo_journal
        ]
      );
      
      
      res.status(201).json({
        status: true,
        message: 'Journal created successfully',
        data: {
          j_id: result.insertId,
          ...req.body
        }
      });
    } catch (error) {
      console.error('Error creating journal:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to create journal',
        error: error.message
      });
    }
  }

  /**
   * Update an existing journal
   */
  static async update(req, res) {
    try {
      const { j_id } = req.params;
      const updateData = req.body;
      
      // Create dynamic query based on provided fields
      const fields = Object.keys(updateData);
      if (fields.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No update data provided'
        });
      }
      
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updateData[field]);
      
      // Add j_id to values array
      values.push(j_id);    
      
      const [result] = await pool.execute(
        `UPDATE journal_info SET ${setClause} WHERE j_id = ?`,
        [...values]
      );      
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Journal not found'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Journal updated successfully',
        data: {
          j_id: parseInt(j_id),
          ...updateData
        }
      });
    } catch (error) {
      console.error('Error updating journal:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to update journal',
        error: error.message
      });
    }
  }

  /**
   * Delete a journal
   */
  static async delete(req, res) {
    try {
      const { j_id } = req.params;    
      
      const [result] = await pool.execute(
        'DELETE FROM journal_info WHERE j_id = ?',
        [j_id]
      );
      
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Journal not found'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Journal deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting journal:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to delete journal',
        error: error.message
      });
    }
  }

  /**
   * Find a single journal by ID
   */
  static async findOne(req, res) {
    try {
      const { j_id } = req.params;    
      
      const [rows] = await pool.execute(
        'SELECT * FROM journal_info WHERE j_id = ?',
        [j_id]
      );
      
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Journal not found'
        });
      }
      
      res.status(200).json({
        status: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error finding journal:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve journal',
        error: error.message
      });
    }
  }

  /*
   * Find all journals with optional pagination and filtering
   */
  static async findAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'j_id', 
        sortOrder = 'DESC',
        search
      } = req.query;
      
      
      // Calculate offset for pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Build WHERE clause for search
      let whereClause = '';
      const whereParams = [];
      
      if (search) {
        whereClause = `WHERE journal_name LIKE ? OR abb_name LIKE ? OR subjects LIKE ?`;
        const searchTerm = `%${search}%`;
        whereParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      // Get total count for pagination
      const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total FROM journal_info ${whereClause}`,
        whereParams
      );
      
      const totalItems = countRows[0].total;
      const totalPages = Math.ceil(totalItems / parseInt(limit));
      
      // Get paginated data
      const [rows] = await pool.execute(
        `SELECT * FROM journal_info ${whereClause} 
         ORDER BY ${sortBy} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'} 
         LIMIT ? OFFSET ?`,
        [...whereParams, parseInt(limit), offset]
      );
      
      
      res.status(200).json({
        status: true,
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error finding journals:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve journals',
        error: error.message
      });
    }
  }
}

module.exports = JournalInfoController;