from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(
    title="OpenCode Preview API Demo",
    description="API de demostración para el previsualizador profesional",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float

class Message(BaseModel):
    message: str
    status: str

# Base de datos en memoria
items_db: List[Item] = [
    Item(id=1, name="React", description="Biblioteca de UI", price=0.0),
    Item(id=2, name="Vue", description="Framework progresivo", price=0.0),
    Item(id=3, name="Angular", description="Framework completo", price=0.0),
]

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "🚀 OpenCode Preview API Demo",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "items": "/items",
            "health": "/health"
        },
        "features": [
            "✅ FastAPI con auto-documentación",
            "✅ CORS habilitado",
            "✅ Hot reload automático",
            "✅ Validación con Pydantic",
            "✅ Ejecutable en la nube"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "OpenCode Preview API",
        "preview_server": "running"
    }

@app.get("/items", response_model=List[Item])
async def get_items():
    """Obtener todos los items"""
    return items_db

@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """Obtener un item por ID"""
    for item in items_db:
        if item.id == item_id:
            return item
    return {"error": "Item no encontrado"}

@app.post("/items", response_model=Item)
async def create_item(item: Item):
    """Crear un nuevo item"""
    items_db.append(item)
    return item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: Item):
    """Actualizar un item existente"""
    for i, db_item in enumerate(items_db):
        if db_item.id == item_id:
            items_db[i] = item
            return item
    return {"error": "Item no encontrado"}

@app.delete("/items/{item_id}", response_model=Message)
async def delete_item(item_id: int):
    """Eliminar un item"""
    for i, item in enumerate(items_db):
        if item.id == item_id:
            items_db.pop(i)
            return Message(message="Item eliminado", status="success")
    return Message(message="Item no encontrado", status="error")

if __name__ == "__main__":
    print("🚀 Iniciando OpenCode Preview API Demo...")
    print("📡 Servidor disponible en: http://0.0.0.0:8000")
    print("📚 Documentación en: http://0.0.0.0:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
