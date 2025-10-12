import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import { deleteCourseByIdService, fetchInstructorCourseListService } from "@/services";
import { Delete, Edit, AlertTriangle } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    course: null,
    loading: false
  });
  
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    setInstructorCoursesList,
  } = useContext(InstructorContext);
  
  const { auth } = useContext(AuthContext);

  async function handleDeleteCourse(forceDelete = false) {
    if (!deleteDialog.course || !auth?.user?._id) return;

    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await deleteCourseByIdService(
        deleteDialog.course._id,
        auth.user._id,
        forceDelete
      );

      if (response?.success) {
        // Refresh the courses list
        const updatedCourses = await fetchInstructorCourseListService();
        if (updatedCourses?.success) {
          setInstructorCoursesList(updatedCourses.data);
        }

        toast({
          title: "Success",
          description: response.message,
        });

        setDeleteDialog({ open: false, course: null, loading: false });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete course";
      const enrolledStudents = error.response?.data?.enrolledStudents;
      const canForceDelete = error.response?.data?.canForceDelete;

      if (canForceDelete && enrolledStudents > 0) {
        // Show option to force delete
        toast({
          title: "Warning",
          description: `${errorMessage} (${enrolledStudents} students enrolled)`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setDeleteDialog({ open: false, course: null, loading: false });
      }
    } finally {
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  }

  function openDeleteDialog(course) {
    setDeleteDialog({ open: true, course, loading: false });
  }

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                    <TableRow>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>
                        ${course?.students?.length * course?.pricing}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(course)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/50"
                        >
                          <Delete className="h-6 w-6" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => 
        !deleteDialog.loading && setDeleteDialog({ open, course: null, loading: false })
      }>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Course
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete <strong>"{deleteDialog.course?.title}"</strong>?
              </p>
              {deleteDialog.course?.students?.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                    ⚠️ Warning: {deleteDialog.course.students.length} student(s) are enrolled in this course.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    Deleting will remove this course from all student accounts and delete their progress.
                  </p>
                </div>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, course: null, loading: false })}
              disabled={deleteDialog.loading}
            >
              Cancel
            </Button>
            {deleteDialog.course?.students?.length > 0 ? (
              <Button
                variant="destructive"
                onClick={() => handleDeleteCourse(true)}
                disabled={deleteDialog.loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteDialog.loading ? "Deleting..." : "Force Delete"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => handleDeleteCourse(false)}
                disabled={deleteDialog.loading}
              >
                {deleteDialog.loading ? "Deleting..." : "Delete Course"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default InstructorCourses;
