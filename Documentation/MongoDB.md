# MongoDB Database Documentation

---

## Preface

#### Introduction

This is documentation for all information regarding the Indigenous Database's storage structure, storage components, and API functionalities. The preface contains background information needed to understand the documentation, while the following sections describe the specifications and details of the database structure and API. 

#### MongoDB Document Based Storage

The database used is primarily MongoDB, meaning it relies on document-based storage. Each type of document is an entry in the database and is structured by it's *schema*, a set of fields that describe what data a document can hold. Schemas are unique, and multiple documents often follow the same schema. Documents are grouped into *collections*, and while documents of differing schemas can belong to the same collection, this is not used to preserve predictability. Collections are used to query and update documents. Multiple collections are stored in a MongoDB *database*, and multiple databases belong to a *cluster*.

#### AWS Bucket Cloud Storage

This is used in this project for storing images, primarily book covers.

---
## Database Structure

### Clusters

#### 1. **Cluster0**

This is the first and only cluster made for the project. I will transfer it to another name eventually but for now this is the only cluster being used. This is the most cost effective solution for the project because there is only one free teir cluster allowed per person .

### Databases

#### 1. **test**

Similarly this is the first database made for the project. I will use a different database called DeploymentDB once deployment occurs. It holds all of the current development data before the schemas were updated.

#### 3. **Deployment**

This is the deployment database. It will be in use once deployment occurs.

#### 2. **DevelopmentDB**

This is the new dev database. It will hold all future development data from after the schema changes.

---

# Collections

#### 1. **Users Collection**
   - **Description:** 
      - Stores information about the users registered in the system.
   - **Document Structure:**
     ```
     {
       "_id": "ObjectId",        // Unique identifier for the user
       "username": "string",     // Unique username chosen by the user
       "email": "string",        // User's email address
       "password": "string",     // Hashed password for security
       "created": "Date",        // Timestamp when the user was created
       "roles": "string",      // Array of roles assigned to the user (e.g., "Admin", "User")
       "profile": {
         "firstName": "string",  // User's first name
         "lastName": "string",   // User's last name
         "avatar": "string"      // URL to the user's avatar image
       },
       "catalogues": ["ObjectId"], // Catalogues created or saved by the user
       "groups": ["ObjectId"]   // Groups where the user is a member or admin
     }
     ```

#### 2. **Books Collection**
   - **Description:** 
      - Stores information about individual books available in the system.
   - **Document Structure:**
     ```
     {
       "_id": "ObjectId",        // Unique identifier for the book
       "title": "string",        // Title of the book
       "author": "string",       // Author of the book
       "description": "string",  // Description of the book 
       "isbn": "string",         // ISBN number of the book
       "publishedDate": "Date",  // Publication date of the book
       "genre": ["string"],        // Genre of the book, numerated (e.g., "Fiction", "Non-fiction")
       "coverImage": "string",   // URL to the cover image of the book
       "cost": "number",         // Cost of the book
       "link": "string",         // Link to the book pdf or purchase page, AWS cloud bucket
       "created": "Date"         // Date that the book was added to the database
       // add in tribal affiliation
     }
     ```

#### 3. **Catalogues Collection**
   - **Description:** 
      - Stores information about catalogues, which are collections of books.
   - **Document Structure:**
     ```
     {
       "_id": "ObjectId",        // Unique identifier for the catalogue
       "name": "string",         // Name of the catalogue
       "description": "string",  // Description of the catalogue
       "owner": "ObjectId",      // Reference to the user who created the catalogue
       "entries": ["ObjectId"],    // Array of book IDs included in the catalogue
       "created": "Date",        // Timestamp when the catalogue was created
       "updated": "Date",        // Timestamp when the catalogue was last modified
       "color": "string"         // Color category of the catalogue (e.g. "#FFFFFF", "#123456")
     }
     ```

#### 4. **Groups Collection**
**
   IMPORTANT NOTICE 
      
   GROUPS ARE CURRENTLY NOT PART OF THE GOAL, WILL BE PUT ON THE BACK BURNER UNTIL THE WEBSITE HAS FULL SEARCH / SHARING CAPABILITIES
**
   - **Description:** 
      - Stores information about groups of users within the system.
   - **Document Structure:**
     ```
     {
       "_id": "ObjectId",        // Unique identifier for the group
       "name": "string",         // Name of the group
       "description": "string",  // Description of the group
       "privacy": "string".   // enumerated string of 'OPEN' or 'CLOSED', where 'CLOSED' requires admins to admit members from the queued array
       "created": "Date",        // Timestamp when the group was created
       "members": {
          "admins": ["ObjectId"],   // Array of user IDs who are admins of the group
          "accepted": ["ObjectId"],   // Array of user IDs who are current members of the group
          "queued": ["ObjectId"]    // Array of user IDs who are waiting to be accepted in by the admin
       }
     }
     ```
   
---

# Controller Functions

This document provides a summary of the key functions in the REST API. It including information on input parameters, outputs, errors, and any authorization requirements.

## Users Controller

#### `GET(req, res)`

- **Description**: 
   - Retrieves a user's data based on the provided user ID or username.

- **Inputs**:  
   - `req.body`: 
      - `{ userId (string) | userId[] (string array) }`
      - `{ username (string) | username[] (string array) }`
      - required: `userId` or `username`

- **Returns**: `{ [userObj] }` Array of User data in a json format.
   - `userObj`:
      - `catalogues` (populated)
      - `password` (excluded)

- **Throws**:  `{ message }` Error message in a json format.
   - `400`: 
      - 'User ID or username is required.' 
      - 'User(s) not found.'
   - `500`: 
      - 'Server error.'

- **Authorization**: 
   - Requires a valid authorization token.

#### `CREATE(req, res)`

- **Description**: 
   - Creates a new user in the system.

- **Inputs**:  
   - `req.body`: 
      - `{ username (string) }`
      - `{ email (string) }`
      - `{ password (string) }`
      - `{ rePassword (string) }`
      - `{ firstName (string) }`
      - `{ lastName (string) }`
      - required: username, email, password, rePassword, firstName, and lastName

- **Returns**:`{ message }` Success message in a json format.
   - `201`: 
      - 'New user (username) created.'

- **Throws**: `{ message }` Error message in a json format.
   - `400`: 
      - 'A firstName, lastName, username, email, password, and rePassword are required.'
      - 'The password and rePassword need to match.'
      - 'Error creating user.'
      - 'Error creating (catalogue name for all of a user's saved items) for new user.'
   - `409`: 
      - 'Duplicate username found.'
   - `500`: 
      - 'Server error.'

- **Authorization**: 
   - Requires a valid authorization token.

#### `UPDATE(req, res)`

- **Description**: 
   - Updates a previous user in the system.

- **Inputs**:  
   - `req.body`: 
      - `{ username (string) }`
      - `{ userId (string) }`
      - `{ newUsername (string) }`
      - `{ email (string) }`
      - `{ catalogueId (string) | catalgoueId[] (string array) }`
      - `{ removeCatalogueId (string) | removeCatalogueId[] (string array) }`
      - `{ groupId (string) | groupId[] (string array) }`
      - `{ removeGroupId (string) | removeGrouoId[] (string array) }`
      - required: `username` or `userId`

- **Returns**:`{ message }` Success message in a json format.
   - `204`: 
      - 'username) updated.'

- **Throws**: `{ message }` Error message in a json format.
   - `400`: 
      - 'A username or userId is required for updates.'
      - 'User not found.'
      - 'Catalogue(s) not found.'
      - 'Group(s) not found.'
   - `409`: 
      - 'Duplicate username found.'
   - `500`: 
      - 'Server error.'

- **Authorization**: 
   - Requires a valid authorization token.

#### `REMOVE(req, res)`

- **Description**: 
   - Removes a user and all their created catalogues, and groups in the system.

- **Inputs**:  
   - `req.body`: 
      - `{ username (string) }`
      - `{ userId (string) }`
      - required: `username` or `userId`

- **Returns**:`{ message }` Success message in a json format.
   - `200`: 
      - `User (username) deleted.`

- **Throws**: `{ message }` Error message in a json format.
   - `400`: 
      - 'Username or id is required.'
      - 'User not found.'
      - 'Catalogues of other users not updated with delete: (catalogueId)'
      - 'Unable to delete catalogue: (catalogueId)'
      - 'Groups not updated with delete.'
      - 'Unable to delete catalogue: (catalogueId)'
      - 'Failed to delete user.'

- **Authorization**: 
   - Requires a valid authorization token.

$~$

## Catalogues Controller

#### `createCatalogue(req, res)`

- **Description**: 
   - Creates a new catalogue.
- **Input**:
  - `req.body`:
    - `title` (string): The title of the catalogue.
    - `description` (string): A description of the catalogue.
- **Output**: Returns the newly created catalogue object.
- **Authorization**: Requires a valid authorization token.

#### `getCatalogue(req, res)`

- **Description**: 
   - Retrieves a catalogue based on its ID.
- **Input**:
  - `req.params`:
    - `catalogueId` (string): The unique identifier for the catalogue.
- **Output**: Returns the catalogue object if found, or an error message if the catalogue is not found.
- **Authorization**: 
   - Requires a valid authorization token.

$~$

## Groups Controller

#### `createGroup(req, res)`

- **Description**: Creates a new group in the system.
- **Input**:
  - `req.body`:
    - `name` (string): The name of the group.
    - `description` (string): A description of the group.
- **Output**: Returns the newly created group object.
- **Authorization**: Requires a valid authorization token.

#### `getGroup(req, res)`

- **Description**: Retrieves a group by its ID.
- **Input**:
  - `req.params`:
    - `groupId` (string): The unique identifier for the group.
- **Output**: Returns the group object if found, or an error message if the group is not found.
- **Authorization**: Requires a valid authorization token.



   #### GET
   - **Description:** Provides a list of all users if no `username` or `userId` is specified. Supplying either parameter queries specific users. Multiple usernames or userIds in the query return a filtered list.
   - **req.body** = `{
      username,
      userId
   }`
   - **required:** A username or userId.
   - **Security:** Authorization token required to make request.
   - **Returned:** User json object with populated `catalogues` field, excluded password field.

   #### CREATE
   - **Description:** Creates a new user. The required fields are `username`, `email`, `password`, `rePassword`, `firstName`, and `lastName`. The `password` and `rePassword` fields must match. A new "Saved Books" catalogue is added upon creation.
   - **req.body** = `{
      username,
      email,
      password,
      rePassword,
      firstName,
      lastName
   }`
   - **required:** A username, email, password, rePassword, firstName, and lastName.
   - **Security:** Authorization token required to make request.
   - **Returned:** Json message: 'New user (username) created'.

   #### UPDATE
   - **Description:** Requires `username` to update user information (unfinished).

---

## Coding Standards

#### Database Changes Using Mongoose :
```
   const returnValue = Collection
   .doSomething({
      withThisValue
   })
   .doThis()
   .doThis()
```
   e.g.
```
   const duplicate = await User
   .findOne({ 
      newUsername 
   })
   .lean()
   .exec()
```

#### Returning a Response
```
   return res
   .status()
   .json({
      message:
   })
```
   or
```
   return res
   .status()
   .json({
      returnObject
   })
```
#### Using filter, map, etc.
```
   const newArray = array.function(element => {
      return function(element)
   })
```
