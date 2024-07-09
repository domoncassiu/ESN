# Iteration 1 - Login Logout & Chat Publicly

## API Docs

#### Request for token

```http request
POST /auth/token HTTP/1.1
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

#### Request for acknowledgement

##### PUT

```http request
PUT /auth/acknowledgement HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhc2lyZWtoYTExIiwidHlwZSI6IkNpdGl6ZW4iLCJpYXQiOjE3MDcyNzk2OTV9.coDRvgOJHk8ufRRQRGGk5dOEV6Yf1sT_cSUkwZG79C0
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

##### GET

```http request
GET /auth/acknowledgement HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGI6IkpXVCJ9.eyJ1c2mV4cCI6MTcwODU1Mjg3OX0.VRZpWKbzCz3bxqd8U
```

##### Response

```json
{
  "acknowledged": false
}
```

#### Request to get users for ESN Directory

```http request
GET /users?page=3&pageSize=50&ascending=true HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOI6IkpXVCJ9.eyJ1c2VywODUzMjk5N30.Mvj5eL6JDMkz9ybMoCxS4
```

##### Response

```json
[
  {
    "username": "sasirekha11",
    "type": "Citizen",
    "acknowledged": false,
    "isActive": true,
    "onlineStatus": "Offline",
    "safetyStatus": "OK"
  },
  {
    "username": "sasirekha12",
    "type": "Citizen",
    "acknowledged": false,
    "isActive": true,
    "onlineStatus": "Offline",
    "safetyStatus": "OK"
  },
  {
    "username": "sasirekha14",
    "type": "Citizen",
    "acknowledged": true,
    "isActive": true,
    "onlineStatus": "Offline",
    "safetyStatus": "OK"
  }
]
```

#### Request to public chat room

##### POST message

```http request
POST /chatRooms/public HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJICJ9.eyJ1c2VybmFtCI6MTcwODQ4NTY5NH0.o5vwa1oPMP7H-Zlt7g
Content-Type: application/json
Content-Length: 42

{
    "message": "hello from REST API 2"
}
```

##### Response

```json
{
  "messageId": "3e9a6b6f-3568-45a2-b73b-2fca66937ce3",
  "sender": "sasirekha12",
  "message": "hello from REST API 2",
  "safetyStatus": "OK",
  "timestamp": 1708482673665
}
```

##### GET chat history

```http request
GET /chatRooms/public?page=1&pageSize=50&ascending=false HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhcCI6IkpXVCJ9.eyJJpYXQiOjE3MDg1NDQyOTMsImV4cCI6MTcwODU0Nzg5M30.DQyI5Pe5sCkr_b4
```

##### Response

```json
[
  {
    "_id": "65d5b6ce3d144152a54bea0e",
    "messageId": "44f00239-797b-4186-ae96-9e062e23afbb",
    "sender": "wang",
    "safetyStatus": "OK",
    "message": "asdasd",
    "timestamp": 1708504782059,
    "createdAt": "2024-02-21T08:39:42.064Z",
    "updatedAt": "2024-02-21T08:39:42.064Z",
    "__v": 0
  },
  {
    "_id": "65d59faa927f60c79fda46c6",
    "messageId": "f0fd9136-425d-4ddf-b046-f44632a0dbab",
    "sender": "123411",
    "safetyStatus": "OK",
    "message": "22",
    "timestamp": 1708498858917,
    "createdAt": "2024-02-21T07:00:58.918Z",
    "updatedAt": "2024-02-21T07:00:58.918Z",
    "__v": 0
  }
]
```
