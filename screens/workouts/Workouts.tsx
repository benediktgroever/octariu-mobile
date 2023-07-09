import { NavBar } from '../../common';
import {
    Workout
} from './Workout/Workout';
import {
    WorkoutList
} from './WorkoutList/WorkoutList';
import {
    WorkoutType
} from '../../common/types';

const WorkoutsScreen = ({navigation, route}: any) => {

    let workout: WorkoutType | undefined = undefined;
    if(route.params){
        if(route.params.hasOwnProperty("workout")){
            workout = route.params["workout"];
        }
    }

    return (
        <NavBar navigation={navigation}>
            {
                workout ? <Workout 
                    workout={workout}
                    navigation={navigation}
                /> : <WorkoutList navigation={navigation}/>
            }
        </NavBar>
    );
};

export { WorkoutsScreen }