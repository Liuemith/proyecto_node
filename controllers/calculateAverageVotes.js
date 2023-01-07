const { generateError } = require('../helpers');
const { getConnection } = require('../db/db');

const calculateAverargeVotes = async (req, res, next) => {
    let connection;

    try {
        connection = await getConnection();
        // Destructuramos el id del enlace de los path params
        const { insertId } = req.params;

        //Verificamos si hay algún voto para calcular la media
        const [votos] = await connection.query(
            `SELECT voto FROM votos WHERE id_links = ?`,
            [insertId]
        );

        // Si esta consulta NO devuelve algún valor, es que ese enlace todavía no tiene votos para calcular, error
        if (votos.length < 1) {
            throw generateError('No hay datos para calcular la media', 409); // Conflict
        }
        //Calculamos la media de los votos
        let averageVotes = await connection.query(
            `SELECT voto FROM votos WHERE id_links = ? (
                                                        select avg(voto))
                                                        VALUES (?)`,
            [insertId]
        );
        res.send({
            status: 'Ok',
            message: `La media de los votos del enlace con id ${insertId} es ${averageVotes}.`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = calculateAverargeVotes;
