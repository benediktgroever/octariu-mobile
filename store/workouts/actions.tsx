import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { Workout, WorkoutActionTypes } from "./types";
import { fetchSets } from "../sets/actions";

const fetchWorkouts = async () => {
    try {
        if (store.getState().workouts.isLoading) {
            return
        }
        if (store.getState().workouts.workouts.length !== 0) {
            return
        }
        store.dispatch({ type: WorkoutActionTypes.IS_LOADING })
        const data = await baseFetch({
            method: Method.GET,
            url: '/workouts/list',
            params: {},
        })
        store.dispatch({ type: WorkoutActionTypes.LISTS_WORKOUTS, payload: data.workouts })
    } catch (error) {
        console.error(error);
    }
};

type updateWorkoutParams = {
    workoutId: string,
    name?: string,
    startTimeMs?: number,
    endTimeMs?: number
}

const updateWorkout = async (params: updateWorkoutParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/workouts/update',
            params: params,
        }) as Workout
        store.dispatch({ type: WorkoutActionTypes.UPDATE_WORKOUT, payload: data })
        return data
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

type createWorkoutParams = {
    name: string,
} | {
    name: string,
    copyWorkoutId: string,
    weightIntensity: number,
    repIntensity: number,
    startTimeMs: number
}

const createWorkout = async (params: createWorkoutParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/workouts/create',
            params: params,
        }) as Workout
        store.dispatch({ type: WorkoutActionTypes.CREATE_WORKOUT, payload: data })
        if ("copyWorkoutId" in params) {
            await fetchSets(true);
        }
        return data
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

type deleteWorkoutParams = {
    workoutId: string,
}

const deleteWorkout = async (params: deleteWorkoutParams) => {
    try {
        store.dispatch({ type: WorkoutActionTypes.DELETE_WORKOUT, payload: { workoutId: params.workoutId } })
        const data = await baseFetch({
            method: Method.DELETE,
            url: '/workouts/delete',
            params: params,
        }) as Workout
        return data
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchWorkouts, updateWorkout, createWorkout, deleteWorkout }
export type { deleteWorkoutParams, updateWorkoutParams, createWorkoutParams }