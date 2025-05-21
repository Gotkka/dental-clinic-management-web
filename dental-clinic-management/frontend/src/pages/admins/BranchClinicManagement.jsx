import React, { useState, useRef } from "react";
import { useBranches } from "../../hooks/useBranchClinics";
import { createBranch, updateBranch, deleteBranch } from "../../services/branchClinicService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialForm = {name: "", address: "", phone_number: "", email: "" };

const BranchClinicManagement = () => {
  const { branches, loading, error, refetch } = useBranches();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // Thêm state cho thông báo
  const [errorMsg, setErrorMsg] = useState(""); // Thêm state cho lỗi
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const formRef = useRef(null);

  const totalPages = Math.ceil(branches.length / rowsPerPage);
  const paginatedBranches = branches.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (branch) => {
    setForm({
      name: branch.name,
      address: branch.address,
      phone_number: branch.phone_number,
      email: branch.email || "",
    });
    setEditingId(branch.id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100); // Đợi form render xong rồi mới scroll
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá chi nhánh này?")) {
      await deleteBranch(id);
      refetch();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset lỗi cũ
    try {
      if (editingId) {
        await updateBranch(editingId, form);
        setSuccessMsg("Cập nhật chi nhánh thành công!");
      } else {
        await createBranch(form);
        setSuccessMsg("Thêm chi nhánh thành công!");
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      refetch();
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      // Nếu backend trả về lỗi, lấy message từ response
      const msg = err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(branches);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "branches.xlsx");
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý chi nhánh</h1>
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
        Thêm chi nhánh
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
            <label className="block font-semibold">Tên chi nhánh</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Số điện thoại</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              type="email"
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
              Huỷ
            </button>
          </div>
        </form>
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên chi nhánh</th>
            <th className="p-2 border">Địa chỉ</th>
            <th className="p-2 border">Số điện thoại</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBranches.map((branch) => (
            <tr key={branch.id} className="hover:bg-gray-50">
              <td className="p-2 border">{branch.id}</td>
              <td className="p-2 border">{branch.name}</td>
              <td className="p-2 border">{branch.address}</td>
              <td className="p-2 border">{branch.phone_number}</td>
              <td className="p-2 border">{branch.email}</td>
              <td className="p-2 border">
                {branch.created_at
                  ? new Date(branch.created_at).toLocaleString("vi-VN")
                  : ""}
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  className="text-white px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(branch)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(branch.id)}
                >
                  Xoá
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

export default BranchClinicManagement;