from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import public_router, cart_router, orders_router, admin_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend for TBM Power Solar E-commerce Store",
    version="2.0.0",
)

# CORS configuration (allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory so images can be served statically (if writable)
import os
try:
    os.makedirs("uploads/products", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except OSError:
    pass

# Include Routers
app.include_router(public_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(admin_router)

@app.get("/", tags=["Health Check"])
async def root():
    return {"status": "ok", "app": settings.APP_NAME, "docs": "/docs"}

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

