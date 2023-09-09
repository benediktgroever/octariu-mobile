import { Reducer } from "redux";

import { Set, SetActionTypes, setsState } from "./types";
export const initialState: setsState = {
    sets: [],
    errors: undefined,
    isLoading: false,
};

const setsReducer: Reducer<setsState> = (state = initialState, action) => {
    switch (action.type) {
        case SetActionTypes.API_ERROR: {
            return { ...state, isLoading: false, errors: action.payload };
        }
        case SetActionTypes.IS_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }
        case SetActionTypes.CREATE_SETS: {
            const sets: Set[] = action.payload;
            return {
                ...state,
                sets: [...state.sets, ...sets]
            };
        }
        case SetActionTypes.DELETE_SETS: {
            const setIds: { [setId: string]: Set } = {};
            const sets: Set[] = action.payload;
            sets.map((set: Set) => setIds[set.setId] = set)
            return {
                ...state,
                sets: state.sets.filter(set => setIds.hasOwnProperty(set.setId) == false)
            };
        }
        case SetActionTypes.DELETE_SETS_BY_WORKOUT_ID: {
            const workoutId: string = action.payload;
            return {
                ...state,
                sets: state.sets.filter(set => set.workoutId !== workoutId)
            };

        }
        case SetActionTypes.LISTS_SETS: {
            return {
                ...state,
                isLoading: false,
                sets: action.payload,
            };
        }
        case SetActionTypes.UPDATE_SETS: {
            const setToBeUpdated: { [setId: string]: Set } = {};
            const sets: Set[] = action.payload;
            sets.map((set: Set) => setToBeUpdated[set.setId] = set)
            return {
                ...state,
                sets: state.sets.map((set) => {
                    if (setToBeUpdated.hasOwnProperty(set.setId) === false) {
                        // This isn't a Set we want to update - keep it as-is
                        return set
                    }
                    // Otherwise, this is a set we want - return an updated value
                    return setToBeUpdated[set.setId]
                })
            }
        }
        default: {
            return state;
        }
    }
};

export { setsReducer };