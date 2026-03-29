"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "APEX GTM"
    environment: str = "development"
    debug: bool = True

    # Claude / Anthropic
    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-6"
    claude_opus_model: str = "claude-opus-4-6"

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # Integrations
    apollo_api_key: str = ""
    hubspot_access_token: str = ""
    linkedin_access_token: str = ""
    fireflies_api_key: str = ""

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
