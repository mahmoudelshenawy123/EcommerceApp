# ECOMMERCEAPP

## Overview

ECOMMERCEAPP is a Node.js application built with Express.js for managing customers, users, orders, products, providers, and admin users. It provides functionalities such as adding, updating, deleting entities, and includes authentication, authorization, and more.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (Recommended version 16) installed on your local machine.
- PostgreSQL installed and running on your local machine.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. If this is your first time using the app, run `npm run seed` to create the default admin user (information stored in `src/constants/Keys.js`).

## Usage

1. Set up environment variables by creating a `.env` file based on the provided `.env.dev`.
2. Start the server using `npm run dev`.
3. The server will be running locally on the port specified in the environment variable `PORT` or the default port 8080.

## Scripts

- `npm run dev`: Start the server in development mode using nodemon.
- `npm run staging`: Start the server in staging mode using nodemon.
- `npm run seed`: Seed default admin data into the database.
- `npm run lint`: Lint source files using ESLint.
- `npm run lint:fix`: Fix linting errors automatically.

## Project Structure

```shell
.
├── .dockerignore
├── .env.dev
├── .env.docker
├── .env.staging
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── app.js
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
└── src
    ├── components
    │   ├── AdminUsers
    │   │   ├── AdminUsersController.js
    │   │   ├── AdminUsersModel.js
    │   │   ├── AdminUsersRelations.js
    │   │   ├── AdminUsersRoutes.js
    │   │   ├── AdminUsersServices.js
    │   │   └── AdminUsersValidation.js
    │   ├── Categories
    │   │   ├── CategoriesController.js
    │   │   ├── CategoriesModel.js
    │   │   ├── CategoriesRelations.js
    │   │   ├── CategoriesRoutes.js
    │   │   ├── CategoriesServices.js
    │   │   └── CategoriesValidation.js
    │   ├── Orders
    │   │   ├── OrdersController.js
    │   │   ├── OrdersModel.js
    │   │   ├── OrdersRelations.js
    │   │   ├── OrdersRoutes.js
    │   │   ├── OrdersServices.js
    │   │   └── OrdersValidation.js
    │   ├── Products
    │   │   ├── ProductsController.js
    │   │   ├── ProductsModel.js
    │   │   ├── ProductsRelations.js
    │   │   ├── ProductsRoutes.js
    │   │   ├── ProductsServices.js
    │   │   └── ProductsValidation.js
    │   ├── Providers
    │   │   ├── ProvidersController.js
    │   │   ├── ProvidersModel.js
    │   │   ├── ProvidersRelations.js
    │   │   ├── ProvidersRoutes.js
    │   │   ├── ProvidersServices.js
    │   │   ├── ProvidersStoriesModel.js
    │   │   └── ProvidersValidation.js
    │   └── Users
    │       ├── UsersController.js
    │       ├── UsersModel.js
    │       ├── UsersRelations.js
    │       ├── UsersRoutes.js
    │       ├── UsersServices.js
    │       └── UsersValidation.js
    ├── config
    ├── constants
    ├── helper
    ├── middleware
    └── seed
```

## Endpoints

### Admin Users

- `POST /admin/login`: Login as an admin.
- `POST /admin/create-admin-user`: Create a new admin user.
- `PUT /admin/update-admin-user/:id`: Update admin user details by ID.
- `GET /admin/all-admin-users`: Get all admin users.
- `GET /admin/single-admin-user`: Get a single admin user.
- `GET /admin/all-admin-users-with-pagination`: Get all admin users with pagination.
- `DELETE /admin/delete-admin-user/:id`: Delete an admin user by ID.

### Categories

- `POST /categories/create-category`: Create a new category.
- `PUT /categories/update-category/:id`: Update a category by ID.
- `GET /categories/all-items`: Get all categories.
- `GET /categories/single-category/:id`: Get category details by ID.
- `GET /categories/all-items-with-pagination`: Get all categories with pagination.
- `DELETE /categories/delete-category/:id`: Delete a category by ID.

### Orders

- `POST /orders/create-order`: Create a new order.
- `PUT /orders/update-order-stauts/:id`: Update order status by ID.
- `GET /orders/all-items`: Get all orders.
- `GET /orders/single-item/:id`: Get order details by ID.
- `GET /orders/all-items-with-pagination`: Get all orders with pagination.
- `DELETE /orders/delete-order/:id`: Delete an order by ID.

### Products

- `POST /products/create-product`: Create a new product.
- `PUT /products/update-product/:id`: Update product details by ID.
- `GET /products/all-items`: Get all products.
- `GET /products/single-product/:id`: Get product details by ID.
- `GET /products/all-items-with-pagination`: Get all products with pagination.
- `DELETE /products/delete-product/:id`: Delete a product by ID.

### Providers

- `POST /providers/login`: Login as a provider.
- `POST /providers/create-provider`: Create a new provider.
- `PUT /providers/update-provider`: Update provider details.
- `POST /providers/add-story`: Add a story for a provider.
- `GET /providers/all-items`: Get all providers.
- `GET /providers/single-item`: Get provider details.
- `GET /providers/all-items-with-pagination`: Get all providers with pagination.
- `DELETE /providers/delete-provider/:id`: Delete a provider by ID.

### Users

- `POST /users/login`: Login as a user.
- `POST /users/create-user`: Create a new user.
- `PUT /users/update-user`: Update user details.
- `POST /users/add-story`: Add a story for a user.
- `GET /users/all-users`: Get all users.
- `GET /users/single-user`: Get user details.
- `GET /users/all-users-with-pagination`: Get all users with pagination.
- `DELETE /users/delete-user/:id`: Delete a user by ID.

## API Documentation

- Postman Collection URL: https://documenter.getpostman.com/view/23899137/2sAYJAeHfV
