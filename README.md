# AI Component Generator

A stateful, AI-driven micro-frontend playground where users can iteratively generate, preview, tweak, and export React components.

---
## Live Demo

* **Frontend (Vercel):** # AI Component Generator

A stateful, AI-driven micro-frontend playground where users can iteratively generate, preview, tweak, and export React components.

---
## Live Demo

* **Frontend (Vercel):** https://ai-component-generator1.vercel.app/login
* **Backend (Render):** https://ai-component-generator1.onrender.com
---
## Tech Stack

* **Frontend:** React, Next.js, TypeScript, Zustand
* **Backend:** Node.js, NestJS, TypeScript
* **Database:** MongoDB (with Mongoose)
* **AI:** Google Gemini API

---
## Local Setup

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* MongoDB installed and running locally

### Installation

1.  **Clone the repository:**
    ```bash
    git clone (https://github.com/Mokshavardhan/ai-component-generator1.git)
    cd ai-component-generator1
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run start:dev
    ```
    The backend will be running on `http://localhost:3002`.

2.  **Start the frontend server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend will be running on `http://localhost:3000`.

---
## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_ai_api_key
```

  
