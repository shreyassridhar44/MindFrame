import os
import cv2
import numpy as np
import base64
import io
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# --- AI Model Imports ---
from keras.models import load_model
from keras.preprocessing import image

# ----------------------------
# ENVIRONMENT AND DB SETUP
# ----------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# # MongoDB connection
# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ----------------------------
# AI MODEL LOADING (ON STARTUP)
# ----------------------------
# We load the models ONCE when the server starts, not on every request.
model = None
face_haar_cascade = None
EMOTIONS = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

@app.on_event("startup")
async def startup_event():
    """
    Load the AI models when the server starts.
    """
    global model, face_haar_cascade
    
    # 1. Load the complete model from the .keras file
    model_path = str(ROOT_DIR / 'ml' / 'Facial_Expression_Detection_System.keras')
    model = load_model(model_path)
    
    # 2. Load the Haar Cascade classifier from the local file
    cascade_path = str(ROOT_DIR / 'ml' / 'haarcascade_frontalface_default.xml')
    face_haar_cascade = cv2.CascadeClassifier(cascade_path)
    
    # Check if models loaded correctly
    if model is None:
        logging.error(f"Failed to load Keras model from {model_path}")
    else:
        logging.info("Keras model loaded successfully.")
        
    if face_haar_cascade.empty():
        logging.error(f"Failed to load Haar Cascade from {cascade_path}")
    else:
        logging.info("Haar Cascade loaded successfully.")

# ----------------------------
# DATABASE MODELS (Existing)
# ----------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ----------------------------
# NEW AI API MODELS
# ----------------------------
class ImageInput(BaseModel):
    """Expects a base64-encoded image string from the frontend."""
    image: str

class EmotionPrediction(BaseModel):
    """The API's response."""
    emotion: str  # The top predicted emotion
    all_predictions: Optional[List[float]] = None # Full list of emotion scores

# ----------------------------
# EXISTING API ROUTES
# ----------------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# ... (your existing /status routes are fine here) ...
# (I've removed them for brevity, but you can keep them)

# ----------------------------
# NEW AI PREDICTION ROUTE
# ----------------------------
@api_router.post("/predict-emotion", response_model=EmotionPrediction)
async def predict_emotion(input: ImageInput):
    """
    Receives a base64 image, decodes it, runs emotion detection,
    and returns the predicted emotion.
    """
    if not model or face_haar_cascade.empty():
        return EmotionPrediction(emotion="error_model_not_loaded", all_predictions=[])

    # 1. Decode the Base64 image string
    # The frontend will send "data:image/jpeg;base64,...."
    # We need to split off the header and get the data
    try:
        header, encoded_data = input.image.split(',', 1)
        image_data = base64.b64decode(encoded_data)
        
        # Convert raw image bytes to a numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        
        # Convert numpy array to an OpenCV image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
            
    except Exception as e:
        logging.error(f"Image decoding error: {e}")
        return EmotionPrediction(emotion="error_decoding_image", all_predictions=[])

    # 2. Process the image (logic from your run_demo.py)
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

    if len(faces_detected) == 0:
        # No face found in the image
        return EmotionPrediction(emotion="no_face_detected", all_predictions=[])

    # 3. Get the first face detected
    (x, y, w, h) = faces_detected[0]
    
    # Crop the face
    roi_gray = gray_img[y:y + h, x:x + w]
    roi_gray = cv2.resize(roi_gray, (48, 48))

    # Prepare image for the model
    img_pixels = image.img_to_array(roi_gray)
    img_pixels = np.expand_dims(img_pixels, axis=0)
    img_pixels /= 255.0

    # 4. Make prediction
    predictions = model.predict(img_pixels, verbose=0)
    max_index = np.argmax(predictions[0])
    predicted_emotion = EMOTIONS[max_index]

    # 5. Return the result
    return EmotionPrediction(
        emotion=predicted_emotion,
        all_predictions=predictions[0].tolist() # Send all scores for the graph
    )

# ----------------------------
# FINAL APP SETUP
# ----------------------------
# Include the router
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    # This must include your React app's URL (e.g., "http://localhost:3000")
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()