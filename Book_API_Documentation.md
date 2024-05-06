# Book API Documentation

## Introduction
The Book API provides endpoints for managing book data, including fetching book details, creating new books, updating existing books, and deleting books.

## Dependencies
- `express-async-handler`: Library for handling asynchronous Express middleware.

## Endpoints

### 1. Get Books
- **Description:** Retrieves information about books.
- **Route:** `GET /books`
- **Access:** Private (authentication required)
- **Parameters:**
  - `id` (optional): The ID of the book to retrieve.
- **Response Format:**
  ```json
  {
    "_id": "12345",
    "title": "Book Title",
    "author": "Author Name"
  }

### 2. Create New Book
- **Description:** Creates a new book.
- **Route:** `POST /books`
- **Access:** Private (authentication required)
- **Parameters:**
  - `title`: The title of the new book.
  - `author`: The author of the new book.
- **Response Format:**
  ```json
  {
    "message": "New book title: Book Title id: 12345 created"
  }

### 3. Update Book
- **Description:** Updates an existing book.
- **Route:** `PATCH /books`
- **Access:** Private (authentication required)
- **Parameters:**
  - `id`: The ID of the book to update.
  - `title`: The new title of the book.
  - `author`: The new author of the book.
- **Response Format:**
  ```json
  {
    "message": "Book Title updated"
  }

### 4. Delete Book
- **Description:** Deletes an existing book.
- **Route:** `DELETE /books`
- **Access:** Private (authentication required)
- **Parameters:**
  - `id`: The ID of the book to delete.
- **Response Format:**
  ```json
  {
    "message": "Book Title deleted"
  }