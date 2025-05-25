const pool = require('@/config/db.config');
const { generateAPAJournalCitation } = require('@/utils/generateApa');
const { generateChicagoJournalCitation } = require('@/utils/generateChicago');
const { generateHarvardJournalCitation } = require('@/utils/generateHarvard');
const { generateMLAJournalCitation } = require('@/utils/generateMla');
const { generateVancouverJournalCitation } = require('@/utils/generateVancouver');

class CitationControllers {

    static async generateCitation(req, res) {
        try {
            const { ariticle_id } = req.query;
            const [rows] = await pool.execute(
                'SELECT * FROM article_main WHERE ariticle_id = ?',
                [ariticle_id]
            );

            const [authorsRow] = await pool.execute(
                'SELECT * FROM article_authors WHERE ariticle_id = ?',
                [ariticle_id]
            );


            const [volrow] = await pool.execute(
                'SELECT vi.issue_name, v.volume_name FROM vol_issue vi JOIN volume v ON vi.volume_id = v.volume_id WHERE vi.is_id = ?;',
                [rows[0].issueNo]
            );


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

            if (!rows[0].published_date) {
                return res.status(404).json({
                    status: false,
                    message: 'Published Date Must be there!'
                });
            }

            const date = new Date(rows[0].published_date);
            const year = date.getFullYear();

            const vol = volrow[0].volume_name;
            const issue = volrow[0].issue_name;

            const APA = generateAPAJournalCitation({ authors: authorsRow, year, title: rows[0].title, journal: 'farmclin', volume: vol, issue: issue, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const MLA = generateMLAJournalCitation({ authors: authorsRow, year, title: rows[0].title, journal: 'farmclin', volume: vol, issue: issue, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const chicago = generateChicagoJournalCitation({ authors: authorsRow, year, title: rows[0].title, journal: 'farmclin', volume: vol, issue: issue, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const Vancouver = generateVancouverJournalCitation({ authors: authorsRow, year, title: rows[0].title, journal: 'farmclin', volume: vol, issue: issue, pages: `${rows[0].page_from}-${rows[0].page_to}` })
            const Harvard = generateHarvardJournalCitation({ authors: authorsRow, year, title: rows[0].title, journal: 'farmclin', volume: vol, issue: issue, pages: `${rows[0].page_from}-${rows[0].page_to}` })

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
                    Harvard,
                    Vancouver,
                    ariticle_id
                ]
            );

            if (result.affectedRows) {
                return res.status(200).json({
                    status: true,
                    data: { MLA, APA, chicago, Vancouver, Harvard, year },
                    message: 'Citation generated Successfully!'
                });
            }
        } catch (error) {
            console.error('Error finding article:', error);
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve article',
                error: error.message
            });
        }
    }


   static async getCitationById(req, res) {
        try {
            const { ariticle_id } = req.query;

           const [rows] = await pool.execute(
                'SELECT am.citation_apa, am.citation_mla, am.citation_chicago, am.citation_harvard, am.citation_vancouver FROM article_main am WHERE ariticle_id = ?',
                [ariticle_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Citation not found!'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Citation found successfully',
                data: rows[0]
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error finding blog',
                error: error.message
            });
        }
    }

}

module.exports = CitationControllers;