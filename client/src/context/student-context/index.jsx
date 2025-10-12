import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
        coursesLoading,
        setCoursesLoading,
        courseDetailsLoading,
        setCourseDetailsLoading,
        orderLoading,
        setOrderLoading,
        progressLoading,
        setProgressLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
