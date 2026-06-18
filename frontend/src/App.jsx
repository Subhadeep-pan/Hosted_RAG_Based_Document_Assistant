import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

import { askQuestion } from "./api/chatApi";
import { uploadFile } from "./api/uploadApi";
import { resetProject } from "./api/resetApi";
import { getSummary } from "./api/summaryApi";
import {
  FaUser,
  FaRobot,
  FaFileAlt,
  FaUpload,
  FaPaperPlane,
  FaTrash
} from "react-icons/fa";

function App() {

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "theme"
      ) === "dark"
    );

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [
    chatHistory,
    setChatHistory
  ] = useState([]);

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [documents, setDocuments] =
    useState([]);

  const chatEndRef =
    useRef(null);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({

    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"]
    },

    onDrop: (
      acceptedFiles
    ) => {

      setSelectedFiles(
        acceptedFiles
      );

    }
  });

  useEffect(() => {

    chatEndRef.current?.
      scrollIntoView({
        behavior: "smooth"
      });

  }, [chatHistory]);

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode
        ? "dark"
        : "light"
    );

  }, [darkMode]);

  const sendQuestion = async () => {

    if (!question.trim())
      return;

    try {

      setLoading(
        true
      );

      const result =
        await askQuestion(
          question
        );

      setChatHistory(
        prev => [
          ...prev,
          {
            role: "user",
            text: question
          },
          {
            role: "assistant",
            text: result.answer
          }
        ]
      );

      setQuestion("");

      setLoading(
        false
      );

    } catch {

      setLoading(
        false
      );

      setChatHistory(
        prev => [
          ...prev,
          {
            role: "assistant",
            text:
              "Error connecting to backend."
          }
        ]
      );
    }
  };

  const handleUpload = async () => {

    if (
      selectedFiles.length === 0
    ) {

      setUploadMessage(
        "Please select a file."
      );

      return;
    }

    try {

      const result =
        await uploadFile(
          selectedFiles
        );

      setUploadMessage(
        result.message
      );

      setDocuments(
        (prev) => [
          ...prev,
          ...selectedFiles.map(
            file => file.name
          )
        ]
      );

      setSelectedFiles(
        []
      );

    } catch (error) {

      console.error(error);

      setUploadMessage(
        "Upload failed."
      );
    }
  };

  const handleReset = async () => {

    try {

      const result =
        await resetProject();

      setDocuments([]);

      setChatHistory([]);

      setQuestion("");

      setUploadMessage(
        result.message
      );

    } catch (error) {

      console.error(error);

      setUploadMessage(
        "Reset failed."
      );
    }
  };

  const handleSummary =
    async (docId) => {

      try {

        const result =
          await getSummary(
            docId
          );

        setChatHistory(
          prev => [
            ...prev,
            {
              role: "assistant",
              text: result.summary
            }
          ]
        );

      } catch (error) {

        console.error(error);

        setAnswer(
          "Failed to load summary."
        );
      }
    };

  return (

    <div
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-slate-100"
          : "min-h-screen bg-slate-50 text-slate-900"
      }
    >

      {/* Header */}

      <header
        className={
          darkMode
            ? "border-b border-slate-800 sticky top-0 backdrop-blur bg-slate-950/80 z-50"
            : "border-b border-slate-200 sticky top-0 backdrop-blur bg-white/80 z-50"
        }
      >

        <div className="px-6 py-4 flex justify-between items-center">

          <div>

            <h1
              className="
                text-3xl
                font-bold
                bg-gradient-to-r
                from-sky-500
                to-indigo-500
                bg-clip-text
                text-transparent
              "
            >
              AI Assistant
            </h1>

            <p className="text-slate-400">
              RAG Powered Document Intelligence
            </p>

          </div>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-2xl
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              transition
              shadow-sm
              hover:shadow-md
            "
          >
            {darkMode
              ? "☀️ Light"
              : "🌙 Dark"}
          </button>

        </div>

      </header>

      <div className="flex">

        {/* Sidebar */}

        <aside
          className={
            darkMode
              ? `
                w-80
                min-h-screen
                border-r
                border-slate-800
                p-6
              `
              : `
                w-80
                min-h-screen
                border-r
                border-slate-200
                bg-white
                p-6
              `
          }
        >

          {/* Upload Card */}

          <div
            className={
              darkMode
                ? `
                  bg-slate-900
                  rounded-2xl
                  p-5
                  border
                  border-slate-800
                `
                : `
                  bg-white
                  rounded-2xl
                  p-5
                  border
                  border-slate-200
                  shadow-sm
                `
            }
          >

            <h2
              className="
                text-lg
                font-semibold
                mb-4
              "
            >
              Upload Document
            </h2>

            {/* Dropzone */}

            <div
              {...getRootProps()}
              className={`
                border-2
                border-dashed
                rounded-2xl
                p-8
                text-center
                cursor-pointer
                transition
                mb-4
                ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-sky-300 hover:bg-sky-50"
                }
              `}
            >

              <input
                {...getInputProps()}
              />

              <div className="text-5xl mb-3">
                📎
              </div>

              <p className="font-semibold">
                Drag & Drop Files
              </p>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-2
                "
              >
                PDF • DOCX • TXT
              </p>

            </div>

            {/* Selected Files List */}

            {
              selectedFiles.length > 0 && (

                <div className="mb-4">

                  {
                    selectedFiles.map(
                      (
                        file,
                        index
                      ) => (

                        <div
                          key={index}
                          className={`
                            px-3
                            py-2
                            rounded-xl
                            mb-2
                            ${
                              darkMode
                                ? "bg-slate-800"
                                : "bg-sky-100 text-sky-700"
                            }
                          `}
                        >

                          📄 {file.name}

                        </div>

                      )
                    )
                  }

                </div>

              )
            }

            <button
              onClick={handleUpload}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                bg-gradient-to-r
                from-sky-500
                to-cyan-500
                hover:from-sky-600
                hover:to-cyan-600
                text-white
                transition
                py-3
                rounded-2xl
                font-medium
                shadow-md
                hover:shadow-md
              "
            >
              <FaUpload />
              Upload
            </button>

            <p
              className="
                mt-3
                text-sm
                text-emerald-400
              "
            >
              {uploadMessage}
            </p>

          </div>

          {/* Documents List */}

          <div className="mt-10">

            <h2
              className="
                text-lg
                font-semibold
                mb-4
              "
            >
              Documents
            </h2>

            {
              documents.length === 0
                ? (

                  <div
                    className="
                      text-center
                      py-8
                    "
                  >

                    <div className="text-5xl mb-3">
                      🤖
                    </div>

                    <p className="text-slate-500">
                      No documents uploaded yet
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        mt-2
                      "
                    >
                      Upload PDFs, DOCX or TXT files
                    </p>

                  </div>

                )
                : (

                  <ul className="space-y-3">

                    {
                      documents.map(
                        (
                          document,
                          index
                        ) => (

                          <li
                            key={index}
                            onClick={() =>
                              handleSummary(
                                document
                              )
                            }
                            className={`
                              flex
                              items-center
                              justify-between
                              px-4
                              py-3
                              rounded-2xl
                              cursor-pointer
                              transition-all
                              duration-200
                              hover:scale-[1.02]
                              ${
                                darkMode
                                  ? `
                                    bg-slate-800
                                    border
                                    border-slate-700
                                    hover:border-sky-500
                                  `
                                  : `
                                    bg-white
                                    border
                                    border-slate-200
                                    hover:border-sky-400
                                    shadow-sm
                                  `
                              }
                            `}
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                                overflow-hidden
                              "
                            >

                              <div className="text-sky-500">
                                📄
                              </div>

                              <span
                                className="
                                  truncate
                                  text-sm
                                  font-medium
                                "
                              >
                                {document}
                              </span>

                            </div>

                            <span
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              Summary
                            </span>

                          </li>

                        )
                      )
                    }

                  </ul>

                )
            }

          </div>

          {/* Reset Button */}

          <button
            onClick={handleReset}
            className={`
              mt-10
              w-full
              flex
              items-center
              justify-center
              gap-2
              transition
              py-3
              rounded-2xl
              font-medium
              shadow-sm
              hover:shadow-md
              ${
                darkMode
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
          >
            <FaTrash />
            Reset Project
          </button>

        </aside>

        {/* Main */}

        <main
          className="
            flex-1
            p-6
          "
        >

          <div
            className={
              darkMode
                ? `
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-2xl
                  p-6
                  h-[550px]
                  overflow-y-auto
                `
                : `
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-6
                  h-[550px]
                  overflow-y-auto
                  shadow-sm
                `
            }
          >

            <h2
              className="
                text-emerald-400
                font-semibold
                mb-4
              "
            >
              AI Response / Summary
            </h2>

            {/* Welcome Screen */}

            {
              chatHistory.length === 0 && (

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    h-full
                    text-center
                  "
                >

                  <div className="text-6xl mb-4">
                    🤖
                  </div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      mb-2
                    "
                  >
                    Welcome to AI Assistant
                  </h2>

                  <p className="text-slate-500">
                    Upload documents and ask questions
                  </p>

                </div>

              )
            }

            {/* Chat History */}

            {
              chatHistory.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`
                      flex
                      mb-4
                      ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    <div
                      className={`
                        max-w-[75%]
                        rounded-2xl
                        px-4
                        py-3
                        shadow-md
                        ${
                          msg.role === "user"
                            ? "bg-indigo-500"
                            : darkMode
                              ? "bg-slate-800"
                              : "bg-white border border-slate-200"
                        }
                      `}
                    >

                      <div className="flex items-center gap-2 mb-2">

                        {
                          msg.role === "user"
                            ? <FaUser />
                            : <FaRobot />
                        }

                        <span className="font-semibold">

                          {
                            msg.role === "user"
                              ? "You"
                              : "AI"
                          }

                        </span>

                      </div>

                      <pre className="whitespace-pre-wrap">

                        {msg.text}

                      </pre>

                    </div>

                  </div>

                )
              )
            }

            {/* Typing Indicator */}

            {
              loading && (

                <div
                  className="
                    flex
                    justify-start
                    mb-4
                  "
                >

                  <div
                    className="
                      px-4
                      py-3
                      rounded-2xl
                      bg-slate-200
                      text-slate-700
                    "
                  >

                    🤖 AI is thinking...

                  </div>

                </div>

              )
            }

            <div ref={chatEndRef}></div>

          </div>

          <div
            className="
              flex
              gap-3
              mt-4
            "
          >

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendQuestion()
              }
              placeholder="Ask a question about your documents..."
              className={
                darkMode
                  ? `
                    flex-1
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-4
                    outline-none
                    focus:ring-2
                    focus:ring-sky-500
                  `
                  : `
                    flex-1
                    bg-white
                    border
                    border-slate-300
                    rounded-2xl
                    p-4
                    outline-none
                    shadow-sm
                    focus:ring-2
                    focus:ring-sky-500
                  `
              }
            />

            <button
              onClick={sendQuestion}
              className="
                flex
                items-center
                gap-2
                bg-indigo-500
                hover:bg-indigo-600
                text-white
                px-8
                rounded-2xl
                font-medium
                transition
                shadow-sm
                hover:shadow-md
              "
            >
              <FaPaperPlane />
              Send
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;