const pool = require('@/config/db.config');


class SupplementControllers {
    static async create(req, res) {
      try {
        const { title, content } = req.body;
        
        const [result] = await pool.query(
          'INSERT INTO supplement_series (title, content) VALUES (?, ?)',
          [title, content]
        );
        
        res.status(201).json({
          status: true,
          message: 'Supplement series created successfully',
          data: {
            ss_id: result.insertId,
            title,
            content
          }
        });
      } catch (error) {
        console.error('Error creating supplement series:', error);
        res.status(500).json({
          status: false,
          message: 'Failed to create supplement series',
          error: error.message
        });
      }
    }
  
    static async update(req, res) {
      try {
        const { id, title, content } = req.body;
        
        const [result] = await pool.query(
          'UPDATE supplement_series SET title = ?, content = ? WHERE ss_id = ?',
          [title, content, id]
        );
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: false,
            message: 'Supplement series not found'
          });
        }
        
        res.json({
          status: true,
          message: 'Supplement series updated successfully',
          data: {
            ss_id: parseInt(id),
            title,
            content
          }
        });
      } catch (error) {
        console.error('Error updating supplement series:', error);
        res.status(500).json({
          status: false,
          message: 'Failed to update supplement series',
          error: error.message
        });
      }
    }
  
    static async remove(req, res) {
      try {
        const { id } = req.query;
        
        const [result] = await pool.query(
          'DELETE FROM supplement_series WHERE ss_id = ?',
          [id]
        );
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: false,
            message: 'Supplement series not found'
          });
        }
        
        res.json({
          status: true,
          message: 'Supplement series deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting supplement series:', error);
        res.status(500).json({
          status: false,
          message: 'Failed to delete supplement series',
          error: error.message
        });
      }
    }

    static async findOne(req, res) {
      try {
        const { id } = req.query;
        
        const [rows] = await pool.query(
          'SELECT * FROM supplement_series WHERE ss_id = ?',
          [id]
        );
        
        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: 'Supplement series not found'
          });
        }
        
        res.json({
          status: true,
          data: rows[0]
        });
      } catch (error) {
        console.error('Error fetching supplement series:', error);
        res.status(500).json({
          status: false,
          message: 'Failed to fetch supplement series',
          error: error.message
        });
      }
    }
  
    static async findAll(req, res) {
      try {
        const [rows] = await pool.query('SELECT * FROM supplement_series');
        
        res.json({
          status: true,
          data: rows
        });
      } catch (error) {
        console.error('Error fetching supplement series:', error);
        res.status(500).json({
          status: false,
          message: 'Failed to fetch supplement series',
          error: error.message
        });
      }
    }
  }
  
  module.exports = SupplementControllers;