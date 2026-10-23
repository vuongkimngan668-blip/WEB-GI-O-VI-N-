import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Layers,
  BookOpen,
  HelpCircle,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { sendAiChatMessage, generateDifferentiatedPlan, checkAiStatus } from '../services/aiService';

export const AiAssistantPage: React.FC = () => {
  const { teacherProfile } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'differentiate' | 'chat' | 'feedback'>('differentiate');

  // Differentiation Generator state
  const [diffGrade, setDiffGrade] = useState(7);
  const [diffUnit, setDiffUnit] = useState('Unit 3: Community Service');
  const [diffTopic, setDiffTopic] = useState('Volunteer activities and helping the community');
  const [diffSkill, setDiffSkill] = useState('Vocabulary & Past Simple Grammar');
  const [diffResult, setDiffResult] = useState<string | null>(null);
  const [isDiffLoading, setIsDiffLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Xin chào cô Vương Thị Ngân! Tôi là Trợ lý AI giáo dục chuyên môn Tiếng Anh THCS (Global Success) của Trường THCS Nguyễn Huy Tưởng.

Tôi có thể đồng hành cùng cô trong:
1. Soạn giáo án bài tập phân hoá 3 cấp độ (Support – Core – Stretch).
2. Tạo đề thi trắc nghiệm, bài đọc hiểu và kịch bản luyện nghe.
3. Soạn lời nhận xét học sinh học kỳ I bám sát chuẩn thông tư đánh giá.
4. Gợi ý trò chơi khởi động (Warm-up activities) gây hứng thú trong 5 phút đầu giờ.`,
      time: '08:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Feedback generator state
  const [feedbackLevel, setFeedbackLevel] = useState<'Tốt' | 'Khá' | 'Trung bình' | 'Cần cố gắng'>('Khá');
  const [feedbackSkill, setFeedbackSkill] = useState('Ngữ pháp & Đọc hiểu');
  const [generatedFeedback, setGeneratedFeedback] = useState<string>('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const handleGenerateDifferentiation = async () => {
    setIsDiffLoading(true);
    setDiffResult(null);
    try {
      const plan = await generateDifferentiatedPlan(diffGrade, diffUnit, diffTopic, diffSkill);
      setDiffResult(plan);
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể tạo bài tập'));
    } finally {
      setIsDiffLoading(false);
    }
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    if (!presetText) setChatInput('');
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: textToSend, time: nowTime }]);
    setIsChatLoading(true);

    try {
      const reply = await sendAiChatMessage(textToSend, `Giáo viên: ${teacherProfile.name}, Năm học: 2026-2027`);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Không thể kết nối tới mô hình AI. Vui lòng kiểm tra lại cấu hình khoá bí mật GEMINI_API_KEY.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const prompt = `Viết 4 mẫu câu nhận xét học bạ / sổ liên lạc điện tử ngắn gọn, tích cực, có tính sư phạm cho học sinh THCS xếp loại môn Tiếng Anh mức "${feedbackLevel}", kỹ năng cần chú ý: "${feedbackSkill}". Giáo viên: Cô Vương Thị Ngân - Trường THCS Nguyễn Huy Tưởng.`;
      const reply = await sendAiChatMessage(prompt);
      setGeneratedFeedback(reply);
    } catch (e) {
      setGeneratedFeedback(`Mẫu nhận xét gợi ý cho học sinh (${feedbackLevel}):\n- Em có ý thức học tập tốt, hoàn thành bài tập về nhà đầy đủ.\n- Điểm mạnh: Nắm chắc từ vựng cơ bản của các Unit.\n- Cần phát huy: Rèn luyện thêm kỹ năng ${feedbackSkill} để đạt kết quả xuất sắc hơn trong học kỳ tới.`);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <Bot className="w-6 h-6 text-[#1266D6]" />
            <span>Trợ lý AI Giáo dục - Hỗ trợ giảng dạy Tiếng Anh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tích hợp mô hình Gemini AI thế hệ mới: soạn bài phân hóa, giải thích ngữ pháp, gợi ý nhận xét và luyện đề
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#1266D6] flex items-center space-x-1.5 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 2.5 Flash</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('differentiate')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'differentiate'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Soạn bài phân hoá (Support - Core - Stretch)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'chat'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Trò chuyện & Tham vấn sư phạm</span>
        </button>
        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'feedback'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Gợi ý nhận xét học bạ</span>
        </button>
      </div>

      {/* TAB 1: DIFFERENTIATION GENERATOR */}
      {activeSubTab === 'differentiate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls form */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-xs">
            <div className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#1266D6]" />
              <span>Thiết lập thông số bài dạy</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp (Global Success)</label>
              <select
                value={diffGrade}
                onChange={(e) => setDiffGrade(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              >
                <option value={6}>Lớp 6 (Khung CEFR ~ A1/A1+)</option>
                <option value={7}>Lớp 7 (Khung CEFR ~ A1+/A2)</option>
                <option value={8}>Lớp 8 (Khung CEFR ~ A2/A2+)</option>
                <option value={9}>Lớp 9 (Khung CEFR ~ A2+/B1)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit bài học</label>
              <input
                type="text"
                value={diffUnit}
                onChange={(e) => setDiffUnit(e.target.value)}
                placeholder="VD: Unit 1: Hobbies"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chủ đề (Topic)</label>
              <input
                type="text"
                value={diffTopic}
                onChange={(e) => setDiffTopic(e.target.value)}
                placeholder="VD: Hobbies and collections"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kỹ năng trọng tâm</label>
              <input
                type="text"
                value={diffSkill}
                onChange={(e) => setDiffSkill(e.target.value)}
                placeholder="VD: Vocabulary & Past Simple"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              />
            </div>

            <button
              onClick={handleGenerateDifferentiation}
              disabled={isDiffLoading}
              className="w-full py-2.5 bg-[#1266D6] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors mt-2"
            >
              {isDiffLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo bài phân hoá...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo bài dạy phân hóa 3 tầng</span>
                </>
              )}
            </button>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-[#0B2D5C] block mb-1">Quy chuẩn 3 tầng phân hóa:</strong>
              • <strong>Support:</strong> Giàn giáo gợi ý, từ vựng cơ bản, mẫu câu.<br/>
              • <strong>Core:</strong> Yêu cầu chuẩn kiến thức kỹ năng chương trình.<br/>
              • <strong>Stretch:</strong> Nhiệm vụ mở rộng, tư duy phản biện.
            </div>
          </div>

          {/* Result view */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-[#0B2D5C] flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Kết quả bộ bài tập phân hóa</span>
                </h3>

                {diffResult && (
                  <button
                    onClick={() => handleCopy(diffResult, 99)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    {copiedId === 99 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 99 ? 'Đã sao chép!' : 'Sao chép giáo án'}</span>
                  </button>
                )}
              </div>

              {diffResult ? (
                <div className="mt-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans max-h-[600px] overflow-y-auto">
                  {diffResult}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Chọn khối lớp, Unit và bấm "Tạo bài dạy phân hóa 3 tầng" để AI tự động thiết kế bài tập.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHAT ASSISTANT */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[650px] overflow-hidden">
          {/* Quick preset buttons */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto text-xs">
            <span className="font-bold text-slate-500 whitespace-nowrap">Gợi ý nhanh:</span>
            {[
              'Soạn trò chơi khởi động 5 phút Unit 4 Lớp 7',
              'Gợi ý 5 câu trắc nghiệm phân biệt Thì Quá khứ đơn và Hiện tại hoàn thành',
              'Đề xuất chiến lược giúp học sinh yếu kỹ năng Nghe',
              'Thiết kế rubric chấm bài viết đoạn văn ngắn 80 từ'
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChatMessage(preset)}
                className="whitespace-nowrap px-3 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full text-slate-700 text-[11px] font-medium transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 ${
                    isUser ? 'bg-[#0B2D5C] text-white' : 'bg-[#1266D6] text-white'
                  }`}>
                    {isUser ? 'Cô' : 'AI'}
                  </div>

                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#1266D6] text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                      <span className="font-bold">{isUser ? teacherProfile.name : 'Trợ lý AI NHT'}</span>
                      <span>{m.time}</span>
                    </div>

                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex justify-end">
                        <button
                          onClick={() => handleCopy(m.text, idx)}
                          className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                        >
                          {copiedId === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === idx ? 'Đã sao chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#1266D6]" />
                <span>Trợ lý AI đang tư duy và soạn phản hồi...</span>
              </div>
            )}
          </div>

          {/* Chat input box */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập câu hỏi hoặc yêu cầu sư phạm (VD: Soạn bài tập ngữ pháp so sánh bằng)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white shadow-inner"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2.5 bg-[#1266D6] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT FEEDBACK GENERATOR */}
      {activeSubTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100">
              Tạo mẫu nhận xét học bạ / sổ liên lạc
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ học tập của học sinh</label>
              <select
                value={feedbackLevel}
                onChange={(e) => setFeedbackLevel(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              >
                <option value="Tốt">Tốt (Điểm TB ≥ 8.0)</option>
                <option value="Khá">Khá (Điểm TB 6.5 – 7.9)</option>
                <option value="Trung bình">Trung bình (Điểm TB 5.0 – 6.4)</option>
                <option value="Cần cố gắng">Cần cố gắng (&lt; 5.0)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kỹ năng cần tập trung nhận xét</label>
              <input
                type="text"
                value={feedbackSkill}
                onChange={(e) => setFeedbackSkill(e.target.value)}
                placeholder="VD: Ngữ pháp, Từ vựng, Kỹ năng nghe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
              />
            </div>

            <button
              onClick={handleGenerateFeedback}
              disabled={isFeedbackLoading}
              className="w-full py-2.5 bg-[#1266D6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFeedbackLoading ? 'Đang tạo mẫu nhận xét...' : 'Tạo 4 mẫu nhận xét'}</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0B2D5C] pb-2 border-b border-slate-100">
                Gợi ý nhận xét dành cho cô Vương Thị Ngân
              </h3>

              {generatedFeedback ? (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {generatedFeedback}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Chọn mức độ và bấm "Tạo 4 mẫu nhận xét" để nhận gợi ý lời phê mang tính khích lệ, sư phạm.
                </div>
              )}
            </div>

            {generatedFeedback && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleCopy(generatedFeedback, 88)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                >
                  {copiedId === 88 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 88 ? 'Đã sao chép' : 'Sao chép toàn bộ'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
