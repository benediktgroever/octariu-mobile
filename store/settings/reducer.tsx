import { Reducer } from "redux";

import { SettingsActionType, settingsState, SettingsResponse } from "./types";

export const initialState: settingsState = {
    settings: {
        countDownEndTime: undefined,
        countDownSetId: undefined,
        email: undefined,
        emailVerified: undefined,
        name: undefined,
        photoURL: undefined,
        timerInterval: undefined,
        timerOn: undefined,
        user: undefined,
    },
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
        case SettingsActionType.GET_SETTINGS_RESPONSE: {
            const settingsResponse = action.payload as SettingsResponse;
            return {
                settings: {
                    ...state.settings,
                    ...settingsResponse,
                    countDownEndTime: settingsResponse.timerOn === false ? 0 : state.settings.countDownEndTime
                },
                isLoading: false,
                errors: undefined,
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