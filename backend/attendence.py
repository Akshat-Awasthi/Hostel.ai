import os
import csv
import pickle
import base64
import face_recognition
import numpy as np

from datetime import datetime
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

ENCODINGS_DIR = "encodings"
ENCODINGS_PATH = os.path.join(ENCODINGS_DIR, "face_encodings.pkl")
ATTENDANCE_CSV = "attendance.csv"

known_face_encodings = []
known_face_labels = []  # each label = "Name|Roll"

def load_encodings():
    global known_face_encodings, known_face_labels
    if os.path.exists(ENCODINGS_PATH):
        with open(ENCODINGS_PATH, "rb") as f:
            data = pickle.load(f)
            known_face_encodings = data["encodings"]
            known_face_labels = data["labels"]
    else:
        known_face_encodings = []
        known_face_labels = []

def save_encodings():
    data = {
        "encodings": known_face_encodings,
        "labels": known_face_labels
    }
    with open(ENCODINGS_PATH, "wb") as f:
        pickle.dump(data, f)

def decode_base64_to_image(base64_str):
    # Remove "data:image/...;base64," if present
    if "base64," in base64_str:
        base64_str = base64_str.split("base64,")[1]
    decoded = base64.b64decode(base64_str)
    return Image.open(BytesIO(decoded))

def mark_attendance(name, roll):
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")
    with open(ATTENDANCE_CSV, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([date_str, time_str, name, roll])

def get_today_attendance():
    today = datetime.now().strftime("%Y-%m-%d")
    attended = set()
    if not os.path.exists(ATTENDANCE_CSV):
        return attended
    with open(ATTENDANCE_CSV, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 4:
                continue
            date_str, _, name, roll = row
            if date_str == today:
                attended.add((name, roll))
    return attended

def get_all_registered_students():
    all_studs = set()
    for label in known_face_labels:
        parts = label.split("|")
        if len(parts) == 2:
            all_studs.add((parts[0], parts[1]))
    return all_studs

@app.route("/register-faces", methods=["POST"])
def register_faces():
    """
    Expects JSON:
    {
      "name": "SomeName",
      "roll": "1234",
      "images": ["data:image/jpeg;base64,...", ...]
    }
    """
    data = request.get_json()
    name = data.get("name")
    roll = data.get("roll")
    images = data.get("images", [])

    if not name or not roll:
        return jsonify({"status": "error", "message": "Name and roll required"}), 400
    if not images:
        return jsonify({"status": "error", "message": "No images provided"}), 400

    new_encodings = []
    for base64_img in images:
        pil_img = decode_base64_to_image(base64_img)
        np_img = np.array(pil_img.convert("RGB"))
        face_locs = face_recognition.face_locations(np_img)
        encs = face_recognition.face_encodings(np_img, face_locs)
        # Only if exactly one face
        if len(encs) == 1:
            new_encodings.append(encs[0])

    if not new_encodings:
        return jsonify({"status": "error", "message": "No single-face images found"}), 400

    # Average all encodings
    mean_encoding = np.mean(new_encodings, axis=0)
    label = f"{name}|{roll}"
    known_face_encodings.append(mean_encoding)
    known_face_labels.append(label)
    save_encodings()

    return jsonify({"status": "ok", "message": f"Registered {name} (Roll: {roll})"})

@app.route("/recognize-face", methods=["POST"])
def recognize_face():
    """
    Expects JSON:
    {
      "image": "data:image/jpeg;base64,..."
    }
    """
    data = request.get_json()
    image_b64 = data.get("image")
    if not image_b64:
        return jsonify({"status": "error", "message": "No image provided"}), 400

    pil_img = decode_base64_to_image(image_b64)
    np_img = np.array(pil_img.convert("RGB"))
    face_locs = face_recognition.face_locations(np_img)
    face_encs = face_recognition.face_encodings(np_img, face_locs)

    if len(face_encs) == 0:
        return jsonify({"status": "ok", "recognized": False, "message": "No face detected"})

    face_enc = face_encs[0]
    matches = face_recognition.compare_faces(known_face_encodings, face_enc, tolerance=0.45)

    name = "Unknown"
    roll = ""
    if True in matches:
        idx = matches.index(True)
        lbl = known_face_labels[idx]
        parts = lbl.split("|")
        if len(parts) == 2:
            name, roll = parts

    recognized = (name != "Unknown")
    return jsonify({
        "status": "ok",
        "recognized": recognized,
        "name": name,
        "roll": roll
    })

@app.route("/mark-attendance", methods=["POST"])
def mark_attendance_route():
    data = request.get_json()
    name = data.get("name")
    roll = data.get("roll")
    if not name or not roll:
        return jsonify({"status": "error", "message": "Name & roll required"}), 400
    mark_attendance(name, roll)
    return jsonify({"status": "ok", "message": f"Attendance marked for {name} ({roll})."})

@app.route("/attendance-status", methods=["GET"])
def attendance_status():
    attended = get_today_attendance()
    registered = get_all_registered_students()

    attended_list = [{"name": n, "roll": r} for (n, r) in attended]
    not_attended_list = [
        {"name": n, "roll": r} for (n, r) in registered if (n, r) not in attended
    ]

    return jsonify({
        "status": "ok",
        "attended_today": attended_list,
        "not_attended_today": not_attended_list
    })

if __name__ == "__main__":
    if not os.path.exists(ENCODINGS_DIR):
        os.makedirs(ENCODINGS_DIR)
    load_encodings()
    app.run(port=5000, debug=True)
