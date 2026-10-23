import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  HelpCircle,
  Award,
  RotateCcw
} from 'lucide-react';

export const TakeQuizView: React.FC = () => {
  const {
    activeQuizId,
    setActiveQuizId,
    quizzes,
    setActiveTab,
    submitQuizAttempt,
    teacherProfile
  } = useApp();

  const quiz = quizzes.find(q => q.id === activeQuizId) || quizzes[0];
  const questions = quiz?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState((quiz?.durationMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    correctCount: number;
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted || !currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;

    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = questions.length > 0
      ? Math.round((correctCount / questions.length) * 10 * 10) / 10
      : 10;
    const percentage = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 100;

    const res = {
      score,
      total: 10,
      percentage,
      correctCount
    };

    setResult(res);
    setIsSubmitted(true);

    // Save submission record
    submitQuizAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentId: 'std-7a-01',
      studentName: 'Nguyễn Hoàng Anh (Thực hành)',
      className: quiz.targetClassNames[0] || '7A',
      score,
      totalScore: 10,
      percentage,
      answers,
      timeSpentSeconds: ((quiz.durationMinutes || 15) * 60) - timeLeft,
      teacherFeedback: percentage >= 80 ? 'Hoàn thành xuất sắc bài kiểm tra!' : 'Cần chú ý củng cố thêm từ vựng và ngữ pháp.'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-slate-500">Không tìm thấy dữ liệu bài kiểm tra.</p>
        <button
          onClick={() => setActiveTab('quizzes')}
          className="mt-4 px-4 py-2 bg-[#1266D6] text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Quiz Header Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 sticky top-[72px] z-30">
        <div>
          <button
            onClick={() => setActiveTab('quizzes')}
            className="text-xs text-[#1266D6] hover:underline font-bold flex items-center space-x-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Thoát ra danh sách bài kiểm tra</span>
          </button>
          <h2 className="text-base md:text-lg font-bold text-[#0B2D5C]">{quiz.title}</h2>
          <div className="text-xs text-slate-500">
            Lớp áp dụng: {quiz.targetClassNames.join(', ')} • Tổng số: {questions.length} câu hỏi
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border font-bold text-sm ${
            timeLeft < 180 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-blue-50 text-[#1266D6] border-blue-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn nộp bài ngay bây giờ?')) {
                  handleSubmitQuiz();
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Card if submitted */}
      {isSubmitted && result && (
        <div className="bg-gradient-to-r from-blue-900 to-[#1266D6] text-white p-6 rounded-2xl shadow-lg animate-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
                🏆
              </div>
              <div>
                <h3 className="text-xl font-bold">Kết quả bài làm: {result.score} / 10 điểm</h3>
                <p className="text-xs text-blue-100 mt-1">
                  Đúng {result.correctCount} / {questions.length} câu hỏi ({result.percentage}%) • Kết quả đã được tự động lưu vào hệ thống
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAnswers({});
                  setTimeLeft((quiz.durationMinutes || 15) * 60);
                  setCurrentIndex(0);
                }}
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại bài</span>
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="px-4 py-2 bg-white text-[#0B2D5C] hover:bg-blue-50 text-xs font-bold rounded-xl shadow transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          {/* Question Top Meta */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-[#0B2D5C] bg-blue-50 text-[#1266D6] px-3 py-1 rounded-lg">
              Câu hỏi {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-semibold">{currentQ.skill}</span>
              <span>•</span>
              <span className="text-slate-500 font-semibold">{currentQ.unit}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                {currentQ.differentiation}
              </span>
            </div>
          </div>

          {/* Reading or Listening Passage if present */}
          {currentQ.passage && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700 italic">
              <strong className="not-italic text-slate-800 block mb-1">Ngữ liệu tham khảo:</strong>
              {currentQ.passage}
            </div>
          )}

          {/* Prompt */}
          <div className="text-base font-bold text-slate-800 leading-snug">
            {currentQ.prompt}
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options?.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              const isCorrectAnswer = isSubmitted && currentQ.correctAnswer === optIdx;
              const isWrongSelected = isSubmitted && isSelected && currentQ.correctAnswer !== optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center space-x-3 transition-all ${
                    isWrongSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : isCorrectAnswer
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                      : isSelected
                      ? 'bg-blue-50 border-[#1266D6] text-[#0B2D5C] font-bold shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCorrectAnswer
                      ? 'bg-emerald-600 text-white'
                      : isWrongSelected
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-[#1266D6] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 text-sm">{opt}</span>
                  {isCorrectAnswer && (
                    <span className="text-emerald-600 font-bold text-xs">✓ Đáp án đúng</span>
                  )}
                  {isWrongSelected && (
                    <span className="text-rose-600 font-bold text-xs">✗ Đã chọn sai</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && currentQ.explanation && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700">
              <strong className="text-[#1266D6]">Giải thích: </strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-40 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Câu trước</span>
            </button>

            {/* Questions Indicator Bubbles */}
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[50%] py-1">
              {questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#1266D6] bg-[#1266D6] text-white shadow'
                        : answered
                        ? 'bg-blue-100 text-[#0B2D5C]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm transition-colors"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nộp bài thi</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('quizzes')}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Xong
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
