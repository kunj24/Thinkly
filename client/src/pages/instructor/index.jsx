import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { 
    instructorCoursesList, 
    setInstructorCoursesList,
    instructorLoading,
    setInstructorLoading 
  } = useContext(InstructorContext);

  async function fetchAllCourses() {
    setInstructorLoading(true);
    try {
      const response = await fetchInstructorCourseListService();
      if (response?.success) setInstructorCoursesList(response?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setInstructorLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-2xl border-r border-slate-200/50 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Instructor Panel
          </h2>
          <nav className="space-y-2">
            {menuItems.map((menuItem) => (
              <Button
                className={`w-full justify-start p-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === menuItem.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/80 hover:shadow-md border border-slate-200/50"
                }`}
                key={menuItem.value}
                variant="ghost"
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-3 h-5 w-5" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {activeTab === "dashboard" ? "Dashboard Overview" : "Course Management"}
            </h1>
            <p className="text-slate-600">
              {activeTab === "dashboard" 
                ? "Welcome back! Here's your teaching overview." 
                : "Manage and create your courses."}
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {instructorLoading ? (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-12">
                <LoadingSpinner size="lg" text="Loading courses..." />
              </div>
            ) : (
              menuItems.map((menuItem) => (
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {menuItem.component !== null ? menuItem.component : null}
                </TabsContent>
              ))
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
