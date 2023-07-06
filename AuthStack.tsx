import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { 
  WorkoutsScreen,
  ExercisesScreen,
  HistoryScreen,
  SettingsScreen,
} from './screens';

import {
  WORKOUTS,
  EXERCISES,
  SETTINGS,
  HISTORY
} from './Routes';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'none',
            }}>
            <Stack.Screen
                name={WORKOUTS}
                component={WorkoutsScreen}
            />
            <Stack.Screen 
                name={SETTINGS}
                component={SettingsScreen} 
            />
            <Stack.Screen
                name={EXERCISES}
                component={ExercisesScreen}
            />
            <Stack.Screen
                name={HISTORY}
                component={HistoryScreen}
            />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AuthStack }