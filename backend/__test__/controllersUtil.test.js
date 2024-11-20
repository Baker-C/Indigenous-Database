const Util = require('../controllers/util.js')

const { connectDB, disconnectDB  } = require('../config/dbConn.js')
const { 
    userFixtures, 
    bookFixtures, 
    catalogueFixtures 
} = require('../__fixtures__/fixtures.js')
const User = require('../schemas/User.js')
const Book = require('../schemas/Book.js')
const Catalogue = require('../schemas/Catalogue.js')


describe("API Controller Utility Functions", () => {

    describe("toArray", () => {

        test('should return an empty list', async () => {
            let newArray = Util.toArray(undefined)
            expect(newArray).toStrictEqual([])
            
            newArray = Util.toArray([])
            expect(newArray).toStrictEqual([])
        })

        test('should return a list with a single obj', async () => {
            let newArray = Util.toArray('hello')
            expect(newArray).toStrictEqual(['hello'])
                
            newArray = Util.toArray({ field: 'value' })
            expect(newArray).toStrictEqual([{ field: 'value' }])
        })

        test('should return a list with multiple objs', async () => {
            const newArray = Util.toArray(['hello', 'world'])
            expect(newArray).toStrictEqual(['hello', 'world'])
        })
    })

    describe("invalidObjId", () => {

        test('should return false', async () => {
            const objIdArray = [
                '000000000000000000000000',
                '000000000000000000000000',
                '000000000000000000000000'
            ]

            const ret = Util.invalidObjId(objIdArray)
            
            expect(ret).toBe(false)
        })
        
        test('should return false', async () => {
            const objIdArray = []

            const ret = Util.invalidObjId(objIdArray)
            
            expect(ret).toBe(false)
        })

        test('should return false', async () => {
            const objId = '000000000000000000000000'

            const ret = Util.invalidObjId(objId)
            
            expect(ret).toBe(false)
        })

        test('should return true', async () => {
            const objId = '000000000000'

            const ret = Util.invalidObjId(objId)
            
            expect(ret).toBe(true)
        })

        test('should return true', async () => {
            const objIdArray = [
                '000000000000000000000000',
                'Z00000000000000000000000',
                '000000000000000000000000'
            ]

            const ret = Util.invalidObjId(objIdArray)
            
            expect(ret).toBe(true)
        })

        test('should return true', async () => {
            const objIdArray = [
                '000000000000000000000000',
                '000000000000000000',
                '000000000000000000000000'
            ]

            const ret = Util.invalidObjId(objIdArray)
            
            expect(ret).toBe(true)
        })

        
        test('should return true', async () => {
            const objIdArray = [
                '000000000000000000000000',
                -4,
                '000000000000000000000000'
            ]

            const ret = Util.invalidObjId(objIdArray)
            
            expect(ret).toBe(true)
        })
    })

    describe('usernameOverMaxLength', () => {
        test('should return false', async () => {
            const username = 'nonexistant'
            
            const ret = await Util.usernameOverMaxLength(username)
            
            expect(ret).toBe(false)
        })
    })

    describe('descriptionOverMaxLength', () => {
        test('should return false', async () => {
            const username = 'nonexistant'
            
            const ret = await Util.usernameOverMaxLength(username)
            
            expect(ret).toBe(false)
        })
    })

    describe('trimWhitespace', () => {
        test('should return strings with no surrounding whitespace', async () => {
            const obj = {
                key01: '  value  ',
                key02: '\nvalue\t',
                key03: '  value  ',
                key04: '  val ue  ',
                key05: '  val\nue  ',
                key06: undefined,
                key07: 13,
                key08: {
                    key09: '  value  ',
                },
                key10: [
                    '  value  '
                ]
            }

            const trimmedObj = {
                key01: 'value',
                key02: 'value',
                key03: 'value',
                key04: 'val ue',
                key05: 'val\nue',
                key06: undefined,
                key07: 13,
                key08: {
                    key09: '  value  ',
                },
                key10: [
                    '  value  '
                ]
            }
            
            Util.trimWhitespace(obj)
            
            expect(obj).toStrictEqual(trimmedObj)
        })

        test('should return strings with no surrounding whitespace', async () => {
            const inputs = [
                '  value  ',
                '\nvalue\t',
                '  value  ',
                '  val ue  ',
                '  val\nue  ',
                undefined,
                13,
                { key09: '  value  ' },
                ['  value  ']
            ]

            const trimmedInputs = [
                'value',
                'value',
                'value',
                'val ue',
                'val\nue',
                undefined,
                13,
                { key09: '  value  ' },
                ['  value  ']
            ]
            
            Util.trimWhitespace(inputs)
            
            expect(inputs).toStrictEqual(trimmedInputs)
        })

        test('should return null', async () => {
            const obj = undefined

            Util.trimWhitespace(obj)
            
            expect(obj).toStrictEqual(undefined)
        })
    })

    describe('parseCost', () => {
        test('should return 12.30', async () => {
            const costList = [
                "12.30",
                "000012.3",
                "$12.30",
                "cost is 12.30",
                "12,30"
            ]

            for (const cost of costList) {
                const ret = Util.parseCost(cost)

                expect(ret).toBe(12.30)
            }
        })

        test('should return 1,200,000.30', async () => {
            const costList = [
                "1.200.000,30",
                "0001.200.000,3",
                "cost is 1.200.000,30",
                "1,200,000.30",
                "$1,200,000.3"
            ]

            for (const cost of costList) {
                const ret = Util.parseCost(cost)

                expect(ret).toBe(1200000.30)
            }
        })

        test('should return undefined', async () => {
            const costList = [
                100,
                undefined,
                "free"
            ]

            for (const cost of costList) {
                const ret = Util.parseCost(cost)

                expect(ret).toBe(undefined)
            }
        })
    })

    
    describe('validISBN', () => {
        test('should return true', async () => {
            const isbnList = [
                "0 - 306 - 40615 - 2",
                "978-0---306-40615-7",
                "  1-56619-909-3  ",
                "9781566199094",
                "0-395-19395-X",
                "978-0-395-19395-8",
                "0-19-852663-6",
                "9 7 8 - 01 98 5 2 6 6 36"
            ]
            
            for (const code of isbnList) {
                const ret = Util.validISBN(code)

                expect(ret).toBe(true)
            }
        })

        test('should return false', async () => {
            const isbnList = [
                "0 - 306 abcdef",
                "999-0---306-40615-7",
                "1-56619",
                "9999999999999999999999",
                undefined,
                13,
                true,
                false
            ]
            
            for (const code of isbnList) {
                const ret = Util.validISBN(code)

                expect(ret).toBe(false)
            }
        })
    })


    
    describe('parsePageNumber', () => {
        test('should return 5', async () => {
            const param = '5'

            const ret = Util.parsePageNumber(param)

            expect(ret).toBe(5)
        })

        test('should return 0', async () => {
            const paramList = [
                "page num should be 0",
                "0",
                "-200",
                undefined,
                13,
                true,
                false
            ]
            
            for (const input of paramList) {
                const ret = Util.parsePageNumber(input)
    
                expect(ret).toBe(0)
            }
        })
    })

    describe('parsePageSize', () => {
        test('should return 50', async () => {
            const param = '50'

            const ret = Util.parsePageSize(param)

            expect(ret).toBe(50)
        })

        test('should return 1', async () => {
            const param = "-100"
            
            const ret = Util.parsePageSize(param)
    
            expect(ret).toBe(1)
        })

        test('should return 20', async () => {
            const paramList = [
                "0",
                "page num should be 50",
                undefined,
                13,
                true,
                false
            ]
            
            for (const input of paramList) {
                const ret = Util.parsePageSize(input)

                expect(ret).toBe(20)
            }
        })

        test('should return 100', async () => {
            const paramList = [
                "100",
                "200"
            ]
            
            for (const input of paramList) {
                const ret = Util.parsePageSize(input)
    
                expect(ret).toBe(100)
            }
        })
    })


    describe('Object Exists Functions', () => {
        beforeAll(async () => {
            await connectDB()
            
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

        })

        afterAll(async () => {
            await disconnectDB()
        })

        describe('userExists', () => {

            test('should return true', async () => {
                const userArray = [
                    '100000000000000000000000',
                    '200000000000000000000000'
                ]
    
                const ret = await Util.userExists(userArray)
                
                expect(ret).toBe(true)
            })
            
            test('should return true', async () => {
                const userArray = [
                    '100000000000000000000000',
                    'username01'
                ]
                
                const ret = await Util.userExists(userArray)
                
                expect(ret).toBe(true)
            })
            
            test('should return true', async () => {
                const userArray = [
                    '100000000000000000000000',
                    'username02'
                ]
    
                const ret = await Util.userExists(userArray)
                
                expect(ret).toBe(true)
            })
            
            test('should return true', async () => {
                const userId = '100000000000000000000000'
                
                const ret = await Util.userExists(userId)
                
                expect(ret).toBe(true)
            })
            
            test('should return true', async () => {
                const username = 'username01'
                
                const ret = await Util.userExists(username)
                
                expect(ret).toBe(true)
            })
            
            test('should return false', async () => {
                const userArray = [
                    '100000000000000000000000',
                    '000000000000000000000000',
                ]
    
                const ret = await Util.userExists(userArray)
                
                expect(ret).toBe(false)
            })
            
            test('should return false', async () => {
                const userArray = [
                    '100000000000000000000000',
                    13
                ]
                
                const ret = await Util.userExists(userArray)
                
                expect(ret).toBe(false)
            })
            
            test('should return false', async () => {
                const userId = '000000000000000000000000'
                
                const ret = await Util.userExists(userId)
                
                expect(ret).toBe(false)
            })
            
            test('should return false', async () => {
                const username = 'nonexistant'
                
                const ret = await Util.userExists(username)
                
                expect(ret).toBe(false)
            })
            
            test('should return false', async () => {
                
                const ret = await Util.userExists(undefined)
                
                expect(ret).toBe(false)
            })
        })

    })
    
})