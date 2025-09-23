import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createOrderService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle, Star, Clock, Users, BookOpen, Award, ShoppingCart, Eye, Calendar } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    courseDetailsLoading,
    setCourseDetailsLoading,
    orderLoading,
    setOrderLoading,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    setCourseDetailsLoading(true);
    try {
      const response = await fetchStudentViewCourseDetailsService(
        currentCourseDetailsId
      );

      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setStudentViewCourseDetails(null);
    } finally {
      setCourseDetailsLoading(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreateOrder() {
    setOrderLoading(true);
    
    const orderPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "dummy",
      paymentStatus: "pending",
      orderDate: new Date(),
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    try {
      const response = await createOrderService(orderPayload);

      if (response.success) {
        // Order is automatically confirmed with dummy payment
        // Show success message and redirect
        setTimeout(() => {
          navigate("/student-courses");
        }, 2000);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setOrderLoading(false);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (courseDetailsLoading) return <Skeleton />;

  if (orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-96 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Processing Purchase... 🎉
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Your course is being enrolled. Please wait...
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {studentViewCourseDetails?.category}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                {studentViewCourseDetails?.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {studentViewCourseDetails?.subtitle}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Created by {studentViewCourseDetails?.instructorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Created {studentViewCourseDetails?.date?.split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>{studentViewCourseDetails?.primaryLanguage || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {studentViewCourseDetails?.students?.length || 0}{" "}
                    {(studentViewCourseDetails?.students?.length || 0) <= 1 ? "Student" : "Students"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Video */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                          : ""
                      }
                      width="100%"
                      height="100%"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  What you'll learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentViewCourseDetails?.objectives
                    ?.split(",")
                    .map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{objective.trim()}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {studentViewCourseDetails?.description}
                </p>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-indigo-500" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        curriculumItem?.freePreview
                          ? "cursor-pointer border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300"
                          : "cursor-not-allowed border-slate-200 bg-slate-50"
                      }`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          curriculumItem?.freePreview 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-slate-200 text-slate-500"
                        }`}>
                          {curriculumItem?.freePreview ? (
                            <PlayCircle className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {curriculumItem?.title}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Lesson {index + 1}
                          </p>
                        </div>
                      </div>
                      
                      {curriculumItem?.freePreview && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Free Preview</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-slate-200 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Course Stats */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-slate-900">4.8</span>
                        </div>
                        <p className="text-sm text-slate-600">Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-slate-900">
                            {studentViewCourseDetails?.students?.length || 0}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen className="w-4 h-4 text-green-500" />
                          <span className="font-bold text-slate-900">
                            {studentViewCourseDetails?.curriculum?.length || 0}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">Lessons</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span className="font-bold text-slate-900 capitalize">{studentViewCourseDetails?.level || 'Not specified'}</span>
                        </div>
                        <p className="text-sm text-slate-600">Level</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Purchase */}
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        ${studentViewCourseDetails?.pricing}
                      </div>
                      <p className="text-slate-600">One-time payment</p>
                    </div>
                    
                    <Button 
                      onClick={handleCreateOrder}
                      disabled={orderLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {orderLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Enroll Now
                        </>
                      )}
                    </Button>
                    
                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <div
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-900">{filteredItem?.title}</span>
                </div>
              ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-200">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
