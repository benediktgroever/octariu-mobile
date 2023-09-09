import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { SetActionTypes } from "./types";
import { WorkoutActionTypes } from "../workouts/types";
import { WorkoutSetResponse } from "../../common/types";

const fetchSets = async (force: boolean) => {
    try {
        if (store.getState().sets.isLoading) {
            return
        }
        if (store.getState().sets.sets.length !== 0 && !force) {
            return
        }
        store.dispatch({ type: SetActionTypes.IS_LOADING })
        const data = await baseFetch({
            method: Method.GET,
            url: '/sets/list',
            params: {},
        }) as WorkoutSetResponse
        store.dispatch({ type: SetActionTypes.LISTS_SETS, payload: data.sets.list })
    } catch (error) {
        console.error(error);
    }
};

interface updateSetParams {
    setId: string,
    repCount?: number
    exerciseRank?: number,
    weight?: number,
    completedAtMs?: number
}

const updateSet = async (params: updateSetParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/sets/update',
            params: params,
        }) as WorkoutSetResponse
        store.dispatch({ type: SetActionTypes.UPDATE_SETS, payload: data.sets.updated })
        return data.sets.updated[0];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

type createSetParams = {
    exerciseId: string,
    workoutId: string,
    weight: number,
    repCount: number,
    template: number,
} | {
    copySetId: string,
}

const createSet = async (params: createSetParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/sets/create',
            params: params,
        }) as WorkoutSetResponse
        store.dispatch({ type: WorkoutActionTypes.UPDATE_WORKOUTS, payload: data.workouts.updated })
        store.dispatch({ type: SetActionTypes.CREATE_SETS, payload: data.sets.created })
        return data.sets.created[0];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

interface deleteSetParams {
    setId: string
}

const deleteSet = async (params: deleteSetParams) => {
    try {
        store.dispatch({ type: SetActionTypes.DELETE_SETS, payload: [{ setId: params.setId }] })
        const data = await baseFetch({
            method: Method.DELETE,
            url: '/sets/delete',
            params: params,
        }) as WorkoutSetResponse
        store.dispatch({ type: SetActionTypes.UPDATE_SETS, payload: data.sets.updated })
        return data.sets.deleted[0];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchSets, updateSet, createSet, deleteSet }
export type { updateSetParams, createSetParams, deleteSetParams }