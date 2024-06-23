# Admin Api Spec

## Create Admin

Endpoint : POST /admin

Request Body :

```json
{
  "username": "example",
  "password": "example"
}
```

Responses Body Success :

```json
{
  "status": 200,
  "message": "admin successfully register",
  "data": {
    "username": "example"
  },
  "refrence": null,
  "error": false
}
```

Response Body Error :

```json
{
  "status": 400,
  "message": "admin username already exist",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Admin Login

Endpoint : POST /admin/login

Request Body :

```json
{
  "username": "example",
  "password": "example"
}
```

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNzE4NjA3MzEwNTVkNDUzYzlhNS00M2VjLTQyNDAtYWMyOC0wNGMwMTMwMmQ4ZjQxNzE5MTM3OTYwMjQyIiwiaWF0IjoxNzE5MTM4MjQ5LCJleHAiOjE3MTkxMzg1NDl9.X1_lZF3RP4Yb9-JIu50m8pvS_7PsWTYnaGwtlFVQ2_c",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNzE4NjA3MzEwNTVkNDUzYzlhNS00M2VjLTQyNDAtYWMyOC0wNGMwMTMwMmQ4ZjQxNzE5MTM3OTYwMjQyIiwiaWF0IjoxNzE5MTM4MjQ5LCJleHAiOjE3MTk3NDMwNDl9.7acXRr2LJsTTCTJcXQpiYWTHUIh6lQP4RWVpBxhK80Y"
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "username and password not match",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Admin Verify Token

Endpoint : GET /admin/verify-token

Headers

- Authorization : Bearer access_token

Responses Body Success

```json
{
  "status": 200,
  "message": "access_token verified",
  "data": null,
  "refrence": null,
  "error": false
}
```

Responses Body Error

```json
{
  "status": 400,
  "message": "please provided valid access_token",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Admin Refresh Token

Endpoint : GET /admin/refresh-token

Headers

- Authorization : Bearer refresh_token

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully generate new access_token",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4NTk3MzgyNTc3NjQwZWZlYTE4OS0wN2UzLTRjM2QtOTBiYy1iMjFlYzc3YWU4OTcxNzE4ODY0NjE2MjcyIiwiaWF0IjoxNzE5MTM4Nzg4LCJleHAiOjE3MTkxMzkwODh9.09sIAkdjWzS2uusvETTB33dfgMR2anG_CRjXo-mq9DI"
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error

```json
{
  "status": 400,
  "message": "please provided valid refresh_token",
  "data": null,
  "refrence": null,
  "error": true
}
```
