# API Compartir-enlaces - SOCIAL LINKS

Implementar una API que permita a los usuarios registrarse y compartir enlaces web que
consideren interesantes. Otros usuarios podrán votarlos si les gustan.

## Para la ejecución de este proyecto seguir los siguientes pasos:

-   Crear una base de datos vacía en una instancia MySQL en local.
-   CREATE DATABASE IF NOT EXISTS SOCIAL_LINKS;

-   Crear el archivo `.env` y rellenar las variables de entorno con sus datos necesarios.

-   Ejecutar `npm i` para instalar todas las dependencias necesarias.

-   El comando `npm run db` ejecutará la creación de las tablas e inserción de algunos datos de ejemplo.

-   Ejecutar el comando `npm run dev` para poner a la escucha al servidor.

-   Importar la colección `Proyecto_SOCIAL_LINKS.postman_collection` a la aplicación de Postman con todos los endpoints creados.

## Endpoints

### Usuarios

-   POST[/user] - Registra un nuevo usuario.
-   POST[/login] - Login de usuario. (devuelve un token).
-   GET[/users/:idUser] - Devuelve información de un usuario en base a su id. TOKEN.
-   PUT[/user/edit] - Modifica username e email. TOKEN.
-   PUT[/users/password] - Modifica la contraseña del usuario. TOKEN.

### Enlaces

-   POST[/] - Inserta un nuevo enlace. TOKEN.
-   GET[/all] - Devuelve todos los enlaces publicados, ordenados por fecha (desc). TOKEN.
-   GET[/link/:id] - Devuelve un enlace en base a su id. TOKEN.
-   DELETE[/link/:id] - Elimina un enlace. TOKEN.

### Votos

-   POST[/votos/:id_links/voto] - Vota un enlace. TOKEN.
-   GET[/votos/:id_links/avg-voto] - Devuelve la media de los votos de un enlace. TOKEN.
