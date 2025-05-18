# SHOPPER - E-Commerce Platform for IIIT Community

A full-stack e-commerce platform built specifically for the IIIT community that enables users to buy and sell products within the campus network.

## Features

- **User Authentication**
  - Email-based registration (restricted to IIIT domain)
  - Secure login with reCAPTCHA verification
  - JWT-based authentication
  - Password hashing for security

- **Product Management**
  - Upload products with details (name, price, category, description)
  - Browse available products
  - Filter products by category
  - Search products by name

- **Shopping Features**
  - Add products to cart
  - View product details
  - Secure checkout process
  - OTP-based delivery verification

- **Order Management**
  - View order history (bought/sold items)
  - Track pending deliveries
  - Verify deliveries using OTP

- **User Profile**
  - View and edit personal details
  - Manage product listings
  - Track order history

- **Support System**
  - AI-powered chat support
  - Persistent chat history
  - Quick responses for common queries

## Tech Stack

### Frontend
- React + Vite
- React Router for navigation
- Axios for API requests
- React-Toastify for notifications
- CSS for styling

### Backend
- Node.js + Express
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing
- Google reCAPTCHA integration
- Gemini AI for chat support

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]