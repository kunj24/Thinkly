import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Users, ArrowRight, BookOpen, Zap } from "lucide-react";

function StudentHomePage() {
  const { 
    studentViewCoursesList, 
    setStudentViewCoursesList,
    coursesLoading,
    setCoursesLoading 
  } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    setCoursesLoading(true);
    try {
      const response = await fetchStudentViewCourseListService();
      if (response?.success) setStudentViewCoursesList(response?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Transform Your Future
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                Learning that gets you
                <span className="block text-blue-600">ahead</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Skills for your present and your future. Join thousands of learners 
                building careers with cutting-edge courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/courses")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10">
                <img
                  src={banner}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl shadow-blue-900/20"
                  alt="Learning Banner"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover courses across various domains and start your learning journey
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                key={categoryItem.id}
                variant="outline"
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                className="h-auto p-6 flex flex-col items-center gap-3 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {categoryItem.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Handpicked courses from top instructors to accelerate your learning
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coursesLoading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.slice(0, 8).map((courseItem) => (
                <div
                  key={courseItem._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={courseItem?.image}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={courseItem?.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium rounded-full">
                        {courseItem?.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-slate-700">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {courseItem?.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {courseItem?.instructorName}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {courseItem?.curriculum?.length || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {courseItem?.students?.length || 0} students
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-blue-600">
                          ${courseItem?.pricing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">No Courses Found</h3>
                <p className="text-slate-600">Check back later for new courses</p>
              </div>
            )}
          </div>
          {studentViewCoursesList && studentViewCoursesList.length > 8 && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate("/courses")}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
