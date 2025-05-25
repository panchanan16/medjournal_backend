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
        isInPress,
        isMostRead,
        isNihFunded,
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
        COIformlink,
        citation_apa,
        citation_mla,
        citation_chicago,
        citation_harvard,
        citation_vancouver
      } = req.body;

      const pdf = req.file || req.files && req.filePaths['pdfFile'] ? req.filePaths['pdfFile'][0] : pdflink;
      const xml = req.file || req.files && req.filePaths['xmlFile'] ? req.filePaths['xmlFile'][0] : xmllink;
      const COIform = req.file || req.files && req.filePaths['coiFile'] ? req.filePaths['coiFile'][0] : COIformlink;

      const [result] = await pool.execute(
        `INSERT INTO article_main (
          isInHome, isOpenaccess, isInPress, isMostRead, isNihFunded, issueNo, url, articleType, title, DOI, DOIlink,
          PMID, PMID_Link, abstract, page_from, page_to, keywords, how_to_cite,
          recieve_date, Revised_date, Accepted_date, published_date, available_date,
          Downloads, Views, pdflink, xmllink, COIformlink, citation_apa, citation_mla,
          citation_chicago, citation_harvard, citation_vancouver
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          isInHome,
          isOpenaccess,
          isInPress,
          isMostRead,
          isNihFunded,
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
          pdf,
          xml,
          COIform,
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
        // data: {main: req.body, file: allfiles}
        data: {
          article_id: result.insertId,
          ...req.body,
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

  /*
   * Update an existing article
   */
  static async update(req, res) {
    try {
      const { article_id } = req.query;
      const updateData = req.body;

      // Create dynamic query based on provided fields
      const key = Object.keys(updateData);
      const fields = key.filter(item => item !== "xmlFile" && item !== "pdfFile" && item !== "coiFile" && item !== "isPDF" && item !== "isXml");

      if (fields.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No update data provided'
        });
      }

      const pdf = req.file || req.files && req.filePaths['pdfFile'] ? req.filePaths['pdfFile'][0] : updateData.pdflink;
      const xml = req.file || req.files && req.filePaths['xmlFile'] ? req.filePaths['xmlFile'][0] : updateData.xmllink;
      const COIform = req.file || req.files && req.filePaths['coiFile'] ? req.filePaths['coiFile'][0] : updateData.COIformlink;

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => {
        if (field == 'pdflink') {
          return pdf;
        } else if (field == 'xmllink') {
          return xml;
        } else if (field == 'COIformlink') {
          return COIform;
        } else {
          return updateData[field]
        }

      });

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
          setClause, values, fields
          // article_id: parseInt(article_id),
          // ...updateData
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

  static async getArticlesWithVolumeId(req, res) {
    const { volId } = req.query
    const [vols] = await pool.execute(
      `SELECT vol_issue.*, volume.volume_name, volume.volume_year FROM vol_issue INNER JOIN volume ON volume.volume_id = vol_issue.volume_id WHERE vol_issue.volume_id = ?`, [volId])

    if (vols.length == 0) {
      return res.status(404).json({ status: false, data: null, msg: "No article Found!" })
    }
    const placeholders = vols.map(() => '?').join(',');
    const params = vols.map((el) => el.is_id)
    const query = `SELECT am.articleType, am.issueNo, am.title, am.url, am.pdflink, am.published_date, am.ariticle_id FROM article_main am WHERE issueNo IN (${placeholders})`;
    const [articles] = await pool.execute(
      query, params)
    return res.status(200).json({ status: true, data: { vols, articles } })
  }

}

module.exports = ArticleController;