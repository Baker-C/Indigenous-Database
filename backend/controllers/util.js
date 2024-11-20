const User = require('../schemas/User')
const Book = require('../schemas/Book')
const Catalogue = require('../schemas/Catalogue')

const mongoose = require('mongoose')
const ObjIdInstance = mongoose.Types.ObjectId
const ObjId = ObjIdInstance.createFromHexString
const isValidObjId = ObjIdInstance.isValid



module.exports.toArray = (arr) => {
    return Array.isArray(arr) ? arr : (arr ? [arr] : [])
}



module.exports.usernameOverMaxLength = (username) => {
    const usernameMaxLength = User.schema.paths['username'].options['maxLength'][0]
    const usernameMaxLengthWarning = User.schema.paths['username'].options['maxLength'][1]

    if (username?.length > usernameMaxLength) {
        return usernameMaxLengthWarning
    }
    return false
}



module.exports.descriptionOverMaxLength = (description) => {
    const descriptionMaxLength = Book.schema.paths['description'].options['maxLength'][0]
    const descriptionMaxLengthWarning = Book.schema.paths['description'].options['maxLength'][1]


    if (description?.length > descriptionMaxLength) {
        return descriptionMaxLengthWarning
    }
    return false
}



module.exports.invalidObjId = (objIds) => {
    const objIdArray = module.exports.toArray(objIds)
    const validObjIds = objIdArray.filter(id => {
        return isValidObjId(id) 
            && typeof id === 'string'
            && /^[a-fA-F0-9]{24}$/.test(id)
    })

    if (validObjIds?.length < objIdArray?.length) {
        return true
    }
    return false
}



module.exports.trimWhitespace = (obj) => {
    if (!obj | Object?.length === 0) {
        return
    } else if (typeof obj === 'object' && !Array.isArray(obj)) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key]?.trim()
            }
        })
    } else if (typeof obj === 'object' && Array.isArray(obj)) {
        obj.forEach((value, index) => {
            if (typeof value === 'string') {
                obj[index] = value.trim();
            }
        })
    }
} 



module.exports.parseCost = (input) => {
    if (!input | typeof input !== 'string') {
        return undefined
    }

    const numericStr = toStandardUS(input)

    const parsed = parseFloat(numericStr)

    if (isNaN(parsed)) {
        return undefined
    }
    
    return parsed
}



module.exports.parsePageNumber = (input) => {
    const min = 0
    
    if (typeof input !== 'string') {
        return min
    }

    return Math.max((parseInt(input, 10) - 1) || min, min)
}



module.exports.parsePageSize = (input) => {
    const min = 1
    const max = 100
    const standard = 20

    if (typeof input !== 'string') {
        return standard
    }
    return Math.min(Math.max(parseInt(input, 10) || standard, min), max)
}



module.exports.validISBN = (code) => {
    if (typeof code == 'string') {    
        const isbn10Pattern = /^\d{9}[\dX]$/
        
        const isbn13Pattern = /^(978|979)\d{10}$/
        
        const cleanedCode = code?.replace(/[-\s]/g, '');
        
        if (isbn10Pattern.test(cleanedCode) || isbn13Pattern.test(cleanedCode)) {
            return true
        }
    }
    
    return false
}



module.exports.userExists = async (checkObj) => {
    const objArray = module.exports.toArray(checkObj)
    
    if (objArray?.length == 0) {
        return false
    }
    
    // Separate `_id` and `username` values
    const objIds = objArray
    .filter(item => {
        return isValidObjId(item) && (typeof item === 'string' || item instanceof ObjIdInstance)
    })
    .map(item => {
        return typeof item === 'string' ? ObjId(item) : item
    })
    
    const usernames = objArray
    .filter(item => !isValidObjId(item))
    .filter(item => typeof item === 'string')
    
    const numUsersFromIds = await User
    .find({ _id: { $in : objIds } })
    .countDocuments()
    .lean()
    .exec()
    
    const numUsersFromUsernames = await User
    .find({ username: { $in : usernames } })
    .countDocuments()
    .lean()
    .exec()
    
    const totalUsersFound = numUsersFromIds + numUsersFromUsernames
    
    if (totalUsersFound < objArray?.length) {
        return false
    }
    return true
}



const toStandardUS = (input) => {
    // Convert European and American notation into American
    if (input.includes(',')) {
        if (input.match(/,\d{1,2}$/)) {
            // If there's a comma followed by one or two digits at the end, it's a European decimal point
            input = input.replace(/\./g, '').replace(',', '.')
        } else {
            // Otherwise, treat the commas as thousands separators
            input = input.replace(/,/g, '')
        }
    } else {
        // If input uses American notation (period as decimal point), just remove thousands separators
        input = input.replace(/\.(?=\d{3})/g, '')
    }
    const numericStr = input.replace(/[^0-9.]/g, '')

    return numericStr
}