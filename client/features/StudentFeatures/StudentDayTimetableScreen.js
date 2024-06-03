import React from "react";
import EventTimetableScreen from "./EventTimetableScreen";
import StudentSubjectTimetableScreen from "./StudentSubjectTimetableScreen";
import { View } from "react-native";

export function SundayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={0} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={0} timetable={timetable} />
    </View>
  );
}

export function MondayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={1} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={1} timetable={timetable} />
    </View>
  );
}

export function TuesdayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={2} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={2} timetable={timetable} />
    </View>
  );
}

export function WednesdayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={3} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={3} timetable={timetable} />
    </View>
  );
}

export function ThursdayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={4} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={4} timetable={timetable} />
    </View>
  );
}

export function FridayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={5} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={5} timetable={timetable} />
    </View>
  );
}

export function SaturdayScreen({ timetable }) {
  return (
    <View style={{ flex: 1 }}>
      <EventTimetableScreen dayIndex={6} timetable={timetable} />
      <StudentSubjectTimetableScreen dayIndex={6} timetable={timetable} />
    </View>
  );
}
