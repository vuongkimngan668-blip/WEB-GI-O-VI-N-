import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question, EnglishSkill, DifferentiationLevel, QuestionType } from '../types';
import {
  BookMarked,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  HelpCircle,
  Headphones,
  FileText,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export const QuestionBankManagement: React.FC = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedDifferentiation, setSelectedDifferentiation] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    grade: number;
    unit: string;
    topic: string;
    skill: EnglishSkill;
    cefrLevel: 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1';
    difficulty: 'Dễ' | 'Trung bình' | 'Khá' | 'Giỏi';
    differentiation: DifferentiationLevel;
    type: QuestionType;
    prompt: string;
    passage: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    points: number;
  }>({
    grade: 7,
    unit: 'Unit 1: Hobbies',
    topic: 'Free time and hobbies',
    skill: 'Vocabulary',
    cefrLevel: 'A2',
    difficulty: 'Trung bình',
    differentiation: 'Core',
    type: 'multiple_choice',
    prompt: '',
    passage: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1
  });

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || q.grade.toString() === selectedGrade;
    const matchesSkill = selectedSkill === 'all' || q.skill === selectedSkill;
    const matchesDiff = selectedDifferentiation === 'all' || q.differentiation === selectedDifferentiation;
    return matchesSearch && matchesGrade && matchesSkill && matchesDiff;
  });

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      grade: 7,
      unit: 'Unit 1: Hobbies',
      topic: 'Free time and hobbies',
      skill: 'Vocabulary',
      cefrLevel: 'A2',
      difficulty: 'Trung bình',
      differentiation: 'Core',
      type: 'multiple_choice',
      prompt: '',
      passage: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      grade: q.grade,
      unit: q.unit,
      topic: q.topic,
      skill: q.skill,
      cefrLevel: q.cefrLevel,
      difficulty: q.difficulty,
      differentiation: q.differentiation,
      type: q.type,
      prompt: q.prompt,
      passage: q.passage || '',
      options: q.options && q.options.length === 4 ? q.options : ['', '', '', ''],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || '',
      points: q.points || 1
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = (q: Question) => {
    addQuestion({
      ...q,
      prompt: `[Bản sao] ${q.prompt}`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) return;

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, formData);
    } else {
      addQuestion(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <BookMarked className="w-6 h-6 text-[#1266D6]" />
            <span>Ngân hàng bài tập & Câu hỏi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ngân hàng câu hỏi bám sát chương trình Tiếng Anh Global Success (Lớp 6–9), phân hóa Support - Core - Stretch
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm câu hỏi mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Tìm theo nội dung câu hỏi, Unit hoặc chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Grade filter */}
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

          {/* Skill filter */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Grammar">Grammar</option>
            <option value="Reading">Reading</option>
            <option value="Listening">Listening</option>
            <option value="Writing">Writing</option>
            <option value="Speaking">Speaking</option>
          </select>

          {/* Differentiation tier */}
          <select
            value={selectedDifferentiation}
            onChange={(e) => setSelectedDifferentiation(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
          >
            <option value="all">Tất cả tầng phân hoá</option>
            <option value="Support">Support (Củng cố)</option>
            <option value="Core">Core (Chuẩn)</option>
            <option value="Stretch">Stretch (Nâng cao)</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100 shadow-sm text-sm">
            Chưa có câu hỏi nào phù hợp với bộ lọc hiện tại. Bấm "Thêm câu hỏi mới" để bắt đầu bổ sung.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#0B2D5C] bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      #{idx + 1} • Lớp {q.grade}
                    </span>
                    <span className="font-semibold text-slate-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                      {q.unit}
                    </span>
                    <span className="text-slate-500 font-medium">{q.topic}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        q.differentiation === 'Support'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.differentiation === 'Core'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {q.differentiation}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                      CEFR: {q.cefrLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                      {q.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                      {q.points} điểm
                    </span>
                  </div>
                </div>

                {/* Passage if reading/listening */}
                {q.passage && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                    <span className="font-bold not-italic text-slate-800 block mb-1">Đoạn ngữ liệu đọc/nghe:</span>
                    {q.passage}
                  </div>
                )}

                {/* Question Prompt */}
                <div className="mt-3 text-sm font-bold text-slate-800">
                  {q.prompt}
                </div>

                {/* Multiple choice options */}
                {q.options && q.options.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-2.5 text-xs text-slate-500 bg-blue-50/40 p-2 rounded-lg border border-blue-100/60">
                    <strong className="text-[#1266D6]">Giải thích đáp án: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Kỹ năng: {q.skill}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicate(q)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Nhân bản câu hỏi"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Sửa câu hỏi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) deleteQuestion(q.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0B2D5C]">
                {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-semibold text-slate-700 mb-1">Unit bài học</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="VD: Unit 1: Hobbies"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kỹ năng</label>
                  <select
                    value={formData.skill}
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value as EnglishSkill })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Reading">Reading</option>
                    <option value="Listening">Listening</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tầng phân hoá</label>
                  <select
                    value={formData.differentiation}
                    onChange={(e) => setFormData({ ...formData, differentiation: e.target.value as DifferentiationLevel })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Support">Support (Củng cố)</option>
                    <option value="Core">Core (Chuẩn)</option>
                    <option value="Stretch">Stretch (Nâng cao)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức độ khó</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khá">Khá</option>
                    <option value="Giỏi">Giỏi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khung CEFR</label>
                  <select
                    value={formData.cefrLevel}
                    onChange={(e) => setFormData({ ...formData, cefrLevel: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  >
                    <option value="A1">A1</option>
                    <option value="A1+">A1+</option>
                    <option value="A2">A2</option>
                    <option value="A2+">A2+</option>
                    <option value="B1">B1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chủ đề bài học (Topic)</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="VD: Community service and volunteer work"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                />
              </div>

              {(formData.skill === 'Reading' || formData.skill === 'Listening') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đoạn văn đọc hiểu hoặc Audio Script</label>
                  <textarea
                    rows={3}
                    value={formData.passage}
                    onChange={(e) => setFormData({ ...formData, passage: e.target.value })}
                    placeholder="Dán đoạn văn bản hoặc kịch bản nghe tại đây..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi / Lời nhắc *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi tiếng Anh..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Các phương án trả lời (Chọn nút tròn đáp án đúng):</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctAnswer === idx}
                      onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                      className="w-4 h-4 text-[#1266D6] focus:ring-[#1266D6]"
                    />
                    <span className="font-bold text-slate-600 w-4">{String.fromCharCode(65 + idx)}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}...`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giải thích đáp án</label>
                <input
                  type="text"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Giải thích vì sao đáp án này đúng để hỗ trợ học sinh..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
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
                  {editingQuestion ? 'Lưu thay đổi' : 'Lưu câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
