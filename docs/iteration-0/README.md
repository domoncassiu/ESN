# Iteration 0 - Join Community

## API Docs

#### Request to register

```HTTP
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 70

{
    "username": "foo",
    "password": "bar"
}
```

##### Response

```json
{
  "accessToken": "eyJhbGciOiJI0000NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhc2lyZWtoYTExIiwidH000I6IkNpdGl6ZW4iLCJpYXQiOjE3MDcyNjQ2MTN9.7xlP1H63cwmD9y00006cwRSTnZcsp9coUkcXZZZi-38"
}
```

#### Request to login

```HTTP
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 70

{
    "username": "foo",
    "password": "bar"
}
```

##### Response

```json
{
  "accessToken": "eyJhbGciOiJI0000NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhc2lyZWtoYTExIiwidH000I6IkNpdGl6ZW4iLCJpYXQiOjE3MDcyNjQ2MTN9.7xlP1H63cwmD9y00006cwRSTnZcsp9coUkcXZZZi-38"
}
```

#### Request to validate

```HTTP
POST /auth/validate HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 70
{
    "username": "foo",
    "password": "bar"
}
```

##### Response

```json
{
  "message": "<error message>",
  "status": "error"
}
```

(or)

```json
{
  "status": "success"
}
```

#### Request to acknowledge terms

```HTTP
PUT /auth/terms HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiIsInRVCJ9.eyJ1c2VybmF4iLCJpYXQiOjE3MDcyNzk2OTV9.coDRvgOJHk8ufR_cSUkwZG79C0
Content-Type: application/json
Content-Length: 28

{
    "acknowledged": true
}
```

##### Response

```json
{
  "status": "success"
}
```

## Sequence Diagram

### Overall Flow

![Sequence Diagram - Part 1](./SequenceDiagram1.png)
![Sequence Diagram - Part 1](./SequenceDiagram2.png)

```websequencediagrams
title Iteration 0 - Join Community



User->UI: Clicks on register button
note left of AuthMiddleware: /auth is exempt from middleware
UI->Server: GET /auth
Server->UI: Serve registration page
User->UI: Registration details
note left of AuthMiddleware: /auth/register is exempt from middleware
UI->Server: POST /auth/register
Server->DB: Verify that user does not exist
Server->DB: Create user
Server->UI: Return JWT as accessToken
note left of UI: Store accessToken in browser memory
UI->AuthMiddleware: GET /welcome + accessToken in Authorization header
note left of AuthMiddleware: Verify JWT validity
AuthMiddleware->Server: GET /welcome
Server->UI: Serve welcome page
User->UI: Clicks agree button
UI->AuthMiddleware: POST /user/acknowledgement + accessToken in Authorization header
note left of AuthMiddleware: Verify JWT validity
AuthMiddleware->Server: POST /user/acknowledgement
Server->DB: Store acknowledgement for loggedIn user
Server->UI: Return success
User->UI: Clicks logout button
note left of UI: Delete JWT from browser memory
UI->Server: GET /logout
Server->UI: Redirect to home

```
