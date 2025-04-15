class AuthorController {
    // Get all clients
    static async findAll(req, res) {
        try {
            return res.status(200).send({ status: true, msg: 'Clients retrieved successfully', data: {id: 1, name: "panchanan deka"} });
        } catch (error) {
            console.error('Error fetching clients:', error);
            return res.status(500).send({ status: false, msg: 'Internal Server Error' });
        }
    }
}


module.exports = AuthorController