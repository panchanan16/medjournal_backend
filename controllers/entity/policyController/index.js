const pool = require('@/config/db.config');

class PolicyController {
  // Create a new policy
  static async create(req, res) {
    try {
      const { name, content, redirectLink } = req.body;
      const pageUrl = name.split(' ').map((el) => el.charAt(0).toLowerCase() + el.slice(1)).join('-')

      const [result] = await pool.execute(
        'INSERT INTO policy (name, content, pageUrl, redirectLink) VALUES (?, ?, ?, ?)',
        [name, content, pageUrl, redirectLink]
      );

      if (result.affectedRows > 0) {
        return res.status(201).json({
          status: true,
          message: 'Policy created successfully',
          data: { pol_id: result.insertId, name, content, pageUrl, redirectLink }
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Failed to create policy'
        });
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update an existing policy
  static async update(req, res) {
    try {
      const { pol_id } = req.query;
      const { name, content, pageUrl, redirectLink } = req.body;

      const [result] = await pool.execute(
        'UPDATE policy SET name = ?, content = ?, pageUrl = ?, redirectLink = ? WHERE pol_id = ?',
        [name, content, pageUrl, redirectLink, pol_id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: true,
          message: 'Policy updated successfully'
        });
      } else {
        return res.status(404).json({
          status: false,
          message: 'Policy not found'
        });
      }
    } catch (error) {
      console.error('Error updating policy:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete a policy
  static async remove(req, res) {
    try {
      const { pol_id } = req.params;

      const [result] = await pool.execute(
        'DELETE FROM policy WHERE pol_id = ?',
        [pol_id]
      );


      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: true,
          message: 'Policy deleted successfully'
        });
      } else {
        return res.status(404).json({
          status: false,
          message: 'Policy not found'
        });
      }
    } catch (error) {
      console.error('Error deleting policy:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Find one policy by ID
  static async findOne(req, res) {
    try {
      const { pol_id, pageUrl } = req.query;

      let whereClause = ""
      let whereParams = []

      if (pol_id) {
        whereClause = "pol_id = ?"
        whereParams.push(pol_id)
      }

      if (pageUrl) {
        whereClause = "pageUrl = ?"
        whereParams.push(pageUrl)
      }

      const [rows] = await pool.execute(
        `SELECT * FROM policy WHERE ${whereClause};`,
        whereParams
      );

      if (rows.length > 0) {
        return res.status(200).json({
          status: true,
          data: rows[0]
        });
      } else {
        return res.status(404).json({
          status: false,
          message: 'Policy not found'
        });
      }
    } catch (error) {
      console.error('Error finding policy:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Find all policies
  static async findAll(req, res) {
    try {
      const [rows] = await pool.execute('SELECT pol_id, name, pageUrl, redirectLink FROM policy');

      return res.status(200).json({
        status: true,
        count: rows.length,
        data: rows
      });
    } catch (error) {
      console.error('Error finding policies:', error);
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = PolicyController;