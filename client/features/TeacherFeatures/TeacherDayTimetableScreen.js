import React from "react";
import { ScrollView, ScrollScrollView, Text } from "react-native";
import EventTimetableScreen from "../StudentFeatures/EventTimetableScreen";
import TeacherSubjectTimetableScreen from "./TeacherSubjectTimetableScreen";

export function SundayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Sunday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={0} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function MondayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Monday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen  />
      <TeacherSubjectTimetableScreen dayIndex={1} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function TuesdayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Tuesday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={2} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function WednesdayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Wednesday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={3} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function ThursdayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Thursday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={4} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function FridayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Friday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={5} timetable={dayTimetable} />
    </ScrollView>
  );
}

export function SaturdayScreen({ dayTimetable }) {
  if (dayTimetable.length === 0) {
    return <Text>No timetable data for Saturday</Text>;
  }

  return (
    <ScrollView>
      <EventTimetableScreen />
      <TeacherSubjectTimetableScreen dayIndex={6} timetable={dayTimetable} />
    </ScrollView>
  );
}
