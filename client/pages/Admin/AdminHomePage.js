import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BackHandler, Alert } from "react-native";
import { useDispatch } from "react-redux";
// import { logout } from "../../context/actions/authActions";
// import { CommonActions } from "@react-navigation/native";
import {
  DrawerActions,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminHomePage = ({ route }) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const handleBackPress = () => {
    if (isFocused) {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [isFocused]); // Add isFocused to the dependency array
  const handleNotifications = () => {
    navigation.navigate("Notification");
  };
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const [collageName, setCollageName] = useState(
    route.params?.collageName || ""
  );
  const [image, setImage] = useState(route.params?.image || null);

  useEffect(() => {
    setCollageName(route.params?.collageName || "Collage Name");
    setImage(route.params?.image || null);
  }, [route.params?.collageName, route.params?.image]);

  const handleCardPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer} style={styles.iconContainer}>
              <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerText}>My College App</Text>
            <TouchableOpacity
              onPress={handleNotifications}
              style={styles.iconContainer}
            >
              <Ionicons name="notifications" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.bigCard}>
            <Image
              source={require("../../image/3033337.png")}
              style={styles.bigCardImage}
            />
            <Text style={styles.bigCardText}>Collage Name</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.featuresText}>Features</Text>
          </View>
          <View style={styles.cards}>
            <TouchableOpacity
              onPress={() => handleCardPress("TeacherAttendance")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("AdminTimetable")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Timetable Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("Calender")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("TeacherTimetable")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Timetable</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("AdminReportNav")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("OnlineLibrary")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Online Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("StudentERP")}
              style={styles.card}
            >
              <Text style={styles.cardText}>App/WEb Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("AdminNotice")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Notice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCardPress("AdminAssign")}
              style={styles.card}
            >
              <Text style={styles.cardText}>Assign Subjects</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FF6347",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    padding: 5,
  },
  bigCard: {
    margin: 20,
    width: "90%",
    aspectRatio: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bigCardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    top: 60,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  bigCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  card: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: "#FF6347",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  features: {
    padding: 10,
    alignItems: "center",
  },
  featuresText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF6347",
  },
});

export default AdminHomePage;

// import React, { useState, useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { BackHandler, Alert } from "react-native";
// import { useDispatch } from "react-redux";
// // import { logout } from "../../context/actions/authActions";
// // import { CommonActions } from "@react-navigation/native";
// import {
//   DrawerActions,
//   useIsFocused,
//   useNavigation,
// } from "@react-navigation/native";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const AdminHomePage = ({ route }) => {
//   const navigation = useNavigation();

//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();

//   const handleBackPress = () => {
//     if (isFocused) {
//       Alert.alert(
//         "Exit App",
//         "Are you sure you want to exit?",
//         [
//           {
//             text: "Cancel",
//             onPress: () => null,
//             style: "cancel",
//           },
//           { text: "Exit", onPress: () => BackHandler.exitApp() },
//         ],
//         { cancelable: false }
//       );
//       return true;
//     } else {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       handleBackPress
//     );

//     return () => backHandler.remove();
//   }, [isFocused]); // Add isFocused to the dependency array
//   const handleNotifications = () => {
//     navigation.navigate("Notification");
//   };
//   const openDrawer = () => {
//     navigation.dispatch(DrawerActions.openDrawer());
//   };

//   const [collageName, setCollageName] = useState(
//     route.params?.collageName || ""
//   );
//   const [image, setImage] = useState(route.params?.image || null);

//   useEffect(() => {
//     setCollageName(route.params?.collageName || "Collage Name");
//     setImage(route.params?.image || null);
//   }, [route.params?.collageName, route.params?.image]);

//   const handleCardPress = (screenName) => {
//     navigation.navigate(screenName);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={openDrawer} style={styles.iconContainer}>
//             <Ionicons name="menu" size={30} color="white" />
//           </TouchableOpacity>

//           <Text style={styles.headerText}>My College App</Text>
//           <TouchableOpacity
//             onPress={handleNotifications}
//             style={styles.iconContainer}
//           >
//             <Ionicons name="notifications" size={30} color="white" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.bigCard}>
//           <Image
//             source={require("../../image/3033337.png")}
//             style={styles.bigCardImage}
//           />
//           <Text style={styles.bigCardText}>Collage Name</Text>
//         </TouchableOpacity>
//         <View style={styles.features}>
//           <Text style={styles.featuresText}>Features</Text>
//         </View>
//         <View style={styles.cards}>
//           <TouchableOpacity
//             onPress={() => handleCardPress("AdminAttendance")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Attendance</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("AdminTimetable")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Timetable Create</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("Calender")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Calendar</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("TeacherTimetable")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Timetable</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("AdminReport")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Reports</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("OnlineLibrary")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Online Library</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("StudentERP")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>ERP</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleCardPress("AdminNotice")}
//             style={styles.card}
//           >
//             <Text style={styles.cardText}>Notice</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   header: {
//     padding: 20,
//     backgroundColor: "#FF6347",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   iconContainer: {
//     padding: 5,
//   },
//   bigCard: {
//     margin: 20,
//     width: "90%",
//     aspectRatio: 2,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   bigCardText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "black",
//     top: 60,
//   },
//   cards: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },
//   bigCardImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//     position: "absolute",
//   },
//   card: {
//     width: "40%",
//     aspectRatio: 1,
//     backgroundColor: "#FF6347",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 5,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   cardText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   features: {
//     padding: 10,
//     alignItems: "center",
//   },
//   featuresText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#FF6347",
//   },
// });

// export default AdminHomePage;
