import api from "./api";

export const askQuestion = async (question, chatId) => {
  const response = await api.get("/ask", {
    params: { question, chat_id: chatId },
  });

  return response.data;
};

// Streams the answer back word-by-word, like ChatGPT "typing".
// onChunk is called every time a new piece of text arrives.
export const askQuestionStream = async (question, chatId, onChunk) => {
  const baseURL = api.defaults.baseURL;
  const sessionId = localStorage.getItem("session_id");

  const url = `${baseURL}/ask/stream?question=${encodeURIComponent(question)}&chat_id=${chatId}`;

  const response = await fetch(url, {
    headers: { "X-Session-Id": sessionId },
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
};