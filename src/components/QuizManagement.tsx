import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quiz } from '../types';
import {
  CheckSquare,
  Plus,
  Play,
  Clock,
  HelpCircle,
  FileText,
  Users,
  Award,
  Calendar,
  X,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const QuizManagement: React.FC = () => {
  const {
    quizzes,
    addQuiz,
    classes,
    questions,
    submissions,
    setActiveQuizId,
    setActiveTab
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'quizzes' | 'submissions'>('quizzes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    grade: number;
    unit: string;
    category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening' | 'Tổng hợp';
    targetClassNames: string[];
    durationMinutes: number;
    maxAttempts: number;
    allowReview: boolean;
    status: 'published' | 'draft';
  }>({
    title: '',
    description: '',
    grade: 7,
    unit: 'Unit 1–3',
    category: 'Vocabulary',
    targetClassNames: ['7A'],
    durationMinutes: 15,
    maxAttempts: 2,
    allowReview: true,
    status: 'published'
  });

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setActiveTab('take-quiz');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Pick questions matching the grade and category if possible
    const matchingQuestions = questions.filter(q => q.grade === formData.grade);
    const selectedQuestions = matchingQuestions.length > 0 ? matchingQuestions : questions.slice(0, 6);

    addQuiz({
      ...formData,
      targetClassIds: classes.filter(c => formData.targetClassNames.includes(c.name)).map(c => c.id),
      questionCount: selectedQuestions.length,
      totalPoints: 10,
      questions: selectedQuestions
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-[#1266D6]" />
            <span>Kiểm tra trực tuyến & Bài tập giao về nhà</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo bài thi trắc nghiệm, hẹn giờ làm bài, chấm điểm tự động và theo dõi lịch sử nộp bài của học sinh
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài kiểm tra mới</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Quizzes vs Submissions */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTabSub('quizzes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabSub === 'quizzes'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Danh sách bài kiểm tra ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTabSub('submissions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTabSub === 'submissions'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Lịch sử nộp bài ({submissions.length})
        </button>
      </div>

      {activeTabSub === 'quizzes' ? (
        /* Quizzes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {quiz.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Khối {quiz.grade}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        quiz.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {quiz.status === 'published' ? 'Đang mở' : 'Bản nháp'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0B2D5C] mt-2">
                      {quiz.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <div className="text-slate-400 font-medium">Thời gian</div>
                    <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{quiz.durationMinutes} phút</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Số câu hỏi</div>
                    <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{quiz.questionCount || quiz.questions.length} câu</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Lớp áp dụng</div>
                    <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{quiz.targetClassNames.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Tạo ngày: {quiz.createdAt}</span>

                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Vào làm bài thi thử</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Submissions Table */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-3.5 font-bold w-12 text-center">STT</th>
                  <th className="py-3 px-4 font-bold">Họ và tên học sinh</th>
                  <th className="py-3 px-3 font-bold text-center">Lớp</th>
                  <th className="py-3 px-4 font-bold">Tên bài kiểm tra</th>
                  <th className="py-3 px-3 font-bold text-center">Thời gian nộp</th>
                  <th className="py-3 px-3 font-bold text-center">Điểm số</th>
                  <th className="py-3 px-4 font-bold">Nhận xét của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                      Chưa có học sinh nào nộp bài. Bấm "Vào làm bài thi thử" để trải nghiệm nộp bài.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-[#0B2D5C]">{sub.studentName}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{sub.className}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{sub.quizTitle}</td>
                      <td className="py-3 px-3 text-center text-slate-500 text-xs">{sub.submittedAt}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                          {sub.score.toFixed(1)} / {sub.totalScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{sub.teacherFeedback || 'Đã chấm tự động'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE QUIZ MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2D5C]">
                Tạo bài kiểm tra trực tuyến mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài kiểm tra *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Kiểm tra 15 phút: Vocabulary Unit 2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả / Hướng dẫn làm bài</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hướng dẫn học sinh chú ý đọc kỹ câu hỏi, thời gian làm bài..."
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
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Reading">Reading</option>
                    <option value="Listening">Listening</option>
                    <option value="Tổng hợp">Tổng hợp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài (Phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số lần làm bài tối đa</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({ ...formData, maxAttempts: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>
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
                  Tạo bài kiểm tra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
