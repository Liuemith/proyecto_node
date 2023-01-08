/* 
    Controlador para editar la contraseña del usuario
*/

const { getConnection } = require('../db/db');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const bcrypt = require('bcrypt');

let saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getConnection();

        // Guardamos el id del usuario que ha iniciado sesion
        const idAuthUser = req.authUser;

        // Recuperamos del req.body los datos necesarios
        const { email, newPass, confirmNewPass } = req.body;

        // Comprobamos que ha indicado todos los datos obligatorios
        if (!email || !newPass || !confirmNewPass) {
            throw generateError('¡Faltan datos obligatorios!', 400); // Bad Request
        }

        // Comprobamos que la nueva contraseña es igual a la confirmacion de la misma
        if (newPass !== confirmNewPass) {
            throw generateError('¡Las contraseñas no coinciden!', 401); // Unauthorized
        }

        // Recuperamos el email del usuario logueado para comprobar que es el mismo que nos indican
        const [user] = await connection.query(
            `SELECT email FROM users WHERE id = ?`,
            [idAuthUser]
        );
        // Si ese email no coincide con el que recibimos en el req.body lanzamos un error
        // if (email !== user[0].email) {
        //     throw generateError(
        //         '¡El email debe coincidir con el usuario que ha hecho login!',
        //         401
        //     ); // Unauthorized
        // }

        // Encriptamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPass, saltRounds);

        // Modificamos la contraseña del usuario
        await connection.query(`UPDATE users SET password = ? WHERE id = ?`, [
            hashedPassword,
            idAuthUser,
        ]);

        // Respondemos
        res.send({
            status: 'Ok',
            message: '¡Contraseña actualizada con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserPass;
