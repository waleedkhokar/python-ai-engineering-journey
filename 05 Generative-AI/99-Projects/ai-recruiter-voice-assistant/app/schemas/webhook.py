from typing import Any
from pydantic import BaseModel


class VapiWebhookRequest(BaseModel):
    message: dict[str, Any]