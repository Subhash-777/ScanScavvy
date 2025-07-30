
# 🛒 ScanScavvy

**ScanScavvy** is a smart barcode scanner app built for the **Walmart Hackathon** using **React Native (Expo Go)** for the frontend and **Express.js (Node.js)** for the backend.  
It leverages **ngrok** to expose the backend server globally for real-time mobile interaction.

---

## 💡 Project Idea

The app was designed to enhance in-store and online shopping experiences by:
- 📦 Scanning product barcodes
- 📅 Displaying key product info: expiry date, manufacture date, and nutritional data (e.g., fat, protein composition)
- 🤖 Recommending alternative products with a **similarity score**
- 🗣️ Converting all product info into **speech** for accessibility
- 🛍️ Adding products to a **cart** and calculating the **total cost**

---

## 🚀 Features

- 🔍 Real-time barcode scanning and product analysis
- 🧠 Smart suggestions based on product similarity
- 🗨️ Text-to-speech for accessibility
- 🛒 Cart management with total price display
- 🌐 Backend exposed globally via **ngrok**

---

## 🧩 Tech Stack

| Part         | Technology             |
|--------------|------------------------|
| Frontend     | React Native + Expo Go |
| Backend      | Node.js + Express.js   |
| Networking   | ngrok (for global tunnel) |
| Utilities    | Text-to-Speech, Similarity Logic |

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
2. In a separate terminal, launch ngrok:
    ```bash
    ngrok http 3000
    ```
3. Copy the generated ngrok URL (e.g. `https://abcd1234.ngrok.io`)  
   Update it in `frontend/api.js` as `API_BASE_URL`.

### Frontend

1. Start the Expo project:
    ```bash
    cd frontend
    expo start
    ```
2. Scan the QR code with Expo Go app to launch on your device.

---

## 📁 File Structure

```
ScanScavvy/
├── backend/
│   ├── index.js           ← Express backend entry point
│   └── routes/            ← Product routes and logic
├── frontend/
│   ├── App.js             ← React Native main app
│   ├── api.js             ← API endpoint (ngrok URL goes here)
│   └── components/        ← UI elements
├── README.md
└── .gitignore
```

---

## 🧠 Updating API URL

Every time you restart ngrok:

1. Run `ngrok http 3000`
2. Copy the new URL (e.g., `https://xyz.ngrok.io`)
3. Paste it into `frontend/api.js`
4. Restart the frontend app

---

## 🧪 Troubleshooting

- ❌ *App not connecting to backend?*
  - Check if ngrok is running and the new URL is correctly added.
  - Ensure backend server is running.

- 🛑 *CORS or network errors in Expo?*
  - Add `cors` middleware in backend.
  - Restart Expo and ngrok if needed.

---

## 🔮 Future Enhancements

- 🚀 Deploy backend to cloud (Heroku, AWS, etc.)
- 🔐 Secure API with JWT authentication
- 🛢️ Connect to database for persistent storage
- 📱 Polish UI and improve accessibility support


---

## 🙏 Credits

Made by **Subhash**
Powered by **React Native**, **Express.js**, **ngrok**, and creativity ✨
