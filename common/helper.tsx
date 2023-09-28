import { Set } from "../store";
type getOneMaxRepInput = Set | {repCount: number, weight: number}
export const getOneMaxRep = (input: getOneMaxRepInput) => Math.round(
    input.weight / ((1.0278) - (0.0278 * input.repCount))
);
