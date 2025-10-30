Perfect 👍 Let’s make a **professional README.md** for your **BookIt** MERN project — suitable for GitHub or your portfolio.

Here’s a complete version 👇

---

## 🏕️ **BookIt – Adventure Experience Booking Platform**

BookIt is a **MERN stack web application** that allows users to explore, view, and book exciting adventure experiences like **Paragliding, Scuba Diving, Skydiving**, and more. It provides a smooth and responsive booking flow with secure API integration and dynamic pricing.

---

### 🚀 **Live Demo**

🌐 **Frontend (Vercel):** [https://book-it-git-main-amanas96s-projects.vercel.app](https://book-it-git-main-amanas96s-projects.vercel.app)
⚙️ **Backend (Render):** [https://bookit-1-6577.onrender.com](https://bookit-1-6577.onrender.com)

---

### 🛠️ **Tech Stack**

**Frontend:**

* React.js (Vite)
* React Router DOM
* Axios
* Tailwind CSS
* Lucide Icons
* TypeScript (optional if used)

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)
* CORS & dotenv
* Render Deployment

---

### 📁 **Project Structure**

```
Bookit/
│
├── backend/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── models/
│   │   │   ├── Booking.ts
│   │   │   ├── Experience.ts
│   │   │   ├── PromoCode.ts
│   │   │   └── Slot.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── bookingRoutes.ts
│   │   │   ├── experienceRoutes.ts
│   │   │   └── promoRoutes.ts
│   │   │
│   │   ├── config.ts
│   │   ├── db.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│   
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ExperienceCard.tsx
│   │   ├── pages/
│   │   │   ├── Checkout.tsx
│   │   │   ├── Details.tsx
│   │   │   ├── Home.tsx
│   │   │   └── Result.tsx
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── assets/
│   │   ├── api.ts
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── types.d.ts
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│  
│ 
│
└── README.md


```

---

### ✨ **Features**

✅ Browse and view adventure experiences
✅ Responsive card layout with dynamic images
✅ Booking summary and quantity management
✅ Promo code support (if added)
✅ MongoDB-powered backend API
✅ Deployed on Render + Vercel
✅ CORS enabled for secure cross-domain access

---

### ⚙️ **Setup Instructions**

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/bookit.git
cd bookit
```

#### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```bash
npm start
```

#### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

### 🌍 **Environment Variables**

Backend `.env`:

```
PORT=5000
MONGO_URI=<your_mongo_db_connection_string>
```

Frontend `.env`:

```
VITE_API_URL=https://your-backend-domain.com

```

---

### 🧩 **API Endpoints**

| Endpoint           | Method | Description                   |
| ------------------ | ------ | ----------------------------- |
| `/api/experiences` | GET    | Get all adventure experiences |
| `/api/bookings`    | POST   | Create a booking              |
| `/api/promo`       | POST   | Validate promo code           |
| `/images`          | GET    | Static images from server     |

---

### 💻 **Deployment**

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

### 🧠 **Learnings**

* Implemented CORS handling between two deployed domains
* Worked with dynamic MongoDB APIs and REST routes
* Used Tailwind CSS for professional and responsive UI

---

### 🙌 **Author**

👤 **Aman**
---


