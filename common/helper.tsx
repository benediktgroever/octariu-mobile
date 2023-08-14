import { Set } from "../store";
export const getOneMaxRep = (set: Set) => Math.round(
    set.weight / ((1.0278) - (0.0278 * set.repCount))
);