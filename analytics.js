export function calculateClassAverage(students, courseId) {
  const grades = students.flatMap((student) =>
    student.courses
      .filter((course) => course.courseId === courseId)
      .map((course) => course.grade)
  );

  if (grades.length === 0) {
    return 0;
  }

  const total = grades.reduce((sum, grade) => sum + grade, 0);
  return total / grades.length;
}

export function findTopStudent(students) {
  if (students.length === 0) {
    return null;
  }

  return students.reduce((top, student) =>
    student.getAverage() > top.getAverage() ? student : top
  );
}

export function filterStudents(students, criteriaFn) {
  return students.filter((student) => criteriaFn(student) === true);
}
