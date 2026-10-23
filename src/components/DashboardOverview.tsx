import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Users,
  FileText,
  TrendingUp,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Download,
  Award,
  Layers,
  ArrowRight,
  CalendarCheck
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
  Cell
} from 'recharts';
import {
  CLASS_PROGRESS_DATA,
  UNIT_RESULTS_DATA,
  SUPPORT_STUDENTS_BREAKDOWN
} from '../data/initialData';
import { sendAiChatMessage } from '../services/aiService';
import { exportGradebookToExcel } from '../services/excelService';

export const DashboardOverview: React.FC = () => {
  const {
    classes,
    students,
    grades,
    quizzes,
    setActiveTab,
    setSelectedStudent,
    setActiveQuizId,
    teacherProfile
  } = useApp();

  // Selected class for table views on dashboard
  const [selectedClass, setSelectedClass] = useState<string>('7A');
  const [aiInput, setAiInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Filter students for the current selected class (default 7A)
  const classStudents = students.filter(s => s.className === selectedClass).slice(0, 5);
  const classGrades = grades.filter(g => g.className === selectedClass).slice(0, 5);

  // Featured student
  const featuredStudent = students.find(s => s.isFeatured) || students[0];

  const handleAskAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim()) return;

    const query = aiInput;
    setAiInput('');
    setIsAiLoading(true);

    try {
      const reply = await sendAiChatMessage(query, `Lớp ${selectedClass}, môn Tiếng Anh THCS Global Success`);
      setAiResponse(reply);
    } catch (err: any) {
      setAiResponse('Hệ thống đang hoạt động ở chế độ ngoại tuyến. Bạn có thể thiết lập GEMINI_API_KEY để kích hoạt tính năng thông minh.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStartPractice = (category: string) => {
    // Find matching quiz
    const matched = quizzes.find(q => q.category.toLowerCase() === category.toLowerCase()) || quizzes[0];
    if (matched) {
      setActiveQuizId(matched.id);
      setActiveTab('take-quiz');
    }
  };

  const handleExportDashboard = () => {
    exportGradebookToExcel(grades, selectedClass, `Bao_Cao_Tong_Quan_Lop_${selectedClass}_NHT.xlsx`);
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 4 TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Số lớp */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Số lớp</div>
              <div className="text-2xl font-bold text-[#0B2D5C] mt-0.5">{classes.length || 4}</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center mt-0.5">
                <span>↑ +1 so với học kỳ trước</span>
              </div>
            </div>
          </div>
          <div className="text-slate-200 opacity-60">
            <Users className="w-10 h-10" />
          </div>
        </div>

        {/* Card 2: Học sinh */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Học sinh</div>
              <div className="text-2xl font-bold text-[#0B2D5C] mt-0.5">162</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center mt-0.5">
                <span>↑ +12 so với học kỳ trước</span>
              </div>
            </div>
          </div>
          <div className="text-slate-200 opacity-60">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>

        {/* Card 3: Bài tập đã giao */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bài tập đã giao</div>
              <div className="text-2xl font-bold text-[#0B2D5C] mt-0.5">248</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center mt-0.5">
                <span>↑ +36 so với tháng trước</span>
              </div>
            </div>
          </div>
          <div className="text-slate-200 opacity-60">
            <FileText className="w-10 h-10" />
          </div>
        </div>

        {/* Card 4: Tỷ lệ hoàn thành */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tỷ lệ hoàn thành</div>
              <div className="text-2xl font-bold text-[#0B2D5C] mt-0.5">87%</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center mt-0.5">
                <span>↑ +5% so với tháng trước</span>
              </div>
            </div>
          </div>
          {/* Circular mini progress indicator */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset="16.3"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-700">87%</span>
          </div>
        </div>
      </div>

      {/* ROW 1: Panel A (Danh sách học sinh) & Panel B (Kết quả học tập) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel A: Danh sách học sinh (Lớp 7A) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#1266D6]" />
                <h3 className="font-bold text-base text-[#0B2D5C]">
                  Danh sách học sinh (Lớp {selectedClass})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center space-x-1 transition-colors"
                  title="Điểm danh ngay cho lớp này"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Điểm danh</span>
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-600 text-xs uppercase border-b border-slate-200">
                    <th className="py-2 px-2.5 font-bold w-12">STT</th>
                    <th className="py-2 px-3 font-bold">Họ và tên</th>
                    <th className="py-2 px-2.5 font-bold text-center w-14">Lớp</th>
                    <th className="py-2 px-3 font-bold text-center">Mức độ</th>
                    <th className="py-2 px-3 font-bold">Tiến bộ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((s, idx) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-2.5 text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-800 hover:text-[#1266D6]">
                        {s.fullName}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-600">{s.className}</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            s.level === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.level === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.level}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.progressPercent >= 85
                                  ? 'bg-emerald-500'
                                  : s.progressPercent >= 70
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${s.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 min-w-8">
                            {s.progressPercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel B: Kết quả học tập (Lớp 7A) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#1266D6]" />
                <h3 className="font-bold text-base text-[#0B2D5C]">
                  Kết quả học tập (Lớp {selectedClass})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('grades')}
                className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-600 text-xs uppercase border-b border-slate-200">
                    <th className="py-2 px-3 font-bold">Họ và tên</th>
                    <th className="py-2 px-3 font-bold text-center">TX</th>
                    <th className="py-2 px-3 font-bold text-center">GK</th>
                    <th className="py-2 px-3 font-bold text-center">CK</th>
                    <th className="py-2 px-3 font-bold text-center">TB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-800">{g.studentName}</td>
                      <td className="py-2 px-3 text-center text-slate-700 font-medium">
                        {g.tx1 !== null && g.tx1 !== undefined ? g.tx1.toFixed(1) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-700 font-medium">
                        {g.gk !== null && g.gk !== undefined ? g.gk.toFixed(1) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-700 font-medium">
                        {g.ck !== null && g.ck !== undefined ? g.ck.toFixed(1) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                            (g.tb ?? 0) >= 8.0
                              ? 'bg-emerald-100 text-emerald-800'
                              : (g.tb ?? 0) >= 6.5
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {g.tb !== null && g.tb !== undefined ? g.tb.toFixed(1) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Panel C (Kiểm tra trực tuyến) & Panel D (Thư viện học liệu) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel C: Kiểm tra trực tuyến / Luyện tập */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎮</span>
              <h3 className="font-bold text-base text-[#0B2D5C]">
                Kiểm tra trực tuyến / Luyện tập
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('quizzes')}
              className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Vocabulary */}
            <div className="border border-slate-200/80 rounded-xl p-3 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-400 transition-all flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2D5C]">Vocabulary</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Luyện từ vựng theo chủ đề</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-600 font-semibold">25 bài tập</span>
                <button
                  onClick={() => handleStartPractice('Vocabulary')}
                  className="px-3 py-1 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Làm bài
                </button>
              </div>
            </div>

            {/* Grammar */}
            <div className="border border-slate-200/80 rounded-xl p-3 bg-gradient-to-br from-purple-50/50 to-white hover:border-purple-400 transition-all flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2D5C]">Grammar</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ngữ pháp trọng tâm</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-600 font-semibold">28 bài tập</span>
                <button
                  onClick={() => handleStartPractice('Grammar')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Làm bài
                </button>
              </div>
            </div>

            {/* Reading */}
            <div className="border border-slate-200/80 rounded-xl p-3 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2D5C]">Reading</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Đọc hiểu đa dạng chủ đề</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-600 font-semibold">20 bài tập</span>
                <button
                  onClick={() => handleStartPractice('Reading')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Làm bài
                </button>
              </div>
            </div>

            {/* Listening */}
            <div className="border border-slate-200/80 rounded-xl p-3 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-400 transition-all flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2D5C]">Listening</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Luyện nghe với audio</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-600 font-semibold">18 bài tập</span>
                <button
                  onClick={() => handleStartPractice('Listening')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Làm bài
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel D: Thư viện học liệu (Global Success 6 - 9) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#1266D6]" />
              <h3 className="font-bold text-base text-[#0B2D5C]">Thư viện học liệu</h3>
            </div>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { grade: 6, title: 'Global Success 6', count: '120 tài liệu', color: 'from-blue-600 to-indigo-700', badge: 'Tiếng Anh 6' },
              { grade: 7, title: 'Global Success 7', count: '145 tài liệu', color: 'from-emerald-600 to-teal-700', badge: 'Tiếng Anh 7' },
              { grade: 8, title: 'Global Success 8', count: '138 tài liệu', color: 'from-amber-600 to-orange-700', badge: 'Tiếng Anh 8' },
              { grade: 9, title: 'Global Success 9', count: '160 tài liệu', color: 'from-purple-600 to-indigo-800', badge: 'Tiếng Anh 9' }
            ].map((book) => (
              <div
                key={book.grade}
                className="border border-slate-200/90 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/50"
              >
                {/* Book Cover Stylized Header */}
                <div className={`bg-gradient-to-b ${book.color} text-white p-3 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[90px]`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/20 px-2 py-0.5 rounded-full mb-1">
                    {book.badge}
                  </div>
                  <BookOpen className="w-7 h-7 text-white drop-shadow" />
                  <div className="text-xs font-bold text-white mt-1 drop-shadow-sm">GLOBAL SUCCESS</div>
                </div>

                <div className="p-2 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#0B2D5C] group-hover:text-[#1266D6] line-clamp-1">
                      {book.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {book.count}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="w-full mt-2 py-1 bg-[#1266D6] hover:bg-blue-700 text-white text-[11px] font-bold rounded shadow-sm transition-colors"
                  >
                    Xem ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Panel E (Trợ lý AI) & Panel F (Hồ sơ học sinh tiêu biểu) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel E: Trợ lý AI - Hỗ trợ học tập */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-[#1266D6]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0B2D5C]">
                  Trợ lý AI - Hỗ trợ học tập
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Hỏi thêm</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Chat greeting bubble */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-start space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#1266D6] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                AI
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-[#0B2D5C]">Xin chào cô {teacherProfile.name}!</p>
                <p className="mt-0.5">Tôi có thể hỗ trợ gì cho việc dạy và học Tiếng Anh hôm nay?</p>
              </div>
            </div>

            {/* Differentiation Framework: Support - Core - Stretch */}
            <div className="space-y-2 mb-3">
              <div className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <span>🎯 Gợi ý luyện tập cho học sinh (Support – Core – Stretch)</span>
              </div>

              {/* Support */}
              <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start space-x-2 text-xs">
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded text-[10px] flex-shrink-0">
                  Support
                </span>
                <div className="text-slate-700">
                  <strong>Dành cho học sinh cần củng cố:</strong> Từ vựng cơ bản, ngữ pháp đơn giản, bài tập có hướng dẫn (word banks, scaffolding).
                </div>
              </div>

              {/* Core */}
              <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start space-x-2 text-xs">
                <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[10px] flex-shrink-0">
                  Core
                </span>
                <div className="text-slate-700">
                  <strong>Dành cho học sinh nắm vững:</strong> Bài tập theo chương chuẩn Global Success, rèn luyện toàn diện 4 kỹ năng.
                </div>
              </div>

              {/* Stretch */}
              <div className="p-2.5 bg-purple-50/60 border border-purple-100 rounded-xl flex items-start space-x-2 text-xs">
                <span className="px-2 py-0.5 bg-purple-600 text-white font-bold rounded text-[10px] flex-shrink-0">
                  Stretch
                </span>
                <div className="text-slate-700">
                  <strong>Dành cho học sinh khá giỏi:</strong> Bài tập nâng cao, dự án mini, thảo luận phản biện, luyện đề thi chọn lọc.
                </div>
              </div>
            </div>

            {/* AI Response Display if available */}
            {aiResponse && (
              <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 max-h-36 overflow-y-auto whitespace-pre-line">
                {aiResponse}
              </div>
            )}
          </div>

          {/* Quick AI Input Box */}
          <form onSubmit={handleAskAi} className="relative mt-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Nhập câu hỏi hoặc yêu cầu hỗ trợ (VD: Gợi ý bài tập thì Quá khứ đơn)..."
              disabled={isAiLoading}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white shadow-inner"
            />
            <button
              type="submit"
              disabled={isAiLoading}
              className="absolute right-2 top-2 p-1.5 bg-[#1266D6] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Panel F: Hồ sơ học sinh tiêu biểu */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#1266D6]" />
                <h3 className="font-bold text-base text-[#0B2D5C]">
                  Hồ sơ học sinh tiêu biểu
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedStudent(featuredStudent);
                  setActiveTab('students');
                }}
                className="text-xs font-medium text-[#1266D6] hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Student Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-3 rounded-xl mb-3 border border-blue-100/60">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-blue-200 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
                    alt={featuredStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0B2D5C]">{featuredStudent.fullName}</h4>
                  <div className="text-xs text-slate-500 font-medium">
                    Lớp: {featuredStudent.className} | MSSV: {featuredStudent.studentCode}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center space-x-1 shadow-sm">
                <span>👑</span>
                <span>Học sinh tiêu biểu</span>
              </span>
            </div>

            {/* Skill Breakdown Scores */}
            <div className="grid grid-cols-5 gap-1.5 text-center mb-3">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500">Từ vựng</div>
                <div className="text-sm font-bold text-[#0B2D5C] mt-0.5">
                  {featuredStudent.skillScores?.vocabulary ?? 9.0}
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500">Ngữ pháp</div>
                <div className="text-sm font-bold text-[#0B2D5C] mt-0.5">
                  {featuredStudent.skillScores?.grammar ?? 8.5}
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500">Đọc hiểu</div>
                <div className="text-sm font-bold text-[#0B2D5C] mt-0.5">
                  {featuredStudent.skillScores?.reading ?? 8.0}
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500">Nghe</div>
                <div className="text-sm font-bold text-[#0B2D5C] mt-0.5">
                  {featuredStudent.skillScores?.listening ?? 8.5}
                </div>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <div className="text-[11px] text-emerald-700 font-bold">TB</div>
                <div className="text-sm font-bold text-emerald-800 mt-0.5">
                  8.5
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-800 flex items-center space-x-1.5 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Điểm mạnh</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                  {featuredStudent.strengths?.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                <div className="font-bold text-rose-800 flex items-center space-x-1.5 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cần cải thiện</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                  {featuredStudent.improvements?.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: Panel G (Báo cáo & phân tích) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#1266D6]" />
            <h3 className="font-bold text-base text-[#0B2D5C]">
              Báo cáo & phân tích
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1266D6]"
            >
              <option value="7A">Lớp 7A</option>
              <option value="6A1">Lớp 6A1</option>
              <option value="8A1">Lớp 8A1</option>
              <option value="9A1">Lớp 9A1</option>
            </select>

            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1266D6]">
              <option>Học kỳ I (2026 - 2027)</option>
              <option>Học kỳ II (2026 - 2027)</option>
            </select>

            <button
              onClick={handleExportDashboard}
              className="px-3 py-1.5 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* 3 Sub-Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Chart 1: Tiến bộ theo lớp */}
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Tiến bộ theo lớp (%)</span>
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
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLASS_PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="dauKy" name="Đầu kỳ" fill="#93C5FD" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="hienTai" name="Hiện tại" fill="#1266D6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Kết quả theo Unit (Lớp 7A) */}
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Kết quả theo Unit (Lớp {selectedClass})</span>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-[#1266D6] inline-block" />
                  <span>Điểm TB</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 bg-rose-500 inline-block border-t border-dashed border-rose-500" />
                  <span>Mục tiêu</span>
                </span>
              </div>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={UNIT_RESULTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="unit" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" name="Điểm TB" stroke="#1266D6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="target" name="Mục tiêu" stroke="#EF4444" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Học sinh cần hỗ trợ (Donut Chart) */}
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Học sinh cần hỗ trợ (24 học sinh)
            </div>
            <div className="flex items-center justify-between h-44">
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SUPPORT_STUDENTS_BREAKDOWN}
                      innerRadius={36}
                      outerRadius={56}
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
                <div className="absolute text-center">
                  <div className="text-sm font-bold text-slate-800">24</div>
                  <div className="text-[10px] text-slate-500">học sinh</div>
                </div>
              </div>

              <div className="w-1/2 space-y-1.5 pl-2 text-xs">
                {SUPPORT_STUDENTS_BREAKDOWN.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[80px]">{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
