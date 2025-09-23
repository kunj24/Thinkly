import { GraduationCap, TvMinimalPlay, BookOpen, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-lg shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link to="/home" className="flex items-center group hover:scale-105 transition-transform duration-200">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
                            <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                EduNexus
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={() => {
                  location.pathname.includes("/courses")
                    ? null
                    : navigate("/courses");
                }}
                className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explore Courses
              </Button>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/student-courses")}
              className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              <TvMinimalPlay className="w-4 h-4" />
              My Courses
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
