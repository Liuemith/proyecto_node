const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const insertLink = async (link) => {
    let connection;
    try {
        connection = await getConnection();

        const { title, url, description, idUser } = link;

        const [{ insertId }] = await connection.query(
            `INSERT INTO links (title, url, description, id_user) VALUES (?,?,?,?)`,
            [title, url, description, idUser]
        );
        return insertId;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { insertLink };
