import { Link, useNavigate } from "react-router-dom";

export default function SidebarAdmin() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };

    return (
        <aside className="w-64 bg-gradient-to-b from-[#B96821] to-[#8C4A15] text-white flex flex-col justify-between shadow-lg">
            <div>
                <div className="p-6 text-2xl font-bold border-[#D9A46C]/40">
                    ✂️ Barber Admin
                </div>
                <nav className="mt-4 flex flex-col">
                    {[
                        { to: "/admin/dashboard", label: "📊 Dashboard" },
                        { to: "/admin/barbers", label: "💈 Quản lý Barber" },
                        { to: "/admin/services", label: "💆 Dịch vụ" },
                        { to: "/admin/bookings", label: "📅 Đặt lịch" },
                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="px-6 py-3 hover:bg-[#FFF3E5] hover:text-[#B96821] transition font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <button
                onClick={handleLogout}
                className="p-4 text-left hover:bg-[#FFF3E5] hover:text-[#B96821] transition"
            >
                🚪 Đăng xuất
            </button>
        </aside>
    );
}
