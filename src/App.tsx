import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ClassManagement } from './components/ClassManagement';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceManagement } from './components/AttendanceManagement';
import { GradebookManagement } from './components/GradebookManagement';
import { QuestionBankManagement } from './components/QuestionBankManagement';
import { QuizManagement } from './components/QuizManagement';
import { TakeQuizView } from './components/TakeQuizView';
import { ResourceLibrary } from './components/ResourceLibrary';
import { AiAssistantPage } from './components/AiAssistantPage';
import { AnalyticsReports } from './components/AnalyticsReports';
import { SettingsPage } from './components/SettingsPage';
import { StudentPortalView } from './components/StudentPortalView';
import { NotificationModal } from './components/NotificationModal';
import { Menu, ChevronRight, Home, ArrowLeft } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, userRole } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get Vietnamese tab name for breadcrumbs
  const getTabLabel = () => {
    switch (activeTab) {
      case 'overview': return 'Tổng quan';
      case 'classes': return 'Quản lý lớp học';
      case 'students': return 'Danh sách học sinh';
      case 'attendance': return 'Điểm danh & Chuyên cần';
      case 'grades': return 'Kết quả học tập';
      case 'question-bank': return 'Ngân hàng bài tập';
      case 'quizzes': return 'Kiểm tra trực tuyến';
      case 'take-quiz': return 'Làm bài kiểm tra';
      case 'library': return 'Thư viện học liệu';
      case 'ai-assistant': return 'Trợ lý AI';
      case 'analytics': return 'Báo cáo & phân tích';
      case 'settings': return 'Cài đặt hệ thống';
      case 'student-portal': return 'Cổng học sinh';
      default: return 'Tổng quan';
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'classes':
        return <ClassManagement />;
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'grades':
        return <GradebookManagement />;
      case 'question-bank':
        return <QuestionBankManagement />;
      case 'quizzes':
        return <QuizManagement />;
      case 'take-quiz':
        return <TakeQuizView />;
      case 'library':
        return <ResourceLibrary />;
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'settings':
        return <SettingsPage />;
      case 'student-portal':
        return <StudentPortalView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col font-serif selection:bg-blue-100 selection:text-blue-900">
      {/* Global Header */}
      <Header />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 md:px-6 py-4 flex flex-col">
          {/* Top Bar for Mobile & Breadcrumbs */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-200/80">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                title="Mở menu chức năng"
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center space-x-1 text-[#1266D6] hover:underline"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>

              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-bold">{getTabLabel()}</span>
            </div>

            {/* Role indicator pill */}
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                userRole === 'teacher'
                  ? 'bg-blue-100 text-[#0B2D5C] border border-blue-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}>
                {userRole === 'teacher' ? 'Chế độ Giáo viên' : 'Góc nhìn Học sinh'}
              </span>
            </div>
          </div>

          {/* Active View Container */}
          <div className="flex-1 min-h-[calc(100vh-160px)]">
            {renderActiveView()}
          </div>

          {/* Global Footer */}
          <footer className="mt-auto pt-6 pb-4 border-t border-slate-200/60 text-center text-xs text-slate-500 no-print space-y-1">
            <div className="font-bold text-slate-700">
              NHT ENGLISH LEARNING HUB • TRƯỜNG THCS NGUYỄN HUY TƯỞNG
            </div>
            <div>
              Giáo viên: <strong>Vương Thị Ngân</strong> • Năm học: <strong>2026–2027</strong> • Chương trình Tiếng Anh Global Success (Lớp 6–9)
            </div>
            <div className="text-[11px] text-slate-400">
              Thiết kế chuyên biệt cho công tác giảng dạy, kiểm tra đánh giá và phân hóa năng lực học sinh
            </div>
          </footer>
        </main>
      </div>

      {/* Global Notification Modal */}
      <NotificationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
