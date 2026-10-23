import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  LayoutDashboard,
  School,
  Users,
  Award,
  BookMarked,
  CheckSquare,
  Library,
  Bot,
  BarChart3,
  Settings,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile
}) => {
  const { activeTab, setActiveTab, userRole } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'classes', label: 'Quản lý lớp học', icon: School },
    { id: 'students', label: 'Danh sách học sinh', icon: Users },
    { id: 'attendance', label: 'Điểm danh', icon: CalendarCheck, badge: 'Mới' },
    { id: 'grades', label: 'Kết quả học tập', icon: Award },
    { id: 'question-bank', label: 'Ngân hàng bài tập', icon: BookMarked },
    { id: 'quizzes', label: 'Kiểm tra trực tuyến', icon: CheckSquare },
    { id: 'library', label: 'Thư viện học liệu', icon: Library },
    { id: 'ai-assistant', label: 'Trợ lý AI', icon: Bot },
    { id: 'analytics', label: 'Báo cáo & phân tích', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[61px] left-0 h-[calc(100vh-61px)] w-64 bg-[#1266D6] text-white flex flex-col justify-between shadow-xl z-40 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Items List */}
        <div className="py-4 px-3 space-y-1.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-[#1266D6] shadow-md font-bold translate-x-1'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#1266D6]' : 'text-blue-100'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-amber-100 text-amber-800' : 'bg-cyan-400 text-[#0B2D5C]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Graphic: London Tower Bridge & Big Ben Architectural Outline Watermark */}
        <div className="relative pt-6 pb-4 px-4 overflow-hidden border-t border-blue-400/30 bg-[#0E52B0]/80">
          <div className="relative z-10">
            <div className="flex items-center space-x-1.5 text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tiếng Anh THCS</span>
            </div>
            <p className="text-white/95 text-xs italic font-serif leading-relaxed drop-shadow-sm">
              &ldquo;Good English, Brighter Opportunities&rdquo;
            </p>
            <div className="mt-2 text-[11px] text-blue-200">
              Global Success • Lớp 6–9
            </div>
          </div>

          {/* SVG Outline Art of London Skyline / Big Ben / Tower Bridge */}
          <div className="absolute -bottom-2 -right-2 opacity-15 pointer-events-none">
            <svg width="150" height="110" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 140V50L55 20L70 50V140H40Z" stroke="white" strokeWidth="2" fill="white" />
              <circle cx="55" cy="60" r="8" stroke="white" strokeWidth="2" />
              <path d="M100 140V70L125 50L150 70V140H100Z" stroke="white" strokeWidth="2" fill="white" />
              <path d="M80 120C110 90 140 90 170 120" stroke="white" strokeWidth="3" />
              <path d="M10 140H190" stroke="white" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
};
