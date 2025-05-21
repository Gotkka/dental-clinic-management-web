import React, { useState, useRef } from "react";
import useSpecializations from "../../hooks/useSpecializations"; 
import { createSpecialization, updateSpecialization, deleteSpecialization } from "../../services/specializationService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialForm = { name: "", description: "" };

const SpecializationManagement = () => {
  const { specializations, loading, error, refetch } = useSpecializations();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const formRef = useRef(null);

  const totalPages = Math.ceil(specializations.length / rowsPerPage);
  const paginatedSpecializations = specializations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (specialization) => {
    setForm({
      name: specialization.name,
      description: specialization.description || "",
    });
    setEditingId(specialization.id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa chuyên khoa này?")) {
      await deleteSpecialization(id);
      refetch();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await updateSpecialization(editingId, form);
        setSuccessMsg("Cập nhật chuyên khoa thành công!");
      } else {
        await createSpecialization(form);
        setSuccessMsg("Thêm chuyên khoa thành công!");
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      refetch();
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      const msg = err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleExportExcel = () => {
    const data = specializations.map(s => ({
      ID: s.id,
      "Tên chuyên khoa": s.name,
      "Mô tả": s.description,
      "Ngày tạo": s.created_at
        ? new Date(s.created_at).toLocaleString("vi-VN")
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Specializations");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "specializations.xlsx");
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý chuyên khoa</h1>
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
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          setShowForm(true);
          setForm(initialForm);
          setEditingId(null);
        }}
      >
        Thêm chuyên khoa
      </button>
      <button
        className="mb-4 ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleExportExcel}
      >
        Xuất Excel
      </button>

      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-50 p-4 rounded shadow"
        >
          <div className="mb-2">
            <label className="block font-semibold">Tên chuyên khoa</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Mô tả</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="flex gap-2 mt-2">
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
              Hủy
            </button>
          </div>
        </form>
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên chuyên khoa</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSpecializations.map((specialization) => (
            <tr key={specialization.id} className="hover:bg-gray-50">
              <td className="p-2 border">{specialization.id}</td>
              <td className="p-2 border">{specialization.name}</td>
              <td className="p-2 border">{specialization.description}</td>
              <td className="p-2 border">
                {specialization.created_at
                  ? new Date(specialization.created_at).toLocaleString("vi-VN")
                  : ""}
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  className="text-white px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(specialization)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(specialization.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SpecializationManagement;