# Sales Management System

## 1. Project Overview

The Sales Management System is a web-based application developed to help small and medium-sized businesses manage their daily sales and inventory activities efficiently.

The system provides a centralized platform for managing products, categories, customers, suppliers, sales, purchases, inventory, invoices, reports, and dashboard information.

The main purpose of the system is to reduce manual record keeping and provide an organized way to manage business transactions and stock information.

The system is developed as an academic project using HTML, CSS, JavaScript, PHP, and MySQL.

---

## 2. Problem Statement

Many small and medium-sized businesses manage their sales, purchases, products, and inventory using notebooks, paper records, or spreadsheets.

Manual record keeping can make it difficult to maintain accurate information about available stock, sales transactions, purchases, customers, and suppliers.

It can also take more time to search for records and prepare reports.

The Sales Management System provides a computerized solution for managing these activities in one centralized system.

---

## 3. Project Objectives

The main objectives of the Sales Management System are:

- To manage products efficiently.
- To manage product categories.
- To manage customer information.
- To manage supplier information.
- To record sales transactions.
- To record purchase transactions.
- To maintain inventory information.
- To generate invoice information.
- To generate sales, purchase, and inventory reports.
- To provide dashboard information.
- To reduce manual record keeping.
- To improve the efficiency of business operations.

---

## 4. Main Features

### 4.1 User Authentication

The system provides a login mechanism for authorized users.

Users can log in using their username and password.

The system supports different user roles such as:

- Admin
- Sales Staff
- Store Manager


---

### 4.2 Product Management

The Product Management module allows users to:

- Add products.
- Select product categories.
- Enter product prices.
- Enter product quantities.
- View product records.
- Search products.
- Delete products.

---

### 4.3 Category Management

The Category Management module allows users to:

- Add categories.
- View categories.
- Search categories.
- Delete categories.
- Prevent duplicate category names.

---

### 4.4 Customer Management

The Customer Management module allows users to manage:

- Customer name.
- Phone number.
- Email address.
- Customer address.

Users can also search and delete customer records.

---

### 4.5 Supplier Management

The Supplier Management module allows users to manage:

- Supplier name.
- Phone number.
- Email address.
- Supplier address.

Users can search and delete supplier records.

---

### 4.6 Sales Management

The Sales Management module allows users to:

- Select customers.
- Select products.
- Enter sales quantity.
- Display product price.
- Calculate the total amount.
- Record sales transactions.
- Search sales records.
- Delete sales records.

When a sale is recorded, the product stock quantity is reduced.

---

### 4.7 Purchase Management

The Purchase Management module allows users to:

- Select suppliers.
- Select products.
- Enter purchase quantity.
- Select purchase date.
- Record purchase transactions.
- Search purchase records.
- Delete purchase records.

When a purchase is recorded, the product stock quantity is increased.

---

### 4.8 Inventory Management

The Inventory Management module displays product stock information.

It provides information such as:

- Product ID.
- Product name.
- Category.
- Available quantity.
- Stock level.
- Stock status.

The system identifies products with low stock quantities.

Products with a quantity of 5 or below are displayed as low-stock items.

Products with quantity 0 are displayed as out of stock.

---

### 4.9 Invoice Management

The Invoice Management module provides invoice information related to sales transactions.

Invoice information can include:

- Invoice ID.
- Sale ID.
- Product details.
- Quantity.
- Price.
- Total amount.
- Invoice date.

---

### 4.10 Reports

The Reports module provides reports related to:

- Sales.
- Purchases.
- Inventory.

Users can generate reports using different periods such as:

- Daily.
- Weekly.
- Monthly.
- Custom period.

The system also provides a print option for reports.

---

### 4.11 Dashboard

The Dashboard provides a summary of important system information.

The dashboard displays:

- Total Products.
- Total Customers.
- Total Sales.
- Low Stock.
- Recent Sales.

This allows users to view important information from one place.

---

## 5. User Roles

The system supports the following user roles:

### Admin

The Admin role is intended for managing the overall system and its main modules.

### Sales Staff

The Sales Staff role is intended for handling sales-related activities and customer transactions.

### Store Manager

The Store Manager role is intended for managing products, suppliers, purchases, and inventory-related activities.

### Business Owner

The Business Owner role is intended for viewing business information, dashboard information, sales information, and reports.

---

## 6. Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- PHP

### Database

- MySQL

### Development Environment

- XAMPP

### Database Management

- phpMyAdmin

### API Testing

- Postman

### Code Editor

- Visual Studio Code

### Version Control

- Git

### Repository

- GitHub

---

## 7. Database

The system uses a MySQL database named:

```text
sales_management
```

The database contains the following main tables:

- users
- categories
- products
- customers
- suppliers
- sales
- purchases
- inventory
- invoices

The database is used to store and manage the information required by the Sales Management System.

---

## 8. Project Structure

```text
SMS final project
│
├── frontend
│   ├── css
│   ├── js
│   └── pages
│
├── backend
│   ├── auth
│   ├── products
│   ├── categories
│   ├── customers
│   ├── suppliers
│   ├── sales
│   ├── purchases
│   ├── inventory
│   ├── invoices
│   ├── reports
│   └── dashboard
│
├── database
│
├── documentation
│
├── tests
│
└── README.md
```

---

## 9. System Workflow

The general workflow of the system is:

```text
User Login
    ↓
Dashboard
    ↓
Products / Categories
    ↓
Customers / Suppliers
    ↓
Purchases
    ↓
Inventory
    ↓
Sales
    ↓
Invoices
    ↓
Reports
```

When products are purchased, the available stock quantity is increased.

When products are sold, the available stock quantity is decreased.

The system maintains inventory information based on these transactions.

---

## 10. Installation and Setup

### Step 1 - Install XAMPP

Install XAMPP on the computer.

Make sure Apache and MySQL are available.

---

### Step 2 - Start XAMPP

Open XAMPP Control Panel.

Start:

```text
Apache
MySQL
```

---

### Step 3 - Copy the Project

Copy the project folder into:

```text
C:\xampp\htdocs\
```

The project path should be:

```text
C:\xampp\htdocs\SMS final project
```

---

### Step 4 - Create the Database

Open phpMyAdmin:

```text
http://localhost/phpmyadmin
```

Create a database named:

```text
sales_management
```

Import the SQL file available in the `database` folder.

---

### Step 5 - Configure Database Connection

The database connection is configured in:

```text
backend/config/db.php
```

The local XAMPP configuration uses:

```text
Host: localhost
Username: root
Password: empty
Database: sales_management
```

---

### Step 6 - Open the Application

Open the login page using:

```text
http://localhost/SMS%20final%20project/frontend/pages/login.html
```

The application should be accessed through the XAMPP Apache server.

---

## 11. Login Accounts

The following accounts are available for testing.

### Admin

```text
Username: admin
Password: admin123
Role: admin
```

### Sales Staff

```text
Username: salesstaff
Password: sales123
Role: sales_staff
```

### Store Manager

```text
Username: storemanager
Password: manager123
Role: store_manager
```

---

## 12. Testing

The system was tested for the following areas:

- User login.
- Login validation.
- Product management.
- Category management.
- Customer management.
- Supplier management.
- Sales management.
- Purchase management.
- Inventory management.
- Invoice management.
- Reports.
- Dashboard.
- Search functionality.
- Form validation.
- Delete confirmation.
- Stock quantity updates.
- Low stock identification.

Detailed test cases are available in:

```text
tests/test-cases.md
```

---

## 13. Validation

The system includes validation for important input fields.

Examples include:

- Required fields.
- Product quantity.
- Product price.
- Sales quantity.
- Purchase quantity.
- Customer name.
- Supplier name.
- Category name.
- Username and password.

The system also checks stock availability before recording a sale.

---

## 14. Inventory Rules

The inventory module uses the following stock status rules:

```text
Quantity = 0
→ Out of Stock

Quantity = 1 to 5
→ Low Stock

Quantity > 5
→ In Stock
```

When a purchase is completed:

```text
Available Stock = Available Stock + Purchase Quantity
```

When a sale is completed:

```text
Available Stock = Available Stock - Sales Quantity
```

---

## 15. Reports

The Reports module provides information based on the selected report type and period.

Available report types include:

```text
Sales
Purchases
Inventory
```

Available report periods include:

```text
Daily
Weekly
Monthly
Custom Period
```

The custom period allows users to select:

```text
Start Date
End Date
```

Reports can also be printed using the print option.

---

## 16. Dashboard Information

The dashboard provides a summary of the current system data.

The following information is displayed:

```text
Total Products
Total Customers
Total Sales
Low Stock
Recent Sales
```

The dashboard retrieves the information from the backend and database.

---

## 17. Security

The login system uses password hashing for user passwords.

User login information is managed using PHP sessions.

Database queries use prepared statements for important database operations.

Sensitive configuration information should not be committed to the public repository.

---

## 18. Git and GitHub

Git is used for version control of the project.

GitHub is used to store and manage the project repository.

Main Git commands used in the project include:

```bash
git init
git add .
git commit
git branch -M main
git remote add origin
git push
```

---

## 19. Project Status

The Sales Management System has been developed as an academic project.

The project includes modules for:

- Authentication.
- Products.
- Categories.
- Customers.
- Suppliers.
- Sales.
- Purchases.
- Inventory.
- Invoices.
- Reports.
- Dashboard.

The system has been tested using sample data and local XAMPP environment.

---

## 20. Conclusion

The Sales Management System provides a centralized web-based solution for managing sales and inventory-related activities.

The system helps organize product, customer, supplier, sales, purchase, inventory, invoice, and report information.

The project demonstrates the use of frontend technologies, backend development, database management, authentication, CRUD operations, inventory handling, reporting, testing, and version control.

---

## 21. Developer

**Project:** Sales Management System

**Technology:** HTML, CSS, JavaScript, PHP, MySQL

**Development Environment:** XAMPP

**Repository:** GitHub


postman test URL

1. Product & Category Management

Module	Method	Postman URL
Get Products	GET	http://localhost/SMS%20final%20project/backend/products/get.php
Add Product	POST	http://localhost/SMS%20final%20project/backend/products/add.php
Update Product	POST	http://localhost/SMS%20final%20project/backend/products/update.php
Delete Product	POST	http://localhost/SMS%20final%20project/backend/products/delete.php
Get Categories	GET	http://localhost/SMS%20final%20project/backend/categories/get.php
Add Category	POST	http://localhost/SMS%20final%20project/backend/categories/add.php


2. Customer & Supplier Management

Module	Method	Postman URL
Get Customers	GET	http://localhost/SMS%20final%20project/backend/customers/get.php
Add Customer	POST	http://localhost/SMS%20final%20project/backend/customers/add.php
Update Customer	POST	http://localhost/SMS%20final%20project/backend/customers/update.php
Delete Customer	POST	http://localhost/SMS%20final%20project/backend/customers/delete.php
Get Suppliers	GET	http://localhost/SMS%20final%20project/backend/suppliers/get.php
Add Supplier	POST	http://localhost/SMS%20final%20project/backend/suppliers/add.php
Update Supplier	POST	http://localhost/SMS%20final%20project/backend/suppliers/update.php
Delete Supplier	POST	http://localhost/SMS%20final%20project/backend/suppliers/delete.php


3. Sales & Purchase Management

Module	Method	Postman URL
Get Sales	GET	http://localhost/SMS%20final%20project/backend/sales/get.php
Add Sale	POST	http://localhost/SMS%20final%20project/backend/sales/add.php
Get Purchases	GET	http://localhost/SMS%20final%20project/backend/purchases/get.php
Add Purchase	POST	http://localhost/SMS%20final%20project/backend/purchases/add.php


4. Inventory Management

Module	Method	Postman URL
Get Inventory	GET	http://localhost/SMS%20final%20project/backend/inventory/get.php
Stock In	POST	http://localhost/SMS%20final%20project/backend/inventory/stock_in.php
Stock Out	POST	http://localhost/SMS%20final%20project/backend/inventory/stock_out.php


5. Invoice, Reports & Dashboard

Module	Method	Postman URL
Get Invoices	GET	http://localhost/SMS%20final%20project/backend/invoices/get.php
Get Invoice Details	GET	http://localhost/SMS%20final%20project/backend/invoices/details.php
Dashboard Data	GET	http://localhost/SMS%20final%20project/backend/dashboard/get.php
Reports	GET	http://localhost/SMS%20final%20project/backend/reports/get.php