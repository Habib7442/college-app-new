import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Button,
  Alert,
} from "react-native";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const StudentReportResponse = () => {
  const [reports, setReports] = useState([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const reportCollection = collection(db, "Admins");
      const reportsSnapshot = await getDocs(reportCollection);
      const reportsData = [];

      for (const doc of reportsSnapshot.docs) {
        const reportsRef = collection(db, "Admins", doc.id, "reports");
        const reportsQuery = query(reportsRef, orderBy("submissionDate", "desc"));
        const reportsDocsSnapshot = await getDocs(reportsQuery);

        reportsDocsSnapshot.forEach((reportDoc) => {
          const data = reportDoc.data();
          // Convert Firestore Timestamps to JavaScript Date objects
          const submissionDate = data.submissionDate.toDate();
          const replyDate = data.replyDate ? data.replyDate.toDate() : null;
          reportsData.push({ id: reportDoc.id, adminUID: doc.id, ...data, submissionDate, replyDate });
        });
      }
      
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to fetch reports");
    }
  };

  const handleReply = async () => {
    if (!selectedReport || !reply) {
      Alert.alert("Error", "Please select a report and enter a reply.");
      return;
    }

    try {
      const reportRef = collection(
        db,
        "Admins",
        selectedReport.adminUID,
        "reports",
        selectedReport.id,
        "replies"
      );
      await addDoc(reportRef, {
        reply,
        timestamp: serverTimestamp(),
      });
      setReply("");
      setReplyModalVisible(false);
      fetchReports();
    } catch (error) {
      console.error("Error adding reply:", error);
      Alert.alert("Error", "Failed to add reply. Please try again.");
    }
  };

  const openReplyModal = (report) => {
    setSelectedReport(report);
    setReplyModalVisible(true);
  };

  const closeReplyModal = () => {
    setSelectedReport(null);
    setReplyModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportContainer}>
            <Text style={styles.reportType}>{report.reportType}</Text>
            <Text style={styles.reportDescription}>{report.description}</Text>
            <Text style={styles.reportSender}>Sender: {report.senderType}</Text>
            <Text style={styles.reportDate}>
              Submitted on: {report.submissionDate.toDateString()}
            </Text>
            {report.reply && (
              <View>
                <Text style={styles.replyTitle}>Reply:</Text>
                <Text style={styles.reply}>{report.reply}</Text>
                <Text style={styles.replyDate}>
                  Reply received on: {report.replyDate?.toDateString()}
                </Text>
              </View>
            )}
            <Button title="View Reply" onPress={() => openReplyModal(report)} />
          </View>
        ))}
      </ScrollView>
      <Modal visible={replyModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedReport && (
                <View>
                  <Text style={styles.replyTitle}>Reply:</Text>
                  <Text style={styles.reply}>{selectedReport.reply}</Text>
                  <Text style={styles.replyDate}>
                    Reply received on: {selectedReport.replyDate?.toDateString()}
                  </Text>
                </View>
              )}
            </ScrollView>
            <Button title="Close" onPress={closeReplyModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#87CEEB",
  },
  reportContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  reportType: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reportDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  reportSender: {
    marginTop: 5,
  },
  reportDate: {
    marginTop: 5,
    fontStyle: "italic",
  },
  replyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  reply: {
    marginTop: 5,
    fontStyle: "italic",
  },
  replyDate: {
    marginTop: 5,
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

export default StudentReportResponse;
