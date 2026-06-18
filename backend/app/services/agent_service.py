from backend.app.tools.calculator_tool import (
    calculate
)

from backend.app.tools.web_search_tool import (
    search_web
)

from backend.app.services.rag_service import (
    retrieve_context
)

from backend.app.services.llm_service import (
    generate_answer
)

from backend.app.services.chat_memory import (
    add_message,
    get_history
)

from backend.app.services.redis_service import (
    redis_client
)


def run_agent(question):

    cache_key = (
        f"answer:{question.lower()}"
    )

    cached_answer = redis_client.get(
        cache_key
    )

    if cached_answer:

        print(
            "✅ CACHE HIT"
        )

        return cached_answer

    print(
        "❌ CACHE MISS"
    )

    math_symbols = [
        "+",
        "-",
        "*",
        "/"
    ]

    if any(
        symbol in question
        for symbol in math_symbols
    ):

        return calculate(
            question
        )

    web_keywords = [
        "latest",
        "today",
        "current",
        "news",
        "version",
        "release",
        "update"
    ]

    if any(
        word in question.lower()
        for word in web_keywords
    ):

        return search_web(
            question
        )

    result = retrieve_context(
        question
    )

    context = result[
        "context"
    ]

    sources = result[
        "sources"
    ]

    history = get_history()

    prompt = f"""
Previous Conversation:
{history}

Context:
{context}

Question:
{question}
"""

    answer = generate_answer(
        prompt
    )

    if sources:

        answer += (
            "\n\n📄 Sources:\n"
        )

        for source in sources:

            answer += (
                f"• {source}\n"
            )

    add_message(
        "User",
        question
    )

    add_message(
        "Assistant",
        answer
    )

    redis_client.set(
        cache_key,
        answer
    )

    return answer