# Emotion detection using deep learning

## Introduction

This project aims to classify the emotion on a person's face into one of **seven categories**, using deep convolutional neural networks. The model is trained on the **FER-2013** dataset which was published on International Conference on Machine Learning (ICML). This dataset consists of 35887 grayscale, 48x48 sized face images with **seven emotions** - angry, disgusted, fearful, happy, neutral, sad and surprised.

## Install on Arch Linux

Use CPython 3.12 in a virtual environment. TensorFlow wheels may not support Arch's newest system Python immediately, so do not install project packages into the system interpreter.

Install OpenCV's Linux GUI and webcam utilities:

```bash
sudo pacman -S --needed mesa v4l-utils
```

From the project root, create and activate an environment using an installed Python 3.12 interpreter:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Download and verify the pretrained weights before running the webcam demo:

```bash
python scripts/download_model.py
cd src
python emotions.py --mode display
```

The downloader checks the model's SHA-256 before placing it in `src/model.h5`. The weights and FER-2013 data are not stored in this repository.

To check installed dependencies for known advisories:

```bash
python -m pip install -r requirements-dev.txt
python -m pip_audit -r requirements.txt
```

The project guide can be launched from the repository root with `python app.py`.

## Basic Usage

The emotion detector uses TensorFlow/Keras, OpenCV, and the bundled Haar cascade. Dependencies are bounded in `requirements.txt` to avoid obsolete releases and incompatible major upgrades.

* For training, prepare the FER-2013 dataset under `src/data`. Training is optional for webcam display, which uses the pretrained model.

* If you want to train this model, use:  

```bash
cd src
python emotions.py --mode train
```

* To view predictions without training again, run the verified model download command from the project root, then start display mode:

```bash
cd src
python emotions.py --mode display
```

* The folder structure is of the form:  
  src:
  * data (folder)
  * `emotions.py` (file)
  * `haarcascade_frontalface_default.xml` (file)
  * `model.h5` (file)

* This implementation by default detects emotions on all faces in the webcam feed. With a simple 4-layer CNN, the test accuracy reached 63.2% in 50 epochs.

![Accuracy plot](imgs/accuracy.png)

## Data Preparation (optional)

* The [original FER2013 dataset in Kaggle](https://www.kaggle.com/deadskull7/fer2013) is available as a single csv file. I had converted into a dataset of images in the PNG format for training/testing.

* In case you are looking to experiment with new datasets, you may have to deal with data in the csv format. I have provided the code I wrote for data preprocessing in the `dataset_prepare.py` file which can be used for reference.

## Algorithm

* First, the **haar cascade** method is used to detect faces in each frame of the webcam feed.

* The region of image containing the face is resized to **48x48** and is passed as input to the CNN.

* The network outputs a list of **softmax scores** for the seven classes of emotions.

* The emotion with maximum score is displayed on the screen.
