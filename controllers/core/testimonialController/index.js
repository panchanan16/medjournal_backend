const pool = require('@/config/db.config')

class TestimonialControllers {
  
  // Create a new testimonial
  static async create(req, res) {
    try {
      const { user_name, designation, university, user_img, user_comment, posted_on } = req.body;
      
      const [result] = await pool.execute(
        'INSERT INTO testimonials (user_name, designation, university, user_img, user_comment, posted_on) VALUES (?, ?, ?, ?, ?, ?)',
        [user_name, designation, university, user_img, user_comment, posted_on]
      );
      
      res.json({
        status: true,
        message: 'Testimonial created successfully',
        data: {
          test_id: result.insertId,
          user_name,
          designation,
          university,
          user_img,
          user_comment,
          posted_on
        }
      });
    } catch (error) {
      res.json({
        status: false,
        message: 'Error creating testimonial',
        error: error.message
      });
    }
  }
  
  // Update an existing testimonial
  static async update(req, res) {
    try {
      const { test_id } = req.params;
      const { user_name, designation, university, user_img, user_comment, posted_on } = req.body;
      
      const [result] = await pool.execute(
        'UPDATE testimonials SET user_name = ?, designation = ?, university = ?, user_img = ?, user_comment = ?, posted_on = ? WHERE test_id = ?',
        [user_name, designation, university, user_img, user_comment, posted_on, test_id]
      );
      
      if (result.affectedRows === 0) {
        return res.json({
          status: false,
          message: 'Testimonial not found'
        });
      }
      
      res.json({
        status: true,
        message: 'Testimonial updated successfully',
        data: {
          test_id: parseInt(test_id),
          user_name,
          designation,
          university,
          user_img,
          user_comment,
          posted_on
        }
      });
    } catch (error) {
      res.json({
        status: false,
        message: 'Error updating testimonial',
        error: error.message
      });
    }
  }
  
  // Delete a testimonial
  static async delete(req, res) {
    try {
      const { test_id } = req.params;
      
      const [result] = await pool.execute(
        'DELETE FROM testimonials WHERE test_id = ?',
        [test_id]
      );
      
      if (result.affectedRows === 0) {
        return res.json({
          status: false,
          message: 'Testimonial not found'
        });
      }
      
      res.json({
        status: true,
        message: 'Testimonial deleted successfully',
        data: {
          test_id: parseInt(test_id)
        }
      });
    } catch (error) {
      res.json({
        status: false,
        message: 'Error deleting testimonial',
        error: error.message
      });
    }
  }
  
  // Find one testimonial by ID
  static async findOne(req, res) {
    try {
      const { test_id } = req.params;
      
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials WHERE test_id = ?',
        [test_id]
      );
      
      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'Testimonial not found'
        });
      }
      
      res.json({
        status: true,
        message: 'Testimonial retrieved successfully',
        data: rows[0]
      });
    } catch (error) {
      res.json({
        status: false,
        message: 'Error retrieving testimonial',
        error: error.message
      });
    }
  }
  
  // Find all testimonials
  static async findAll(req, res) {
    try {
      const [rows] = await pool.execute('SELECT * FROM testimonials ORDER BY test_id DESC');
      
      res.json({
        status: true,
        message: 'Testimonials retrieved successfully',
        data: rows,
        count: rows.length
      });
    } catch (error) {
      res.json({
        status: false,
        message: 'Error retrieving testimonials',
        error: error.message
      });
    }
  }
}

module.exports = TestimonialControllers;