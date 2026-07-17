"""
The "brain" of the assistant: decides how to answer a question, then
checks Redis first in case we've already answered something very similar
in this exact conversation.
"""

import re

from backend.app.tools.calculator_tool import calculate
from backend.app.tools.web_search_tool import search_web
from backend.app.services.rag_service import retrieve_context
from backend.app.services.llm_service import generate_answer
from backend.app.services.chat_memory import add_message, get_history
from backend.app.services.redis_service import redis_client
from backend.app.services.document_finder import find_document
from backend.app.services.summary_service import summarize_document

# Only matches things that look like a pure math expression, e.g. "12 * 4 + 1".
# This is stricter than "contains a + - * / symbol", which used to
# misfire on ordinary questions like "what's a well-rounded resume?".
MATH_EXPRESSION = re.compile(r"^[\d\s.()+\-*/]+$")

WEB_SEARCH_KEYWORDS = ["latest", "today", "current", "news", "version", "release", "update"]
SUMMARY_KEYWORDS = ["summarize", "summary"]


def _normalize(question):
    """Turns "What's 2+2?" and "what is 2 + 2" into the same cache key,
    so small wording differences still count as a cache hit."""

    text = question.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _answer_question(question, session_id, chat_id):
    # 1. Pure math expression -> calculator tool
    if MATH_EXPRESSION.match(question.strip()):
        return calculate(question)

    # 2. "summarize my resume.pdf" -> find that document and summarize it
    if any(word in question.lower() for word in SUMMARY_KEYWORDS):
        doc_id = find_document(question)
        if doc_id:
            return summarize_document(doc_id)

    # 3. Words like "latest"/"today"/"current" clearly need fresh info -> web search
    if any(word in question.lower() for word in WEB_SEARCH_KEYWORDS):
        return search_web(question)

    # 4. Otherwise -> try answering from the uploaded documents (RAG)
    result = retrieve_context(question)
    context = result["context"]
    sources = result["sources"]

    # If nothing relevant was found in the documents, this question is
    # probably not about the uploaded files at all -> search the web instead.
    if not sources:
        return search_web(question)

    history = get_history(session_id, chat_id)

    prompt = f"""
Previous Conversation:
{history}

Context:
{context}

Question:
{question}
"""

    answer = generate_answer(prompt)

    if sources:
        answer += "\n\n Sources:\n"
        for source in sources:
            answer += f"• {source}\n"

    return answer


def run_agent(question, session_id, chat_id):
    cache_key = f"answer:{session_id}:{chat_id}:{_normalize(question)}"

    cached_answer = redis_client.get(cache_key)
    if cached_answer:
        return cached_answer

    answer = _answer_question(question, session_id, chat_id)

    add_message(session_id, chat_id, "User", question)
    add_message(session_id, chat_id, "Assistant", answer)
    redis_client.set(cache_key, answer)

    return answer