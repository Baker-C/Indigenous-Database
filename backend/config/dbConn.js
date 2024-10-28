const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
let mongoServer

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV == 'test') {
            mongoServer = await MongoMemoryServer.create()
            const uri = mongoServer.getUri()
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => console.log("MongoDB Memory Server connected."))
        } else {
            await mongoose.connect(process.env.DATABASE_URI)
        }
    } catch (err) {
        console.log(err)
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect(process.env.DATABASE_URI)
        .then(() => console.log("MongoDB disconnected."))
        if (process.env.NODE_ENV == 'test') {
            await mongoServer.stop()
            .then(() => console.log("MongoDB Memory Server stopped."))
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = { connectDB, disconnectDB }