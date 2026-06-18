import google.generativeai as genai


def generate_answer(prompt):

    try:

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception:

        return (
            "Gemini API rate limit reached. "
            "Please wait a minute and try again."
        )