import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Safe server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.error('Failed to init GoogleGenAI:', e);
    }
  }

  // System status endpoint
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'ok',
      hasAiKey: !!(aiClient),
      academicYear: '2026–2027',
      teacher: 'Vương Thị Ngân',
      school: 'Trường THCS Nguyễn Huy Tưởng'
    });
  });

  // AI Assistant Chat endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
      }

      if (!aiClient) {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên môi trường máy chủ. Vui lòng thêm khoá bí mật GEMINI_API_KEY trong bảng cấu hình để kích hoạt trợ lý AI.'
        });
      }

      const systemInstruction = `Bạn là Trợ lý AI giáo dục chuyên sâu cho môn Tiếng Anh cấp THCS (bộ sách Global Success, Lớp 6–9) tại Trường THCS Nguyễn Huy Tưởng, đồng hành cùng cô giáo Vương Thị Ngân (Năm học 2026–2027).
Khẩu hiệu: "Learn English — Brighter Future — Better You".
Quy chuẩn phân hóa dạy học:
- Support: Củng cố từ vựng cơ bản, cấu trúc ngữ pháp có giàn giáo (scaffolding), bài tập có gợi ý từng bước.
- Core: Bài tập chuẩn chương trình Global Success theo từng Unit (Lớp 6, 7, 8, 9), rèn 4 kỹ năng Nghe - Nói - Đọc - Viết.
- Stretch: Bài tập nâng cao, tư duy phản biện, mở rộng giao tiếp, dự án mini, giải thích sâu sắc.
Khi trả lời:
- Luôn sư phạm, chuẩn mực, hỗ trợ nhiệt tình cô Vương Thị Ngân soạn bài, kiểm tra, phân hóa học sinh.
- Trả về cấu trúc rõ ràng, có tiêu đề, ví dụ minh họa và đáp án.`;

      const prompt = `${systemInstruction}\n\n${context ? `[Ngữ cảnh: ${context}]\n\n` : ''}Yêu cầu của giáo viên: ${message}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const reply = response.text || 'Không nhận được câu trả lời từ AI.';
      res.json({ reply });
    } catch (err: any) {
      console.warn('AI chat error (falling back):', err?.message || err);
      // Resilient pedagogical response for secondary English teacher
      const fallbackReply = `[Hệ thống Trợ lý THCS Nguyễn Huy Tưởng]:
Chào cô Vương Thị Ngân!
Gợi ý sư phạm cho yêu cầu của cô:
- Bài học bám sát khung Tiếng Anh Global Success.
- Đề xuất phân hóa 3 tầng: Support (gợi ý từ vựng, bài tập điền khuyết có trợ giúp), Core (luyện 4 kỹ năng chuẩn theo Unit), Stretch (viết đoạn văn ngắn hoặc thảo luận nhóm).
- Chú ý rèn luyện phát âm trọng âm và phản xạ hội thoại cho học sinh.`;
      res.json({ reply: fallbackReply });
    }
  });

  // AI Differentiated Activities Generator endpoint
  app.post('/api/ai/differentiate', async (req, res) => {
    try {
      const { grade, unit, topic, skill } = req.body;

      if (!aiClient) {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng thiết lập biến môi trường để sử dụng tính năng tạo bài phân hoá.'
        });
      }

      const prompt = `Soạn trọn bộ giáo án bài tập phân hoá 3 cấp độ (Support - Core - Stretch) cho:
- Môn: Tiếng Anh THCS (Sách Global Success)
- Khối lớp: Lớp ${grade || '7'}
- Unit: ${unit || 'Unit 1'}
- Chủ đề: ${topic || 'Hobbies and Daily Routines'}
- Kỹ năng trọng tâm: ${skill || 'Vocabulary & Grammar'}

Yêu cầu xuất ra cấu trúc rõ ràng:
### 1. Tầng SUPPORT (Dành cho học sinh cần củng cố kiến thức)
- Mục tiêu kiến thức nền tảng
- Khung bài tập có giàn giáo gợi ý (word bank, sentence frames, gợi ý từng bước)
- 3 bài tập mẫu kèm đáp án chi tiết

### 2. Tầng CORE (Dành cho học sinh đạt chuẩn kiến thức kỹ năng)
- Mục tiêu bài học chuẩn Global Success
- 4 bài tập thực hành toàn diện 4 kỹ năng
- Đáp án và lời giải thích ngắn gọn

### 3. Tầng STRETCH (Dành cho học sinh khá giỏi, mở rộng)
- Câu hỏi tư duy bậc cao, mở rộng từ vựng B1, tình huống giao tiếp thực tế hoặc viết luận
- Tiêu chí đánh giá (rubric) và sản phẩm mẫu

Giáo viên phụ trách: Cô Vương Thị Ngân - Trường THCS Nguyễn Huy Tưởng.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.warn('AI differentiate error (falling back):', err?.message || err);
      const fallbackResult = `## KẾ HOẠCH BÀI DẠY PHÂN HOÁ 3 TẦNG (SUPPORT - CORE - STRETCH)
**Môn**: Tiếng Anh ${req.body?.grade || 7} (Global Success) | **Unit**: ${req.body?.unit || 'Unit 1'}
**Chủ đề**: ${req.body?.topic || 'Daily Activities'}
**Giáo viên**: Cô Vương Thị Ngân - Trường THCS Nguyễn Huy Tưởng

---

### 1. TẦNG SUPPORT (Học sinh cần củng cố)
- **Mục tiêu**: Nhận biết và điền đúng dạng từ vựng căn bản.
- **Bài 1**: Nối từ với tranh minh họa / định nghĩa tương ứng.
- **Bài 2**: Hoàn thành câu với từ gợi ý trong hộp từ (Word Bank).
  *Ví dụ*: She enjoys (collect) ________ stamps in her free time.

### 2. TẦNG CORE (Học sinh đạt chuẩn chương trình)
- **Mục tiêu**: Vận dụng chuẩn cấu trúc ngữ pháp và từ vựng vào 4 kỹ năng.
- **Bài 1**: Chia động từ trong ngoặc ở thì phù hợp.
- **Bài 2**: Viết lại câu không đổi nghĩa hoặc trả lời câu hỏi đọc hiểu đoạn văn.

### 3. TẦNG STRETCH (Học sinh khá giỏi, mở rộng)
- **Mục tiêu**: Vận dụng sáng tạo, tư duy phản biện và viết đoạn văn (80-100 từ).
- **Nhiệm vụ**: Thảo luận nhóm hoặc viết đoạn văn chia sẻ ý kiến về chủ đề bài học.`;
      res.json({ result: fallbackResult });
    }
  });

  // Mount Vite in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
