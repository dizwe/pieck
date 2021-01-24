import {MatchedSizeController} from "./controller/MatchedSizeController";

export const Routes = [{
    method: "get",
    route: "/matched_size",
    controller: MatchedSizeController,
    action: "create_bulk"
}];