require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const {
    newUserController,
    getUserController,
    loginController,
} = require('./controllers/users');

const editUser = require('./controllers/editUser');
const editUserPass = require('./controllers/editUserPass');
const addVotes = require('./controllers/addVotes');
const calculateAverageVotes = require('./controllers/calculateAverageVotes');

const {
    getLinksController,
    newLinkController,
    getSingleLinkController,
    deleteLinkController,
} = require('./controllers/links');
const { authUser } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

//Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);
// Modificar email o username
app.put('/user/edit', authUser, editUser);
// Modificar la contraseña del usuario
app.put('/users/password', authUser, editUserPass);

//Rutas de Links
app.post('/', authUser, newLinkController);
app.get('/all', getLinksController);
app.get('/link/:id', getSingleLinkController);
app.delete('/link/:id', authUser, deleteLinkController);

//Rutas de votos
// Votar un enlace
app.post('/votos/:id_links/voto', authUser, addVotes);

// Sacar la media de los votos de un enlace
app.get('/votos/:id_links/avg-voto', calculateAverageVotes);

// Middleware de 404
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

// Lanzamos el servidor
app.listen(4000, () => {
    console.log('Servidor funcionando perfectamente 🤩');
});
