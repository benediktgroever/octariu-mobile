import { sendMessage } from 'react-native-watch-connectivity';
import { store } from ".";
import { WorkoutSetResponse } from "../common/types";
import { SetActionTypes } from "./sets/types";
import { WorkoutActionTypes } from "./workouts/types";

const processMessageFromIPhone = async (data: WorkoutSetResponse) => {
    if(data.workouts.created.length > 0){
        store.dispatch({ type: WorkoutActionTypes.CREATE_WORKOUTS, payload: data.workouts.created });
    }
    if(data.workouts.deleted.length > 0){
        store.dispatch({ type: WorkoutActionTypes.DELETE_WORKOUTS, payload: data.workouts.deleted });
    }
    if(data.workouts.updated.length > 0){
        store.dispatch({ type: WorkoutActionTypes.UPDATE_WORKOUTS, payload: data.workouts.updated });
    }
    if(data.sets.created.length > 0){
        store.dispatch({ type: SetActionTypes.CREATE_SETS, payload: data.sets.created });
    }
    if(data.sets.deleted.length > 0){
        store.dispatch({ type: SetActionTypes.DELETE_SETS, payload: data.sets.deleted });
    }
    if(data.sets.updated.length > 0){
        store.dispatch({ type: SetActionTypes.UPDATE_SETS, payload: data.sets.updated });
    }
}

const sendMessageToIPhone = async (data: WorkoutSetResponse) => {
    sendMessage(
        {text: data}, 
        reply => {console.log(reply)},
        error => {console.log(error)},
    )
}

export { 
    processMessageFromIPhone,
    sendMessageToIPhone,
}