const pool = require('@/config/db.config')

class ReviewGuidelineController {
  /*
   * Create a new review guideline
   */
  static async create(req, res) {
    try {
      const { title, content } = req.body;
      
      if (!title) {
        return res.status(400).json({
          status: false,
          message: "Title is required"
        });
      }
      
      const [result] = await pool.execute(
        'INSERT INTO review_guideline (title, content) VALUES (?, ?)',
        [title, content || null]
      );
      
      res.status(201).json({
        status: true,
        message: "Review guideline created successfully",
        data: {
          rg_id: result.insertId,
          title,
          content
        }
      });
    } catch (error) {
      console.error('Error creating review guideline:', error);
      res.status(500).json({
        status: false,
        message: "Failed to create review guideline",
        error: error.message
      });
    }
  }

  /*
   * Update an existing review guideline
   */
  static async update(req, res) {
    try {
      const { rg_id } = req.query;
      const { title, content } = req.body;
      
      const [rows] = await pool.execute(
        'SELECT * FROM review_guideline WHERE rg_id = ?',
        [rg_id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Review guideline not found"
        });
      }
      
      // Update review guideline
      await pool.execute(
        'UPDATE review_guideline SET title = ?, content = ? WHERE rg_id = ?',
        [title, content, rg_id]
      );
      
      res.status(200).json({
        status: true,
        message: "Review guideline updated successfully",
        data: {
          rg_id: parseInt(rg_id),
          title,
          content
        }
      });
    } catch (error) {
      console.error('Error updating review guideline:', error);
      res.status(500).json({
        status: false,
        message: "Failed to update review guideline",
        error: error.message
      });
    }
  }

  /*
   * Delete a review guideline
   */
  static async delete(req, res) {
    try {
      const { rg_id } = req.params;
      
      const [rows] = await pool.execute(
        'SELECT * FROM review_guideline WHERE rg_id = ?',
        [rg_id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Review guideline not found"
        });
      }

      await pool.execute(
        'DELETE FROM review_guideline WHERE rg_id = ?',
        [rg_id]
      );
      
      res.status(200).json({
        status: true,
        message: "Review guideline deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting review guideline:', error);
      res.status(500).json({
        status: false,
        message: "Failed to delete review guideline",
        error: error.message
      });
    }
  }

  /*
   * Find a single review guideline by ID
   */
  static async findOne(req, res) {
    try {
      const { rg_id } = req.query;
      
      const [rows] = await pool.execute(
        'SELECT * FROM review_guideline WHERE rg_id = ?',
        [rg_id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Review guideline not found"
        });
      }
      
      res.status(200).json({
        status: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error finding review guideline:', error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve review guideline",
        error: error.message
      });
    }
  }

  /*
   * Find all review guidelines
   */
  static async findAll(req, res) {
    try {
      const [rows] = await pool.execute('SELECT * FROM review_guideline');
      
      res.status(200).json({
        status: true,
        data: rows
      });
    } catch (error) {
      console.error('Error finding all review guidelines:', error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve review guidelines",
        error: error.message
      });
    }
  }
}

module.exports = ReviewGuidelineController;