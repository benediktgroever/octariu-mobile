import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { ExerciseActionTypes, ExerciseRequest } from "./types";

const LAST_UPDATED = 5 * 60 * 1000

const fetchExercises = async () => {
    try {
        if (store.getState().exercises.isLoading) {
            return
        }
        if (new Date().getTime() - store.getState().exercises.lastLoadedTimeMs < LAST_UPDATED){
            return
        }
        store.dispatch({ type: ExerciseActionTypes.IS_LOADING })
        const data = await baseFetch({
            method: Method.GET,
            url: '/exercises/list',
            params: {},
        })
        store.dispatch({ type: ExerciseActionTypes.LISTS_EXERCISES, payload: data.exercises })
    } catch (error) {
        console.error(error);
    }
};

type requestExerciseParams = {
    name: string,
}

const requestExercise = async (params: requestExerciseParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/exercises/request',
            params: params,
        }) as ExerciseRequest;
        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchExercises, requestExercise }
export type { requestExerciseParams }