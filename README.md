# SeniorProject

Function: get
Request: GET /books
Query Parameters:

size: Boolean (to get total number of results instead of the actual results)
p: Number (page number)
q: String (search query)
s: Number (page size)
Responses:

If '_id' is provided:
Status: 200
Body: Single book object
If size is true:
Status: 200
Body: Total number of books
If q is undefined:
Status: 200
Body: Array of books (paged and sorted)
If q is defined:
Status: 200
Body: Array of books (paged and sorted based on search query)
Function: create
Request: POST /books
Body: { 'title': 'Book Title', 'author': 'Book Author' }

Responses:

If title or author is missing:
Status: 400
Body: { 'message': 'A title and author are required' }
If duplicate book exists:
Status: 409
Body: { 'message': 'Duplicate book found' }
If book is successfully created:
Status: 201
Body: { 'message': 'New book title: Book Title id: [book_id] created' }
Function: update
Request: PATCH /books
Body: { '_id': '[book_id]', 'title': 'Updated Title', 'author': 'Updated Author' }

Responses:

If _id, title, or author is missing:
Status: 400
Body: { 'message': 'An id, title, and author are required' }
If book with _id is not found:
Status: 400
Body: { 'message': 'Book not found' }
If duplicate title and author exists:
Status: 409
Body: { 'message': 'Duplicate title and author' }
If book is successfully updated:
Status: 201
Body: { 'message': 'Updated Title updated' }
Function: remove
Request: DELETE /books
Body: { 'id': '[book_id]' }

Responses:

If id is missing:
Status: 400
Body: { 'message': 'Book id is required.' }
If book with id is not found:
Status: 400
Body: { 'message': 'Book not found' }
If book is successfully deleted:
Status: 200
Body: { 'message': 'Deleted Title deleted' }
