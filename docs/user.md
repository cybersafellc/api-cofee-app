# User Api Spec

## Create User

Endpoint : POST /users

Request Body :

```json
{
  "username": "example",
  "password": "example",
  "phone": "082299229922",
  "first_name": "satoshi",
  "last_name": "nakamoto"
}
```

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully register, please login",
  "data": {
    "username": "example",
    "first_name": "satoshi",
    "last_name": "nakamoto"
  },
  "refrence": "/users/login",
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "username already exist",
  "data": null,
  "refrence": null,
  "error": true
}
```

## User Login

Endpoint : POST /users/login

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
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyNzM3NTc0ODA4OTU2N2Q5MGFjYS0yNTcwLTRhMWYtOGU4Yy00NmU2NTg2MDMwODExNzE5MTExNzM5NTMyIiwiaWF0IjoxNzE5MTExODUyLCJleHAiOjE3MTkxMTIxNTJ9.LdoPufb65yiB-zLPj2h0avM9Q_3cPZmptnsOf-GspW4",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyNzM3NTc0ODA4OTU2N2Q5MGFjYS0yNTcwLTRhMWYtOGU4Yy00NmU2NTg2MDMwODExNzE5MTExNzM5NTMyIiwiaWF0IjoxNzE5MTExODUyLCJleHAiOjE3MTk3MTY2NTJ9.vTfr637jSsENXyfqbaSPQffKWERRZLDMW3wcdADNwl0"
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

## User Verify Token

Endpoint : GET /users/verify-token

Headers :

- Authorization: Bearer access_token

Responses Body Success :

```json
{
  "status": 200,
  "message": "access_token verified",
  "data": null,
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "please provided valid access_token",
  "data": null,
  "refrence": null,
  "error": true
}
```

## User Refresh Token

Enpdoint : GET /users/refresh-token

Headers :

- Authorization : Bearer refresh_token

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully generate access_token",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyNzM3NTc0ODA4OTU2N2Q5MGFjYS0yNTcwLTRhMWYtOGU4Yy00NmU2NTg2MDMwODExNzE5MTExNzM5NTMyIiwiaWF0IjoxNzE5MTEyMzQ0LCJleHAiOjE3MTkxMTI2NDR9.M1HuDIvJ4wbSS9BE1BQ-NyGtI-cSQGSH0uGMObbTOQE"
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "please provided valid refresh_token",
  "data": null,
  "refrence": null,
  "error": true
}
```

## User Create Order

Endpoint : POST /users/orders

Headers :

- Authorization : Bearer access_token

Request Body :

```json
{
  "product_id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f"
}
```

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully order",
  "data": {
    "id": "121239e87e7dd-d4a9-455d-b526-b1af5002c617",
    "payment_link": "https://app.sandbox.midtrans.com/snap/v4/redirection/a398d883-96ce-40e0-8c7f-2073e21864a3",
    "token_pay": "a398d883-96ce-40e0-8c7f-2073e21864a3"
  },
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

## User Get Orders

Endpoint : GET /users/orders

Headers :

- Authorization : Bearer access_token

Responses Body Success

```json
{
  "status": 200,
  "message": "successfully response",
  "data": [
    {
      "id": "121239e87e7dd-d4a9-455d-b526-b1af5002c617",
      "user_id": "227375748089567d90aca-2570-4a1f-8e8c-46e6586030811719111739532",
      "total": 30000,
      "pending_payment": true,
      "processing": false,
      "done": false,
      "cancel": false,
      "date": "2024-06-23T00:00:00.000Z",
      "token_pay": "a398d883-96ce-40e0-8c7f-2073e21864a3",
      "payment_link": "https://app.sandbox.midtrans.com/snap/v4/redirection/a398d883-96ce-40e0-8c7f-2073e21864a3",
      "product_details": {
        "id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f",
        "name": "Expresso",
        "price": 30000,
        "img": "http://localhost:3001/products/images/59460036283830b687e3-a79c-4806-8b78-8d7bc68555d5.jpg",
        "stocks": true,
        "description": "Ekstrak biji kopi murni tanpa campuran"
      }
    }
  ],
  "refrence": null,
  "error": false
}
```

## User Get Orders By ID

Endpoint : GET /users/orders?id=121239e87e7dd-d4a9-455d-b526-b1af5002c617

Headers :

- Authorization : Bearer access_token

Responses Body Success

```json
{
  "status": 200,
  "message": "successfully get",
  "data": {
    "id": "121239e87e7dd-d4a9-455d-b526-b1af5002c617",
    "user_id": "227375748089567d90aca-2570-4a1f-8e8c-46e6586030811719111739532",
    "total": 30000,
    "pending_payment": true,
    "processing": false,
    "done": false,
    "cancel": false,
    "date": "2024-06-23T00:00:00.000Z",
    "token_pay": "a398d883-96ce-40e0-8c7f-2073e21864a3",
    "payment_link": "https://app.sandbox.midtrans.com/snap/v4/redirection/a398d883-96ce-40e0-8c7f-2073e21864a3",
    "product_details": {
      "id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f",
      "name": "Expresso",
      "price": 30000,
      "img": "http://localhost:3001/products/images/59460036283830b687e3-a79c-4806-8b78-8d7bc68555d5.jpg",
      "stocks": true,
      "description": "Ekstrak biji kopi murni tanpa campuran"
    }
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "order does not exist",
  "data": null,
  "refrence": null,
  "error": true
}
```

## User Cancel Order

Endpoint : PUT /users/orders/cancel

Headers :

- Authorization : Bearer access_token

Request Body :

```json
{
  "id": "121239e87e7dd-d4a9-455d-b526-b1af5002c617"
}
```

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully canceled",
  "data": {
    "status_code": "200",
    "status_message": "Success, transaction is canceled",
    "transaction_id": "982547bf-0ae5-4dd3-95c6-578025170099",
    "order_id": "121239e87e7dd-d4a9-455d-b526-b1af5002c617",
    "merchant_id": "G912356006",
    "gross_amount": "30000.00",
    "currency": "IDR",
    "payment_type": "bank_transfer",
    "transaction_status": "cancel",
    "fraud_status": "accept",
    "transaction_time": "2024-06-23 11:41:37"
  },
  "refrence": null,
  "error": false
}
```

Responses Body Error :

```json
{
  "status": 400,
  "message": "this pending orders does not exist on your account",
  "data": null,
  "refrence": null,
  "error": true
}
```

Responses Body Error (if users has not select payment methode) :

```json
{
  "status": 400,
  "message": "you hasn't select payment methode, please select payment methode before take action cancel",
  "data": null,
  "refrence": null,
  "error": true
}
```
