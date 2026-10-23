import * as XLSX from 'xlsx';
import { Student, GradeRecord, PerformanceLevel, AttendanceRecord } from '../types';

export interface StudentImportRow {
  studentCode: string;
  fullName: string;
  className: string;
  grade?: number;
  level?: PerformanceLevel;
  progressPercent?: number;
  notes?: string;
}

export interface ImportValidationResult<T> {
  validRows: T[];
  errorRows: { row: number; data: any; reason: string }[];
  duplicateCount: number;
}

/**
 * Parses an Excel or CSV file containing student information
 */
export async function parseStudentFile(file: File): Promise<ImportValidationResult<StudentImportRow>> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (jsonRows.length <= 1) {
    return {
      validRows: [],
      errorRows: [{ row: 1, data: null, reason: 'Tệp rỗng hoặc không có dòng dữ liệu hợp lệ.' }],
      duplicateCount: 0
    };
  }

  // Look for header row
  const headerRow: string[] = jsonRows[0].map((h: any) => String(h || '').trim().toLowerCase());
  const codeIdx = headerRow.findIndex(h => h.includes('mã') || h.includes('code') || h.includes('mssv'));
  const nameIdx = headerRow.findIndex(h => h.includes('tên') || h.includes('họ') || h.includes('name'));
  const classIdx = headerRow.findIndex(h => h.includes('lớp') || h.includes('class'));
  const levelIdx = headerRow.findIndex(h => h.includes('mức') || h.includes('học lực') || h.includes('level'));
  const progressIdx = headerRow.findIndex(h => h.includes('tiến bộ') || h.includes('progress') || h.includes('%'));

  const validRows: StudentImportRow[] = [];
  const errorRows: { row: number; data: any; reason: string }[] = [];
  const seenCodes = new Set<string>();
  let duplicateCount = 0;

  for (let i = 1; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0 || row.every((cell: any) => cell === undefined || cell === '')) {
      continue; // Skip empty rows
    }

    const studentCode = String(row[codeIdx >= 0 ? codeIdx : 1] || '').trim();
    const fullName = String(row[nameIdx >= 0 ? nameIdx : 2] || '').trim();
    const className = String(row[classIdx >= 0 ? classIdx : 3] || '7A').trim();
    const rawLevel = levelIdx >= 0 && row[levelIdx] ? String(row[levelIdx]).trim() : 'Khá';
    let level: PerformanceLevel = 'Khá';
    if (rawLevel === 'Tốt' || rawLevel.toLowerCase().includes('tốt') || rawLevel.toLowerCase().includes('giỏi')) {
      level = 'Tốt';
    } else if (rawLevel === 'Trung bình' || rawLevel.toLowerCase().includes('tb') || rawLevel.toLowerCase().includes('trung bình')) {
      level = 'Trung bình';
    } else if (rawLevel === 'Cần cố gắng' || rawLevel.toLowerCase().includes('yếu') || rawLevel.toLowerCase().includes('kém')) {
      level = 'Cần cố gắng';
    }
    const progressRaw = progressIdx >= 0 && row[progressIdx] ? Number(row[progressIdx]) : 75;

    if (!fullName) {
      errorRows.push({ row: i + 1, data: row, reason: 'Thiếu Họ và tên học sinh' });
      continue;
    }

    if (!studentCode) {
      errorRows.push({ row: i + 1, data: row, reason: 'Thiếu Mã định danh học sinh' });
      continue;
    }

    if (seenCodes.has(studentCode.toUpperCase())) {
      duplicateCount++;
      errorRows.push({ row: i + 1, data: row, reason: `Trùng lặp mã học sinh: ${studentCode}` });
      continue;
    }

    seenCodes.add(studentCode.toUpperCase());

    // Extract grade from class name if possible (e.g. "7A" -> 7)
    const gradeMatch = className.match(/\d+/);
    const grade = gradeMatch ? parseInt(gradeMatch[0], 10) : 7;

    validRows.push({
      studentCode,
      fullName,
      className,
      grade,
      level,
      progressPercent: isNaN(progressRaw) ? 75 : Math.min(100, Math.max(0, progressRaw))
    });
  }

  return { validRows, errorRows, duplicateCount };
}

/**
 * Exports students list to Excel (.xlsx) file
 */
export function exportStudentsToExcel(students: Student[], fileName = 'Danh_Sach_Hoc_Sinh_NHT.xlsx') {
  const exportData = students.map((s, index) => ({
    'STT': index + 1,
    'Mã học sinh': s.studentCode,
    'Họ và tên': s.fullName,
    'Lớp': s.className,
    'Khối': s.grade,
    'Mức độ học tập': s.level,
    'Tiến bộ (%)': s.progressPercent,
    'Điểm Từ vựng': s.skillScores?.vocabulary ?? '',
    'Điểm Ngữ pháp': s.skillScores?.grammar ?? '',
    'Điểm Đọc hiểu': s.skillScores?.reading ?? '',
    'Điểm Nghe': s.skillScores?.listening ?? '',
    'Ghi chú': s.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Học sinh');
  XLSX.writeFile(workbook, fileName);
}

/**
 * Exports gradebook to Excel (.xlsx) file
 */
export function exportGradebookToExcel(grades: GradeRecord[], className = 'Tat_Ca', fileName = '') {
  const exportData = grades.map((g, index) => ({
    'STT': index + 1,
    'Mã học sinh': g.studentCode,
    'Họ và tên': g.studentName,
    'Lớp': g.className,
    'Học kỳ': g.semester,
    'TX 1': g.tx1 !== null && g.tx1 !== undefined ? g.tx1 : '',
    'TX 2': g.tx2 !== null && g.tx2 !== undefined ? g.tx2 : '',
    'TX 3': g.tx3 !== null && g.tx3 !== undefined ? g.tx3 : '',
    'TX 4': g.tx4 !== null && g.tx4 !== undefined ? g.tx4 : '',
    'Giữa kỳ (GK)': g.gk !== null && g.gk !== undefined ? g.gk : '',
    'Cuối kỳ (CK)': g.ck !== null && g.ck !== undefined ? g.ck : '',
    'Điểm TB (TB)': g.tb !== null && g.tb !== undefined ? g.tb : '',
    'Nhận xét của giáo viên': g.comment || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');
  const actualFileName = fileName || `Bang_Diem_Tieng_Anh_${className}_NHT.xlsx`;
  XLSX.writeFile(workbook, actualFileName);
}

/**
 * Downloads a pre-formatted Excel template for teacher use
 */
export function downloadStudentTemplate() {
  const templateData = [
    {
      'STT': 1,
      'Mã học sinh': '7A01',
      'Họ và tên': 'Nguyễn Văn An',
      'Lớp': '7A',
      'Mức độ': 'Tốt',
      'Tiến bộ (%)': 85,
      'Ghi chú': 'Học sinh chuyển từ trường khác sang'
    },
    {
      'STT': 2,
      'Mã học sinh': '7A02',
      'Họ và tên': 'Trần Thị Bình',
      'Lớp': '7A',
      'Mức độ': 'Khá',
      'Tiến bộ (%)': 80,
      'Ghi chú': ''
    },
    {
      'STT': 3,
      'Mã học sinh': '7A03',
      'Họ và tên': 'Lê Hoàng Cường',
      'Lớp': '7A',
      'Mức độ': 'Trung bình',
      'Tiến bộ (%)': 65,
      'Ghi chú': 'Cần hỗ trợ ngữ pháp'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu nhập học sinh');
  XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh_THCS_NHT.xlsx');
}

/**
 * Calculate semester average score based on standard Vietnamese secondary school formula
 * TB = (TX_sum + 2*GK + 3*CK) / (TX_count + 5)
 */
export function calculateSemesterAverage(txScores: (number | null | undefined)[], gk: number | null | undefined, ck: number | null | undefined): number | null {
  const validTx = txScores.filter((s): s is number => typeof s === 'number' && !isNaN(s));
  
  if (validTx.length === 0 && (gk === null || gk === undefined) && (ck === null || ck === undefined)) {
    return null;
  }

  const txSum = validTx.reduce((sum, val) => sum + val, 0);
  const gkVal = (gk !== null && gk !== undefined) ? gk : 0;
  const ckVal = (ck !== null && ck !== undefined) ? ck : 0;

  const totalPoints = txSum + (gkVal * 2) + (ckVal * 3);
  const denominator = validTx.length + (gk !== null && gk !== undefined ? 2 : 0) + (ck !== null && ck !== undefined ? 3 : 0);

  if (denominator === 0) return null;

  const avg = totalPoints / denominator;
  return Math.round(avg * 10) / 10;
}

/**
 * Export attendance history to Excel file
 */
export function exportAttendanceToExcel(records: AttendanceRecord[], className = '7A', fileName = '') {
  const statusLabels: Record<string, string> = {
    present: 'Có mặt',
    excused: 'Nghỉ có phép',
    unexcused: 'Nghỉ không phép',
    late: 'Đi muộn'
  };

  const exportData = records.map((r, index) => ({
    'STT': index + 1,
    'Ngày học': r.date,
    'Tiết học': r.period,
    'Bài học': r.lessonTopic,
    'Mã học sinh': r.studentCode,
    'Họ và tên': r.studentName,
    'Lớp': r.className,
    'Trạng thái': statusLabels[r.status] || r.status,
    'Ghi chú / Lý do': r.note || '',
    'Thời gian ghi': r.recordedAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'So_Diem_Danh');
  const actualFileName = fileName || `So_Diem_Danh_Lop_${className}_THCS_NHT.xlsx`;
  XLSX.writeFile(workbook, actualFileName);
}

