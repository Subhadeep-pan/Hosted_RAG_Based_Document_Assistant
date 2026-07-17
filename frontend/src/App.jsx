import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaRobot, FaPaperPlane, FaPlus, FaFileAlt, FaTrash, FaComment, FaPen } from "react-icons/fa";

import { askQuestionStream } from "./api/chatApi";
import { uploadFile } from "./api/uploadApi";
import { resetProject } from "./api/resetApi";
import { getSummary } from "./api/summaryApi";
import { getChatHistory } from "./api/historyApi";
import { getChats, createChat, deleteChat, renameChat } from "./api/chatsApi";
import { getDocuments, deleteDocument } from "./api/docsApi";

const LAST_CHAT_KEY = "last_chat_id";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  // Replaces window.confirm/window.prompt with in-app modals - native
  // browser dialogs can sometimes leave the page unresponsive to clicks
  // afterward, plus a custom modal looks more polished.
  const [confirmState, setConfirmState] = useState(null); // { message, onConfirm }
  const [renameState, setRenameState] = useState(null); // { chat, value }

  const chatEndRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: (files) => handleUpload(files),
  });

  const openChat = async (chatId) => {
    setCurrentChatId(chatId);
    localStorage.setItem(LAST_CHAT_KEY, chatId);

    const data = await getChatHistory(chatId).catch(() => ({ history: [] }));
    setChatHistory(data.history || []);
  };

  // On first load: fetch the list of chats for this browser. If none
  // exist yet, create one. Otherwise re-open whichever chat was open
  // last time (falling back to the most recent one).
  useEffect(() => {
    (async () => {
      const existingChats = await getChats().catch(() => []);

      if (existingChats.length === 0) {
        const chatId = await createChat();
        setChats([{ chat_id: chatId, title: "New Chat", created_at: Date.now() / 1000 }]);
        openChat(chatId);
        return;
      }

      setChats(existingChats);

      const lastChatId = localStorage.getItem(LAST_CHAT_KEY);
      const stillExists = existingChats.some((chat) => chat.chat_id === lastChatId);

      openChat(stillExists ? lastChatId : existingChats[0].chat_id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDocuments().then(setDocuments).catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleNewChat = async () => {
    // If the chat that is already open is still empty, just keep using
    // it instead of piling up extra "New Chat" entries.
    const alreadyOnEmptyChat = currentChatId && chatHistory.length === 0;
    if (alreadyOnEmptyChat) return;

    const chatId = await createChat();
    setChats((prev) => [{ chat_id: chatId, title: "New Chat", created_at: Date.now() / 1000 }, ...prev]);
    setCurrentChatId(chatId);
    localStorage.setItem(LAST_CHAT_KEY, chatId);
    setChatHistory([]);
  };

  const handleDeleteChat = (chatId, event) => {
    event.stopPropagation();

    setConfirmState({
      message: "Delete this chat? This cannot be undone.",
      onConfirm: async () => {
        await deleteChat(chatId);

        const remainingChats = chats.filter((chat) => chat.chat_id !== chatId);
        setChats(remainingChats);

        if (chatId !== currentChatId) return;

        if (remainingChats.length > 0) {
          openChat(remainingChats[0].chat_id);
        } else {
          handleNewChat();
        }
      },
    });
  };

  const handleRenameChat = (chat, event) => {
    event.stopPropagation();
    setRenameState({ chat, value: chat.title });
  };

  const submitRename = async () => {
    const { chat, value } = renameState;

    if (value.trim()) {
      await renameChat(chat.chat_id, value.trim());

      setChats((prev) =>
        prev.map((item) =>
          item.chat_id === chat.chat_id ? { ...item, title: value.trim() } : item
        )
      );
    }

    setRenameState(null);
  };

  const sendQuestion = async () => {
    if (!question.trim() || loading || !currentChatId) return;

    const userMessage = question;
    setQuestion("");
    setChatHistory((prev) => [...prev, { role: "User", text: userMessage }]);
    setChatHistory((prev) => [...prev, { role: "Assistant", text: "" }]);
    setLoading(true);

    try {
      await askQuestionStream(userMessage, currentChatId, (chunk) => {
        // Add each new chunk onto the last message (the assistant's reply).
        setChatHistory((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: updated[lastIndex].text + chunk,
          };
          return updated;
        });
      });

      // The backend may have auto-generated a real title for this chat
      // now that it has its first message - refresh the sidebar to show it.
      const freshChats = await getChats().catch(() => null);
      if (freshChats) setChats(freshChats);
    } catch {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "Assistant",
          text: "Error connecting to the backend.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      const result = await uploadFile(files);
      setUploadMessage(result.message);

      const freshDocuments = await getDocuments();
      setDocuments(freshDocuments);
    } catch (error) {
      console.error(error);
      setUploadMessage("Upload failed.");
    }
  };

  const handleDeleteDocument = (docId, event) => {
    event.stopPropagation();

    setConfirmState({
      message: `Delete "${docId}"? This cannot be undone.`,
      onConfirm: async () => {
        await deleteDocument(docId);
        setDocuments((prev) => prev.filter((doc) => doc !== docId));
      },
    });
  };

  // "Reset Project" only clears uploaded documents - it does NOT touch
  // any chat conversations. Use "New Chat" / the trash icon for those.
  const handleResetDocuments = async () => {
    try {
      const result = await resetProject();
      setDocuments([]);
      setUploadMessage(result.message);
    } catch (error) {
      console.error(error);
      setUploadMessage("Reset failed.");
    }
  };

  const handleSummary = async (docId) => {
    if (!currentChatId) return;

    setChatHistory((prev) => [...prev, { role: "User", text: `Summarize ${docId}` }]);
    setLoading(true);

    try {
      const result = await getSummary(docId);
      setChatHistory((prev) => [...prev, { role: "Assistant", text: result.summary }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { role: "Assistant", text: "Failed to load summary." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const bg = darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  const panel = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

  return (
    <div className={`flex h-screen ${bg}`}>
      {/* Sidebar */}
      <aside className={`w-72 flex flex-col border-r ${panel} p-4`}>
        <h1 className="text-lg font-semibold mb-4">
          AI Resume Assistant
        </h1>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 justify-center w-full py-2 rounded-xl border border-slate-500/30 hover:bg-slate-500/10 transition mb-3 text-sm font-medium"
        >
          <FaPlus /> New Chat
        </button>

        {/* Chat list - this is the main "ChatGPT style" chat history */}
        <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-2">Chats</h2>
        <div className="flex-1 min-h-[8rem] overflow-y-auto mb-4">
          {chats.length === 0 && (
            <p className="text-sm text-slate-500">No chats yet.</p>
          )}

          <ul className="space-y-1">
            {chats.map((chat) => (
              <li
                key={chat.chat_id}
                onClick={() => openChat(chat.chat_id)}
                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                  chat.chat_id === currentChatId
                    ? darkMode
                      ? "bg-slate-800"
                      : "bg-slate-200"
                    : darkMode
                    ? "hover:bg-slate-800"
                    : "hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FaComment className="text-slate-400 shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </span>

                <span className="opacity-0 group-hover:opacity-100 flex items-center gap-2 shrink-0">
                  <button
                    onClick={(event) => handleRenameChat(chat, event)}
                    className="text-slate-400 hover:text-indigo-600 transition"
                    title="Rename chat"
                  >
                    <FaPen size={12} />
                  </button>

                  <button
                    onClick={(event) => handleDeleteChat(chat.chat_id, event)}
                    className="text-slate-400 hover:text-red-500 transition"
                    title="Delete chat"
                  >
                    <FaTrash size={12} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-4 text-center text-sm cursor-pointer transition mb-4 ${
            isDragActive ? "border-indigo-600 bg-indigo-600/10" : "border-slate-500/30 hover:bg-slate-500/5"
          }`}
        >
          <input {...getInputProps()} />
          Drop files or click to upload
          <div className="text-xs text-slate-400 mt-1">PDF • DOCX • TXT</div>
        </div>

        {uploadMessage && <p className="text-xs text-slate-500 mb-3">{uploadMessage}</p>}

        {/* Document list */}
        <div className="max-h-40 overflow-y-auto">
          <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-2">Documents</h2>

          {documents.length === 0 && (
            <p className="text-sm text-slate-500">No documents uploaded yet.</p>
          )}

          <ul className="space-y-1">
            {documents.map((doc, index) => (
              <li
                key={index}
                onClick={() => handleSummary(doc)}
                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer truncate transition ${
                  darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
                }`}
                title={`Summarize ${doc}`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FaFileAlt className="text-indigo-600 shrink-0" />
                  <span className="truncate">{doc}</span>
                </span>

                <button
                  onClick={(event) => handleDeleteDocument(doc, event)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition shrink-0"
                  title="Delete this document"
                >
                  <FaTrash size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleResetDocuments}
          className="mt-4 flex items-center gap-2 justify-center text-sm py-2 rounded-xl hover:bg-slate-500/10 transition"
          title="Delete all uploaded documents (keeps your chats)"
        >
          <FaTrash /> Reset Documents
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-2 text-sm py-2 rounded-xl hover:bg-slate-500/10 transition"
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-24">
                <FaRobot className="text-4xl text-indigo-600 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Welcome to AI Resume Assistant</h2>
                <p className="text-slate-500">Upload documents and ask questions to get started.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
                    {msg.role === "User" ? (
                      "You"
                    ) : (
                      <>
                        <FaRobot className="text-indigo-600" /> Assistant
                      </>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
              ))
            )}

            {loading && chatHistory[chatHistory.length - 1]?.text === "" && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <FaRobot className="text-indigo-600" /> Thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className={`border-t ${panel} p-4`}>
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
              placeholder="Ask a question about your documents..."
              className={`flex-1 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 border ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300"
              }`}
            />
            <button
              onClick={sendQuestion}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 rounded-2xl font-medium transition"
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      </main>

      {/* Confirm delete modal */}
      {confirmState && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-80 border ${panel}`}>
            <p className="mb-4 text-sm">{confirmState.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmState(null)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-slate-500/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmState.onConfirm();
                  setConfirmState(null);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename chat modal */}
      {renameState && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-80 border ${panel}`}>
            <p className="mb-3 text-sm font-medium">Rename chat</p>
            <input
              autoFocus
              value={renameState.value}
              onChange={(e) => setRenameState({ ...renameState, value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
              className={`w-full rounded-lg px-3 py-2 mb-4 border outline-none focus:ring-2 focus:ring-indigo-600 ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
              }`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRenameState(null)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-slate-500/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRename}
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
