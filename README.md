
# 🕵️ ScanScavvy

**ScanScavvy** is a mobile scavenger hunt app built with **React Native (Expo Go)** on the frontend and **Express.js (Node.js)** on the backend.  
Currently, the backend is exposed worldwide using **ngrok**, so the API endpoint URL in `api.js` must be updated to match the ngrok address every time you restart the tunnel.

---

## 🚀 Features

- User-friendly React Native frontend working via **Expo Go**  
- Express.js backend API for handling game logic  
- Global access to backend via **ngrok** tunnel  
- Token-based scavenger hunt challenges and responses  

---

## 🧩 Tech Stack

| Part         | Technology             |
|--------------|------------------------|
| Frontend     | React Native + Expo Go |
| Backend      | Node.js + Express.js   |
| Network      | ngrok (exposes localhost globally) |

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Subhash-777/ScanScavvy.git
cd ScanScavvy
```

### 2. Install dependencies

- **Backend:**
  ```bash
  cd backend
  npm install
  ```

- **Frontend:**
  ```bash
  cd ../frontend
  npm install
  ```

---

## 💡 Running Locally

### Backend

1. Start your Express server:
    ```bash
    cd backend
    npm start
    ```
2. In a separate terminal, launch ngrok to expose your local backend:
    ```bash
    ngrok http 3000
    ```
3. Copy the generated ngrok URL (e.g. `https://abcd1234.ngrok.io`) and update it in the frontend's `api.js` file as the `API_BASE_URL`.

### Frontend (React Native)

1. Open the project in your terminal:
    ```bash
    cd frontend
    expo start
    ```
2. Launch Expo on your device or emulator. The app will use the updated API URL and communicate with your live backend.

---

## 📁 File Structure

```
ScanScavvy/
├── backend/
│   ├── index.js           ← Express server entry point
│   └── routes/            ← API routes (e.g. game logic)
├── frontend/
│   ├── App.js             ← Root of the React Native app
│   ├── api.js             ← API URL configuration (ngrok URL goes here)
│   └── components/        ← UI components
├── README.md
└── .gitignore
```

---

## 🧠 Updating API URL

Every time you restart ngrok, follow these steps:

1. Run `ngrok http 3000` again.
2. Copy the new public URL (starts with `https://`).
3. Open `frontend/api.js` and replace the existing base URL with the new one.
4. Save and restart your Expo app so it points at the updated backend.

---

## 🔄 Future Improvements

- 🔐 Use static backend hosting or cloud deployment (AWS, Heroku, Vercel) to eliminate ngrok overhead  
- 🧾 Add environment variables to store API URL dynamically  
- ⚙️ Implement authentication (JWT or OAuth) for secure player sessions  
- ♻️ Persist user/game data in a database (MongoDB, PostgreSQL)  
- 🧩 Enhance frontend UI with polished design and animations  

---

## 👩‍💻 Usage Workflow

1. Player installs the Expo Go app and scans the project QR code.
2. App fetches scavenger hunt tasks from the Express API via the exposed ngrok URL.
3. Player completes tasks, scans codes, or uploads results.
4. API validates and logs progress, responding with updates.
5. App displays real-time game status and feedback.

---

## 🧪 Troubleshooting

- ❌ *App can’t reach backend?*  
  - Check that ngrok is running and you’re using the current URL in `api.js`.  
  - Confirm backend server is active (`npm start` without errors).

- 🛑 *Expo gives CORS or network errors?*  
  - Consider adding CORS middleware in Express (e.g., `cors` npm package).  
  - Remake the connection after updating the ngrok URL.

---

## 📜 License

Add your license (e.g. MIT) here.

---

## 🙏 Credits

Project by **Subhash** – powered by React Native, Express.js, and ngrok magic. 🧰
