/* 
    Controlador que edita el nombre de usuario y/o el email
*/
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const {
    createUser,
    getUserById,
    getUserByEmail,
    getConnection,
} = require('../db/users');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getConnection();

        // Guardamos el id del usuario que ha iniciado sesion
        const idAuthUser = req.authUser.id;

        // Recuperamos el nuevo email y nombre de usuario del cuerpo de la peticion
        const { newEmail, newName } = req.body;

        // Si no existen ni el nuevo email ni el nuevo username
        if (!newEmail && !newName) {
            throw generateError('¡No estás modificando nada!', 400);
        }
        // Comprobamos que el nuevo email y el nuevo username no existen en la base de datos
        const [users] = await connection.query(
            `SELECT * FROM users WHERE email = ? OR nombre = ?`,
            [newEmail, newName]
        );

        if (users.length > 0) {
            throw generateError(
                'El nuevo email o nuevo nombre ya están en uso.',
                409
            ); // Conflict
        }

        // Seleccionamos los datos antiguos del usuario que ha iniciado sesion
        const [authUser] = await connection.query(
            `SELECT email, nombre FROM users WHERE id = ?`,
            [idAuthUser]
        );

        // Modificamos los datos
        await connection.query(
            `UPDATE users SET email = ?, nombre = ? WHERE id = ?`,
            [
                newEmail || authUser[0].email,
                newName || authUser[0].username,
                idAuthUser,
            ]
        );

        res.send({
            status: 'Ok',
            message: `¡Datos del usuario modificados con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUser;
