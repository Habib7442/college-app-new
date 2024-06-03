// AdminTimetable.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text, View } from "react-native";
import AdminReportScreen from "./AdminReportScreen";
import AdminReportViewSCreen from "./AdminReportViewSCreen";

const Tab = createMaterialTopTabNavigator();

const AdminReportNav = () => {
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
      <Tab.Screen name="Send" component={AdminReportScreen} />
      <Tab.Screen name="Response" component={AdminReportViewSCreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f0f0f0",
  },
});

export default AdminReportNav;
