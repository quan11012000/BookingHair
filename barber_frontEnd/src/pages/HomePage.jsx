import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";
import { motion } from "framer-motion";
import { Users, Award, Scissors, Star, CheckCircle, Clock } from "lucide-react";

export default function HomePage() {
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/services")
            .then((res) => setServices(res.data))
            .catch((err) => console.error("Lỗi khi tải dịch vụ:", err));

        axios.get("http://localhost:8080/api/barbers")
            .then((res) => setBarbers(res.data))
            .catch((err) => console.error("Lỗi khi tải barber:", err));
    }, []);

    return (
        <div className="bg-[#0E0F14] text-white">
            <Header />

            {/* === Hero Banner === */}
            <section className="relative h-[90vh] flex items-center justify-center text-center">
                <img
                    src="https://images.unsplash.com/photo-1606112219348-204d7d8b94ee"
                    alt="Barber Studio"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative z-10 max-w-3xl px-4">
          <span className="bg-[#B96821] text-sm font-semibold px-4 py-2 rounded-full inline-block mb-4">
            ✨ Premium Barber Experience
          </span>
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Phong Cách <span className="text-[#F6A400]">Đẳng Cấp</span>
                    </h1>
                    <p className="mt-4 text-gray-200 text-lg">
                        Nơi mỗi kiểu tóc là một tác phẩm nghệ thuật. Trải nghiệm dịch vụ cắt tóc và chăm sóc nam giới đỉnh cao cùng đội ngũ barber chuyên nghiệp.
                    </p>
                    <div className="mt-8 flex justify-center gap-6">
                        <a href="/booking" className="bg-[#B96821] px-6 py-3 rounded-full font-semibold hover:bg-[#c97932] transition">Đặt lịch ngay</a>
                        <a href="/services" className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">Xem dịch vụ</a>
                    </div>
                </div>
            </section>

            {/* === Thống kê === */}
            <section className="bg-[#1B1D29] py-16 grid grid-cols-2 md:grid-cols-4 text-center gap-8">
                {[
                    { icon: <Users size={40} className="mx-auto text-[#F6A400]" />, label: "Khách hàng", value: "10,000+" },
                    { icon: <Award size={40} className="mx-auto text-[#F6A400]" />, label: "Năm kinh nghiệm", value: "15+" },
                    { icon: <Scissors size={40} className="mx-auto text-[#F6A400]" />, label: "Dịch vụ", value: "50+" },
                    { icon: <Star size={40} className="mx-auto text-[#F6A400]" />, label: "Đánh giá", value: "4.9/5" },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
                        {item.icon}
                        <h3 className="text-3xl font-bold mt-4">{item.value}</h3>
                        <p className="text-gray-400">{item.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* === Tại sao chọn chúng tôi === */}
            <section className="py-20 bg-white text-center text-gray-900">
                <h3 className="text-[#B96821] font-semibold tracking-wide uppercase">Tại sao chọn chúng tôi</h3>
                <h2 className="text-4xl font-bold mt-3 mb-10">Trải Nghiệm Đẳng Cấp</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
                    {[
                        { icon: <CheckCircle size={32} />, title: "Đội ngũ chuyên nghiệp", desc: "Barber giàu kinh nghiệm, được đào tạo bài bản" },
                        { icon: <Award size={32} />, title: "Không gian sang trọng", desc: "Thiết kế hiện đại, thoải mái và đẳng cấp" },
                        { icon: <Star size={32} />, title: "Sản phẩm cao cấp", desc: "Sử dụng mỹ phẩm chính hãng từ thương hiệu uy tín" },
                        { icon: <Clock size={32} />, title: "Phục vụ linh hoạt", desc: "Mở cửa 7 ngày/tuần, đặt lịch dễ dàng" },
                    ].map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} className="p-6 bg-white shadow-md rounded-xl border border-gray-100">
                            <div className="text-[#B96821] mb-3">{f.icon}</div>
                            <h4 className="font-semibold text-lg">{f.title}</h4>
                            <p className="text-gray-500 text-sm mt-2">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* === Dịch vụ nổi bật === */}
            <section className="py-20 bg-white text-gray-900 text-center">
                <h3 className="text-[#B96821] font-semibold tracking-wide uppercase">Dịch vụ của chúng tôi</h3>
                <h2 className="text-4xl font-bold mt-3 mb-10">Dịch Vụ Nổi Bật</h2>

                {services.length === 0 ? (
                    <p className="text-gray-500">Đang tải danh sách dịch vụ...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
                        {services.map((s) => (
                            <motion.div key={s.serviceId} whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                                <img
                                    src={s.image ? `http://localhost:8080${s.image}` : `https://placehold.co/600x400?text=${s.name}`}
                                    alt={s.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-6 text-left">
                                    <h4 className="text-xl font-bold">{s.name}</h4>
                                    <p className="text-gray-600 mt-2 line-clamp-2">{s.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                    <span className="text-[#B96821] font-bold text-lg">
                      {s.price ? `${s.price.toLocaleString()}đ` : "Liên hệ"}
                    </span>
                                        <a href="/booking" className="bg-[#B96821] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#c97932] transition">
                                            Đặt ngay →
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* === Đội ngũ barber === */}
            <section className="py-20 bg-[#1B1D29] text-center">
                <h2 className="text-3xl font-bold mb-10 text-white">👨‍🎨 Đội Ngũ Barber Chuyên Nghiệp</h2>
                {barbers.length === 0 ? (
                    <p className="text-gray-400">Đang tải danh sách barber...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
                        {barbers.map((b) => (
                            <motion.div key={b.barberId} whileHover={{ y: -5 }} className="bg-[#12141C] shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition">
                                <img src={b.image ? `http://localhost:8080${b.image}` : "https://placehold.co/400x400?text=No+Image"} alt={b.fullName} className="w-full h-64 object-cover" />
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-[#F6A400]">{b.fullName}</h3>
                                    <p className="text-gray-300">{b.experienceYears} năm kinh nghiệm</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
            <section className="py-20 bg-white from-[#FFF8F0] to-[#FFEBD4] text-center text-gray-900">
                <h3 className="text-[#B96821] font-semibold tracking-wide uppercase">Cảm nhận khách hàng</h3>
                <h2 className="text-4xl font-bold mt-3 mb-12">Khách Hàng Nói Gì Về Chúng Tôi</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                    {[
                        {
                            name: "Nguyễn Minh",
                            comment: "Không gian rất sang trọng, barber thân thiện và cực kỳ chuyên nghiệp. Rất hài lòng với kiểu tóc mới!",
                            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                        },
                        {
                            name: "Trần Hải Yến",
                            comment: "Lần đầu đến mà ấn tượng mạnh. Từ khâu đặt lịch đến phục vụ đều chỉn chu và tận tâm. 10 điểm!",
                            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                        },
                        {
                            name: "Phạm Tuấn",
                            comment: "Dịch vụ cắt tóc và gội đầu thư giãn thật tuyệt. Sẽ quay lại thường xuyên!",
                            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                        },
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white shadow-lg rounded-2xl p-8 text-left border border-[#F6A400]/20 transition-all"
                        >
                            <div className="flex items-center mb-4 gap-4">
                                <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#F6A400]" />
                                <div>
                                    <h4 className="font-bold text-lg text-[#B96821]">{f.name}</h4>
                                    <div className="flex text-[#F6A400]">
                                        {Array(5).fill(0).map((_, idx) => (
                                            <Star key={idx} size={16} fill="#F6A400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed italic">“{f.comment}”</p>
                        </motion.div>
                    ))}
                </div>
            </section>
            <ChatBot />

            <Footer />
        </div>
    );
}
