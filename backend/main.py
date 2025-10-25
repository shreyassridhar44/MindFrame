import uvicorn
import cv2
import numpy as np
import base64
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Import your model prediction logic from model.py
from model import predict_emotion, EMOTION_LABELS

app = FastAPI()

# --- Add CORS Middleware ---
# This is crucial to allow your frontend (on a different port)
# to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    """
    A simple root endpoint to check if the server is running.
    """
    return {"message": "MindFrame Emotion Detection API"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    This is the main WebSocket endpoint.
    It accepts a connection, then enters a loop to:
    1. Receive a Base64-encoded image frame from the client.
    2. Decode the frame into an OpenCV image.
    3. Pass the frame to your `predict_emotion` function.
    4. Send the JSON-formatted results back to the client.
    """
    await websocket.accept()
    print("WebSocket client connected.")
    
    try:
        # This loop continues as long as the client is connected
        while True:
            # Receive text data (the Base64 image string)
            data_url = await websocket.receive_text()
            
            # The data URL looks like "data:image/jpeg;base64,..."
            # We need to split off the header and get the data
            try:
                img_data = data_url.split(',')[1]
            except IndexError:
                print("Invalid data URL received. Skipping frame.")
                continue

            # Decode the Base64 string into raw image bytes
            img_bytes = base64.b64decode(img_data)
            
            # Convert the raw bytes into a NumPy array
            nparr = np.frombuffer(img_bytes, np.uint8)
            
            # Decode the NumPy array into an OpenCV image (frame)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                print("Failed to decode image. Skipping frame.")
                continue

            # --- Your Model Logic is Called Here ---
            emotion, probabilities = predict_emotion(frame)
            
            # --- Format the Response ---
            response = {}
            if emotion is None:
                # This is what we send if no face is detected
                response = {
                    "emotion": "No Face Detected",
                    "probabilities": [0.0] * len(EMOTION_LABELS),
                    "labels": EMOTION_LABELS
                }
            else:
                # This is what we send if a face is found
                response = {
                    "emotion": emotion,
                    "probabilities": probabilities,
                    "labels": EMOTION_LABELS
                }
            
            # Send the JSON response back to the frontend
            await websocket.send_json(response)

    except WebSocketDisconnect:
        print("WebSocket client disconnected.")
    except Exception as e:
        print(f"An error occurred in the WebSocket: {e}")
    finally:
        # Ensure the connection is closed cleanly
        await websocket.close()
        print("WebSocket connection closed.")

if __name__ == "__main__":
    # This allows you to run the server by executing: python main.py
    print("Starting FastAPI server on http://127.0.0.1:8000")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
