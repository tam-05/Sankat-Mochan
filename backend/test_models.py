import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models = list(client.models.list())

print(f"Total models: {len(models)}")
print()

for model in models:
    print(model.name)