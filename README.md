# 🧠 MindFrame - Real-Time Emotion & Stress Detector

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An AI-powered web application that analyzes facial expressions via webcam to detect emotions and estimate stress levels in real-time, providing insightful summaries and an interactive AI chat experience.



---

## ✨ Features

* **Real-Time Emotion Detection:** Utilizes OpenCV and a custom Keras model (trained on the FER2013 dataset) to identify 7 core emotions (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral) directly from your webcam feed.
* **Live Stress Monitoring:** Calculates and displays a "Stress-o-Meter" based on detected negative emotions.
* **Dynamic Emotion Chart:** Visualizes the probability distribution of detected emotions using Recharts.
* **Session Tracking:** Includes a session timer to monitor the duration of analysis.
* **AI-Powered Summaries:** Generates personalized session summaries based on average stress and dominant emotion using the Gemini or OpenAI API (configurable).
* **Interactive AI Chatbot:** Engage in a conversation with an AI assistant (powered by Gemini) about your session, featuring:
    * **Text-to-Speech:** Hear the AI's responses. 🗣️
    * **Speech-to-Text:** Speak your replies using your microphone. 🎤
* **Modern UI:** Built with React and Tailwind CSS for a responsive and attractive user interface.

---

## 🛠️ Tech Stack

* **Frontend:**
    * React
    * Tailwind CSS
    * Recharts (for charts)
    * Lucide React (for icons)
    * Web Speech API (for STT/TTS)
* **Backend:**
    * Python 3.x
    * FastAPI (for the API server)
    * Uvicorn (for running FastAPI)
    * OpenCV (for image processing and face detection)
    * TensorFlow / Keras (for loading and running the emotion model)
    * Python-dotenv (for environment variables)
* **AI Models:**
    * **Custom Keras model (`.keras`)**: Trained in-house using the [FER2013 dataset from Kaggle](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data) for facial emotion recognition.
    * Haar Cascade (`.xml`) for face detection.
    * Google Gemini API (for summary generation and chatbot).

---

## ⚙️ Setup & Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/shreyassridhar44/MindFrame.git](https://github.com/shreyassridhar44/MindFrame.git)
    cd MindFrame
    ```

2.  **Backend Setup (`/backend` directory):**
    * Navigate to the backend directory: `cd backend`
    * Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        # Windows PowerShell:
        .\venv\Scripts\Activate.ps1
        # MacOS/Linux:
        # source venv/bin/activate
        ```
    * Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    * Ensure your custom emotion model (`.keras` file) and the Haar Cascade (`haarcascade_frontalface_default.xml`) are placed inside the `backend/ml/` directory.

3.  **Frontend Setup (`/frontend` directory):**
    * Navigate to the frontend directory: `cd ../frontend` (from `backend/`) or `cd frontend` (from root).
    * Install Node.js dependencies:
        ```bash
        npm install
        # or yarn install
        ```
    * **Add your AI API Key:**
        * Open `frontend/src/components/ChatModal.jsx`.
        * Open `frontend/src/components/InsightsPanel.jsx`.
        * In **both** files, replace `"PASTE_YOUR_NEW_API_KEY_HERE"` with your actual Google Gemini API key (depending on which version of the code you are using).
        * **Important:** Ensure the corresponding API (Generative Language API for Gemini API) is enabled in your cloud project and that **billing is active**.

---

## ▶️ Running the Application

You need to run both the backend and frontend servers simultaneously.

1.  **Start the Backend Server:**
    * Open a terminal in the `backend/` directory.
    * Make sure your virtual environment is activated (`(venv)` should be visible in your prompt).
    * Run the FastAPI server using Uvicorn:
        ```bash
        uvicorn server:app --reload --port 8000
        ```
    * The server should start on `http://localhost:8000`.

2.  **Start the Frontend Server:**
    * Open a **separate** terminal in the `frontend/` directory.
    * Run the React development server:
        ```bash
        npm start
        # or yarn start
        ```
    * Your browser should automatically open to `http://localhost:3000`.

---

## 📁 Project Structure (Simplified)

MindFrame/ ├── backend/ │ ├── ml/ # AI models (.keras, .xml) │ ├── venv/ # Python virtual environment │ ├── .env # Environment variables (needs creation) │ ├── requirements.txt # Python dependencies │ ├── server.py # FastAPI application │ └── ... ├── frontend/ │ ├── public/ # Static assets (index.html) │ ├── src/ │ │ ├── components/ # Reusable React components (Navbar, StressOMeter, etc.) │ │ ├── pages/ # Page components (HomePage, DetectorPage) │ │ ├── App.js # Main application routing │ │ ├── index.css # Global styles (Tailwind base) │ │ └── index.js # React entry point │ ├── package.json # Node.js dependencies │ ├── tailwind.config.js # Tailwind CSS configuration │ └── ... └── README.md # This file

---

## 💡 Potential Future Improvements

* Save session history (average stress, dominant emotion, duration) to the MongoDB database.
* Implement user authentication.
* Add more detailed historical analysis and charts.
* Improve accessibility (ARIA attributes, keyboard navigation).

---

