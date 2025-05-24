const pool = require('@/config/db.config');
const { generateAPAJournalCitation } = require('@/utils/generateApa');
const { generateChicagoJournalCitation } = require('@/utils/generateChicago');
const { generateMLAJournalCitation } = require('@/utils/generateMla');

class CitationControllers {

    static async generateCitation(req, res) {
        try {
            const { ariticle_id } = req.query;
            const [rows] = await pool.execute(
                'SELECT * FROM article_main WHERE ariticle_id = ?',
                [ariticle_id]
            );

            console.log(rows)

            const [authorsRow] = await pool.execute(
                'SELECT * FROM article_authors WHERE ariticle_id = ?',
                [ariticle_id]
            );

            console.log(authorsRow)


            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Article not found'
                });
            }

            if (authorsRow.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Authors Must be there for Citation!'
                });
            }

            const APA = generateAPAJournalCitation({ authors: authorsRow, year: 2025, title: rows[0].title, journal: 'farmclin', volume: 2, issue: rows[0].issueNo, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const MLA = generateMLAJournalCitation({ authors: authorsRow, year: 2025, title: rows[0].title, journal: 'farmclin', volume: 2, issue: rows[0].issueNo, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const chicago = generateChicagoJournalCitation({ authors: authorsRow, year: 2025, title: rows[0].title, journal: 'farmclin', volume: 2, issue: rows[0].issueNo, pages: `${rows[0].page_from}-${rows[0].page_to}` })

            const [result] = await pool.execute(
                `UPDATE article_main
                SET citation_apa = ?, 
                    citation_mla = ?, 
                    citation_chicago = ?, 
                    citation_harvard = ?, 
                    citation_vancouver = ?
                WHERE ariticle_id = ?;`,
                [
                    APA,
                    MLA,
                    chicago,
                    "harvard",
                    "vancouver",
                    ariticle_id
                ]
            );


            return res.status(200).json({
                status: true,
                data: { MLA, APA, chicago },
                message: 'Citation generated Successfully!'
            });
        } catch (error) {
            console.error('Error finding article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve article',
                error: error.message
            });
        }
    }



}

module.exports = CitationControllers;