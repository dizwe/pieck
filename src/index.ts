import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {MatchedSize} from "./entity/MatchedSize";
import { ApolloServer, gql } from 'apollo-server-express';


createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    const typeDefs = gql`
        scalar JSONObject # 오잉 얘는 어떻게 되는거여

        type ChoiceSize {
            small: Int
            medium: Int
            large: Int
       }
        
        type MatchedSize {
            sex: String  
            height: Int
            weight: Int
            shoulder: JSONObject # Object로 보여야 
            chest: JSONObject
            nipple: JSONObject
            arm: JSONObject
            waist: JSONObject
            bottom_waist: JSONObject
            thigh: JSONObject
            crotch: JSONObject
            length: JSONObject
            hem: JSONObject
            hip: JSONObject
            crotch_height: JSONObject
            middle_thigh: JSONObject
            knee: JSONObject
            calf: JSONObject
        }
        
        # 이런 방식으로 물어볼거야. 그러면 이런 답을 해주면 돼!
        type Query {
            get_matched_size_by_id(id: Int!): MatchedSize
            get_matched_size_by_bio(sex: String!, height: Int!, weight: Int!): MatchedSize
        }
    `;

    const matchedSizeRepository = getRepository(MatchedSize);
    // Resolvers define the technique for fetching the types defined in the
    // schema. This resolver retrieves books from the "books" array above.
    const resolvers = {
        Query: {
            get_matched_size_by_id: async (_: any, args: any) => {
                const { id } = args;
                return await matchedSizeRepository.findOne({ id: id });
            },
            get_matched_size_by_bio: async (_: any, args: any) => {
                const { sex, height, weight } = args;
                return await matchedSizeRepository.findOne({ sex: sex, height: height, weight: weight });
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
