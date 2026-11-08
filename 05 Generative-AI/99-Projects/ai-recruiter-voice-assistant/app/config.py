from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str

    vapi_api_key: str
    vapi_squad_id: str

    model_config = SettingsConfigDict(
        env_file = ".env",
        env_file_encoding = "utf_8",
    )

settings = Settings()