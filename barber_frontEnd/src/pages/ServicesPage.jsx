import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot.jsx";

export default function ServicesPage() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/services");
            setServices(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách dịch vụ:", err);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 text-gray-900">
            <Header />

            {/* Services preview */}
            <section className="py-16 md:py-24 px-6 md:px-20 bg-white">
                <h3 className="text-3xl font-bold text-center text-amber-800">
                    Dịch vụ cắt tóc chuyên nghiệp
                </h3>
                <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
                    Chúng tôi mang đến trọn bộ dịch vụ chăm sóc tóc và tạo kiểu dành riêng cho
                    phái mạnh – từ cắt, uốn, nhuộm đến combo thư giãn cao cấp.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.length > 0 ? (
                        services.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                            >
                                <img
                                    src={
                                        s.image
                                            ? `http://localhost:8080${s.image}`
                                            : "https://placehold.co/400x250?text=No+Image"
                                    }
                                    alt={s.name}
                                    className="w-full h-52 object-cover"
                                />
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-amber-800">
                                        {s.name}
                                    </h4>
                                    <p className="text-gray-600 mt-2">{s.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-amber-700 font-bold">
                                            {s.price?.toLocaleString("vi-VN")}đ
                                        </div>
                                        <a
                                            href="/booking"
                                            className="px-4 py-2 rounded-full bg-amber-700 text-white text-sm hover:bg-amber-600"
                                        >
                                            Đặt ngay
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center col-span-3 text-gray-500">
                            Hiện chưa có dịch vụ nào được hiển thị.
                        </p>
                    )}
                </div>
            </section>

            <ChatBot />
            <Footer />
        </div>
    );
}
