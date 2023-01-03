const getLinksController = async (req, res, next) => {
    try {
        throw new Error('Hubo un error chungo');
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
        res.send({
            status: 'OK',
            message: 'Nuevo tweet creado',
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
