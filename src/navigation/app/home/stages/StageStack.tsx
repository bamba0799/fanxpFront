import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StagesStackParamsList } from './types';

// screens
import { Main } from '@screens/stages/Main';
import { Details } from '@screens/stages/Details';
import { TeamStack } from '../team';

const Stack = createNativeStackNavigator<StagesStackParamsList>();

const Phases = () => {
  return (
    <Stack.Navigator
      initialRouteName="Stages/Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Stages/Main"
        component={Main}
      />
      <Stack.Screen
        name="Stages/Details"
        component={Details}
      />
      <Stack.Screen
        name="Stages/Team"
        component={TeamStack}
      />
    </Stack.Navigator>
  );
};

export default Phases;
