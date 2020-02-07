import 'dotenv/config';
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry.config';

import './database';

class App {
    constructor() {
        this.server = express();

        if (sentryConfig && sentryConfig.dsn) {
            Sentry.init(sentryConfig);
        }

        this.middlewares();
        this.routes();
        this.exceptionHandle();
    }

    middlewares() {
        if (sentryConfig && sentryConfig.dsn) {
            this.server.use(Sentry.Handlers.requestHandler());
        }
        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
        if (sentryConfig && sentryConfig.dsn) {
            this.server.use(Sentry.Handlers.errorHandler());
        }
    }

    exceptionHandle() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
            return res.status(500).json({ error: 'Internal server error' });
        });
    }
}

export default new App().server;
