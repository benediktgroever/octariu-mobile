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

    let workout: Workout | undefined = undefined;
    if (route.params) {
        if (route.params.hasOwnProperty("workout")) {
            workout = route.params["workout"];
        }
    }

    return (
        <NavBar navigation={navigation}>
            {
                workout ? <WorkoutItem
                    workout={workout}
                    navigation={navigation}
                /> : <WorkoutList navigation={navigation} />
            }
        </NavBar>
    );
};

export { WorkoutsScreen }