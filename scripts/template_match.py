#!/usr/bin/env python3
"""
OpenCode Evolution - Template Matching
Busca un patron (template) dentro de una captura de pantalla
Devuelve coordenadas donde se encontro el patron
"""
import sys
import json
import cv2
import numpy as np

def find_template(screenshot_path, template_path, threshold=0.8):
    screen = cv2.imread(screenshot_path)
    template = cv2.imread(template_path)

    if screen is None:
        return {"error": f"No se pudo cargar screenshot: {screenshot_path}"}
    if template is None:
        return {"error": f"No se pudo cargar template: {template_path}"}

    sh, sw = screen.shape[:2]
    th, tw = template.shape[:2]

    if th > sh or tw > sw:
        return {"error": "El template es mas grande que la pantalla"}

    result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

    matches = []
    locations = np.where(result >= threshold)
    for pt in zip(*locations[::-1]):
        matches.append({
            "x": int(pt[0]),
            "y": int(pt[1]),
            "ancho": tw,
            "alto": th,
            "centro": {"x": int(pt[0] + tw/2), "y": int(pt[1] + th/2)},
            "confianza": float(result[pt[1], pt[0]])
        })

    return {
        "encontrado": len(matches) > 0,
        "coincidencias": len(matches),
        "mejor_coincidencia": {
            "x": int(max_loc[0]),
            "y": int(max_loc[1]),
            "ancho": tw,
            "alto": th,
            "centro": {"x": int(max_loc[0] + tw/2), "y": int(max_loc[1] + th/2)},
            "confianza": float(max_val)
        } if max_val > 0 else None,
        "coincidencias_detalle": matches[:10]
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso: template_match.py <screenshot> <template>"}))
        sys.exit(1)
    result = find_template(sys.argv[1], sys.argv[2])
    print(json.dumps(result, indent=2, ensure_ascii=False))
