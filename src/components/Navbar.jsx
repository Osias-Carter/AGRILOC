import React, { useState } from 'react';
import { Menu, X, Bell, User, Briefcase, BellRing, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, role, setRole, notifications, markNotificationsAsRead, currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNavClick = (pageId) => {
    if (pageId === 'login' && currentUser) {
      // Redirect to their dashboard based on role if already logged in
      setActivePage(currentUser.role === 'supplier' ? 'supplier' : 'farmer');
    } else {
      setActivePage(pageId);
    }
    setIsOpen(false);
    setShowNotifDropdown(false);
  };

  // Determine active state for navigation links
  const isLinkActive = (pageId) => {
    if (pageId === 'login') {
      return activePage === 'login' || activePage === 'farmer' || activePage === 'supplier';
    }
    return activePage === pageId;
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass bg-white/90 border-b border-gray-200/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-start gap-2.5 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img
              src="/logo.png"
              alt="AGRILOC"
              className="h-9 w-auto object-contain flex-shrink-0 mt-0.5 transition-transform hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold font-outfit tracking-tight text-agri-dark">
                AGRI<span className="text-agri-light">LOC</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-1">
                TOGO AGRITECH
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLinkActive('home')
                  ? 'text-white bg-agri-green shadow-sm'
                  : 'text-gray-600 hover:text-agri-green hover:bg-gray-100/50'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLinkActive('about')
                  ? 'text-white bg-agri-green shadow-sm'
                  : 'text-gray-600 hover:text-agri-green hover:bg-gray-100/50'
              }`}
            >
              À Propos
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLinkActive('contact')
                  ? 'text-white bg-agri-green shadow-sm'
                  : 'text-gray-600 hover:text-agri-green hover:bg-gray-100/50'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => handleNavClick('login')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLinkActive('login')
                  ? 'text-white bg-agri-green shadow-sm'
                  : 'text-gray-600 hover:text-agri-green hover:bg-gray-100/50'
              }`}
            >
              {currentUser ? 'Mon Compte' : 'Compte'}
            </button>
          </div>

          {/* Action Buttons & Notifications */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markNotificationsAsRead();
                }}
                className="p-2.5 text-gray-500 hover:text-agri-green hover:bg-gray-100/60 rounded-xl relative transition-all"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-sm">Notifications récentes</span>
                    <BellRing className="h-4 w-4 text-agri-light" />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setActivePage(n.targetPage);
                            setShowNotifDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                        >
                          <p className="text-xs font-semibold text-gray-800">{n.text}</p>
                          <span className="text-[10px] text-gray-400 block mt-1">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center space-x-2 bg-agri-green/5 border border-agri-green/10 px-4 py-2 rounded-xl text-xs font-bold text-agri-green hover:bg-agri-green/10 transition-all"
                >
                  <div className="h-5 w-5 rounded bg-agri-green text-white flex items-center justify-center font-black text-[10px]">
                    {currentUser.avatarInitials}
                  </div>
                  <span>{currentUser.fullName}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Déconnexion"
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="bg-agri-green text-white hover:bg-agri-light px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all hover:scale-102 active:scale-98"
              >
                Se Connecter
              </button>
            )}
          </div>

          {/* Mobile hamburger icon */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Notification Bell Mobile */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markNotificationsAsRead();
                }}
                className="p-2 text-gray-500 rounded-xl"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-800 text-xs">Notifications</div>
                  <div className="max-h-48 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-4 text-center text-xs text-gray-400">Aucun message.</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} onClick={() => { setActivePage(n.targetPage); setShowNotifDropdown(false); }} className="px-4 py-2 hover:bg-gray-50 text-xs border-b border-gray-50">
                          <p className="font-semibold text-gray-800">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-agri-green hover:bg-gray-100 rounded-xl"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200/40 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 shadow-inner">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                isLinkActive('home') ? 'text-white bg-agri-green' : 'text-gray-600 hover:text-agri-green hover:bg-gray-50'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                isLinkActive('about') ? 'text-white bg-agri-green' : 'text-gray-600 hover:text-agri-green hover:bg-gray-50'
              }`}
            >
              À Propos
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                isLinkActive('contact') ? 'text-white bg-agri-green' : 'text-gray-600 hover:text-agri-green hover:bg-gray-50'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => handleNavClick('login')}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                isLinkActive('login') ? 'text-white bg-agri-green' : 'text-gray-600 hover:text-agri-green hover:bg-gray-50'
              }`}
            >
              {currentUser ? 'Mon Compte' : 'Compte'}
            </button>
          </div>

          {currentUser && (
            <div className="border-t border-gray-100 pt-3 flex flex-col space-y-2">
              <div className="text-center text-xs font-semibold text-gray-500">
                Connecté en tant que : <span className="text-agri-green font-bold">{currentUser.fullName}</span>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center bg-red-50 text-red-600 border border-red-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
