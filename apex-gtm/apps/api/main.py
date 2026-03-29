"""APEX GTM — FastAPI Backend"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routers import agents, integrations, pipeline, analytics

app = FastAPI(
    title="APEX GTM API",
    description="Agentic AI GTM & Revenue Intelligence Platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://apexgtm.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrations"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Pipeline"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
