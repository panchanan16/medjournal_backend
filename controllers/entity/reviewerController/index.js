const pool = require('@/config/db.config')

class ReviewerController {
  // Create a new reviewer
  static async create(req, res) {
    try {
      const { rev_id, month, year, name, country, university, biography } = req.body;
      
      if (!rev_id) {
        return res.status(400).json({
          status: false,
          message: 'Review ID is required'
        });
      }
      
      // Check if the referenced review exists
      const [reviewExists] = await pool.query('SELECT * FROM review_main WHERE revlist_id = ?', [rev_id]);
      
      if (reviewExists.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Referenced review does not exist'
        });
      }
      
      const [result] = await pool.query(
        'INSERT INTO reviewer_list (rev_id, month, year, name, country, university, biography) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rev_id, month, year, name, country, university, biography]
      );
      
      return res.status(201).json({
        status: true,
        message: 'Reviewer created successfully',
        data: {
          r_id: result.insertId,
          rev_id,
          month,
          year,
          name,
          country,
          university,
          biography
        }
      });
    } catch (error) {
      console.error('Error creating reviewer:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create reviewer',
        error: error.message
      });
    }
  }

  // Update an existing reviewer
  static async update(req, res) {
    try {
      const { r_id } = req.params;
      const { rev_id, month, year, name, country, university, biography } = req.body;
      
      // Check if reviewer exists
      const [reviewerExists] = await pool.query('SELECT * FROM reviewer_list WHERE r_id = ?', [r_id]);
      
      if (reviewerExists.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Reviewer not found'
        });
      }
      
      // Check if the referenced review exists
      if (rev_id) {
        const [reviewExists] = await pool.query('SELECT * FROM review_main WHERE revlist_id = ?', [rev_id]);
        
        if (reviewExists.length === 0) {
          return res.status(404).json({
            status: false,
            message: 'Referenced review does not exist'
          });
        }
      }
      
      await pool.query(
        'UPDATE reviewer_list SET rev_id = ?, month = ?, year = ?, name = ?, country = ?, university = ?, biography = ? WHERE r_id = ?',
        [rev_id, month, year, name, country, university, biography, r_id]
      );
      
      return res.status(200).json({
        status: true,
        message: 'Reviewer updated successfully',
        data: {
          r_id: parseInt(r_id),
          rev_id,
          month,
          year,
          name,
          country,
          university,
          biography
        }
      });
    } catch (error) {
      console.error('Error updating reviewer:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to update reviewer',
        error: error.message
      });
    }
  }

  // Delete a reviewer
  static async remove(req, res) {
    try {
      const { r_id } = req.params;
      
      // Check if reviewer exists
      const [rows] = await pool.query('SELECT * FROM reviewer_list WHERE r_id = ?', [r_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Reviewer not found'
        });
      }
      
      await pool.query('DELETE FROM reviewer_list WHERE r_id = ?', [r_id]);
      
      return res.status(200).json({
        status: true,
        message: 'Reviewer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting reviewer:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete reviewer',
        error: error.message
      });
    }
  }

  // Get a single reviewer
  static async findOne(req, res) {
    try {
      const { r_id } = req.query;
      
      const [rows] = await pool.query('SELECT * FROM reviewer_list WHERE r_id = ?', [r_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Reviewer not found'
        });
      }
      
      return res.status(200).json({
        status: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error fetching reviewer:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to fetch reviewer',
        error: error.message
      });
    }
  }

  
  // Find reviewers by review ID
  static async findAll(req, res) {
    try {
      const { rev_id } = req.query;
      
      const [rows] = await pool.query('SELECT * FROM reviewer_list WHERE rev_id = ?', [rev_id]);
      
      return res.status(200).json({
        status: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching reviewers by review ID:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to fetch reviewers by review ID',
        error: error.message
      });
    }
  }
}

module.exports = ReviewerController;