const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Validate required env vars
if (!process.env.MONGO_URI) {
  console.error(
    "Missing MONGO_URI environment variable. Please create a .env file based on .env.example and set MONGO_URI."
  );
  process.exit(1);
}

// Import Models
const User = require("./models/User");
const Course = require("./models/Course");
const Order = require("./models/Order");
const StudentCourses = require("./models/StudentCourses");
const CourseProgress = require("./models/CourseProgress");

// Sample demo data
const demoUsers = [
  // Instructors
  {
    userName: "John Smith",
    userEmail: "john.instructor@demo.com",
    password: "instructor123",
    role: "instructor"
  },
  {
    userName: "Sarah Johnson",
    userEmail: "sarah.instructor@demo.com",
    password: "instructor123",
    role: "instructor"
  },
  {
    userName: "Michael Brown",
    userEmail: "michael.instructor@demo.com",
    password: "instructor123",
    role: "instructor"
  },
  // Students
  {
    userName: "Alice Wilson",
    userEmail: "alice.student@demo.com",
    password: "student123",
    role: "user"
  },
  {
    userName: "Bob Davis",
    userEmail: "bob.student@demo.com",
    password: "student123",
    role: "user"
  },
  {
    userName: "Emma Garcia",
    userEmail: "emma.student@demo.com",
    password: "student123",
    role: "user"
  },
  {
    userName: "David Miller",
    userEmail: "david.student@demo.com",
    password: "student123",
    role: "user"
  },
  {
    userName: "Lisa Anderson",
    userEmail: "lisa.student@demo.com",
    password: "student123",
    role: "user"
  }
];

const demoCourses = [
  {
    title: "Complete React Development Course",
    category: "Web Development",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Learn React from scratch and build amazing web applications",
    description: "This comprehensive React course will take you from a complete beginner to an advanced React developer. You'll learn hooks, context, routing, and much more.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    welcomeMessage: "Welcome to the Complete React Development Course! Get ready to master React and build amazing applications.",
    pricing: 99.99,
    objectives: "Build modern React applications, Master React Hooks, Understand component lifecycle, Create responsive UIs, Handle state management",
    curriculum: [
      {
        title: "Introduction to React",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true
      },
      {
        title: "Setting Up Development Environment",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: true
      },
      {
        title: "JSX and Components",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      },
      {
        title: "Props and State",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: false
      },
      {
        title: "React Hooks",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      },
      {
        title: "Building a Complete Project",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      }
    ],
    isPublised: true
  },
  {
    title: "Node.js & Express Backend Development",
    category: "Backend Development",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Master server-side development with Node.js and Express",
    description: "Learn to build scalable backend applications using Node.js and Express. Cover databases, authentication, APIs, and deployment.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
    welcomeMessage: "Welcome to Node.js & Express Backend Development! Let's build powerful server-side applications.",
    pricing: 129.99,
    objectives: "Create REST APIs, Handle databases, Implement authentication, Deploy applications, Work with middleware",
    curriculum: [
      {
        title: "Introduction to Node.js",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true
      },
      {
        title: "Setting up Express Server",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      },
      {
        title: "Working with MongoDB",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      },
      {
        title: "Authentication & Authorization",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: false
      },
      {
        title: "Building REST APIs",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      }
    ],
    isPublised: true
  },
  {
    title: "Python for Data Science",
    category: "Data Science",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Learn Python programming for data analysis and machine learning",
    description: "Dive into the world of data science with Python. Learn pandas, NumPy, matplotlib, and build your first machine learning models.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
    welcomeMessage: "Welcome to Python for Data Science! Let's explore the exciting world of data analysis and machine learning.",
    pricing: 89.99,
    objectives: "Master Python basics, Work with data using pandas, Create visualizations, Build ML models, Analyze real datasets",
    curriculum: [
      {
        title: "Python Fundamentals",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true
      },
      {
        title: "Working with NumPy",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      },
      {
        title: "Data Manipulation with Pandas",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      },
      {
        title: "Data Visualization",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: false
      },
      {
        title: "Introduction to Machine Learning",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      }
    ],
    isPublised: true
  },
  {
    title: "Mobile App Development with React Native",
    category: "Mobile Development",
    level: "Intermediate",
    primaryLanguage: "English",
    subtitle: "Build cross-platform mobile apps with React Native",
    description: "Learn to create native mobile applications for both iOS and Android using React Native. Cover navigation, APIs, and app store deployment.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500",
    welcomeMessage: "Welcome to React Native Development! Let's build amazing mobile applications together.",
    pricing: 149.99,
    objectives: "Build mobile apps, Master React Native, Handle navigation, Work with APIs, Deploy to app stores",
    curriculum: [
      {
        title: "Getting Started with React Native",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true
      },
      {
        title: "Core Components and Layout",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      },
      {
        title: "Navigation in React Native",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      },
      {
        title: "Working with APIs and Data",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: false
      }
    ],
    isPublised: true
  },
  {
    title: "Digital Marketing Masterclass",
    category: "Marketing",
    level: "Beginner",
    primaryLanguage: "English",
    subtitle: "Complete guide to digital marketing strategies",
    description: "Master all aspects of digital marketing including SEO, social media marketing, email marketing, and paid advertising.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
    welcomeMessage: "Welcome to Digital Marketing Masterclass! Let's master the art of online marketing.",
    pricing: 79.99,
    objectives: "Master SEO techniques, Run social media campaigns, Create email marketing, Manage paid ads, Analyze marketing metrics",
    curriculum: [
      {
        title: "Introduction to Digital Marketing",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true
      },
      {
        title: "Search Engine Optimization (SEO)",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false
      },
      {
        title: "Social Media Marketing",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        freePreview: false
      },
      {
        title: "Email Marketing Strategies",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: false
      }
    ],
    isPublised: true
  }
];

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Clear existing data
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Order.deleteMany({});
    await StudentCourses.deleteMany({});
    await CourseProgress.deleteMany({});
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

// Seed users
async function seedUsers() {
  try {
    const users = [];
    
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      users.push({
        ...userData,
        password: hashedPassword
      });
    }
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created successfully`);
    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    return [];
  }
}

// Seed courses
async function seedCourses(users) {
  try {
    const instructors = users.filter(user => user.role === "instructor");
    const coursesWithInstructors = demoCourses.map((course, index) => {
      const instructor = instructors[index % instructors.length];
      return {
        ...course,
        instructorId: instructor._id.toString(),
        instructorName: instructor.userName,
        date: new Date(Date.now() - Math.random() * 10000000000), // Random past dates
        students: [] // Will be populated when creating orders
      };
    });
    
    const createdCourses = await Course.insertMany(coursesWithInstructors);
    console.log(`${createdCourses.length} courses created successfully`);
    return createdCourses;
  } catch (error) {
    console.error("Error seeding courses:", error);
    return [];
  }
}

// Seed orders and student enrollments
async function seedOrdersAndEnrollments(users, courses) {
  try {
    const students = users.filter(user => user.role === "user");
    const orders = [];
    const studentCoursesData = {};
    
    // Create random enrollments
    for (const student of students) {
      // Each student enrolls in 1-3 random courses
      const numEnrollments = Math.floor(Math.random() * 3) + 1;
      const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
      const enrolledCourses = shuffledCourses.slice(0, numEnrollments);
      
      studentCoursesData[student._id.toString()] = [];
      
      for (const course of enrolledCourses) {
        const orderDate = new Date(Date.now() - Math.random() * 5000000000);
        
        // Create order
        const order = {
          userId: student._id.toString(),
          userName: student.userName,
          userEmail: student.userEmail,
          orderStatus: "confirmed",
          paymentMethod: "dummy",
          paymentStatus: "paid",
          orderDate: orderDate,
          paymentId: `DUMMY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          payerId: `DUMMY_PAYER_${student._id}`,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          courseImage: course.image,
          courseTitle: course.title,
          courseId: course._id.toString(),
          coursePricing: course.pricing
        };
        
        orders.push(order);
        
        // Add to student courses
        studentCoursesData[student._id.toString()].push({
          courseId: course._id.toString(),
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: orderDate,
          courseImage: course.image
        });
        
        // Add student to course
        await Course.findByIdAndUpdate(course._id, {
          $addToSet: {
            students: {
              studentId: student._id.toString(),
              studentName: student.userName,
              studentEmail: student.userEmail,
              paidAmount: course.pricing
            }
          }
        });
      }
    }
    
    // Insert orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`${createdOrders.length} orders created successfully`);
    
    // Insert student courses
    const studentCoursesArray = Object.entries(studentCoursesData).map(([userId, courses]) => ({
      userId,
      courses
    }));
    
    const createdStudentCourses = await StudentCourses.insertMany(studentCoursesArray);
    console.log(`${createdStudentCourses.length} student course records created successfully`);
    
    return { orders: createdOrders, studentCourses: createdStudentCourses };
  } catch (error) {
    console.error("Error seeding orders and enrollments:", error);
    return { orders: [], studentCourses: [] };
  }
}

// Seed course progress
async function seedCourseProgress(users, courses) {
  try {
    const students = users.filter(user => user.role === "user");
    const progressData = [];
    
    for (const student of students) {
      // Get student's enrolled courses
      const studentCourses = await StudentCourses.findOne({ userId: student._id.toString() });
      
      if (studentCourses && studentCourses.courses.length > 0) {
        for (const enrolledCourse of studentCourses.courses) {
          const course = courses.find(c => c._id.toString() === enrolledCourse.courseId);
          
          if (course && course.curriculum) {
            const lecturesProgress = [];
            let viewedCount = 0;
            
            // Randomly mark some lectures as viewed
            for (let i = 0; i < course.curriculum.length; i++) {
              const lecture = course.curriculum[i];
              const isViewed = Math.random() > 0.4; // 60% chance of being viewed
              
              if (isViewed) {
                viewedCount++;
                lecturesProgress.push({
                  lectureId: lecture._id.toString(),
                  viewed: true,
                  dateViewed: new Date(enrolledCourse.dateOfPurchase.getTime() + Math.random() * 2000000000)
                });
              } else {
                lecturesProgress.push({
                  lectureId: lecture._id.toString(),
                  viewed: false,
                  dateViewed: null
                });
              }
            }
            
            const isCompleted = viewedCount === course.curriculum.length;
            
            progressData.push({
              userId: student._id.toString(),
              courseId: course._id.toString(),
              completed: isCompleted,
              completionDate: isCompleted ? new Date(enrolledCourse.dateOfPurchase.getTime() + 3000000000) : null,
              lecturesProgress
            });
          }
        }
      }
    }
    
    const createdProgress = await CourseProgress.insertMany(progressData);
    console.log(`${createdProgress.length} course progress records created successfully`);
    return createdProgress;
  } catch (error) {
    console.error("Error seeding course progress:", error);
    return [];
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    if (users.length === 0) return;
    
    const courses = await seedCourses(users);
    if (courses.length === 0) return;
    
    const { orders, studentCourses } = await seedOrdersAndEnrollments(users, courses);
    await seedCourseProgress(users, courses);
    
    console.log("\n=== DATABASE SEEDING COMPLETED SUCCESSFULLY! ===");
    console.log(`
Demo Accounts Created:

INSTRUCTORS:
- Email: john.instructor@demo.com, Password: instructor123
- Email: sarah.instructor@demo.com, Password: instructor123  
- Email: michael.instructor@demo.com, Password: instructor123

STUDENTS:
- Email: alice.student@demo.com, Password: student123
- Email: bob.student@demo.com, Password: student123
- Email: emma.student@demo.com, Password: student123
- Email: david.student@demo.com, Password: student123
- Email: lisa.student@demo.com, Password: student123

${courses.length} courses with various categories have been created.
Students have been randomly enrolled in courses with progress data.
    `);
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };