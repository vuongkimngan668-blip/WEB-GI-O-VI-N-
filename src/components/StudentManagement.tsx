import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Users,
  Plus,
  Search,
  Upload,
  Download,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  parseStudentFile,
  exportStudentsToExcel,
  downloadStudentTemplate,
  StudentImportRow
} from '../services/excelService';

export const StudentManagement: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
    selectedClassId,
    setSelectedClassId,
    selectedStudent,
    setSelectedStudent
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit student modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Import Excel modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    valid: StudentImportRow[];
    errors: { row: number; data: any; reason: string }[];
    duplicates: number;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Student form state
  const [formData, setFormData] = useState<{
    studentCode: string;
    fullName: string;
    classId: string;
    className: string;
    grade: number;
    academicYear: string;
    level: 'Tốt' | 'Khá' | 'Trung bình' | 'Cần cố gắng';
    progressPercent: number;
    notes: string;
  }>({
    studentCode: '',
    fullName: '',
    classId: classes[0]?.id || 'class-7a',
    className: classes[0]?.name || '7A',
    grade: classes[0]?.grade || 7,
    academicYear: '2026–2027',
    level: 'Khá',
    progressPercent: 75,
    notes: ''
  });

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId || s.className === selectedClassId;
    const matchesLevel = levelFilter === 'all' || s.level === levelFilter;
    return matchesSearch && matchesClass && matchesLevel;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      studentCode: `7A${String(students.length + 1).padStart(2, '0')}`,
      fullName: '',
      classId: selectedClassId !== 'all' ? selectedClassId : (classes[0]?.id || 'class-7a'),
      className: classes.find(c => c.id === selectedClassId)?.name || '7A',
      grade: classes.find(c => c.id === selectedClassId)?.grade || 7,
      academicYear: '2026–2027',
      level: 'Khá',
      progressPercent: 75,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentCode: student.studentCode,
      fullName: student.fullName,
      classId: student.classId,
      className: student.className,
      grade: student.grade,
      academicYear: student.academicYear,
      level: student.level,
      progressPercent: student.progressPercent,
      notes: student.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.studentCode.trim()) return;

    const targetClass = classes.find(c => c.id === formData.classId);
    const resolvedClassName = targetClass ? targetClass.name : formData.className;
    const resolvedGrade = targetClass ? targetClass.grade : formData.grade;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        className: resolvedClassName,
        grade: resolvedGrade
      });
    } else {
      addStudent({
        ...formData,
        className: resolvedClassName,
        grade: resolvedGrade,
        status: 'active',
        strengths: ['Chăm chỉ học tập', 'Tích cực tham gia giờ học'],
        improvements: ['Củng cố từ vựng', 'Luyện thêm ngữ pháp'],
        skillScores: {
          vocabulary: 7.5,
          grammar: 7.5,
          reading: 7.5,
          listening: 7.5
        }
      });
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const res = await parseStudentFile(file);
      setImportPreview({
        valid: res.validRows,
        errors: res.errorRows,
        duplicates: res.duplicateCount
      });
    } catch (err: any) {
      alert('Lỗi đọc tệp Excel/CSV: ' + (err.message || 'Tệp không đúng định dạng.'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = () => {
    if (!importPreview || importPreview.valid.length === 0) return;

    const result = importStudents(importPreview.valid);
    alert(`Đã nhập thành công ${result.added} học sinh mới và cập nhật ${result.updated} hồ sơ!`);
    setIsImportModalOpen(false);
    setImportPreview(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi hệ thống?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#1266D6]" />
            <span>Danh sách học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý hồ sơ, mức độ học tập và theo dõi tiến bộ môn Tiếng Anh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template button */}
          <button
            onClick={() => downloadStudentTemplate()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
            title="Tải tệp mẫu Excel để nhập danh sách nhanh"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Tải mẫu Excel</span>
          </button>

          {/* Import Excel button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập từ Excel (.xlsx)</span>
          </button>

          {/* Export Excel button */}
          <button
            onClick={() => exportStudentsToExcel(filteredStudents)}
            className="px-3 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>

          {/* Add Student button */}
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-[#0B2D5C] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo mã học sinh hoặc họ tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-600">Lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-600">Mức độ:</span>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Tốt">Tốt</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cần cố gắng">Cần cố gắng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-700 text-xs uppercase border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold w-12 text-center">STT</th>
                <th className="py-3 px-3.5 font-bold w-28">Mã học sinh</th>
                <th className="py-3 px-4 font-bold">Họ và tên</th>
                <th className="py-3 px-3 font-bold text-center w-16">Lớp</th>
                <th className="py-3 px-3.5 font-bold text-center">Mức độ học tập</th>
                <th className="py-3 px-4 font-bold">Tiến bộ</th>
                <th className="py-3 px-3.5 font-bold text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s, index) => {
                  const stt = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(s)}
                    >
                      <td className="py-3 px-3.5 text-center text-slate-500 font-medium">
                        {stt}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-[#0B2D5C]">
                        {s.studentCode}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 group-hover:text-[#1266D6] transition-colors">
                        <div className="flex items-center space-x-2">
                          <span>{s.fullName}</span>
                          {s.isFeatured && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                              Tiêu biểu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">
                        {s.className}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            s.level === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.level === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : s.level === 'Trung bình'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                s.progressPercent >= 85
                                  ? 'bg-emerald-500'
                                  : s.progressPercent >= 70
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${s.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 min-w-8">
                            {s.progressPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Xem chi tiết hồ sơ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.fullName)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Counter */}
        <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Hiển thị <strong>{paginatedStudents.length}</strong> / <strong>{filteredStudents.length}</strong> học sinh
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 border border-blue-300">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
                    alt={selectedStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B2D5C]">{selectedStudent.fullName}</h3>
                  <div className="text-xs text-slate-500">
                    Lớp: {selectedStudent.className} • Mã HS: {selectedStudent.studentCode} • Khối {selectedStudent.grade}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic Snapshot */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                <div className="text-[11px] text-slate-500 font-semibold">Mức độ học tập</div>
                <div className="text-sm font-bold text-blue-700 mt-0.5">{selectedStudent.level}</div>
              </div>
              <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                <div className="text-[11px] text-slate-500 font-semibold">Tiến độ hoàn thành</div>
                <div className="text-sm font-bold text-indigo-700 mt-0.5">{selectedStudent.progressPercent}%</div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[11px] text-slate-500 font-semibold">Tầng phân hoá</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  {selectedStudent.progressPercent >= 85 ? 'Stretch' : selectedStudent.progressPercent >= 70 ? 'Core' : 'Support'}
                </div>
              </div>
              <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                <div className="text-[11px] text-slate-500 font-semibold">Trạng thái</div>
                <div className="text-sm font-bold text-amber-700 mt-0.5">Đang học</div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="mt-4">
              <h4 className="font-bold text-xs text-[#0B2D5C] uppercase tracking-wider mb-2">
                Năng lực 4 kỹ năng môn Tiếng Anh (Thang điểm 10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Từ vựng (Vocabulary)</div>
                  <div className="text-base font-bold text-[#1266D6] mt-1">
                    {selectedStudent.skillScores?.vocabulary ?? 8.0}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Ngữ pháp (Grammar)</div>
                  <div className="text-base font-bold text-[#1266D6] mt-1">
                    {selectedStudent.skillScores?.grammar ?? 8.0}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Đọc hiểu (Reading)</div>
                  <div className="text-base font-bold text-[#1266D6] mt-1">
                    {selectedStudent.skillScores?.reading ?? 8.0}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Nghe hiểu (Listening)</div>
                  <div className="text-base font-bold text-[#1266D6] mt-1">
                    {selectedStudent.skillScores?.listening ?? 8.0}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-800 flex items-center space-x-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Điểm mạnh ghi nhận</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  {selectedStudent.strengths?.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <div className="font-bold text-rose-800 flex items-center space-x-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Nội dung cần bồi dưỡng thêm</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  {selectedStudent.improvements?.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedStudent.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-800">Ghi chú của giáo viên: </span>
                {selectedStudent.notes}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-[#1266D6] text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2D5C]">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã định danh học sinh * (VD: 7A01)</label>
                <input
                  type="text"
                  required
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="VD: Nguyễn Văn An"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lớp học *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const sel = classes.find(c => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        classId: e.target.value,
                        className: sel?.name || '7A',
                        grade: sel?.grade || 7
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức độ học tập</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Cần cố gắng">Cần cố gắng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiến bộ học tập (% hoàn thành bài)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú sư phạm</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú sở thích, kỹ năng nổi trội..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingStudent ? 'Cập nhật' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT EXCEL MODAL WITH PREVIEW & VALIDATION */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#0B2D5C]">
                  Nhập danh sách học sinh từ Excel (.xlsx) / CSV
                </h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Instructions and file input */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-slate-700 space-y-1.5">
                <div className="font-bold text-[#0B2D5C]">Hướng dẫn định dạng tệp tải lên:</div>
                <p>• Các cột tiêu chuẩn: <strong>Mã học sinh</strong>, <strong>Họ và tên</strong>, <strong>Lớp</strong>, <strong>Mức độ</strong>, <strong>Tiến bộ</strong>.</p>
                <p>• Hỗ trợ đầy đủ tiếng Việt có dấu Unicode.</p>
                <div className="pt-1">
                  <button
                    onClick={() => downloadStudentTemplate()}
                    className="text-[#1266D6] hover:underline font-bold inline-flex items-center space-x-1"
                  >
                    <span>↓ Tải xuống tệp mẫu Excel mẫu tại đây nếu chưa có</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#1266D6] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="excelFileInput" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-bold text-slate-700 text-sm">
                    {isImporting ? 'Đang đọc và thẩm định dữ liệu...' : 'Chọn tệp Excel (.xlsx) hoặc CSV từ máy tính'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Kéo thả tệp vào đây hoặc bấm để chọn tệp</div>
                </label>
              </div>

              {/* Validation Summary and Preview Table */}
              {importPreview && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{importPreview.valid.length} bản ghi hợp lệ</span>
                    </span>
                    {importPreview.errors.length > 0 && (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-lg flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{importPreview.errors.length} dòng có lỗi</span>
                      </span>
                    )}
                    {importPreview.duplicates > 0 && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg">
                        {importPreview.duplicates} mã trùng lặp
                      </span>
                    )}
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0">
                        <tr>
                          <th className="py-2 px-2.5">Mã HS</th>
                          <th className="py-2 px-2.5">Họ và tên</th>
                          <th className="py-2 px-2.5">Lớp</th>
                          <th className="py-2 px-2.5">Mức độ</th>
                          <th className="py-2 px-2.5">Tiến bộ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importPreview.valid.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-semibold text-[#0B2D5C]">{row.studentCode}</td>
                            <td className="py-1.5 px-2.5 font-bold text-slate-800">{row.fullName}</td>
                            <td className="py-1.5 px-2.5 text-slate-600">{row.className}</td>
                            <td className="py-1.5 px-2.5">{row.level}</td>
                            <td className="py-1.5 px-2.5">{row.progressPercent}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Errors display if any */}
                  {importPreview.errors.length > 0 && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-700">
                      <div className="font-bold mb-1">Chi tiết các dòng bị lỗi (đã tự động bỏ qua):</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {importPreview.errors.slice(0, 5).map((err, idx) => (
                          <li key={idx}>Dòng {err.row}: {err.reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={!importPreview || importPreview.valid.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-sm"
                >
                  Xác nhận lưu vào hệ thống
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
