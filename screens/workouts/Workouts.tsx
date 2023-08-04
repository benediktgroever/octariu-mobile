import { NavBar } from '../../common';
import {
    WorkoutItem
} from './Workout/WorkoutItem';
import {
    WorkoutList
} from './WorkoutList/WorkoutList';
import {
    Workout
} from '../../store';

const WorkoutsScreen = ({ navigation, route }: any) => {

    const hasWorkout = route.params && route.params.hasOwnProperty("workout");
    const workout: Workout = hasWorkout ? route.params["workout"] : undefined;

    return (
        <NavBar navigation={navigation}>
            {
                hasWorkout ? <WorkoutItem
                    workout={workout}
                    navigation={navigation}
                /> : <WorkoutList navigation={navigation} />
            }
        </NavBar>
    );
};

export { WorkoutsScreen }