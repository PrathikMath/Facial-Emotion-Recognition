from pathlib import Path

from flask import Flask, jsonify, render_template, send_file


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "src"

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/assets/accuracy.png")
def accuracy_plot():
    return send_file(ROOT / "imgs" / "accuracy.png", mimetype="image/png")


@app.get("/api/project")
def project_info():
    labels = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"]
    train_dir = SOURCE / "data" / "train"
    test_dir = SOURCE / "data" / "test"
    model_file = SOURCE / "model.h5"
    cascade_file = SOURCE / "haarcascade_frontalface_default.xml"

    return jsonify(
        {
            "name": "Emotion Detection",
            "summary": "A real-time facial expression classifier built with a convolutional neural network.",
            "dataset": {
                "name": "FER-2013",
                "image_count": 35887,
                "image_size": "48 x 48 px",
                "color": "grayscale",
            },
            "labels": labels,
            "pipeline": [
                "Capture a webcam frame",
                "Locate faces with a Haar cascade",
                "Resize each face to 48 x 48 grayscale pixels",
                "Classify it with a CNN and display the top label",
            ],
            "model": {
                "architecture": "Convolutional neural network",
                "convolution_blocks": 4,
                "classes": len(labels),
                "reported_accuracy": "63.2%",
                "reported_epochs": 50,
            },
            "readiness": {
                "weights": model_file.is_file(),
                "face_detector": cascade_file.is_file(),
                "training_data": train_dir.is_dir() and test_dir.is_dir(),
                "training_data_path": "src/data/train and src/data/test",
            },
            "commands": {
                "display": "cd src; python emotions.py --mode display",
                "train": "cd src; python emotions.py --mode train",
            },
            "files": {
                "model": "src/model.h5" if model_file.is_file() else None,
                "face_detector": "src/haarcascade_frontalface_default.xml" if cascade_file.is_file() else None,
            },
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
