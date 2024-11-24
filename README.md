# Delibhai Backend | API Documentation

### [Backend Repository](https://github.com/saifscripts/delibhai-server)

## Introduction

The Delibhai backend is designed to provide a robust API for vehicle search services. This documentation outlines the technical details of the vehicle search implementation.

## Technology Stack

-   TypeScript, Express.js, MongoDB

## Features

-   **API Endpoints:** Implemented RESTful API endpoints for authentication and vehicle search.
-   **Database Integration:** Utilized MongoDB for storing and managing vehicle data, ensuring efficient data retrieval and manipulation.
-   **TypeScript:** Leveraged TypeScript for static type checking, ensuring code maintainability and scalability.
-   **Express.js:** Built the API using Express.js, a lightweight and flexible Node.js web framework.
-   **Security:** Implemented authentication and authorization using JWT tokens, ensuring secure access to API endpoints.
-   **Error Handling:** Implemented robust error handling mechanisms to ensure the API is resilient to errors and provides informative error messages.

## API Endpoints

### Vehicle Search

-   **POST /auth/register-rider** - Register a new rider.
-   **POST /auth/verify-otp** - Verify OTP for login.
-   **POST /auth/resend-otp** - Resend OTP for login.
-   **POST /auth/login** - Login to the system.
-   **GET /auth/me** - Get user details.
-   **POST /auth/refresh-token** - Refresh JWT token.
-   **PUT /auth/change-password** - Change user password.
-   **PUT /user/avatar** - Update user avatar.
-   **DELETE /user/avatar** - Delete user avatar.
-   **GET /user/:id** - Get user by ID.
-   **GET /rider/** - Get all riders (Search, Filter and Sort).
-   **PUT /rider/** - Update rider details.
-   **PUT /rider/location** - Update rider location.
-   **GET /rider/location/:id** - Get rider location by ID.
-   **GET /division/** - Get all divisions.
-   **GET /district/:divisionId** - Get all districts in a division.
-   **GET /upazila/:districtId** - Get all upazilas in a district.
-   **GET /union/:upazilaId** - Get all unions in an upazila.
-   **GET /village/:unionId** - Get all villages in a union.
-   **POST /village/** - Create new villages.
-   **PUT /village/:id** - Update village details.
-   **DELETE /village/:id** - Delete village by ID.

## Installation Guideline

Follow this step-by-step guide to run the backend on your local machine.

### 0. Prerequisites

-   Node.js and npm installed.
-   MongoDB installed and running on your local machine or cloud url.

### 1. Clone the Repository

First, clone the repository to your machine using the following command:

```
git clone https://github.com/saifscripts/delibhai-server
```

### 2. Change Directory

Next, navigate to the project directory with this command:

```
cd delibhai-server
```

### 3. Install Dependencies

Before running the app, you need to install all dependencies. You can do this using npm:

```
npm install
```

### 4. Add a Configuration File

To run the app, create a `.env` file in the root folder with the following properties (I have included a few demo values here for testing):

```
PORT=5000
NODE_ENV=development
DATABASE_URI=mongodb://localhost:27017/delibhai
CLIENT_BASE_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXP_IN=exp_in_duration
JWT_REFRESH_EXP_IN=exp_in_duration
```

### 5. Run the App

Now, you're ready to run the app. Use the following command to start the server:

```
npm run dev
```

That's it! The backend should now be running locally.

## Usage

### API Usage

-   Use a tool like Postman or cURL to interact with the API endpoints.
-   Ensure to include the JWT token in the Authorization header for protected routes.

### MongoDB Usage

-   Use the MongoDB shell or a GUI client like MongoDB Compass to interact with the database.
-   Ensure MongoDB is running on your local machine before starting the backend.
