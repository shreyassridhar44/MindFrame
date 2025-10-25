import os
import cv2
import numpy as np
from keras.models import load_model  # Import load_model
from keras.preprocessing import image

# 1. Load the complete model from the .keras file
model = load_model('Facial_Expression_Detection_System.keras')

# 2. Load the Haar Cascade classifier from the local file
face_haar_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# 3. Define the emotions
EMOTIONS = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

# 4. Start the webcam feed
cap = cv2.VideoCapture(0)

while True:
    ret, test_img = cap.read()  # captures frame
    if not ret:
        print("Failed to grab frame")
        break
        
    gray_img = cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)

    faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

    for (x, y, w, h) in faces_detected:
        # Draw rectangle around the face
        cv2.rectangle(test_img, (x, y), (x + w, y + h), (255, 0, 0), thickness=3)
        
        # Crop the region of interest (the face)
        roi_gray = gray_img[y:y + h, x:x + w] # Corrected cropping: y:y+h, x:x+w
        roi_gray = cv2.resize(roi_gray, (48, 48))
        
        # Prepare the image for the model
        img_pixels = image.img_to_array(roi_gray)
        img_pixels = np.expand_dims(img_pixels, axis=0)
        img_pixels /= 255.0  # Normalize

        # Make prediction
        predictions = model.predict(img_pixels, verbose=0)

        # Get the emotion
        max_index = np.argmax(predictions[0])
        predicted_emotion = EMOTIONS[max_index]

        # Put the emotion text on the image
        cv2.putText(test_img, predicted_emotion, (int(x), int(y - 10)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the image
    cv2.imshow('Facial Emotion Analysis', test_img)

    # Quit on 'q' press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()