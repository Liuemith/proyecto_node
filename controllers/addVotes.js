/* 
    Controlador para votar enlaces (añadir likes)
*/
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { getConnection } = require('../db/db');
const { authUser } = require('../middlewares/auth');

const addVotes = async (req, res, next) => {
    let connection;
    const idAuthUser = req.authUser;
    try {
        connection = await getConnection();

        // Guardamos el id del usuario que ha iniciado sesion

        // Destructuramos el id del enlace de los path params
        const { insertId } = req.params;

        // Comprobamos que el usuario NO es lo mismo que ha publicado el enlace
        const [link] = await connection.query(
            `SELECT * FROM links WHERE id = ?`,
            [insertId]
        );

        // Si el idUser de la consulta es igual al id del usuario logueado
        if ({ insertId } === idAuthUser) {
            throw generateError('No puedes dar likes a tus publicaciones', 409);
        }

        // Comprobamos que este usuario todaía no haya votado este enlace
        const [votos] = await connection.query(
            `SELECT * FROM votos WHERE id_users = ? AND id_links = ?`,
            [idAuthUser, insertId]
        );

        // Si esta consulta devuelve algún valor, es que ya se ha votado ese enlace, error
        if (votos.length > 0) {
            throw generateError('¡Ya has votado ese enlace!', 409); // Conflict
        }

        // Obtenemos el valor del voto del req.body
        const { voto } = req.body;

        //Comprobamos que el voto sea un número entre 1 y 9
        if (voto < 0 || voto > 10) {
            throw generateError(
                'El voto tiene que ser un número entre 1 y 9',
                409
            );
        }

        //Añadimos el voto
        await connection.query(
            `INSERT INTO votos (id_users, id_links, voto)
            VALUES (?, ?, ?)`,
            [idAuthUser, insertId, voto]
        );

        res.send({
            status: 'Ok',
            message: `¡Tu voto ha sido registrado!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addVotes;
