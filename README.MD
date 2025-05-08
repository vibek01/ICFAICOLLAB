# ICFAICOLLAB

**ICFAICOLLAB** is a collaborative platform where students and developers can upload their projects, connect with like-minded peers, and collaborate on new initiatives. The platform includes a feature-rich profile system, project and announcement uploads, and team-building tools to foster a vibrant developer community.

---

## 🚀 Features

- 🔐 **User Authentication**  
  Secure login and signup using JWT and bcrypt.js.

- 🧑‍💼 **User Profiles**  
  Detailed user pages displaying:
  - Name, username (unique)
  - Bio, skills, and domain
  - Uploaded projects and announcements
  - Announcements applied to
  - Editable via a settings page

- 📂 **Project Showcase**  
  Users can upload projects which are visible to all on the platform.

- 📢 **Team Announcements**  
  Users can post announcements when looking for team members. All announcements are publicly visible to encourage collaboration.

- 📤 **File Uploads**  
  Seamless media and document handling using Multer and Cloudinary.

---

## 🛠️ Tech Stack

| Technology       | Description                         |
|------------------|-------------------------------------|
| Node.js & Express| Backend framework                   |
| MongoDB & Mongoose| NoSQL database                     |
| JWT              | Token-based authentication          |
| Bcrypt.js        | Password hashing                    |
| Multer + Cloudinary | File and image uploads           |
| Dotenv           | Environment variable management     |
| CORS, Body-Parser| Middleware                          |

---

## 📁 Project Structure (Backend)

icfaicollab-backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── uploads/
├── server.js
├── .env
└── package.json


---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/icfaicollab-backend.git

cd icfaicollab-backend

npm install

npm run start

