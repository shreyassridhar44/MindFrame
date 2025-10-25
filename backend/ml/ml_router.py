# File: ml_router.py

from fastapi import APIRouter, Response, HTTPException
from starlette.responses import StreamingResponse
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import asyncio
from typing import List, Dict, Any

# --- FASTAPI ROUTER SETUP ---
ml_router = APIRouter(prefix="/detector")

# --- GLOBAL VARIABLES & MODEL LOADING ---
# NOTE: Adjust paths if your model files are NOT in the root directory
MODEL_PATH = 'Facial_Expression_Detection_System.keras'
CASCADE_PATH = 'haarcascade_frontalface_default.xml'
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

model = None
face_haar_cascade = None
LAST_PREDICTION = {
    'emotions': [{"name": e, "probability": 0.0} for e in EMOTIONS], 
    'stressLevel': 0, 
    'insight': {'type': 'info', 'message': 'Awaiting first frame analysis...'}
} 

try:
    model = load_model(MODEL_PATH)
    face_haar_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    print("ML Models loaded successfully.")
except Exception as e:
    print(f"Error loading ML models. Live video analysis will be disabled: {e}")

# --- HELPER FUNCTIONS (Same logic as previous response) ---

def generate_insight(emotions_data: List[Dict[str, Any]]):
    """Generates a text insight and calculates a mock stress level (0-100)."""
    if not emotions_data or all(e['probability'] == 0 for e in emotions_data):
        return {'type': 'info', 'message': 'No clear emotions detected.'}, 0

    emotions_dict = {e['name']: e['probability'] for e in emotions_data}
    dominant_emotion = max(emotions_dict, key=emotions_dict.get)
    dominant_prob = emotions_dict[dominant_emotion] * 100
    
    # Mock stress calculation based on negative emotions
    stress_value = (emotions_dict.get('angry', 0) * 100 + 
                    emotions_dict.get('fear', 0) * 100 + 
                    emotions_dict.get('sad', 0) * 50)
    stress_level = int(max(0, min(100, stress_value)))

    if dominant_emotion in ['angry', 'fear', 'sad']:
        msg_type = 'warning'
        msg = f"Dominant emotion: **{dominant_emotion.capitalize()}** ({dominant_prob:.1f}%). High stress detected. Take a break."
    elif dominant_emotion == 'happy':
        msg_type = 'success'
        msg = f"You look **Happy** ({dominant_prob:.1f}%). Keep that energy going!"
    else:
        msg_type = 'info'
        msg = f"Dominant emotion: **{dominant_emotion.capitalize()}** ({dominant_prob:.1f}%). Stress level is low/moderate."

    return {'type': msg_type, 'message': msg}, stress_level


def process_frame_and_predict(frame):
    """Detects faces, runs prediction, and updates global state."""
    global LAST_PREDICTION
    
    if face_haar_cascade is None or model is None:
        return frame # Return original frame if models aren't loaded

    # NOTE: The implementation details from your original script are used here
    gray_img = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

    if faces_detected is not None and len(faces_detected) > 0:
        x, y, w, h = faces_detected[0] 
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), thickness=3)
        
        roi_gray = gray_img[y:y + h, x:x + w]
        if roi_gray.shape[0] > 0 and roi_gray.shape[1] > 0:
            roi_gray = cv2.resize(roi_gray, (48, 48))
            
            img_pixels = image.img_to_array(roi_gray)
            img_pixels = np.expand_dims(img_pixels, axis=0)
            img_pixels /= 255.0

            predictions = model.predict(img_pixels, verbose=0)[0]
            emotions_output = [{"name": EMOTIONS[i], "probability": float(p)} for i, p in enumerate(predictions)]
            
            insight, stress_level = generate_insight(emotions_output)

            # Update global state for the polling endpoint
            LAST_PREDICTION = {
                'emotions': emotions_output,
                'stressLevel': stress_level,
                'insight': insight
            }
            
            # Annotate frame
            predicted_emotion = EMOTIONS[np.argmax(predictions)].upper()
            cv2.putText(frame, predicted_emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            
    return frame

async def generate_video_stream():
    """Async generator for MJPEG stream."""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        # Raise an exception or yield a placeholder image if needed
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                await asyncio.sleep(0.1) # Wait briefly if frame read fails
                continue
            
            # This is CPU-intensive, but kept here for simplicity/single-thread FastAPI setup
            frame_with_prediction = process_frame_and_predict(frame)
            
            ret, buffer = cv2.imencode('.jpg', frame_with_prediction)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            await asyncio.sleep(0.03) # Control frame rate to about 30 FPS

    finally:
        cap.release()
        print("Webcam released.")


# --- ML ROUTER ENDPOINTS ---

@ml_router.get("/video_feed")
async def video_feed_endpoint():
    """Streams the webcam frames with emotion detection overlaid."""
    # Use StreamingResponse for MJPEG stream
    return StreamingResponse(generate_video_stream(), media_type="multipart/x-mjpeg")


@ml_router.get("/results")
async def get_results_endpoint():
    """Provides the latest analysis data (emotions, stress, insight) via polling."""
    global LAST_PREDICTION
    return LAST_PREDICTION

# End of ml_router.py