import { Reducer } from "redux";

import { SetActionTypes, setsState } from "./types";
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
        case SetActionTypes.CREATE_SET: {
            return {
                ...state,
                sets: [...state.sets, action.payload]
            };
        }
        case SetActionTypes.DELETE_SET: {
            return {
                ...state,
                sets: state.sets.filter(set => set.setId !== action.payload.setId)
            };
        }
        case SetActionTypes.LISTS_SETS: {
            return {
                ...state,
                isLoading: false,
                sets: action.payload,
            };
        }
        case SetActionTypes.UPDATE_SET: {
            return {
                ...state,
                sets: state.sets.map((set) => {
                    if (set.setId !== action.payload.setId) {
                        // This isn't the item we care about - keep it as-is
                        return set
                    }
                    // Otherwise, this is the one we want - return an updated value
                    return action.payload
                })
            }
        }
        default: {
            return state;
        }
    }
};

export { setsReducer };