from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.api_v1 import api_router
from app.db.redis import init_redis, close_redis
from app.core.exceptions import AppException
from app.core.logging import logger
from fastapi.responses import JSONResponse
from fastapi import Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Sahu Mart backend...")
    await init_redis()
    logger.info("Redis connected")
    logger.info("Database schema managed by Alembic")
    yield
    logger.info("Shutting down Sahu Mart backend...")
    await close_redis()
    logger.info("Redis connection closed")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.DEBUG,
        lifespan=lifespan,
    )

    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                },
            },
        )

    return app


app = create_app()
