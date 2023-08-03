import { baseFetch, Method } from "../baseFetch";
import { store } from "..";
import { SetActionTypes, Set } from "./types";

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
        })
        store.dispatch({ type: SetActionTypes.LISTS_SETS, payload: data.sets })
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
        }) as Set
        store.dispatch({ type: SetActionTypes.UPDATE_SET, payload: data })
        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

type createSetParams = {
    exerciseId: string,
    workoutId: string,
    exerciseRank: number,
    workoutRank: number,
    weight: number,
    repCount: number,
    template: boolean,
} | {
    copySetId: string,
    exerciseRank: number,
    workoutRank: number
}

const createSet = async (params: createSetParams) => {
    try {
        const data = await baseFetch({
            method: Method.POST,
            url: '/sets/create',
            params: params,
        }) as Set
        store.dispatch({ type: SetActionTypes.CREATE_SET, payload: data })
        return data;
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
        store.dispatch({ type: SetActionTypes.DELETE_SET, payload: {setId: params.setId} })
        const data = await baseFetch({
            method: Method.DELETE,
            url: '/sets/delete',
            params: params,
        })
        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export { fetchSets, updateSet, createSet, deleteSet }
export type { updateSetParams, createSetParams, deleteSetParams }