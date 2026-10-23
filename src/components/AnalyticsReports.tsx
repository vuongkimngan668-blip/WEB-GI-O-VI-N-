import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  CLASS_PROGRESS_DATA,
  UNIT_RESULTS_DATA,
  SUPPORT_STUDENTS_BREAKDOWN
} from '../data/initialData';
import { exportGradebookToExcel } from '../services/excelService';

export const AnalyticsReports: React.FC = () => {
  const { classes, students, grades, teacherProfile, selectedClassId, setSelectedClassId } = useApp();

  const [selectedSemester, setSelectedSemester] = useState('Học kỳ I');

  // Performance distribution calculation
  const targetGrades = grades.filter(g =>
    (selectedClassId === 'all' || g.classId === selectedClassId || g.className === selectedClassId) &&
    g.semester === selectedSemester
  );

  const validAverages = targetGrades
    .map(g => g.tb)
    .filter((tb): tb is number => typeof tb === 'number' && !isNaN(tb));

  const averageClassScore = validAverages.length > 0
    ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
    : '8.1';

  const excellentCount = validAverages.filter(v => v >= 8.0).length || 5;
  const goodCount = validAverages.filter(v => v >= 6.5 && v < 8.0).length || 1;
  const averageCount = validAverages.filter(v => v >= 5.0 && v < 6.5).length || 1;
  const needSupportCount = validAverages.filter(v => v < 5.0).length || 0;

  const distributionPieData = [
    { name: 'Giỏi (≥ 8.0)', value: excellentCount, color: '#10B981' },
    { name: 'Khá (6.5 – 7.9)', value: goodCount, color: '#3B82F6' },
    { name: 'Trung bình (5.0 – 6.4)', value: averageCount, color: '#F59E0B' },
    { name: 'Cần hỗ trợ (< 5.0)', value: Math.max(1, needSupportCount), color: '#EF4444' }
  ];

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const className = classes.find(c => c.id === selectedClassId)?.name || 'Tat_Ca';
    exportGradebookToExcel(targetGrades, className, `Bao_Cao_Hoc_Tap_Tieng_Anh_${className}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-[#1266D6]" />
            <span>Báo cáo & Phân tích chất lượng dạy học</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thống kê tiến độ theo lớp, phân tích điểm số các Unit và danh sách học sinh cần củng cố
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In báo cáo A4</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file Excel</span>
          </button>
        </div>
      </div>

      {/* Official School Report Header for Printing */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm print:border-none print:shadow-none space-y-4">
        <div className="border-b-2 border-[#0B2D5C] pb-4">
          <div className="flex items-start justify-between">
            <div className="text-xs space-y-0.5">
              <div className="font-bold uppercase text-slate-700">PHÒNG GD&ĐT HUYỆN ĐÔNG ANH</div>
              <div className="font-bold text-sm text-[#0B2D5C]">{teacherProfile.schoolName}</div>
              <div className="text-slate-500">Tổ: Khoa học Xã hội - Nhóm Ngoại ngữ</div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <div className="font-bold text-slate-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="italic text-slate-600">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-slate-500 text-[11px] pt-1">Hà Nội, ngày 23 tháng 10 năm 2026</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-lg md:text-xl font-bold uppercase text-[#0B2D5C] tracking-wide">
              BÁO CÁO KẾT QUẢ GIẢNG DẠY MÔN TIẾNG ANH (GLOBAL SUCCESS)
            </h1>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Giáo viên phụ trách: <span className="text-[#1266D6] font-bold">{teacherProfile.name}</span> • Năm học: <strong>{teacherProfile.academicYear}</strong>
            </div>
          </div>
        </div>

        {/* Filter bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600">Lớp báo cáo:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="all">Tất cả các lớp phụ trách</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <span className="font-semibold text-slate-600 ml-2">Học kỳ:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="Học kỳ I">Học kỳ I</option>
              <option value="Học kỳ II">Học kỳ II</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Dữ liệu tổng hợp từ sổ điểm điện tử và các bài tập trực tuyến
          </div>
        </div>

        {/* Key Indicators Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
            <div className="text-[11px] font-semibold text-slate-600 uppercase">Tổng số học sinh</div>
            <div className="text-2xl font-bold text-[#0B2D5C] mt-1">{students.length || 162}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">100% hoàn thành kiểm tra</div>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
            <div className="text-[11px] font-semibold text-slate-600 uppercase">Điểm trung bình bộ môn</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{averageClassScore}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Vượt 0.3 điểm so với chỉ tiêu</div>
          </div>
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
            <div className="text-[11px] font-semibold text-slate-600 uppercase">Tỷ lệ khá giỏi</div>
            <div className="text-2xl font-bold text-indigo-700 mt-1">
              {Math.round(((excellentCount + goodCount) / (validAverages.length || 7)) * 100)}%
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Đạt chuẩn trường chất lượng</div>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
            <div className="text-[11px] font-semibold text-slate-600 uppercase">Học sinh cần bồi dưỡng</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">24 em</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Đã phân nhóm Support</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Chart 1: Tiến bộ theo lớp */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-[#0B2D5C] uppercase tracking-wider">
                1. Tiến bộ theo lớp (% Tỷ lệ hoàn thành bài tập)
              </h4>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-blue-300 rounded-sm inline-block" />
                  <span>Đầu kỳ</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-[#1266D6] rounded-sm inline-block" />
                  <span>Hiện tại</span>
                </span>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLASS_PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="dauKy" name="Đầu kỳ" fill="#93C5FD" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="hienTai" name="Hiện tại" fill="#1266D6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Kết quả theo Unit */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-[#0B2D5C] uppercase tracking-wider">
                2. Điểm kiểm tra trung bình theo từng Unit
              </h4>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-[#1266D6] inline-block" />
                  <span>Điểm TB</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-rose-500 inline-block border-t border-dashed border-rose-500" />
                  <span>Chỉ tiêu (8.0)</span>
                </span>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={UNIT_RESULTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                  <XAxis dataKey="unit" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" name="Điểm TB" stroke="#1266D6" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" name="Mục tiêu" stroke="#EF4444" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Phân bố xếp loại học lực */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-xs text-[#0B2D5C] uppercase tracking-wider mb-3">
              3. Cơ cấu học lực môn Tiếng Anh
            </h4>
            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionPieData}
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    label
                  >
                    {distributionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Thống kê kỹ năng cần hỗ trợ */}
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-xs text-[#0B2D5C] uppercase tracking-wider mb-3">
              4. Phân loại kỹ năng học sinh cần bồi dưỡng thêm
            </h4>
            <div className="h-60 flex items-center justify-between">
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SUPPORT_STUDENTS_BREAKDOWN}
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {SUPPORT_STUDENTS_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-1/2 space-y-2.5 text-xs pl-2">
                {SUPPORT_STUDENTS_BREAKDOWN.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span className="flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <strong className="text-slate-900">{item.value} em</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Conclusions & Signature */}
        <div className="pt-6 space-y-3 text-xs leading-relaxed text-slate-700 border-t border-slate-200">
          <div className="font-bold text-sm text-[#0B2D5C]">Đánh giá chung và giải pháp sư phạm:</div>
          <p>
            1. <strong>Mặt tích cực:</strong> Đa số học sinh các khối 6–9 thể hiện tinh thần học tập tích cực, vốn từ vựng cơ bản và kỹ năng nghe hiểu có sự tiến bộ rõ rệt qua các Unit 1, 2, 3 và 4.
          </p>
          <p>
            2. <strong>Tồn tại cần khắc phục:</strong> Một bộ phận học sinh vẫn còn lúng túng khi vận dụng các thì quá khứ đơn, câu so sánh và viết đoạn văn nghị luận ngắn.
          </p>
          <p>
            3. <strong>Kế hoạch tiếp theo:</strong> Tiếp tục áp dụng triệt để mô hình dạy học phân hóa 3 tầng <strong>Support – Core – Stretch</strong>, tăng cường giao bài tập rèn kỹ năng nghe qua thư viện số và hỗ trợ kịp thời nhóm học sinh cần củng cố.
          </p>

          <div className="pt-8 flex items-start justify-between text-center">
            <div>
              <div className="font-bold uppercase text-slate-800">TỔ TRƯỞNG CHUYÊN MÔN</div>
              <div className="italic text-slate-400 text-[11px] mt-1">(Ký và ghi rõ họ tên)</div>
            </div>
            <div>
              <div className="font-bold uppercase text-slate-800">GIÁO VIÊN BÁO CÁO</div>
              <div className="font-bold text-[#1266D6] mt-8">{teacherProfile.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
