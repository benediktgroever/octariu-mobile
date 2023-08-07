export interface Settings {
    countDownEndTime: number | undefined;
    countDownSetId: string | undefined;
}

export enum SettingsActionType {
    API_ERROR = "@@set/API_ERROR",
    UPDATE_COUNT_DOWN_TIMER = "@@settings/UPDATE_COUNT_DOWN_TIMER",
    IS_LOADING = "@@settings/IS_LOADING"
}

export interface settingsState {
    readonly isLoading: boolean;
    readonly settings: Settings;
    readonly errors?: string;
}