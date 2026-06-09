#!/usr/bin/env python3
"""
OpenCode Evolution - Vision Analyzer
Analisis completo de imagenes con OpenCV + Tesseract OCR
"""
import sys
import json
import cv2
import numpy as np
import pytesseract
from PIL import Image

def analyze_image(path):
    img = cv2.imread(path)
    if img is None:
        return {"error": f"No se pudo cargar la imagen: {path}"}

    h, w, c = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # OCR
    ocr_text = pytesseract.image_to_string(gray, lang='spa+eng')

    # Deteccion de bordes
    edges = cv2.Canny(gray, 100, 200)
    edge_pct = np.count_nonzero(edges) / (h * w) * 100

    # Deteccion de rostros
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    result = {
        "dimensiones": {"ancho": w, "alto": h, "canales": c},
        "ocr": ocr_text.strip(),
        "bordes": f"{edge_pct:.1f}%",
        "rostros_detectados": len(faces),
        "rostros": [{"x": int(x), "y": int(y), "ancho": int(wf), "alto": int(hf)}
                     for (x, y, wf, hf) in faces]
    }

    # Colores dominantes
    pixels = img.reshape(-1, 3)
    avg_color = np.mean(pixels, axis=0)
    result["color_dominante"] = {
        "B": int(avg_color[0]), "G": int(avg_color[1]), "R": int(avg_color[2])
    }

    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Uso: vision_analyze.py <ruta_imagen>"}))
        sys.exit(1)
    result = analyze_image(sys.argv[1])
    print(json.dumps(result, indent=2, ensure_ascii=False))
