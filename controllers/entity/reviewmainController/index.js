const pool = require('@/config/db.config')

class ReviewMainController {
  // Create a new review
  static async create(req, res) {
    try {
      const { title, content, postedOn } = req.body;
      
      if (!title) {
        return res.status(400).json({
          status: false,
          message: 'Title is required'
        });
      }
      
      const [result] = await pool.query(
        'INSERT INTO review_main (title, content, postedOn) VALUES (?, ?, ?)',
        [title, content, postedOn]
      );
      
      return res.status(201).json({
        status: true,
        message: 'Review created successfully',
        data: {
          revlist_id: result.insertId,
          title,
          content,
          postedOn
        }
      });
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create review',
        error: error.message
      });
    }
  }

  // Update an existing review
  static async update(req, res) {
    try {
      const { revlist_id } = req.params;
      const { title, content, postedOn } = req.body;
      
      // Check if review exists
      const [rows] = await pool.query('SELECT * FROM review_main WHERE revlist_id = ?', [revlist_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Review not found'
        });
      }
      
      await pool.query(
        'UPDATE review_main SET title = ?, content = ?, postedOn = ? WHERE revlist_id = ?',
        [title, content, postedOn, revlist_id]
      );
      
      return res.status(200).json({
        status: true,
        message: 'Review updated successfully',
        data: {
          revlist_id: parseInt(revlist_id),
          title,
          content,
          postedOn
        }
      });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to update review',
        error: error.message
      });
    }
  }

  // Delete a review
  static async delete(req, res) {
    try {
      const { revlist_id } = req.params;
      
      // Check if review exists
      const [rows] = await pool.query('SELECT * FROM review_main WHERE revlist_id = ?', [revlist_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Review not found'
        });
      }
      
      await pool.query('DELETE FROM review_main WHERE revlist_id = ?', [revlist_id]);
      
      return res.status(200).json({
        status: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete review',
        error: error.message
      });
    }
  }

  // Get a single review
  static async findOne(req, res) {
    try {
      const { revlist_id } = req.query;
      
      const [rows] = await pool.query('SELECT * FROM review_main WHERE revlist_id = ?', [revlist_id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Review not found'
        });
      }
      
      return res.status(200).json({
        status: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error fetching review:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to fetch review',
        error: error.message
      });
    }
  }

  // Get all reviews
  static async findAll(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM review_main');
      
      return res.status(200).json({
        status: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to fetch reviews',
        error: error.message
      });
    }
  }
}

module.exports = ReviewMainController;