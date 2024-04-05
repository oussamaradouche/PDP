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
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.grayColor,
				tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
				tabBarStyle: {
					display: 'flex',
					backgroundColor: theme.colors.secondary,
				},
				headerShown: false,
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
		>

			<Tab.Screen name={CameraName}>
				{props => <CameraScreen {...props} />}
			</Tab.Screen>
			<Tab.Screen name={GradesName}>
				{props => <GradesScreen {...props} />}
			</Tab.Screen>

		</Tab.Navigator>
	);
};

export default BottomTabNavigator;
