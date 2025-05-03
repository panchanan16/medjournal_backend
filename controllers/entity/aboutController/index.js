const pool = require('@/config/db.config');

class AboutController {
  static async create(req, res) {
    try {
      // Validate request
      if (!req.body.title || !req.body.content) {
        return res.status(400).send({
          status: false,
          message: "Title and content are required fields!"
        });
      }

      // Extract data from request
      const { title, content } = req.body;

      // SQL query to insert a new section
      const [result] = await pool.execute(
        'INSERT INTO about_us (title, content) VALUES (?, ?)',
        [title, content]
      );

      res.status(201).send({
        status: true,
        message: "Section was created successfully",
        data: {
          section_id: result.insertId,
          title,
          content
        }
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message || "Some error occurred while creating the section."
      });
    }
  };


  // Get all clients
  static async findAll(req, res) {
    try {
      const [rows] = await pool.execute('SELECT * FROM about_us');

      res.status(200).send({
        status: true,
        message: "Sections retrieved successfully",
        data: rows
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: err.message || "Some error occurred while retrieving sections."
      });
    }
  };

  // findOne Controllers
  static async findOne(req, res) {
    try {
      const section_id = req.query.id;

      const [rows] = await pool.execute(
        'SELECT * FROM about_us WHERE section_id = ?',
        [section_id]
      );

      if (rows.length > 0) {
        res.status(200).send({
          message: "Section retrieved successfully",
          data: rows[0]
        });
      } else {
        res.status(404).send({
          message: `Section with id ${section_id} not found.`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error retrieving section."
      });
    }
  };

  // UPDATE controllers 

  static async update(req, res) {
    try {
      const { section_id } = req.query;

      // Validate request
      if (!req.body.title && !req.body.content) {
        return res.status(400).send({
          message: "At least one field must be provided for update!"
        });
      }

      // Build the SQL query dynamically based on provided fields
      let updateQuery = 'UPDATE about_us SET ';
      let params = [];

      if (req.body.title) {
        updateQuery += 'title = ?, ';
        params.push(req.body.title);
      }

      if (req.body.content) {
        updateQuery += 'content = ?, ';
        params.push(req.body.content);
      }

      // Remove trailing comma and space
      updateQuery = updateQuery.slice(0, -2);

      // Add WHERE clause
      updateQuery += ' WHERE section_id = ?';
      params.push(section_id);

      // Execute the query
      const [result] = await pool.execute(updateQuery, params);

      if (result.affectedRows > 0) {
        // Get the updated section
        const [updatedSection] = await pool.execute(
          'SELECT * FROM about_us WHERE section_id = ?',
          [section_id]
        );

        res.status(200).send({
          status: true,
          message: "Section was updated successfully",
          data: updatedSection[0]
        });
      } else {
        res.status(404).send({
          status: false,
          message: `Section with id ${section_id} not found or no changes were made.`
        });
      }
    } catch (err) {
      res.status(500).send({
        status: false, message: err.message || "Error updating section."
      });
    }
  };

  // DELETE controllers 
  static async remove(req, res) {
    try {
      const section_id = req.query.id;

      const [result] = await pool.execute(
        'DELETE FROM about_us WHERE section_id = ?',
        [section_id]
      );

      if (result.affectedRows > 0) {
        res.status(200).send({
          message: "Section was deleted successfully"
        });
      } else {
        res.status(404).send({
          message: `Section with id ${section_id} not found.`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error deleting section."
      });
    }
  };
}


module.exports = AboutController