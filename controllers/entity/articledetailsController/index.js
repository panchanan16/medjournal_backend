const pool = require('@/config/db.config')

class ArticleDetailsController {
  /*
   * Create a new article detail record
   */
  static async create(req, res) {
    try {
      const { section } = req.body;

      // Input validation
      if (!section || !Array.isArray(section) || section.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'Section array is required with at least one article detail'
        });
      }

      const connection = await pool.getConnection();

      try {
        // Begin transaction for bulk insert
        await connection.beginTransaction();

        const results = [];

        // Process each article detail in the section array
        for (const article of section) {
          const { ariticle_id, Article_Heading, article_content } = article;

          if (!ariticle_id) {
            await connection.rollback();
            return res.status(400).json({
              status: false,
              message: 'Article ID is required for all entries'
            });
          }

          const [result] = await connection.execute(
            'INSERT INTO article_details (ariticle_id, Article_Heading, article_content) VALUES (?, ?, ?)',
            [ariticle_id, Article_Heading, article_content]
          );

          results.push({
            ad_id: result.insertId,
            ariticle_id,
            Article_Heading,
            article_content
          });
        }

        // Commit the transaction
        await connection.commit();

        return res.status(201).json({
          status: true,
          message: 'Article details created successfully',
          data: results
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating article details:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create article details',
        error: error.message
      });
    }
  }

  /*
   * Update an existing article detail record
   */
  static async update(req, res) {
    const ariticleId = req.query.ariticle_id;
    const incomingDetails = req.body.section; 

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Step 1: Get existing ad_ids from DB
      const [existing] = await connection.execute(
        'SELECT ad_id FROM article_details WHERE ariticle_id = ?',
        [ariticleId]
      );
      const existingIds = existing.map(row => row.ad_id.toString());

      const incomingIds = incomingDetails
        .filter(d => d.ad_id)
        .map(d => d.ad_id.toString());

      // Step 2: Delete removed entries
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (toDelete.length > 0) {
        await connection.execute(
          `DELETE FROM article_details WHERE ad_id IN (${toDelete.map(() => '?').join(',')})`,
          toDelete
        );
      }

      // Step 3: Update existing entries
      for (const detail of incomingDetails) {
        if (detail.ad_id && existingIds.includes(detail.ad_id.toString())) {
          await connection.execute(
            `UPDATE article_details SET Article_Heading = ?, article_content = ? WHERE ad_id = ?`,
            [detail.Article_Heading, detail.article_content, detail.ad_id]
          );
        }
      }

      // Step 4: Insert new entries
      for (const detail of incomingDetails) {
        if (!detail.ad_id) {
          await connection.execute(
            `INSERT INTO article_details (ariticle_id, Article_Heading, article_content) VALUES (?, ?, ?)`,
            [ariticleId, detail.Article_Heading, detail.article_content]
          );
        }
      }

      await connection.commit();

      res.status(200).json({
        status: true,
        message: 'Article details updated successfully.',
      });

    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Error updating article details.',
        error: error.message,
      });
    } finally {
      await connection.end();
    }
  }

  /*
   * Delete an article detail record
   */
  static async delete(req, res) {
    try {
      const { section } = req.body;

      // If single ID is provided in params
      if (req.params.ad_id) {
        const { ad_id } = req.params;
        const connection = await pool.getConnection();

        try {
          const [result] = await connection.execute(
            'DELETE FROM article_details WHERE ad_id = ?',
            [ad_id]
          );

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status: false,
              message: 'Article details not found'
            });
          }

          return res.status(200).json({
            status: true,
            message: 'Article details deleted successfully'
          });
        } finally {
          connection.release();
        }
      }

      // If array of IDs is provided in body
      if (!section || !Array.isArray(section) || section.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'Section array is required with at least one article detail ID to delete'
        });
      }

      const connection = await pool.getConnection();

      try {
        // Begin transaction for bulk delete
        await connection.beginTransaction();

        const results = [];
        let hasErrors = false;

        // Process each article detail ID in the section array
        for (const article of section) {
          const { ad_id } = article;

          if (!ad_id) {
            hasErrors = true;
            results.push({
              status: false,
              message: 'Article details ID is required',
              article
            });
            continue;
          }

          try {
            const [result] = await connection.execute(
              'DELETE FROM article_details WHERE ad_id = ?',
              [ad_id]
            );

            if (result.affectedRows === 0) {
              hasErrors = true;
              results.push({
                status: false,
                message: 'Article details not found',
                ad_id
              });
            } else {
              results.push({
                status: true,
                message: 'Deleted successfully',
                ad_id
              });
            }
          } catch (err) {
            hasErrors = true;
            results.push({
              status: false,
              message: `Error deleting article detail with ID ${ad_id}`,
              error: err.message
            });
          }
        }

        // Commit the transaction if no errors occurred
        if (hasErrors) {
          await connection.rollback();
        } else {
          await connection.commit();
        }

        return res.status(hasErrors ? 400 : 200).json({
          status: !hasErrors,
          message: hasErrors ? 'Some deletions failed' : 'All article details deleted successfully',
          results
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error deleting article details:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete article details',
        error: error.message
      });
    }
  }

  /*
   * Find a single article detail record by ID
   */
  static async findOne(req, res) {
    try {
      const { ad_id } = req.query;

      if (!ad_id) {
        return res.status(400).json({
          status: false,
          message: 'Article details ID is required'
        });
      }

      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.execute(
          'SELECT * FROM article_details WHERE ad_id = ?',
          [ad_id]
        );

        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: 'Article details not found'
          });
        }

        return res.status(200).json({
          status: true,
          data: rows[0]
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error finding article details:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to find article details',
        error: error.message
      });
    }
  }

  /**
   * Get all article detail records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async findAll(req, res) {
    try {
      const connection = await pool.getConnection();

      try {
        const [rows] = await connection.execute('SELECT * FROM article_details');

        return res.status(200).json({
          status: true,
          count: rows.length,
          data: rows
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error fetching all article details:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to fetch article details',
        error: error.message
      });
    }
  }
}


module.exports = ArticleDetailsController