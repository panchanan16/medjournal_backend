const pool = require('@/config/db.config');
const fs = require('fs');

class EditorBoardController {
  /*
   * Delete an editor board member
   */
  static async remove(req, res) {
    const { editor_id } = req.query;

    try {
      // Check if editor exists and get the image link
      const [editors] = await pool.execute('SELECT * FROM editor_board WHERE editor_id = ?', [editor_id]);

      if (editors.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Editor board member not found'
        });
      }

      // Delete associated image file if it exists
      const imgLink = editors[0].imgLink;
      if (imgLink && fs.existsSync(imgLink.substring(1))) {
        fs.unlinkSync(imgLink.substring(1));
      }

      const [result] = await pool.execute('DELETE FROM editor_board WHERE editor_id = ?', [editor_id]);

      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: true,
          message: 'Editor board member deleted successfully'
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Failed to delete editor board member'
        });
      }
    } catch (error) {
      console.error('Error deleting editor board member:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete editor board member',
        error: error.message
      });
    }
  }

  /*
   * Find a single editor board member by ID
   */
  static async findOne(req, res) {
    const { editor_id } = req.query;

    try {
      const [editors] = await pool.execute('SELECT * FROM editor_board WHERE editor_id = ?', [editor_id]);

      if (editors.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Editor board member not found'
        });
      }

      return res.status(200).json({
        status: true,
        data: editors[0]
      });
    } catch (error) {
      console.error('Error finding editor board member:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to find editor board member',
        error: error.message
      });
    }
  }

  /*
   * Find all editor board members with optional filtering
   */
  static async findAll(req, res) {
    try {
      // Get query parameters for filtering
      const { editor_type } = req.query;

      let query = 'SELECT * FROM editor_board';
      const queryParams = [];

      // Add filters if provided
      if (editor_type) {
        query += ' WHERE editor_type = ?';
        queryParams.push(editor_type);
      }

      // Execute the query
      const [editors] = await pool.execute(query, queryParams);

      return res.status(200).json({
        status: true,
        count: editors.length,
        data: editors
      });
    } catch (error) {
      console.error('Error finding editor board members:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to retrieve editor board members',
        error: error.message
      });
    }
  }

}

module.exports = EditorBoardController;