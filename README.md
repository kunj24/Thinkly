# 🎓 Thinkly - Learning Management System

A modern, full-stack Learning Management System built with React, Node.js, Express, and MongoDB. Thinkly provides a comprehensive platform for online education with separate interfaces for instructors and students.

## ✨ Features

### For Students
- 🔐 **User Authentication** - Secure login and registration
- 📚 **Course Catalog** - Browse and filter courses by category
- 🎯 **Course Enrollment** - Purchase and enroll in courses
- 📺 **Video Learning** - Stream course videos with progress tracking
- 📊 **Progress Tracking** - Monitor learning progress and completion
- 💳 **Payment Integration** - Secure course purchases
- 📱 **Responsive Design** - Works on desktop and mobile devices

### For Instructors
- 👨‍🏫 **Instructor Dashboard** - Manage courses and students
- ➕ **Course Creation** - Create and publish new courses
- 🎬 **Media Upload** - Upload course videos and materials
- 📈 **Analytics** - Track student enrollment and progress
- ✏️ **Course Management** - Edit and update course content
- 👥 **Student Management** - View enrolled students

### Admin Features
- 🗄️ **Database Seeding** - Populate with demo data
- 🔧 **Environment Configuration** - Easy setup and deployment
- 📋 **Course Categories** - Multiple subject areas supported

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Media storage and management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunj24/Thinkly.git
   cd Thinkly
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In the server directory
   cd server
   copy .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/lms
   CLIENT_URL=http://localhost:5173
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Seed the database** (Optional - for demo data)
   ```bash
   cd server
   node seedDatabase.js
   ```

5. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm run dev
   # or
   nodemon
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Thinkly/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components
│   │   │   ├── instructor-view/  # Instructor-specific components
│   │   │   └── student-view/     # Student-specific components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   └── lib/           # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── helpers/          # Helper functions
│   ├── uploads/          # File uploads (excluded from git)
│   ├── seedDatabase.js   # Database seeding script
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🎯 Available Course Categories

- 💻 **Web Development** - React, Node.js, Full-stack
- 🔧 **Backend Development** - APIs, Databases, Server-side
- 📊 **Data Science** - Python, Analytics, Machine Learning
- 📱 **Mobile Development** - React Native, Cross-platform
- 📈 **Digital Marketing** - SEO, Social Media, Analytics
- 🤖 **Machine Learning** - AI, Algorithms, Data Processing
- ☁️ **Cloud Computing** - AWS, Azure, DevOps
- 🔒 **Cyber Security** - Security, Ethical Hacking
- 🎮 **Game Development** - Unity, Game Design
- ⚙️ **Software Engineering** - Best Practices, Architecture

## 👥 Demo Accounts

After running the seed script, you can use these demo accounts:

### Student Accounts
- **Email:** alice.student@demo.com | **Password:** student123
- **Email:** bob.student@demo.com | **Password:** student123
- **Email:** emma.student@demo.com | **Password:** student123
- **Email:** david.student@demo.com | **Password:** student123
- **Email:** lisa.student@demo.com | **Password:** student123

### Instructor Accounts
- **Email:** john.instructor@demo.com | **Password:** instructor123
- **Email:** sarah.instructor@demo.com | **Password:** instructor123
- **Email:** michael.instructor@demo.com | **Password:** instructor123

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/check-auth` - Check authentication status

### Student Routes
- `GET /student/course` - Get all courses
- `GET /student/course/:id` - Get course details
- `POST /student/order` - Create course order
- `GET /student/courses-bought` - Get purchased courses
- `GET /student/course-progress/:id` - Get course progress

### Instructor Routes
- `GET /instructor/course` - Get instructor's courses
- `POST /instructor/course` - Create new course
- `PUT /instructor/course/:id` - Update course
- `DELETE /instructor/course/:id` - Delete course
- `POST /media/upload` - Upload course media

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |
| `PORT` | Server port | 5000 |
| `JWT_SECRET` | JWT signing secret | Required |

## 🔍 Development

### Running Tests
```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Building for Production
```bash
# Build client
cd client
npm run build

# Start production server
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the flexible database
- Tailwind CSS for the utility-first approach
- Shadcn/ui for beautiful components
- All open-source contributors

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ by the Thinkly Team**