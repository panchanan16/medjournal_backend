const pool = require('@/config/db.config');

class ArticleController {
  /*
   * Create a new article
   */
  static async create(req, res) {
    try {
      const {
        isInHome,
        isOpenaccess,
        issueNo,
        url,
        articleType,
        title,
        DOI,
        DOIlink,
        PMID,
        PMID_Link,
        abstract,
        page_from,
        page_to,
        keywords,
        how_to_cite,
        recieve_date,
        Revised_date,
        Accepted_date,
        published_date,
        available_date,
        Downloads,
        Views,
        pdflink,
        xmllink,
        citation_apa,
        citation_mla,
        citation_chicago,
        citation_harvard,
        citation_vancouver
      } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO article_main (
          isInHome, isOpenaccess, issueNo, url, articleType, title, DOI, DOIlink,
          PMID, PMID_Link, abstract, page_from, page_to, keywords, how_to_cite,
          recieve_date, Revised_date, Accepted_date, published_date, available_date,
          Downloads, Views, pdflink, xmllink, citation_apa, citation_mla,
          citation_chicago, citation_harvard, citation_vancouver
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          isInHome,
          isOpenaccess,
          issueNo,
          url,
          articleType,
          title,
          DOI,
          DOIlink,
          PMID,
          PMID_Link,
          abstract,
          page_from,
          page_to,
          keywords,
          how_to_cite,
          recieve_date,
          Revised_date,
          Accepted_date,
          published_date,
          available_date,
          Downloads || 0,
          Views || 0,
          pdflink,
          xmllink,
          citation_apa,
          citation_mla,
          citation_chicago,
          citation_harvard,
          citation_vancouver
        ]
      );
      
      
      res.status(201).json({
        status: true,
        message: 'Article created successfully',
        data: {
          article_id: result.insertId,
          ...req.body
        }
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to create article',
        error: error.message
      });
    }
  }

  /**
   * Update an existing article
   */
  static async update(req, res) {
    try {
      const { article_id } = req.query;
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
      
      // Add article_id to values array
      values.push(article_id);
      
      const [result] = await pool.execute(
        `UPDATE article_main SET ${setClause} WHERE ariticle_id = ?`,
        [...values]
      );    
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article not found'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Article updated successfully',
        data: {
          article_id: parseInt(article_id),
          ...updateData
        }
      });
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to update article',
        error: error.message
      });
    }
  }

  /**
   * Delete an article
   */
  static async delete(req, res) {
    try {
      const { article_id } = req.query;
      
      const [result] = await pool.execute(
        'DELETE FROM article_main WHERE ariticle_id = ?',
        [article_id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article not found'
        });
      }
      
      res.status(200).json({
        status: true,
        message: 'Article deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to delete article',
        error: error.message
      });
    }
  }

  /**
   * Find a single article by ID

   */
  static async findOne(req, res) {
    try {
      const { article_id } = req.query;
      console.log(article_id)
      const [rows] = await pool.execute(
        'SELECT * FROM article_main WHERE ariticle_id = ?',
        [article_id]
      );
      
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Article not found'
        });
      }
      
      res.status(200).json({
        status: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error finding article:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve article',
        error: error.message
      });
    }
  }

  /**
   * Find all articles with optional pagination and filtering
   */
  static async findAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'ariticle_id', 
        sortOrder = 'DESC',
        articleType,
        isInHome,
        isOpenaccess
      } = req.query;

      
      // Calculate offset for pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Build WHERE clause based on provided filters
      let whereClause = '';
      const whereParams = [];
      
      if (articleType) {
        whereClause += 'articleType = ? ';
        whereParams.push(articleType);
      }
      
      if (isInHome !== undefined) {
        whereClause += whereClause ? 'AND isInHome = ? ' : 'isInHome = ? ';
        whereParams.push(isInHome);
      }
      
      if (isOpenaccess !== undefined) {
        whereClause += whereClause ? 'AND isOpenaccess = ? ' : 'isOpenaccess = ? ';
        whereParams.push(isOpenaccess);
      }
      
      // Add WHERE to SQL if we have conditions
      const whereSQL = whereClause ? `WHERE ${whereClause}` : '';

      
      // Get total count for pagination
      const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total FROM article_main ${whereSQL}`,
        whereParams
      );

      
      const totalItems = countRows[0].total;
      const totalPages = Math.ceil(totalItems / parseInt(limit));

      console.log([...whereParams, parseInt(limit), offset])
      
      // Get paginated data
      const [rows] = await pool.execute(
        `SELECT * FROM article_main ${whereSQL} ORDER BY ${sortBy} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'} LIMIT ${parseInt(limit)} OFFSET ${offset};`,
        [...whereParams]
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
      console.error('Error finding articles:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve articles',
        error: error.message
      });
    }
  }
}

module.exports = ArticleController;