import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClassItem } from '../types';
import { School, Plus, Search, Edit2, Archive, Users, CheckCircle, GraduationCap, X, Calendar } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const { classes, addClass, updateClass, archiveClass, students, setActiveTab, setSelectedClassId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    grade: 7,
    academicYear: '2026–2027',
    semester: 'Học kỳ I',
    teacherName: 'Vương Thị Ngân',
    description: '',
    status: 'active' as 'active' | 'archived'
  });

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGradeFilter === 'all' || cls.grade.toString() === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: 7,
      academicYear: '2026–2027',
      semester: 'Học kỳ I',
      teacherName: 'Vương Thị Ngân',
      description: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      academicYear: cls.academicYear,
      semester: cls.semester,
      teacherName: cls.teacherName,
      description: cls.description,
      status: cls.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <School className="w-6 h-6 text-[#1266D6]" />
            <span>Quản lý lớp học</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân công giảng dạy, theo dõi sĩ số và kết quả các lớp môn Tiếng Anh
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lớp mới</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo tên lớp hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Khối lớp:</label>
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
          >
            <option value="all">Tất cả các khối (6–9)</option>
            <option value="6">Khối 6</option>
            <option value="7">Khối 7</option>
            <option value="8">Khối 8</option>
            <option value="9">Khối 9</option>
          </select>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredClasses.map((cls) => {
          const actualStudentCount = students.filter(s => s.className === cls.name || s.classId === cls.id).length || cls.studentCount;

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                cls.status === 'archived' ? 'opacity-60 border-dashed border-slate-300' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1266D6] flex items-center justify-center font-bold text-base">
                      {cls.name}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0B2D5C]">Khối {cls.grade}</h4>
                      <div className="text-[11px] text-slate-500">{cls.semester} • {cls.academicYear}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cls.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cls.status === 'active' ? 'Đang học' : 'Lưu trữ'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 min-h-[32px]">
                  {cls.description || 'Chương trình Tiếng Anh Global Success.'}
                </p>

                <div className="mt-3.5 space-y-1.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sĩ số học sinh:</span>
                    </span>
                    <strong className="text-slate-800">{actualStudentCount} em</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Giáo viên:</span>
                    </span>
                    <strong className="text-slate-800">{cls.teacherName}</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setActiveTab('students');
                  }}
                  className="text-xs font-bold text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>Xem danh sách</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => archiveClass(cls.id)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title={cls.status === 'active' ? 'Lưu trữ lớp' : 'Khôi phục lớp'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2D5C]">
                {editingClass ? 'Chỉnh sửa thông tin lớp' : 'Thêm lớp học mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên lớp học * (VD: 7A, 6A2)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên lớp..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Học kỳ *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Học kỳ I">Học kỳ I</option>
                    <option value="Học kỳ II">Học kỳ II</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm học</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giáo viên phụ trách</label>
                  <input
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả / Đặc điểm lớp</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi chú về định hướng giảng dạy, chương trình thí điểm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingClass ? 'Lưu thay đổi' : 'Tạo lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
