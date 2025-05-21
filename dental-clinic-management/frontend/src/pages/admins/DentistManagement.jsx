import React, { useState, useRef } from "react";
import axios from "axios";
import useDentists from "../../hooks/useDentists";
import { useBranches } from "../../hooks/useBranchClinics";
import useSpecializations from "../../hooks/useSpecializations";
import { createDentist, updateDentist, deleteDentist } from "../../services/dentistService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PencilIcon, TrashIcon, EyeIcon, DownloadIcon, PlusIcon } from "lucide-react";

const initialForm = {
    full_name: "",
    specialization_id: "",
    branch_clinic_id: "",
    phone_number: "",
    email: "",
    img_url: "",
    username: "",
    password: "",
};

const DentistManagement = () => {
    const { dentists, isLoading, error, refetch } = useDentists();
    const { branches, isLoading: branchesLoading } = useBranches();
    const { specializations, isLoading: specsLoading } = useSpecializations();

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [detailView, setDetailView] = useState(null);
    const rowsPerPage = 10;
    const formRef = useRef(null);

    const totalPages = Math.ceil(dentists.length / rowsPerPage);
    const paginatedDentists = dentists.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Hàm upload ảnh
    const handleImageUpload = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("http://localhost:8080/dental-clinic/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.image_url;
        } catch (err) {
            setErrorMsg("Không thể tải ảnh lên: " + (err.response?.data?.error || err.message));
            setTimeout(() => setErrorMsg(""), 3000);
            return null;
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name.includes("id") && value !== "" ? parseInt(value) : value,
        }));
    };

    // Handle editing dentist
    const handleEdit = (dentist) => {
        setForm({
            full_name: dentist.full_name || "",
            specialization_id: dentist.specialization_id || "",
            branch_clinic_id: dentist.branch_clinic_id || "",
            phone_number: dentist.phone_number || "",
            email: dentist.email || "",
            img_url: dentist.img_url || "",
            username: dentist.username || "",
            password: "",
        });
        setEditingId(dentist.id);
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    // Handle delete dentist
    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xoá nha sĩ này?")) {
            try {
                await deleteDentist(id);
                refetch();
            } catch {
                setErrorMsg("Xoá nha sĩ thất bại!");
                setTimeout(() => setErrorMsg(""), 3000);
            }
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const formData = {
                full_name: form.full_name,
                specialization_id: form.specialization_id !== "" ? parseInt(form.specialization_id) : undefined,
                branch_clinic_id: form.branch_clinic_id !== "" ? parseInt(form.branch_clinic_id) : undefined,
                phone_number: form.phone_number,
                email: form.email,
                img_url: form.img_url,
                // Only include username and password when creating a new dentist
                ...(editingId ? {} : { username: form.username, password: form.password }),
            };
            console.log("Form data:", formData);
            if (editingId) {
                await updateDentist(editingId, formData);
                setSuccessMsg("Cập nhật nha sĩ thành công!");
            } else {
                await createDentist(formData);
                setSuccessMsg("Thêm nha sĩ thành công!");
            }
            setForm(initialForm);
            setEditingId(null);
            setShowForm(false);
            refetch();
            setTimeout(() => setSuccessMsg(""), 2500);
        } catch (err) {
            const msg = err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
            const details = err?.response?.data?.details || "";
            setErrorMsg(
                msg === "Tên đăng nhập đã tồn tại"
                    ? "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!"
                    : `${msg}${details ? ` (${details})` : ""}`
            );
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    // Export dentists to Excel
    const handleExportExcel = () => {
        const dataToExport = dentists.map((d) => ({
            ID: d.id,
            "Tên nha sĩ": d.full_name,
            "Chuyên khoa": specializations.find((s) => s.id === d.specialization_id)?.name || "",
            "Chi nhánh": branches.find((b) => b.id === d.branch_clinic_id)?.name || "",
            "Ảnh đại diện": d.img_url ? `/assets/dentists/${d.img_url}` : "",
            "Số điện thoại": d.phone_number,
            Email: d.email,
            "Ngày tạo": d.created_at ? new Date(d.created_at).toLocaleString("vi-VN") : "",
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dentists");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "dentists.xlsx");
    };

    if (isLoading || branchesLoading || specsLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error.message}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý nha sĩ</h1>

            {successMsg && (
                <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded shadow transition-all animate-bounce">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded shadow transition-all animate-bounce">
                    {errorMsg}
                </div>
            )}

            <div className="flex space-x-2 mb-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    onClick={() => {
                        setShowForm(true);
                        setForm(initialForm);
                        setEditingId(null);
                    }}
                >
                    <PlusIcon size={16} className="mr-1" />
                    Thêm nha sĩ
                </button>

                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                    onClick={handleExportExcel}
                >
                    <DownloadIcon size={16} className="mr-1" />
                    Xuất Excel
                </button>
            </div>

            {showForm && (
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="mb-6 bg-gray-50 p-4 rounded shadow max-w-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-2">
                            <label className="block font-semibold">Tên nha sĩ</label>
                            <input
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                                className="w-full border px-2 py-1 rounded"
                                placeholder="Nhập tên nha sĩ"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block font-semibold">Chuyên khoa</label>
                            <select
                                name="specialization_id"
                                value={form.specialization_id}
                                onChange={handleChange}
                                required
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="">-- Chọn chuyên khoa --</option>
                                {specializations.map((spec) => (
                                    <option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="block font-semibold">Chi nhánh</label>
                            <select
                                name="branch_clinic_id"
                                value={form.branch_clinic_id}
                                onChange={handleChange}
                                required
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="">-- Chọn chi nhánh --</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="block font-semibold">Số điện thoại</label>
                            <input
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                required
                                className="w-full border px-2 py-1 rounded"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block font-semibold">Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border px-2 py-1 rounded"
                                placeholder="Nhập email"
                                type="email"
                            />
                        </div>

                        {/* Username field: Disabled in edit mode, editable in create mode */}
                        <div className="mb-2">
                            <label className="block font-semibold">Username</label>
                            {editingId ? (
                                <input
                                    name="username"
                                    value={form.username}
                                    disabled
                                    className="w-full border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
                                    placeholder="Username không thể chỉnh sửa"
                                />
                            ) : (
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full border px-2 py-1 rounded"
                                    placeholder="Nhập username"
                                />
                            )}
                        </div>

                        {/* Password field: Hidden in edit mode, editable in create mode */}
                        {!editingId && (
                            <div className="mb-2">
                                <label className="block font-semibold">Password</label>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    type="password"
                                    className="w-full border px-2 py-1 rounded"
                                    placeholder="Nhập password"
                                />
                            </div>
                        )}

                        <div className="mb-2 md:col-span-2">
                            <label className="block font-semibold">Ảnh đại diện</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const imageUrl = await handleImageUpload(file);
                                        if (imageUrl) {
                                            setForm((prev) => ({ ...prev, img_url: imageUrl }));
                                        }
                                    }
                                }}
                                className="w-full border px-2 py-1 rounded"
                            />
                            {form.img_url && (
                                <img
                                    src={`/assets/dentists/${form.img_url}`}
                                    alt="Ảnh đại diện"
                                    className="mt-2 w-24 h-24 object-cover rounded"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                            {editingId ? "Cập nhật" : "Thêm mới"}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => {
                                setShowForm(false);
                                setForm(initialForm);
                                setEditingId(null);
                            }}
                        >
                            Huỷ
                        </button>
                    </div>
                </form>
            )}

            {detailView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Chi tiết nha sĩ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center md:col-span-2">
                                {detailView.img_url ? (
                                    <img
                                        src={`/assets/dentists/${detailView.img_url}`}
                                        alt={detailView.full_name}
                                        className="w-24 h-24 object-cover rounded-full mx-auto"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                                        <span>No Img</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">ID:</p>
                                <p>{detailView.id}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tên nha sĩ:</p>
                                <p>{detailView.full_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Chuyên khoa:</p>
                                <p>{specializations.find((s) => s.id === detailView.specialization_id)?.name || ""}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Chi nhánh:</p>
                                <p>{branches.find((b) => b.id === detailView.branch_clinic_id)?.name || ""}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Số điện thoại:</p>
                                <p>{detailView.phone_number}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email:</p>
                                <p>{detailView.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Ngày tạo:</p>
                                <p>{detailView.created_at ? new Date(detailView.created_at).toLocaleString("vi-VN") : ""}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setDetailView(null)}
                                className="px-3 py-1 bg-gray-500 text-white rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border mt-4">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Ảnh</th>
                            <th className="p-2 border">Tên nha sĩ</th>
                            <th className="p-2 border">Chuyên khoa</th>
                            <th className="p-2 border">SĐT</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {paginatedDentists.map((dentist) => (
                            <tr key={dentist.id} className="hover:bg-gray-50">
                                <td className="p-2 border text-center">{dentist.id}</td>
                                <td className="p-2 border text-center">
                                    {dentist.img_url ? (
                                        <img
                                            src={`/assets/dentists/${dentist.img_url}`}
                                            alt={dentist.full_name}
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-xs">
                                            No Img
                                        </div>
                                    )}
                                </td>
                                <td className="p-2 border">{dentist.full_name}</td>
                                <td className="p-2 border">
                                    {specializations.find((s) => s.id === dentist.specialization_id)?.name || ""}
                                </td>
                                <td className="p-2 border">{dentist.phone_number}</td>
                                <td className="p-2 border text-center">
                                    <div className="flex justify-center space-x-1">
                                        <button
                                            onClick={() => setDetailView(dentist)}
                                            className="p-1 bg-blue-500 text-white rounded"
                                            title="Xem chi tiết"
                                        >
                                            <EyeIcon size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(dentist)}
                                            className="p-1 bg-yellow-500 text-white rounded"
                                            title="Sửa"
                                        >
                                            <PencilIcon size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dentist.id)}
                                            className="p-1 bg-red-600 text-white rounded"
                                            title="Xoá"
                                        >
                                            <TrashIcon size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedDentists.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4">
                                    Không có dữ liệu nha sĩ
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    Trước
                </button>
                <span>
                    Trang {currentPage} / {totalPages || 1}
                </span>
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default DentistManagement;