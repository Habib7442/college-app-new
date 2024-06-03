import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../../../lib/firebase"; // Adjust the import path as needed
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import Checkbox from "expo-checkbox";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const TeacherAttendanceViewScreen = () => {
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentCollection = collection(db, "Students");
      const studentDocs = await getDocs(studentCollection);

      const fetchedStudents = [];

      for (const studentDoc of studentDocs.docs) {
        const attendanceCollection = collection(
          db,
          "Students",
          studentDoc.id,
          "attendance"
        );
        const attendanceDocs = await getDocs(attendanceCollection);

        if (attendanceDocs.size > 0) {
          const studentData = studentDoc.data();
          const attendanceData = attendanceDocs.docs.map((doc) => doc.data());

          fetchedStudents.push({
            id: studentDoc.id,
            ...studentData,
            attendanceData,
          });
        }
      }

      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };


  const handleFilterStudents = () => {
    if (department) {
      const filtered = students.filter((student) =>
        student.attendanceData.some(
          (attendance) =>
            attendance.department &&
            attendance.department.toLowerCase() === department.toLowerCase()
        )
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); // Reset to all students if no department is selected
    }
  };

  const resetFilter = async () => {
    setDepartment("");
    await fetchStudents(); // Ensure the data is fetched again
    setFilteredStudents(students); // Reset filtered students to all students
  };

  console.log(filteredStudents, "fill");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text>Select Department:</Text>
        <Picker
          selectedValue={department}
          onValueChange={(itemValue, itemIndex) => {
            setDepartment(itemValue);
            handleFilterStudents(); // Update filter when department changes
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Department" value="" />
          <Picker.Item label="CSE" value="cse" />
          <Picker.Item label="ECE" value="ece" />
          <Picker.Item label="CE" value="ce" />
          <Picker.Item label="ME" value="me" />
          {/* Add more departments as needed */}
        </Picker>
        <Button title="Filter" onPress={handleFilterStudents} />
        <Button title="Reset Filter" onPress={resetFilter} />
      </View>
      <FlatList
        data={filteredStudents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            {item.attendanceData.map((attendance, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.studentInfo}>
                  <Text>{`Student Name: ${attendance.name}`}</Text>
                  <Text>{`Department: ${attendance.department}`}</Text>
                  <Text>{`Roll No: ${attendance.rollNumber}`}</Text>
                </View>
                <View style={styles.attendanceInfo}>
                  <Text>{`Subject: ${attendance.subject}`}</Text>
                  <Text>{`Date: ${attendance.date
                    .toDate()
                    .toLocaleString()}`}</Text>
                  {attendance.imageUrl && (
                    <Image
                      style={styles.attendanceImage}
                      source={{ uri: attendance.imageUrl }}
                    />
                  )}
                </View>
              </View>
            ))}
          </>
        )}
        ListEmptyComponent={() => <Text>No attendance data found</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default TeacherAttendanceViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    flexDirection: "col",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  studentInfo: {
    flex: 1,
  },
  checkboxContainer: {
    marginRight: 10, // Adjust as needed
  },
  studentImage: {
    width: 50, // Adjust width and height as needed
    height: 50,
    borderRadius: 25, // Make it a circle
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 8,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginVertical: 16,
    borderRadius: 8,
  },
  attendanceInfo: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  attendanceImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});
