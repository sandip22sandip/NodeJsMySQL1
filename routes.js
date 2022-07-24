'use strict';

let userRoutes      = require('./app/routes/user.routes.js');
let adminRoutes     = require('./app/routes/admin.user.routes');

module.exports = (app) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/admin/manage-users', adminRoutes);
}