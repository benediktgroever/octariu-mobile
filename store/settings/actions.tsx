import auth from '@react-native-firebase/auth';
import { RootState, store } from "..";
import { SettingsActionType, SettingsResponse } from "./types";
import {
    Vibration
} from 'react-native';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import { Method, baseFetch } from '../baseFetch';
import { useSelector } from 'react-redux';

const UNIQUE_RANDOM_NOTIFICATION_ID = 'some-random-id';

const getSettings = async () => {
    const name = await auth().currentUser?.displayName;
    const email = await auth().currentUser?.email;
    const photoURL = await auth().currentUser?.photoURL;
    const emailVerified = await auth().currentUser?.emailVerified;
    const settings = await baseFetch({
        method: Method.GET,
        url: '/settings/get',
        params: {
            name,
            email,
            photoURL,
            emailVerified,
        },
    }) as SettingsResponse;
    store.dispatch({ type: SettingsActionType.GET_SETTINGS_RESPONSE, payload: settings })
    return settings;
}

type updateSettingsParams = {
    timerInterval?: number,
    timerOn?: number,
}

const updateSettings = async (params: updateSettingsParams) => {
    const name = await auth().currentUser?.displayName;
    const email = await auth().currentUser?.email;
    const photoURL = await auth().currentUser?.photoURL;
    const emailVerified = await auth().currentUser?.emailVerified;
    const settings = await baseFetch({
        method: Method.POST,
        url: '/settings/update',
        params: {
            ...params,
            name,
            email,
            photoURL,
            emailVerified,
        },
    }) as SettingsResponse;
    store.dispatch({ type: SettingsActionType.GET_SETTINGS_RESPONSE, payload: settings })
    return settings;
}

const createTimeOutNotification = async (countDownEndTime: number) => {

    // Request permissions (required for iOS)
    await notifee.requestPermission({ criticalAlert: true })

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'local.wav',
    });

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: countDownEndTime
    };

    await notifee.createTriggerNotification(
        {
            id: UNIQUE_RANDOM_NOTIFICATION_ID,
            title: 'Your rest timer is up',
            body: 'Get back to work',
            android: {
                channelId,
                vibrationPattern: [300, 500],
            },
            ios: {
                critical: true,
                sound: 'local.wav',
            },
        },
        trigger,
    );
}

const cancelTimeOutNotification = async () => {
    await notifee.cancelNotification(UNIQUE_RANDOM_NOTIFICATION_ID);
}

type paramsSetCountDownTime = {
    cancel: boolean,
    countDownSetId: string,
}

const setCountDownTime = async (params: paramsSetCountDownTime) => {
    const settings = store.getState().settings.settings;
    if(settings.timerOn === undefined || settings.timerOn === false){
        return;
    }

    const countDownEndTime = settings.timerInterval ? Date.now() + settings.timerInterval * 1000 : 0;

    try {
        if (settings.countDownEndTime === undefined) {
            // No count down defined, acquire count down lock
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params, countDownEndTime } })
            if (params.cancel === false && settings.timerInterval) {
                Vibration.vibrate();
                await createTimeOutNotification(countDownEndTime);
            }
        } else if (settings.countDownEndTime  <= Date.now()) {
            // Count down expired allow new set to acquire count down timer lock
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params, countDownEndTime } })
            if (params.cancel === false && settings.timerInterval) {
                Vibration.vibrate();
                await createTimeOutNotification(countDownEndTime);
            }
        } else if (store.getState().settings.settings.countDownSetId === params.countDownSetId) {
            // Current set with count down lock wants to update count down time
            await cancelTimeOutNotification();
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params } })
        }
    } catch (error) {
        console.error(error);
    }
};

export {
    setCountDownTime,
    getSettings,
    updateSettings,
}
