import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function FeedbackPage() {
    const feedbacks = [
        { name: "Anh Nam", rating: 5, text: "Dịch vụ tuyệt vời, thợ rất chuyên nghiệp." },
        { name: "Anh Hùng", rating: 5, text: "Không gian sạch sẽ, đặt lịch nhanh gọn." },
        { name: "Anh Tuấn", rating: 4, text: "Nhân viên thân thiện, cắt tóc đẹp, giá hợp lý." },
        { name: "Anh Duy", rating: 5, text: "Rất hài lòng, sẽ quay lại lần sau!" },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Header />

            <section className="py-16 md:py-24 px-6 md:px-20">
                <h3 className="text-3xl font-bold text-center text-blue-800">
                    Đánh giá khách hàng
                </h3>
                <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
                    Lắng nghe phản hồi từ những khách hàng thân thiết — động lực để chúng
                    tôi không ngừng cải thiện chất lượng dịch vụ.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedbacks.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            className="bg-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
                                    {f.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-blue-800">{f.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {Array.from({ length: f.rating })
                                            .map(() => "★")
                                            .join("")}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700">{f.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
