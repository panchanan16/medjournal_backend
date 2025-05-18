const pool = require('@/config/db.config');
const fs = require('fs')

class EditorBoardController {
  /*
   * Create a new editor board member
   */
  static async create(req, res) {
    const { editor_type, name, qualification, designation, institution, editorImg, biography } = req.body;

    try {
      if (!editor_type || !name) {
        return res.status(400).json({
          status: false,
          message: 'Editor type and name are required fields'
        });
      }

      // Get image link from uploaded file if it exists
      const imgLink = req.file ? req.filePath : editorImg;

      const [result] = await pool.execute(
        'INSERT INTO editor_board (editor_type, name, qualification, designation, institution, biography, imgLink) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [editor_type, name, qualification, designation, institution, biography, imgLink]
      );

      return res.status(201).json({
        status: true,
        message: 'Editor board member created successfully',
        data: {
          editor_id: result.insertId,
          editor_type,
          name,
          qualification,
          designation,
          institution,
          biography,
          imgLink
        }
      });
    } catch (error) {
      console.error('Error creating editor board member:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create editor board member',
        error: error.message
      });
    }
  }

  /*
   * Update an existing editor board member
   */
  static async update(req, res) {
    const { editor_id } = req.query
    const { editor_type, name, qualification, designation, editorImg, institution, biography } = req.body;

    try {
      // Check if editor exists
      const [editors] = await pool.execute('SELECT * FROM editor_board WHERE editor_id = ?', [editor_id]);

      if (editors.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Editor board member not found'
        });
      }

      // Build the update fields dynamically based on what's provided
      const updateFields = [];
      const values = [];

      if (editor_type) {
        updateFields.push('editor_type = ?');
        values.push(editor_type);
      }

      if (name) {
        updateFields.push('name = ?');
        values.push(name);
      }

      if (qualification !== undefined) {
        updateFields.push('qualification = ?');
        values.push(qualification);
      }

      if (designation !== undefined) {
        updateFields.push('designation = ?');
        values.push(designation);
      }

      if (institution !== undefined) {
        updateFields.push('institution = ?');
        values.push(institution);
      }

      if (biography !== undefined) {
        updateFields.push('biography = ?');
        values.push(biography);
      }

      // If there's a file uploaded, add the imgLink field

      let imgLink = ''
      if (req.file) {
        imgLink = req.filePath;
        updateFields.push('imgLink = ?');
        values.push(imgLink);

        // If there was a previous image, you might want to delete it
        const oldImgLink = editors[0].imgLink;
        if (oldImgLink && fs.existsSync(oldImgLink.substring(1))) {
          fs.unlinkSync(oldImgLink.substring(1));
        }
      } else {
        imgLink = editorImg
      }

      // Add editor_id to the values array
      values.push(editor_id);

      // If nothing to update
      if (updateFields.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No fields to update'
        });
      }

      const [result] = await pool.execute(
        `UPDATE editor_board SET ${updateFields.join(', ')} WHERE editor_id = ?`,
        values
      );

      if (result.affectedRows > 0) {
        // Get the updated record
        const [updatedEditor] = await pool.execute('SELECT * FROM editor_board WHERE editor_id = ?', [editor_id]);

        return res.status(200).json({
          status: true,
          message: 'Editor board member updated successfully',
          data: updatedEditor[0]
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Failed to update editor board member'
        });
      }
    } catch (error) {
      console.error('Error updating editor board member:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to update editor board member',
        error: error.message
      });
    }
  }

}

module.exports = EditorBoardController;