var cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/user';
        this.authPath = '/api/auth';
    
        this.conectarDB();     //conectar a la base de datos 
        this.middlewares();   //middlewares
        this.routes();        //rutas
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());        //CORS
        this.app.use(express.json())       //lectura y parseo del body
        this.app.use(express.static('public'))      //directorio public
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/user'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto ', this.port);
        })
    }
}

module.exports = Server;