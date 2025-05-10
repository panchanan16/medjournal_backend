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
        am.abstract,
        am.Downloads,
        am.Views,
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
      abstract: rows[0].abstract,
      authors: [],
      contributions: [
        '(I) Conception and design: All authors',
        '(II) Administrative support: All authors',
        '(III) Provision of study materials or patients: All authors',
        '(IV) Collection and assembly of data: All authors',
        '(V) Data analysis and interpretation: All authors',
        '(VI) Manuscript writing: All authors',
        '(VII) Final approval of manuscript: All authors'
      ],
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
          superscript: (index + 1).toString(),
          corresponding: !!row.author_email, // Author is corresponding if email exists
          email: row.author_email || null
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
      data: articleData
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

/**
 * Get all articles with basic information
 * @param {object} req - Express request object
 * @param {object} res - Express response object
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
