import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  ClassItem,
  Student,
  GradeRecord,
  Question,
  Quiz,
  QuizSubmission,
  LearningResource,
  SystemNotification,
  TeacherProfile,
  AttendanceRecord
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_QUESTIONS,
  INITIAL_QUIZZES,
  INITIAL_SUBMISSIONS,
  INITIAL_RESOURCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEACHER_PROFILE,
  INITIAL_ATTENDANCE
} from '../data/initialData';
import { calculateSemesterAverage } from '../services/excelService';

export type NavigationTab =
  | 'overview'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'question-bank'
  | 'quizzes'
  | 'library'
  | 'ai-assistant'
  | 'analytics'
  | 'settings'
  | 'take-quiz'
  | 'student-portal';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isDemoMode: boolean;

  // Selected student for detail view
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;

  // Active quiz for taking test
  activeQuizId: string | null;
  setActiveQuizId: (quizId: string | null) => void;

  // Data collections
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  classes: ClassItem[];
  addClass: (cls: Omit<ClassItem, 'id' | 'studentCount'>) => void;
  updateClass: (id: string, cls: Partial<ClassItem>) => void;
  archiveClass: (id: string) => void;

  students: Student[];
  addStudent: (std: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, std: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Partial<Student>[]) => { added: number; updated: number };

  grades: GradeRecord[];
  updateGradeRecord: (id: string, updates: Partial<GradeRecord>) => void;
  saveGradeCell: (gradeId: string, field: 'tx1' | 'tx2' | 'tx3' | 'tx4' | 'gk' | 'ck' | 'comment', value: any) => void;

  questions: Question[];
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;

  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;

  submissions: QuizSubmission[];
  submitQuizAttempt: (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>) => void;

  resources: LearningResource[];
  addResource: (res: Omit<LearningResource, 'id' | 'uploadDate'>) => void;
  deleteResource: (id: string) => void;

  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;

  // Attendance
  attendance: AttendanceRecord[];
  saveAttendanceRecord: (record: AttendanceRecord) => void;
  batchSaveAttendance: (records: AttendanceRecord[]) => void;
  markAllStudentsPresent: (date: string, period: string, lessonTopic: string, classId: string, className: string) => void;

  // Actions
  resetToDemoData: () => void;
  clearDemoData: () => void;
  exportDatabaseJson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'nht_classes_v2',
  STUDENTS: 'nht_students_v2',
  GRADES: 'nht_grades_v2',
  QUESTIONS: 'nht_questions_v2',
  QUIZZES: 'nht_quizzes_v2',
  SUBMISSIONS: 'nht_submissions_v2',
  RESOURCES: 'nht_resources_v2',
  NOTIFICATIONS: 'nht_notifications_v2',
  ATTENDANCE: 'nht_attendance_v2',
  PROFILE: 'nht_profile_v2',
  IS_DEMO: 'nht_is_demo_v2'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-7a');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Load from localStorage with initial fallback
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [resources, setResources] = useState<LearningResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILE;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(teacherProfile));
  }, [teacherProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  // Actions
  const updateTeacherProfile = (updates: Partial<TeacherProfile>) => {
    setTeacherProfile(prev => ({ ...prev, ...updates }));
  };

  const addClass = (clsData: Omit<ClassItem, 'id' | 'studentCount'>) => {
    const newClass: ClassItem = {
      ...clsData,
      id: `class-${Date.now()}`,
      studentCount: 0
    };
    setClasses(prev => [newClass, ...prev]);
  };

  const updateClass = (id: string, updates: Partial<ClassItem>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const archiveClass = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'archived' : 'active' } : c));
  };

  const addStudent = (stdData: Omit<Student, 'id'>) => {
    const newId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...stdData,
      id: newId
    };
    setStudents(prev => [newStudent, ...prev]);

    // Also initialize grade record
    const newGrade: GradeRecord = {
      id: `grd-${Date.now()}`,
      studentId: newId,
      studentCode: stdData.studentCode,
      studentName: stdData.fullName,
      classId: stdData.classId,
      className: stdData.className,
      semester: 'Học kỳ I',
      academicYear: '2026–2027',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setGrades(prev => [newGrade, ...prev]);

    // Update class student count
    setClasses(prev => prev.map(c => c.id === stdData.classId ? { ...c, studentCount: c.studentCount + 1 } : c));
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    // Also sync student name or class if changed
    if (updates.fullName || updates.className) {
      setGrades(prev => prev.map(g => g.studentId === id ? {
        ...g,
        ...(updates.fullName ? { studentName: updates.fullName } : {}),
        ...(updates.className ? { className: updates.className } : {})
      } : g));
    }
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setClasses(prev => prev.map(c => c.id === student.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c));
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    setGrades(prev => prev.filter(g => g.studentId !== id));
  };

  const importStudents = (newStudents: Partial<Student>[]) => {
    let added = 0;
    let updated = 0;

    setStudents(prev => {
      const updatedList = [...prev];
      const newGradesList = [...grades];

      newStudents.forEach(item => {
        if (!item.fullName || !item.studentCode) return;

        const existingIdx = updatedList.findIndex(s => s.studentCode.toLowerCase() === item.studentCode?.toLowerCase());
        const targetClass = classes.find(c => c.name.toLowerCase() === item.className?.toLowerCase()) || classes[0];

        if (existingIdx >= 0) {
          // Update existing
          updatedList[existingIdx] = {
            ...updatedList[existingIdx],
            ...item,
            classId: targetClass ? targetClass.id : updatedList[existingIdx].classId,
            className: targetClass ? targetClass.name : updatedList[existingIdx].className
          };
          updated++;
        } else {
          // Add new
          const newId = `std-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const created: Student = {
            id: newId,
            studentCode: item.studentCode,
            fullName: item.fullName,
            classId: targetClass ? targetClass.id : 'class-7a',
            className: targetClass ? targetClass.name : '7A',
            grade: item.grade || (targetClass ? targetClass.grade : 7),
            academicYear: '2026–2027',
            level: (item.level as any) || 'Khá',
            progressPercent: item.progressPercent || 75,
            status: 'active',
            strengths: item.strengths || ['Chăm chỉ học tập'],
            improvements: item.improvements || ['Rèn thêm ngữ pháp'],
            skillScores: item.skillScores || {
              vocabulary: 7.5,
              grammar: 7.0,
              reading: 7.5,
              listening: 7.0
            },
            notes: item.notes || 'Nhập từ file Excel'
          };
          updatedList.push(created);

          // Add grade record
          newGradesList.push({
            id: `grd-imp-${newId}`,
            studentId: newId,
            studentCode: created.studentCode,
            studentName: created.fullName,
            classId: created.classId,
            className: created.className,
            semester: 'Học kỳ I',
            academicYear: '2026–2027',
            lastUpdated: new Date().toISOString().split('T')[0]
          });
          added++;
        }
      });

      setGrades(newGradesList);
      return updatedList;
    });

    return { added, updated };
  };

  const updateGradeRecord = (id: string, updates: Partial<GradeRecord>) => {
    setGrades(prev => prev.map(g => {
      if (g.id !== id) return g;
      const combined = { ...g, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      // Recalculate average
      combined.tb = calculateSemesterAverage(
        [combined.tx1, combined.tx2, combined.tx3, combined.tx4],
        combined.gk,
        combined.ck
      );
      return combined;
    }));
  };

  const saveGradeCell = (gradeId: string, field: 'tx1' | 'tx2' | 'tx3' | 'tx4' | 'gk' | 'ck' | 'comment', value: any) => {
    let parsedValue = value;
    if (field !== 'comment') {
      if (value === '' || value === null || value === undefined) {
        parsedValue = null;
      } else {
        const num = parseFloat(value);
        if (isNaN(num)) return;
        parsedValue = Math.min(10, Math.max(0, Math.round(num * 10) / 10));
      }
    }

    updateGradeRecord(gradeId, { [field]: parsedValue });
  };

  const addQuestion = (qData: Omit<Question, 'id'>) => {
    const newQuestion: Question = {
      ...qData,
      id: `q-${Date.now()}`
    };
    setQuestions(prev => [newQuestion, ...prev]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const submitQuizAttempt = (subData: Omit<QuizSubmission, 'id' | 'submittedAt'>) => {
    const newSub: QuizSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN')
    };
    setSubmissions(prev => [newSub, ...prev]);

    // Send notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Học sinh đã nộp bài: ${subData.studentName}`,
        message: `Đã nộp bài "${subData.quizTitle}" - Đạt ${subData.score}/${subData.totalScore} điểm (${subData.percentage}%).`,
        date: new Date().toISOString().split('T')[0],
        isRead: false,
        type: 'info'
      },
      ...prev
    ]);
  };

  const addResource = (resData: Omit<LearningResource, 'id' | 'uploadDate'>) => {
    const newRes: LearningResource = {
      ...resData,
      id: `res-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const saveAttendanceRecord = (record: AttendanceRecord) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a =>
        a.date === record.date &&
        a.studentId === record.studentId &&
        a.period === record.period
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [record, ...prev];
    });
  };

  const batchSaveAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      const updated = [...prev];
      records.forEach(rec => {
        const idx = updated.findIndex(a =>
          a.date === rec.date &&
          a.studentId === rec.studentId &&
          a.period === rec.period
        );
        if (idx >= 0) {
          updated[idx] = rec;
        } else {
          updated.push(rec);
        }
      });
      return updated;
    });
  };

  const markAllStudentsPresent = (
    date: string,
    period: string,
    lessonTopic: string,
    classId: string,
    className: string
  ) => {
    const classMembers = students.filter(s => s.classId === classId || s.className === className);
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newRecords: AttendanceRecord[] = classMembers.map(s => ({
      id: `att-${date}-${period}-${s.id}`,
      date,
      period,
      lessonTopic: lessonTopic || 'Tiết học Tiếng Anh',
      classId,
      className,
      studentId: s.id,
      studentCode: s.studentCode,
      studentName: s.fullName,
      status: 'present',
      note: '',
      recordedAt: `${date} ${nowTime}`
    }));

    batchSaveAttendance(newRecords);
  };

  const resetToDemoData = () => {
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setQuestions(INITIAL_QUESTIONS);
    setQuizzes(INITIAL_QUIZZES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setResources(INITIAL_RESOURCES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAttendance(INITIAL_ATTENDANCE);
    setTeacherProfile(INITIAL_TEACHER_PROFILE);
    setIsDemoMode(true);
  };

  const clearDemoData = () => {
    setStudents([]);
    setGrades([]);
    setSubmissions([]);
    setAttendance([]);
    setIsDemoMode(false);
  };

  const exportDatabaseJson = () => {
    const dbDump = {
      classes,
      students,
      grades,
      questions,
      quizzes,
      submissions,
      resources,
      attendance,
      teacherProfile,
      exportDate: new Date().toISOString(),
      system: 'NHT ENGLISH LEARNING HUB'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbDump, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NHT_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        selectedClassId,
        setSelectedClassId,
        searchQuery,
        setSearchQuery,
        isNotificationOpen,
        setIsNotificationOpen,
        isDemoMode,
        selectedStudent,
        setSelectedStudent,
        activeQuizId,
        setActiveQuizId,
        teacherProfile,
        updateTeacherProfile,
        classes,
        addClass,
        updateClass,
        archiveClass,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        grades,
        updateGradeRecord,
        saveGradeCell,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        quizzes,
        addQuiz,
        updateQuiz,
        submissions,
        submitQuizAttempt,
        resources,
        addResource,
        deleteResource,
        notifications,
        markNotificationAsRead,
        attendance,
        saveAttendanceRecord,
        batchSaveAttendance,
        markAllStudentsPresent,
        resetToDemoData,
        clearDemoData,
        exportDatabaseJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
