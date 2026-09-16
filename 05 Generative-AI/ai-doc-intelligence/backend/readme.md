python -c "
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print('Error: GEMINI_API_KEY not found in .env file')
else:
    client = genai.Client(api_key=api_key)
    print('Available models for your API key:')
    for model in client.models.list():
        print(f'- {model.name}')
"