import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
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

const AdminAssignedView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const teacherCollection = collection(db, "Teachers");
    const teacherDocs = await getDocs(teacherCollection);

    const fetchedTeachers = [];

    for (const teacherDoc of teacherDocs.docs) {
      const authCollection = collection(db, "Teachers", teacherDoc.id, "auth");
      const q = query(authCollection, where("isAssigned", "==", true));
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTeachers().then(() => setRefreshing(false));
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredTeachers = teachers.filter((teacher) => {
      const teacherName = teacher.name.toLowerCase();
      const department = teacher.department.toLowerCase();
      const queryLowercase = query.toLowerCase();
      return (
        teacherName.includes(queryLowercase) ||
        department.includes(queryLowercase)
      );
    });
    setFilteredTeachers(filteredTeachers);
  };

  const renderTeacher = ({ item }) => {
    const { name, department, totalCredits, subjects } = item;
    return (
      <View style={styles.teacherCard}>
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.teacherDepartment}>Department: {department}</Text>
        <Text style={styles.teacherCredits}>
          Remaining Credits: {12 - totalCredits}
        </Text>
        <View style={styles.subjectsContainer}>
          <Text style={styles.subjectsTitle}>Subjects:</Text>
          {subjects.map((subject, index) => (
            <Text key={index} style={styles.subjectText}>
              {subject.name} ({subject.credits} credits)
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by teacher name or department"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : teachers.length > 0 ? (
        <FlatList
          data={searchQuery ? filteredTeachers : teachers}
          renderItem={renderTeacher}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text>No data found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  teacherCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  teacherDepartment: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  teacherCredits: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  subjectsContainer: {
    marginTop: 8,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subjectText: {
    fontSize: 14,
    color: "#333",
  },
});

export default AdminAssignedView;
