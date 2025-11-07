import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/admin/login", {
                username,
                password,
            });
            localStorage.setItem("admin", JSON.stringify(res.data));
            navigate("/admin/dashboard");
        } catch {
            setError("Sai tên đăng nhập hoặc mật khẩu");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FFD7A6] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-[#B96821]/20">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B96821] to-[#8C4A15] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                        BS
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-[#B96821] mb-6">Đăng nhập quản trị</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#B96821] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#B96821] outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#B96821] hover:bg-[#c97932] text-white py-2 rounded-lg font-semibold transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-6">
                    © 2024 Barber Studio Admin. All rights reserved.
                </p>
            </div>
        </div>
    );
}
