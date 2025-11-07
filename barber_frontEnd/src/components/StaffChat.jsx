// AdminChat.jsx (Admin panel chat widget) — giữ nguyên UI, chỉ sửa logic WS
import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MessageCircle, Send, X, RotateCcw } from "lucide-react";

export default function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(true); // admin opens on admin page
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef(null);
    const stompClientRef = useRef(null);
    const subscribedRef = useRef(false);

    // adminId for debug
    const adminIdRef = useRef(`admin-${Date.now()}`);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // connect admin to same broker/topic
        const socket = new SockJS("http://localhost:8080/ws-chat");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,
            onConnect: () => {
                console.log("✅ Admin WS CONNECTED");
                setIsConnected(true);

                if (!subscribedRef.current) {
                    // subscribe to same /topic/admin to receive all messages
                    stompClient.subscribe("/topic/admin", (payload) => {
                        try {
                            const msg = JSON.parse(payload.body);
                            // map to admin UI structure (msg.sender expected)
                            const uiMsg = {
                                id: msg.id || Date.now(),
                                sender: msg.sender,
                                content: msg.content || msg.text
                            };

                            setMessages(prev => [...prev, uiMsg]);

                            if (!isOpen) setUnreadCount(u => u + 1);
                        } catch (e) {
                            console.error("Invalid admin payload", e);
                        }
                    });

                    subscribedRef.current = true;
                }
            },
            onStompError: (frame) => {
                console.error("STOMP error", frame);
            },
            onDisconnect: () => {
                console.log("Admin WS DISCONNECTED");
                setIsConnected(false);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            try {
                stompClient.deactivate();
            } catch (e) { /* ignore */ }
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        if (!(stompClientRef.current && stompClientRef.current.active)) {
            setMessages(prev => [...prev, { id: Date.now(), sender: "system", content: "Chưa kết nối WS" }]);
            return;
        }
        const payload = {
            id: Date.now(),
            clientId: adminIdRef.current,
            sender: "staff",
            content: input.trim()
        };

        try {
            stompClientRef.current.publish({
                destination: "/app/sendMessage",
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error("Admin publish error", e);
        }
        setInput("");
    };

    const toggleChat = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) setUnreadCount(0);
    };

    const resetChat = () => setMessages([]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Nút chat nổi */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="relative bg-orange-500 hover:bg-orange-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
                >
                    <MessageCircle size={26} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
                    )}
                </button>
            )}

            {/* Khung chat */}
            <div className={`w-96 bg-white border border-gray-300 rounded-xl shadow-xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-20 opacity-0"}`}>
                <div className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center">
                    <h3 className="font-bold text-lg">💬 Chat Admin</h3>
                    <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isConnected ? "text-green-600" : "text-red-500"}`}>
              {isConnected ? "Đã kết nối" : "Mất kết nối"}
            </span>
                        <button onClick={toggleChat}><X size={20} /></button>
                        <button onClick={resetChat}><RotateCcw size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-2 bg-gray-50 overflow-y-auto max-h-96">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === "staff" ? "justify-end" : "justify-start"}`}>
                            <div className={`px-3 py-2 rounded-xl max-w-[70%] ${m.sender === "staff" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center p-3 border-t bg-white">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-3 py-2 border rounded-full text-black focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!isConnected}
                        className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${isConnected ? "bg-orange-500 hover:shadow-lg text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
