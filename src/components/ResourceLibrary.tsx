import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LearningResource } from '../types';
import {
  Library,
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  Headphones,
  Video,
  Presentation,
  Trash2,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const { resources, addResource, deleteResource } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    grade: number;
    unit: string;
    topic: string;
    category: 'Textbook' | 'Worksheet' | 'Lesson Plan' | 'Audio' | 'Video' | 'Test Paper' | 'Presentation';
    fileType: 'pdf' | 'docx' | 'pptx' | 'mp3' | 'mp4' | 'link';
    fileSize: string;
    description: string;
    isDownloadable: boolean;
  }>({
    title: '',
    grade: 7,
    unit: 'Unit 1: Hobbies',
    topic: 'Tài liệu bổ trợ kỹ năng',
    category: 'Worksheet',
    fileType: 'pdf',
    fileSize: '2.5 MB',
    description: '',
    isDownloadable: true
  });

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || r.grade.toString() === selectedGrade;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesGrade && matchesCategory;
  });

  const handleDownload = (res: LearningResource) => {
    // Simulated safe download of teaching material document
    const blob = new Blob([
      `TRƯỜNG THCS NGUYỄN HUY TƯỞNG\nGIÁO VIÊN: VƯƠNG THỊ NGÂN\nNĂM HỌC 2026-2027\n\nTÀI LIỆU HỌC TẬP: ${res.title}\nKhối lớp: ${res.grade} | Unit: ${res.unit}\nChủ đề: ${res.topic}\nMô tả: ${res.description}\n\n(Nội dung tài liệu học tập chuẩn chương trình Tiếng Anh Global Success)`
    ], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.title.replace(/[/\\?%*:|"<>]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addResource(formData);
    setIsModalOpen(false);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'mp3':
        return <Headphones className="w-5 h-5 text-amber-500" />;
      case 'mp4':
        return <Video className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <Library className="w-6 h-6 text-[#1266D6]" />
            <span>Thư viện học liệu số môn Tiếng Anh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kho tài nguyên giáo án, bài giảng PowerPoint, đề thi, phiếu bài tập và audio Global Success 6–9
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm học liệu mới</span>
        </button>
      </div>

      {/* 4 Textbook Category Banners (Global Success 6 - 9) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { grade: 6, title: 'Global Success 6', count: '120 tài liệu', color: 'from-blue-600 to-indigo-700', desc: 'Sách giáo khoa, bài tập, audio Lớp 6' },
          { grade: 7, title: 'Global Success 7', count: '145 tài liệu', color: 'from-emerald-600 to-teal-700', desc: 'Đề thi, giáo án 5512, PPT Lớp 7' },
          { grade: 8, title: 'Global Success 8', count: '138 tài liệu', color: 'from-amber-600 to-orange-700', desc: 'Chuyên đề ngữ pháp, đọc hiểu Lớp 8' },
          { grade: 9, title: 'Global Success 9', count: '160 tài liệu', color: 'from-purple-600 to-indigo-800', desc: 'Luyện thi tuyển sinh vào 10 Lớp 9' }
        ].map((book) => (
          <div
            key={book.grade}
            onClick={() => setSelectedGrade(book.grade.toString())}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedGrade === book.grade.toString()
                ? 'border-[#1266D6] ring-2 ring-blue-200 bg-blue-50/50 shadow-md'
                : 'border-slate-100 bg-white hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${book.color} text-white flex items-center justify-center shadow mb-2`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#0B2D5C]">{book.title}</h4>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">{book.count}</div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{book.desc}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Tìm theo tên học liệu, chủ đề hoặc Unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
          >
            <option value="all">Tất cả các khối</option>
            <option value="6">Khối 6</option>
            <option value="7">Khối 7</option>
            <option value="8">Khối 8</option>
            <option value="9">Khối 9</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
          >
            <option value="all">Tất cả định dạng tài nguyên</option>
            <option value="Lesson Plan">Giáo án / Kế hoạch bài dạy</option>
            <option value="Test Paper">Ngân hàng đề kiểm tra</option>
            <option value="Presentation">Bài giảng điện tử PPT</option>
            <option value="Worksheet">Phiếu bài tập phân hóa</option>
            <option value="Audio">Tệp âm thanh Audio</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getFileIcon(res.fileType)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Lớp {res.grade} • {res.category}
                    </span>
                    <h3 className="font-bold text-sm text-[#0B2D5C] mt-1 line-clamp-1">
                      {res.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1">
                <div className="text-slate-500 font-medium">Unit: <strong className="text-slate-700">{res.unit}</strong></div>
                <div className="text-slate-500 font-medium">Chủ đề: <strong className="text-slate-700">{res.topic}</strong></div>
                <p className="text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">{res.fileSize || '3.2 MB'} • {res.uploadDate}</span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Xem trước tài liệu"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(res)}
                  className="px-3 py-1.5 bg-[#1266D6] hover:bg-blue-700 text-white rounded-lg font-bold flex items-center space-x-1 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa học liệu "${res.title}"?`)) deleteResource(res.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {previewResource && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {getFileIcon(previewResource.fileType)}
                <h3 className="font-bold text-base text-[#0B2D5C] truncate max-w-xs">
                  {previewResource.title}
                </h3>
              </div>
              <button onClick={() => setPreviewResource(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div><strong>Khối lớp:</strong> Lớp {previewResource.grade} (Global Success)</div>
                <div><strong>Unit bài học:</strong> {previewResource.unit}</div>
                <div><strong>Chủ đề:</strong> {previewResource.topic}</div>
                <div><strong>Định dạng tệp:</strong> {previewResource.fileType.toUpperCase()} ({previewResource.fileSize || '3.2 MB'})</div>
                <div><strong>Ngày đăng tải:</strong> {previewResource.uploadDate}</div>
              </div>

              <div>
                <strong className="block mb-1">Mô tả chi tiết:</strong>
                <p className="leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  {previewResource.description || 'Tài liệu chuẩn bị giảng dạy môn Tiếng Anh Trường THCS Nguyễn Huy Tưởng.'}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setPreviewResource(null);
                  }}
                  className="px-5 py-2 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tệp tin về máy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD RESOURCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2D5C]">
                Thêm học liệu mới vào thư viện
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên tài liệu / Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Giáo án Tiếng Anh 7 Unit 2 - Healthy Living"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Loại tài nguyên</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Lesson Plan">Giáo án 5512</option>
                    <option value="Test Paper">Đề kiểm tra</option>
                    <option value="Presentation">Slide PPT</option>
                    <option value="Worksheet">Phiếu bài tập</option>
                    <option value="Audio">Audio Nghe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit bài học</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="VD: Unit 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Định dạng file</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="mp3">Audio (.mp3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chủ đề bài học (Topic)</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="VD: Healthy habits and diet"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt nội dung</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi chú về mục tiêu, đối tượng học sinh áp dụng..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Lưu học liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
