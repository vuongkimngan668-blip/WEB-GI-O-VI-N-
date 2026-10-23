import {
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

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  name: 'Vương Thị Ngân',
  title: 'Giáo viên Tiếng Anh',
  schoolName: 'Trường THCS Nguyễn Huy Tưởng',
  academicYear: '2026–2027',
  currentSemester: 'Học kỳ I',
  email: 'vuongkimngan668@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
  schoolLogoUrl: ''
};

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'class-7a',
    name: '7A',
    grade: 7,
    academicYear: '2026–2027',
    semester: 'Học kỳ I',
    teacherName: 'Vương Thị Ngân',
    studentCount: 42,
    description: 'Lớp 7A - Chương trình Tiếng Anh Global Success thí điểm nâng cao',
    status: 'active'
  },
  {
    id: 'class-6a1',
    name: '6A1',
    grade: 6,
    academicYear: '2026–2027',
    semester: 'Học kỳ I',
    teacherName: 'Vương Thị Ngân',
    studentCount: 40,
    description: 'Lớp 6A1 - Khóa khởi đầu THCS, tăng cường phản xạ giao tiếp',
    status: 'active'
  },
  {
    id: 'class-8a1',
    name: '8A1',
    grade: 8,
    academicYear: '2026–2027',
    semester: 'Học kỳ I',
    teacherName: 'Vương Thị Ngân',
    studentCount: 41,
    description: 'Lớp 8A1 - Tập trung cấu trúc ngữ pháp phức hợp và đọc hiểu văn bản',
    status: 'active'
  },
  {
    id: 'class-9a1',
    name: '9A1',
    grade: 9,
    academicYear: '2026–2027',
    semester: 'Học kỳ I',
    teacherName: 'Vương Thị Ngân',
    studentCount: 39,
    description: 'Lớp 9A1 - Luyện đề thi tuyển sinh vào Lớp 10 THPT công lập',
    status: 'active'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-7a-01',
    studentCode: '7A01',
    fullName: 'Nguyễn Hoàng Anh',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Khá',
    progressPercent: 85,
    status: 'active',
    isFeatured: true,
    strengths: [
      'Từ vựng phong phú',
      'Kỹ năng nghe tốt',
      'Tích cực tham gia hoạt động lớp học'
    ],
    improvements: [
      'Ngữ pháp nâng cao',
      'Kỹ năng viết đoạn văn dài',
      'Luyện thêm kỹ năng đọc hiểu'
    ],
    skillScores: {
      vocabulary: 9.0,
      grammar: 8.5,
      reading: 8.0,
      listening: 8.5,
      writing: 8.0,
      speaking: 9.0
    },
    notes: 'Học sinh năng nổ, có định hướng tham gia câu lạc bộ tiếng Anh trường.'
  },
  {
    id: 'std-7a-02',
    studentCode: '7A02',
    fullName: 'Trần Minh Châu',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Tốt',
    progressPercent: 92,
    status: 'active',
    strengths: [
      'Ngữ pháp chuẩn xác',
      'Đọc hiểu nhanh',
      'Chăm chỉ làm bài về nhà'
    ],
    improvements: [
      'Phát âm tự nhiên hơn',
      'Tự tin khi thuyết trình trước lớp'
    ],
    skillScores: {
      vocabulary: 8.5,
      grammar: 9.0,
      reading: 9.0,
      listening: 8.0,
      writing: 8.5,
      speaking: 7.5
    }
  },
  {
    id: 'std-7a-03',
    studentCode: '7A03',
    fullName: 'Lê Gia Hân',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Khá',
    progressPercent: 78,
    status: 'active',
    strengths: [
      'Khả năng ghi nhớ từ vựng tốt',
      'Tương tác tích cực theo nhóm'
    ],
    improvements: [
      'Cần rèn thêm thì Quá khứ đơn',
      'Luyện nghe chi tiết'
    ],
    skillScores: {
      vocabulary: 8.0,
      grammar: 7.5,
      reading: 7.5,
      listening: 7.0,
      writing: 7.0,
      speaking: 8.0
    }
  },
  {
    id: 'std-7a-04',
    studentCode: '7A04',
    fullName: 'Phạm Tuấn Kiệt',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Trung bình',
    progressPercent: 65,
    status: 'active',
    strengths: [
      'Có cố gắng trong các giờ bài tập nhóm',
      'Nắm được các từ vựng căn bản'
    ],
    improvements: [
      'Củng cố ngữ pháp câu đơn và câu ghép',
      'Cần thêm bài tập giàn giáo (Support tier)',
      'Luyện phát âm đuôi -s / -ed'
    ],
    skillScores: {
      vocabulary: 6.5,
      grammar: 6.0,
      reading: 7.0,
      listening: 6.5,
      writing: 6.0,
      speaking: 6.5
    }
  },
  {
    id: 'std-7a-05',
    studentCode: '7A05',
    fullName: 'Vũ Thảo Linh',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Tốt',
    progressPercent: 90,
    status: 'active',
    strengths: [
      'Phát âm chuẩn ngữ điệu',
      'Viết đoạn văn mạch lạc',
      'Đạt điểm cao các bài kiểm tra nghe'
    ],
    improvements: [
      'Mở rộng các thành ngữ (idioms) thông dụng'
    ],
    skillScores: {
      vocabulary: 9.0,
      grammar: 8.5,
      reading: 8.5,
      listening: 9.0,
      writing: 8.5,
      speaking: 9.0
    }
  },
  {
    id: 'std-7a-06',
    studentCode: '7A06',
    fullName: 'Đỗ Bảo Nam',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Khá',
    progressPercent: 82,
    status: 'active',
    strengths: ['Tư duy logic tốt', 'Nắm vững quy tắc chia động từ'],
    improvements: ['Cần đọc nhiều tài liệu mở rộng'],
    skillScores: {
      vocabulary: 8.0,
      grammar: 8.5,
      reading: 8.0,
      listening: 7.5,
      writing: 7.5,
      speaking: 7.5
    }
  },
  {
    id: 'std-7a-07',
    studentCode: '7A07',
    fullName: 'Hoàng Thùy Dương',
    classId: 'class-7a',
    className: '7A',
    grade: 7,
    academicYear: '2026–2027',
    level: 'Tốt',
    progressPercent: 95,
    status: 'active',
    strengths: ['Kỹ năng toàn diện', 'Hỗ trợ tốt các bạn trong nhóm'],
    improvements: ['Chuẩn bị thi học sinh giỏi cấp Huyện'],
    skillScores: {
      vocabulary: 9.5,
      grammar: 9.5,
      reading: 9.0,
      listening: 9.5,
      writing: 9.0,
      speaking: 9.0
    }
  },
  {
    id: 'std-6a1-01',
    studentCode: '6A01',
    fullName: 'Bùi Đức Trọng',
    classId: 'class-6a1',
    className: '6A1',
    grade: 6,
    academicYear: '2026–2027',
    level: 'Khá',
    progressPercent: 80,
    status: 'active',
    strengths: ['Hào hứng học bài mới', 'Phản xạ nhanh'],
    improvements: ['Chú ý viết đúng chính tả từ vựng'],
    skillScores: {
      vocabulary: 8.0,
      grammar: 7.5,
      reading: 8.0,
      listening: 8.5,
      writing: 7.0,
      speaking: 8.0
    }
  },
  {
    id: 'std-8a1-01',
    studentCode: '8A01',
    fullName: 'Lê Minh Khôi',
    classId: 'class-8a1',
    className: '8A1',
    grade: 8,
    academicYear: '2026–2027',
    level: 'Tốt',
    progressPercent: 88,
    status: 'active',
    strengths: ['Đọc hiểu văn bản dài tốt', 'Lập luận chặt chẽ'],
    improvements: ['Luyện nghe nối âm'],
    skillScores: {
      vocabulary: 8.5,
      grammar: 9.0,
      reading: 9.0,
      listening: 8.0,
      writing: 8.5,
      speaking: 8.0
    }
  },
  {
    id: 'std-9a1-01',
    studentCode: '9A01',
    fullName: 'Phan Quỳnh Chi',
    classId: 'class-9a1',
    className: '9A1',
    grade: 9,
    academicYear: '2026–2027',
    level: 'Tốt',
    progressPercent: 94,
    status: 'active',
    strengths: ['Kiến thức ngữ pháp chắc chắn', 'Tốc độ làm đề thi nhanh'],
    improvements: ['Giữ vững phong độ cho kỳ thi vào 10'],
    skillScores: {
      vocabulary: 9.5,
      grammar: 9.5,
      reading: 9.0,
      listening: 9.0,
      writing: 9.0,
      speaking: 9.5
    }
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-01',
    studentId: 'std-7a-01',
    studentCode: '7A01',
    studentName: 'Nguyễn Hoàng Anh',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 9.0,
    tx2: 9.0,
    tx3: 9.0,
    tx4: 9.0,
    gk: 8.5,
    ck: 9.0,
    tb: 8.8,
    comment: 'Học lực rất tốt, tương tác trên lớp sôi nổi, phát huy khả năng giao tiếp.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-02',
    studentId: 'std-7a-02',
    studentCode: '7A02',
    studentName: 'Trần Minh Châu',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 8.0,
    tx2: 8.0,
    tx3: 8.0,
    tx4: 8.0,
    gk: 8.0,
    ck: 8.5,
    tb: 8.2,
    comment: 'Chăm chỉ, làm bài tập đầy đủ, ngữ pháp rất chắc chắn.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-03',
    studentId: 'std-7a-03',
    studentCode: '7A03',
    studentName: 'Lê Gia Hân',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 7.5,
    tx2: 7.5,
    tx3: 7.5,
    tx4: 7.5,
    gk: 7.0,
    ck: 8.0,
    tb: 7.5,
    comment: 'Tiến bộ rõ rệt ở bài thi cuối kỳ, cần chú ý ôn luyện các thì quá khứ.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-04',
    studentId: 'std-7a-04',
    studentCode: '7A04',
    studentName: 'Phạm Tuấn Kiệt',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 6.5,
    tx2: 6.5,
    tx3: 6.5,
    tx4: 6.5,
    gk: 6.0,
    ck: 7.0,
    tb: 6.5,
    comment: 'Đã hoàn thành các bài tập giàn giáo Support, có nỗ lực vươn lên tầng Core.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-05',
    studentId: 'std-7a-05',
    studentCode: '7A05',
    studentName: 'Vũ Thảo Linh',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 8.5,
    tx2: 8.5,
    tx3: 8.5,
    tx4: 8.5,
    gk: 8.5,
    ck: 9.0,
    tb: 8.7,
    comment: 'Bài thi cuối kỳ đạt điểm 9 xuất sắc, phát âm chuẩn tự nhiên.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-06',
    studentId: 'std-7a-06',
    studentCode: '7A06',
    studentName: 'Đỗ Bảo Nam',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 8.0,
    tx2: 8.0,
    tx3: 8.5,
    tx4: 8.0,
    gk: 8.0,
    ck: 8.5,
    tb: 8.2,
    comment: 'Học lực khá giỏi, tích cực tương tác.',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'grd-07',
    studentId: 'std-7a-07',
    studentCode: '7A07',
    studentName: 'Hoàng Thùy Dương',
    classId: 'class-7a',
    className: '7A',
    semester: 'Học kỳ I',
    academicYear: '2026–2027',
    tx1: 9.5,
    tx2: 9.5,
    tx3: 9.0,
    tx4: 9.5,
    gk: 9.5,
    ck: 9.5,
    tb: 9.4,
    comment: 'Xuất sắc toàn diện cả 4 kỹ năng.',
    lastUpdated: '2026-10-20'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-voc-01',
    grade: 7,
    unit: 'Unit 1: Hobbies',
    topic: 'Free time and hobbies',
    skill: 'Vocabulary',
    cefrLevel: 'A2',
    difficulty: 'Dễ',
    differentiation: 'Core',
    type: 'multiple_choice',
    prompt: 'My brother enjoys ________ stamps and coins from different countries in his free time.',
    options: ['collecting', 'playing', 'doing', 'making'],
    correctAnswer: 0,
    explanation: 'Cụm từ "collect stamps" có nghĩa là sưu tầm tem.',
    points: 1
  },
  {
    id: 'q-voc-02',
    grade: 7,
    unit: 'Unit 2: Healthy Living',
    topic: 'Health and Wellness',
    skill: 'Vocabulary',
    cefrLevel: 'A2',
    difficulty: 'Trung bình',
    differentiation: 'Core',
    type: 'multiple_choice',
    prompt: 'Eating lots of fresh vegetables and avoiding junk food helps you stay in ________.',
    options: ['shape', 'order', 'touch', 'place'],
    correctAnswer: 0,
    explanation: 'Thành ngữ "stay in shape" có nghĩa là giữ vóc dáng thon gọn, khỏe mạnh.',
    points: 1
  },
  {
    id: 'q-gra-01',
    grade: 7,
    unit: 'Unit 3: Community Service',
    topic: 'Volunteer Work',
    skill: 'Grammar',
    cefrLevel: 'A2',
    difficulty: 'Trung bình',
    differentiation: 'Core',
    type: 'multiple_choice',
    prompt: 'Last Sunday, we ________ warm clothes and blankets to street children.',
    options: ['donated', 'donate', 'are donating', 'have donated'],
    correctAnswer: 0,
    explanation: '"Last Sunday" là trạng từ chỉ thời gian quá khứ xác định, sử dụng thì Quá khứ đơn (donated).',
    points: 1
  },
  {
    id: 'q-gra-02',
    grade: 7,
    unit: 'Unit 4: Music and Arts',
    topic: 'Arts and Performances',
    skill: 'Grammar',
    cefrLevel: 'A2+',
    difficulty: 'Khá',
    differentiation: 'Stretch',
    type: 'multiple_choice',
    prompt: 'Classical music is not ________ pop music among teenagers.',
    options: ['as popular as', 'more popular', 'as popular than', 'most popular'],
    correctAnswer: 0,
    explanation: 'Cấu trúc so sánh bằng: not as + adj + as.',
    points: 1
  },
  {
    id: 'q-read-01',
    grade: 7,
    unit: 'Unit 5: Food and Drink',
    topic: 'Traditional Vietnamese Food',
    skill: 'Reading',
    cefrLevel: 'A2',
    difficulty: 'Trung bình',
    differentiation: 'Core',
    type: 'reading_comprehension',
    passage: 'Pho is one of the most famous traditional dishes in Vietnam. It originated in Nam Dinh province and became popular in Hanoi. Pho is made with broth, rice noodles called banh pho, herbs, and meat (usually beef or chicken). People often enjoy a hot bowl of pho for breakfast with crispy dough sticks (quay).',
    prompt: 'Where did Pho originally come from according to the text?',
    options: ['Hanoi', 'Nam Dinh province', 'Hue city', 'Saigon'],
    correctAnswer: 1,
    explanation: 'Đoạn văn viết: "It originated in Nam Dinh province".',
    points: 1
  },
  {
    id: 'q-lis-01',
    grade: 7,
    unit: 'Unit 6: A Visit to a School',
    topic: 'Schools and Education',
    skill: 'Listening',
    cefrLevel: 'A2',
    difficulty: 'Dễ',
    differentiation: 'Support',
    type: 'listening_comprehension',
    passage: 'Audio script: "Welcome to Nguyen Huy Tuong Secondary School! Our school was founded many years ago and has 24 spacious classrooms, a large computer lab, and a green playground."',
    prompt: 'How many classrooms does Nguyen Huy Tuong Secondary School have in the listening passage?',
    options: ['20 classrooms', '24 classrooms', '30 classrooms', '16 classrooms'],
    correctAnswer: 1,
    explanation: 'Người nói nêu rõ: "has 24 spacious classrooms".',
    points: 1
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-voc-01',
    title: 'Vocabulary: Luyện từ vựng theo chủ đề (Unit 1–3)',
    description: 'Kiểm tra và củng cố 25 từ vựng trọng tâm về Hobbies, Healthy Living & Community Service.',
    grade: 7,
    unit: 'Unit 1–3',
    category: 'Vocabulary',
    targetClassIds: ['class-7a'],
    targetClassNames: ['7A'],
    durationMinutes: 15,
    questionCount: 6,
    totalPoints: 10,
    questions: INITIAL_QUESTIONS,
    maxAttempts: 2,
    allowReview: true,
    status: 'published',
    createdAt: '2026-10-15'
  },
  {
    id: 'quiz-gra-01',
    title: 'Grammar: Ngữ pháp trọng tâm - Past Simple & Comparisons',
    description: 'Rèn luyện thì Quá khứ đơn và cấu trúc so sánh bằng (as... as), khác với (different from).',
    grade: 7,
    unit: 'Unit 3–4',
    category: 'Grammar',
    targetClassIds: ['class-7a', 'class-6a1'],
    targetClassNames: ['7A', '6A1'],
    durationMinutes: 20,
    questionCount: 6,
    totalPoints: 10,
    questions: INITIAL_QUESTIONS,
    maxAttempts: 3,
    allowReview: true,
    status: 'published',
    createdAt: '2026-10-18'
  },
  {
    id: 'quiz-read-01',
    title: 'Reading: Đọc hiểu văn hóa ẩm thực và đời sống',
    description: 'Bài đọc ngắn với các câu hỏi tìm ý chính, chi tiết và từ vựng trong ngữ cảnh.',
    grade: 7,
    unit: 'Unit 5',
    category: 'Reading',
    targetClassIds: ['class-7a'],
    targetClassNames: ['7A'],
    durationMinutes: 20,
    questionCount: 6,
    totalPoints: 10,
    questions: INITIAL_QUESTIONS,
    maxAttempts: 2,
    allowReview: true,
    status: 'published',
    createdAt: '2026-10-19'
  },
  {
    id: 'quiz-lis-01',
    title: 'Listening: Luyện nghe hội thoại trường học',
    description: 'Bài nghe ngắn có audio script hỗ trợ luyện phát âm và nghe chi tiết.',
    grade: 7,
    unit: 'Unit 6',
    category: 'Listening',
    targetClassIds: ['class-7a'],
    targetClassNames: ['7A'],
    durationMinutes: 15,
    questionCount: 6,
    totalPoints: 10,
    questions: INITIAL_QUESTIONS,
    maxAttempts: 2,
    allowReview: true,
    status: 'published',
    createdAt: '2026-10-21'
  }
];

export const INITIAL_SUBMISSIONS: QuizSubmission[] = [
  {
    id: 'sub-01',
    quizId: 'quiz-voc-01',
    quizTitle: 'Vocabulary: Luyện từ vựng theo chủ đề (Unit 1–3)',
    studentId: 'std-7a-01',
    studentName: 'Nguyễn Hoàng Anh',
    className: '7A',
    submittedAt: '2026-10-21 14:32',
    score: 9.0,
    totalScore: 10.0,
    percentage: 90,
    answers: { 'q-voc-01': 0, 'q-voc-02': 0, 'q-gra-01': 0, 'q-gra-02': 0, 'q-read-01': 1, 'q-lis-01': 1 },
    timeSpentSeconds: 480,
    teacherFeedback: 'Làm bài rất nhanh và chuẩn xác. Chú ý đọc kỹ đề phần so sánh hơn.'
  },
  {
    id: 'sub-02',
    quizId: 'quiz-voc-01',
    quizTitle: 'Vocabulary: Luyện từ vựng theo chủ đề (Unit 1–3)',
    studentId: 'std-7a-02',
    studentName: 'Trần Minh Châu',
    className: '7A',
    submittedAt: '2026-10-21 15:10',
    score: 8.5,
    totalScore: 10.0,
    percentage: 85,
    answers: { 'q-voc-01': 0, 'q-voc-02': 0, 'q-gra-01': 0, 'q-gra-02': 0, 'q-read-01': 1, 'q-lis-01': 0 },
    timeSpentSeconds: 520,
    teacherFeedback: 'Nắm chắc kiến thức từ vựng cơ bản.'
  }
];

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-gs6',
    title: 'Global Success 6 - Trọn bộ Giáo án & Phân phối chương trình',
    grade: 6,
    unit: 'Toàn bộ Unit 1–12',
    topic: 'Kế hoạch bài dạy môn Tiếng Anh 6 theo công văn 5512',
    category: 'Lesson Plan',
    fileType: 'docx',
    fileSize: '4.8 MB',
    description: 'Giáo án chi tiết kèm phiếu bài tập phân hóa Support - Core - Stretch cho học sinh lớp 6.',
    uploadDate: '2026-09-05',
    isDownloadable: true
  },
  {
    id: 'res-gs7',
    title: 'Global Success 7 - Ngân hàng đề kiểm tra Giữa kỳ & Cuối kỳ I',
    grade: 7,
    unit: 'Unit 1–6',
    topic: 'Đề thi trắc nghiệm kết hợp tự luận có ma trận và đặc tả',
    category: 'Test Paper',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    description: 'Bộ đề thi chuẩn bám sát định dạng kiểm tra định kỳ của Phòng GD&ĐT.',
    uploadDate: '2026-10-10',
    isDownloadable: true
  },
  {
    id: 'res-gs8',
    title: 'Global Success 8 - Bài giảng tương tác PowerPoint Unit 1-6',
    grade: 8,
    unit: 'Unit 1–6',
    topic: 'Slide bài giảng thiết kế sinh động, tích hợp mini game từ vựng',
    category: 'Presentation',
    fileType: 'pptx',
    fileSize: '24.5 MB',
    description: 'Slide trình chiếu chuẩn font Times New Roman, kèm hiệu ứng trực quan và file âm thanh chèn sẵn.',
    uploadDate: '2026-09-12',
    isDownloadable: true
  },
  {
    id: 'res-gs9',
    title: 'Global Success 9 - Chuyên đề Ôn thi Tuyển sinh Lớp 10 THPT',
    grade: 9,
    unit: 'Chuyên đề ôn tập',
    topic: 'Trọng tâm ngữ pháp và các dạng bài biến đổi câu, đọc điền từ',
    category: 'Worksheet',
    fileType: 'pdf',
    fileSize: '6.1 MB',
    description: 'Tài liệu bồi dưỡng năng lực học sinh lớp 9 với hơn 500 câu trắc nghiệm điển hình.',
    uploadDate: '2026-09-20',
    isDownloadable: true
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Chào mừng năm học mới 2026–2027',
    message: 'Hệ thống NHT English Learning Hub đã sẵn sàng phục vụ công tác giảng dạy của cô Vương Thị Ngân.',
    date: '2026-10-23',
    isRead: false,
    type: 'info'
  },
  {
    id: 'notif-2',
    title: 'Đã hoàn thành đồng bộ điểm Lớp 7A',
    message: 'Toàn bộ 42 bài kiểm tra định kỳ Giữa kỳ I của Lớp 7A đã được lưu thành công vào sổ điểm điện tử.',
    date: '2026-10-22',
    isRead: false,
    type: 'success'
  },
  {
    id: 'notif-3',
    title: 'Nhắc nhở học sinh cần hỗ trợ (Support)',
    message: 'Có 4 học sinh cần bổ sung phiếu rèn luyện củng cố thì Quá khứ đơn trước tiết học thứ Sáu.',
    date: '2026-10-21',
    isRead: false,
    type: 'warning'
  }
];

// Sample chart data for dashboard & analytics matching reference UI
export const CLASS_PROGRESS_DATA = [
  { name: '6A', dauKy: 60, hienTai: 72 },
  { name: '6B', dauKy: 58, hienTai: 69 },
  { name: '7A', dauKy: 65, hienTai: 82 },
  { name: '7B', dauKy: 62, hienTai: 76 },
  { name: '8A', dauKy: 68, hienTai: 84 },
  { name: '9A', dauKy: 70, hienTai: 88 }
];

export const UNIT_RESULTS_DATA = [
  { unit: 'Unit 1', score: 6.8, target: 8.0 },
  { unit: 'Unit 2', score: 7.2, target: 8.0 },
  { unit: 'Unit 3', score: 7.8, target: 8.0 },
  { unit: 'Unit 4', score: 8.1, target: 8.0 },
  { unit: 'Unit 5', score: 7.6, target: 8.0 },
  { unit: 'Unit 6', score: 8.4, target: 8.0 }
];

export const SUPPORT_STUDENTS_BREAKDOWN = [
  { name: 'Ngữ pháp', value: 10, color: '#F59E0B' },
  { name: 'Từ vựng', value: 6, color: '#2585F5' },
  { name: 'Kỹ năng nghe', value: 5, color: '#EF4444' },
  { name: 'Kỹ năng đọc', value: 3, color: '#10B981' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-01',
    studentCode: '7A01',
    studentName: 'Nguyễn Hoàng Anh',
    status: 'present',
    note: '',
    recordedAt: '2026-10-23 07:15'
  },
  {
    id: 'att-02',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-02',
    studentCode: '7A02',
    studentName: 'Trần Minh Châu',
    status: 'present',
    note: '',
    recordedAt: '2026-10-23 07:15'
  },
  {
    id: 'att-03',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-03',
    studentCode: '7A03',
    studentName: 'Lê Gia Hân',
    status: 'present',
    note: '',
    recordedAt: '2026-10-23 07:15'
  },
  {
    id: 'att-04',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-04',
    studentCode: '7A04',
    studentName: 'Phạm Tuấn Kiệt',
    status: 'late',
    note: 'Đi muộn 10 phút do hỏng xe',
    recordedAt: '2026-10-23 07:25'
  },
  {
    id: 'att-05',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-05',
    studentCode: '7A05',
    studentName: 'Vũ Thảo Linh',
    status: 'present',
    note: '',
    recordedAt: '2026-10-23 07:15'
  },
  {
    id: 'att-06',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-06',
    studentCode: '7A06',
    studentName: 'Đỗ Bảo Nam',
    status: 'present',
    note: '',
    recordedAt: '2026-10-23 07:15'
  },
  {
    id: 'att-07',
    date: '2026-10-23',
    period: 'Tiết 1',
    lessonTopic: 'Unit 3: Community Service - A Closer Look 1',
    classId: 'class-7a',
    className: '7A',
    studentId: 'std-7a-07',
    studentCode: '7A07',
    studentName: 'Hoàng Thùy Dương',
    status: 'excused',
    note: 'Nghỉ ốm (phụ huynh đã gọi điện xin phép)',
    recordedAt: '2026-10-23 07:15'
  }
];

