import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Picker } from "@react-native-picker/picker";

const TimetableCard = ({ subjectName, start, end, isBreak }) => (
  <View style={styles.timetableCard}>
    <Text style={[styles.timetableCardText, isBreak && styles.breakText]}>
      Subject: {subjectName}
    </Text>
    <Text style={[styles.timetableCardText, isBreak && styles.breakText]}>
      Start Time: {start}
    </Text>
    <Text style={[styles.timetableCardText, isBreak && styles.breakText]}>
      End Time: {end}
    </Text>
  </View>
);

const AdminTimetableView = () => {
  const [departmentName, setDepartmentName] = useState(null);
  const [semester, setSemester] = useState(null);
  const [year, setYear] = useState(null);
  const [day, setDay] = useState("Monday");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  const departments = ["EEE", "CSE", "CEN"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const years = ["1st year", "2nd year", "3rd year", "4th year"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    fetchTimetable();
  }, [day, departmentName, semester, year]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const adminCollection = collection(db, "Admins");
      const adminDocs = await getDocs(adminCollection);

      const fetchedTimetable = [];

      for (const adminDoc of adminDocs.docs) {
        const authCollection = collection(db, "Admins", adminDoc.id, "timetables");
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

      const filteredTimetable = fetchedTimetable.filter((timetable) => {
        let matches = timetable.timetable.some((slot) => slot.day.toLowerCase() === day.toLowerCase());
        if (departmentName) {
          matches = matches && timetable.department === departmentName;
        }
        if (semester) {
          matches = matches && timetable.semester === semester;
        }
        if (year) {
          matches = matches && timetable.year === year;
        }
        return matches;
      });

      const finalTimetable = filteredTimetable.flatMap((teacher) =>
        teacher.timetable.filter((slot) => slot.day.toLowerCase() === day.toLowerCase())
      );

      setTimetable(finalTimetable);
    } catch (error) {
      console.error("Error fetching timetable: ", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Picker
          style={styles.picker}
          selectedValue={day}
          onValueChange={(itemValue) => setDay(itemValue)}
        >
          {days.map((day) => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <Picker
          style={styles.picker}
          selectedValue={departmentName}
          onValueChange={(itemValue) => setDepartmentName(itemValue)}
        >
          <Picker.Item label="Select Department" value={null} />
          {departments.map((department) => (
            <Picker.Item key={department} label={department} value={department} />
          ))}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={semester}
          onValueChange={(itemValue) => setSemester(itemValue)}
        >
          <Picker.Item label="Select Semester" value={null} />
          {semesters.map((sem) => (
            <Picker.Item key={sem} label={`Semester ${sem}`} value={sem} />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <Picker
          style={styles.picker}
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          <Picker.Item label="Select Year" value={null} />
          {years.map((yr) => (
            <Picker.Item key={yr} label={yr} value={yr} />
          ))}
        </Picker>
      </View>
      <View style={styles.timetableContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : timetable.length > 0 ? (
          <ScrollView>
            {timetable.map((slot, index) => (
              <TimetableCard
                key={index}
                subjectName={slot.subject}
                start={slot.start}
                end={slot.end}
                isBreak={slot.subject.toLowerCase() === "break"}
              />
            ))}
          </ScrollView>
        ) : (
          <Text>No data found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  timetableContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timetableCard: {
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  timetableCardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  breakText: {
    color: "red",
  },
});

export default AdminTimetableView;
