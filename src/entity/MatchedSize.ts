import {Field, ObjectType, registerEnumType, ID, Int} from 'type-graphql';
import {Entity, PrimaryGeneratedColumn, Column, Index} from "typeorm";
import {GraphQLInt, GraphQLObjectType} from 'graphql';

export enum Sex{
    MAN,
    WOMAN
}

export interface IChoiceSize {
    small: number,
    medium: number,
    large: number
}

export const ChoiceSizeType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        small: { type: GraphQLInt },
        medium: { type: GraphQLInt },
        large: { type: GraphQLInt }
    })
});

registerEnumType(Sex, {name: "Sex"});

@ObjectType()
@Entity()
@Index(["height", "weight", "sex"], { unique: true })
export class MatchedSize {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Sex)
    @Column({
        type: "enum",
        enum: Sex,
        default: Sex.WOMAN
    })
    sex: number;

    @Field(type => Int)
    @Column()
    height: number;

    @Field(type => Int)
    @Column()
    weight: number;

    // https://sizekorea.kr/measurement-data/body 에서 정보 얻을 수 있음
    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    shoulder: IChoiceSize; // 317 어깨너비

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    chest: IChoiceSize; // 208 가슴둘레

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    nipple: IChoiceSize; // 209 젖가슴둘레

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    arm: IChoiceSize; // 233 팔길이

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    waist: IChoiceSize; // 211 허리둘레(배꼽 윗부분)

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    bottom_waist: IChoiceSize; // '211-2' 배꼽수준 허리둘

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    thigh: IChoiceSize; // 419 넙다리둘레(엉덩이 바로 밑부분 둘레)

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    crotch: IChoiceSize; // 241 배꼽수준 샅앞뒤길이

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    length: IChoiceSize; // 115 엉덩뼈가시높이

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    hem: IChoiceSize; // 424 종아리 최소둘레(발목)

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    hip: IChoiceSize; // 214 엉덩이 둘

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    crotch_height: IChoiceSize; // 128 샅높이(바닥에서 샅점까지)

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    middle_thigh: IChoiceSize; // 420 넙다리 중간둘레

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    knee: IChoiceSize; // 421 무릎둘레

    @Field(type => ChoiceSizeType)
    @Column("simple-json")
    calf: IChoiceSize; // 423 장딴지 둘레(장딴지 돌출점 지나는)
}
