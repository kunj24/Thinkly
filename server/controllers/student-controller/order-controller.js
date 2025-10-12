const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    // Create order with dummy payment confirmation
    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "confirmed",
      paymentMethod: "dummy",
      paymentStatus: "paid",
      orderDate: orderDate || new Date(),
      paymentId: `DUMMY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payerId: `DUMMY_PAYER_${userId}`,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    });

    await newlyCreatedCourseOrder.save();

    // Automatically add course to student's enrolled courses
    const studentCourses = await StudentCourses.findOne({
      userId: userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: courseId,
        title: courseTitle,
        instructorId: instructorId,
        instructorName: instructorName,
        dateOfPurchase: newlyCreatedCourseOrder.orderDate,
        courseImage: courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: userId,
        courses: [
          {
            courseId: courseId,
            title: courseTitle,
            instructorId: instructorId,
            instructorName: instructorName,
            dateOfPurchase: newlyCreatedCourseOrder.orderDate,
            courseImage: courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    // Update the course schema students
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
          paidAmount: coursePricing,
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Order created and confirmed successfully with dummy payment",
      data: {
        orderId: newlyCreatedCourseOrder._id,
        paymentStatus: "paid",
        orderStatus: "confirmed",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { createOrder, getOrderDetails };
