const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const getUserByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM users WHERE email=?
      `,
      [email]
    );

    if (result.length === 0) {
      throw generateError('No hay ningun usuario con ese email', 404);
    }

    return result[0];
  } finally {
  }
};

const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, email, created_at FROM users WHERE id=?
      `,
      [id]
    );

    if (result.length === 0) {
      throw generateError('No hay ningun usuario con esa id', 404);
    }

    return result[0];
  } finally {
  }
};

const createUser = async (email, password) => {
  let connection;
  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `SELECT id FROM users WHERE email = ?
      `,
      [email]
    );
    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const [newUser] = await connection.query(
      `
      INSERT INTO users (email, password) VALUES (?,?)
      `,
      [email, passwordHash]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
