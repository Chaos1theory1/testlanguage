import React, { useState, useEffect } from "react";
import {
  Sprout,
  ShieldCheck,
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
  Lock,
  Unlock,
  Settings,
  Sparkles,
  Plus,
  Trash,
  Edit,
  Check,
  Loader2,
  ChevronRight,
  GraduationCap,
  Eye,
  EyeOff,
  MessageSquare,
  Calendar,
  AlertCircle,
  Filter,
  ArrowUpRight,
  Info,
  X,
  FileText,
  IterationCw,
  UploadCloud,
  Printer
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MycoAssistant from "./components/MycoAssistant";
import GoogleDriveVault from "./components/GoogleDriveVault";
import { Product, Service, ContactMessage, SiteContent, DatabaseState, ProductCategory, ProductStatus } from "./types";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
  const { t, language } = useLanguage();
  const productCategories: string[] = ["All", "Grain Spawn", "Bio-materials", "Starting Cultures", "Consulting & Setup"];
  const localizedCategory = (category: string) => t(`category.${category}`, category);
  const localizedStatus = (status: string) => t(`status.${status}`, status);
  const localizedProductName = (product: Product) => t(`product.${product.id}.name`, product.name);
  const localizedProductDescription = (product: Product) => t(`product.${product.id}.description`, product.description);
  const localizedServiceName = (service: Service) => t(`service.${service.id}.name`, service.name);
  const localizedServiceDescription = (service: Service) => t(`service.${service.id}.description`, service.description);
  const localizedServiceDuration = (service: Service) => t(`service.${service.id}.duration`, service.duration || t("products.customScope"));

  // Page selection: 'home', 'about', 'products', 'contact', 'admin'
  const [activePage, setActivePage] = useState<string>("home");
  const [selectedQrProduct, setSelectedQrProduct] = useState<Product | null>(null);
  const [printableQrBase64, setPrintableQrBase64] = useState<string>("");
  const [isPreloadingQr, setIsPreloadingQr] = useState<boolean>(false);
  const [qrEditMode, setQrEditMode] = useState<boolean>(false);
  const [qrForm, setQrForm] = useState<Partial<Product>>({});

  useEffect(() => {
    if (!selectedQrProduct) {
      setPrintableQrBase64("");
      setIsPreloadingQr(false);
      return;
    }
    
    let isMounted = true;
    setIsPreloadingQr(true);
    
    const fetchQrAsBase64 = async () => {
      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/?qr=${selectedQrProduct.id}`)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch QR");
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted) {
            if (typeof reader.result === "string") {
              setPrintableQrBase64(reader.result);
            }
            setIsPreloadingQr(false);
          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Error preloading printable QR code:", err);
        if (isMounted) {
          setIsPreloadingQr(false);
        }
      }
    };
    
    fetchQrAsBase64();
    
    return () => {
      isMounted = false;
    };
  }, [selectedQrProduct]);

  // Site general data states
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  // Dynamically update the website favicon to match the logo
  useEffect(() => {
    const faviconUrl = siteContent?.logoUrl || "/src/assets/images/biotech_agro_logo_1781085871729.png";
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
    link.type = "image/png";
  }, [siteContent?.logoUrl]);

  // Client-side visual states
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Client landing forms
  const [contactForm, setContactForm] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    subject: "",
    message: ""
  });
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [messageSuccess, setMessageSuccess] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");

  // Admin authentication states
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem("myco_admin_token") || "");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Forgot password/Reset states
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("biotechagro.digital@gmail.com");
  const [resetCode, setResetCode] = useState<string>("");
  const [resetNewPassword, setResetNewPassword] = useState<string>("");
  const [isRequestingResetCode, setIsRequestingResetCode] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [resetCodeSent, setResetCodeSent] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string>("");
  const [resetError, setResetError] = useState<string>("");
  const [simulatedCode, setSimulatedCode] = useState<string>("");

  // Active admin security settings retrieved from server
  const [adminSecEmail, setAdminSecEmail] = useState<string>("");
  const [isSecDefaultPassword, setIsSecDefaultPassword] = useState<boolean>(true);
  const [secLastLogin, setSecLastLogin] = useState<string>("");
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState<string>("");
  const [emailUpdateError, setEmailUpdateError] = useState<string>("");
  const [isUpdatingSecEmail, setIsUpdatingSecEmail] = useState<boolean>(false);

  // Admin operational states
  const [adminMessages, setAdminMessages] = useState<ContactMessage[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState<boolean>(false);
  const [newAdminPassword, setNewAdminPassword] = useState<string>("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string>("");
  const [passwordChangeError, setPasswordChangeError] = useState<string>("");

  // Editable forms for text content
  const [editHero, setEditHero] = useState<any>({ badge: "", title: "", subtitle: "", primaryCta: "", secondaryCta: "" });
  const [editAbout, setEditAbout] = useState<any>({ title: "", subtitle: "", story: "", mission: "", vision: "", teamFocus: "" });
  const [editContactDetails, setEditContactDetails] = useState<any>({ email: "", phone: "", address: "", locationMapEmbed: "", workingHours: "" });
  const [isUpdatingTexts, setIsUpdatingTexts] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState<string>("");
  const [isDraggingLogo, setIsDraggingLogo] = useState<boolean>(false);

  // Product Editor overlay/modal variables
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    scientificName: "",
    description: "",
    category: "Grain Spawn",
    price: "",
    status: "Available",
    image: "",
    specifications: []
  });
  const [tempSpec, setTempSpec] = useState<string>("");
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // Service Editor variables
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    benefits: []
  });
  const [tempBenefit, setTempBenefit] = useState<string>("");
  const [isSavingService, setIsSavingService] = useState<boolean>(false);

  // active target textarea helper for copy-pasting AI text
  const [activeTextareaFocus, setActiveTextareaFocus] = useState<string>("hero_subtitle");

  // ==========================================
  // EFFECT: Fetch Dynamic Site Datasets
  // ==========================================
  const loadPublicData = async () => {
    setIsLoadingContent(true);
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setServices(data.services || []);
        if (data.siteContent) {
          setSiteContent(data.siteContent);
          // populate editorial copy edit inputs
          setEditHero(data.siteContent.hero);
          setEditAbout(data.siteContent.about);
          setEditContactDetails(data.siteContent.contactDetails);
          setLogoUrlInput(data.siteContent.logoUrl || "");
        }
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Listen for physical QR scanner parameters ?qr=prod_xxxxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrId = params.get("qr");
    if (qrId && products.length > 0) {
      const matched = products.find((p) => p.id === qrId);
      if (matched) {
        setSelectedQrProduct(matched);
        setActivePage("qr");
        // Clear query parameters from address bar to keep UX clean in history
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [products]);

  // ==========================================
  // EFFECT: Verify Token & Get Inbox Messages
  // ==========================================
  const verifyTokenAndLoadInbox = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setIsAdminLoggedIn(true);
        loadAdminInbox(token);
        loadAdminSettings(token);
      } else {
        // stale token
        localStorage.removeItem("myco_admin_token");
        setAuthToken("");
        setIsAdminLoggedIn(false);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  };

  const loadAdminInbox = async (token: string) => {
    try {
      const response = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const msgs = await response.json();
        setAdminMessages(msgs);
        setUnreadMessagesCount(msgs.filter((m: any) => !m.isRead).length);
      }
    } catch (err) {
      console.error("Inbox fetching failed:", err);
    }
  };

  const loadAdminSettings = async (token: string) => {
    try {
      const response = await fetch("/api/auth/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminSecEmail(data.adminEmail || "biotechagro.digital@gmail.com");
        setIsSecDefaultPassword(data.isDefaultPassword);
        setSecLastLogin(data.lastLogin || "");
      }
    } catch (err) {
      console.error("Failed to load admin security settings:", err);
    }
  };

  useEffect(() => {
    if (authToken) {
      verifyTokenAndLoadInbox(authToken);
    }
  }, [authToken]);

  // ==========================================
  // USER: Submit contact inquiry
  // ==========================================
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);
    setMessageSuccess(false);
    setMessageError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessageSuccess(true);
        setContactForm({
          senderName: "",
          senderEmail: "",
          senderPhone: "",
          subject: "",
          message: ""
        });
        // reload admin inbox if admin is viewing this during live operations
        if (isAdminLoggedIn && authToken) {
          loadAdminInbox(authToken);
        }
      } else {
        setMessageError(data.error || "Failed to submit message inquiry.");
      }
    } catch (err) {
      setMessageError("Network error. Please try again later.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // ==========================================
  // ADMIN: Authentication
  // ==========================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("myco_admin_token", data.token);
        setAuthToken(data.token);
        setIsAdminLoggedIn(true);
        setAdminPassword("");
        setAdminUsername("");
        loadAdminInbox(data.token);
        loadAdminSettings(data.token);
      } else {
        setLoginError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setLoginError("Failed to reach server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("myco_admin_token");
    setAuthToken("");
    setIsAdminLoggedIn(false);
    setAdminMessages([]);
    if (activePage === "admin") {
      setActivePage("home");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword.trim()) return;
    setIsPasswordUpdating(true);
    setPasswordChangeSuccess("");
    setPasswordChangeError("");

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ newPassword: newAdminPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordChangeSuccess("Password updated securely!");
        setNewAdminPassword("");
        loadAdminSettings(authToken);
      } else {
        setPasswordChangeError(data.error || "Fail to update password.");
      }
    } catch (err) {
      setPasswordChangeError("Network connection error.");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecEmail.trim()) return;
    setIsUpdatingSecEmail(true);
    setEmailUpdateSuccess("");
    setEmailUpdateError("");

    try {
      const response = await fetch("/api/auth/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ email: adminSecEmail.trim() })
      });
      const data = await response.json();
      if (response.ok) {
        setEmailUpdateSuccess("Registered laboratory security email updated successfully!");
        setAdminSecEmail(data.email);
        loadAdminSettings(authToken);
      } else {
        setEmailUpdateError(data.error || "Failed to update email.");
      }
    } catch (err) {
      setEmailUpdateError("Network connection error.");
    } finally {
      setIsUpdatingSecEmail(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsRequestingResetCode(true);
    setResetMessage("");
    setResetError("");

    try {
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() })
      });
      const data = await response.json();
      if (response.ok) {
        setResetCodeSent(true);
        setResetMessage(data.message);
        if (data.simulatedCode) {
          setSimulatedCode(data.simulatedCode);
        }
      } else {
        setResetError(data.error || "Failed to request reset code.");
      }
    } catch (err) {
      setResetError("Server connection error.");
    } finally {
      setIsRequestingResetCode(false);
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetCode.trim() || !resetNewPassword.trim()) return;
    setIsResettingPassword(true);
    setResetMessage("");
    setResetError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          code: resetCode.trim(),
          newPassword: resetNewPassword.trim()
        })
      });
      const data = await response.json();
      if (response.ok) {
        setResetMessage("Password reset successfully! Fallback dynamic default passwords have been disabled.");
        setResetCode("");
        setResetNewPassword("");
        setSimulatedCode("");
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetCodeSent(false);
          setResetMessage("");
          setResetError("");
        }, 3000);
      } else {
        setResetError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setResetError("Server connection error.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  // ==========================================
  // ADMIN: Edit Texts
  // ==========================================
  const handleUpdateTextSection = async (section: string, payload: any) => {
    setIsUpdatingTexts(section);
    try {
      const response = await fetch("/api/content/text", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ section, data: payload })
      });

      if (response.ok) {
        const data = await response.json();
        setSiteContent(data.content);
        alert(`Success: Website ${section} text saved securely.`);
      } else {
        alert("Verification failure. Check token validity.");
      }
    } catch (err) {
      alert("Error sending request.");
    } finally {
      setIsUpdatingTexts(null);
    }
  };

  // ==========================================
  // ADMIN: QR Direct Live Editing handlers
  // ==========================================
  const startQrEditing = () => {
    if (selectedQrProduct) {
      setQrForm({ ...selectedQrProduct });
      setQrEditMode(true);
    }
  };

  const handleSaveQrForm = async () => {
    if (!selectedQrProduct) return;
    try {
      const response = await fetch(`/api/products/${selectedQrProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(qrForm)
      });
      if (response.ok) {
        const data = await response.json();
        const updated = data.product;
        // Update both list state and active single product selection state
        setProducts(prev => prev.map(p => p.id === selectedQrProduct.id ? updated : p));
        setSelectedQrProduct(updated);
        setQrEditMode(false);
        alert("Batch tracking details saved securely!");
      } else {
        alert("Failed to update product batch data.");
      }
    } catch (err) {
      alert("Error saving live QR product parameters.");
    }
  };

  // ==========================================
  // ADMIN: Create, Update, Delete Products
  // ==========================================
  const handleOpenProductCreate = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      scientificName: "",
      description: "",
      category: "Grain Spawn",
      price: "",
      status: "Available",
      image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600",
      specifications: ["Carrier: Certified Grains", "Inoculation: 10%"],
      availableItems: 100,
      productionDate: new Date().toISOString().slice(0, 10),
      expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
  };

  const handleOpenProductEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    const isNew = !editingProduct;
    const url = isNew ? "/api/products" : `/api/products/${editingProduct.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        setProductForm({ name: "", scientificName: "", description: "", specifications: [] });
        setEditingProduct(null);
        loadPublicData();
      } else {
        alert("Error saving mycelium product parameters.");
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleBindDocumentToProduct = async (productId: string, docUrl: string) => {
    try {
      const prod = products.find(p => p.id === productId);
      if (!prod) return;
      
      const updatedProduct = {
        ...prod,
        certificateUrl: docUrl
      };
      
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedProduct)
      });
      
      if (response.ok) {
        loadPublicData();
      } else {
        alert("Found issue binding document url. Please check admin login credentials.");
      }
    } catch (err) {
      console.error("Bind document issue:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from the public catalog?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.ok) {
        loadPublicData();
      } else {
        alert("Delete request failed.");
      }
    } catch (err) {
      alert("Error contacting server.");
    }
  };

  // Base64 file converter for product/service image upload
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.onerror = (error) => console.error("Error reading file:", error);
  };

  // ==========================================
  // ADMIN: Create, Update, Delete Services
  // ==========================================
  const handleOpenServiceCreate = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
      benefits: ["Technical Site Layout Evaluation"]
    });
  };

  const handleOpenServiceEdit = (serv: Service) => {
    setEditingService(serv);
    setServiceForm({ ...serv });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingService(true);
    const isNew = !editingService;
    const url = isNew ? "/api/services" : `/api/services/${editingService.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(serviceForm)
      });
      if (response.ok) {
        setServiceForm({ name: "", description: "", price: "", duration: "", benefits: [] });
        setEditingService(null);
        loadPublicData();
      } else {
        alert("Error saving advising package.");
      }
    } catch (err) {
      alert("Server failure.");
    } finally {
      setIsSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Remove this consulting/setup program?")) return;
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.ok) {
        loadPublicData();
      } else {
        alert("Failed to delete service.");
      }
    } catch (err) {
      alert("Error.");
    }
  };

  // ==========================================
  // ADMIN: Manage incoming user messages
  // ==========================================
  const handleToggleMessageRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.ok) {
        loadAdminInbox(authToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message forever?")) return;
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.ok) {
        loadAdminInbox(authToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Triggered when clicking "Use Copy" in AI Assistant
  const handleAcceptAICopy = (copiedText: string) => {
    if (activeTextareaFocus === "hero_title") {
      setEditHero({ ...editHero, title: copiedText });
    } else if (activeTextareaFocus === "hero_subtitle") {
      setEditHero({ ...editHero, subtitle: copiedText });
    } else if (activeTextareaFocus === "about_story") {
      setEditAbout({ ...editAbout, story: copiedText });
    } else if (activeTextareaFocus === "about_mission") {
      setEditAbout({ ...editAbout, mission: copiedText });
    } else if (activeTextareaFocus === "about_vision") {
      setEditAbout({ ...editAbout, vision: copiedText });
    } else if (activeTextareaFocus === "about_teamFocus") {
      setEditAbout({ ...editAbout, teamFocus: copiedText });
    } else if (activeTextareaFocus === "product_desc") {
      setProductForm({ ...productForm, description: copiedText });
    } else if (activeTextareaFocus === "service_desc") {
      setServiceForm({ ...serviceForm, description: copiedText });
    } else {
      alert("First click inside a text field before inserting generated AI copy.");
    }
  };

  // Feature icon mapper to Lucide elements
  const renderFeatureIcon = (name: string) => {
    switch (name) {
      case "Sprout":
        return <Sprout className="w-6 h-6 text-emerald-800" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-emerald-800" />;
      case "IterationCw":
        return <IterationCw className="w-6 h-6 text-emerald-800" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-emerald-800" />;
      default:
        return <Sprout className="w-6 h-6 text-emerald-800" />;
    }
  };

  // Download QR Code image as a blob
  const downloadQrCode = (productId: string, productName: string) => {
    if (!printableQrBase64) return;
    try {
      const link = document.createElement("a");
      link.href = printableQrBase64;
      link.download = `QR_Code_${productName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code", error);
      // Fallback
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/?qr=${productId}`)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] flex flex-col selection:bg-emerald-100 selection:text-emerald-900 print:bg-white print:p-0">
      
      <div className="print:hidden w-full flex-grow flex flex-col">
        {/* GLOBAL NAVBAR */}
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        logoUrl={siteContent?.logoUrl}
      />

      {/* CORE SCREENS VIEW ROUTING */}
      <main className="flex-grow">
        
        {/* ==========================================
            SCREEN: HOME OVERVIEW
            ========================================== */}
        {activePage === "home" && siteContent && (
          <div className="space-y-16">
            
            {/* Elegant Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-[#fcfcf9] pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200/50">
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stone-300 rounded-full blur-3xl animate-pulse-slow" />
              </div>

              <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 text-emerald-700 animate-spin-slow" />
                  {t("home.hero.badge")}
                </span>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
                  {t("home.hero.title")}
                </h1>

                <p className="text-stone-600 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                  {t("home.hero.subtitle")}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => setActivePage("products")}
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md hover:translate-y-[-1px] cursor-pointer"
                  >
                    {t("home.hero.primaryCta")}
                  </button>
                  <button
                    onClick={() => setActivePage("contact")}
                    className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    {t("home.hero.secondaryCta")}
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Stats Grid to establish startup realism */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs text-center">
                <div>
                  <div className="text-3xl font-display font-bold text-emerald-900">100%</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest mt-1">{t("home.stats.cleanrooms")}</div>
                </div>
                <div className="border-l border-stone-200">
                  <div className="text-3xl font-display font-bold text-emerald-900">0%</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest mt-1">{t("home.stats.chemicals")}</div>
                </div>
                <div className="border-l border-stone-200">
                  <div className="text-3xl font-display font-bold text-emerald-900">45 Days</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest mt-1">{t("home.stats.compost")}</div>
                </div>
                <div className="border-l border-stone-200">
                  <div className="text-3xl font-display font-bold text-emerald-900">15+ TND</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest mt-1">{t("home.stats.price")}</div>
                </div>
              </div>
            </section>

            {/* Scientific Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center space-y-2 mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  {t("home.features.title")}
                </h2>
                <p className="text-stone-500 max-w-xl mx-auto text-sm font-light">
                  {t("home.features.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteContent.features.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-6 bg-white border border-stone-200/60 rounded-2xl shadow-xs hover:shadow-md transition-all hover:translate-y-[-2px] relative group"
                  >
                    <div className="p-3 bg-stone-100 rounded-xl w-fit mb-4 group-hover:bg-emerald-50 transition-colors">
                      {renderFeatureIcon(feat.icon)}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
                      {t(`features.${feat.id}.title`, feat.title)}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed font-light">
                      {t(`features.${feat.id}.description`, feat.description)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Science Section - "How mycelium processes substrates" */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-[#1c241d] text-stone-100 rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
                  <Sprout className="w-96 h-96 -mr-16 -mb-16 text-emerald-300" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      {t("home.process.label")}
                    </span>
                    <h2 className="font-display text-3xl font-bold text-white tracking-tight lead-[1.2]">
                      {t("home.process.title")}
                    </h2>
                    <p className="text-stone-300 leading-relaxed text-sm font-light">
                      {t("home.process.p1")}
                    </p>
                    <p className="text-stone-300 leading-relaxed text-sm font-light">
                      {t("home.process.p2")}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage("about")}
                        className="inline-flex items-center gap-1 text-xs text-white bg-emerald-800 hover:bg-emerald-700 px-4.5 py-2 rounded-lg font-bold tracking-wide transition-all cursor-pointer"
                      >
                        {t("home.process.cta")}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-900/60 p-6 rounded-2xl border border-stone-800 space-y-4">
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                      {t("home.process.phasesTitle")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">1</div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{t("home.process.step1.title")}</h4>
                          <p className="text-xs text-stone-400">{t("home.process.step1.desc")}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 border-t border-stone-800 pt-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">2</div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{t("home.process.step2.title")}</h4>
                          <p className="text-xs text-stone-400">{t("home.process.step2.desc")}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 border-t border-stone-800 pt-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">3</div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{t("home.process.step3.title")}</h4>
                          <p className="text-xs text-stone-400">{t("home.process.step3.desc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==========================================
            SCREEN: PRIVATE DISCOVERY QR DETAILS VIEW
            ========================================== */}
        {activePage === "qr" && selectedQrProduct && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in" id="qr-detail-page">
            {/* Header / Navigation Bar */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <button
                onClick={() => {
                  setActivePage("home");
                  setSelectedQrProduct(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
              >
                {t("qr.backHome")}
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                  {t("qr.traceabilityBadge")}
                </span>
              </div>
            </div>

            {/* Main Visual Dual Panel Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Panel: Example Photo & Category Details */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-stone-50 border border-stone-250 p-4 rounded-2xl space-y-4 shadow-sm">
                  <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden relative">
                    <img
                      src={qrEditMode ? (qrForm.image || "") : selectedQrProduct.image}
                      alt={localizedProductName(selectedQrProduct)}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider font-mono bg-stone-900/90 text-stone-50 rounded-md uppercase">
                        {localizedCategory(selectedQrProduct.category)}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and status indicator */}
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono block">{t("qr.price")}</span>
                      <span className="text-sm font-bold text-stone-900">{selectedQrProduct.price}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono block text-right">{t("qr.status")}</span>
                      <span className={`text-xs font-bold ${selectedQrProduct.status === "Available" ? "text-emerald-700" : "text-rose-700"}`}>
                        ● {localizedStatus(selectedQrProduct.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure certificate box */}
                <div className="p-4 bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 space-y-2">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider block">TUNISIA MYCELIUM BIOTECH</span>
                  <h4 className="text-xs font-bold">🛡️ Authenticity Verification Certificate</h4>
                  <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                    This single jar, spawn bag or grow kit contains active, contaminant-free mycelium inoculated inside our premium sterile cleanrooms in Tunisia. Substrate sterilization completed under 121°C autoclaving.
                  </p>
                </div>
              </div>

              {/* Right Panel: Description, Tracking Stock Levels, and Dates */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Product Name headings */}
                <div className="space-y-1">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900 leading-tight">
                    {localizedProductName(selectedQrProduct)}
                  </h1>
                  {selectedQrProduct.scientificName && (
                    <p className="text-xs text-stone-500 font-medium italic">
                      Taxonomy: {selectedQrProduct.scientificName}
                    </p>
                  )}
                </div>

                {/* QR Parameters tracking details: Available Stock, Prodn Date, Expiry Date */}
                <div className={`grid ${isAdminLoggedIn ? "grid-cols-3" : "grid-cols-1"} gap-3`}>
                  <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl text-center">
                    <span className="text-[9px] font-mono text-emerald-800 font-semibold block uppercase tracking-wider mb-1">
                      Available Stock
                    </span>
                    {qrEditMode ? (
                      <input
                        type="number"
                        min={0}
                        value={qrForm.availableItems ?? 50}
                        onChange={(e) => setQrForm({ ...qrForm, availableItems: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-white border border-stone-250 rounded-md px-1.5 py-0.5 text-center text-xs font-bold"
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-950">
                        {selectedQrProduct.availableItems ?? 50} <span className="text-[10px] font-normal">units</span>
                      </span>
                    )}
                  </div>

                  {isAdminLoggedIn && (
                    <>
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                        <span className="text-[9px] font-mono text-stone-500 font-semibold block uppercase tracking-wider mb-1">
                          Production Date
                        </span>
                        {qrEditMode ? (
                          <input
                            type="date"
                            value={qrForm.productionDate || ""}
                            onChange={(e) => setQrForm({ ...qrForm, productionDate: e.target.value })}
                            className="w-full bg-white border border-stone-250 rounded-md px-1.5 py-0.5 text-xs text-center"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-stone-800">
                            {selectedQrProduct.productionDate || "2026-06-10"}
                          </span>
                        )}
                      </div>

                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                        <span className="text-[9px] font-mono text-stone-500 font-semibold block uppercase tracking-wider mb-1">
                          Expiration Date
                        </span>
                        {qrEditMode ? (
                          <input
                            type="date"
                            value={qrForm.expirationDate || ""}
                            onChange={(e) => setQrForm({ ...qrForm, expirationDate: e.target.value })}
                            className="w-full bg-white border border-stone-250 rounded-md px-1.5 py-0.5 text-xs text-center"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-stone-800">
                            {selectedQrProduct.expirationDate || "2026-09-10"}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Description & analytical copy */}
                <div className="space-y-2 bg-stone-50/50 p-4 rounded-xl border border-stone-200/60">
                  <h3 className="text-xs font-bold text-stone-800 uppercase font-mono tracking-wider">
                    {t("products.specifications")}
                  </h3>
                  {qrEditMode ? (
                    <textarea
                      rows={5}
                      value={qrForm.description || ""}
                      onChange={(e) => setQrForm({ ...qrForm, description: e.target.value })}
                      className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-900 animate-fade-in"
                    />
                  ) : (
                    <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {localizedProductDescription(selectedQrProduct) || "Inoculated grains ready to spawn substrates under micro-filtrated laboratory settings."}
                    </p>
                  )}
                </div>

                {/* specifications list if any */}
                {selectedQrProduct.specifications && selectedQrProduct.specifications.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-stone-400">{t("qr.biologicalParameters")}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedQrProduct.specifications.map((spec, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 border border-stone-200 rounded-md px-2 py-0.5 font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Live Controls block */}
                {isAdminLoggedIn && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950 font-display">🔧 Administrator Real-Time Console</h4>
                        <p className="text-[10px] text-emerald-700">You can edit the active description, example photo uploader, and dates directly.</p>
                      </div>
                      {!qrEditMode ? (
                        <button
                          onClick={startQrEditing}
                          className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                        >
                          Enable Live Edits
                        </button>
                      ) : (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setQrEditMode(false)}
                            className="px-2.5 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            onClick={handleSaveQrForm}
                            className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    {qrEditMode && (
                      <div className="space-y-2 pt-2 border-t border-emerald-200 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-emerald-950 block">Direct Photo Url</label>
                          <input
                            type="text"
                            value={qrForm.image || ""}
                            onChange={(e) => setQrForm({ ...qrForm, image: e.target.value })}
                            className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs text-stone-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-emerald-950 block">Or Upload Local Image File:</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(e.target.files[0], (b64) => setQrForm({ ...qrForm, image: b64 }));
                              }
                            }}
                            className="w-full bg-white border border-stone-250 rounded-lg p-1 text-xs text-stone-900"
                          />
                        </div>
                      </div>
                    )}

                    {/* QR Code label printing view for Admin */}
                    <div className="pt-3 border-t border-emerald-200 flex items-center gap-4 bg-white/70 p-3 rounded-xl border border-emerald-100">
                      <img
                        src={printableQrBase64 || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}/?qr=${selectedQrProduct.id}`)}`}
                        alt="Product QR Label Code"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 bg-white border p-1 rounded-lg shrink-0 shadow-xs"
                      />
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-bold text-stone-700 block">🖨️ Physical Substrate Label Generator</span>
                        <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                          Print or download this authentic QR block to stick on Mycelial jars, bags, or grow kits. Pointing directly to:
                          <span className="text-[10px] text-stone-500 block font-mono bg-stone-100 p-1 rounded select-all mt-1">
                            {window.location.origin}/?qr={selectedQrProduct.id}
                          </span>
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.print()}
                            disabled={isPreloadingQr || !printableQrBase64}
                            className={`px-2.5 py-1 font-mono text-[10px] font-bold border rounded transition-colors ${
                              isPreloadingQr || !printableQrBase64
                                ? "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                                : "bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                            }`}
                          >
                            {isPreloadingQr ? "Preloading..." : "Print QR Sticker"}
                          </button>
                          <button
                            onClick={() => downloadQrCode(selectedQrProduct.id, selectedQrProduct.name)}
                            disabled={isPreloadingQr || !printableQrBase64}
                            className={`px-2.5 py-1 font-mono text-[10px] font-bold border rounded transition-colors ${
                              isPreloadingQr || !printableQrBase64
                                ? "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-250 cursor-pointer"
                            }`}
                          >
                            Save QR Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: ABOUT US
            ========================================== */}
        {activePage === "about" && siteContent && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            
            {/* Intro Section */}
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase font-bold">
                {t("about.badge")}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-stone-900 leading-tight">
                {t("about.title", siteContent.about.title)}
              </h1>
              <p className="text-stone-500 text-lg leading-relaxed font-light">
                {t("about.subtitle", siteContent.about.subtitle)}
              </p>
            </div>

            {/* Core Story Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  {t("about.storyHeading")}
                </h2>
                <p className="text-stone-600 leading-relaxed font-light text-sm sm:text-base">
                  {t("about.story", siteContent.about.story)}
                </p>
                <div className="p-4 bg-emerald-50 border-l-4 border-emerald-800 rounded-r-xl">
                  <p className="text-xs text-emerald-950 font-light italic leading-relaxed">
                    {t("about.teamFocus", siteContent.about.teamFocus)}
                  </p>
                </div>
              </div>

              {/* Lab Visual representation card */}
              <div className="bg-stone-100 rounded-3xl p-8 border border-stone-200 relative overflow-hidden self-stretch flex flex-col justify-between">
                <div className="space-y-4 relative z-10">
                  <div className="inline-flex px-2 py-0.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-mono rounded-md">
                    {t("about.labStandard")}
                  </div>
                  <h3 className="font-display font-bold text-xl text-stone-900">{t("about.hepaTitle")}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    {t("about.hepaText")}
                  </p>
                </div>

                <div className="mt-8 border-t border-stone-200 pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-mono text-stone-400 block">{t("about.autoclaveDuration")}</span>
                    <span className="text-base font-semibold text-stone-800">150 Minutes</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-stone-400 block">{t("about.airExchange")}</span>
                    <span className="text-base font-semibold text-stone-800 font-mono">140 m³/hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-3">
                <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl inline-block">
                  <Sprout className="w-5 h-5" />
                </span>
                <h3 className="font-display font-bold text-xl text-stone-900">{t("about.missionTitle")}</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-light">
                  {t("about.mission", siteContent.about.mission)}
                </p>
              </div>

              <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-3">
                <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl inline-block">
                  <Globe className="w-5 h-5" />
                </span>
                <h3 className="font-display font-bold text-xl text-stone-900">{t("about.visionTitle")}</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-light">
                  {t("about.vision", siteContent.about.vision)}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            SCREEN: PRODUCTS & SERVICES
            ========================================== */}
        {activePage === "products" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h1 className="font-display text-4xl font-bold tracking-tight text-stone-900 leading-tight">
                {t("products.title")}
              </h1>
              <p className="text-stone-500 text-sm font-light">
                {t("products.subtitle")}
              </p>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-6">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-xl transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  {localizedCategory(cat)}
                </button>
              ))}
            </div>

            {/* Dynamic Products Grid */}
            <div className="space-y-8">
              <h2 className="font-display text-2xl font-bold text-stone-900">{t("products.sectionTitle")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((p) => categoryFilter === "All" || p.category === categoryFilter)
                  .map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductDetails(product)}
                      className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:translate-y-[-2px] cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* Product Photo */}
                        <div className="h-48 bg-stone-100 relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={localizedProductName(product)}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-full tracking-wider border shadow-xs ${
                                product.status === "Available"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : product.status === "Pre-order"
                                  ? "bg-amber-50 border-amber-200 text-amber-800"
                                  : "bg-rose-50 border-rose-200 text-rose-800"
                              }`}
                            >
                              {localizedStatus(product.status)}
                            </span>
                          </div>
                          
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-900/40 backdrop-blur-xs rounded-md">
                            <span className="text-[10px] text-white/90 font-mono tracking-widest block uppercase">
                              {localizedCategory(product.category)}
                            </span>
                          </div>
                        </div>

                        {/* Title and details */}
                        <div className="p-5 space-y-2">
                          {product.scientificName && (
                            <span className="text-xs font-mono text-emerald-700 italic block font-semibold">
                              {product.scientificName}
                            </span>
                          )}
                          <h3 className="font-display font-semibold text-lg text-stone-900 group-hover:text-emerald-900 transition-colors">
                            {localizedProductName(product)}
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 font-light">
                            {localizedProductDescription(product)}
                          </p>
                        </div>
                      </div>

                      {/* Pricing and spec summary */}
                      <div className="px-5 pb-5 pt-2 flex justify-between items-center bg-stone-50/55 border-t border-stone-100">
                        <span className="text-sm font-semibold text-stone-900 font-mono">
                          {product.price}
                        </span>
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                          {t("products.viewDetails")}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Advisory Consultation Services Section */}
            {(categoryFilter === "All" || categoryFilter === "Consulting & Setup") && (
              <div className="space-y-8 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-stone-900">{t("products.servicesTitle")}</h2>
                  <p className="text-stone-500 text-sm font-light">{t("products.servicesSubtitle")}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {services.map((serv) => (
                    <div
                      key={serv.id}
                      className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden p-6 shadow-xs flex flex-col md:flex-row gap-6 hover:shadow-md transition-all self-stretch"
                    >
                      <div className="w-full md:w-1/3 bg-stone-100 rounded-xl overflow-hidden self-stretch h-40 md:h-auto">
                        <img
                          src={serv.image}
                          alt={localizedServiceName(serv)}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="w-full md:w-2/3 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-600 font-mono text-[10px] uppercase tracking-wider rounded-lg inline-block">
                            {localizedServiceDuration(serv)}
                          </span>
                          <h3 className="font-display font-semibold text-lg text-stone-900">
                            {localizedServiceName(serv)}
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed font-light">
                            {localizedServiceDescription(serv)}
                          </p>
                          
                          {/* Benefits list */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono block">{t("products.packageBenefits")}</span>
                            {serv.benefits.map((b, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-light">{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                          <span className="text-xs font-mono text-stone-400">{t("products.consultationPricing")}</span>
                          <span className="text-sm font-bold text-emerald-900 font-mono">{serv.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DETAILED SPEC POPUP MODAL */}
            {selectedProductDetails && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProductDetails(null)}
                    className="absolute top-4 right-4 p-2 bg-stone-900/70 text-white hover:bg-stone-900 rounded-full z-10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="h-64 relative bg-stone-100">
                    <img
                      src={selectedProductDetails.image}
                      alt={localizedProductName(selectedProductDetails)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 p-3 bg-stone-950/80 backdrop-blur-xs rounded-xl border border-stone-800 text-stone-100">
                      <span className="text-[9px] font-mono tracking-widest text-emerald-300 block uppercase">
                        {localizedCategory(selectedProductDetails.category)}
                      </span>
                      <h3 className="font-display font-medium text-lg leading-tight">
                        {localizedProductName(selectedProductDetails)}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-800 italic block font-bold">
                        {selectedProductDetails.scientificName || t("products.scientificStandard")}
                      </span>
                      <p className="text-sm leading-relaxed text-stone-600 font-light">
                        {localizedProductDescription(selectedProductDetails)}
                      </p>
                    </div>

                    {/* Specifications List */}
                    {selectedProductDetails.specifications && selectedProductDetails.specifications.length > 0 && (
                      <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 space-y-3">
                        <span className="text-xs font-semibold text-stone-900 font-display block uppercase tracking-wider">
                          {t("products.specifications")}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedProductDetails.specifications.map((spec, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                              <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full shrink-0" />
                              <span className="font-light">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-stone-150 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-stone-400 block font-mono">{t("products.referencePricing")}</span>
                        <span className="text-lg font-bold text-stone-900 font-mono">{selectedProductDetails.price}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProductDetails(null);
                          setContactForm((f) => ({
                            ...f,
                            subject: `${t("products.inquirySubjectPrefix")} ${localizedProductName(selectedProductDetails)}`,
                            message: t("products.inquiryMessage")
                          }));
                          setActivePage("contact");
                        }}
                        className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                      >
                        {t("products.purchaseInquiry")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            SCREEN: CONTACT US
            ========================================== */}
        {activePage === "contact" && siteContent && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="font-display text-4xl font-bold text-stone-900">
                {t("contact.title")}
              </h1>
              <p className="text-sm text-stone-500 font-light font-sans">
                {t("contact.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Message submit form */}
              <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-stone-900 mb-1">{t("contact.formTitle")}</h3>
                  <p className="text-xs text-stone-400">{t("contact.formSubtitle")}</p>
                </div>

                {messageSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full w-fit mx-auto">
                      <Check className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-medium text-lg text-emerald-950">{t("contact.successTitle")}</h4>
                      <p className="text-xs text-emerald-800 font-light">{t("contact.successText")}</p>
                    </div>
                    <button
                      onClick={() => setMessageSuccess(false)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg tracking-wide cursor-pointer"
                    >
                      {t("contact.sendAnother")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    {messageError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{messageError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block">{t("contact.name")}</label>
                        <input
                          type="text"
                          required
                          value={contactForm.senderName}
                          onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                          placeholder={t("contact.namePlaceholder")}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block">{t("contact.email")}</label>
                        <input
                          type="email"
                          required
                          value={contactForm.senderEmail}
                          onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                          placeholder={t("contact.emailPlaceholder")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block">{t("contact.phone")}</label>
                        <input
                          type="text"
                          value={contactForm.senderPhone}
                          onChange={(e) => setContactForm({ ...contactForm, senderPhone: e.target.value })}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                          placeholder={t("contact.phonePlaceholder")}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block">{t("contact.subject")}</label>
                        <input
                          type="text"
                          required
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                          placeholder={t("contact.subjectPlaceholder")}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-stone-700 block">{t("contact.message")}</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                        placeholder={t("contact.messagePlaceholder")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingMessage}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-950 hover:bg-emerald-900 text-stone-100 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                    >
                      {isSendingMessage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("contact.submitting")}
                        </>
                      ) : (
                        t("contact.submit")
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Lab Coordinates and Interactive Map */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-stone-900 text-stone-300 rounded-3xl p-6 sm:p-8 space-y-4 border border-stone-800">
                  <h3 className="font-display font-semibold text-lg text-white">{t("contact.centerTitle")}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light space-y-2 sm:space-y-0">
                    <div className="space-y-1">
                      <span className="text-stone-500 font-mono uppercase block text-[10px]">{t("contact.officeAddress")}</span>
                      <p className="text-stone-200 leading-relaxed">
                        {siteContent.contactDetails.address}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-500 font-mono uppercase block text-[10px]">{t("contact.hotlines")}</span>
                      <p className="text-stone-200 font-mono">
                        {siteContent.contactDetails.phone}
                      </p>
                      <p className="text-stone-400">
                        {siteContent.contactDetails.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t("contact.officeHours")}: {siteContent.contactDetails.workingHours}</span>
                  </div>
                </div>

                {/* Map iFrame */}
                <div className="bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 flex-grow h-64 lg:h-auto min-h-64 shadow-xs relative">
                  <iframe
                    src={siteContent.contactDetails.locationMapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={t("contact.mapTitle")}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            SCREEN: ADMIN AUTHENTICATION / ACCESS PANEL
            ========================================== */}
        {activePage === "admin" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!isAdminLoggedIn ? (
              
              /* LOGIN & SECURE PASSWORD RECOVERY CHANNELS */
              <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-3xl p-8 shadow-md space-y-6">
                {!showForgotPassword ? (
                  /* STANDARD LOGIN SCREEN VIEW */
                  <>
                    <div className="text-center space-y-2">
                      <div className="p-3.5 bg-stone-100 text-stone-700 rounded-2xl w-fit mx-auto border border-stone-200">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h1 className="font-display text-2xl font-bold text-stone-900">Lab Administration Log In</h1>
                      <p className="text-xs text-stone-400">Enter secure laboratory credentials to manage catalog and copy decks.</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {loginError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block">Username *</label>
                        <input
                          type="text"
                          required
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                          placeholder="e.g. admin"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-stone-700 block font-sans">Password or Access Code *</label>
                        <input
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-mono"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-[11px] text-stone-500 font-light flex items-start gap-1.5 leading-relaxed">
                        <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span><strong>Staff Notice:</strong> The default credentials are <code>admin</code> / <code>admin</code> unless customized inside settings.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full h-11 flex items-center justify-center gap-2 bg-[#1b2a22] hover:bg-[#121c17] text-white disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                      >
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying lab security...
                          </>
                        ) : (
                          "Sign In to Console"
                        )}
                      </button>

                      <div className="pt-2 border-t border-stone-150">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true);
                            setResetEmail("biotechagro.digital@gmail.com");
                          }}
                          className="w-full text-center text-xs text-emerald-800 hover:text-emerald-900 hover:underline font-medium transition-all"
                        >
                          Forgot Password / Reset Settings?
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  /* PASSWORD RECOVERY / CHANGE DEFAULT VIEW */
                  <>
                    <div className="text-center space-y-2">
                      <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mx-auto border border-emerald-100">
                        <Mail className="w-6 h-6 animate-pulse" />
                      </div>
                      <h1 className="font-display text-2xl font-bold text-stone-900">Lab Password Reset</h1>
                      <p className="text-xs text-stone-400">Request a secure 6-digit administrative verification code to update credentials.</p>
                    </div>

                    <div className="space-y-4">
                      {resetError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{resetError}</span>
                        </div>
                      )}

                      {resetMessage && (
                        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs flex items-center gap-2 leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{resetMessage}</span>
                        </div>
                      )}

                      {!resetCodeSent ? (
                        /* REQUEST STAGE */
                        <form onSubmit={handleRequestResetCode} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-700 block">Registered Admin Email *</label>
                            <input
                              type="email"
                              required
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 font-light"
                              placeholder="biotechagro.digital@gmail.com"
                            />
                            <p className="text-[10px] text-stone-400 font-light">Your registered access email can be matched below.</p>
                          </div>

                          <button
                            type="submit"
                            disabled={isRequestingResetCode}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white disabled:opacity-45 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
                          >
                            {isRequestingResetCode ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Gen Code & Dispatching...
                              </>
                            ) : (
                              "Send Verification Code"
                            )}
                          </button>
                        </form>
                      ) : (
                        /* VERIFICATION CODE & RESET STAGE */
                        <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-700 block font-mono">6-Digit Code *</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 text-center font-bold tracking-widest font-mono"
                              placeholder="000000"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-700 block font-sans">New Access Password *</label>
                            <input
                              type="password"
                              required
                              value={resetNewPassword}
                              onChange={(e) => setResetNewPassword(e.target.value)}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 font-mono"
                              placeholder="Enter complex password"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isResettingPassword || !resetCode || !resetNewPassword}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-850 text-white disabled:opacity-45 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
                          >
                            {isResettingPassword ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Validating Code and Cryptographic hashing...
                              </>
                            ) : (
                              "Verify and Reset Password Code"
                            )}
                          </button>
                        </form>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setResetCodeSent(false);
                            setResetMessage("");
                            setResetError("");
                            setResetCode("");
                            setResetNewPassword("");
                          }}
                          className="w-full text-center text-xs text-stone-500 hover:text-stone-800 transition-all font-light"
                        >
                          ← Back to Sign In Screen
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              
              /* COHESIVE SECURE ADMIN CONTROL PANEL */
              <div className="space-y-8">
                
                {/* Header and statistics at a glance */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                  <div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono font-bold tracking-widest block w-fit mb-1.5">
                      SECURE BIOTECH CONSOLE
                    </span>
                    <h1 className="font-display text-2xl font-bold text-stone-900">Lab Hub Central Panel</h1>
                    <p className="text-xs text-stone-400 font-light mt-0.5">Edit web information decks, catalogs, and manage incoming messages.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 h-10 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border border-rose-100"
                  >
                    <Unlock className="w-4 h-4" />
                    Sign Out Panel
                  </button>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">Products Listed</span>
                    <span className="text-3xl font-bold font-display text-emerald-950 block mt-1">{products.length} Items</span>
                  </div>
                  <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">Consultings</span>
                    <span className="text-3xl font-bold font-display text-emerald-950 block mt-1">{services.length} Programs</span>
                  </div>
                  <div className="bg-white border border-stone-250 p-4 rounded-xl text-center relative overflow-hidden">
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">Unread Inquiry</span>
                    <span className={`text-3xl font-bold font-display block mt-1 ${unreadMessagesCount > 0 ? "text-rose-600 animate-pulse" : "text-stone-700"}`}>
                      {unreadMessagesCount} messages
                    </span>
                  </div>
                  <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">Auth Status</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono uppercase bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2 font-display">
                      Verified Session
                    </span>
                  </div>
                </div>

                {/* MAIN GRID: TWO COLUMNS (Content management & AI assistant sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left grid: Forms area */}
                  <div className="lg:col-span-2 space-y-12">
                    
                    {/* SECTION: ADMIN MESSAGE INBOX */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                        <div>
                          <h3 className="font-display font-bold text-lg text-stone-900">Communication Inquiry Inbox</h3>
                          <p className="text-xs text-stone-400">Review bulk requests, partnership inquiries, and farmer notifications.</p>
                        </div>
                        <MessageSquare className="w-5 h-5 text-stone-400" />
                      </div>

                      {adminMessages.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-6">Inquiry folders are currently clean and empty.</p>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {adminMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`p-4 rounded-xl border transition-all ${
                                !msg.isRead ? "bg-emerald-50/50 border-emerald-250 shadow-xs" : "bg-stone-50 border-stone-200"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm text-stone-900">{msg.senderName}</h4>
                                    {!msg.isRead && (
                                      <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-mono rounded font-bold uppercase tracking-wider">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-500 font-mono">
                                    {msg.senderEmail} {msg.senderPhone ? `| ${msg.senderPhone}` : ""}
                                  </p>
                                </div>
                                <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1 font-light">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(msg.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>

                              <div className="bg-white/80 border border-stone-100 p-2.5 rounded-lg text-xs leading-relaxed text-stone-700 italic font-light mb-3 whitespace-pre-wrap">
                                <strong>Subject: {msg.subject}</strong>
                                <br />
                                {msg.message}
                              </div>

                              <div className="flex justify-between items-center">
                                <button
                                  onClick={() => handleToggleMessageRead(msg.id)}
                                  className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold tracking-wide flex items-center gap-1 cursor-pointer"
                                >
                                  {msg.isRead ? "Mark Unread" : "Mark Read"}
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash className="w-3 h-3" />
                                  Delete Inquiry
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* LOGO & BRAND IDENTITY CUSTOMIZER */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-stone-900">Brand Logo & Identity</h3>
                          <p className="text-xs text-stone-405">Configure your dynamic laboratory logo. You can paste a web URL or upload an image directly from your machine.</p>
                        </div>
                        <Settings className="w-5 h-5 text-stone-400" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        
                        {/* Logo Preview */}
                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-stone-500 uppercase">Live Preview</span>
                          <div className="bg-white border border-stone-200 rounded-xl h-24 w-24 flex items-center justify-center shadow-xs overflow-hidden">
                            {siteContent?.logoUrl ? (
                              <img src={siteContent.logoUrl} alt="Biotech Agro Brand Logo" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Sprout className="h-10 w-10 text-emerald-800" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-800 block">Biotech Agro</span>
                            <span className="text-[10px] text-stone-400 font-mono">Dynamic Brand Asset</span>
                          </div>
                        </div>

                        {/* Logo Controls */}
                        <div className="md:col-span-2 space-y-5">
                          
                          {/* Paste URL */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-700 block">Logo Image URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="https://example.com/logo.png"
                                value={logoUrlInput}
                                onChange={(e) => setLogoUrlInput(e.target.value)}
                                className="flex-1 bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateTextSection("logo", { logoUrl: logoUrlInput })}
                                disabled={isUpdatingTexts === "logo"}
                                className="px-4 py-2 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl text-xs font-semibold tracking-wide disabled:opacity-45 leading-none shadow-xs cursor-pointer select-none"
                              >
                                {isUpdatingTexts === "logo" ? "Saving..." : "Apply URL"}
                              </button>
                            </div>
                            <span className="text-[10px] text-stone-405 font-light block">You can paste any URL pointing to a PNG, WEBP, or SVG file (e.g. from GitHub, CDN, etc.).</span>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-stone-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-white px-2.5 text-stone-400 font-mono text-[10px] uppercase">Or upload image from device</span>
                            </div>
                          </div>

                          {/* Drag 'n' Drop Area */}
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingLogo(true);
                            }}
                            onDragLeave={() => setIsDraggingLogo(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingLogo(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result as string;
                                  setLogoUrlInput(base64String);
                                  handleUpdateTextSection("logo", { logoUrl: base64String });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none ${
                              isDraggingLogo
                                ? "border-emerald-700 bg-emerald-50/20"
                                : "border-stone-200 hover:border-stone-450 bg-stone-50/40"
                            }`}
                            onClick={() => {
                              const fileInput = document.getElementById("logo-file-input");
                              fileInput?.click();
                            }}
                          >
                            <input
                              type="file"
                              id="logo-file-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64String = reader.result as string;
                                    setLogoUrlInput(base64String);
                                    handleUpdateTextSection("logo", { logoUrl: base64String });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-stone-850">Drag and drop file here, or click to browse</p>
                            <p className="text-[10px] text-stone-400 mt-0.5 font-light">Supports PNG, JPG, WEBP, or SVG. Automatically converted to a lightweight self-contained Data-URI.</p>
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* SECTION: EDIT WEBSITE TEXT COPY */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-8">
                      <div className="border-b border-stone-100 pb-4">
                        <h3 className="font-display font-semibold text-lg text-stone-900">Dynamic Text Decks</h3>
                        <p className="text-xs text-stone-400 font-light mt-0.5">Click into any copy sector to edit, or use the copy generate assistant to fill blocks.</p>
                      </div>

                      {/* Hero Section Texts */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateTextSection("hero", editHero);
                        }}
                        className="space-y-4"
                      >
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Hero Landing Copy</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700">Badge Text</label>
                            <input
                              type="text"
                              value={editHero.badge}
                              onChange={(e) => setEditHero({ ...editHero, badge: e.target.value })}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700">Hero Main Title (Display)</label>
                            <input
                              type="text"
                              onFocus={() => setActiveTextareaFocus("hero_title")}
                              value={editHero.title}
                              onChange={(e) => setEditHero({ ...editHero, title: e.target.value })}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-stone-700">Subtext Description</label>
                            <span className="text-[10px] text-emerald-700 font-mono">Click to target AI helper</span>
                          </div>
                          <textarea
                            rows={3}
                            onFocus={() => setActiveTextareaFocus("hero_subtitle")}
                            value={editHero.subtitle}
                            onChange={(e) => setEditHero({ ...editHero, subtitle: e.target.value })}
                            className={`w-full bg-[#fcfcf9] border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden transition-all font-light ${
                              activeTextareaFocus === "hero_subtitle" ? "border-emerald-700 ring-1 ring-emerald-700/50" : "border-stone-200"
                            }`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingTexts === "hero"}
                          className="px-4.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-stone-100 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                        >
                          {isUpdatingTexts === "hero" ? "Updating values..." : "Save Hero Deck"}
                        </button>
                      </form>

                      {/* About Section Texts */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateTextSection("about", editAbout);
                        }}
                        className="space-y-4 pt-6 border-t border-stone-100"
                      >
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">About Biology Page Copy</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700">Header Title</label>
                            <input
                              type="text"
                              value={editAbout.title}
                              onChange={(e) => setEditAbout({ ...editAbout, title: e.target.value })}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700">Header Subtitle</label>
                            <input
                              type="text"
                              value={editAbout.subtitle}
                              onChange={(e) => setEditAbout({ ...editAbout, subtitle: e.target.value })}
                              className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 transition-all font-light"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-700 block">Startup Bio-tech Story</label>
                          <textarea
                            rows={3}
                            onFocus={() => setActiveTextareaFocus("about_story")}
                            value={editAbout.story}
                            onChange={(e) => setEditAbout({ ...editAbout, story: e.target.value })}
                            className={`w-full bg-[#fcfcf9] border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden transition-all font-light ${
                              activeTextareaFocus === "about_story" ? "border-emerald-700 ring-1 ring-emerald-700/50" : "border-stone-200"
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700 block">{t("about.missionTitle")}</label>
                            <textarea
                              rows={3}
                              onFocus={() => setActiveTextareaFocus("about_mission")}
                              value={editAbout.mission}
                              onChange={(e) => setEditAbout({ ...editAbout, mission: e.target.value })}
                              className={`w-full bg-[#fcfcf9] border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden transition-all font-light ${
                                activeTextareaFocus === "about_mission" ? "border-emerald-700 ring-1 ring-emerald-700/50" : "border-stone-200"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700 block">{t("about.visionTitle")}</label>
                            <textarea
                              rows={3}
                              onFocus={() => setActiveTextareaFocus("about_vision")}
                              value={editAbout.vision}
                              onChange={(e) => setEditAbout({ ...editAbout, vision: e.target.value })}
                              className={`w-full bg-[#fcfcf9] border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden transition-all font-light ${
                                activeTextareaFocus === "about_vision" ? "border-emerald-700 ring-1 ring-emerald-700/50" : "border-stone-200"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-700">Lab Standards Quote / Highlight</label>
                          <textarea
                            rows={2}
                            onFocus={() => setActiveTextareaFocus("about_teamFocus")}
                            value={editAbout.teamFocus}
                            onChange={(e) => setEditAbout({ ...editAbout, teamFocus: e.target.value })}
                            className={`w-full bg-[#fcfcf9] border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden transition-all font-light ${
                              activeTextareaFocus === "about_teamFocus" ? "border-emerald-700 ring-1 ring-emerald-700/50" : "border-stone-200"
                            }`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingTexts === "about"}
                          className="px-4.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-stone-100 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                        >
                          {isUpdatingTexts === "about" ? "Updating copy..." : "Save About Science Deck"}
                        </button>
                      </form>
                    </div>

                    {/* SECTION: CATALOG PRODUCT MANAGEMENT */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-stone-900">Manage Catalog Products</h3>
                          <p className="text-xs text-stone-400">Add, edit, or remove mycelial spawns and composite materials.</p>
                        </div>
                        <button
                          onClick={handleOpenProductCreate}
                          className="flex items-center gap-1.2 px-3 py-1.5 bg-emerald-950 text-emerald-100 rounded-xl text-xs font-semibold tracking-wide hover:bg-emerald-900 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          New Product
                        </button>
                      </div>

                      {/* Add/Edit Product Form overlay or static editor depending on state */}
                      {(productForm.name !== undefined && (productForm.id || editingProduct === null)) && (
                        <form onSubmit={handleSaveProduct} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                            <h4 className="text-xs font-bold text-stone-800 font-display">
                              {editingProduct ? `Edit Product (Ref: ${editingProduct.id})` : "Add New Mycelium Catalog Item"}
                            </h4>
                            <button
                              type="button"
                              onClick={() => setProductForm({ name: undefined })}
                              className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                            >
                              Cancel Form
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Commercial Name *</label>
                              <input
                                type="text"
                                required
                                value={productForm.name || ""}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                                placeholder="Pearl Oyster Spawn"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Scientific Latin taxonomy</label>
                              <input
                                type="text"
                                value={productForm.scientificName || ""}
                                onChange={(e) => setProductForm({ ...productForm, scientificName: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 italic"
                                placeholder="Pleurotus ostreatus"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700 block">Analytical Description</label>
                            <textarea
                              rows={2}
                              onFocus={() => setActiveTextareaFocus("product_desc")}
                              value={productForm.description || ""}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              placeholder="Describe structural colonization speed, substrate recipe..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Catalog Category</label>
                              <select
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2 py-1.5 text-xs text-stone-900"
                              >
                                <option value="Grain Spawn">Grain Spawn</option>
                                <option value="Bio-materials">Bio-materials</option>
                                <option value="Starting Cultures">Starting Cultures</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Reference Price (Tunisian Currency)</label>
                              <input
                                type="text"
                                required
                                value={productForm.price || ""}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                                placeholder="e.g. 15 TND / kg"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Inventory Status</label>
                              <select
                                value={productForm.status}
                                onChange={(e) => setProductForm({ ...productForm, status: e.target.value as ProductStatus })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2 py-1.5 text-xs text-stone-900"
                              >
                                <option value="Available">Available</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Pre-order">Pre-order</option>
                              </select>
                            </div>
                          </div>

                          {/* Batch & Expiration QR Tracking Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-emerald-950 flex items-center gap-1">
                                Available Items (Stock)
                              </label>
                              <input
                                type="number"
                                required
                                min={0}
                                value={productForm.availableItems ?? 50}
                                onChange={(e) => setProductForm({ ...productForm, availableItems: parseInt(e.target.value, 10) || 0 })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-emerald-950">Production Date</label>
                              <input
                                type="date"
                                required
                                value={productForm.productionDate || ""}
                                onChange={(e) => setProductForm({ ...productForm, productionDate: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-emerald-950">Expiration Date</label>
                              <input
                                type="date"
                                required
                                value={productForm.expirationDate || ""}
                                onChange={(e) => setProductForm({ ...productForm, expirationDate: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>
                          </div>

                          {/* Dynamic image upload helper */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700 block">Pasted Image URL</label>
                              <input
                                type="text"
                                value={productForm.image || ""}
                                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700 block text-emerald-900 font-bold">NATIVE IMAGE FILE UPLOAD</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0], (b64) => setProductForm({ ...productForm, image: b64 }));
                                  }
                                }}
                                className="w-full bg-stone-100 border border-stone-300 rounded-lg text-[10px] p-1"
                              />
                            </div>
                          </div>

                          {/* Batch Specification Tags */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-700 block">Substrate carrier & fruiting variables:</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={tempSpec}
                                onChange={(e) => setTempSpec(e.target.value)}
                                className="flex-grow bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs"
                                placeholder="e.g. Carrier: Organic Tunisian Barley"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (tempSpec.trim()) {
                                    const specs = [...(productForm.specifications || []), tempSpec.trim()];
                                    setProductForm({ ...productForm, specifications: specs });
                                    setTempSpec("");
                                  }
                                }}
                                className="px-3 bg-stone-900 text-white rounded-lg text-xs"
                              >
                                Add Tag
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {productForm.specifications?.map((spec, i) => (
                                <span key={i} className="px-2 py-0.5 bg-stone-200 text-stone-800 text-[10px] rounded-md font-light flex items-center gap-1">
                                  {spec}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = productForm.specifications?.filter((_, idx) => idx !== i);
                                      setProductForm({ ...productForm, specifications: filtered || [] });
                                    }}
                                    className="text-stone-500 hover:text-stone-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setProductForm({ name: undefined })}
                              className="px-4 py-1.5 border border-stone-300 rounded-lg text-xs"
                            >
                              Dismiss Form
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingProduct}
                              className="px-6 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                            >
                              {isSavingProduct ? "Processing..." : "Commit Save Product"}
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Current products listings list */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {products.map((item) => (
                          <div key={item.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md bg-stone-200 shrink-0" />
                              <div>
                                <h4 className="font-semibold text-xs text-stone-900">{item.name}</h4>
                                <span className="text-[9px] font-mono text-emerald-800 font-semibold">{item.category} | {item.price}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 animate-fade-in">
                              <button
                                onClick={() => {
                                  setSelectedQrProduct(item);
                                  setActivePage("qr");
                                }}
                                className="p-1 px-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <span>📬 QR Page</span>
                              </button>
                              <button
                                onClick={() => handleOpenProductEdit(item)}
                                className="p-1 px-2.5 border border-stone-200 bg-white rounded-md text-[10px] text-stone-700 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item.id)}
                                className="p-1 px-2 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Trash className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION: EDIT CONVERSATION SERVICES */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-stone-900">Manage Core Advisory Packages</h3>
                          <p className="text-xs text-stone-400">Edit design setup and workshop listings.</p>
                        </div>
                        <button
                          onClick={handleOpenServiceCreate}
                          className="flex items-center gap-1.2 px-3 py-1.5 bg-emerald-950 text-emerald-100 rounded-xl text-xs font-semibold tracking-wide hover:bg-emerald-900 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          New Service
                        </button>
                      </div>

                      {/* Service Form */}
                      {(serviceForm.name !== undefined && (serviceForm.id || editingService === null)) && (
                        <form onSubmit={handleSaveService} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                            <h4 className="text-xs font-bold text-stone-800 font-display">
                              {editingService ? "Edit Advisory Details" : "Add Advisory Setup Program"}
                            </h4>
                            <button type="button" onClick={() => setServiceForm({ name: undefined })} className="text-stone-400 text-xs font-bold">
                              Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Program Area *</label>
                              <input
                                type="text"
                                required
                                value={serviceForm.name || ""}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                                placeholder="Fruiting Tunnel Ventilation Layout"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Cycle Duration</label>
                              <input
                                type="text"
                                value={serviceForm.duration || ""}
                                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                                placeholder="3 - 5 Days Consulting"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700 block">Long Description</label>
                            <textarea
                              rows={2}
                              onFocus={() => setActiveTextareaFocus("service_desc")}
                              value={serviceForm.description || ""}
                              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                              className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-semibold text-stone-700">Image URL</label>
                              <input
                                type="text"
                                value={serviceForm.image || ""}
                                onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Pricing TND</label>
                              <input
                                type="text"
                                required
                                value={serviceForm.price || ""}
                                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                className="w-full bg-white border border-stone-250 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-700 block uppercase">NATIVE PICTURE FILE UPLOAD</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleImageUpload(e.target.files[0], (b64) => setServiceForm({ ...serviceForm, image: b64 }));
                                }
                              }}
                              className="w-full bg-stone-100 border border-stone-305 text-[10px] p-1 rounded"
                            />
                          </div>

                          {/* Benefits list editing */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-700 block">Deliverables/Benefits:</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={tempBenefit}
                                onChange={(e) => setTempBenefit(e.target.value)}
                                className="flex-grow bg-white border border-stone-250 rounded-lg px-2.5 py-1 text-xs"
                                placeholder="e.g. Laminar Flow Testing"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (tempBenefit.trim()) {
                                    const b = [...(serviceForm.benefits || []), tempBenefit.trim()];
                                    setServiceForm({ ...serviceForm, benefits: b });
                                    setTempBenefit("");
                                  }
                                }}
                                className="px-3 bg-stone-900 text-white rounded-lg text-xs"
                              >
                                Add Benefit
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {serviceForm.benefits?.map((ben, i) => (
                                <span key={i} className="px-2 py-0.5 bg-stone-200 text-stone-800 text-[10px] rounded-md font-light flex items-center gap-1">
                                  {ben}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = serviceForm.benefits?.filter((_, idx) => idx !== i);
                                      setServiceForm({ ...serviceForm, benefits: filtered || [] });
                                    }}
                                    className="text-stone-500 hover:text-stone-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button type="button" onClick={() => setServiceForm({ name: undefined })} className="px-4 py-1.5 border border-stone-300 rounded-lg text-xs">
                              Cancel
                            </button>
                            <button type="submit" disabled={isSavingService} className="px-6 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-semibold">
                              Save advisory pack
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Display current services */}
                      <div className="space-y-2">
                        {services.map((serv) => (
                          <div key={serv.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={serv.image} alt={localizedServiceName(serv)} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md bg-stone-200 shrink-0" />
                              <div>
                                <h4 className="font-semibold text-xs text-stone-900">{localizedServiceName(serv)}</h4>
                                <span className="text-[10px] text-stone-400 font-mono italic">{serv.duration} | {serv.price}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 text-[10px]">
                              <button onClick={() => handleOpenServiceEdit(serv)} className="p-1 px-2.5 border border-stone-200 bg-white rounded-md text-stone-700 font-semibold cursor-pointer">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteService(serv.id)} className="p-1 px-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-md cursor-pointer">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION: CONFIGURE SECURITY CREDENTIALS */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                      
                      {/* SUB-SECTION: ADMIN RECOVERY EMAIL */}
                      <div className="space-y-4">
                        <div className="border-b border-stone-100 pb-3">
                          <h3 className="font-display font-semibold text-lg text-stone-900 font-sans">Lab Administrator Security Mail</h3>
                          <p className="text-xs text-stone-400 font-light mt-0.5">Define your secure administrative mail address. This email will be used to dispatch secondary reset verification codes.</p>
                        </div>

                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                          {emailUpdateSuccess && (
                            <p className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono">
                              {emailUpdateSuccess}
                            </p>
                          )}
                          {emailUpdateError && (
                            <p className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-mono">
                              {emailUpdateError}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">Registered Email Address</label>
                              <input
                                type="email"
                                required
                                value={adminSecEmail}
                                onChange={(e) => setAdminSecEmail(e.target.value)}
                                className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs font-sans text-stone-800 focus:border-emerald-700 focus:outline-hidden"
                                placeholder="biotechagro.digital@gmail.com"
                              />
                            </div>
                            
                            <div className="self-end">
                              <button
                                type="submit"
                                disabled={isUpdatingSecEmail || !adminSecEmail.trim()}
                                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-900 text-stone-100 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                              >
                                {isUpdatingSecEmail ? "Saving mail config..." : "Update Security Mail"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* SUB-SECTION: CONFIGURE SECURITY PASSWORD */}
                      <div className="space-y-4 pt-4 border-t border-stone-150">
                        <div>
                          <h4 className="font-display font-semibold text-md text-stone-900">Console Passcode & Security Overrides</h4>
                          <p className="text-xs text-stone-450 font-light mt-0.5">
                            Update the system access passcode. Changing this passcode immediately disables the dynamic default sandbox logins.
                          </p>
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                            <span className="text-stone-400 font-light">Default Passcodes Status: </span>
                            {isSecDefaultPassword ? (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-mono text-[10px] font-bold">● fallback ACTIVE</span>
                            ) : (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-250 font-mono text-[10px] font-bold">● fallback DISABLED (HIGH SECURITY MODE)</span>
                            )}
                          </div>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                          {passwordChangeSuccess && (
                            <p className="p-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-mono">
                              {passwordChangeSuccess}
                            </p>
                          )}
                          {passwordChangeError && (
                            <p className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-mono">
                              {passwordChangeError}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-stone-700">New Password Code</label>
                              <input
                                type="password"
                                value={newAdminPassword}
                                onChange={(e) => setNewAdminPassword(e.target.value)}
                                className="w-full bg-[#fcfcf9] border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                                placeholder="Type complex characters"
                              />
                            </div>
                            
                            <div className="self-end">
                              <button
                                type="submit"
                                disabled={isPasswordUpdating || !newAdminPassword.trim()}
                                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-900 text-stone-100 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                              >
                                {isPasswordUpdating ? "Hashing with salt..." : "Update Security Code"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                    </div>

                  </div>

                  {/* Right grid: AI Assistant Sidebar */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-20 space-y-6">
                      
                      {/* Myco AI Assistant component wrapper */}
                      <MycoAssistant authToken={authToken} onResultAccepted={handleAcceptAICopy} />

                      <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-3.5">
                        <h4 className="font-display font-semibold text-stone-900 text-sm">Copy Target Tracker</h4>
                        <p className="text-[11px] text-stone-400 leading-normal font-light">To draft text via AI, select any text box in the editing decks. The active tracker target will lock onto that textbox, allowing immediate insertion when clicking <strong>"Use Copy"</strong>.</p>
                        
                        <div className="border border-stone-100 bg-stone-50 p-3 rounded-xl font-mono text-[10px] space-y-2">
                          <span className="text-stone-400 uppercase tracking-widest block text-[9px] font-bold">Active target textbox:</span>
                          <span className="text-emerald-800 font-bold block bg-emerald-50/50 p-1 rounded border border-emerald-100/50">
                            {activeTextareaFocus ? `Locked: ${activeTextareaFocus}` : "No locked target"}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* GLOBAL SUSTAINABLE FOOTER */}
      <Footer
        onNavigate={setActivePage}
        contactEmail={siteContent?.contactDetails.email}
        contactPhone={siteContent?.contactDetails.phone}
        contactAddress={siteContent?.contactDetails.address}
        logoUrl={siteContent?.logoUrl}
      />
      </div>

      {/* PRINT-ONLY SEAMLESS PURE QR BLOCK */}
      {selectedQrProduct && printableQrBase64 && (
        <div id="printable-qr-label-card">
          <img
            src={printableQrBase64}
            alt="Print QR Code"
          />
        </div>
      )}

    </div>
  );
}
