import { useEffect, useState } from "react";

export default function InteractModal() {
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  // Open modal on custom event
  useEffect(() => {
    const handler = (e) => {
      setLead(e.detail);
      setChat([]);
      setInput("");
      setOpen(true);
    };
    window.addEventListener("open-interact", handler);
    return () => window.removeEventListener("open-interact", handler);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setChat((prev) => [...prev, userMsg]);

    const res = await fetch("http://localhost:8000/interact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: lead.email, query: input }),
    });
    const data = await res.json();
    setChat((prev) => [...prev, userMsg, { sender: "ai", text: data.response }]);
    setInput("");
  };

  if (!open || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl w-full max-w-md shadow-xl p-6 transition-all text-gray-800 dark:text-gray-100 relative animate-fade-in">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-400 dark:text-gray-200 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full w-9 h-9 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 className="text-lg font-bold text-primary mb-2">
          🤖 Interacting with {lead.name}
        </h3>

        <div className="h-64 overflow-y-auto space-y-2 border p-3 rounded-md mb-4 bg-gray-50">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`text-sm p-2 rounded-md max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-100 text-right ml-auto"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border rounded-md p-2"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
