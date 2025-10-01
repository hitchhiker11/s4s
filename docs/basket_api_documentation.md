# Basket API Documentation

## Overview
The Basket API allows for retrieving and managing shopping cart contents for both authenticated and guest users. The API maintains cart state using a `fuser_id` parameter.

## Base URL
```
https://old.shop4shoot.com/api/basket
```

## Authentication
Authentication is not required for basic basket operations. The basket state is tracked using `fuser_id`.

## Request Parameters

### Common Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fuser_id | integer | No | Basket user identifier. If not provided, a new one will be generated |
| format | string | No | Response format: 'full', 'compact', 'minimal' |

## Endpoints

### GET /api/basket
Retrieves the current basket contents.

**Query Parameters:**
- `fuser_id` (integer): Basket user identifier
- `format` (string): Response format ['full', 'compact', 'minimal']

**Success Response:**
```json
{
  "meta": {
    "fuser_id": 121116089,
    "is_fuser_from_request": true,
    "site_id": "s1",
    "format": null,
    "request_time": "2025-07-01 18:12:56"
  },
  "basket": {
    "items": {
      "items": [
        {
          "id": 2224,
          "product_id": 8194,
          "name": "Поло Eiger Tac Glisenti SS WS XL ASIA / L EUR (navy)",
          "price": 2600,
          "quantity": 3,
          "sum": 7800,
          "currency": "RUB",
          "weight": 0,
          "properties": [],
          "detail_page_url": null,
          "product_xml_id": null
        }
      ],
      "summary": {
        "count": 1,
        "quantity": 3,
        "total_price": 7800,
        "base_price": 7800,
        "weight": 0,
        "currency": "RUB",
        "fuser_id": 121116089
      }
    },
    "summary": {
      "count": 1,
      "quantity": 3,
      "total_price": 7800,
      "base_price": 7800,
      "weight": 0,
      "currency": "RUB",
      "fuser_id": 121116089
    }
  }
}
```

> **Note:** Currently, the response may have `null` values for `detail_page_url` and missing product image information. These fields should be populated with actual product URLs and image links in future updates.

**Expected Additional Fields:**
Product items should include image information, for example:
```json
"picture": {
  "id": 123,
  "src": "/upload/images/product.jpg",
  "width": 800,
  "height": 600
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### POST /api/basket
Adds an item to the basket.

**Request Body:**
```json
{
  "fuser_id": 121116089,
  "product_id": 8194,
  "quantity": 1,
  "properties": {
    "color": "red",
    "size": "XL"
  }
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fuser_id | integer | Yes | Basket user identifier |
| product_id | integer | Yes | Product ID to add |
| quantity | integer | Yes | Quantity to add |
| properties | object | No | Additional product properties |

**Success Response:**
```json
{
  "success": true,
  "message": "Товар добавлен в корзину",
  "data": {
    "success": true,
    "message": "Товар добавлен в корзину",
    "basket_item_id": 2223
  },
  "fuser_id": 121116089
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### PATCH /api/basket
Updates an item in the basket.

**Request Body:**
```json
{
  "fuser_id": 121116089,
  "basket_item_id": 2223,
  "quantity": 3,
  "properties": {
    "color": "blue",
    "size": "M"
  }
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fuser_id | integer | Yes | Basket user identifier |
| basket_item_id | integer | Yes | Basket item ID to update |
| quantity | integer | Yes | New quantity |
| properties | object | No | Updated product properties |

**Success Response:**
```json
{
  "success": true,
  "message": "Товар обновлен",
  "data": {
    "basket_item_id": 2223
  },
  "fuser_id": 121116089
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### DELETE /api/basket
Removes an item from the basket.

**Request Body:**
```json
{
  "fuser_id": 121116089,
  "basket_item_id": 2223
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fuser_id | integer | Yes | Basket user identifier |
| basket_item_id | integer | Yes | Basket item ID to remove |

**Success Response:**
```json
{
  "success": true,
  "message": "Товар удален из корзины",
  "data": {
    "deleted_id": 2223
  },
  "fuser_id": 121116089
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Stock Validation
To check if a product is available in the requested quantity, use the following endpoint:

### GET /api/basket/
Validates if the requested quantity is available for a product.

**Query Parameters:**
- `action=check_stock`
- `product_id` (integer, required): Product ID to check
- `quantity` (integer, required): Quantity to validate

**Success Response:**
```json
{
  "success": true,
  "available": true,
  "available_quantity": 10,
  "requested_quantity": 3
}
```

**Error Response:**
```json
{
  "success": false,
  "available": false,
  "available_quantity": 2,
  "requested_quantity": 3,
  "error": "Insufficient stock"
}
```

## Best Practices

### Managing the fuser_id
1. When a user first visits the site, make a GET request to `/api/basket` without a `fuser_id`
2. Save the returned `fuser_id` in localStorage or cookies
3. Use this `fuser_id` for all subsequent basket operations

### Example Flow
1. User opens website → GET /api/basket → Save fuser_id
2. User adds item → POST /api/basket with saved fuser_id
3. User updates quantity → PATCH /api/basket with saved fuser_id and basket_item_id
4. User removes item → DELETE /api/basket with saved fuser_id and basket_item_id

### Error Handling
Always check the `success` field in responses to determine if an operation was successful. 