# 📝 onlyNotes

Welcome to **onlyNotes** – your open-source, real-time collaborative note-taking application. Create, organize, and collaborate on notes seamlessly, all powered by modern web technologies.

---

## ✨ Features
- Real-time collaboration on notes with other users.
- User authentication and secure access using **SimpleJWT**.
- Clean and intuitive UI, styled with **Tailwind CSS**.
- Prototyped using **Figma** for a pixel-perfect experience.
- Built with **React** (via **Vite**) for fast and smooth frontend performance.
- Backend powered by **Django REST Framework**, with a **SQLite** database.

---

## 🚀 Getting Started

Follow these steps to clone, set up, and run the project locally.

### Prerequisites
- **Node.js** (v16 or later)
- **Python** (v3.8 or later)
- **Git**

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/onlynotes.git
   cd onlynotes/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd ../backend
   pip install django
   pip install djangorestframework
   pip install djangorestframework-simplejwt
   pip install django-cors-headers

   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   "venv\Scripts\activate"  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`.

### Configuration
- **CORS**: The app is configured to allow requests from the frontend domain (`http://localhost:5173`). Adjust `CORS_ALLOWED_ORIGINS` in `settings.py` if needed.
- **Environment Variables**: Modify the `.env` file for environment-specific settings.

---

## ⚡ Real-Time Collaboration
- Real-time collaboration is powered by Django Channels. Ensure that your setup includes a Redis server or use a hosted alternative like **Upstash**.

To install and run Redis locally:
```bash
sudo apt update
sudo apt install redis
redis-server
```

Update the `CHANNEL_LAYERS` setting in `settings.py` for the Redis connection.

---

## 🛠 Technologies Used
- **Frontend**: React, React Router, Vite, Tailwind CSS
- **Backend**: Django REST Framework, SimpleJWT
- **Database**: SQLite
- **Prototyping**: Figma

---

## 🏗️ Contribution Guidelines
We welcome contributions! Follow these steps to contribute:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push your branch to your fork and submit a pull request.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---

## 📬 Support
If you encounter any issues or have questions, feel free to open an issue.

---

## 🌟 Acknowledgments
Special thanks to all project members.
