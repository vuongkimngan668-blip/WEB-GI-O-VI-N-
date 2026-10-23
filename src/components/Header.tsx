import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, ChevronDown, User, ShieldCheck, GraduationCap, School, LogOut, Upload } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    searchQuery,
    setSearchQuery,
    notifications,
    setIsNotificationOpen,
    userRole,
    setUserRole,
    setActiveTab,
    isDemoMode
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateTeacherProfile({ schoolLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#0B2D5C] via-[#0E3E7D] to-[#1266D6] text-white shadow-md sticky top-0 z-40 border-b border-blue-400/20">
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & School Logo */}
        <div className="flex items-center space-x-3.5">
          {/* Circular School Logo with custom upload option */}
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center p-1 shadow-inner overflow-hidden hover:border-cyan-300 transition-all">
              {teacherProfile.schoolLogoUrl ? (
                <img src={teacherProfile.schoolLogoUrl} alt="Logo trường" className="w-full h-full object-contain" />
              ) : (
                <svg className="w-9 h-9 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4L4 14V17H44V14L24 4Z" fill="currentColor" />
                  <path d="M8 20H13V36H8V20Z" fill="currentColor" />
                  <path d="M19 20H24V36H19V20Z" fill="currentColor" />
                  <path d="M30 20H35V36H30V20Z" fill="currentColor" />
                  <path d="M4 38H44V42H4V38Z" fill="currentColor" />
                  <path d="M24 16C26 21 34 23 38 23V25C34 25 26 23 24 18C22 23 14 25 10 25V23C14 23 22 21 24 16Z" fill="#28B5E8" />
                </svg>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-md" title="Thay đổi biểu trưng trường">
              <Upload className="w-2.5 h-2.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-wide uppercase text-white drop-shadow-sm">
                NHT ENGLISH LEARNING HUB
              </h1>
              {isDemoMode && (
                <span className="hidden sm:inline-block bg-amber-500/90 hover:bg-amber-500 text-slate-900 font-bold text-[11px] px-2 py-0.5 rounded shadow">
                  DỮ LIỆU MINH HỌA
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-blue-100 tracking-wide font-normal">
              Hệ thống học tập và quản lý môn Tiếng Anh
            </p>
          </div>
        </div>

        {/* Center: Official School & Teacher Information */}
        <div className="hidden lg:flex flex-col items-center justify-center border-x border-white/20 px-6 py-0.5 text-center">
          <div className="text-sm font-bold text-white tracking-wide">
            {teacherProfile.schoolName}
          </div>
          <div className="text-xs text-blue-100 flex items-center space-x-2">
            <span>Giáo viên: <strong className="text-white">{teacherProfile.name}</strong></span>
            <span>•</span>
            <span>Năm học: <strong className="text-white">{teacherProfile.academicYear}</strong></span>
          </div>
          <div className="text-[11px] italic text-cyan-200 mt-0.5 tracking-wider">
            Learn English — Brighter Future — Better You
          </div>
        </div>

        {/* Right: Search, Notifications, Profile Menu */}
        <div className="flex items-center space-x-3">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh, lớp học, học liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 text-slate-800 placeholder-slate-400 text-xs rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </div>

          {/* Notification Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Thông báo hệ thống"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2.5 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-full border border-white/20 transition-all text-left"
            >
              <img
                src={teacherProfile.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80'}
                alt={teacherProfile.name}
                className="w-8 h-8 rounded-full object-cover border border-white/80"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold leading-tight text-white flex items-center space-x-1">
                  <span>{teacherProfile.name}</span>
                </div>
                <div className="text-[11px] text-blue-200 capitalize">
                  {userRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-sm text-[#0B2D5C]">{teacherProfile.name}</div>
                  <div className="text-xs text-slate-500">{teacherProfile.email}</div>
                  <div className="text-xs text-blue-600 mt-0.5">{teacherProfile.schoolName}</div>
                </div>

                {/* Role Switcher */}
                <div className="px-3 py-2 bg-blue-50/70 mx-2 my-1.5 rounded-lg border border-blue-100">
                  <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chuyển đổi góc nhìn vai trò:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => {
                        setUserRole('teacher');
                        setActiveTab('overview');
                        setShowProfileMenu(false);
                      }}
                      className={`py-1 rounded font-medium transition-colors ${
                        userRole === 'teacher'
                          ? 'bg-[#1266D6] text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Giáo viên
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('student');
                        setActiveTab('student-portal');
                        setShowProfileMenu(false);
                      }}
                      className={`py-1 rounded font-medium transition-colors ${
                        userRole === 'student'
                          ? 'bg-[#1266D6] text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Học sinh
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hồ sơ & Cài đặt hệ thống</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('classes');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span>Quản lý lớp phụ trách (4 lớp)</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đóng menu</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
