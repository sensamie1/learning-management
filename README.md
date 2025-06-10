# Learning Path Management API

This is a versioned RESTful API built with **Node.js**, **Express**, and **MongoDB** to manage users' learning paths, modules, and track their progress.

## Features

- User registration and authentication (with role-based access control)
- Admins can create learning paths and modules
- Users can view learning paths/modules
- Users can track their progress through modules
- JWT-based authentication
- Input validation using Joi
- Request logging using Winston
- API versioning

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Joi for validation
- Winston for logging
- JWT for auth
- dotenv for environment management

---

## Project Structure

```
.
├── db/
├── learning-paths/
├── logger/
├── middlewares/
├── models/
├── models/
├── modules/
├── progress/
├── users/
├── api.js
├── server.js
└── README.md
```

---

## Setup Instructions

1. **Clone the repo:**

```bash
git clone https://github.com/sensamie1/learning-management.git
cd learning-path-management-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file:**

```
PORT=4001
MONGO_URI=mongodb://localhost:27017/learning-management
JWT_SECRET=your_jwt_secret
```

4. **Run server:**

```bash
npm run dev
```

---

## Auth Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/api/v1/users/signup`| Create a new user     |
| POST   | `/api/v1/users/login` | Login and get a token |

---

## User Logic

- If email contains `gemamethystngltd`, the user is auto-assigned as `admin`.
- All others default to `user`.

---

## Learning Path Endpoints (Admin Only)

| Method | Endpoint                                         | Description               |
|--------|--------------------------------------------------|---------------------------|
| POST   | `/api/v1/users/admin/learning-paths/create`      | Create a new path         |


---

## 📦 Module Endpoints (Admin Only)

| Method | Endpoint                                     | Description               |
|--------|----------------------------------------------|---------------------------|
| POST   | `/api/v1/users/admin/modules/create`         | Create a new module       |


---

## Progress Endpoints (User)

| Method | Endpoint                                             | Description                        |
|--------|------------------------------------------------------|------------------------------------|
| POST   | `/api/v1/users/progress/add-module`                  | Add module to user progress        |
| PATCH  | `/api/v1/users/progress/modules/mark-completed`      | Mark module as completed           |
| GET    | `/api/v1/users/learning-paths`                       | Get all learning paths             |
| GET    | `/api/v1/users/learning-paths/:id`                   | Get a specific path by ID          |
| GET    | `/api/v1/users/modules`                              | Get all modules                    |
| GET    | `/api/v1/users/modules/:id`                          | Get a specific module by ID        |
| GET    | `/api/v1/users/progress/modules`                     | Get all modules in user progress   |
| DELETE | `/api/v1/users/progress/remove-module`               | Remove module from user progress   |

---

## Validations

All inputs are validated using Joi before reaching controllers.

Example:

```js
const schema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
});
```

---

## Middleware

- **bearerTokenAuth**: Verifies JWT and extracts user from it
- **isAdmin**: Ensures only admins can access certain routes

---

## Postman Documentation

[Click here to view collection](#) *(https://documenter.getpostman.com/view/29044088/2sB2x3oZSR#96f5b94f-cf0a-44f8-aa89-41570d05ec48)*

---

## MongoDB Models

- **User**
- **LearningPath**
- **Module**
- **Progress**

Progress tracks each module’s status:

```js
modules: [
  {
    module_id: ObjectId,
    isCompleted: Boolean,
    completedAt: Date
  }
]
```

---

## License

This project is licensed under the MIT License.

---

## Contributions

Feel free to fork, clone, and submit pull requests. Let's build this better together.