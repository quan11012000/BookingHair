import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function BookingPage() {
    const [form, setForm] = useState({
        customerName: "",
        phoneNumber: "",
        bookingDate: "",
        bookingTime: "",
        serviceName: "",
        note: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:8080/api/bookings", form);
            setSuccess(true);
            setForm({
                customerName: "",
                phoneNumber: "",
                bookingDate: "",
                bookingTime: "",
                serviceName: "",
                note: "",
            });
        } catch (err) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg"
        >
            <h2 className="text-3xl font-bold text-amber-700 mb-6 text-center">
                💈 Đặt lịch hẹn Barber T&Q
            </h2>

            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
                    ✅ Gửi yêu cầu thành công! Nhân viên sẽ liên hệ tư vấn sớm.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Họ tên</label>
                    <input
                        type="text"
                        value={form.customerName}
                        onChange={(e) =>
                            setForm({ ...form, customerName: e.target.value })
                        }
                        required
                        className="w-full border rounded-lg p-2"
                        placeholder="Nhập họ tên của bạn"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Số điện thoại</label>
                    <input
                        type="tel"
                        value={form.phoneNumber}
                        onChange={(e) =>
                            setForm({ ...form, phoneNumber: e.target.value })
                        }
                        required
                        className="w-full border rounded-lg p-2"
                        placeholder="Nhập số điện thoại để liên hệ"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Ngày</label>
                        <input
                            type="date"
                            value={form.bookingDate}
                            onChange={(e) =>
                                setForm({ ...form, bookingDate: e.target.value })
                            }
                            required
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Giờ</label>
                        <input
                            type="time"
                            value={form.bookingTime}
                            onChange={(e) =>
                                setForm({ ...form, bookingTime: e.target.value })
                            }
                            required
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Dịch vụ mong muốn</label>
                    <input
                        type="text"
                        value={form.serviceName}
                        onChange={(e) =>
                            setForm({ ...form, serviceName: e.target.value })
                        }
                        className="w-full border rounded-lg p-2"
                        placeholder="Ví dụ: Cắt tóc, uốn, nhuộm..."
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Ghi chú thêm</label>
                    <textarea
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        rows={3}
                        className="w-full border rounded-lg p-2"
                        placeholder="Ghi chú thêm (nếu có)"
                    />
                </div>

                <div className="text-center mt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition disabled:opacity-60"
                    >
                        {loading ? "Đang gửi..." : "Đặt lịch ngay"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
