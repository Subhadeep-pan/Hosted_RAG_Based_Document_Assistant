import google.generativeai as genai
from backend.app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)


def generate_answer(prompt):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return response.text

    except Exception:
        return (
            "Gemini API rate limit reached. "
            "Please wait a minute and try again."
        )
