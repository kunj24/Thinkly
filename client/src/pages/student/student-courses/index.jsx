import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Play, BookOpen, Clock, Award, Calendar, ArrowRight } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }
  
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            My Learning Journey
          </h1>
          <p className="text-lg text-slate-600">
            Continue your learning adventure with your enrolled courses
          </p>
        </div>

        {/* Courses Grid */}
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-slate-600">
                {studentBoughtCoursesList.length} course{studentBoughtCoursesList.length > 1 ? 's' : ''} enrolled
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {studentBoughtCoursesList.map((course) => (
                <Card 
                  key={course.id} 
                  className="group cursor-pointer bg-white hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all duration-300 rounded-2xl overflow-hidden"
                  onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={course?.courseImage}
                        alt={course?.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-medium rounded-full">
                          Enrolled
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {course?.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {course?.instructorName}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Enrolled {new Date(course?.dateOfPurchase).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">65%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-6 pb-6">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-progress/${course?.courseId}`);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue Learning
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Your Learning Journey</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              You haven't enrolled in any courses yet. Explore our course catalog to find the perfect course for your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/courses")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/home")}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
