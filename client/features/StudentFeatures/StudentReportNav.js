// AdminTimetable.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text, View } from "react-native";

import StudentReportScreen from "./StudentReportScreen";
import StudentReportResponse from "./StudentReportResponse";

const Tab = createMaterialTopTabNavigator();

const StudentReportNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: {
          backgroundColor: "blue",
        },
      }}
    >
      <Tab.Screen name="Send" component={StudentReportScreen} />
      <Tab.Screen name="Response" component={StudentReportResponse} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f0f0f0",
  },
});

export default StudentReportNav;
