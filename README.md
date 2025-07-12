# 🛒 E-Commerce Platform

A full-stack e-commerce web application built using:

- ⚛️ **React** with **Vite** for a blazing-fast frontend
- 🐍 **Django** & **Django REST Framework (DRF)** for a powerful backend
- 🔐 **Simple JWT** for secure authentication
- 🌐 **CORS** configuration to connect frontend and backend seamlessly

---
```bash
ecommerce-project/
│
├── backend/ # Django backend
│ ├── manage.py
│ ├── ecomerce_app
│ ├── ecomproject
│ └── db.sqlite3
│
├── frontend/ # React frontend using Vite
│ ├── index.html
│ ├── vite.config.js
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
└── 
---
```
## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ecommerce-project.git
cd ecommerce-project
```
🖥️ Frontend Setup (React + Vite)
📦 Install Frontend Dependencies
```bash
cd frontend
npm install
```
▶️ Run Frontend Development Server
```bash
npm run dev
# or
npx vite
```
Frontend will be available at:
📍 http://localhost:5173

---
🛠️ Backend Setup (Django + DRF)
📦 Create Virtual Environment & Activate
```bash
cd backend
python -m venv djvenv
source djvenv/bin/activate        # Windows: venv\Scripts\activate
```
📥 Install Python Libraries
```bash
pip install django djangorestframework djangorestframework-simplejwt corsheaders
```
⚙️ Apply Migrations and Create Superuser
```bash
python manage.py migrate
python manage.py createsuperuser
```
Backend will be available at:
📍 http://127.0.0.1:8000
---
🌍 CORS Configuration (Allow Frontend to Connect)
Installed via pip install django-cors-headers.

```bash
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


```

## ✅ Add to settings.py:

✅ Features (Work in Progress)
 User Registration and Login (JWT)

- Product Listing API & UI

- Product Detail Page

- Add to Cart

- Checkout & Orders

- Admin Product Management
---
## 📄 License
This project is open-source and available under the MIT License.
---
## 🙋‍♂️ Author
Ahmed Khan
📫 Reach out via GitHub or email for collaboration or queries.
---
🙌 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

Let me know if you also want:

- `requirements.txt` content  
- `.env.example` for environment variables  
- Deployment steps for Vercel (frontend) and Render/Railway (backend)  

I'll generate those for you too if needed!


