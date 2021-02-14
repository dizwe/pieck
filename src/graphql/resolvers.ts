import {Connection, createConnection, getConnection, getRepository} from "typeorm";
import {MatchedSize} from "../entity/MatchedSize";

export const resolvers = {
    Query: {
        get_matched_size_by_id: async (_: any, args: any) => {
            const { id } = args;
            return await getRepository(MatchedSize).findOne({ id: id });
        },
        get_matched_size_by_bio: async (_: any, args: any) => {
            const { sex, height, weight } = args;
            return await getRepository(MatchedSize).findOne({ sex: sex, height: height, weight: weight });
        }
    },
};