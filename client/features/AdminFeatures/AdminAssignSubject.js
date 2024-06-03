import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { db } from "../../../lib/firebase"; // Ensure you import your Firebase configuration
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const AdminAssignSubject = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const teacherCollection = collection(db, "Teachers");
    const teacherDocs = await getDocs(teacherCollection);

    const fetchedTeachers = [];

    for (const teacherDoc of teacherDocs.docs) {
      const authCollection = collection(db, "Teachers", teacherDoc.id, "auth");
      const q = query(authCollection, where("isApproved", "==", true));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTeachers.push({
          id: teacherDoc.id,
          authId: doc.id,
          ...data,
        });
      });
    }
    setTeachers(fetchedTeachers);
    setLoading(false);
  };


  const fetchSubjects = async () => {
    // Fetch subjects here. This is just a placeholder.
    setSubjects([
      { name: "Engineering Mathematics", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Engineering Chemistry", credits: 5 },
      { name: "DSA", credits: 8 },
      { name: "DBMS", credits: 7 },
      // Add more subjects as needed
    ]);
  };

  const handleAssignSubject = async () => {
    if (selectedTeacher && selectedSubject) {
      if (selectedTeacher.totalCredits + selectedSubject.credits > 12) {
        Alert.alert(
          "Error",
          `This teacher already has ${selectedTeacher.totalCredits} credits. Cannot assign more subjects. The maximum credit limit is 12.`
        );
      } else {
        setLoading(true);
        const teacherRef = doc(db, "Teachers", selectedTeacher.id, "auth", selectedTeacher.authId);
        await updateDoc(teacherRef, {
          subjects: arrayUnion(selectedSubject),
          totalCredits: selectedTeacher.totalCredits + selectedSubject.credits,
          isAssigned: true,
        });
        Alert.alert("Success", "Subject assigned successfully!");
        fetchTeachers(); // Refresh the teachers list
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please select a teacher and a subject.");
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.department.toLowerCase().includes(filter.toLowerCase())
  );

  // Get all unique departments from the teachers list
  const departments = [...new Set(teachers.map((teacher) => teacher.department))];

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Picker
            selectedValue={filter}
            onValueChange={(itemValue) => setFilter(itemValue)}
          >
            <Picker.Item label="Filter by department" value="" />
            {departments.map((department, index) => (
              <Picker.Item
                key={index}
                label={department}
                value={department}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedTeacher}
            onValueChange={(itemValue) => setSelectedTeacher(itemValue)}
          >
            <Picker.Item label="Select teacher" value="" />
            {filteredTeachers.map((teacher) => (
              <Picker.Item
                key={teacher.id}
                label={teacher.name}
                value={teacher}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          >
            <Picker.Item label="Select subject" value="" />
            {subjects.map((subject, index) => (
              <Picker.Item
                key={index}
                label={`${subject.name} (${subject.credits} credits)`}
                value={subject}
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleAssignSubject}>
            <Text style={styles.buttonText}>Assign Subject</Text>
          </TouchableOpacity>
          <View style={styles.teacherCardsContainer}>
            {teachers.map((teacher) => (
              <View key={teacher.id} style={styles.teacherCard}>
                <Text style={styles.teacherName}>{teacher.name}</Text>
                <Text style={styles.teacherCredits}>Remaining Credits: {12 - teacher.totalCredits}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  teacherCardsContainer: {
    marginTop: 20,
  },
  teacherCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherCredits: {
    fontSize: 16,
  },
});

export default AdminAssignSubject;
