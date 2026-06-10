import React, { useState } from "react";
import { Sprout, Lock, Unlock, Menu, X, Settings } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  logoUrl?: string;
}

export default function Navbar({ activePage, onNavigate, isAdminLoggedIn, onLogout, logoUrl }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { id: "home", label: t("nav.home") },
    { id: "about", label: t("nav.about") },
    { id: "products", label: t("nav.products") },
    { id: "contact", label: t("nav.contact") }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fcfcf9]/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick("home")}>
            {logoUrl ? (
              <div className="bg-white border border-stone-200/85 rounded-xl h-[46px] w-[46px] flex items-center justify-center shadow-xs overflow-hidden leading-none select-none">
                <img src={logoUrl} alt="Biotech Agro Logo" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="p-2 bg-emerald-950 text-emerald-100 rounded-xl">
                <Sprout className="h-6 w-6" />
              </div>
            )}
            <div>
              <span className="font-display font-medium text-lg tracking-tight text-stone-900 block leading-tight">
                Biotech Agro
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-widest block -mt-0.5">
                {t("brand.subtitle")}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? "text-emerald-900 font-semibold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}

            <div className="h-4 w-px bg-stone-300" />
            <LanguageSwitcher />

            {/* Admin Dashboard Area */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick("admin")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    activePage === "admin"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                  {t("nav.console")}
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold tracking-wide transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  {t("nav.signOut")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("admin")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  activePage === "admin"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200/80"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                {t("nav.staffAccess")}
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageSwitcher />
            {isAdminLoggedIn && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-lg uppercase">
                Admin
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#fcfcf9] border-b border-stone-200/80 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id ? "bg-emerald-50 text-emerald-950 font-bold" : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="h-px bg-stone-200 my-2" />

          {isAdminLoggedIn ? (
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleNavClick("admin")}
                className="flex items-center justify-between w-full px-3 py-2.5 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 rounded-lg text-sm font-medium"
              >
                <span>{t("nav.goToAdmin")}</span>
                <Settings className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-bold"
              >
                <span>{t("nav.signOutAccount")}</span>
                <Unlock className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("admin")}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-sm font-semibold"
            >
              <span>{t("nav.staffPortal")}</span>
              <Lock className="w-4 h-4 text-stone-500" />
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
