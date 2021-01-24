import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {IChoiceSize, MatchedSize, Sex} from "../entity/MatchedSize";

export class MatchedSizeController {

    private matchedSizeRepository = getRepository(MatchedSize);
    private fs = require('fs').promises;

    // async one(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.findOne(request.params.id);
    // }
    //
    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.save(request.body);
    // }

    private *question_case_iterator(data_tree) {
        for (const sex of ['man','woman']){
            const sex_filtered_sizes = data_tree[sex];
            for(const height of Object.keys(sex_filtered_sizes)){
                const sex_height_filtered_sizes = data_tree[sex][height];
                for(const weight of Object.keys(sex_height_filtered_sizes)){
                    yield [sex, height, weight];
                }
            }
        }
    }

    async create_bulk(request: Request, response: Response, next: NextFunction){

        const data = await this.fs.readFile("question_tree.json", "binary");
        const question_tree = JSON.parse(data);

        const generator = this.question_case_iterator(question_tree);
        // https://jaeyeophan.github.io/2018/06/16/TS-8-enum-vs-const-enum/
        // const enum으로 하면 converted_choice_size요런 케이스가 안되네
        enum answer_match {small, medium, large}
        // python이면 dataframe에서 보낼수 있을텐데 ㅜㅜ
        //   woman 1450 33
        //   hip: { '0': 723, '1': 725, '2': 740 },
        //   crotch_height: { '0': 660, '1': 670.5, '2': 705 },

        for(const [sex, height, weight] of generator){
            const body_shape_raw = question_tree[sex][height][weight];
            // Object 는 of 안됨
            if (body_shape_raw === null) continue;
            const body_shape ={sex: Sex[sex.toUpperCase()], height: Number(height), weight: Number(weight)};
            for(const body_part of Object.keys(body_shape_raw)){
                // 안에 const 써도 되나? https://medium.com/@mautayro/es6-variable-declaration-for-loops-why-const-works-in-a-for-in-loop-but-not-in-a-normal-a200cc5467c2
                // 아예 새로운 block을 만드는건 https://stackoverflow.com/questions/49694121/why-const-value-changed-inside-of-for-in-and-for-of-loop
                // Every iteration of a loop has its own block scope.
                const choice_size_raw = body_shape_raw[body_part];
                const choice_size: IChoiceSize = {small: null, medium: null, large: null};
                // const enum으로 하면 converted_choice_size요런 케이스가 안되네
                Object.keys(choice_size_raw).map(key=> choice_size[answer_match[key]] = choice_size_raw[key]);
                body_shape[body_part] = choice_size;
            }
        }
        // TODO : Implement
        await this.matchedSizeRepository.insert([]);

    }


}