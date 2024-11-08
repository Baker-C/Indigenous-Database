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


describe('Users API', () => {
    beforeAll(async () => {
        try {
            await User
            .deleteMany({ })
            .catch((err) => {
                console.error("Error deleting users:", err)
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
    

    describe("GET /users", () => {
        test('should return 200 a single user from userId', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                userId: "100000000000000000000000"
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(1)
            expect(response.body[0]).toHaveProperty('username', 'username01')
        })

        test('should return 200 a single user from username', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                username: ["username01"]
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(1)
            expect(response.body[0]).toHaveProperty('username', 'username01')
        })

        test('should return 200 users from username array', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                username: ["username01", "username02"]
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(2)
            expect(response.body[0]).toHaveProperty('username', 'username01')
            expect(response.body[1]).toHaveProperty('username', 'username02')
        })

        test('should return 200 users from userId array', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                userId: ["100000000000000000000000", "200000000000000000000000"]
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(2)
            expect(response.body[0]).toHaveProperty('username', 'username01')
            expect(response.body[1]).toHaveProperty('username', 'username02')
        })

        test('should return 200 users from different userId and username', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                userId: "100000000000000000000000",
                username: "username02"
            })
            console.log(response.body)
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(2)
            expect(response.body[0]).toHaveProperty('username', 'username01')
            expect(response.body[1]).toHaveProperty('username', 'username02')
        })

        test('should return 200 single user from the same users userId and username', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                userId: "100000000000000000000000",
                username: "username01"
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(1)
            expect(response.body[0]).toHaveProperty('username', 'username01')
        })

        test('should return error 400 from no userId or username provided', async () => {
            const response = await request(app)
            .get('/users')
            .send({ })
            expect(response.statusCode).toBe(400)
        })

        test('should return error 400 if no user is found from userId or username', async () => {
            const response = await request(app)
            .get('/users')
            .send({
                userId: "123456700000000000000000",
                username: "usernameNoUser"
            })
            expect(response.statusCode).toBe(400)
        })
    })



    
    describe("CREATE /users", () => {

        test('should return success 201 from username, email, password, rePassword, firstName, lastName', async () => {
            const response = await request(app)
            .post('/users')
            .send({
                username: "newUser",
                email: "newEmail",
                password: "newPassword",
                rePassword: "newPassword",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            expect(response.statusCode).toBe(201)
        })

        test('should return error 400 if username, email, password, rePassword, firstName, or lastName is missing', async () => {
            const body = {
                username: "newUser",
                email: "newEmail",
                password: "newPassword",
                rePassword: "newPassword",
                firstName: "newFirstName",
                lastName: "newLastName"
            }
            const { username, ...noUsername } = body
            const { email, ...noEmail } = body
            const { password, ...noPassword } = body
            const { rePassword, ...noRePassword } = body
            const { firstName, ...noFirstName } = body
            const { lastName, ...noLastName } = body

            let response

            response = await request(app)
            .post('/users')
            .send(noUsername)
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/users')
            .send(noEmail)
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/users')
            .send(noPassword)
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/users')
            .send(noRePassword)
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/users')
            .send(noFirstName)
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .post('/users')
            .send(noLastName)
            expect(response.statusCode).toBe(400)
        })
        
        test('should return error 400 if password and rePassword do not match', async () => {
            const body = {
                username: "newUser",
                email: "newEmail",
                password: "newPassword",
                rePassword: "differentPassword",
                firstName: "newFirstName",
                lastName: "newLastName"
            }
            response = await request(app)
            .post('/users')
            .send(body)
            expect(response.statusCode).toBe(400)
        })

        test('should return error 409 if a duplicate username is found', async () => {
            const body = {
                username: "username01",
                email: "newEmail",
                password: "newPassword",
                rePassword: "newPassword",
                firstName: "newFirstName",
                lastName: "newLastName"
            }
            response = await request(app)
            .post('/users')
            .send(body)
            expect(response.statusCode).toBe(409)
        })
    })



    describe("UPDATE /users", () => {

        // Create a valid token with a test secret and payload
        const testUsername = "username01"
        const token = jwt.sign(
            { username: testUsername },
            process.env.ACCESS_TOKEN_KEY, 
            { expiresIn: '30s' }
        )

        test('should return success 204', async () => {
            let response
            
            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            expect(response.statusCode).toBe(204)

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                addCatalogues: "700000000000000000000000"
            })
            expect(response.statusCode).toBe(204)

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                addCatalogues: ["700000000000000000000000"]
            })
            expect(response.statusCode).toBe(204)

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                delCatalogues: "600000000000000000000000"
            })
            expect(response.statusCode).toBe(204)

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                delCatalogues: ["600000000000000000000000"]
            })
            expect(response.statusCode).toBe(204)
        })

        test('should return error 400 from no userId provided', async () => {
            const response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            
            expect(response.statusCode).toBe(400)
        })

        test('should return error 400 if userId does not exist', async () => {
            const response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "999999000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            
            expect(response.statusCode).toBe(400)
        })

        test('should return 401 if user !== jwt token user', async () => {
            const response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "200000000000000000000000",
                username: "username02",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            
            expect(response.statusCode).toBe(401)
        })

        test('should return 409 if a duplicate username is found', async () => {
            const response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username02",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName"
            })
            
            expect(response.statusCode).toBe(409)
        })
        
        test('should return 400 if catalogueId does not exist', async () => {
            let response

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                addCatalogues: "999999000000000000000000"
            })
            expect(response.statusCode).toBe(400)
        })

        test('should return 400 if catalogueId is not a proper objId', async () => {
            let response

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                addCatalogues: "999999"
            })
            expect(response.statusCode).toBe(400)

            response = await request(app)
            .patch('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000",
                username: "username01",
                email: "newEmail",
                firstName: "newFirstName",
                lastName: "newLastName",
                delCatalogues: "999999"
            })
            expect(response.statusCode).toBe(400)
        })
    })


    describe("DELETE /users", () => {

        // Create a valid token with a test secret and payload
        const testUsername = "username01"
        const token = jwt.sign(
            { username: testUsername },
            process.env.ACCESS_TOKEN_KEY, 
            { expiresIn: '30s' }
        )

        test('should return success 204', async () => {            
            const response = await request(app)
            .delete('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "100000000000000000000000"
            })
            expect(response.statusCode).toBe(204)
        })

        test('should return error 400 if userId is not given', async () => {            
            const response = await request(app)
            .delete('/users')
            .set('Authorization', `Bearer ${token}`)
            .send()
            expect(response.statusCode).toBe(400)
        })

        test('should return error 400 if username does not match token', async () => {            
            const response = await request(app)
            .delete('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: "200000000000000000000000"
            })
            expect(response.statusCode).toBe(400)
        })
    })
})
