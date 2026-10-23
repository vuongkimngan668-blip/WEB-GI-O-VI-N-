import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Download,
  Users,
  Search,
  Check,
  Calendar,
  Save,
  FileSpreadsheet,
  AlertTriangle,
  History,
  Filter
} from 'lucide-react';
import { exportAttendanceToExcel } from '../services/excelService';

export const AttendanceManagement: React.FC = () => {
  const {
    students,
    classes,
    attendance,
    saveAttendanceRecord,
    batchSaveAttendance,
    markAllStudentsPresent,
    selectedClassId,
    setSelectedClassId
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'history'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tiết 1');
  const [lessonTopic, setLessonTopic] = useState<string>('Unit 3: Community Service - A Closer Look 1');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Class info
  const targetClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const className = targetClass?.name || '7A';

  // Students of current selected class
  const classStudents = students.filter(
    s => s.classId === targetClass?.id || s.className === className
  );

  // Filtered by search term
  const filteredStudents = classStudents.filter(
    s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Current session's existing attendance map (studentId -> AttendanceRecord)
  const currentSessionRecords = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.forEach(rec => {
      if (
        rec.date === selectedDate &&
        rec.period === selectedPeriod &&
        (rec.classId === targetClass?.id || rec.className === className)
      ) {
        map.set(rec.studentId, rec);
      }
    });
    return map;
  }, [attendance, selectedDate, selectedPeriod, targetClass, className]);

  // Real-time counts for current session
  let presentCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;
  let lateCount = 0;

  classStudents.forEach(s => {
    const rec = currentSessionRecords.get(s.id);
    const status = rec ? rec.status : 'present'; // default present if not marked
    if (status === 'present') presentCount++;
    else if (status === 'excused') excusedCount++;
    else if (status === 'unexcused') unexcusedCount++;
    else if (status === 'late') lateCount++;
  });

  const totalStudents = classStudents.length || 1;
  const attendanceRate = Math.round(((presentCount + lateCount) / totalStudents) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStatusChange = (student: typeof classStudents[0], status: AttendanceStatus) => {
    const existing = currentSessionRecords.get(student.id);
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: existing ? existing.id : `att-${selectedDate}-${selectedPeriod}-${student.id}`,
      date: selectedDate,
      period: selectedPeriod,
      lessonTopic: lessonTopic || 'Tiết học Tiếng Anh',
      classId: targetClass?.id || 'class-7a',
      className,
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: student.fullName,
      status,
      note: existing?.note || '',
      recordedAt: `${selectedDate} ${nowTime}`
    };

    saveAttendanceRecord(newRecord);
  };

  const handleNoteChange = (student: typeof classStudents[0], note: string) => {
    const existing = currentSessionRecords.get(student.id);
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: existing ? existing.id : `att-${selectedDate}-${selectedPeriod}-${student.id}`,
      date: selectedDate,
      period: selectedPeriod,
      lessonTopic: lessonTopic || 'Tiết học Tiếng Anh',
      classId: targetClass?.id || 'class-7a',
      className,
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: student.fullName,
      status: existing ? existing.status : 'present',
      note,
      recordedAt: `${selectedDate} ${nowTime}`
    };

    saveAttendanceRecord(newRecord);
  };

  const handleMarkAllPresent = () => {
    markAllStudentsPresent(selectedDate, selectedPeriod, lessonTopic, targetClass.id, className);
    showToast(`Đã điểm danh Có mặt cho toàn bộ ${classStudents.length} học sinh Lớp ${className}!`);
  };

  const handleSaveSession = () => {
    // Commit all students in the class
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const recordsToSave: AttendanceRecord[] = classStudents.map(s => {
      const existing = currentSessionRecords.get(s.id);
      return {
        id: existing ? existing.id : `att-${selectedDate}-${selectedPeriod}-${s.id}`,
        date: selectedDate,
        period: selectedPeriod,
        lessonTopic: lessonTopic || 'Tiết học Tiếng Anh',
        classId: targetClass.id,
        className,
        studentId: s.id,
        studentCode: s.studentCode,
        studentName: s.fullName,
        status: existing ? existing.status : 'present',
        note: existing?.note || '',
        recordedAt: existing?.recordedAt || `${selectedDate} ${nowTime}`
      };
    });

    batchSaveAttendance(recordsToSave);
    showToast(`Đã lưu thành công điểm danh Lớp ${className} (${selectedPeriod} - ${selectedDate})!`);
  };

  const handleExportExcel = () => {
    // Export attendance records of selected class
    const classRecords = attendance.filter(
      a => a.classId === targetClass.id || a.className === className
    );
    exportAttendanceToExcel(classRecords, className);
  };

  // Student absence tracking for History tab
  const studentAbsenceStats = useMemo(() => {
    const stats: Record<string, { code: string; name: string; excused: number; unexcused: number; late: number }> = {};

    classStudents.forEach(s => {
      stats[s.id] = { code: s.studentCode, name: s.fullName, excused: 0, unexcused: 0, late: 0 };
    });

    attendance.forEach(rec => {
      if (rec.classId === targetClass.id || rec.className === className) {
        if (!stats[rec.studentId]) {
          stats[rec.studentId] = { code: rec.studentCode, name: rec.studentName, excused: 0, unexcused: 0, late: 0 };
        }
        if (rec.status === 'excused') stats[rec.studentId].excused++;
        if (rec.status === 'unexcused') stats[rec.studentId].unexcused++;
        if (rec.status === 'late') stats[rec.studentId].late++;
      }
    });

    return Object.values(stats);
  }, [attendance, classStudents, targetClass, className]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0B2D5C] flex items-center space-x-2">
            <CalendarCheck className="w-6 h-6 text-[#1266D6]" />
            <span>Điểm danh & Quản lý chuyên cần môn Tiếng Anh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Điểm danh nhanh theo buổi, theo dõi học sinh vắng có phép, không phép, đi muộn và xuất sổ theo dõi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {toastMessage && (
            <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </span>
          )}

          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
            title="Đánh dấu Có mặt cho toàn bộ học sinh lớp này"
          >
            <Check className="w-4 h-4" />
            <span>Điểm danh nhanh cả lớp Có mặt</span>
          </button>

          <button
            onClick={handleSaveSession}
            className="px-3.5 py-2 bg-[#1266D6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu buổi học</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Date, Class, and Period Control Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Class selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lớp học phụ trách:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ngày điểm danh:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            />
          </div>

          {/* Period selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiết học:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            >
              <option value="Tiết 1">Tiết 1 (07:15 - 08:00)</option>
              <option value="Tiết 2">Tiết 2 (08:05 - 08:50)</option>
              <option value="Tiết 3">Tiết 3 (09:05 - 09:50)</option>
              <option value="Tiết 4">Tiết 4 (09:55 - 10:40)</option>
              <option value="Tiết 5">Tiết 5 (10:45 - 11:30)</option>
            </select>
          </div>

          {/* Lesson topic */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung bài học / Unit:</label>
            <input
              type="text"
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              placeholder="VD: Unit 3 - A Closer Look 1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1266D6]"
            />
          </div>
        </div>
      </div>

      {/* Snapshot Counters for Current Session */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total students */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Sĩ số lớp {className}</div>
          <div className="text-xl font-bold text-[#0B2D5C] mt-0.5">{classStudents.length} em</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tiết {selectedPeriod}</div>
        </div>

        {/* Present */}
        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Có mặt</span>
          </div>
          <div className="text-xl font-bold text-emerald-800 mt-0.5">{presentCount} em</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{attendanceRate}% chuyên cần</div>
        </div>

        {/* Excused absence */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-amber-700 uppercase flex items-center justify-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Nghỉ có phép</span>
          </div>
          <div className="text-xl font-bold text-amber-800 mt-0.5">{excusedCount} em</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Có báo phụ huynh</div>
        </div>

        {/* Unexcused absence */}
        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-rose-700 uppercase flex items-center justify-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Không phép</span>
          </div>
          <div className="text-xl font-bold text-rose-800 mt-0.5">{unexcusedCount} em</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Cần nhắc nhở</div>
        </div>

        {/* Late */}
        <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-orange-700 uppercase flex items-center justify-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Đi muộn</span>
          </div>
          <div className="text-xl font-bold text-orange-800 mt-0.5">{lateCount} em</div>
          <div className="text-[10px] text-orange-600 mt-0.5">Ghi sổ theo dõi</div>
        </div>
      </div>

      {/* Sub-tabs: Điểm danh buổi học vs Lịch sử & Cảnh báo chuyên cần */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'daily'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Điểm danh buổi học ({selectedDate})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'history'
              ? 'bg-[#1266D6] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Lịch sử & Cảnh báo chuyên cần Lớp {className}</span>
        </button>
      </div>

      {activeSubTab === 'daily' ? (
        /* DAILY ATTENDANCE ROSTER TABLE */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Search inside class */}
          <div className="p-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Tìm học sinh trong lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1266D6]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <div className="text-xs text-slate-500">
              Bấm vào các nút màu bên dưới để đổi trạng thái điểm danh tức thì.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-3 font-bold w-12 text-center">STT</th>
                  <th className="py-3 px-3.5 font-bold w-24">Mã HS</th>
                  <th className="py-3 px-4 font-bold min-w-[160px]">Họ và tên học sinh</th>
                  <th className="py-3 px-4 font-bold min-w-[260px] text-center">Trạng thái chuyên cần</th>
                  <th className="py-3 px-4 font-bold min-w-[200px]">Lý do / Ghi chú của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      Không có học sinh nào trong lớp này.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => {
                    const record = currentSessionRecords.get(s.id);
                    const currentStatus: AttendanceStatus = record ? record.status : 'present';

                    return (
                      <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-[#0B2D5C]">
                          {s.studentCode}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          {s.fullName}
                        </td>

                        {/* Interactive Status Radio/Button Group */}
                        <td className="py-2.5 px-4">
                          <div className="grid grid-cols-4 gap-1 max-w-sm mx-auto">
                            {/* Có mặt */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s, 'present')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Có mặt</span>
                            </button>

                            {/* Nghỉ có phép */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s, 'excused')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                                currentStatus === 'excused'
                                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Có phép</span>
                            </button>

                            {/* Nghỉ không phép */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s, 'unexcused')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                                currentStatus === 'unexcused'
                                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>K.phép</span>
                            </button>

                            {/* Đi muộn */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s, 'late')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                                currentStatus === 'late'
                                  ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-300'
                                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Muộn</span>
                            </button>
                          </div>
                        </td>

                        {/* Note Input */}
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={record?.note || ''}
                            onChange={(e) => handleNoteChange(s, e.target.value)}
                            placeholder="Ghi chú lý do vắng/muộn..."
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#1266D6] focus:bg-white rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
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
      ) : (
        /* HISTORY & ATTENDANCE WARNINGS TAB */
        <div className="space-y-4">
          {/* Warning Banner for students with >= 3 absences */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  Cảnh báo chuyên cần học sinh (Nghỉ từ 3 buổi trở lên)
                </h4>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  Theo dõi số buổi vắng tích lũy trong học kỳ. Các em có từ 3 buổi vắng trở lên cần được giáo viên bộ môn trao đổi với Giáo viên chủ nhiệm hoặc liên hệ trực tiếp gia đình.
                </p>
              </div>
            </div>
          </div>

          {/* Cumulative Absence Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 font-bold text-xs text-[#0B2D5C] flex items-center justify-between">
              <span>Bảng tổng hợp chuyên cần tích lũy - Lớp {className}</span>
              <span className="text-slate-500 font-normal">Học kỳ I (2026–2027)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 text-xs uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3 font-bold w-12 text-center">STT</th>
                    <th className="py-2.5 px-3.5 font-bold w-24">Mã HS</th>
                    <th className="py-2.5 px-4 font-bold">Họ và tên</th>
                    <th className="py-2.5 px-3 font-bold text-center">Nghỉ có phép</th>
                    <th className="py-2.5 px-3 font-bold text-center">Nghỉ không phép</th>
                    <th className="py-2.5 px-3 font-bold text-center">Đi muộn</th>
                    <th className="py-2.5 px-4 font-bold text-center">Đánh giá chuyên cần</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {studentAbsenceStats.map((st, idx) => {
                    const totalAbsences = st.excused + st.unexcused;
                    const hasWarning = totalAbsences >= 3;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3.5 font-semibold text-[#0B2D5C]">{st.code}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{st.name}</td>
                        <td className="py-2.5 px-3 text-center text-amber-700 font-semibold">{st.excused} buổi</td>
                        <td className="py-2.5 px-3 text-center text-rose-700 font-bold">{st.unexcused} buổi</td>
                        <td className="py-2.5 px-3 text-center text-orange-700 font-semibold">{st.late} lần</td>
                        <td className="py-2.5 px-4 text-center">
                          {hasWarning ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                              ⚠️ Cần lưu ý ({totalAbsences} buổi vắng)
                            </span>
                          ) : totalAbsences === 0 && st.late === 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Chuyên cần tốt
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800">
                              Đạt yêu cầu
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
