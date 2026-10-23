import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckSquare,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  User
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const {
    students,
    grades,
    quizzes,
    submissions,
    resources,
    setActiveQuizId,
    setActiveTab,
    setUserRole
  } = useApp();

  // Current simulated logged-in student (e.g. Nguyễn Hoàng Anh - 7A01)
  const currentStudent = students[0] || {
    id: 'std-7a-01',
    studentCode: '7A01',
    fullName: 'Nguyễn Hoàng Anh',
    className: '7A',
    level: 'Khá',
    progressPercent: 85,
    skillScores: { vocabulary: 9.0, grammar: 8.5, reading: 8.0, listening: 8.5 }
  };

  const myGrade = grades.find(g => g.studentId === currentStudent.id || g.studentCode === currentStudent.studentCode);
  const mySubmissions = submissions.filter(s => s.studentName.includes(currentStudent.fullName) || s.studentId === currentStudent.id);

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setActiveTab('take-quiz');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B2D5C] via-[#1266D6] to-[#2585F5] text-white p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 border-2 border-white shadow">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
              alt={currentStudent.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-[#0B2D5C]">
                Cổng học sinh
              </span>
              <span className="text-xs text-blue-100">MSSV: {currentStudent.studentCode}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mt-1">
              Xin chào, {currentStudent.fullName}!
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Lớp: <strong>{currentStudent.className}</strong> • GV phụ trách: <strong>Vương Thị Ngân</strong> • Trường THCS Nguyễn Huy Tưởng
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setUserRole('teacher');
            setActiveTab('overview');
          }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Quay lại góc nhìn Giáo viên
        </button>
      </div>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Điểm trung bình (TB)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {myGrade?.tb !== null && myGrade?.tb !== undefined ? myGrade.tb.toFixed(1) : '8.8'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Xếp loại: {currentStudent.level}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tiến bộ học tập</div>
          <div className="text-2xl font-bold text-[#1266D6] mt-1">{currentStudent.progressPercent}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đã hoàn thành 18/20 bài</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Bài kiểm tra đã nộp</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{mySubmissions.length || 2} bài</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Đã được giáo viên chấm</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tầng học tập</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">Core &amp; Stretch</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Phân hóa theo năng lực</div>
        </div>
      </div>

      {/* Row 2: Assigned Quizzes & Gradebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Quizzes */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B2D5C] flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-[#1266D6]" />
              <span>Bài tập & Kiểm tra được giao cho bạn</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">{quizzes.length} bài sẵn sàng</span>
          </div>

          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {quiz.category}
                    </span>
                    <span className="text-xs text-slate-500">{quiz.durationMinutes} phút</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">{quiz.title}</h4>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="px-3.5 py-1.5 bg-[#1266D6] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1 transition-colors flex-shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Vào thi</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Grade Card & Teacher Feedback */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0B2D5C] flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#1266D6]" />
                <span>Bảng điểm cá nhân (Bảo mật riêng tư)</span>
              </h3>
              <span className="text-xs text-emerald-600 font-bold">Học kỳ I (2026–2027)</span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <div className="text-slate-500 font-semibold">TX1</div>
                <div className="text-base font-bold text-[#0B2D5C] mt-1">{myGrade?.tx1 ?? 9.0}</div>
              </div>
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <div className="text-slate-500 font-semibold">TX2</div>
                <div className="text-base font-bold text-[#0B2D5C] mt-1">{myGrade?.tx2 ?? 9.0}</div>
              </div>
              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100">
                <div className="text-amber-800 font-semibold">Giữa kỳ (GK)</div>
                <div className="text-base font-bold text-amber-900 mt-1">{myGrade?.gk ?? 8.5}</div>
              </div>
              <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100">
                <div className="text-rose-800 font-semibold">Cuối kỳ (CK)</div>
                <div className="text-base font-bold text-rose-900 mt-1">{myGrade?.ck ?? 9.0}</div>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
              <div className="font-bold text-emerald-800 flex items-center space-x-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Lời nhận xét của cô Vương Thị Ngân:</span>
              </div>
              <p className="text-slate-700 italic leading-relaxed">
                "{myGrade?.comment || 'Học lực rất tốt, tương tác trên lớp sôi nổi, phát huy khả năng giao tiếp.'}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            * Chỉ bạn và giáo viên mới có thể xem bảng điểm chi tiết này.
          </div>
        </div>
      </div>
    </div>
  );
};
