# User API Documentation

## Introduction
The User API allows for user management operations such as fetching user details, creating new users, updating existing users, and deleting users.

## Dependencies
- `express-async-handler`: Library for handling asynchronous Express middleware.
- `bcrypt`: Library for hashing passwords.

## Endpoints

### 1. Get a Single User
- **Description:** Retrieves information about a single user.
- **Route:** `GET /users`
- **Access:** Private (authentication required)
- **Parameters:**
  - `username` (optional): The username of the user to retrieve. If not provided, returns information about all users.
  - `password` (required if `username` provided): The password of the user.
- **Response Format:**
  ```json
  // If no username specified, returns information about all users
  [
    {
      "username": "user1",
      "email": "user1@example.com"
    },
    {
      "username": "user2",
      "email": "user2@example.com"
    }
  ]
  // If username specified, returns information about the user
  {
    "username": "user1",
    "email": "user1@example.com"
  }

### 2. Create New User
- **Description:** Creates a new user.
- **Route:** `POST /users`
- **Access:** Private (authentication required)
- **Parameters:**
  - `username`: The username of the new user.
  - `email`: The email of the new user.
  - `password`: The password of the new user.
  - `rePassword`: The password confirmation.
- **Response Format:**
  ```json
  {
    "message": "New user user1 created"
  }
  
### 3. Update User
- **Description:** Updates an existing user.
- **Route:** `PATCH /users`
- **Access:** Private (authentication required)
- **Parameters:**
  - `username`: The username of the user to update.
  - `password`: The password of the user.
  - `newUsername`: The new username.
  - `newEmail`: The new email.
  - `newPassword`: The new password.
- **Response Format:**
  ```json
  {
    "message": "user1 updated"
  }

### 4. Delete User
- **Description:** Deletes an existing user.
- **Route:** `DELETE /users`
- **Access:** Private (authentication required)
- **Parameters:**
  - `username`: The username of the user to delete.
- **Response Format:**
  ```json
  {
    "message": "User user1 deleted"
  }

  