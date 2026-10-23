import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradeRecord } from '../types';
import {
  Award,
  Download,
  Upload,
  Search,
  Filter,
  Save,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Info
} from 'lucide-react';
import { exportGradebookToExcel } from '../services/excelService';

export const GradebookManagement: React.FC = () => {
  const { grades, classes, saveGradeCell, selectedClassId, setSelectedClassId } = useApp();

  const [semesterFilter, setSemesterFilter] = useState('Học kỳ I');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedAlert, setHasUnsavedAlert] = useState(false);

  // Filter grade records
  const filteredGrades = grades.filter(g => {
    const matchesSearch = g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassId === 'all' || g.classId === selectedClassId || g.className === selectedClassId;
    const matchesSemester = g.semester === semesterFilter;
    return matchesSearch && matchesClass && matchesSemester;
  });

  // Calculate statistics for the displayed grades
  const validAverages = filteredGrades
    .map(g => g.tb)
    .filter((tb): tb is number => typeof tb === 'number' && !isNaN(tb));

  const classAvg = validAverages.length > 0
    ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
    : '0.0';

  const goodCount = validAverages.filter(v => v >= 8.0).length;
  const fairCount = validAverages.filter(v => v >= 6.5 && v < 8.0).length;
  const avgCount = validAverages.filter(v => v >= 5.0 && v < 6.5).length;
  const supportCount = validAverages.filter(v => v < 5.0).length;

  const handleScoreChange = (
    gradeId: string,
    field: 'tx1' | 'tx2' | 'tx3' | 'tx4' | 'gk' | 'ck',
    rawValue: string
  ) => {
    if (rawValue === '') {
      saveGradeCell(gradeId, field, null);
      return;
    }

    const val = parseFloat(rawValue);
    if (isNaN(val)) return;

    if (val < 0 || val > 10) {
      alert('Điểm số phải nằm trong khoảng từ 0.0 đến 10.0');
      return;
    }

    saveGradeCell(gradeId, field, val);
    setHasUnsavedAlert(true);
    setTimeout(() => setHasUnsavedAlert(false), 2000);
  };

  const handleCommentChange = (gradeId: string, comment: string) => {
    saveGradeCell(gradeId, 'comment', comment);
  };

  const handleExport = () => {
    const className = classes.find(c => c.id === selectedClassId)?.name || 'Tat_Ca';
    exportGradebookToExcel(filteredGrades, className);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <Award className="w-6 h-6 text-[#1266D6]" />
            <span>Kết quả học tập & Sổ điểm điện tử</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập điểm thường xuyên (TX1–TX4), Giữa kỳ (GK), Cuối kỳ (CK) và tự động tính điểm trung bình (TB)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {hasUnsavedAlert && (
            <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã lưu điểm tự động!</span>
            </span>
          )}

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất bảng điểm Excel</span>
          </button>
        </div>
      </div>

      {/* Grade Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Điểm TB Lớp</div>
          <div className="text-xl font-bold text-[#1266D6] mt-0.5">{classAvg}</div>
        </div>
        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Giỏi (≥ 8.0)</div>
          <div className="text-xl font-bold text-emerald-800 mt-0.5">{goodCount} em</div>
        </div>
        <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-blue-700 uppercase">Khá (6.5 – 7.9)</div>
          <div className="text-xl font-bold text-blue-800 mt-0.5">{fairCount} em</div>
        </div>
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-amber-700 uppercase">TB (5.0 – 6.4)</div>
          <div className="text-xl font-bold text-amber-800 mt-0.5">{avgCount} em</div>
        </div>
        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-rose-700 uppercase">Cần hỗ trợ (&lt; 5.0)</div>
          <div className="text-xl font-bold text-rose-800 mt-0.5">{supportCount} em</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo tên học sinh hoặc mã số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1266D6] focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-600">Lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-600">Học kỳ:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="Học kỳ I">Học kỳ I</option>
              <option value="Học kỳ II">Học kỳ II</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grade Formula Notice */}
      <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-[#1266D6] flex-shrink-0" />
          <span>
            <strong>Công thức tính điểm trung bình (TB):</strong> TB = (Tổng điểm TX + 2 × GK + 3 × CK) / (Số đầu điểm TX + 5). Các ô điểm có thể chỉnh sửa trực tiếp.
          </span>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 text-xs uppercase border-b border-slate-200">
                <th className="py-3 px-3 font-bold w-12 text-center border-r border-slate-200">STT</th>
                <th className="py-3 px-3 font-bold w-24 border-r border-slate-200">Mã HS</th>
                <th className="py-3 px-4 font-bold min-w-[160px] border-r border-slate-200">Họ và tên</th>
                <th className="py-3 px-2 font-bold text-center w-14 border-r border-slate-200">Lớp</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-blue-50/40 border-r border-slate-200" title="Điểm Thường Xuyên 1">TX1</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-blue-50/40 border-r border-slate-200" title="Điểm Thường Xuyên 2">TX2</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-blue-50/40 border-r border-slate-200" title="Điểm Thường Xuyên 3">TX3</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-blue-50/40 border-r border-slate-200" title="Điểm Thường Xuyên 4">TX4</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-amber-50/60 border-r border-slate-200" title="Giữa Kỳ (Hệ số 2)">GK</th>
                <th className="py-3 px-2 font-bold text-center w-16 bg-rose-50/60 border-r border-slate-200" title="Cuối Kỳ (Hệ số 3)">CK</th>
                <th className="py-3 px-3 font-bold text-center w-16 bg-emerald-50 text-emerald-800 border-r border-slate-200" title="Điểm Trung Bình">TB</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Nhận xét của giáo viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 text-sm">
                    Không có bản ghi điểm nào cho lớp và học kỳ được chọn.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g, idx) => {
                  const tb = g.tb;

                  return (
                    <tr key={g.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#0B2D5C] border-r border-slate-100">
                        {g.studentCode}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800 border-r border-slate-100">
                        {g.studentName}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-600 font-medium border-r border-slate-100">
                        {g.className}
                      </td>

                      {/* TX1 */}
                      <td className="py-2.5 px-1.5 text-center border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.tx1 !== null && g.tx1 !== undefined ? g.tx1 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx1', e.target.value)}
                          className="w-12 text-center bg-slate-50 border border-transparent hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded py-1 font-semibold text-slate-800 text-xs"
                        />
                      </td>

                      {/* TX2 */}
                      <td className="py-2.5 px-1.5 text-center border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.tx2 !== null && g.tx2 !== undefined ? g.tx2 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx2', e.target.value)}
                          className="w-12 text-center bg-slate-50 border border-transparent hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded py-1 font-semibold text-slate-800 text-xs"
                        />
                      </td>

                      {/* TX3 */}
                      <td className="py-2.5 px-1.5 text-center border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.tx3 !== null && g.tx3 !== undefined ? g.tx3 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx3', e.target.value)}
                          className="w-12 text-center bg-slate-50 border border-transparent hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded py-1 font-semibold text-slate-800 text-xs"
                        />
                      </td>

                      {/* TX4 */}
                      <td className="py-2.5 px-1.5 text-center border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.tx4 !== null && g.tx4 !== undefined ? g.tx4 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx4', e.target.value)}
                          className="w-12 text-center bg-slate-50 border border-transparent hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded py-1 font-semibold text-slate-800 text-xs"
                        />
                      </td>

                      {/* GK (hệ số 2) */}
                      <td className="py-2.5 px-1.5 text-center bg-amber-50/20 border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.gk !== null && g.gk !== undefined ? g.gk : ''}
                          onChange={(e) => handleScoreChange(g.id, 'gk', e.target.value)}
                          className="w-12 text-center bg-amber-50 border border-transparent hover:border-amber-300 focus:border-amber-500 focus:bg-white rounded py-1 font-bold text-amber-900 text-xs"
                        />
                      </td>

                      {/* CK (hệ số 3) */}
                      <td className="py-2.5 px-1.5 text-center bg-rose-50/20 border-r border-slate-100">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.ck !== null && g.ck !== undefined ? g.ck : ''}
                          onChange={(e) => handleScoreChange(g.id, 'ck', e.target.value)}
                          className="w-12 text-center bg-rose-50 border border-transparent hover:border-rose-300 focus:border-rose-500 focus:bg-white rounded py-1 font-bold text-rose-900 text-xs"
                        />
                      </td>

                      {/* TB (Điểm trung bình tự động tính) */}
                      <td className="py-2.5 px-2 text-center bg-emerald-50/40 border-r border-slate-100">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            tb !== null && tb !== undefined
                              ? tb >= 8.0
                                ? 'bg-emerald-100 text-emerald-800'
                                : tb >= 6.5
                                ? 'bg-blue-100 text-blue-800'
                                : tb >= 5.0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {tb !== null && tb !== undefined ? tb.toFixed(1) : '-'}
                        </span>
                      </td>

                      {/* Nhận xét của giáo viên */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={g.comment || ''}
                          onChange={(e) => handleCommentChange(g.id, e.target.value)}
                          placeholder="Nhận xét tiến bộ, thái độ học tập..."
                          className="w-full bg-slate-50 border border-transparent hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded px-2 py-1 text-xs text-slate-700"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
