import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  School,
  Sparkles,
  Database,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Shield,
  Upload,
  Info
} from 'lucide-react';
import { checkAiStatus, AiStatus } from '../services/aiService';

export const SettingsPage: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    resetToDemoData,
    clearDemoData,
    exportDatabaseJson,
    isDemoMode,
    userRole,
    setUserRole,
    setActiveTab
  } = useApp();

  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: teacherProfile.name,
    title: teacherProfile.title,
    schoolName: teacherProfile.schoolName,
    academicYear: teacherProfile.academicYear,
    email: teacherProfile.email,
    avatarUrl: teacherProfile.avatarUrl,
    schoolLogoUrl: teacherProfile.schoolLogoUrl
  });

  useEffect(() => {
    checkAiStatus().then(setAiStatus);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFormData(prev => ({ ...prev, avatarUrl: url }));
        updateTeacherProfile({ avatarUrl: url });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <Settings className="w-6 h-6 text-[#1266D6]" />
            <span>Cài đặt hệ thống & Hồ sơ giáo viên</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình thông tin trường học, hồ sơ giáo viên, trạng thái trí tuệ nhân tạo và sao lưu dữ liệu
          </p>
        </div>

        {saveSuccess && (
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã cập nhật thông tin thành công!</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Teacher & School Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-sm text-[#0B2D5C] pb-3 border-b border-slate-100 flex items-center space-x-2">
              <User className="w-4 h-4 text-[#1266D6]" />
              <span>Thông tin giáo viên & Trường học</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4 text-xs">
              {/* Avatar and Logo Upload Section */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <img
                      src={formData.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'}
                      alt={formData.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                    />
                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Ảnh chân dung giáo viên</div>
                    <div className="text-[11px] text-slate-500">Bấm vào ảnh để tải ảnh mới lên</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên giáo viên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chức danh / Chuyên môn</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên trường học *</label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm học áp dụng</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email liên hệ / Tài khoản</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            </form>
          </div>

          {/* Assessment & Formula Settings */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Quy chế đánh giá & Tính điểm học kỳ</span>
            </h3>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5 text-slate-700">
              <div className="font-bold text-[#0B2D5C]">Công thức tính điểm trung bình môn học kỳ:</div>
              <p className="font-mono bg-white p-2 rounded-lg border border-blue-200 text-slate-800">
                TB = (Tổng điểm TX + 2 × Điểm Giữa kỳ + 3 × Điểm Cuối kỳ) / (Số lượng điểm TX + 5)
              </p>
              <p className="text-[11px] text-slate-500">
                Quy tắc làm tròn: Làm tròn đến 1 chữ số thập phân (Ví dụ: 8.46 -&gt; 8.5).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI status & Data Management */}
        <div className="space-y-6">
          {/* AI Connection Status */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3.5 text-xs">
            <h3 className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#1266D6]" />
              <span>Trạng thái kết nối Trợ lý AI</span>
            </h3>

            <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
              aiStatus?.hasAiKey
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="mt-0.5">
                {aiStatus?.hasAiKey ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Info className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="leading-relaxed">
                <div className="font-bold">
                  {aiStatus?.hasAiKey ? 'Đã kết nối Gemini API an toàn' : 'Đang hoạt động với bộ mẫu sư phạm tích hợp'}
                </div>
                <div className="text-[11px] mt-0.5 opacity-90">
                  {aiStatus?.hasAiKey
                    ? 'Máy chủ đã sẵn sàng thực hiện các tác vụ tạo đề, phân hoá Support-Core-Stretch bằng mô hình Gemini 2.5 Flash.'
                    : 'Hệ thống đang phục vụ các gợi ý giáo án tiêu chuẩn. Để kết nối API trực tiếp, bạn có thể thiết lập GEMINI_API_KEY trong môi trường.'}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              Mô hình khuyến nghị: <strong>gemini-2.5-flash</strong> (Tối ưu tốc độ và độ chuẩn xác ngữ liệu tiếng Anh).
            </div>
          </div>

          {/* Database Backup & Demo Data Management */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#1266D6]" />
              <span>Quản lý dữ liệu & Sao lưu</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={exportDatabaseJson}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Sao lưu toàn bộ dữ liệu (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn khôi phục lại toàn bộ Dữ liệu minh họa ban đầu?')) {
                    resetToDemoData();
                    alert('Đã khôi phục dữ liệu mẫu thành công!');
                  }
                }}
                className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Khôi phục Dữ liệu minh họa</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('LƯU Ý: Thao tác này sẽ xóa danh sách học sinh và điểm số minh họa để chuẩn bị nhập danh sách thật từ Excel. Bạn có chắc chắn không?')) {
                    clearDemoData();
                    alert('Đã xóa dữ liệu mẫu. Bạn có thể sang mục "Danh sách học sinh" để nhập file Excel thật!');
                  }
                }}
                className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Xóa dữ liệu minh họa để nhập dữ liệu thật</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Trạng thái dữ liệu hiện tại: {isDemoMode ? <strong className="text-amber-600">Đang bật Dữ liệu minh họa</strong> : <strong className="text-emerald-600">Dữ liệu người dùng</strong>}
            </div>
          </div>

          {/* Typography Discipline Note */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Quy chuẩn thẩm mỹ & Font chữ:</div>
            <p>
              Hệ thống NHT English Learning Hub tuân thủ nghiêm ngặt chuẩn font chữ <strong>Times New Roman</strong> toàn diện, kết hợp tông màu xanh công nghệ (Technology Blue) chuẩn phong cách giáo dục THCS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
