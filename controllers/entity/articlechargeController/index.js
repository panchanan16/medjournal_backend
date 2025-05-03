const pool = require('@/config/db.config');

class ArticleChargeController {
  /*
   * Create a new article charge entry
   */
  static async create(req, res) {
    const { title, content } = req.body;

    try {
      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({
          status: false,
          message: 'Title and content are required fields'
        });
      }

      const [result] = await pool.execute(
        'INSERT INTO article_charges (title, content) VALUES (?, ?)',
        [title, content]
      );

      return res.status(201).json({
        status: true,
        message: 'Article charge created successfully',
        data: {
          ac_id: result.insertId,
          title,
          content
        }
      });
    } catch (error) {
      console.error('Error creating article charge:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create article charge',
        error: error.message
      });
    }
  }

  /*
   * Update an existing article charge
   */
  static async update(req, res) {
    const { ac_id } = req.query
    const { title, content } = req.body;

    try {
      // Check if article charge exists
      const [articles] = await pool.execute('SELECT * FROM article_charges WHERE ac_id = ?', [ac_id]);

      if (articles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article charge not found'
        });
      }

      // Build the update fields dynamically based on what's provided
      const updateFields = [];
      const values = [];

      if (title) {
        updateFields.push('title = ?');
        values.push(title);
      }

      if (content) {
        updateFields.push('content = ?');
        values.push(content);
      }

      // Add ac_id to the values array
      values.push(ac_id);

      // If nothing to update
      if (updateFields.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No fields to update'
        });
      }

      const [result] = await pool.execute(
        `UPDATE article_charges SET ${updateFields.join(', ')} WHERE ac_id = ?`,
        values
      );

      if (result.affectedRows > 0) {
        // Get the updated record
        const [updatedArticle] = await pool.execute('SELECT * FROM article_charges WHERE ac_id = ?', [ac_id]);

        return res.status(200).json({
          status: true,
          message: 'Article charge updated successfully',
          data: updatedArticle[0]
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Failed to update article charge'
        });
      }
    } catch (error) {
      console.error('Error updating article charge:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to update article charge',
        error: error.message
      });
    }
  }

  /*
   * Delete an article charge
   */
  static async remove(req, res) {
    const { ac_id } = req.query;

    try {
      // Check if article charge exists
      const [articles] = await pool.execute('SELECT * FROM article_charges WHERE ac_id = ?', [ac_id]);

      if (articles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article charge not found'
        });
      }

      const [result] = await pool.execute('DELETE FROM article_charges WHERE ac_id = ?', [ac_id]);

      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: true,
          message: 'Article charge deleted successfully'
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Failed to delete article charge'
        });
      }
    } catch (error) {
      console.error('Error deleting article charge:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete article charge',
        error: error.message
      });
    }
  }

  /*
   * Find a single article charge by ID
   */
  static async findOne(req, res) {
    const { ac_id } = req.query;

    try {
      const [articles] = await pool.execute('SELECT * FROM article_charges WHERE ac_id = ?', [ac_id]);

      if (articles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article charge not found'
        });
      }

      return res.status(200).json({
        status: true,
        data: articles[0]
      });
    } catch (error) {
      console.error('Error finding article charge:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to find article charge',
        error: error.message
      });
    }
  }

  /*
   * Find all article charges with optional search
   */
  static async findAll(req, res) {
    try {
      let query = 'SELECT * FROM article_charges';

      // Execute the query
      const [articles] = await pool.execute(query);

      return res.status(200).json({
        status: true,
        count: articles.length,
        data: articles
      });
    } catch (error) {
      console.error('Error finding article charges:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to retrieve article charges',
        error: error.message
      });
    }
  }
}

module.exports = ArticleChargeController;