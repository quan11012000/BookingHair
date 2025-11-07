import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function BookingManager() {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);

    const [customerInput, setCustomerInput] = useState("");
    const [barberInput, setBarberInput] = useState("");
    const [serviceInput, setServiceInput] = useState("");

    const [newBooking, setNewBooking] = useState({
        customerId: null,
        barberId: null,
        serviceId: null,
        bookingDate: "",
        bookingTime: "08:00",
        note: "",
        status: "Chờ xác nhận",
    });

    const admin = JSON.parse(localStorage.getItem("admin"));

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        setNewBooking((prev) => ({ ...prev, bookingDate: today }));
        fetchBookings();
        fetchDataLists();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/bookings");
            setBookings(res.data);
        } catch (err) {
            console.error("Lỗi lấy booking:", err);
        }
    };

    const fetchDataLists = async () => {
        try {
            const [custRes, barberRes, serviceRes] = await Promise.all([
                axios.get("http://localhost:8080/api/customers"),
                axios.get("http://localhost:8080/api/barbers"),
                axios.get("http://localhost:8080/api/services"),
            ]);
            setCustomers(custRes.data);
            setBarbers(barberRes.data);
            setServices(serviceRes.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa lịch đặt này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/bookings/${id}`);
                fetchBookings();
                setSelectedBooking(null);
            } catch (err) {
                console.error("Lỗi xóa booking:", err);
            }
        }
    };

    const handleSaveNewBooking = async (e) => {
        e.preventDefault();
        if (!newBooking.customerId || !newBooking.barberId || !newBooking.serviceId) {
            alert("Vui lòng chọn khách hàng, thợ và dịch vụ hợp lệ!");
            return;
        }
        try {
            await axios.post("http://localhost:8080/api/bookings", newBooking);
            fetchBookings();
            setShowAddModal(false);
            setNewBooking({
                customerId: null,
                barberId: null,
                serviceId: null,
                bookingDate: selectedDate,
                bookingTime: "08:00",
                note: "",
                status: "Chờ xác nhận",
            });
            setCustomerInput("");
            setBarberInput("");
            setServiceInput("");
        } catch (err) {
            console.error("Lỗi tạo booking:", err);
            alert("Lỗi tạo booking, xem console để biết chi tiết.");
        }
    };

    // ===== Hàm phân bố hàng (row) để không bị đè nhau =====
    function assignRows(bookings) {
        const sorted = [...bookings].sort((a, b) =>
            a.bookingTime.localeCompare(b.bookingTime)
        );

        const rows = []; // mỗi hàng là một mảng chứa các booking trong hàng đó

        sorted.forEach(b => {
            const [startHour, startMinute] = b.bookingTime.split(":").map(Number);
            const start = startHour + startMinute / 60;
            const duration = b.durationHours || 1;
            const end = start + duration;

            // Tìm hàng đầu tiên chưa bị trùng thời gian
            let rowIndex = 0;
            while (
                rows[rowIndex]?.some(r => {
                    const [rH, rM] = r.bookingTime.split(":").map(Number);
                    const rStart = rH + rM / 60;
                    const rEnd = rStart + (r.durationHours || 1);
                    return !(end <= rStart || start >= rEnd); // nếu trùng thì true
                })
                ) {
                rowIndex++;
            }

            if (!rows[rowIndex]) rows[rowIndex] = [];
            rows[rowIndex].push(b);
            b.row = rowIndex;
        });

        return sorted;
    }

    const hours = Array.from({ length: 13 }, (_, i) => 8 + i);
    const bookingsOfDay = bookings.filter((b) => b.bookingDate === selectedDate);
    const arrangedBookings = assignRows(bookingsOfDay);

    const filteredCustomers = customers
        .filter(c => c && c.fullName)
        .filter((c) =>
            c.fullName.toLowerCase().includes(customerInput.toLowerCase())
        );
    const filteredBarbers = barbers.filter((b) =>
        b.fullName?.toLowerCase().includes(barberInput.toLowerCase())
    );
    const filteredServices = services.filter((s) =>
        s.name?.toLowerCase().includes(serviceInput.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarAdmin />
            <div className="flex-1">
                <HeaderAdmin adminName={admin?.fullName || "Quản trị viên"} />
                <main className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-700">Quản lý lịch đặt</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-500 shadow"
                        >
                            ➕ Thêm booking mới
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center gap-4">
                        <label className="font-semibold">Chọn ngày:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border p-2 rounded-lg"
                        />
                    </div>

                    {selectedDate ? (
                        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                            <h3 className="text-lg font-semibold mb-4 text-amber-700">
                                Lịch làm việc ngày {selectedDate}
                            </h3>
                            <div
                                className="relative border-t border-gray-300 mt-8 min-w-[1000px]"
                                style={{ height: "auto" }}
                            >
                                {/* Mốc giờ */}
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="absolute text-xs text-gray-600"
                                        style={{
                                            left: `${((hour - 8) / 12) * 100}%`,
                                            top: "-1.5rem",
                                            transform: "translateX(-50%)",
                                        }}
                                    >
                                        {hour}:00
                                    </div>
                                ))}

                                {/* Các booking được xếp hàng hợp lý */}
                                <div
                                    style={{ height: `${(Math.max(...arrangedBookings.map(b => b.row || 0)) + 1) * 3.5}rem`, position: "relative" }}
                                >
                                    {arrangedBookings.map((b) => {
                                        const [startHour, startMinute] = b.bookingTime.split(":").map(Number);
                                        const start = startHour + startMinute / 60;
                                        const duration = b.durationHours || 1;
                                        return (
                                            <div
                                                key={b.bookingId}
                                                onClick={() => setSelectedBooking(b)}
                                                className={`absolute text-white text-sm font-semibold rounded-lg cursor-pointer shadow-md flex items-center justify-center transition-all duration-200 ${
                                                    b.status === "Hoàn thành"
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : b.status === "Đang thực hiện"
                                                            ? "bg-blue-500 hover:bg-blue-600"
                                                            : "bg-amber-500 hover:bg-amber-600"
                                                }`}
                                                style={{
                                                    top: `${0.5 + b.row * 3}rem`,
                                                    left: `${((start - 8) / 12) * 100}%`,
                                                    width: `${(duration / 12) * 100}%`,
                                                    height: "2.5rem",
                                                }}
                                            >
                                                {b.customerName}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Vui lòng chọn ngày để xem lịch.</p>
                    )}

                    {/* Modal chi tiết booking */}
                    {selectedBooking && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/20">
                            <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-[400px] relative border border-amber-100">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-3 right-4 text-gray-400 hover:text-amber-700 transition"
                                >
                                    ✖
                                </button>
                                <h3 className="text-xl font-bold text-amber-700 mb-5 text-center">
                                    Thông tin lịch đặt
                                </h3>
                                <div className="space-y-3 text-gray-700 text-sm">
                                    <p><strong>👤 Khách hàng:</strong> {selectedBooking.customerName}</p>
                                    <p><strong>📞 SĐT:</strong> {selectedBooking.customerPhone}</p>
                                    <p><strong>💈 Thợ:</strong> {selectedBooking.barberName}</p>
                                    <p><strong>✂ Dịch vụ:</strong> {selectedBooking.serviceName}</p>
                                    <p><strong>📅 Ngày:</strong> {selectedBooking.bookingDate}</p>
                                    <p><strong>⏰ Giờ:</strong> {selectedBooking.bookingTime}</p>
                                    <p><strong>📝 Ghi chú:</strong> {selectedBooking.note}</p>
                                    <p><strong>⚡ Trạng thái:</strong> {selectedBooking.status}</p>
                                    <div className="text-right mt-3">
                                        <button
                                            onClick={() => handleDelete(selectedBooking.bookingId)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal thêm booking mới */}
                    {showAddModal && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/20">
                            <form
                                onSubmit={handleSaveNewBooking}
                                className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-[450px] relative border border-amber-100 space-y-4"
                            >
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    type="button"
                                    className="absolute top-3 right-4 text-gray-400 hover:text-amber-700 transition"
                                >
                                    ✖
                                </button>
                                <h3 className="text-xl font-bold text-amber-700 text-center">Thêm booking mới</h3>

                                {/* Customer */}
                                <div className="relative">
                                    <label className="font-semibold">Khách hàng:</label>
                                    <input
                                        value={customerInput}
                                        onChange={(e) => {
                                            setCustomerInput(e.target.value);
                                            setNewBooking((prev) => ({ ...prev, customerId: null }));
                                        }}
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="Nhập tên khách..."
                                    />
                                    {filteredCustomers.length > 0 && customerInput && (
                                        <ul className="absolute bg-white border w-full max-h-40 overflow-auto rounded shadow z-10">
                                            {filteredCustomers.map((c) => (
                                                <li
                                                    key={c.id}
                                                    className="p-2 cursor-pointer hover:bg-amber-100"
                                                    onClick={() => {
                                                        setNewBooking((prev) => ({ ...prev, customerId: c.id }));
                                                        setCustomerInput(c.fullName);
                                                    }}
                                                >
                                                    {c.fullName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Barber */}
                                <div className="relative">
                                    <label className="font-semibold">Thợ:</label>
                                    <input
                                        value={barberInput}
                                        onChange={(e) => {
                                            setBarberInput(e.target.value);
                                            setNewBooking((prev) => ({ ...prev, barberId: null }));
                                        }}
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="Nhập tên thợ..."
                                    />
                                    {filteredBarbers.length > 0 && barberInput && (
                                        <ul className="absolute bg-white border w-full max-h-40 overflow-auto rounded shadow z-10">
                                            {filteredBarbers.map((b) => (
                                                <li
                                                    key={b.id}
                                                    className="p-2 cursor-pointer hover:bg-amber-100"
                                                    onClick={() => {
                                                        setNewBooking((prev) => ({ ...prev, barberId: b.id }));
                                                        setBarberInput(b.fullName);
                                                    }}
                                                >
                                                    {b.fullName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Service */}
                                <div className="relative">
                                    <label className="font-semibold">Dịch vụ:</label>
                                    <input
                                        value={serviceInput}
                                        onChange={(e) => {
                                            setServiceInput(e.target.value);
                                            setNewBooking((prev) => ({ ...prev, serviceId: null }));
                                        }}
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="Nhập tên dịch vụ..."
                                    />
                                    {filteredServices.length > 0 && serviceInput && (
                                        <ul className="absolute bg-white border w-full max-h-40 overflow-auto rounded shadow z-10">
                                            {filteredServices.map((s) => (
                                                <li
                                                    key={s.id}
                                                    className="p-2 cursor-pointer hover:bg-amber-100"
                                                    onClick={() => {
                                                        setNewBooking((prev) => ({ ...prev, serviceId: s.id }));
                                                        setServiceInput(s.name);
                                                    }}
                                                >
                                                    {s.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div className="flex gap-4">
                                    <div>
                                        <label className="font-semibold">Ngày:</label>
                                        <input
                                            type="date"
                                            value={newBooking.bookingDate}
                                            onChange={(e) =>
                                                setNewBooking((prev) => ({ ...prev, bookingDate: e.target.value }))
                                            }
                                            className="border p-2 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold">Giờ:</label>
                                        <select
                                            value={newBooking.bookingTime}
                                            onChange={(e) =>
                                                setNewBooking((prev) => ({ ...prev, bookingTime: e.target.value }))
                                            }
                                            className="border p-2 rounded-lg"
                                        >
                                            {hours.map((h) => (
                                                <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                                                    {h}:00
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="font-semibold">Ghi chú:</label>
                                    <textarea
                                        value={newBooking.note}
                                        onChange={(e) =>
                                            setNewBooking((prev) => ({ ...prev, note: e.target.value }))
                                        }
                                        className="w-full border p-2 rounded-lg"
                                    />
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="submit"
                                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-500 shadow"
                                    >
                                        Thêm booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
