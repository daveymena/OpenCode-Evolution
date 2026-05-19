# 🐍 OpenCode Preview - Python FastAPI Demo

API de demostración para el previsualizador profesional de OpenCode.

## 🚀 Características

- ✅ FastAPI con auto-documentación
- ✅ CORS habilitado para desarrollo
- ✅ Hot reload automático
- ✅ Validación de datos con Pydantic
- ✅ Endpoints RESTful completos

## 📡 Endpoints

- `GET /` - Información de la API
- `GET /health` - Health check
- `GET /items` - Listar todos los items
- `GET /items/{id}` - Obtener item por ID
- `POST /items` - Crear nuevo item
- `PUT /items/{id}` - Actualizar item
- `DELETE /items/{id}` - Eliminar item

## 🔧 Instalación

```bash
pip install -r requirements.txt
```

## ▶️ Ejecutar

```bash
python main.py
```

O con uvicorn directamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentación

Una vez iniciado, visita:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🎨 Uso con OpenCode Preview

1. Abre este proyecto en OpenCode
2. Haz clic en "Ejecutar Proyecto"
3. El previsualizador detectará automáticamente que es FastAPI
4. Instalará las dependencias
5. Iniciará el servidor en el puerto 8000
6. Podrás ver la API en el preview

¡Disfruta del previsualizador profesional! 🚀
