import { NavBar } from '../common/NavBar';
import {View, Text} from 'react-native';


// const WorkoutsScreen = ({navigation}: any) => {
//     return (
//         <NavBar navigation={navigation}>
//             <View>
//                 <View>
//                     <Text> Workouts </Text>
//                 </View>
//             </View>
//         </NavBar>
//     );
// };

// const ExercisesScreen = ({navigation}: any) => {
//     return (
//         <NavBar navigation={navigation}>
//             <View>
//                 <View>
//                     <Text> Exercises </Text>
//                 </View>
//             </View>
//         </NavBar>
//     );
// };

const HistoryScreen = ({navigation}: any) => {
    return (
        <NavBar navigation={navigation}>
            <View>
                <View>
                    <Text> History </Text>
                </View>
            </View>
        </NavBar>
    );
};

import { WorkoutsScreen } from './workouts/Workouts';
import { ExercisesScreen } from './exercises/Exercises';
import { SettingsScreen } from './settings/Settings';
import { LoginScreen } from './login/Login';

export { WorkoutsScreen, ExercisesScreen, HistoryScreen, SettingsScreen, LoginScreen }