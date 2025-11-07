import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#B96821] to-[#3B1F0E] text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#F6A400] to-[#B96821] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                TQ
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Barber T&Q</h3>
                                <p className="text-xs text-[#FFD580]">Men’s Grooming Studio</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed mb-4 text-[#FFF2CC]">
                            Trải nghiệm barber đẳng cấp cùng đội ngũ thợ tay nghề cao và không gian sang trọng bậc nhất Sài Gòn.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-[#A4581A] hover:bg-[#F6A400] rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Liên kết nhanh</h4>
                        <ul className="space-y-3">
                            {["Trang chủ", "Dịch vụ", "Thợ", "Đặt lịch", "Đánh giá", "Liên hệ"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-[#FFE39F] transition-colors flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFD580] rounded-full"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Featured Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Dịch vụ nổi bật</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                "Cắt tóc tạo kiểu",
                                "Cạo râu chuyên nghiệp",
                                "Uốn tóc nam",
                                "Nhuộm thời trang",
                                "Gội đầu thư giãn",
                                "Combo VIP toàn diện"
                            ].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-[#FFE39F] transition-colors flex items-center gap-2">
                                        <span className="text-[#FFD580]">✦</span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Liên hệ</h4>
                        <ul className="space-y-4 text-sm text-[#FFF2CC]">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-[#FFD580] mt-1" />
                                <span>45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-[#FFD580]" />
                                <span>0909 888 999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-[#FFD580]" />
                                <span>contact@barbertq.vn</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock size={20} className="text-[#FFD580] mt-1" />
                                <div>
                                    <p>Thứ 2 - Chủ nhật</p>
                                    <p className="text-white font-semibold">8:00 - 21:30</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#A4581A]/50">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#FFE39F]">
                    <p>&copy; 2025 Barber T&Q. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
