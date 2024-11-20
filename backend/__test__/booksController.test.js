const jwt = require('jsonwebtoken')
const request = require('supertest')
const app = require('../server.js')
const { disconnectDB  } = require('../config/dbConn.js')
const { 
    userFixtures, 
    bookFixtures, 
    catalogueFixtures 
} = require('../__fixtures__/fixtures.js')
const User = require('../schemas/User')
const Book = require('../schemas/Book.js')
const Catalogue = require('../schemas/Catalogue.js')


describe('Books API', () => {
    beforeAll(async () => {
        try {
            await User
            .deleteMany({ })
            .catch((err) => {
                console.error("Error deleting users:", err)
            })

            await Book
            .deleteMany({ })
            .catch((err) => {
                console.error("Error deleting books:", err)
            })            

            await User
            .insertMany(userFixtures)
            .catch((err) => {
                console.error("Error insertings users:", err)
            })

            await Book
            .insertMany(bookFixtures)
            .catch((err) => {
                console.error("Error insertings books:", err)
            })

            await Catalogue
            .insertMany(catalogueFixtures)
            .catch((err) => {
                console.error("Error insertings catalogues:", err)
            })
        } catch (err) {
            console.error("Error initializing data:", err)
        }
    })

    afterAll(async () => {
        await disconnectDB()
    })

    describe("GET /books", () => {
        test('should return 200, all books, and 1 page', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: ""
            })
            
            const { 
                statusCode, 
                body: { 
                    numPages,
                    books
                }
            } = response

            console.log(response.body)

            expect(statusCode).toBe(200)
            expect(numPages).toBe(1)
            expect(books.length).toBe(3)
        })

        test('should return 200, all books, and 3 pages', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: "title",
                s: "1"
            })

            const { 
                statusCode, 
                body: { 
                    numPages,
                    books
                }
            } = response
            console.log(response.body)

            expect(statusCode).toBe(200)
            expect(numPages).toBe(3)
            expect(books[0].title).toBe("title01")
        })

        test('should return 200, all books, and 3 pages', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: "title",
                s: "1",
                p: "3"
            })

            const { 
                statusCode, 
                body: { 
                    numPages,
                    books
                }
            } = response

            expect(statusCode).toBe(200)
            expect(numPages).toBe(3)
            expect(books[0].title).toBe("title03")
        })

        

        test('should return 200 and one book', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: "title01"
            })

            const { 
                statusCode, 
                body: { 
                    numPages,
                    books
                }
            } = response
            console.log(response.body)

            expect(statusCode).toBe(200)
            expect(numPages).toBe(1)
            expect(books.length).toBe(1)
            expect(books[0].title).toBe('title01')
        })

        test('should return 400 due to invalid title.', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: "invalidTitle"
            })
            console.log(response.body)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 400 due to page number being too high.', async () => {
            const response = await request(app)
            .get('/books')
            .query({
                q: "title",
                p: "10"
            })
            console.log(response.body)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })
    })

    describe("CREATE /books", () => {

        test('should return 201', async () => {
            const newBook = {
                title: "createTitle01",
                author: "author",
                description: "Description",
                isbn: "978-0-395-19395-8",
                coverImage: "coverimage.com",
                cost: "10",
                link: "somelink.com"
            }

            const response = await request(app)
            .post('/books')
            .send(newBook)
        
            const { statusCode, body } = response
            
            expect(statusCode).toBe(201)
            
            expect(body).toHaveProperty('title')
            expect(body.title).toStrictEqual("createTitle01")
            
            expect(body).toHaveProperty('author')
            expect(body.author).toStrictEqual("author")
            
            expect(body).toHaveProperty('description')
            expect(body.description).toStrictEqual("Description")
            
            expect(body).toHaveProperty('isbn')
            expect(body.isbn).toStrictEqual("978-0-395-19395-8")
            
            expect(body).toHaveProperty('coverImage')
            expect(body.coverImage).toStrictEqual("coverimage.com")
            
            expect(body).toHaveProperty('cost')
            expect(body.cost).toBe(10)
            
            expect(body).toHaveProperty('link')
            expect(body.link).toStrictEqual("somelink.com")
        })

        test('should return 400 missing data', async () => {
            const newBook = {
                title: "createTitle02",
                author: "author",
                cost: "10",
                link: "somelink.com"
            }

            const { title, ...noTitle } = newBook
            const { author, ...noAuthor } = newBook
            const { cost, ...noCost } = newBook
            const { link, ...noLink } = newBook

            let response = await request(app)
            .post('/books')
            .send(noTitle)

            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/books')
            .send(noAuthor)

            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/books')
            .send(noCost)

            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/books')
            .send(noLink)

            expect(response.statusCode).toBe(400)

        })

        test('should return 400: description too long', async () => {
            const newBook = {
                title: "createTitle04",
                author: "author",
                cost: "10",
                link: "somelink.com"
            }
            
            newBook.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur efficitur, ipsum eget laoreet iaculis, erat elit
                ultrices erat, eget bibendum erat odio at magna. Vestibulum
                ante ipsum primis in faucibus orci luctus et ultrices posuere
                cubilia curae; Nulla facilisi. Pellentesque.`
            const response = await request(app)
            .post('/books')
            .send(newBook)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 409 duplicate', async () => {
            const newBook = {
                title: "title01",
                author: "author01",
                cost: "10",
                link: "somelink.com"
            }
            
            const response = await request(app)
            .post('/books')
            .send(newBook)

            const { statusCode } = response

            expect(statusCode).toBe(409)
        })
    })

    describe("UPDATE /books", () => {

        test('should return 200', async () => {
            const updateInfo = {
                id: "300000000000000000000000",
                title: "newTitle01",
                author: "newAuthor",
                cost: "100000.00",
                link: "newlink.com",
                description: "newDescription",
                isbn: "978-0-395-19395-8"
            }
            
            const response = await request(app)
            .patch('/books')
            .send(updateInfo)
            
            const { statusCode, body } = response
            
            expect(statusCode).toBe(200)
            
            expect(body).toHaveProperty('title')
            expect(body.title).toStrictEqual("newTitle01")
            
            expect(body).toHaveProperty('author')
            expect(body.author).toStrictEqual("newAuthor")
            
            expect(body).toHaveProperty('cost')
            expect(body.cost).toStrictEqual(100000.00)
            
            expect(body).toHaveProperty('link')
            expect(body.link).toStrictEqual("newlink.com")
            
            expect(body).toHaveProperty('description')
            expect(body.description).toStrictEqual("newDescription")
            
            expect(body).toHaveProperty('isbn')
            expect(body.isbn).toStrictEqual("978-0-395-19395-8")
        })

        test('should return 400: description too long', async () => {
            const updateInfo = {
                id: "300000000000000000000000",
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur efficitur, ipsum eget laoreet iaculis, erat elit
                ultrices erat, eget bibendum erat odio at magna. Vestibulum
                ante ipsum primis in faucibus orci luctus et ultrices posuere
                cubilia curae; Nulla facilisi. Pellentesque.`
            }
            
            const response = await request(app)
            .patch('/books')
            .send(updateInfo)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 400: book not found', async () => {
            const updateInfo = {
                id: "000000000000000000000000"
            }
            
            const response = await request(app)
            .patch('/books')
            .send(updateInfo)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        
        test('should return 400: invalid id', async () => {
            const updateInfo = {
                id: "invalidId"
            }
            
            const response = await request(app)
            .patch('/books')
            .send(updateInfo)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 409: duplicate found', async () => {
            const updateInfo = {
                id: "300000000000000000000000",
                title: "title03",
                author: "author03"
            }
            
            const response = await request(app)
            .patch('/books')
            .send(updateInfo)

            const { statusCode } = response

            expect(statusCode).toBe(409)
        })
    })

    describe("DELETE /books", () => {
        test('should return 200: { book }', async () => {
            const bookId = {
                id: "500000000000000000000000"
            }
            
            const response = await request(app)
            .delete('/books')
            .send(bookId)

            const { statusCode, body } = response

            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('title')
            expect(body.title).toBe('title03')
        })

        test('should return 400: book id required', async () => {
            const bookId = {
            }
            
            const response = await request(app)
            .delete('/books')
            .send(bookId)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 400: invalid book id', async () => {
            const bookId = {
                id: 'invalidId'
            }
            
            const response = await request(app)
            .delete('/books')
            .send(bookId)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })

        test('should return 400: book not found', async () => {
            const bookId = {
                id: '000000000000000000000000'
            }
            
            const response = await request(app)
            .delete('/books')
            .send(bookId)

            const { statusCode } = response

            expect(statusCode).toBe(400)
        })
    })
})