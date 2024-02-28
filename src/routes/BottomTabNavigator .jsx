// src/navigation/BottomTabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../screens/CameraScreen';
import GradesScreen from '../screens/GradesScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const CameraName = "Camera";
const GradesName = "Grades";

const BottomTabNavigator = ({ theme }) => {
  return (
    <Tab.Navigator
      initialRouteName={CameraName}
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === CameraName) {
            iconName = focused ? 'camera' : 'camera';
          } else if (rn === GradesName) {
            iconName = focused ? 'document' : 'document';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.colors.primary, 
        inactiveTintColor: theme.colors.grayColor,
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: {
          display: 'flex',
          backgroundColor: theme.colors.secondary, 
        },
      }}>

      <Tab.Screen name={CameraName} component={CameraScreen} />
      <Tab.Screen name={GradesName} component={GradesScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
