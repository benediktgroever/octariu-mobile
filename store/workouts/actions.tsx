import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { Workout, WorkoutActionTypes } from "./types";
import { SetActionTypes } from "../sets/types";
import { WorkoutSetResponse } from '../../common/types';
import { sendMessageToIPhone } from "../phoneConnector";

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
        }) as WorkoutSetResponse;
        store.dispatch({ type: WorkoutActionTypes.LISTS_WORKOUTS, payload: data.workouts.list })
    } catch (error) {
        console.error(error);
    }
};

type updateWorkoutParams = {
    workoutId: string,
    name?: string,
    startTimeMs?: number,
    endTimeMs?: number,
    workoutRanksOrder?: string[],
} | {
    workoutId: string,
    copyWorkoutId: string,
    reorder: boolean,
}

const updateWorkout = async (params: updateWorkoutParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/workouts/update',
            params: params,
        }) as WorkoutSetResponse;
        sendMessageToIPhone(data)
        store.dispatch({ type: WorkoutActionTypes.UPDATE_WORKOUTS, payload: data.workouts.updated })
        store.dispatch({ type: SetActionTypes.UPDATE_SETS, payload: data.sets.updated })
        store.dispatch({ type: SetActionTypes.CREATE_SETS, payload: data.sets.created })
        store.dispatch({ type: SetActionTypes.DELETE_SETS, payload: data.sets.deleted })
        return data.workouts.updated[0]
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
        }) as WorkoutSetResponse
        sendMessageToIPhone(data)
        store.dispatch({ type: WorkoutActionTypes.CREATE_WORKOUTS, payload: data.workouts.created })
        store.dispatch({ type: SetActionTypes.CREATE_SETS, payload: data.sets.created })
        return data.workouts.created[0]
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
        store.dispatch({ type: WorkoutActionTypes.DELETE_WORKOUTS, payload: [{ workoutId }] })
        store.dispatch({ type: SetActionTypes.DELETE_SETS_BY_WORKOUT_ID, payload: workoutId })
        const data = await baseFetch({
            method: Method.DELETE,
            url: '/workouts/delete',
            params: params,
        }) as WorkoutSetResponse
        sendMessageToIPhone(data)
        return data.workouts.deleted[0] as Workout;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchWorkouts, updateWorkout, createWorkout, deleteWorkout }
export type { deleteWorkoutParams, updateWorkoutParams, createWorkoutParams }