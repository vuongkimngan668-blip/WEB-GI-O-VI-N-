export interface AiStatus {
  status: string;
  hasAiKey: boolean;
  academicYear: string;
  teacher: string;
  school: string;
}

export async function checkAiStatus(): Promise<AiStatus> {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API status check error:', e);
  }
  return {
    status: 'local',
    hasAiKey: false,
    academicYear: '2026–2027',
    teacher: 'Vương Thị Ngân',
    school: 'Trường THCS Nguyễn Huy Tưởng'
  };
}

export async function sendAiChatMessage(message: string, context?: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Lỗi kết nối tới máy chủ AI.');
    }
    return data.reply;
  } catch (err: any) {
    // If server AI key is not yet configured, provide a helpful pedagogical response
    // rather than crashing, while indicating that Gemini API can be connected.
    if (err.message && err.message.includes('Chưa cấu hình GEMINI_API_KEY')) {
      return generatePedagogicalFallback(message);
    }
    throw err;
  }
}

export async function generateDifferentiatedPlan(grade: number, unit: string, topic: string, skill: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/differentiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, unit, topic, skill })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Lỗi tạo bài phân hoá từ AI.');
    }
    return data.result;
  } catch (err: any) {
    if (err.message && err.message.includes('Chưa cấu hình GEMINI_API_KEY')) {
      return getDifferentiatedFallback(grade, unit, topic, skill);
    }
    throw err;
  }
}

/**
 * Intelligent educational fallback templates aligned to Global Success curriculum
 */
function generatePedagogicalFallback(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('unit') || p.includes('bài tập') || p.includes('từ vựng')) {
    return `### [Chế độ Soạn bài THCS Nguyễn Huy Tưởng]
Gợi ý cho cô Vương Thị Ngân:
1. **Từ vựng cốt lõi**:
   - Focus on contextual collocations (e.g. *take up a hobby*, *look after pets*, *donate old books*).
   - Thiết kế Flashcard tương tác và trò chơi Warm-up: "Chain Game" hoặc "Slap the Board".
2. **Kỹ thuật phân hóa**:
   - **Support**: Cung cấp khung chữ cái đầu tiên (e.g., _c_ll_cting) và tranh minh họa.
   - **Core**: Điền từ vào chỗ trống trong đoạn văn có ngữ cảnh.
   - **Stretch**: Viết 3-5 câu sử dụng từ vựng mới để chia sẻ về trải nghiệm thực tế của bản thân.

*(Lưu ý: Để mở rộng tự động bằng mô hình AI Gemini 2.5 Flash, bạn có thể thiết lập GEMINI_API_KEY trong cài đặt dự án).*`;
  }

  if (p.includes('ngữ pháp') || p.includes('past') || p.includes('thì')) {
    return `### [Gợi ý Giảng dạy Ngữ pháp - Global Success]
Dành cho cô giáo Vương Thị Ngân:
- **Quy tắc tiếp cận**: Quy nạp (Inductive Method) - Học sinh quan sát ví dụ trước, sau đó rút ra công thức.
- **Dạng bài tập đề xuất**:
  - Tầng Support: Nhận diện dạng đúng của động từ (chọn giữa V-inf và V-ed).
  - Tầng Core: Viết lại câu không đổi nghĩa với các liên từ *although*, *because*, *so*.
  - Tầng Stretch: Tìm và sửa lỗi sai trong đoạn văn ngắn về danh lam thắng cảnh Hà Nội.`;
  }

  return `### [Trợ lý AI - THCS Nguyễn Huy Tưởng]
Xin chào cô Vương Thị Ngân!
Hệ thống sẵn sàng hỗ trợ cô giáo:
- Thiết kế bài giảng phân hoá 3 cấp độ: **Support - Core - Stretch**.
- Tạo ngân hàng câu hỏi trắc nghiệm, đọc hiểu theo ma trận đề thi.
- Soạn thảo nhận xét học sinh định kỳ và phân tích sự tiến bộ của các lớp 6A1, 7A, 8A1, 9A1.

*(Hãy nhập chủ đề bài học hoặc kỹ năng cô cần hỗ trợ ngay bên dưới).*`;
}

function getDifferentiatedFallback(grade: number, unit: string, topic: string, skill: string): string {
  return `## BỘ BÀI TẬP PHÂN HÓA 3 TẦNG (SUPPORT - CORE - STRETCH)
**Môn**: Tiếng Anh ${grade} (Global Success) | **Unit**: ${unit}
**Chủ đề**: ${topic} | **Kỹ năng**: ${skill}
**Giáo viên**: Cô Vương Thị Ngân - Trường THCS Nguyễn Huy Tưởng

---

### 1. TẦNG SUPPORT (Dành cho học sinh cần củng cố kiến thức)
- **Mục tiêu**: Nắm chắc từ vựng cơ bản và nhận diện cấu trúc ngữ pháp có gợi ý giàn giáo.
- **Bài 1**: Nối từ vựng với định nghĩa / hình ảnh tương ứng.
  - 1. *volunteer* -> A. a person who does unpaid work to help others
  - 2. *donate* -> B. to give money or goods to help people
  - 3. *community* -> C. all the people living in an area
- **Bài 2 (Sentence Completion with Word Bank)**:
  - *Word bank*: [donated, hobby, healthy, proud]
  - 1. She ________ some old clothes to poor children last winter.
  - 2. Eating more green vegetables makes you ________.

### 2. TẦNG CORE (Dành cho học sinh đạt chuẩn kiến thức kỹ năng)
- **Mục tiêu**: Vận dụng độc lập từ vựng và ngữ pháp vào 4 kỹ năng cơ bản.
- **Bài 1**: Chia động từ trong ngoặc ở thì Quá khứ đơn hoặc Hiện tại hoàn thành.
  - 1. Last Sunday, our class (clean) ________ the school garden.
  - 2. They (not visit) ________ that historic temple yet.
- **Bài 2**: Viết lại câu sao cho nghĩa không đổi:
  - "My mother likes making pottery." -> *My mother's favourite hobby is...*

### 3. TẦNG STRETCH (Dành cho học sinh khá giỏi)
- **Mục tiêu**: Tư duy phản biện, phát triển ý và viết đoạn văn tự luận.
- **Nhiệm vụ**: Write a short paragraph (80–100 words) about a community project you would like to start at **Nguyen Huy Tuong Secondary School**. Include:
  - The name and purpose of the project.
  - Who will participate and what activities you will organize.
  - Why this project is meaningful to your local community.`;
}
