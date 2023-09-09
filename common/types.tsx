import { ViewStyle, Falsy } from 'react-native';
import { Set, Workout } from '../store';

export type WorkoutSetResponse = {
    "workouts": {
        "list": Workout[],
        "created": Workout[],
        "updated": Workout[],
        "deleted": Workout[],
    },
    "sets": {
        "list": Set[],
        "created": Set[],
        "updated": Set[],
        "deleted": Set[],
    },
}

export type StyleType = ViewStyle | Falsy
