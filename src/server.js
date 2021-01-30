import express from "express";
import { getPaths } from "./helpers/utils.js";
import dotenv  from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { userRouter } from './contacts/contact.router.js';
import cors from 'cors';

export class ContactsServer{

    constructor() {
        this.server = null;
    }

    start() {
        this.initServer();
        this.initConfig();
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandling();
        this.startListening();
      }

    initServer(){
        this.server = express();
    }
    initConfig() {
        const { __dirname } = getPaths(import.meta.url);
        dotenv.config({ path: path.join(__dirname, "../.env") });
    }
    initMiddlewares(){
        this.server.use(express.json());
        this.server.use(morgan('combined'));
        this.server.use(cors({ origin: 'http://localhost:3000' }));
    }
    initRoutes(){
        this.server.use('/api/contacts', userRouter)
    }
    initErrorHandling(){
        this.server.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            res.status(statusCode).send(err.message);
          });
    }
    startListening(){
        // const { PORT } = process.env;
        const PORT = 3000;
        

        this.server.listen(PORT, () => {
          console.log("Server started listening on port", PORT);
        });
    }
}
