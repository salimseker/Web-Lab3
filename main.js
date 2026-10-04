import { Student } from "./models.js";
import { fetchStudents } from "./database.js";
import { calculateClassAverage, findTopStudent, filterStudents } from "./analytics.js";

const TARGET_COURSE_AVERAGE = 101;
const TARGET_COURSE_FILTER = 102;
const ATTEMPTED_ID = 999;

function formatNumber(value) {
  return Number(value.toFixed(2));
}

function testImmutability(student) {
  const originalId = student.id;
  console.log("Testing Immutability:");
  console.log(`Original ID: ${originalId}`);
  console.log(`Attempting to change ID to ${ATTEMPTED_ID}...`);

  try {
    student.id = ATTEMPTED_ID;
  } catch (error) {
    console.log(`(Blocked: ${error.message})`);
  }

  const isUnchanged = student.id === originalId;
  const result = isUnchanged ? "Success: ID did not change" : "Failure: ID was changed";
  console.log(`Final ID: ${student.id} (${result})`);
}

function printAnalyticsReport(students) {
  console.log("--- Analytics Report ---");

  const classAverage = calculateClassAverage(students, TARGET_COURSE_AVERAGE);
  console.log(`Class Average for Course ${TARGET_COURSE_AVERAGE}: ${formatNumber(classAverage)}`);

  const topStudent = findTopStudent(students);
  if (topStudent) {
    console.log(`Top Student: ${topStudent.name} (Average: ${formatNumber(topStudent.getAverage())})`);
  } else {
    console.log("Top Student: none (no students found)");
  }

  const hasTakenCourse = (student) =>
    student.courses.some((course) => course.courseId === TARGET_COURSE_FILTER);
  const enrolledNames = filterStudents(students, hasTakenCourse).map((student) => student.name);
  console.log(`Students in Course ${TARGET_COURSE_FILTER}: ${enrolledNames.join(", ") || "none"}`);
}

console.log("Fetching data from database...");

fetchStudents((rawStudents) => {
  console.log("Data received!\n");

  const students = rawStudents.map(({ id, name, courses }) => new Student(id, name, courses));

  if (students.length === 0) {
    console.log("No students to analyze.");
    return;
  }

  testImmutability(students[0]);
  console.log();
  printAnalyticsReport(students);
});
