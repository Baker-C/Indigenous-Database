## Middleware: `verifyJWT`

### Description
`verifyJWT` is middleware that verifies the presence and validity of a JSON Web Token (JWT) in the request headers. It checks if the user is authenticated by decoding and validating the token before allowing access to protected routes.

### Parameters
- **req**: Express Request object.  
- **res**: Express Response object.  
- **next**: Express `next` function that passes control to the next middleware or route handler.

### Usage
Apply `verifyJWT` to routes that require authentication. This middleware intercepts the request, checks for a valid token in the `Authorization` header, and attaches the decoded user data to the request object.

Example:
```javascript
const verifyJWT = require('./middleware/verifyJWT');

router.route('/protected')
    .get(verifyJWT, protectedController.accessProtectedResource);
```

### Expected Request Headers
Authorization: A header containing the token in the format: Bearer <token>

### Behavior
Token Not Found: If no token is provided, the middleware responds with a 401 Unauthorized error.
Invalid Token: If the token is invalid or expired, it responds with a 403 Forbidden error.

Valid Token: If the token is valid, it attaches the decoded user information (e.g., req.user) and proceeds to the next function.

### Response Codes
401 Unauthorized: No token provided.
403 Forbidden: Invalid or expired token.
200 OK: Successfully authenticated (passes control to the next middleware or route handler).