const pool = require('@/config/db.config'); // Assuming you have a database connection pool set up

/*
 * Get special issue details with related articles and authors
 */
exports.getSpecialIssueDetails = async (req, res) => {
  try {
    const { sp_issue_id } = req.query;
    
    if (!sp_issue_id) {
      return res.status(400).json({
        success: false,
        message: 'Special issue ID is required'
      });
    }

    // First, get the special issue details
    const [specialIssueResults] = await pool.query(
      `SELECT * FROM special_issues WHERE sp_issue_id = ?`,
      [sp_issue_id]
    );

    if (specialIssueResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Special issue not found'
      });
    }

    const specialIssue = specialIssueResults[0];
    const issueId = specialIssue.issueId;

    // Get all articles related to this issue
    const [articlesResults] = await pool.query(
      `SELECT am.ariticle_id, am.articleType, am.title, am.abstract FROM article_main am WHERE issueNo = ?`,
      [issueId]
    );

    // Get all authors related to this issue
    const [authorsResults] = await pool.query(
      `SELECT * FROM special_authors WHERE issueId = ?`,
      [issueId]
    );

    // Format the response
    const response = {
      status: true,
      data: {
          ...specialIssue,
          articles: articlesResults || [],
          authors: authorsResults || []
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in getSpecialIssueDetails:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
