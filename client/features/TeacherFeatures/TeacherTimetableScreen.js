import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../lib/firebase"; // Ensure you import your Firebase configuration

import {
  SundayScreen,
  MondayScreen,
  TuesdayScreen,
  WednesdayScreen,
  ThursdayScreen,
  FridayScreen,
  SaturdayScreen,
} from "./TeacherDayTimetableScreen";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

function TeacherTimetableScreen() {
  const navigation = useNavigation();

  const [timetable, setTimetable] = useState([]);
  const [index, setIndex] = useState(0); // State variable to track the current tab index
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (index > 0 && index < 7) {
          // If on one of the tab screens (Monday to Saturday), navigate back as if the back button was pressed twice
          navigation.dispatch(CommonActions.goBack());
          return true; // Prevent default back action
        } else {
          // Allow default back action
          return false;
        }
      }
    );

    return () => backHandler.remove();
  }, [navigation, index]);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const adminCollection = collection(db, "Admins");
      const adminDocs = await getDocs(adminCollection);

      const fetchedTimetable = [];

      for (const adminDoc of adminDocs.docs) {
        const authCollection = collection(
          db,
          "Admins",
          adminDoc.id,
          "timetables"
        );
        const querySnapshot = await getDocs(authCollection);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTimetable.push({
            id: adminDoc.id,
            authId: doc.id,
            ...data,
          });
        });
      }

      setTimetable(fetchedTimetable);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching timetable: ", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>; // Replace this with your actual loading indicator
  }

  // console.log(timetable, "time");
  // timetable.forEach((item) => {
  //   item.timetable.forEach((nestedItem) => {
  //     console.log(nestedItem);
  //   });
  // });

  const renderTabView = ({ route }) => {
    const dayMap = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    };

    const dayTimetable = timetable.flatMap((timetableItem) =>
      timetableItem.timetable.filter((slot) => slot.day === dayMap[route.name])
    );

    switch (route.name) {
      case "Sun":
        return <SundayScreen dayTimetable={dayTimetable} />;
      case "Mon":
        return <MondayScreen dayTimetable={dayTimetable} />;
      case "Tue":
        return <TuesdayScreen dayTimetable={dayTimetable} />;
      case "Wed":
        return <WednesdayScreen dayTimetable={dayTimetable} />;
      case "Thu":
        return <ThursdayScreen dayTimetable={dayTimetable} />;
      case "Fri":
        return <FridayScreen dayTimetable={dayTimetable} />;
      case "Sat":
        return <SaturdayScreen dayTimetable={dayTimetable} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "powderblue" },
        }}
      >
        <Tab.Screen name="Sun" children={renderTabView} />
        <Tab.Screen name="Mon" children={renderTabView} />
        <Tab.Screen name="Tue" children={renderTabView} />
        <Tab.Screen name="Wed" children={renderTabView} />
        <Tab.Screen name="Thu" children={renderTabView} />
        <Tab.Screen name="Fri" children={renderTabView} />
        <Tab.Screen name="Sat" children={renderTabView} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  tabBar: {
    backgroundColor: "#007bff",
  },
});

export default TeacherTimetableScreen;
