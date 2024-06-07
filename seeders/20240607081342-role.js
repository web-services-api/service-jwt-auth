'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    const roles = [
      { id: uuidv4(), name: 'ROLE_ADMIN' },
      { id: uuidv4(), name: 'ROLE_USER' },
      { id: uuidv4(), name: 'ROLE_OWNER' }
    ];
    return queryInterface.bulkInsert('roles', roles);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};  
