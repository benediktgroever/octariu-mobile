import { Reducer } from "redux";

import { SettingsActionType, settingsState } from "./types";

export const initialState: settingsState = {
    settings: { countDownEndTime: undefined, countDownSetId: undefined },
    errors: undefined,
    isLoading: false,
};

const settingsReducer: Reducer<settingsState> = (state = initialState, action) => {
    switch (action.type) {
        case SettingsActionType.API_ERROR: {
            return { ...state, isLoading: false, errors: action.payload };
        }
        case SettingsActionType.IS_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }
        case SettingsActionType.UPDATE_COUNT_DOWN_TIMER: {
            return {
                ...state,
                settings: {
                    ...state.settings,
                    countDownEndTime: action.payload.countDownEndTime,
                    countDownSetId: action.payload.countDownSetId,
                }
            };
        }
        default: {
            return state;
        }
    }
};

export { settingsReducer };