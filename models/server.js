var cors = require('cors');
const express = require('express');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/user';
        this.authPath = '/api/auth';
        this.providersPath = '/api/providers';
    
        this.conectarDB();     // Conectar a la base de datos 
        this.middlewares();    // Middlewares
        this.routes();         // Rutas
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());                     // CORS
        this.app.use(express.json());             // Lectura y parseo del body
        this.app.use(express.static('public'));   // Directorio público
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/user'));
        this.app.use(this.providersPath, require('../routes/providerService'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
