import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin.jsx";
import HeaderAdmin from "../components/HeaderAdmin.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import RealtimeChat from "../components/RealtimeChat.jsx";
import StaffChat from "../components/StaffChat.jsx";

export default function DashboardAdmin() {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin) {
        window.location.href = "/admin/login";
        return null;
    }

    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [bookingChart, setBookingChart] = useState([]);
    const [serviceChart, setServiceChart] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resBookings, resServices, resBarbers] = await Promise.all([
                axios.get("http://localhost:8080/api/bookings"),
                axios.get("http://localhost:8080/api/services"),
                axios.get("http://localhost:8080/api/barbers"),
            ]);

            setBookings(resBookings.data);
            setServices(resServices.data);
            setBarbers(resBarbers.data);

            // Thống kê booking theo ngày
            const bookingsByDate = resBookings.data.reduce((acc, b) => {
                acc[b.bookingDate] = (acc[b.bookingDate] || 0) + 1;
                return acc;
            }, {});
            setBookingChart(
                Object.entries(bookingsByDate).map(([date, count]) => ({ date, count }))
            );

            // Thống kê dịch vụ được đặt nhiều
            const servicesCount = resBookings.data.reduce((acc, b) => {
                const name = b.serviceName || "Khác";
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {});
            setServiceChart(
                Object.entries(servicesCount).map(([name, value]) => ({ name, value }))
            );
        } catch (e) {
            console.error("Lỗi khi tải dashboard:", e);
        }
    };

    const COLORS = ["#FFB74D", "#FFA726", "#FB8C00", "#F57C00", "#EF6C00"];

    return (
        <div className="flex min-h-screen bg-amber-50">
            <SidebarAdmin />
            <div className="flex-1">
                <HeaderAdmin adminName={admin.fullName} />

                <main className="p-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-6">
                        Tổng quan hệ thống
                    </h2>

                    {/* Thống kê nhanh */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div
                            onClick={() => navigate("/admin/services")}
                            className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center border-t-4 border-amber-600 hover:bg-amber-50"
                        >
                            <p className="text-gray-500">Tổng dịch vụ</p>
                            <h3 className="text-4xl font-bold text-amber-800">
                                {services.length}
                            </h3>
                        </div>

                        <div
                            onClick={() => navigate("/admin/bookings")}
                            className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center border-t-4 border-amber-600 hover:bg-amber-50"
                        >
                            <p className="text-gray-500">Tổng đặt lịch</p>
                            <h3 className="text-4xl font-bold text-amber-800">
                                {bookings.length}
                            </h3>
                        </div>

                        <div
                            onClick={() => navigate("/admin/barbers")}
                            className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center border-t-4 border-amber-600 hover:bg-amber-50"
                        >
                            <p className="text-gray-500">Tổng thợ cắt tóc</p>
                            <h3 className="text-4xl font-bold text-amber-800">
                                {barbers.length}
                            </h3>
                        </div>
                    </div>

                    {/* Biểu đồ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 text-amber-800">
                                Số lượng đặt lịch theo ngày
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bookingChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#FFA726" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 text-amber-800">
                                Dịch vụ được đặt nhiều nhất
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={serviceChart}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {serviceChart.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <StaffChat />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
