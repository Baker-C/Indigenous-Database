# MongoDB Database Documentation

## Overview

This document provides an overview of the different objects (collections and documents) stored in the MongoDB database for the project. Each collection contains various documents that represent different entities within the project.


## Clusters

### 1. **Cluster0**

This is the first and only cluster made for the project. I will transfer it to another name eventually but for now this is the only cluster being used. This is the most cost effective solution for the project because there is only one free teir cluster allowed per person .

## Databases

### 1. **test**

Similarly this is the first database made for the project. I will use a different database called DeploymentDB once deployment occurs. It holds all of the current development data before the schemas were updated.

### 3. **Deployment**

This is the deployment database. It will be in use once deployment occurs.

### 2. **DevelopmentDB**

This is the new dev database. It will hold all future development data from after the schema changes.

### 3. **TestDB**

This is the test database. It holds all data used during testing of the API.


## Collections

### 1. **Users Collection**
   - **Description:** Stores information about the users registered in the system.
   - **Document Structure:**
     ```json
     {
       "_id": "ObjectId",        // Unique identifier for the user
       "username": "string",     // Unique username chosen by the user
       "email": "string",        // User's email address
       "password": "string",     // Hashed password for security
       "created": "Date",        // Timestamp when the user was created
       "roles": ["string"],      // Array of roles assigned to the user (e.g., "admin", "user")
       "profile": {
         "firstName": "string",  // User's first name
         "lastName": "string",   // User's last name
         "avatar": "string"      // URL to the user's avatar image
       },
       "catalogues": ["ObjectId"], // Catalogues created or saved by the user
       "groups": ["ObjectId"]   // Groups where the user is a member or admin
     }
     ```

### 2. **Books Collection**
   - **Description:** Stores information about individual books available in the system.
   - **Document Structure:**
     ```json
     {
       "_id": "ObjectId",        // Unique identifier for the book
       "title": "string",        // Title of the book
       "author": "string",       // Author of the book
       "description": "string",  // Description of the book 
       "isbn": "string",         // ISBN number of the book
       "publishedDate": "Date",  // Publication date of the book
       "genre": "string",        // Genre of the book (e.g., "Fiction", "Non-fiction")
       "coverImage": "string",   // URL to the cover image of the book
       "cost": "number",         // Cost of the book
       "link": "string",         // Link to the book pdf or purchase page
       "created": "Date"         // Date that the book was added to the database
     }
     ```

### 3. **Catalogues Collection**
   - **Description:** Stores information about catalogues, which are collections of books.
   - **Document Structure:**
     ```json
     {
       "_id": "ObjectId",        // Unique identifier for the catalogue
       "name": "string",         // Name of the catalogue
       "description": "string",  // Description of the catalogue
       "owner": "ObjectId",      // Reference to the user who created the catalogue
       "entries": ["ObjectId"],    // Array of book IDs included in the catalogue
       "created": "Date",        // Timestamp when the catalogue was created
       "updated": "Date",        // Timestamp when the catalogue was last modified
       "color": "string"         // Color category of the catalogue (e.g. "Blue", "Violet")
     }
     ```

### 4. **Groups Collection**
   - **Description:** Stores information about groups of users within the system.
   - **Document Structure:**
     ```json
     {
       "_id": "ObjectId",        // Unique identifier for the group
       "name": "string",         // Name of the group
       "description": "string",  // Description of the group
       "created": "Date",        // Timestamp when the group was created
       "admins": ["ObjectId"],   // Array of user IDs who are admins of the group
       "members": ["ObjectId"]   // Array of user IDs who are members of the group
     }
     ```

## Controllers

### 1. **Users Controller**
   - **Description:** REST endpoint specifications for users.

#### GET
   - **GET description:** A username, userId, and password can be provided. If no username or userId is sent, then a list of all users is returned. This is mainly used for testing during development. A username of userId can be provided to query for a user. In both cases, a list of usernames or userIds also returns the list of queried users. 
   
   All users are returned with a populated catalogues field.

   Queries should NEVER return emails or passwords for security purposes.



#### CREATE
   - **CREATE description:** A username, email, password, rePassword, firstName, and lastName are all required for creation. The pass and rePass must match. A new Saved Books catalogue is added. (Will need to adjust for new types of entries in the future). 

#### UPDATE
   - **UPDATE description:** A username is required to check what 