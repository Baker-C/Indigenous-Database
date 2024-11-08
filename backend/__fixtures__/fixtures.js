const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId.createFromHexString

const userFixtures = [
    {
        "_id": ObjId("100000000000000000000000"),
        "username": "username01",
        "email": "email01@email.com",
        "password": "password01",
        "roles": "User",
        "profile": {
            "firstName": "firstName01",
            "lastName": "lastName01",
            "avatar": "avatar01",
        },
        "catalogues": [
            ObjId("600000000000000000000000")
        ],
        "groups": [],
        "created": null
    },
    {
        "_id": ObjId("200000000000000000000000"),
        "username": "username02",
        "email": "email02@email.com",
        "password": "password02",
        "roles": "User",
        "profile": {
            "firstName": "firstName02",
            "lastName": "lastName02",
            "avatar": "avatar02",
        },
        "catalogues": [
            ObjId("700000000000000000000000"),
            ObjId("800000000000000000000000")
        ],
        "groups": [],
        "created": null
    },
]



const bookFixtures = [
    {
        "_id": ObjId("300000000000000000000000"),
        "title": "title01",
        "author": "author01",
        "description": "description01",
        "isbn": "iisbn01",
        "publishedDate": null,
        "genre": [],
        "coverImage": "coverImage01",
        "cost": "01",
        "link": "link01",
        "created": null
    },
    {
        "_id": ObjId("400000000000000000000000"),
        "title": "title02",
        "author": "author02",
        "description": "description02",
        "isbn": "iisbn02",
        "publishedDate": null,
        "genre": [],
        "coverImage": "coverImage02",
        "cost": "02",
        "link": "link02",
        "created": null
    },
    {
        "_id": ObjId("500000000000000000000000"),
        "title": "title03",
        "author": "author03",
        "description": "description03",
        "isbn": "iisbn03",
        "publishedDate": null,
        "genre": [],
        "coverImage": "coverImage03",
        "cost": "03",
        "link": "link03",
        "created": null
    }
]



const catalogueFixtures = [
    {
        "_id": ObjId("600000000000000000000000"),
        "name": "name",
        "description": "description",
        "owner": ObjId("100000000000000000000000"),
        "entries": [
        ],
        "created": null,
        "updated": null,
        "color": "#2E8B57"
    },
    {
        "_id": ObjId("700000000000000000000000"),
        "name": "name",
        "description": "description",
        "owner": ObjId("200000000000000000000000"),
        "entries": [
        ],
        "created": null,
        "updated": null,
        "color": "#2E8B57"
    },
    {
        "_id": ObjId("800000000000000000000000"),
        "name": "name",
        "description": "description",
        "owner": ObjId("200000000000000000000000"),
        "entries": [
        ],
        "created": null,
        "updated": null,
        "color": "#2E8B57"
    }
]

module.exports = { userFixtures, bookFixtures, catalogueFixtures }