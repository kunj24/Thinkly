const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructorId, forceDelete = false } = req.body;

    // First, check if the course exists and belongs to the instructor
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    // Verify that the course belongs to the requesting instructor
    if (course.instructorId !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course!",
      });
    }

    // Check if any students have purchased this course
    const studentsWithCourse = await StudentCourses.find({
      "courses.courseId": id
    });

    if (studentsWithCourse.length > 0 && !forceDelete) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete course. Students have already enrolled in this course. Use forceDelete: true to proceed with cleanup.",
        enrolledStudents: studentsWithCourse.length,
        canForceDelete: true
      });
    }

    // If force delete is enabled and students exist, clean up their records
    if (forceDelete && studentsWithCourse.length > 0) {
      // Remove the course from all student course lists
      await StudentCourses.updateMany(
        { "courses.courseId": id },
        { $pull: { courses: { courseId: id } } }
      );
      
      // Delete all progress records for this course
      await CourseProgress.deleteMany({ courseId: id });
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    // Clean up any remaining progress records
    await CourseProgress.deleteMany({ courseId: id });

    res.status(200).json({
      success: true,
      message: forceDelete && studentsWithCourse.length > 0 
        ? `Course deleted successfully. Cleaned up records for ${studentsWithCourse.length} students.`
        : "Course deleted successfully",
      deletedCourse: {
        id: course._id,
        title: course.title,
        studentsAffected: studentsWithCourse.length
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting the course!",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  deleteCourseByID,
};
