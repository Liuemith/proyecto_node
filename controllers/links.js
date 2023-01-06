const {
    insertLink,
    getAllLinks,
    getLinkById,
    deleteLinkById,
} = require('../db/links');

const { generateError } = require('../helpers');

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

const getLinksController = async (req, res, next) => {
    try {
        const links = await getAllLinks();

        res.send({
            status: 'ok',
            data: links,
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
        //req.userId
        const { id } = req.params;

        // Conseguir la información del tweet que quiero borrar
        const link = await getLinkById(id);

        // Comprobar que el usuario del token es el mismo que creó el tweet
        if (req.userId !== link.user_id) {
            throw generateError(
                'Estás intentando borrar un link que no es tuyo',
                401
            );
        }

        // Borrar el tweet
        await deleteLinkById(id);

        res.send({
            status: 'ok',
            message: `El link con id: ${id} fue borrado`,
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
