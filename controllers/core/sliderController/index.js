const pool = require('@/config/db.config')

class SliderControllers {
  static async create(req, res) {
    const { slide_title, slider_desc, slider_link, slider_img_link } = req.body;

            const sliderImg = req.file || req.files && req.filePaths['slider_img'] ? req.filePaths['slider_img'][0] : slider_img_link

    try {
      const [result] = await pool.execute(
        `INSERT INTO sliders (slide_title, slider_desc, slider_link, slider_img) VALUES (?, ?, ?, ?)`,
        [slide_title, slider_desc, slider_link, sliderImg]
      );

      res.json({ status: true, message: 'Slider created Successfully!', id: result.insertId });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }

  static async update(req, res) {
    const { slider_id } = req.query;
    const { slide_title, slider_desc, slider_link, slider_img_link } = req.body;

     const sliderImg = req.file || req.files && req.filePaths['slider_img'] ? req.filePaths['slider_img'][0] : slider_img_link

    try {

      const [result] = await pool.execute(
        `UPDATE sliders SET slide_title = ?, slider_desc = ?, slider_link = ?, slider_img = ? WHERE slider_id = ?`,
        [slide_title, slider_desc, slider_link, sliderImg, slider_id]
      );

      res.json({ status: true, message: 'Slider updated Succssfully!' });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }

  static async delete(req, res) {
    const { slider_id } = req.query;

    try {
      const [result] = await pool.execute(
        `DELETE FROM sliders WHERE slider_id = ?`,
        [slider_id]
      );

      res.json({ status: true, message: 'Slider deleted Successfully!' });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }

  static async findOne(req, res) {
    const { slider_id } = req.query;

    try {
      const [rows] = await pool.execute(
        `SELECT * FROM sliders WHERE slider_id = ?`,
        [slider_id]
      );

      if (rows.length > 0) {
        res.json({ status: true, data: rows[0] });
      } else {
        res.json({ status: false, message: 'Slider not found' });
      }
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const [rows] = await pool.execute(`SELECT * FROM sliders`);
      res.json({ status: true, data: rows });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }
}

module.exports = SliderControllers;
