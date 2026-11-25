# ShopEase – Full Stack E-Commerce Website

ShopEase is a complete, modern, responsive full-stack e-commerce web application engineered from scratch. It features a high-performance React + Vite frontend and an enterprise-grade Java Spring Boot 3 REST API backend backed by MySQL with Spring Security and JWT role-based access control.

---

## 1. Project Description

ShopEase provides an end-to-end e-commerce experience:
- Customers can seamlessly explore categories, search and filter products by price and ratings, inspect product details, manage their dynamic shopping cart, and place orders via Cash on Delivery (COD).
- Registered users can view their real-time order history, tracking statuses from `PLACED` to `DELIVERED`, with self-cancellation capabilities for open orders.
- Store administrators have access to an administrative dashboard with live store metrics (Total Revenue, Orders, Products, Users), catalogue inventory management (Add/Edit/Delete products), and fulfillment controls to update order states.

---

## 2. Features

### Customer Experience
- **Dynamic Hero & Featured Showcase**: Modern gradient aesthetics, promotional badges, trust stats, and top-rated handpicked products.
- **Product Discovery & Filtering**: Real-time keyword search, category pills, price range filters, and instant sorting (Low to High, High to Low, Rating, Newest).
- **Product Details**: High-resolution image zoom previews, discount percentage calculators, inventory stock counters, quantity increment/decrement, "Add to Cart", and instant "Buy Now" checkout.
- **Dynamic Shopping Cart**: Real-time quantity adjustments, subtotal calculations, free shipping progress bar, persistent cart state across refreshes, and clear cart options.
- **Doorstep Checkout**: Customer and delivery address capture, Cash on Delivery (COD) default payment with extensible architecture for online payment gateways, and instant Order ID confirmation.
- **Order Tracking ("My Orders")**: Visual order cards with status badges (`PLACED`, `CONFIRMED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`) and cancellation action.
- **User Profile**: Account verification details, security roles, and order activity shortcuts.

### Administrator Experience
- **Analytics Dashboard**: Live calculation of Total Platform Revenue, Total Orders, Total Active Products, and Registered Users.
- **Inventory & Catalogue Control**: Add new products with categories, prices, discounts, stock levels, image URLs, and homepage feature flags. Edit or delete existing items.
- **Fulfillment Operations**: View all platform orders with status filtering and inline status update dropdowns (`PLACED` &rarr; `CONFIRMED` &rarr; `SHIPPED` &rarr; `OUT_FOR_DELIVERY` &rarr; `DELIVERED`).

---

## 3. Technologies

### Frontend
- **React.js 19** & **Vite**
- **JavaScript (ES6+)**, **HTML5**, **CSS3**
- **React Router 7** (Client-side routing & Protected Routes)
- **Axios** (Centralized HTTP client with JWT interceptors)
- **Lucide React** (Clean modern UI icons)
- **Context API** (AuthContext, CartContext, ToastContext)

### Backend
- **Java 21 / 26**
- **Spring Boot 3.3.4**
- **Spring Web** (RESTful APIs)
- **Spring Data JPA** & **Hibernate**
- **Spring Security 6** (BCrypt password hashing & Stateless session management)
- **JJWT 0.12.6** (JSON Web Token generation and validation)
- **Jakarta Bean Validation** (`@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Email`)
- **Apache Maven 3.9.9**

### Database
- **MySQL 8.0+ / 8.4**
- Relational schema with foreign keys and cascade options (`users`, `categories`, `products`, `cart`, `cart_items`, `orders`, `order_items`).

---

## 4. Folder Structure

```
e-commerce website/
│
├── frontend/                     # React + Vite Client
│   ├── public/
│   ├── src/
│   │   ├── api/                  # axiosConfig.js
│   │   ├── components/           # Reusable UI components
│   │   │   ├── admin/            # AdminNav
│   │   │   ├── cart/             # CartItem
│   │   │   ├── category/         # CategoryCard
│   │   │   ├── common/           # Navbar, Footer, Button, Loading, ErrorMessage, ProtectedRoute, SearchBar
│   │   │   └── product/          # ProductCard, ProductGrid
│   │   ├── context/              # AuthContext, CartContext, ToastContext
│   │   ├── data/                 # sampleData.js (development dataset & fallback)
│   │   ├── pages/                # All 17 pages (Home, Products, Details, Cart, Checkout, Admin, etc.)
│   │   │   ├── admin/            # AdminDashboard, AdminProducts, AdminAddProduct, AdminEditProduct, AdminOrders
│   │   │   ├── Cart.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── services/             # authService, productService, orderService, adminService, categoryService
│   │   ├── App.jsx               # Routes definition
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Design system styling & responsive utilities
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Boot 3 Java Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shopease/
│   │   │   │   ├── config/       # SecurityConfig, CorsConfig, DataInitializer
│   │   │   │   ├── controller/   # AuthController, ProductController, CategoryController, CartController, OrderController, AdminController
│   │   │   │   ├── dto/          # Request & Response DTOs
│   │   │   │   ├── entity/       # User, Role, Category, Product, Cart, CartItem, Order, OrderItem, OrderStatus
│   │   │   │   ├── exception/    # Custom exceptions & GlobalExceptionHandler
│   │   │   │   ├── repository/   # Spring Data JPA Repositories
│   │   │   │   ├── security/     # JwtUtils, JwtAuthenticationFilter, UserDetailsServiceImpl, UserPrincipal
│   │   │   │   ├── service/      # Service interfaces & implementations
│   │   │   │   └── ShopEaseApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql    # DDL schema script
│   │   └── test/                 # Test suites with H2 fallback
│   └── pom.xml
│
├── postman/
│   └── ShopEase_API.postman_collection.json
└── README.md
```

---

## 5. MySQL Database Setup

1. Make sure your MySQL service is running (e.g. MySQL 8.0 or 8.4 on port `3306`).
2. Log in to MySQL and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS shopease;
   ```
3. *(Optional)* Run `backend/src/main/resources/schema.sql` to execute the schema manually, or allow Spring Boot JPA Hibernate (`ddl-auto=update`) to automatically create and update the tables upon first run.

---

## 6. Backend Configuration & Setup

Open `backend/src/main/resources/application.properties` and provide your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopease?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Alternatively, you can set environment variables before running:
- `DB_USERNAME`: Your MySQL username (e.g. `root`)
- `DB_PASSWORD`: Your MySQL password

### Run Backend
From the root directory:
```bash
cd backend
mvn spring-boot:run
```
*(Or if you prefer Maven on your path: `mvn spring-boot:run`)*

The Spring Boot backend will start on: **`http://localhost:8080`**

Upon boot, the built-in `DataInitializer` automatically seeds:
- Administrator account: `admin@shopease.com` / `Admin@123`
- Demo customer account: `user@shopease.com` / `User@123`
- Default product categories (Electronics, Fashion, Shoes, Beauty, Home, Accessories)
- 12 initial products with prices, images, stock, and descriptions.

---

## 7. Frontend Setup & Run

From the root directory:
```bash
cd frontend
npm install
npm run dev
```

The React Vite application will start on: **`http://localhost:5173`**

Open `http://localhost:5173` in your browser to start shopping!

---

## 8. Default Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@shopease.com` | `Admin@123` | Full administrative control, manage products, view dashboard stats, manage order statuses |
| **Customer** | `user@shopease.com` | `User@123` | Customer browsing, cart management, checkout, personal orders history |

> *Tip: The Login page features one-click "Demo Admin" and "Demo User" buttons for instant test access!*

---

## 9. REST API Endpoints Summary

### Authentication APIs (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | User / Admin |

### Products APIs (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Filter products (search, category, minPrice, maxPrice, sort, page) | Public |
| `GET` | `/api/products/{id}` | Get product details by ID | Public |
| `GET` | `/api/products/featured` | Get featured homepage products | Public |
| `POST` | `/api/products` | Create a new product | Admin |
| `PUT` | `/api/products/{id}` | Update product details | Admin |
| `DELETE` | `/api/products/{id}` | Delete product by ID | Admin |

### Categories APIs (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List all product categories | Public |
| `GET` | `/api/categories/{id}` | Get category by ID | Public |
| `POST` | `/api/categories` | Create new category | Admin |
| `PUT` | `/api/categories/{id}` | Update category | Admin |
| `DELETE` | `/api/categories/{id}` | Delete category | Admin |

### Cart APIs (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's cart | Authenticated |
| `POST` | `/api/cart` | Add product to cart | Authenticated |
| `PUT` | `/api/cart/{itemId}` | Update cart item quantity | Authenticated |
| `DELETE` | `/api/cart/{itemId}` | Remove item from cart | Authenticated |
| `DELETE` | `/api/cart` | Clear all items from cart | Authenticated |

### Order APIs (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place Cash on Delivery order | Authenticated |
| `GET` | `/api/orders` | Get current user's order history | Authenticated |
| `GET` | `/api/orders/{id}` | Get order details by ID | Authenticated |
| `PUT` | `/api/orders/{id}/cancel` | Cancel order (if status is `PLACED`) | Authenticated |

### Admin APIs (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/stats` | Platform totals: Revenue, Orders, Products, Users | Admin |
| `GET` | `/api/admin/orders` | List all platform orders (optional `?status=`) | Admin |
| `PUT` | `/api/admin/orders/{id}/status` | Update fulfillment status | Admin |
| `GET` | `/api/admin/products` | View all products catalogue | Admin |
| `POST` | `/api/admin/products` | Add new product | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product | Admin |
| `DELETE` | `/api/admin/products/{id}` | Delete product | Admin |

---

## 10. Postman Testing Guide

1. Open **Postman**.
2. Click **Import** and select the file: `postman/ShopEase_API.postman_collection.json`.
3. The collection is pre-configured with collection variables `baseUrl` (`http://localhost:8080/api`), `userToken`, and `adminToken`.
4. Run the **Login User** or **Login Admin** request:
   - The test script will automatically extract the JWT token from the response and set `userToken` / `adminToken` variables!
5. All protected endpoints (`/api/cart`, `/api/orders`, `/api/admin/**`) will automatically use the stored token.
