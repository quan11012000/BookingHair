import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot.jsx";

export default function BarbersPage() {
    const [barbers, setBarbers] = useState([]);

    useEffect(() => {
        fetchBarbers();
    }, []);

    const fetchBarbers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/barbers");
            setBarbers(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách thợ:", err);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 text-gray-900">
            <Header />

            <section className="py-16 md:py-24 px-6 md:px-20">
                <h3 className="text-3xl font-bold text-center text-amber-800">
                    Đội ngũ Barber chuyên nghiệp
                </h3>
                <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
                    Những người thợ có tay nghề cao, tận tâm và luôn cập nhật xu hướng mới — giúp bạn
                    có mái tóc chỉn chu, hợp thời trang và thể hiện phong cách riêng.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {barbers.length > 0 ? (
                        barbers.map((b, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-lg transition"
                            >
                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-amber-300 shadow">
                                    {b.image ? (
                                        <img
                                            src={`http://localhost:8080${b.image}`}
                                            alt={b.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white text-2xl font-semibold">
                                            {b.fullName.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <h4 className="mt-4 text-lg font-semibold text-amber-800">
                                    {b.fullName}
                                </h4>
                                <div className="text-gray-600 mt-1">
                                    {b.experienceYears
                                        ? `${b.experienceYears} năm kinh nghiệm`
                                        : "Chưa cập nhật"}
                                </div>
                                <div className="text-sm text-amber-600 mt-1 italic">
                                    {b.status}
                                </div>

                                <div className="mt-4">
                                    <button className="px-4 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition">
                                        Xem profile
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center col-span-4 text-gray-500">
                            Hiện chưa có thông tin thợ nào được hiển thị.
                        </p>
                    )}
                </div>
            </section>

            <ChatBot />
            <Footer />
        </div>
    );
}
