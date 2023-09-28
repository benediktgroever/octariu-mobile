export interface SettingsResponse {
    user: string | undefined;
    name: string | undefined;
    email: string | undefined;
    photoURL: string | undefined;
    emailVerified: boolean | undefined;
    timerInterval: number | undefined;
    timerOn: boolean | undefined;
}

export interface SettingsLocal {
    countDownEndTime: number | undefined;
    countDownSetId: string | undefined;
}

export enum SettingsActionType {
    API_ERROR = "@@set/API_ERROR",
    UPDATE_COUNT_DOWN_TIMER = "@@settings/UPDATE_COUNT_DOWN_TIMER",
    GET_SETTINGS_RESPONSE = "@@settings/GET_SETTINGS_RESPONSE",
    UPDATE_SETTINGS_RESPONSE = "@@settings/UPDATE_SETTINGS_RESPONSE",
    IS_LOADING = "@@settings/IS_LOADING"
}

export interface settingsState {
    readonly isLoading: boolean;
    readonly settings: SettingsResponse & SettingsLocal;
    readonly errors?: string;
}
