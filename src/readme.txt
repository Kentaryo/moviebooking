🎬 Movie Booking App

A full-stack Movie Booking Application built with **React.jsx** for the frontend and **PHP/MySQL** for the backend. Admins can manage movies with full CRUD operations, and users can book tickets with multiple payment options.

 Table of Contents

* [Features](#features)
* [Frontend Setup](#frontend-setup)
* [Backend Setup](#backend-setup)
* [Database Tables](#database-tables)
* [API Endpoints](#api-endpoints)
* [CRUD Operations](#crud-operations)
* [Folder Structure](#folder-structure)
* [Usage](#usage)

 Features

* User Registration and Login
* Admin login (hardcoded) and dashboard to manage movies and bookings
* View, add, edit, delete movies (Admin)
* Book movies with payment options (Credit Card, GCash, PayPal)
* Real-time available seats update
* Responsive UI

 Frontend Setup

1. Clone the repository:

```bash
git clone <repo_url>
```

2. Install dependencies:

```bash
cd movie-booking-frontend
npm install
```

3. Run the app:

```bash
npm run dev
```

4. Access the frontend at `http://localhost:5173/`

Backend Setup

Refer to [API-README.md](./API-README.md) for detailed backend setup, including database creation and API endpoints.

Database Tables

 Users Table

Stores registered users.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

 Movies Table

Stores movie information.

```sql
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_seats INT NOT NULL
);
```

 Bookings Table

Stores user bookings.

```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    seats_booked INT DEFAULT 1,
    payment_method VARCHAR(50) NOT NULL,
    payment_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

 API Endpoints

| Endpoint                       | Method | Description                                                                   |
| ------------------------------ | ------ | ----------------------------------------------------------------------------- |
| `/api/register.php`            | POST   | Register a new user. Payload: `{name, email, password}`                       |
| `/api/login.php`               | POST   | Authenticate user. Payload: `{email, password}`                               |
| `/api/getMovies.php`           | GET    | Retrieve all movies                                                           |
| `/api/bookMovie.php`           | POST   | Book a movie. Payload: `{user_id, movie_id, payment_method, payment_details}` |
| `/api/addMovie.php`            | POST   | Add new movie (Admin)                                                         |
| `/api/updateMovie.php?id=<id>` | POST   | Update movie by ID (Admin)                                                    |
| `/api/deleteMovie.php?id=<id>` | POST   | Delete movie by ID (Admin)                                                    |
| `/api/getAllBookings.php`      | GET    | Retrieve all bookings (Admin)                                                 |

 CRUD Operations

 Movies (Admin)

* **Create:** Add a new movie using the `Add Movie` form.
* **Read:** View all movies in the `All Movies` table.
* **Update:** Click `Edit` to pre-fill the form and update the movie.
* **Delete:** Click `Delete` to remove a movie.

### Users (Backend)

* **Create:** Users register via `/api/register.php`.
* **Read:** Admin can retrieve users if needed via custom endpoint.
* **Update:** User information can be updated via backend script (optional).
* **Delete:** User deletion can be implemented via backend (optional).

### Bookings

* **Create:** Users book movies via `/api/bookMovie.php`.
* **Read:** Admin can view all bookings in `All Bookings` table.
* **Update:** Booking updates can be implemented in backend if required.
* **Delete:** Bookings can be deleted via backend (optional).

 Folder Structure

```
movie-booking-frontend/
│  src/
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Register.jsx
│  │  ├─ Login.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ AdminDashboard.jsx
│  │  └─ UserDashboard.jsx
│  ├─ App.jsx
│  └─ index.css

movie-booking-backend/
│  api/
│  ├─ addMovie.php
│  ├─ updateMovie.php
│  ├─ deleteMovie.php
│  ├─ getMovies.php
│  ├─ getAllBookings.php
│  ├─ bookMovie.php
│  ├─ login.php
│  └─ register.php
```

## Usage

1. Start backend server (XAMPP/WAMP).
2. Start React frontend with `npm start`.
3. Navigate to `http://localhost:5173`.
4. Register a new user or log in.
5. Admin login: `admin@example.com` / `admin123`.
6. Admin can add, edit, delete movies and view all bookings.
7. Users can view movies and book tickets with selected payment methods.
