const FETCH_DELAY_MS = 2000;

const RAW_STUDENTS = [
  { id: 1, name: "Ali", courses: [{ courseId: 101, grade: 90 }, { courseId: 102, grade: 85 }] },
  { id: 2, name: "Zeynep", courses: [{ courseId: 101, grade: 70 }, { courseId: 102, grade: 95 }] },
  { id: 3, name: "Ahmet", courses: [{ courseId: 101, grade: 60 }, { courseId: 102, grade: 55 }] },
];

export function fetchStudents(callback) {
  setTimeout(() => {
    callback(RAW_STUDENTS);
  }, FETCH_DELAY_MS);
}
