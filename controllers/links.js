const { insertLink } = require('../db/links');
const getLinksController = async (req, res, next) => {
    try {
        throw new Error('Hubo un error ');
        res.send({
            status: 'error',
            message: 'Not implemented',
        });
    } catch (error) {
        next(error);
    }
};

const newLinkController = async (req, res, next) => {
    console.log('usuario:', req.userId);

    try {
        // Pendiente validar el body con JOI
        const { title, url, description } = req.body;

        const newLink = { title, url, description, idUser: req.userId };

        const insertId = await insertLink(newLink);

        newLink.id = insertId;

        res.send({
            status: 'OK',
            message: `Nuevo link creado con el id: ${insertId} `,
            data: newLink,
        });
    } catch (error) {
        next(error);
    }
};

const getSingleLinkController = async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented',
        });
    } catch (error) {
        next(error);
    }
};

const deleteLinkController = async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLinksController,
    newLinkController,
    getSingleLinkController,
    deleteLinkController,
};
