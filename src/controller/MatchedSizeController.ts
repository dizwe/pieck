import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {IChoiceSize, MatchedSize, Sex} from "../entity/MatchedSize";

export class MatchedSizeController {

    private matchedSizeRepository = getRepository(MatchedSize);
    private fs = require('fs').promises;

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

    private extract_body_shapes_from(question_tree){
        const generator = this.question_case_iterator(question_tree);
        // 0이라는 숫자를 small이라는 key로 바꾸기 위함
        enum answer_match {small, medium, large}
        /* 이런 형태로 만들기
          woman 1450 33
          hip: { '0': 723, '1': 725, '2': 740 },
          crotch_height: { '0': 660, '1': 670.5, '2': 705 },
         */
        const body_shapes : MatchedSize[] = [];
        for(const [sex, height, weight] of generator){
            const body_shape_raw = question_tree[sex][height][weight];
            if (body_shape_raw === null) continue;
            const body_shape:MatchedSize = <MatchedSize> {sex: Sex[sex.toUpperCase()], height: Number(height), weight: Number(weight)};
            for(const body_part of Object.keys(body_shape_raw)){
                const choice_size_raw = body_shape_raw[body_part];
                const choice_size: IChoiceSize = {small: 0, medium: 0, large: 0}; // init
                Object.keys(choice_size_raw).map(key=> choice_size[answer_match[key]] = choice_size_raw[key]);
                body_shape[body_part] = choice_size;
            }
            body_shapes.push(body_shape);
        }
        return body_shapes;
    }

    async create_bulk(request: Request, response: Response, next: NextFunction){
        const data = await this.fs.readFile("question_tree.json", "binary");
        const question_tree = JSON.parse(data);
        const body_shapes = this.extract_body_shapes_from(question_tree);

        // TODO : UPSERT 로 짜는게 맞을거 같음
        await this.matchedSizeRepository.insert(body_shapes);
    }


}