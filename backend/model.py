import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import os

# --- 1. Define File Paths ---
# Get the base directory of *this* file (model.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- UPDATED PATHS ---
# Model path is now inside the 'ml' subfolder
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'Facial_Expression_Detection_System.keras')
# Cascade path is in the main backend folder (with model.py)
CASCADE_PATH = os.path.join(BASE_DIR, 'haarcascade_frontalface_default.xml')

# --- 2. Load Your Models ---
try:
    # Load your trained emotion detection model
    model = load_model(MODEL_PATH)
    
    # Load the Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    
    if face_cascade.empty():
        print(f"Error: Could not load Haar Cascade from {CASCADE_PATH}")
    else:
        print("Models loaded successfully.")
        
except Exception as e:
    print(f"Error loading models: {e}")
    print(f"Ensure 'Facial_Expression_Detection_System.keras' is in {os.path.join(BASE_DIR, 'ml')}")
    print(f"Ensure 'haarcascade_frontalface_default.xml' is in {BASE_DIR}")
    
# --- 3. Define Your Emotion Labels ---
# !!! CRITICAL !!!
# These labels MUST match the order your model was trained on.
# Please CHECK YOUR `run_demo.py` file to see what labels it uses.
# This is the standard FER-2013 order.
EMOTION_LABELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# --- 4. Create Prediction Function ---
# This function contains the logic from your 'run_demo.py' file.
def predict_emotion(frame):
    """
    Predicts the emotion from a single video frame.
    'frame' is an OpenCV image (numpy array).
    """
    
    # If models didn't load, don't try to predict
    if 'model' not in globals() or 'face_cascade' not in globals() or face_cascade.empty():
        print("Models not loaded. Cannot predict.")
        return None, None

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR_GRAY)
    
    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    # If no face is detected, return nothing
    if len(faces) == 0:
        return None, None

    # Process only the first face found
    (x, y, w, h) = faces[0]
    
    # Extract the face ROI (Region of Interest)
    roi_gray = gray[y:y+h, x:x+w]
    
    # --- THIS IS THE KEY PRE-PROCESSING ---
    # Resize the ROI to your model's expected input (48x48 for FER-2013)
    try:
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
    except Exception as e:
        print(f"Error resizing ROI: {e}")
        return None, None

    # Convert to float and normalize
    img_pixels = roi_gray.astype("float") / 255.0
    
    # Convert to a Keras-compatible array
    img_pixels = img_to_array(img_pixels)
    
    # Add batch dimension (model expects 1, 48, 48, 1)
    img_pixels = np.expand_dims(img_pixels, axis=0)

    # --- Make Prediction ---
    # We add verbose=0 to prevent TensorFlow from printing
    # "Predicting..." to the console for every frame
    predictions = model.predict(img_pixels, verbose=0)
    
    if predictions is not None:
        # Get the list of probabilities
        probabilities = predictions[0].tolist()
        
        # Get the index of the highest probability
        max_index = np.argmax(predictions[0])
        
        # Get the corresponding emotion label
        emotion = EMOTION_LABELS[max_index]
        
        return emotion, probabilities
        
    return None, None

