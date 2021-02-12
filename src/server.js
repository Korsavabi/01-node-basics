import express from "express";
import { getPaths } from "./helpers/utils.js";
import dotenv  from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { userRouter } from './users/users.controller.js';
import { authRouter } from './auth/auth.controller.js';
import cors from 'cors';
import mongoose  from "mongoose";
import cookieParser from "cookie-parser";

export class ContactsServer{

    constructor() {
        this.server = null;
    }

   async start() {
        this.initServer();
        this.initConfig();
        await this.initDatabase();
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
   async initDatabase(){
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    }
    initMiddlewares(){
        this.server.use(express.json());
        this.server.use(morgan('combined'));
        this.server.use(cors({ origin: 'http://localhost:3000' }));
        this.server.use(cookieParser(process.env.COOKIE_SECRET))
    }
    initRoutes(){
        this.server.use('/auth', authRouter);
        this.server.use('/users', userRouter);
    }
    initErrorHandling(){
        this.server.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            res.status(statusCode).send(err.message);
          });
    }
    startListening(){
        const { PORT } = process.env;        

        this.server.listen(PORT, () => {
          console.log("Server started listening on port", PORT);
        });
    }
}
