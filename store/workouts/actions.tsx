import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { Workout, WorkoutActionTypes } from "./types";
import { Set, SetActionTypes } from "../sets/types";

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
        })
        const workout = data.workout as Workout;
        const sets = data.sets as Set[];
        store.dispatch({ type: WorkoutActionTypes.UPDATE_WORKOUT, payload: workout })
        store.dispatch({ type: SetActionTypes.UPDATE_SETS, payload: sets })
        return workout
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
        })
        const workout = data.workout as Workout;
        const sets = data.sets as Set[];
        store.dispatch({ type: WorkoutActionTypes.CREATE_WORKOUT, payload: workout })
        store.dispatch({ type: SetActionTypes.CREATE_SETS, payload: sets })
        return workout
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
        const workoutId: string = params.workoutId;
        store.dispatch({ type: WorkoutActionTypes.DELETE_WORKOUT, payload: { workoutId } })
        store.dispatch({ type: SetActionTypes.DELETE_SETS_BY_WORKOUT_ID, payload: workoutId })
        const data = await baseFetch({
            method: Method.DELETE,
            url: '/workouts/delete',
            params: params,
        })
        return data.workout as Workout;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchWorkouts, updateWorkout, createWorkout, deleteWorkout }
export type { deleteWorkoutParams, updateWorkoutParams, createWorkoutParams }