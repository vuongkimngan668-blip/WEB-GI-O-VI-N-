export type UserRole = 'teacher' | 'student' | 'admin' | 'parent';

export type EnglishSkill = 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Pronunciation';

export type PerformanceLevel = 'Tốt' | 'Khá' | 'Trung bình' | 'Cần cố gắng';

export type DifferentiationLevel = 'Support' | 'Core' | 'Stretch';

export interface ClassItem {
  id: string;
  name: string; // e.g. "7A", "6A1", "8A1", "9A1"
  grade: number; // 6, 7, 8, 9
  academicYear: string; // "2026–2027"
  semester: string; // "Học kỳ I" | "Học kỳ II"
  teacherName: string;
  studentCount: number;
  description: string;
  status: 'active' | 'archived';
}

export interface StudentSkillScores {
  vocabulary: number;
  grammar: number;
  reading: number;
  listening: number;
  writing?: number;
  speaking?: number;
}

export interface Student {
  id: string; // internal unique database id
  studentCode: string; // e.g. "7A01", "7A02"
  fullName: string;
  classId: string;
  className: string;
  grade: number;
  academicYear: string;
  level: PerformanceLevel;
  progressPercent: number;
  status: 'active' | 'inactive';
  notes?: string;
  strengths: string[];
  improvements: string[];
  skillScores: StudentSkillScores;
  avatarUrl?: string;
  isFeatured?: boolean; // Featured student on dashboard
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  semester: string; // "Học kỳ I" | "Học kỳ II"
  academicYear: string;
  tx1?: number | null; // Thường xuyên 1
  tx2?: number | null; // Thường xuyên 2
  tx3?: number | null; // Thường xuyên 3
  tx4?: number | null; // Thường xuyên 4
  gk?: number | null;  // Giữa kỳ (hệ số 2)
  ck?: number | null;  // Cuối kỳ (hệ số 3)
  tb?: number | null;  // Điểm trung bình học kỳ
  comment?: string;
  lastUpdated: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'gap_filling'
  | 'matching'
  | 'sentence_ordering'
  | 'reading_comprehension'
  | 'listening_comprehension';

export interface Question {
  id: string;
  grade: number; // 6, 7, 8, 9
  unit: string;  // e.g. "Unit 1: Hobbies"
  topic: string;
  skill: EnglishSkill;
  cefrLevel: 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1';
  difficulty: 'Dễ' | 'Trung bình' | 'Khá' | 'Giỏi';
  differentiation: DifferentiationLevel;
  type: QuestionType;
  prompt: string;
  passage?: string; // Reading or listening passage/script
  audioUrl?: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // index or text
  explanation: string;
  points: number;
}

export interface QuizQuestionRef {
  questionId: string;
  customPoints?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  grade: number;
  unit: string;
  category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening' | 'Tổng hợp';
  targetClassIds: string[]; // Classes eligible
  targetClassNames: string[];
  durationMinutes: number; // e.g. 15, 30, 45
  questionCount: number;
  totalPoints: number;
  questions: Question[];
  maxAttempts: number;
  allowReview: boolean;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  className: string;
  submittedAt: string;
  score: number;
  totalScore: number;
  percentage: number;
  answers: Record<string, any>;
  teacherFeedback?: string;
  timeSpentSeconds: number;
}

export interface LearningResource {
  id: string;
  title: string;
  grade: number; // 6, 7, 8, 9
  unit: string;
  topic: string;
  category: 'Textbook' | 'Worksheet' | 'Lesson Plan' | 'Audio' | 'Video' | 'Test Paper' | 'Presentation';
  fileType: 'pdf' | 'docx' | 'pptx' | 'mp3' | 'mp4' | 'link';
  fileSize?: string;
  downloadUrl?: string;
  externalUrl?: string;
  description: string;
  uploadDate: string;
  isDownloadable: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  differentiationData?: {
    support: string;
    core: string;
    stretch: string;
  };
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface TeacherProfile {
  name: string;
  title: string;
  schoolName: string;
  academicYear: string;
  currentSemester: string;
  email: string;
  avatarUrl: string;
  schoolLogoUrl: string;
}

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  period: string; // "Tiết 1", "Tiết 2", ...
  lessonTopic: string; // e.g. "Unit 2: A Closer Look 1"
  classId: string;
  className: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
  recordedAt: string;
}

