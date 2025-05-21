import React, { useState, useEffect, useRef } from "react";
import { getServices, createService, updateService, deleteService } from "../../services/serviceService";
import { getSpecializations } from "../../services/specializationService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const initialForm = { name: "", description: "", price: "", duration: "", specialization_id: "" };

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const formRef = useRef(null);

  // Map specialization_id to name
  const getSpecializationName = (specializationId) => {
    const specialization = specializations.find(spec => spec.id === Number(specializationId));
    return specialization ? specialization.name : "N/A";
  };

  // Fetch services and specializations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, specializationsData] = await Promise.all([
          getServices(),
          getSpecializations(),
        ]);
        setServices(servicesData);
        setSpecializations(specializationsData);
        // Check for mismatched specialization IDs
        const mismatchedIds = servicesData
          .map(service => service.specialization_id)
          .filter(id => !specializationsData.some(spec => spec.id === Number(id)));
        if (mismatchedIds.length > 0) {
          console.warn('[ServiceManagement] Mismatched specialization IDs:', mismatchedIds);
        }
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(services.length / rowsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      specialization_id: service.specialization_id,
    });
    setEditingId(service.id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá dịch vụ này?")) {
      try {
        await deleteService(id);
        setSuccessMsg("Xoá dịch vụ thành công!");
        await fetchData();
        setTimeout(() => setSuccessMsg(""), 2500);
      } catch (err) {
        setErrorMsg(err?.response?.data?.error || "Có lỗi xảy ra khi xoá!");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration, 10),
        specialization_id: parseInt(form.specialization_id, 10),
      };
      if (isNaN(payload.price) || isNaN(payload.duration) || isNaN(payload.specialization_id)) {
        setErrorMsg("Giá, thời lượng và chuyên môn phải là số hợp lệ!");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      if (editingId) {
        await updateService(editingId, payload);
        setSuccessMsg("Cập nhật dịch vụ thành công!");
      } else {
        await createService(payload);
        setSuccessMsg("Thêm dịch vụ thành công!");
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await fetchData();
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      const msg = err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleExportExcel = () => {
    const data = services.map(s => ({
      ID: s.id,
      "Tên dịch vụ": s.name,
      "Mô tả": s.description,
      "Giá": s.price,
      "Thời lượng": s.duration,
      "Chuyên môn": getSpecializationName(s.specialization_id),
      "Ngày tạo": s.created_at
        ? new Date(s.created_at).toLocaleString("vi-VN")
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Services");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "services.xlsx");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, specializationsData] = await Promise.all([
        getServices(),
        getSpecializations(),
      ]);
      setServices(servicesData);
      setSpecializations(specializationsData);
      const mismatchedIds = servicesData
        .map(service => service.specialization_id)
        .filter(id => !specializationsData.some(spec => spec.id === Number(id)));
      if (mismatchedIds.length > 0) {
        console.warn('[ServiceManagement] Mismatched specialization IDs:', mismatchedIds);
      }
      setError(null);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý dịch vụ</h1>
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
        Thêm dịch vụ
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
            <label className="block font-semibold">Tên dịch vụ</label>
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
          <div className="mb-2">
            <label className="block font-semibold">Giá</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              min="0"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Thời lượng (phút)</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              type="number"
              min="0"
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Chuyên môn</label>
            <select
              name="specialization_id"
              value={form.specialization_id || ""}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">Chọn chuyên môn</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
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
            <th className="p-2 border">Tên dịch vụ</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Thời lượng</th>
            <th className="p-2 border">Chuyên môn</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedServices.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50">
              <td className="p-2 border">{service.id}</td>
              <td className="p-2 border">{service.name}</td>
              <td className="p-2 border">{service.description}</td>
              <td className="p-2 border">{service.price}</td>
              <td className="p-2 border">{service.duration}</td>
              <td className="p-2 border">{getSpecializationName(service.specialization_id)}</td>
              <td className="p-2 border">
                {service.created_at
                  ? new Date(service.created_at).toLocaleString("vi-VN")
                  : ""}
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  className="text-white px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(service)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(service.id)}
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
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ServiceManagement;