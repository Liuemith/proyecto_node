const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');
const { authUser } = require('../middlewares/auth');

const addVoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getConnection();

        // Recuperar el id del usuario que está logueado
        const idAuthUser = req.userId;

        // Destructuramos el id del producto de los path params
        const idLinks = req.params;
        console.log(idLinks);
        // Comprobamos que el usuario NO es el propietario del producto
        const [links] = await connection.query(
            `SELECT * FROM links WHERE id = ?`,
            [idLinks]
        );

        // Si el idUser de la consulta es igual al id del usuario logueado
        if (links.id_users === idAuthUser) {
            throw generateError(
                'No puedes añadir a favoritos tus productos',
                409
            );
        }

        // Comprobamos que este usuario no tiene añadido ya ese producto a favoritos
        const [voto] = await connection.query(
            `SELECT * FROM votos WHERE id_users = ? AND id_links = ?`,
            [idAuthUser, idLinks]
        );

        // Si esta consulta devuelve algún valor, ya ha añadido ese producto a fav, error
        if (voto.length > 0) {
            throw generateError('¡Ese producto ya consta como favorito!', 409); // Conflict
        }

        // Si no está en favoritos, lo añadimos
        await connection.query(
            `INSERT INTO votos (id_users, id_links)
            VALUES (?, ?)`,
            [idAuthUser, idLinks]
        );

        res.send({
            status: 'Ok',
            message: `¡Producto añadido a favoritos!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addVoto;
