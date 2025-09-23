import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDown, Star, Clock, Users, BookOpen, Filter, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function clearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
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
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  const activeFiltersCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Discover Courses
          </h1>
          <p className="text-lg text-slate-600">
            Find the perfect course to advance your skills and career
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear ({activeFiltersCount})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {Object.keys(filterOptions).map((keyItem) => (
                    <div key={keyItem} className="border-b border-slate-100 last:border-b-0">
                      <div className="p-6">
                        <h4 className="font-semibold text-slate-900 mb-4 capitalize">
                          {keyItem === 'primaryLanguage' ? 'Primary Language' : keyItem.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-3">
                          {filterOptions[keyItem].map((option) => (
                            <Label 
                              key={option.id}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <Checkbox
                                checked={
                                  filters &&
                                  Object.keys(filters).length > 0 &&
                                  filters[keyItem] &&
                                  filters[keyItem].indexOf(option.id) > -1
                                }
                                onCheckedChange={() =>
                                  handleFilterOnChange(keyItem, option)
                                }
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                                {option.label}
                              </span>
                            </Label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-medium text-slate-900">
                  {studentViewCoursesList.length} {studentViewCoursesList.length === 1 ? 'Course' : 'Courses'} Found
                </p>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-slate-600 mt-1">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value)}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="cursor-pointer"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Course Grid */}
            <div className="space-y-6">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.map((courseItem) => (
                  <Card
                    key={courseItem?._id}
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                    className="group cursor-pointer bg-white hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-80 h-48 sm:h-56 flex-shrink-0 relative overflow-hidden">
                          <img
                            src={courseItem?.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                                {courseItem?.title}
                              </CardTitle>
                              
                              <p className="text-slate-600 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Created by <span className="font-semibold text-slate-900">{courseItem?.instructorName}</span>
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {courseItem?.curriculum?.length || 0} {(courseItem?.curriculum?.length || 0) <= 1 ? 'Lecture' : 'Lectures'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {courseItem?.level || 'N/A'} Level
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {courseItem?.students?.length || 0} Students
                                </span>
                                {courseItem?.primaryLanguage && (
                                  <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 text-center">🌐</span>
                                    {courseItem?.primaryLanguage}
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-slate-600 line-clamp-2 mb-4">
                                {courseItem?.subtitle || courseItem?.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="text-2xl font-bold text-blue-600">
                                ${courseItem?.pricing}
                              </div>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                View Course
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : loadingState ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <Skeleton className="w-80 h-56" />
                          <div className="flex-1 p-6 space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-16 w-full" />
                            <div className="flex justify-between">
                              <Skeleton className="h-8 w-20" />
                              <Skeleton className="h-8 w-32" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No Courses Found</h3>
                  <p className="text-slate-600 mb-6">Try adjusting your filters or search criteria</p>
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
