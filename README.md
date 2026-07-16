# NGO Network Platform – Erasmus+ Collaboration Hub

## Overview

This is a **full-stack web platform** designed to help **non-governmental organizations (NGOs)** involved in **Erasmus+ programmes** connect, collaborate, and share opportunities.

The platform allows NGOs to create public profiles, publish Erasmus+ projects, and manage partnerships with other organizations. Partners can be represented by **countries**, **registered NGOs**, or **external organizations** that are not yet part of the platform.

One of the main challenges addressed by this project is maintaining connections between organizations. If an external partner later creates an account, existing projects that reference that organization are automatically updated and linked to the new profile.

The goal of this project was to create a practical collaboration platform that simplifies finding partners and managing international educational opportunities.

---

## Features

- **Public NGO profiles** with logo, description, contact information, domains, and social links  
- **Email-verified registration** with a pending account confirmation step  
- **Secure authentication** using JWT stored in HTTP-only cookies  
- **Create, edit, and delete Erasmus+ projects**  
- **Partner management** between countries, registered NGOs, and external organizations  
- **Project pages** containing location, timeline, deadline, objectives, domain, target audience, and InfoPack links  
- **Automatic partner linking** when previously referenced organizations create an account  
- **Image upload functionality** with cloud storage integration  
- **Password confirmation** before deleting projects or organization accounts  
- **Responsive user interface** built with React and Bootstrap  

---

## Tech Stack

| Layer | Technologies |
|-------------|--------------------------------|
| **Frontend** | React, TypeScript, React Router, Bootstrap 5, SCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, HTTP-only Cookies |
| **File Upload** | Multer, Cloudinary |
| **Email Verification** | Brevo API |

---

## Project Architecture

The application follows a **client-server architecture**:

| Component | Responsibility |
|-------------|--------------------------------|
| **Frontend** | Handles user interface, routing, forms, and communication with the backend API |
| **Backend** | Provides REST API endpoints, authentication logic, and business rules |
| **Database** | Stores organizations, projects, and related application data |

---

## Planned Features

- Push notifications for project deadlines and partner invitations  
- AI-powered suggestions for finding suitable project partners  
- Multilingual interface (EN, FR, RO...)  
- Advanced filtering and search capabilities  
- NGO feedback and rating system  
- Analytics dashboard for organizations  

---

## Motivation

This project was developed combining my interests in **web development**, **international collaboration**, and building software solutions that address real-world needs.
