// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from '../src/pages/HomeScreen';
import DetailsScreen from '../src/pages/DetailsScreen';
import LoginPage from '../src/pages/LoginPage';
import DataScreen from '../src/pages/DataScreen';


const Stack = createNativeStackNavigator();


function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Data"
                    component={DataScreen}
                    options={{ title: "ข้อมูล" }}r
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: "หน้าหลักของฉัน" }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{ title: "รายละเอียด" }}
                />
                <Stack.Screen
                    name="LoginPage"
                    component={LoginPage}
                    options={{ title: "Login" }}
                /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default AppNavigator;
