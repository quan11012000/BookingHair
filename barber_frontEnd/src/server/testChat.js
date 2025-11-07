async function testChat() {
    try {
        const res = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "hi" }),
        });

        const data = await res.json();
        console.log("✅ Reply từ server:", data);
    } catch (err) {
        console.error("❌ Lỗi:", err);
    }
}

testChat();
