from hashlib import sha256
from pathlib import Path

import gdown


ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "src" / "model.h5"
TEMP_PATH = ROOT / "src" / "model.h5.download"
MODEL_URL = "https://drive.google.com/uc?id=1FUn0XNOzf-nQV7QjbBPA6-8GLoHNNgv-"
EXPECTED_SHA256 = "9e58be8fe84b94c02f13d17174943cac53347e35411c9dcdd8165a8a27c99272"


def main() -> None:
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    if MODEL_PATH.is_file() and sha256(MODEL_PATH.read_bytes()).hexdigest() == EXPECTED_SHA256:
        print(f"Model already verified: {MODEL_PATH}")
        return

    try:
        downloaded_path = gdown.download(MODEL_URL, str(TEMP_PATH), quiet=False)
        if not downloaded_path or not TEMP_PATH.is_file():
            raise RuntimeError("Google Drive did not return the model file.")
        actual_sha256 = sha256(TEMP_PATH.read_bytes()).hexdigest()
        if actual_sha256 != EXPECTED_SHA256:
            raise RuntimeError("Downloaded model checksum does not match the expected SHA-256.")
        TEMP_PATH.replace(MODEL_PATH)
        print(f"Downloaded and verified model: {MODEL_PATH}")
    finally:
        TEMP_PATH.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
