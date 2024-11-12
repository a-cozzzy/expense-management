# Pennywise - Expense Management Platform

Welcome to **Pennywise**, your comprehensive expense management tool designed for seamless financial tracking and budget management.

## Live Demo
Check out the live version of the app: [Pennywise](https://pennywise-theta.vercel.app/)

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Security](#security)
- [License](#license)

## Project Overview
**Pennywise** is an expense management platform that helps users track their spending, set budgets, and gain insights into their financial health. The platform offers an interactive dashboard that provides an overview of expenses and budgets through intuitive charts. Users can efficiently manage their expenses under different budget categories and stay on top of their finances.

## Features
- **Dashboard Overview**: View all key financial metrics at a glance, with charts for better visualization.
- **Budget Management**: Set up and manage multiple budgets and track expenses under each budget.
- **Expense Tracking**: Easily log and categorize expenses to keep an accurate record of spending.
- **User Authentication**: Secure sign-up and sign-in with Clerk integration for seamless access control.
- **Data Security**: Built with security best practices to ensure that user data is protected.

## Tech Stack
- **[Next.js](https://nextjs.org/)**: A React framework for building fast and scalable web applications.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for building custom designs without leaving your HTML.
- **[ShadCN](https://shadcn.dev/)**: A component library to enhance the design system with prebuilt components.

### Database
- **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source object-relational database for data storage.

### Authentication
- **[Clerk](https://clerk.dev/)**: Provides complete user management and authentication solutions.

## Setup and Installation
Follow these steps to set up **Pennywise** on your local machine:

1. **Clone the repository**:
   ```git clone https://github.com/your-username/pennywise.git```
   
   ```cd pennywise```

3. **Install dependencies**:
   Use npm to install the required dependencies.  
   ```npm install```

4. **Configure environment variables**:
   Create a `.env.local` file and add your configurations for PostgreSQL database and Clerk authentication services.

5. **Run database migrations** (if applicable):
   Ensure the database schema is up-to-date.  
   npm run migrate

6. **Run the development server**:
   Start the application in development mode.  
   ```npm run dev``` 
   Visit `http://localhost:3000` to view the app in your browser.

## Security
**Pennywise** prioritizes the safety and security of user data. Key measures include:
- **Authentication and Access Control**: Powered by Clerk to manage secure user sign-ups and logins.
- **Data Encryption**: Sensitive data is stored securely with encryption standards.
- **Best Practices**: Adopts industry standards for secure coding and data protection to safeguard user information.

## License
This project is licensed under the **MIT License**, allowing you to use, modify, and distribute the software with attribution to the authors.

