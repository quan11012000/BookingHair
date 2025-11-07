export default function HeaderAdmin({ adminName }) {
    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location.href = "/";
    };

    return (
        <header className="bg-gradient-to-r from-[#B96821] to-[#8C4A15] text-white flex justify-between items-center px-6 py-4 shadow-lg">
            <h1 className="text-xl font-bold tracking-wide">💈 Barber Studio Admin</h1>
            <div className="flex items-center gap-4">
                <span>Xin chào, <strong>{adminName}</strong></span>
                <button
                    onClick={handleLogout}
                    className="bg-white text-[#B96821] px-3 py-1 rounded-full font-semibold hover:bg-[#FFF3E5] transition"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}
