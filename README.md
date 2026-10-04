# Assignment 3 - University Course Management System

This project is the core logic of a small university grading system, written in plain
JavaScript and run with Node.js. It fetches student data from a simulated (slow)
database, turns the raw data into `Student` objects with a read-only `id`, and prints
an analytics report. The main topics it demonstrates are **asynchronous callbacks**,
**ES6 classes**, **object property descriptors** and **array manipulation**.

## How to Run

No external packages are used, so there is nothing to install. With Node.js installed:

```bash
node main.js
```

or

```bash
npm start
```

After the "Fetching data from database..." message the program waits about 2 seconds
(the simulated database delay) and then prints the rest of the output.

## File Organization

- **`models.js`** - Exports the `Student` class. The constructor takes `id`, `name`
  and `courses`. The `id` is defined with `Object.defineProperty()` using
  `writable: false` and `configurable: false`, so it cannot be changed or deleted
  after the object is created. I also set `enumerable: true` so the `id` still shows
  up when the object is logged. The `courses` array is copied in the constructor, so
  the student never shares the same array with the raw database data. The class has
  two methods: `addCourse(courseId, grade)` adds a new course record, and
  `getAverage()` uses `reduce()` to calculate the average grade (it returns `0` for a
  student with no courses instead of `NaN`).
- **`database.js`** - Exports `fetchStudents(callback)`. It uses `setTimeout` to
  simulate a 2-second delay and then calls the callback with the raw student array
  given in the assignment. The raw data itself is not exported, so `fetchStudents` is
  the only way to get it, like a real database.
- **`analytics.js`** - Exports three helper functions:
  - `calculateClassAverage(students, courseId)` collects the grades of every student
    who took that course (`flatMap` + `filter` + `map`) and returns their average.
  - `findTopStudent(students)` uses `reduce()` to compare the students one by one and
    returns the one with the highest overall average.
  - `filterStudents(students, criteriaFn)` is a higher-order function. It takes a
    callback and returns a new array of the students for whom the callback returns
    `true`.
- **`main.js`** - The entry point. It imports everything, calls `fetchStudents`, and
  does all the work **inside the callback**: converts the raw data into `Student`
  instances, tries to change the first student's `id` to `999` to prove it stays the
  same, and prints the analytics report for course 101 and course 102.
- **`package.json`** - Contains `"type": "module"` so Node.js treats the `.js` files as
  ES modules (needed for `import` / `export`), and a `start` script.
- **`README.md`** - This file.

## Output

```
Fetching data from database...
Data received!

Testing Immutability:
Original ID: 1
Attempting to change ID to 999...
(Blocked: Cannot assign to read only property 'id' of object '#<Student>')
Final ID: 1 (Success: ID did not change)

--- Analytics Report ---
Class Average for Course 101: 73.33
Top Student: Ali (Average: 87.5)
Students in Course 102: Ali, Zeynep, Ahmet
```

**Note about the top student:** the example output in the assignment says
`Top Student: Zeynep (Average: 82.5)`, but with the given data Ali's average is
(90 + 85) / 2 = **87.5**, which is higher than Zeynep's (70 + 95) / 2 = 82.5. So my
program prints Ali, which I believe is the correct result.

## Challenges Faced

- **The read-only `id` threw an error instead of failing silently:** I expected
  `students[0].id = 999` to just be ignored. But because the files are ES modules,
  they automatically run in *strict mode*, and in strict mode assigning to a
  read-only property throws a `TypeError`. Without handling it, the program crashed
  before printing the report. I wrapped the assignment in a `try/catch` and then
  compare the `id` with its original value, so the test actually checks that the
  value did not change instead of just printing "Success".
- **Understanding the order of asynchronous code:** at first it was confusing that
  code written after the `fetchStudents(...)` call runs *before* the data arrives.
  `setTimeout` does not stop the program, it only schedules the callback for later.
  That is why everything that uses the student data has to be inside the callback in
  `main.js`.
- **Objects are passed by reference:** if I had written `this.courses = courses` in
  the constructor, the `Student` object and the raw database data would point to the
  same array, and changing one would silently change the other. I used
  `courses.map((course) => ({ ...course }))` to copy the array and every course
  object inside it. For the same reason `addCourse` builds a new array with the spread
  operator instead of using `push`.
- **Using `reduce()` without an initial value:** in `findTopStudent` the first
  student becomes the starting "best student". This works well, but `reduce()`
  throws an error on an empty array when there is no initial value, so I return
  `null` early if the list is empty.
- **Students who did not take a course:** for `calculateClassAverage` I did not want
  students who never took the course to count as `0` and lower the average. With
  `flatMap`, those students return an empty array and simply disappear from the list
  of grades, so only real grades are averaged.
- **Number formatting:** `toFixed(2)` returns a string, and it turns `87.5` into
  `"87.50"`. Wrapping it in `Number()` gives `73.33` and `87.5`, which matches the
  format in the assignment.
- **Setting up ES modules in Node.js:** without `"type": "module"` in
  `package.json`, older Node.js versions give
  `SyntaxError: Cannot use import statement outside a module`. Adding that line makes
  `import` / `export` work everywhere.
