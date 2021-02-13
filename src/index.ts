import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {IChoiceSize, MatchedSize, Sex} from "./entity/MatchedSize";
import { ApolloServer, gql } from 'apollo-server-express';



createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // A schema is a collection of type definitions (hence "typeDefs")
    // that together define the "shape" of queries that are executed against
    // your data.함
    const typeDefs = gql`
        enum Sex{
            MAN,
            WOMAN
        }
        type ChoiceSize {
            small: Int
            medium: Int
            large: Int
        }
        
        type MatchedSize {
            sex: Sex # Enum으로 보여야 함  
            height: Int
            weight: Int
            shoulder: ChoiceSize # Object로 보여야 
            chest: ChoiceSize
            nipple: ChoiceSize # 209 젖가슴둘레
            arm: ChoiceSize # 233 팔길이
            waist: ChoiceSize
            bottom_waist: ChoiceSize
            thigh: ChoiceSize
            crotch: ChoiceSize
            length: ChoiceSize
            hem: ChoiceSize
            hip: ChoiceSize
            crotch_height: ChoiceSize
            middle_thigh: ChoiceSize
            knee: ChoiceSize
            calf: ChoiceSize
        }
        
        type Query {
            matched_size(id: Int!): MatchedSize
        }
    `;

    const matchedSizeRepository = getRepository(MatchedSize);
    // Resolvers define the technique for fetching the types defined in the
    // schema. This resolver retrieves books from the "books" array above.
    const resolvers = {
        Query: {
            matched_size: async (_: any, args: any) => {
                const { id } = args;
                return await matchedSizeRepository.findOne({ id: id });
            }
        },
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({ typeDefs, resolvers });
    server.applyMiddleware({ app });

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

}).catch(error => console.log(error));
