import { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    Send,
    User,
    X,
    Bot
} from "lucide-react";

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [user, setUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const stompClientRef = useRef(null);
    const subscribedRef = useRef(false);
    const clientIdRef = useRef(Date.now().toString()); // ✅ đánh dấu client
    const [isWsConnected, setIsWsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/me", {
                credentials: "include"
            });
            if (!res.ok) return setUser(null);
            const data = await res.json();
            setUser(data.authenticated ? data : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-chat");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,

            onConnect: () => {
                console.log("✅ WS CONNECTED");
                setIsWsConnected(true);

                if (!subscribedRef.current) {
                    stompClient.subscribe("/topic/admin", (payload) => {
                        const msg = JSON.parse(payload.body);

                        // ✅ Chặn echo tin nhắn chính mình gửi ra
                        if (msg.sender === "customer") return;

                        const chat = {
                            id: msg.id || Date.now(),
                            from: msg.sender === "staff" ? "advisor" : "system",
                            text: msg.content
                        };

                        setMessages(prev => [...prev, chat]);
                        if (!open && chat.from === "advisor") {
                            setUnreadCount(c => c + 1);
                        }
                    });
                    subscribedRef.current = true;
                }
            },

            onDisconnect: () => {
                console.log("❌ WS DISCONNECTED");
                setIsWsConnected(false);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
        return () => stompClient.deactivate();
    }, []);

    const handleToggleChat = () => {
        if (!user) {
            window.location.href =
                "http://localhost:8080/oauth2/authorization/google?prompt=select_account";
            return;
        }

        setOpen(s => {
            const t = !s;
            if (t) setUnreadCount(0);
            return t;
        });
    };
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            setUser(null);
            setOpen(false); // đóng chat
            window.location.href = "http://localhost:5178"; // quay về Homepage
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    const selectMode = (m) => {
        setMode(m);
        setMessages([
            {
                id: `welcome-${m}`,
                from: m === "ai" ? "bot" : "advisor",
                text: m === "ai"
                    ? "Xin chào 👋 Em là trợ lý AI của Barber T&Q!"
                    : "Đang kết nối tư vấn viên 💈..."
            }
        ]);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const myMsg = {
            id: Date.now(),
            from: "user",
            text: input
        };

        setMessages(prev => [...prev, myMsg]);
        const messageText = input;
        setInput("");
        setLoading(true);

        if (mode === "advisor") {
            if (!stompClientRef.current?.connected) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    from: "system",
                    text: "⚠ Mất kết nối với tư vấn viên..."
                }]);
                setLoading(false);
                return;
            }

            // ✅ gửi thêm clientId để server broadcast trả về client khác thôi
            stompClientRef.current.publish({
                destination: "/app/sendMessage",
                body: JSON.stringify({
                    sender: "customer",
                    content: messageText,
                    clientId: clientIdRef.current
                })
            });

        } else {
            const res = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({ message: messageText })
            });

            const data = await res.json();
            setMessages(prev => [...prev, {
                id: Date.now(),
                from: "bot",
                text: data.reply
            }]);
        }

        setLoading(false);
    };

    return (
        <>
            <motion.button
                onClick={handleToggleChat}
                className="fixed bottom-6 right-6 w-16 h-16 bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
            >
                {open ? <X size={28} /> : <MessageCircle size={28} />}
                {!open && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                      {unreadCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
                        <div className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center relative">
                            <h3 className="font-bold">💬 Barber T&Q Support</h3>
                            {mode === "advisor" && (
                                <span className="text-xs font-bold">
            {isWsConnected ? "🟢 Online" : "🔴 Offline"}
        </span>
                            )}

                            {user && (
                                <div className="relative group cursor-pointer ml-3">
                                    <img
                                        src={user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Guest")}`}
                                        className="w-8 h-8 rounded-full border object-cover bg-white"
                                    />


                                    {/* Dropdown */}
                                    <div className="absolute top-10 right-0 bg-white text-black rounded-md shadow-lg py-2 w-32 hidden group-hover:block">
                                        <button
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        {!mode ? (
                            <div className="h-96 flex flex-col items-center justify-center gap-4">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-full flex gap-2"
                                        onClick={() => selectMode("ai")}>
                                    <Bot size={18} /> Chat AI
                                </button>
                                <button className="px-4 py-2 bg-orange-400 text-white rounded-full flex gap-2"
                                        onClick={() => selectMode("advisor")}>
                                    <User size={18} /> Tư vấn viên
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                                    {messages.map(m => (
                                        <div key={m.id}
                                             className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`px-3 py-2 rounded-xl max-w-[70%] shadow
                                                ${m.from === "user"
                                                ? "bg-orange-500 text-white"
                                                : "bg-white text-black"}`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && <p className="text-xs text-gray-500">Đang soạn...</p>}
                                    <div ref={messagesEndRef}></div>
                                </div>

                                <div className="p-3 border-t flex gap-2">
                                    <input
                                        className="flex-1 px-3 py-2 border rounded-full text-black bg-white"
                                        placeholder="Nhập tin nhắn..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    />
                                    <button onClick={sendMessage}
                                            className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
