import "reflect-metadata";

import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";

import {typeDefs} from "./graphql/typeDefs";
import {resolvers} from "./graphql/resolvers";
import {ApolloServer, gql} from 'apollo-server-express';
import {MatchedSize} from "./entity/MatchedSize";
import {Connection, createConnection} from "typeorm";

export const main = async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    const connection = await createConnection();

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({typeDefs, resolvers});
    server.applyMiddleware({app});

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // start express server
    app.listen(3003);

    console.log("Express server has started on port 3003.");
};

main().catch(error => console.error(error));