# Public API Spec

## Get Products

Endpoint : GET /products

Responses Body Success :

```json
{
  "status": 200,
  "message": "successfully get products",
  "data": [
    {
      "id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f",
      "name": "Expresso",
      "price": 30000,
      "img": "http://localhost:3001/products/images/59460036283830b687e3-a79c-4806-8b78-8d7bc68555d5.jpg",
      "stocks": true,
      "description": "Ekstrak biji kopi murni tanpa campuran"
    }
  ],
  "refrence": null,
  "error": false
}
```

## Get Product By ID

Endpoint : GET /products?id=844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f

Responses Body Success

```json
{
  "status": 200,
  "message": "successfully get product",
  "data": {
    "id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f",
    "name": "Expresso",
    "price": 30000,
    "img": "http://localhost:3001/products/images/59460036283830b687e3-a79c-4806-8b78-8d7bc68555d5.jpg",
    "stocks": true,
    "description": "Ekstrak biji kopi murni tanpa campuran"
  },
  "refrence": null,
  "error": false
}
```

## Get Product By Search

Endpoint : GET /products?q=expresso

Responses Body Success

```json
{
  "status": 200,
  "message": "successfully get products",
  "data": [
    {
      "id": "844507979219ae06b41f-86e4-4334-bda8-e7f70797bb4f",
      "name": "Expresso",
      "price": 30000,
      "img": "http://localhost:3001/products/images/59460036283830b687e3-a79c-4806-8b78-8d7bc68555d5.jpg",
      "stocks": true,
      "description": "Ekstrak biji kopi murni tanpa campuran"
    }
  ],
  "refrence": null,
  "error": false
}
```
