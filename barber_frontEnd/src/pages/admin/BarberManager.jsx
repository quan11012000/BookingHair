import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function BarberManager() {
    const [barbers, setBarbers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        experienceYears: "",
        status: "Đang làm việc",
        hireDate: "",
        imageFile: null,
    });

    const admin = JSON.parse(localStorage.getItem("admin"));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/barbers");
            setBarbers(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách barber:", err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await axios.get("http://localhost:8080/api/barbers");
        const filtered = res.data.filter((b) =>
            b.fullName.toLowerCase().includes(keyword.toLowerCase())
        );
        setBarbers(filtered);
    };

    const handleOpenModal = (barber = null) => {
        if (barber) {
            setEditId(barber.barberId);
            setFormData({
                fullName: barber.fullName,
                phoneNumber: barber.phoneNumber,
                experienceYears: barber.experienceYears,
                status: barber.status,
                hireDate: barber.hireDate,
                imageFile: null,
            });
        } else {
            setEditId(null);
            setFormData({
                fullName: "",
                phoneNumber: "",
                experienceYears: "",
                status: "Đang làm việc",
                hireDate: "",
                imageFile: null,
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("phoneNumber", formData.phoneNumber);
            data.append("experienceYears", formData.experienceYears);
            data.append("status", formData.status);
            data.append("hireDate", formData.hireDate);
            if (formData.imageFile) data.append("imageFile", formData.imageFile);

            if (editId) {
                await axios.put(`http://localhost:8080/api/barbers/${editId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post("http://localhost:8080/api/barbers/upload", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setShowModal(false);
            setEditId(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi khi lưu barber:", err);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/barbers/${deleteId}`);
            fetchData();
        } catch (err) {
            console.error("Lỗi khi xoá barber:", err);
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
                            Quản lý Thợ Cắt Tóc
                        </h2>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-500 shadow"
                        >
                            ➕ Thêm thợ mới
                        </button>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 mb-6 bg-white p-4 rounded-lg shadow"
                    >
                        <input
                            type="text"
                            placeholder="Tìm theo tên thợ..."
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

                    <div className="bg-white rounded-xl shadow p-4">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b bg-amber-100">
                                <th className="p-3">Ảnh</th>
                                <th className="p-3">Tên thợ</th>
                                <th className="p-3">Số điện thoại</th>
                                <th className="p-3">Kinh nghiệm (năm)</th>
                                <th className="p-3">Ngày vào làm</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3 text-center">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {barbers.map((b) => (
                                <tr
                                    key={b.barberId}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">
                                        <img
                                            src={
                                                b.image
                                                    ? `http://localhost:8080${b.image}`
                                                    : "https://placehold.co/80x80?text=No+Image"
                                            }
                                            alt={b.fullName}
                                            className="w-16 h-16 object-cover rounded-full shadow"
                                        />
                                    </td>
                                    <td className="p-3">{b.fullName}</td>
                                    <td className="p-3">{b.phoneNumber}</td>
                                    <td className="p-3 text-center">{b.experienceYears}</td>
                                    <td className="p-3">{b.hireDate}</td>
                                    <td className="p-3">{b.status}</td>
                                    <td className="p-3 text-center flex justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(b)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.barberId)}
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
                    {showModal && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                        >
                            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[450px] relative border border-amber-100 animate-fadeIn">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-4 text-gray-400 hover:text-amber-700 transition"
                                >
                                    ✖
                                </button>

                                <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
                                    {editId ? "✏️ Cập nhật thợ" : "➕ Thêm thợ mới"}
                                </h2>

                                <form onSubmit={handleSave} className="space-y-3 text-gray-700">
                                    <div>
                                        <label className="block font-medium">Họ và tên</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    fullName: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium">Số điện thoại</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phoneNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phoneNumber: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium">
                                                Kinh nghiệm (năm)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="VD: 3"
                                                value={formData.experienceYears}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        experienceYears: e.target.value,
                                                    })
                                                }
                                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium">Ngày vào làm</label>
                                            <input
                                                type="date"
                                                value={formData.hireDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        hireDate: e.target.value,
                                                    })
                                                }
                                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-medium">Trạng thái</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        >
                                            <option>Đang làm việc</option>
                                            <option>Nghỉ phép</option>
                                            <option>Đã nghỉ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-medium">Ảnh đại diện</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    imageFile: e.target.files[0],
                                                })
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
                                            {editId ? "Cập nhật" : "Lưu"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal xác nhận xoá */}
                    {showConfirm && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                        >
                            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[350px] text-center animate-fadeIn border border-amber-100">
                                <h3 className="text-lg font-semibold text-amber-700 mb-4">
                                    Xác nhận xoá thợ này?
                                </h3>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow"
                                    >
                                        Xoá
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
