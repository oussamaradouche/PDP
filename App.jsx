import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './src/routes/BottomTabNavigator ';
import {
	MD3LightTheme as DefaultTheme,
	Provider as PaperProvider,
} from "react-native-paper";


const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "#48BAB8",
		secondary: "#E4F5F5",
		outline: "#48BAB8",
		backdrop: "#FFFFFF",
		darkBlue: "#2F465B",
		grayColor: "#9E9E9E",
		redColor: "#EB1F35",
		secondaryContainer: "transparent",
		bgColor: "#FAFBFF",
		lightgray: "#F9F9F9",
	},
};
function App() {
	return (
		<SafeAreaProvider>
			<PaperProvider theme={theme}>
				<NavigationContainer>
					<BottomTabNavigator theme={theme} />
				</NavigationContainer>
			</PaperProvider>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
		backgroundColor: "blue",
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
});

export default App;
