import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function ServiceManager() {
    const [services, setServices] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        durationMin: "",
        imageFile: null,
    });

    const admin = JSON.parse(localStorage.getItem("admin"));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/services");
            setServices(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách dịch vụ:", err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("http://localhost:8080/api/services");
            const filtered = res.data.filter((s) =>
                s.name.toLowerCase().includes(keyword.toLowerCase())
            );
            setServices(filtered);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm dịch vụ:", err);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditing(service);
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price,
                durationMin: service.durationMin,
                imageFile: null,
            });
        } else {
            setEditing(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                durationMin: "",
                imageFile: null,
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("durationMin", formData.durationMin);
        if (formData.imageFile) data.append("imageFile", formData.imageFile);

        try {
            if (editing) {
                await axios.put(
                    `http://localhost:8080/api/services/${editing.serviceId}`,
                    data,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                await axios.post("http://localhost:8080/api/services/upload", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setShowModal(false);
            setEditing(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi khi lưu dịch vụ:", err);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/services/${deleteId}`);
            fetchData();
        } catch (err) {
            console.error("Lỗi khi xóa dịch vụ:", err);
        }
        setShowConfirm(false);
    };

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin />
            <div className="flex-1 bg-gray-50">
                <HeaderAdmin adminName={admin.fullName} />

                <main className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-700">
                            Quản lý Dịch vụ
                        </h2>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-500 shadow"
                        >
                            ➕ Thêm mới dịch vụ
                        </button>
                    </div>

                    {/* Tìm kiếm */}
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 mb-6 bg-white p-4 rounded-lg shadow"
                    >
                        <input
                            type="text"
                            placeholder="Tìm theo tên dịch vụ..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="flex-1 border p-2 rounded-lg"
                        />
                        <button
                            type="submit"
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-500"
                        >
                            Tìm kiếm
                        </button>
                    </form>

                    {/* Bảng dịch vụ */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b bg-amber-100">
                                <th className="p-3">Tên dịch vụ</th>
                                <th className="p-3">Giá</th>
                                <th className="p-3">Thời lượng</th>
                                <th className="p-3">Ảnh</th>
                                <th className="p-3 text-center">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {services.map((s) => (
                                <tr key={s.serviceId} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{s.name}</td>
                                    <td className="p-3">{s.price?.toLocaleString()} VND</td>
                                    <td className="p-3 text-center">{s.durationMin} phút</td>
                                    <td className="p-3">
                                        <img
                                            src={
                                                s.image
                                                    ? `http://localhost:8080${s.image}`
                                                    : "https://placehold.co/80x80?text=No+Image"
                                            }
                                            alt={s.name}
                                            className="w-16 h-16 object-cover rounded-lg shadow"
                                        />
                                    </td>
                                    <td className="p-3 text-center flex justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(s)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.serviceId)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal thêm/sửa */}
                    {/* Modal thêm/sửa */}
                    {/* Modal thêm / sửa */}
                    {showModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md overflow-hidden"
                            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        >
                            {/* Hiệu ứng sao băng */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(25)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="shooting-star"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 3}s`,
                                            animationDuration: `${2 + Math.random() * 2}s`,
                                        }}
                                    ></div>
                                ))}
                            </div>

                            {/* Hiệu ứng pháo hoa */}
                            <div className="absolute inset-0 flex items-end justify-center pointer-events-none fireworks-container">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="firework"></div>
                                ))}
                            </div>

                            {/* Nội dung modal */}
                            <div className="relative bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[450px] border border-amber-200 animate-modalIn z-10">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-4 text-gray-400 hover:text-amber-700 transition"
                                >
                                    ✖
                                </button>

                                <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
                                    {editing ? "✏️ Sửa dịch vụ" : "🌟 Thêm mới dịch vụ"}
                                </h2>

                                <form onSubmit={handleSave} className="space-y-3">
                                    <div>
                                        <label className="block font-medium">Tên dịch vụ</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium">Mô tả</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium">Giá (VND)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium">Thời lượng (phút)</label>
                                            <input
                                                type="number"
                                                value={formData.durationMin}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, durationMin: e.target.value })
                                                }
                                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-medium">Ảnh minh hoạ</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setFormData({ ...formData, imageFile: e.target.files[0] })
                                            }
                                            className="w-full border border-gray-300 p-2 rounded-lg"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md"
                                        >
                                            {editing ? "Cập nhật" : "Lưu"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal xác nhận xoá */}
                    {showConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                            {/* Sao băng */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="shooting-star" style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`,
                                    }}></div>
                                ))}
                            </div>

                            {/* Pháo hoa */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="firework" style={{ left: `${Math.random() < 0.5 ? 10 : 90}%` }}></div>
                                ))}
                            </div>

                            {/* Nội dung xác nhận */}
                            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[350px] text-center animate-modalIn border border-amber-100 z-10">
                                <h3 className="text-lg font-semibold text-amber-700 mb-4">Xác nhận xoá dịch vụ này?</h3>
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Hủy</button>
                                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow">Xoá</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
