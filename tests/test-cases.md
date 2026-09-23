# Sales Management System - Test Cases

## 1. Login Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-001 | Login with valid admin credentials | admin / admin123 | Login successful and dashboard opens | Pass |
| TC-002 | Login with invalid password | admin / wrong password | Invalid username or password message displayed | Pass |
| TC-003 | Login with empty username | Empty username | Username and password are required | Pass |
| TC-004 | Login with empty password | Empty password | Username and password are required | Pass |

---

## 2. Category Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-005 | Add new category | Stationery | Category added successfully | Pass |
| TC-006 | Add duplicate category | Stationery | Duplicate category error displayed | Pass |
| TC-007 | Submit empty category | Empty | Required field validation displayed | Pass |
| TC-008 | Delete category | Existing category | Confirmation message displayed and category deleted | Pass |
| TC-009 | Cancel category deletion | Existing category | Category remains in the list | Pass |

---

## 3. Product Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-010 | Add product | Blue Pen, Stationery, 100, 20 | Product added successfully | Pass |
| TC-011 | Search product | Blue Pen | Matching product displayed | Pass |
| TC-012 | Delete product and cancel | Existing product | Product remains in list | Pass |
| TC-013 | Delete product and confirm | Existing product | Product deleted successfully | Pass |
| TC-014 | Enter negative price | -100 | Price and quantity cannot be negative | Pass |
| TC-015 | Submit without required fields | Empty | Required field validation displayed | Pass |

---

## 4. Customer Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-016 | Add customer | Kamal | Customer added successfully | Pass |
| TC-017 | Search customer | Kamal | Matching customer displayed | Pass |
| TC-018 | Delete customer and cancel | Existing customer | Customer remains in list | Pass |
| TC-019 | Delete customer and confirm | Existing customer | Customer deleted successfully | Pass |
| TC-020 | Submit empty customer name | Empty | Customer name is required | Pass |

---

## 5. Supplier Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-021 | Add supplier | ABC Suppliers | Supplier added successfully | Pass |
| TC-022 | Search supplier | ABC Suppliers | Matching supplier displayed | Pass |
| TC-023 | Delete supplier and cancel | Existing supplier | Supplier remains in list | Pass |
| TC-024 | Delete supplier and confirm | Existing supplier | Supplier deleted successfully | Pass |
| TC-025 | Submit empty supplier name | Empty | Supplier name is required | Pass |

---

## 6. Sales Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-026 | Select customer | Existing customer | Customer selected successfully | Pass |
| TC-027 | Select product | Existing product | Product price displayed | Pass |
| TC-028 | Enter sales quantity | 10 | Total amount calculated | Pass |
| TC-029 | Record valid sale | Valid customer, product and quantity | Sale recorded successfully | Pass |
| TC-030 | Sell quantity greater than stock | Quantity greater than available stock | Sale rejected due to insufficient stock | Pass |
| TC-031 | Search sales record | Customer/Product | Matching sales displayed | Pass |
| TC-032 | Delete sale and cancel | Existing sale | Sale remains in list | Pass |
| TC-033 | Delete sale and confirm | Existing sale | Sale deleted successfully | Pass |

---

## 7. Purchase Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-034 | Select supplier | Existing supplier | Supplier selected successfully | Pass |
| TC-035 | Select product | Existing product | Product selected successfully | Pass |
| TC-036 | Enter purchase quantity | 20 | Quantity accepted | Pass |
| TC-037 | Select purchase date | Valid date | Date selected successfully | Pass |
| TC-038 | Record purchase | Valid supplier, product and quantity | Purchase recorded successfully | Pass |
| TC-039 | Search purchase | Product/Supplier | Matching purchase displayed | Pass |
| TC-040 | Delete purchase and cancel | Existing purchase | Purchase remains in list | Pass |
| TC-041 | Delete purchase and confirm | Existing purchase | Purchase deleted successfully | Pass |

---

## 8. Inventory Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-042 | View inventory | Existing products | Inventory records displayed | Pass |
| TC-043 | Search inventory | Product name | Matching inventory displayed | Pass |
| TC-044 | Check stock after purchase | Purchase quantity added | Available stock increases | Pass |
| TC-045 | Check stock after sale | Sale quantity | Available stock decreases | Pass |
| TC-046 | Check out of stock | Quantity = 0 | Status displayed as Out of Stock | Pass |
| TC-047 | Check low stock | Quantity 1-5 | Status displayed as Low Stock | Pass |

---

## 9. Invoice Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-048 | Create invoice through sale | Valid sale | Invoice record created | Pass |
| TC-049 | View invoice | Existing invoice | Invoice details displayed | Pass |
| TC-050 | Check invoice amount | Valid sale total | Invoice total matches sale total | Pass |

---

## 10. Reports Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-051 | Generate sales report | Sales / Daily | Sales report displayed | Pass |
| TC-052 | Generate purchase report | Purchases / Weekly | Purchase report displayed | Pass |
| TC-053 | Generate inventory report | Inventory / Monthly | Inventory report displayed | Pass |
| TC-054 | Generate custom report | Start date + End date | Report generated for selected period | Pass |
| TC-055 | Check date calendar | Start/End Date | Calendar picker displayed | Pass |
| TC-056 | Print report | Generated report | Print dialog opens | Pass |

---

## 11. Dashboard Testing

| Test ID | Test Case | Test Data | Expected Result | Status |
|---|---|---|---|---|
| TC-057 | Load dashboard | Dashboard page | Dashboard loads successfully | Pass |
| TC-058 | Check total products | Database product records | Total product count displayed | Pass |
| TC-059 | Check total customers | Database customer records | Total customer count displayed | Pass |
| TC-060 | Check total sales | Database sales records | Total sales count displayed | Pass |
| TC-061 | Check low stock | Inventory data | Low stock count displayed | Pass |
| TC-062 | Check recent sales | Existing sales | Recent sales displayed | Pass |

---

## 12. Validation Testing

| Test ID | Test Case | Expected Result | Status |
|---|---|---|---|
| TC-063 | Submit required field as empty | Browser/server validation displayed | Pass |
| TC-064 | Enter negative product price | Negative value rejected | Pass |
| TC-065 | Enter invalid sales quantity | Invalid quantity rejected | Pass |
| TC-066 | Enter invalid purchase quantity | Invalid quantity rejected | Pass |
| TC-067 | Enter duplicate category | Duplicate value rejected | Pass |

---

## 13. Search Testing

| Test ID | Test Case | Expected Result | Status |
|---|---|---|---|
| TC-068 | Search product by name | Matching products displayed | Pass |
| TC-069 | Search customer | Matching customers displayed | Pass |
| TC-070 | Search supplier | Matching suppliers displayed | Pass |
| TC-071 | Search sales | Matching sales displayed | Pass |
| TC-072 | Search purchases | Matching purchases displayed | Pass |
| TC-073 | Search inventory | Matching inventory displayed | Pass |

---

## 14. Overall Testing Result

The Sales Management System was tested for its main modules and functions.

The tested areas include:

- Login
- Categories
- Products
- Customers
- Suppliers
- Sales
- Purchases
- Inventory
- Invoices
- Reports
- Dashboard
- Search
- Form validation
- Delete confirmation
- Stock updates

The tested functions produced the expected results during testing.