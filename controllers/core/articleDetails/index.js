const pool = require('@/config/db.config')

/*
 * Get article by ID with all related data
 */
exports.getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id;

    if (!articleId) {
      return res.status(400).json({ success: false, message: 'Article ID is required' });
    }

    // Single query that joins all three tables
    const query = `
      SELECT 
        am.ariticle_id as id,
        am.title,
        am.url,
        am.abstract,
        am.keywords,
        am.Downloads,
        am.Views,
        am.pdflink,
        am.xmllink,
        am.COIformlink,
        am.DOIlink,
        am.published_date,
        am.recieve_date,
        am.Accepted_date,
        am.articleType,
        aa.authors_prefix,
        aa.authors_name,
        aa.authors_middlename,
        aa.authors_lastname,
        aa.author_email,
        aa.orchid_id,
        aa.afflication,
        aa.qualification,
        ad.Article_Heading,
        ad.article_content
      FROM 
        article_main am
      LEFT JOIN 
        article_authors aa ON am.ariticle_id = aa.ariticle_id
      LEFT JOIN 
        article_details ad ON am.ariticle_id = ad.ariticle_id
      WHERE 
        am.ariticle_id = ?
      ORDER BY 
        aa.ar_author_id ASC,
        ad.ad_id ASC
    `;

    const [rows] = await pool.query(query, [articleId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Format the data according to the required structure
    const articleData = {
      id: rows[0].id.toString(),
      title: rows[0].title,
      url: rows[0].url,
      abstract: rows[0].abstract,
      pdflink: rows[0].pdflink,
      xmllink: rows[0].xmllink,
      COIformlink: rows[0].COIformlink,
      keywords: rows[0].keywords,
      DOIlink: rows[0].DOIlink,
      published: rows[0].published_date,
      recieved: rows[0].recieve_date,
      accepted: rows[0].Accepted_date,
      type: rows[0].articleType,
      authors: [],
      sections: [],
      metrics: {
        views: rows[0].Views || 0,
        downloads: rows[0].Downloads || 0
      }
    };

    // Process authors (remove duplicates since we're joining tables)
    const processedAuthorEmails = new Set();

    rows.forEach((row, index) => {
      if (row.authors_name && !processedAuthorEmails.has(row.author_email)) {
        // Construct full name with any available components
        let fullName = row.authors_name;
        if (row.authors_middlename) fullName += ' ' + row.authors_middlename;
        if (row.authors_lastname) fullName += ' ' + row.authors_lastname;

        const authorData = {
          name: fullName,
          afflication: row.afflication
        };

        articleData.authors.push(authorData);

        if (row.author_email) {
          processedAuthorEmails.add(row.author_email);
        }
      }
    });

    // Process article sections (remove duplicates)
    const processedSections = new Set();

    rows.forEach(row => {
      if (row.Article_Heading && row.article_content && !processedSections.has(row.Article_Heading)) {
        articleData.sections.push({
          title: row.Article_Heading,
          content: row.article_content
        });

        processedSections.add(row.Article_Heading);
      }
    });

    return res.status(200).json({
      status: true,
      data: articleData,
      // rows
    });
  } catch (error) {
    console.error('Error fetching article data:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/*
 * Get all articles with basic information
 */
exports.getAllArticles = async (req, res) => {
  try {
    const query = `
      SELECT 
        am.ariticle_id as id,
        am.title,
        am.abstract,
        am.Downloads,
        am.Views
      FROM 
        article_main am
      ORDER BY 
        am.ariticle_id DESC
    `;

    const [rows] = await pool.query(query);

    if (!rows || rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    return res.status(200).json({
      success: true,
      data: rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        abstract: row.abstract,
        metrics: {
          views: row.Views || 0,
          downloads: row.Downloads || 0
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getArticleSectionById = async (req, res) => {
  const { ariticle_id } = req.query;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM article_details WHERE ariticle_id = ?',
      [ariticle_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: false, msg: 'Article not found' });
    }

    res.status(200).json({ status: true, data: rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ status: false, msg: 'Internal server error' });
  }
};


exports.getIncreaseArticleViewAndDownloads = async (req, res) => {
  const { article_id, type } = req.query;

  // Validate input
  if (!article_id || !['views', 'downloads'].includes(type.toLowerCase())) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const column = type.toLowerCase() === 'views' ? 'Views' : 'Downloads';

  const query = `
    UPDATE article_main 
    SET ${column} = ${column} + 1 
    WHERE ariticle_id = ?
  `;

  try {
    const [result] = await pool.execute(query, [article_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ status: true, message: `${column} updated successfully.` });
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ status: false, message: "Server error to update views!" });
  }
}

exports.getSummary = async (req, res) => {
  const query = `SELECT 
    COUNT(*) AS total_items,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS total_pending,
    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS total_progress,
    COUNT(CASE WHEN status = 'Accepted' THEN 1 END) AS total_accepted,
    COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS total_rejected
FROM manuscripts;`;

  try {
    const [submission] = await pool.execute(query);

    const [published] = await pool.execute(`SELECT
    COUNT(*) AS total_published 
FROM article_main;`);

    if (!submission || !published) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ status: true, data: { submission: submission[0], published: published[0] } });
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ status: false, message: "Server error to update views!" });
  }
}