# 🌍 NGO Network Platform – Erasmus+ Projects

## 📌 Overview

This is a full-stack web platform built to support **non-governmental organizations (NGOs)** participating in European programmes, particularly **Erasmus+**. The goal is to facilitate collaboration, promote educational initiatives, and share opportunities in a centralized, accessible, and modern digital environment.

NGOs can create public profiles, publish Erasmus+ projects, and list partners—whether they are **countries**, other **registered NGOs**, or **external organizations** identified via Instagram. When an external partner later creates an account, all projects that reference their handle will automatically link to their new profile.

---

## ✨ Features

- **Public NGO profiles** with logo, description, contact info, domains and social links  
- **Email-verified registration** with a pending approval step  
- **Secure authentication** using JWT (stored in HTTP-only cookies)  
- **Create, edit, and delete Erasmus+ projects**  
- **Partners** can be countries, registered NGOs, or unregistered Instagram-based organizations  
- **Upload cover images** and link to InfoPacks  
- **Project metadata** includes location, period, deadline, domain, and target audience  
- **Automatic partner linking** for future registered NGOs based on Instagram handles  
- **Password-confirmed deletion** of projects or organisation account  
- **Fully responsive UI** built with React and Bootstrap

---

## 🛠 Tech Stack

| Layer       | Technologies                         |
|-------------|--------------------------------------|
| Frontend    | React, TypeScript, Bootstrap 5       |
| Backend     | Node.js, Express.js                  |
| Database    | MongoDB + Mongoose                   |
| Auth        | JWT + HTTP-only cookies              |
| File Upload | Multer + Cloudinary (or local)       |
| Email       | Nodemailer or Brevo API              |

---

## 🔮 Planned Features

- Push notifications for deadlines or partner invites  
- AI-powered suggestions for new project partners  
- Multilingual interface (EN, FR, RO...)  
- Advanced filtering and search  
- NGO feedback/rating system  
- Analytics dashboard for each NGO

---

