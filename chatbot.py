import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

while True:

    question = input("You: ")

    if question.lower() == "exit":
        break

    response = model.generate_content(
        question
    )

    print("AI:", response.text)