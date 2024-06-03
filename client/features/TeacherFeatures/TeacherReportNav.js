// AdminTimetable.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text, View } from "react-native";

import TeacherReportScreen from "./TeacherReportScreen";
import TeacherReportResponse from "./TeacherReportResponse";

const Tab = createMaterialTopTabNavigator();

const TeacherReportNav = () => {
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
      <Tab.Screen name="Send" component={TeacherReportScreen} />
      <Tab.Screen name="Response" component={TeacherReportResponse} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f0f0f0",
  },
});

export default TeacherReportNav;
