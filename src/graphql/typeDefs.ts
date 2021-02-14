import {gql} from "apollo-server-express";

export const typeDefs = gql`
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
    # 가장 상위 단위
    type Query {
        get_matched_size_by_id(id: Int!): MatchedSize
        get_matched_size_by_bio(sex: String!, height: Int!, weight: Int!): MatchedSize
    }
`;