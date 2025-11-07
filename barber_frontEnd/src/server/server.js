import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load .env
dotenv.config();
console.log("🔑 API Key:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "❌ Missing");

const app = express();

// CORS cho test trực tiếp (không dùng proxy)
app.use(cors());

app.use(bodyParser.json());

// OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Test endpoint
app.get("/", (req, res) => {
    res.send("Server running ✅");
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    console.log("📩 Nhận request từ client:", req.body);

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ reply: "Message trống!" });
    }

    try {
        console.log("⏳ Gọi OpenAI với message:", message);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // thử model ổn định trước
            messages: [
                { role: "system", content: `
Bạn là chatbot tư vấn của tiệm tóc Barber T&Q.
Luôn nói chuyện thân thiện, xưng "em", gọi khách là "anh".
Khi khách hỏi giá, hãy nói: cắt 100k, uốn 300k, nhuộm 400k, combo 500k.
Khi khách hỏi lịch, gợi ý các khung giờ 10h, 14h, 17h.
Nếu khách hỏi barber giỏi, nhắc đến Dương Quốc Hoàng.
`},
                { role: "user", content: message },
            ],
        });

        console.log("Raw completion:", completion);

        const reply = completion.choices?.[0]?.message?.content || "Em chưa rõ ý anh lắm ạ 💇‍♂️";
        console.log("🤖 Reply:", reply);

        res.json({ reply });
    } catch (err) {
        console.error("❌ Lỗi OpenAI:", err);
        res.status(500).json({ reply: "Xin lỗi, em đang bận. Anh thử lại sau nhé 💈" });
    }
});

// Start server
app.listen(5000, () => console.log("✅ Server chạy tại http://localhost:5000"));
