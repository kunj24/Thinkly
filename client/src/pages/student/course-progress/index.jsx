import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLecture");

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
            className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl px-4 py-2 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <h1 className="text-xl font-bold text-slate-800 hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button 
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg m-4 overflow-hidden">
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg m-4 mt-0">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLecture?.title}</h2>
            <p className="text-slate-600">Continue watching to track your progress</p>
          </div>
        </div>
        <div
          className={`fixed top-[88px] right-0 bottom-0 w-[400px] bg-white/90 backdrop-blur-md border-l border-slate-200/50 shadow-2xl transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-white/80 backdrop-blur-sm w-full grid-cols-2 p-1 h-14 border-b border-slate-200/50">
              <TabsTrigger
                value="content"
                className="text-slate-700 rounded-xl h-full font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-slate-700 rounded-xl h-full font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className="flex items-center space-x-3 p-3 text-sm font-medium cursor-pointer bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200"
                        key={item._id}
                        onClick={() => setCurrentLecture(item)}
                      >
                        <div className="flex-shrink-0">
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) => progressItem.lectureId === item._id
                          )?.viewed ? (
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                              <Play className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-slate-700 flex-1">{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">About this course</h2>
                  <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4">
                    <p className="text-slate-600 leading-relaxed">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold">You can't view this page</DialogTitle>
            <DialogDescription className="text-slate-600">
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px] bg-gradient-to-br from-green-50 to-blue-50 border border-slate-200/50 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-2xl font-bold text-center mb-4">🎉 Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-4 text-center">
              <Label className="text-lg text-slate-700 font-medium">You have completed the course</Label>
              <div className="flex flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate("/student-courses")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-xl px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  My Courses Page
                </Button>
                <Button 
                  onClick={handleRewatchCourse}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-6 py-2 font-medium transition-all duration-200"
                >
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
