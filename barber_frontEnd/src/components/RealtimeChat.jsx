import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export default function RealtimeChat() {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = over(socket);

        stompClient.connect(
            {},
            () => {
                setConnected(true);
                console.log("✅ Connected to WebSocket");
                stompClient.subscribe("/topic/public", (msg) => {
                    const received = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, received]);
                });
            },
            (err) => console.error("❌ Connection error:", err)
        );

        return () => {
            if (stompClient && connected) {
                stompClient.disconnect(() => console.log("🔌 Disconnected"));
            }
        };
    }, [connected]);

    const sendMessage = () => {
        if (input.trim() && connected) {
            const message = { sender: "customer", content: input };
            stompClient.send("/app/chat.send", {}, JSON.stringify(message));
            setInput("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white border rounded-2xl shadow-lg p-3">
            <h3 className="font-semibold mb-2">💬 Barber T&Q Support</h3>
            <div className="h-64 overflow-y-auto border p-2 mb-2 rounded-lg">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`my-1 p-2 rounded-lg text-sm ${
                            m.sender === "customer"
                                ? "bg-amber-600 text-white text-right"
                                : "bg-gray-200 text-left"
                        }`}
                    >
                        {m.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border rounded-full px-3 py-1 text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="bg-amber-600 text-white px-3 rounded-full"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
