import React from "react";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface FooterProps {
  onNavigate: (page: string) => void;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  logoUrl?: string;
}

export default function Footer({ onNavigate, contactEmail, contactPhone, contactAddress, logoUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Mission Column */}
          <div className="col-span-1 md:col-span-1.5 space-y-4">
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <div className="bg-white border border-stone-700 rounded-lg h-10 w-10 flex items-center justify-center overflow-hidden shadow-xs">
                  <img src={logoUrl} alt="Biotech Agro Logo" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="p-2 bg-emerald-600 text-stone-100 rounded-lg">
                  <Sprout className="h-5 w-5" />
                </div>
              )}
              <span className="font-display font-medium text-lg text-white tracking-tight">
                Biotech Agro
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed font-light">
              {t("footer.mission")}
            </p>
            <div className="text-xs text-stone-500 font-mono">
              {t("footer.labId")}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-wider font-display">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-emerald-400 transition-colors">
                  {t("footer.home")}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-emerald-400 transition-colors">
                  {t("footer.about")}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("products")} className="hover:text-emerald-400 transition-colors">
                  {t("footer.products")}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-emerald-400 transition-colors">
                  {t("footer.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Tunisian Bio-hubs */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-wider font-display">
              {t("footer.operations")}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>{t("footer.tunis")}</span>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-wider font-display">
              {t("footer.contacts")}
            </h4>
            <ul className="space-y-3.5 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-light">
                  {contactAddress || "Zone Industrielle Charguia II, Tunis 2035, Tunisia"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono ltr-text">
                  {contactPhone || "+216 94 038 433"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-xs ltr-text">
                  {contactEmail || "contact@biotech-agro.com"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-stone-800 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {currentYear} BiotechAgro. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-400 cursor-pointer">{t("footer.privacy")}</span>
            <span className="hover:text-stone-400 cursor-pointer">{t("footer.spec")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
