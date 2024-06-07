'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Role = require('../models').Role;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'toto',
        email: 'toto@toto.com',
        role_id: (await Role.findOne({ where: { name: 'ROLE_USER' } })).id,
        password: bcrypt.hashSync('toto', 10),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
