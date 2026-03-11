WanderLust 🌍
WanderLust is a full-stack accommodation listing web application where users can explore, create, and review stay locations. The platform allows travelers to discover places to stay while enabling users to share their own listings.

🚀 Features

User Authentication
Secure signup and login using Passport.js
Session-based authentication
Listings Management
Create new accommodation listings
Edit and update existing listings
Delete listings owned by the logged-in user
Browse listings uploaded by different users
Reviews & Ratings
Logged-in users can add reviews to listings
Users can view reviews posted by others
Location Map Integration
Integrated OpenStreetMap API to display the location of listings
Map preview with markers for each property
Listing Details Page
Dedicated route to view full listing details
Displays description, reviews, ratings, and map preview
MVC Architecture
Structured using Model–View–Controller architecture
Clean and maintainable directory structure

🛠 Tech Stack
Frontend
HTML
CSS
JavaScript
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
Passport.js

APIs
OpenStreetMap API

📂 Project Structure
WanderLust
│
├── models
│   ├── listing.js
│   └── review.js
│
├── routes
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── controllers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── views
│   └── ejs templates
│
├── public
│   ├── css
│   └── js
│
├── app.js
└── package.json

⚙️ Installation & Setup
1️⃣ Clone the repository
</> Bash
  git clone https://github.com/yourusername/wanderlust.git
2️⃣ Navigate to project folder
  cd wanderlust
3️⃣ Install dependencies
  npm i
4️⃣ Start MongoDB
  Make sure MongoDB is running locally
5️⃣ Run the application
  node index.js
