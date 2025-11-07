import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Trang chủ", href: "/" },
        { name: "Dịch vụ", href: "/services" },
        { name: "Barber", href: "/barbers" },
        { name: "Giá cả", href: "/pricing" },
        { name: "Liên hệ", href: "/contact" },
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-2 px-4 text-sm">
                <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>0123 456 789</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>8:00 - 21:00 hàng ngày</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>123 Đường Nguyết Tất Thành, Đà Nẵng</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.a
                            href="/"
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                BS
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    BARBER STUDIO
                                </h1>
                                <p className="text-xs text-amber-700">Premium Grooming</p>
                            </div>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    whileHover={{ y: -2 }}
                                    className="text-gray-700 hover:text-amber-700 font-medium transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
                                </motion.a>
                            ))}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <motion.a
                                href="/admin/login"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border border-amber-700 text-amber-700 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-all"
                            >
                                Đăng nhập
                            </motion.a>

                            <motion.a
                                href="/booking"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Đặt lịch ngay
                            </motion.a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 p-2"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-700 hover:text-amber-700 font-medium py-2 border-b"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <a
                                    href="/booking"
                                    className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-full font-semibold text-center"
                                >
                                    Đặt lịch ngay
                                </a>
                                <a
                                    href="/admin/login"
                                    className="border border-amber-700 text-amber-700 px-6 py-3 rounded-full font-semibold text-center hover:bg-amber-50"
                                >
                                    Đăng nhập
                                </a>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
};

export default Header;
