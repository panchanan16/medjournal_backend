const pool = require('@/config/db.config');

class ArticleDetailsController {

  /*
   * Create a new article detail
   */
  static async create(req, res) {
    const { ariticle_id, Article_Heading, article_content } = req.body;

    try {
      // Validate required fields
      if (!ariticle_id) {
        return res.status(400).json({
          status: false,
          message: 'Article ID is required'
        });
      }

      const [result] = await pool.execute(
        'INSERT INTO article_details (ariticle_id, Article_Heading, article_content) VALUES (?, ?, ?)',
        [ariticle_id, Article_Heading, article_content]
      );

      res.status(201).json({
        status: true,
        message: 'Article details created successfully',
        data: {
          ad_id: result.insertId,
          ariticle_id,
          Article_Heading,
          article_content
        }
      });
    } catch (error) {
      console.error('Error creating article details:', error);
      res.status(500).json({
        status: false,
        message: 'Error creating article details',
        error: error.message
      });
    }
  }

  /*
   * Update an existing article detail
   */
  static async update(req, res) {
    const {ad_id, ariticle_id, Article_Heading, article_content } = req.body;
    
    try {
      const updateFields = [];
      const values = [];

      if (ariticle_id !== undefined) {
        updateFields.push('ariticle_id = ?');
        values.push(ariticle_id);
      }
      
      if (Article_Heading !== undefined) {
        updateFields.push('Article_Heading = ?');
        values.push(Article_Heading);
      }
      
      if (article_content !== undefined) {
        updateFields.push('article_content = ?');
        values.push(article_content);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No fields to update'
        });
      }

      values.push(ad_id);
      
      const [result] = await pool.execute(
        `UPDATE article_details SET ${updateFields.join(', ')} WHERE ad_id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article details not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Article details updated successfully',
        data: {
          ad_id,
          ...req.body
        }
      });
    } catch (error) {
      console.error('Error updating article details:', error);
      res.status(500).json({
        status: false,
        message: 'Error updating article details',
        error: error.message
      });
    }
  }

  /*
   * Find all article details
   */
  static async findAll(req, res) {
    
    try {
      const { ariticle_id } = req.query;
      
      let query = 'SELECT * FROM article_details';
      const queryParams = [];
      
      // Add filters if they exist
      if (ariticle_id) {
        query += ' WHERE ariticle_id = ?';
        queryParams.push(ariticle_id);
      }
      
      const [rows] = await pool.execute(query, queryParams);

      res.status(200).json({
        status: true,
        count: rows.length,
        data: rows
      });
    } catch (error) {
      console.error('Error finding all article details:', error);
      res.status(500).json({
        status: false,
        message: 'Error finding all article details',
        error: error.message
      });
    } 
  }
  

}

module.exports = ArticleDetailsController;