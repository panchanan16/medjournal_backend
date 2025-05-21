require('module-alias/register');

const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

const PORT = process.env.PORT || 3100;
require('dotenv').config({ path: [`.env.${process.env.NODE_ENV}`] })
require('@/config/db.config');


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const appRoutes_entity = require('@/routes/applicationApi')
app.use('/api/v1', appRoutes_entity);

const coreApiRoutes = require('@/routes/coreApi')
app.use('/api/v1/core', coreApiRoutes);


app.listen(PORT, () => {
    console.log("Server is listening to PORT 3100 🚀🚀🚀")
})