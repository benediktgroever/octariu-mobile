import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { 
    LoginScreen,
} from './screens';

import {
    LOGIN,
} from './Routes';

const Stack = createNativeStackNavigator();

const NonAuthStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'none',
            }}>
            <Stack.Screen
                name={LOGIN}
                component={LoginScreen}
            />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export { NonAuthStack }