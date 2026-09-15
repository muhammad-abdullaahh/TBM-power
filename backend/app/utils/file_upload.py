import os
import shutil
from fastapi import UploadFile, HTTPException
from pathlib import Path

UPLOAD_DIR = Path("uploads/products")
try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    pass

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

async def save_upload_file(upload_file: UploadFile) -> str:
    # Validate extension
    ext = Path(upload_file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, and WEBP are allowed.")

    # Generate a safe, unique filename
    import uuid
    new_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / new_filename

    # Save to disk
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")
    finally:
        upload_file.file.close()

    # The frontend can access this via a StaticFiles route mounted at /uploads
    return f"/uploads/products/{new_filename}"
