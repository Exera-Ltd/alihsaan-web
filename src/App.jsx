import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  Heart,
  Users,
  Globe,
  Home,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  ChevronDown,
  Shield,
  HandHeart,
  Stethoscope,
  HeartHandshake,
  Calendar,
  Award,
  Target,
  Eye,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Globe2,
  Medal,
  Crown,
  Diamond,
  Flame,
  ArrowUp,
  Smartphone,
  CreditCard,
  Clock
} from 'lucide-react';

// Get base URL from Vite
const BASE_URL = import.meta.env.BASE_URL;

// ============================================================================
// ORGANIZATION CONFIGURATION
// ============================================================================
const CONFIG = {
  organization: {
    name: "Al Ihsaan Charitable Foundation",
    shortName: "Al Ihsaan",
    arabicName: "مؤسسة الإحسان",
    registration: "FD 474",
    founded: 2006,
    registered: 2018,
    address: "115 Madad Ul Islam Street, Port Louis, Mauritius",
    phone: "+230 214-3392",
    hotline: "86249",
    email: "alihsaan.mu@gmail.com",
    facebook: "https://facebook.com/ALihsaanFoundation",
    appStoreUrl: "https://apps.apple.com/us/app/al-ihsaan/id1634406441",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.alihsaan&hl=en",
    mission: "Providing humanitarian relief aid to vulnerable communities in Mauritius and worldwide. Supporting refugees, widows, orphans, elderly, persecuted families, and those affected by poverty, conflict, and emergencies.",
    ihsaanMeaning: "Ihsaan is an Arabic term meaning beautification, perfection, and excellence. It represents showing inner faith through deed and action, with a sense of social responsibility borne from religious convictions.",
    hadith: {
      arabic: "مَنْ نَفَسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
      translation: "Whoever relieves a believer's distress in this world, Allah will relieve his distress on the Day of Resurrection.",
      reference: "Sahih Al-Bukhari, 2442"
    }
  },
  bank: {
    name: "MCB (Mauritius Commercial Bank)",
    accountName: "Al Ihsaan Charitable Foundation",
    accountNumber: "000 1234 5678 90",
    bankCode: "MCBL",
    swift: "MCBLMUMU",
    reference: "DONATION"
  },
  impact: {
    years: 18,
    countries: 50,
    livesImpacted: 10000,
    projects: 100,
    volunteers: 500,
    partners: 25
  },
  team: [
    {
      name: "Dr. Shakeel Anarath",
      role: "Founder & Chairman",
      description: "Leading humanitarian initiatives with vision and dedication since 2006",
      image: `${BASE_URL}assets/dr-shakeel-anarath.png`
    },
    {
      name: "Ajmal Hoossanbuksh",
      role: "Executive Director",
      description: "Driving operations and strategic partnerships for global impact",
      image: `${BASE_URL}assets/ajmal-hoossanbuksh.png`
    }
  ],
  navLinks: [
    { name: "Home", href: "#home" },
    { name: "Funerals", href: "#funerals" },
    { name: "About", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Impact", href: "#impact" },
    { name: "Team", href: "#team" },
    { name: "Stories", href: "#stories" },
    { name: "Gallery", href: "#gallery" }
  ],
  partners: [
    "UNHCR", "UNICEF", "Red Cross", "Islamic Relief", "Humanity First", "Muslim Aid"
  ]
};

// ============================================================================
// ANIMATION HOOK
// ============================================================================
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// ============================================================================
// ANIMATED COUNTER HOOK
// ============================================================================
const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start, isAnimating]);

  return [count, startAnimation];
};

// ============================================================================
// ISLAMIC DECORATIVE ELEMENTS
// ============================================================================
const IslamicDivider = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
    <div className="w-2 h-2 bg-amber-400 rounded-full" />
    <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
  </div>
);

// ============================================================================
// BANK DETAILS MODAL
// ============================================================================
const DummyQR = () => (
  <svg width="100" height="100" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
    {/* Top-left finder */}
    <rect x="0" y="0" width="7" height="7" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
    <rect x="1.5" y="1.5" width="4" height="4" fill="#1e293b"/>
    {/* Top-right finder */}
    <rect x="14" y="0" width="7" height="7" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
    <rect x="15.5" y="1.5" width="4" height="4" fill="#1e293b"/>
    {/* Bottom-left finder */}
    <rect x="0" y="14" width="7" height="7" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
    <rect x="1.5" y="15.5" width="4" height="4" fill="#1e293b"/>
    {/* Data modules */}
    <rect x="8" y="0" width="1" height="1" fill="#1e293b"/>
    <rect x="10" y="0" width="1" height="1" fill="#1e293b"/>
    <rect x="12" y="0" width="1" height="1" fill="#1e293b"/>
    <rect x="8" y="2" width="1" height="1" fill="#1e293b"/>
    <rect x="11" y="2" width="2" height="1" fill="#1e293b"/>
    <rect x="9" y="4" width="2" height="1" fill="#1e293b"/>
    <rect x="8" y="6" width="1" height="1" fill="#1e293b"/>
    <rect x="10" y="6" width="2" height="1" fill="#1e293b"/>
    <rect x="0" y="8" width="2" height="1" fill="#1e293b"/>
    <rect x="4" y="8" width="1" height="1" fill="#1e293b"/>
    <rect x="6" y="8" width="2" height="1" fill="#1e293b"/>
    <rect x="9" y="8" width="3" height="1" fill="#1e293b"/>
    <rect x="14" y="8" width="1" height="1" fill="#1e293b"/>
    <rect x="16" y="8" width="2" height="1" fill="#1e293b"/>
    <rect x="20" y="8" width="1" height="1" fill="#1e293b"/>
    <rect x="1" y="10" width="3" height="1" fill="#1e293b"/>
    <rect x="6" y="10" width="1" height="1" fill="#1e293b"/>
    <rect x="8" y="10" width="2" height="1" fill="#1e293b"/>
    <rect x="12" y="10" width="1" height="1" fill="#1e293b"/>
    <rect x="15" y="10" width="3" height="1" fill="#1e293b"/>
    <rect x="20" y="10" width="1" height="1" fill="#1e293b"/>
    <rect x="0" y="12" width="1" height="1" fill="#1e293b"/>
    <rect x="3" y="12" width="2" height="1" fill="#1e293b"/>
    <rect x="7" y="12" width="1" height="1" fill="#1e293b"/>
    <rect x="9" y="12" width="3" height="1" fill="#1e293b"/>
    <rect x="14" y="12" width="2" height="1" fill="#1e293b"/>
    <rect x="18" y="12" width="3" height="1" fill="#1e293b"/>
    <rect x="8" y="14" width="2" height="1" fill="#1e293b"/>
    <rect x="12" y="14" width="1" height="1" fill="#1e293b"/>
    <rect x="8" y="16" width="1" height="1" fill="#1e293b"/>
    <rect x="11" y="16" width="3" height="1" fill="#1e293b"/>
    <rect x="16" y="16" width="1" height="1" fill="#1e293b"/>
    <rect x="19" y="16" width="2" height="1" fill="#1e293b"/>
    <rect x="9" y="18" width="2" height="1" fill="#1e293b"/>
    <rect x="13" y="18" width="1" height="1" fill="#1e293b"/>
    <rect x="15" y="18" width="2" height="1" fill="#1e293b"/>
    <rect x="20" y="18" width="1" height="1" fill="#1e293b"/>
    <rect x="8" y="20" width="3" height="1" fill="#1e293b"/>
    <rect x="13" y="20" width="2" height="1" fill="#1e293b"/>
    <rect x="17" y="20" width="1" height="1" fill="#1e293b"/>
    <rect x="20" y="20" width="1" height="1" fill="#1e293b"/>
  </svg>
);

const BankDetailsModal = ({ isOpen, onClose, campaign }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <HandHeart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Make a Difference</h3>
              {campaign && <p className="text-emerald-100 text-xs mt-0.5 line-clamp-1">{campaign}</p>}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* QR Section */}
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Scan to Pay</p>
            <div className="inline-block p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
              <DummyQR />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">MCB Juice / MyT Money / Scan & Pay</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or bank transfer</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Bank Details */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">MCB Bank Details</span>
            </div>
            {[
              { label: "Bank", value: "Mauritius Commercial Bank" },
              { label: "Account Name", value: CONFIG.bank.accountName },
              { label: "Account No.", value: CONFIG.bank.accountNumber },
              { label: "SWIFT / BIC", value: CONFIG.bank.swift },
              { label: "Reference", value: CONFIG.bank.reference },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-slate-800 text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>

          {/* Hotline */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>Need help? Call our hotline:</span>
            <a href={`tel:${CONFIG.organization.hotline}`} className="text-emerald-600 font-semibold hover:underline">
              {CONFIG.organization.hotline}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// IMAGE LIGHTBOX MODAL
// ============================================================================
const ImageLightboxModal = ({ isOpen, onClose, src, alt }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/88 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt || 'Image'}
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

// ============================================================================
// CAMPAIGN CAROUSEL (for Hero section)
// ============================================================================
const CampaignCarousel = ({ onDonateClick }) => {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          fetch('https://alihsaan.com/api/v1/feed/featured'),
          fetch('https://alihsaan.com/api/v1/feed')
        ]);
        const featuredData = await featuredRes.json();
        const allData = await allRes.json();
        const featured = (featuredData.data || []).filter(i => i.image_en && !i.image_en.endsWith('/'));
        const all = (allData.data || []).filter(i => i.image_en && !i.image_en.endsWith('/'));
        // Featured first, then deduplicate
        const featuredIds = new Set(featured.map(i => i.id));
        const rest = all.filter(i => !featuredIds.has(i.id));
        setItems([...featured, ...rest]);
      } catch (e) {
        console.error('Failed to fetch campaigns:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const prev = () => {
    clearInterval(timerRef.current);
    setCurrent(c => (c - 1 + items.length) % items.length);
  };
  const next = () => {
    clearInterval(timerRef.current);
    setCurrent(c => (c + 1) % items.length);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[3/4] max-h-[560px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!items.length) return null;

  const item = items[current];

  return (
    <>
    <div className="relative w-full">
      {/* Main Image — tap to enlarge */}
      <div
        className="relative aspect-[3/4] max-h-[560px] overflow-hidden rounded-2xl cursor-pointer group shadow-2xl shadow-emerald-200/50"
        onClick={() => { setLightboxSrc(item.image_en); setLightboxOpen(true); }}
      >
        <img
          src={item.image_en}
          alt={item.title_en}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        {/* Featured badge */}
        {item.featured === "1" && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-xs text-white font-semibold shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {/* Title */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <p className="text-white font-semibold text-sm leading-tight">{item.title_en}</p>
        </div>
        {/* Donate button — separate click, stops propagation */}
        <button
          onClick={(e) => { e.stopPropagation(); onDonateClick(item.title_en); }}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 rounded-xl text-sm text-white font-semibold shadow-lg transition-all duration-300"
        >
          <Heart className="w-4 h-4" />
          Donate Now
        </button>
      </div>

      {/* Nav arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {/* Dots */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-4 h-1.5 bg-emerald-500' : 'w-1.5 h-1.5 bg-slate-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
    <ImageLightboxModal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} src={lightboxSrc} alt={item.title_en} />
    </>
  );
};

// ============================================================================
// APP DOWNLOAD SECTION
// ============================================================================
const AppDownloadSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`py-8 sm:py-10 bg-gradient-to-r from-emerald-700 to-teal-700 relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="container-custom relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">Download the Al Ihsaan App</h3>
              <p className="text-emerald-100 text-sm">Stay connected — funerals, campaigns & updates in one place.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={CONFIG.organization.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-lg group"
            >
              <svg className="w-6 h-6 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">Download on the</div>
                <div className="text-sm font-bold text-slate-800 leading-tight">App Store</div>
              </div>
            </a>
            <a
              href={CONFIG.organization.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-lg group"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76C2.5 23.38 2 22.64 2 21.75V2.25C2 1.36 2.5.62 3.18.24l11.4 11.76-11.4 11.76z" fill="#EA4335"/>
                <path d="M20.82 12l-3.55 3.66L14.58 12l2.69-2.76L20.82 12z" fill="#FBBC05"/>
                <path d="M3.18.24l14.09 7.27L14.58 12 3.18.24z" fill="#4285F4"/>
                <path d="M3.18 23.76l11.4-11.76 2.69 2.76-14.09 7.27.0 1.73z" fill="#34A853"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">Get it on</div>
                <div className="text-sm font-bold text-slate-800 leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = CONFIG.navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.offsetTop - 100 <= window.scrollY) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <div className="relative">
              <img
                src={`${BASE_URL}assets/logo.png`}
                alt={CONFIG.organization.name}
                className="h-10 sm:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-md"
                style={{ filter: 'drop-shadow(0 0 8px rgba(5, 150, 105, 0.2))' }}
              />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg text-emerald-800 leading-tight">
                {CONFIG.organization.shortName}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-600 font-medium hidden sm:block">
                {CONFIG.organization.arabicName}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {CONFIG.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-emerald-700'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                {link.name}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" />
                )}
              </a>
            ))}
            <div className="ml-4 flex items-center gap-3">
              <a
                href="#donate"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#donate');
                }}
                className="btn-primary text-sm"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-emerald-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <div className="bg-emerald-50 rounded-2xl p-3 mt-2 space-y-1 border border-emerald-100">
            {CONFIG.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`block py-3 px-4 rounded-xl transition-colors text-sm ${
                  activeSection === link.href.slice(1)
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#donate"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#donate');
              }}
              className="btn-primary w-full mt-3 text-sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// HERO SECTION
// ============================================================================
const HeroSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState('');

  const openModal = (campaign) => {
    setModalCampaign(campaign);
    setModalOpen(true);
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden islamic-pattern"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
        <div className="absolute top-20 right-10 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-float-subtle" />
        <div className="absolute bottom-20 left-10 sm:left-20 w-56 sm:w-80 h-56 sm:h-80 bg-amber-100 rounded-full blur-3xl opacity-40 animate-float-subtle" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom px-4 pt-20 sm:pt-24 pb-12">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* TOP: centered — badge + hadith + divider */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 bg-white rounded-full shadow-lg border border-emerald-100 mb-5 sm:mb-6">
              <Crown className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-slate-600 text-xs sm:text-sm font-medium">
                Serving Humanity Since {CONFIG.organization.founded}
              </span>
              <div className="ml-2 sm:ml-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-xs text-emerald-600 font-medium">Active</span>
              </div>
            </div>
            <div className="max-w-2xl mx-auto mb-5 sm:mb-6">
              <p className="text-lg sm:text-xl md:text-2xl text-amber-600 font-serif mb-3 leading-relaxed" dir="rtl">
                {CONFIG.organization.hadith.arabic}
              </p>
              <p className="text-sm sm:text-base text-slate-600 italic mb-2">
                "{CONFIG.organization.hadith.translation}"
              </p>
              <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                — {CONFIG.organization.hadith.reference}
              </p>
            </div>
            <IslamicDivider />
          </div>

          {/* BOTTOM: two columns — headline left, carousel right */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Left: headline + subtitle + CTAs + trust */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
                Transforming Lives Through
                <br />
                <span className="gradient-text">Compassion & Service</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
                {CONFIG.organization.mission}
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10">
                <a
                  href="#donate"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#donate')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-gold text-base sm:text-lg group w-full sm:w-auto"
                >
                  <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Make a Difference Now
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#about"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-secondary text-base sm:text-lg w-full sm:w-auto"
                >
                  Discover Our Mission
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {[
                  { icon: Shield, text: "Charitable Foundation", sub: CONFIG.organization.registration },
                  { icon: Globe2, text: "Global Reach", sub: "50+ Countries" },
                  { icon: Award, text: "Since", sub: "2006" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] sm:text-xs text-slate-500">{item.text}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Campaign Carousel (bigger) */}
            <div className="w-full lg:w-[440px] xl:w-[520px] flex-shrink-0 pb-8">
              <CampaignCarousel onDonateClick={openModal} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-slate-400">
          <span className="text-[10px] sm:text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 animate-bounce" />
        </div>
      </div>

      <BankDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} campaign={modalCampaign} />
    </section>
  );
};

// ============================================================================
// ABOUT SECTION
// ============================================================================
const AboutSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const credentials = [
    { icon: Shield, text: `Registered Charitable Foundation (${CONFIG.organization.registration})` },
    { icon: Calendar, text: `Established in ${CONFIG.organization.founded}` },
    { icon: Award, text: `Officially registered in ${CONFIG.organization.registered}` },
    { icon: Globe, text: "International humanitarian reach" }
  ];

  return (
    <section id="about" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-dense opacity-50" />

      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-10 sm:gap-16 items-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-3">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-amber-500" />
              About Our Foundation
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-5 leading-tight">
              Our Mission is to
              <span className="gradient-text"> Serve Humanity</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              {CONFIG.organization.mission}
            </p>

            {/* What is Ihsaan */}
            <div className="card-premium p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-amber-100 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mr-3 sm:mr-4 shadow-lg shadow-amber-200">
                    <Star className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-800">
                      What is "Ihsaan"?
                    </h3>
                    <p className="text-amber-600 text-xs sm:text-sm">{CONFIG.organization.arabicName}</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base italic">
                  "{CONFIG.organization.ihsaanMeaning}"
                </p>
              </div>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {credentials.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                >
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <span className="text-slate-700 text-xs sm:text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Mission Box */}
          <div className="relative mt-8 lg:mt-0">
            <div className="card-premium p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

              {/* Mission */}
              <div className="relative mb-6 sm:mb-8">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-emerald-200">
                  <Target className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  To serve humanity with compassion and excellence, providing relief to those in need regardless of race, religion, or background.
                </p>
              </div>

              <IslamicDivider className="my-4 sm:my-6" />

              {/* Vision */}
              <div className="relative">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-amber-200">
                  <Eye className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  A world where every individual has access to basic necessities and the opportunity to live with dignity.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 w-16 sm:w-24 h-16 sm:h-24 border-2 border-amber-200 rounded-xl sm:rounded-2xl -z-10" />
            <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-12 sm:w-16 h-12 sm:h-16 border-2 border-emerald-200 rounded-lg sm:rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PROGRAMS SECTION
// ============================================================================
const ProgramsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const programs = [
    {
      icon: Globe,
      emoji: "🌍",
      title: "Humanitarian Relief",
      description: "Emergency aid for refugees, displaced families, and victims of conflict and natural disasters worldwide.",
      color: "from-emerald-500 to-teal-500",
      stats: "50+ Countries"
    },
    {
      icon: Home,
      emoji: "🏠",
      title: "Family Support",
      description: "Comprehensive assistance for widows, orphans, and vulnerable families to rebuild their lives.",
      color: "from-blue-500 to-indigo-500",
      stats: "1000+ Families"
    },
    {
      icon: Stethoscope,
      emoji: "🏥",
      title: "Health & Welfare",
      description: "Medical care, health emergencies support, and welfare services for the elderly and sick.",
      color: "from-rose-500 to-pink-500",
      stats: "500+ Patients"
    },
    {
      icon: HeartHandshake,
      emoji: "🤲",
      title: "Funeral Services",
      description: "Dignified funeral services and bereavement support for families in their time of need.",
      color: "from-amber-500 to-orange-500",
      stats: "24/7 Support"
    }
  ];

  return (
    <section id="programs" className="section-padding bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm border border-emerald-100">
            <Diamond className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-amber-500" />
            Our Programs
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            What We <span className="gradient-text">Do</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            We operate across four core program areas, each designed to address critical needs in our communities.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`card p-5 sm:p-6 h-full relative overflow-hidden transition-all duration-500 ${
                hoveredIndex === index ? 'shadow-2xl -translate-y-2' : ''
              }`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${program.color}`} />

                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-xl sm:text-2xl">{program.emoji}</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">
                  {program.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {program.description}
                </p>

                <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 rounded-full text-[10px] sm:text-xs text-slate-600 font-medium">
                  <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                  {program.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// IMPACT SECTION
// ============================================================================
const ImpactSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const stats = [
    { icon: Calendar, value: 18, suffix: '+', label: 'Years of Service', color: 'from-emerald-500 to-teal-500' },
    { icon: Globe, value: 50, suffix: '+', label: 'Countries Reached', color: 'from-blue-500 to-indigo-500' },
    { icon: Heart, value: 1000000, suffix: '+', label: 'Lives Impacted', color: 'from-rose-500 to-pink-500' },
    { icon: Award, value: 10000, suffix: '+', label: 'Projects Completed', color: 'from-amber-500 to-orange-500' }
  ];

  return (
    <section id="impact" className="section-padding bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Medal className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-amber-400" />
            Our Global Impact
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Making a <span className="text-amber-400">Real Difference</span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/80 px-4">
            Since our founding, we've touched countless lives through our humanitarian programs worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Partners Section */}
        <div className="mt-12 sm:mt-20 text-center">
          <p className="text-emerald-200/60 text-xs sm:text-sm mb-6 sm:mb-8">Trusted by leading organizations worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {CONFIG.partners.map((partner, index) => (
              <div
                key={index}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 text-white/60 font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ stat, index, isVisible }) => {
  const [count, startAnimation] = useCountUp(stat.value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      startAnimation();
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated, startAnimation]);

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center border border-white/10 hover:bg-white/15 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
        <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
      </div>

      <div className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">
        {count >= 1000000 ? `${(count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1)}M` : count.toLocaleString()}{stat.suffix}
      </div>

      <div className="text-emerald-200/60 text-[10px] sm:text-xs lg:text-sm">{stat.label}</div>
    </div>
  );
};

// ============================================================================
// TEAM SECTION
// ============================================================================
const TeamSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="team" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-dense opacity-30" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Users className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Our Leadership
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            Dedicated professionals committed to our mission of serving humanity with excellence.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {CONFIG.team.map((member, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="card-premium p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

                {/* Avatar */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl">{member.emoji}</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-[10px] sm:text-xs text-white font-medium shadow-lg whitespace-nowrap">
                    {member.role.split(' ')[0]}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-800 mb-1 sm:mb-2 mt-4">
                  {member.name}
                </h3>
                <p className="text-emerald-600 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">{member.role}</p>
                <p className="text-slate-500 text-xs sm:text-sm">{member.description}</p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 mt-4 sm:mt-6">
                  <a href="#" className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                    <Linkedin className="w-3 sm:w-4 h-3 sm:h-4" />
                  </a>
                  <a href="#" className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                    <Mail className="w-3 sm:w-4 h-3 sm:h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// STORIES SECTION
// ============================================================================
const StoriesSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const stories = [
    {
      image: `${BASE_URL}assets/projects/project-1.png`,
      title: "Bangladesh Relief 2017",
      excerpt: "Providing critical support to Rohingya refugees fleeing persecution, delivering food, shelter, and medical aid.",
      category: "Emergency Relief",
      color: "from-emerald-500 to-teal-500"
    },
    {
      image: `${BASE_URL}assets/projects/project-2.png`,
      title: "Orphan Support Program",
      excerpt: "Ongoing sponsorship program providing education, healthcare, and daily necessities to orphaned children.",
      category: "Family Support",
      color: "from-blue-500 to-indigo-500"
    },
    {
      image: `${BASE_URL}assets/projects/project-3.png`,
      title: "Emergency Response",
      excerpt: "Rapid response to natural disasters and emergencies, providing immediate relief and long-term recovery support.",
      category: "Humanitarian",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <section id="stories" className="section-padding bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm border border-emerald-100">
            <Flame className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-amber-500" />
            Impact Stories
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            Stories of <span className="gradient-text-gold">Hope</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            Real stories from the communities we serve and the lives we've touched together.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story, index) => (
            <article
              key={index}
              className={`group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="card overflow-hidden">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className={`px-2.5 sm:px-3 py-1 bg-gradient-to-r ${story.color} rounded-full text-[10px] sm:text-xs text-white font-medium shadow-lg`}>
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center text-emerald-600 font-medium text-xs sm:text-sm hover:text-emerald-700 transition-colors group/link"
                  >
                    Read Full Story
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// GALLERY SECTION — tap to show bank details modal
// ============================================================================
const GallerySection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState('');

  const galleryImages = [
    { src: `${BASE_URL}assets/projects/project-1.png`, alt: "Humanitarian Aid Distribution" },
    { src: `${BASE_URL}assets/projects/project-2.png`, alt: "Community Support Program" },
    { src: `${BASE_URL}assets/projects/project-3.png`, alt: "Emergency Relief" },
    { src: `${BASE_URL}assets/projects/project-4.png`, alt: "Orphan Support" },
    { src: `${BASE_URL}assets/projects/project-5.png`, alt: "Medical Assistance" },
    { src: `${BASE_URL}assets/projects/project-1.png`, alt: "Food Distribution" }
  ];

  return (
    <section id="gallery" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-dense opacity-20" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 rounded-full text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-amber-500" />
            Photo Gallery
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            Our Work in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            Tap any photo to support this cause — every contribution makes a difference.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => {
                setModalCampaign(image.alt);
                setModalOpen(true);
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <p className="text-white font-medium text-xs sm:text-sm mb-2">{image.alt}</p>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400/90 rounded-full text-[10px] text-white font-medium">
                    <HandHeart className="w-3 h-3" />
                    Tap to donate
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-400 rounded-xl sm:rounded-2xl transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      <BankDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} campaign={modalCampaign} />
    </section>
  );
};

// ============================================================================
// DONATION CTA SECTION
// ============================================================================
const DonationCTA = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="donate"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700" />
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400/10 rounded-full blur-3xl" />

      <div
        className={`container-custom relative z-10 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Arabic Text */}
        <p className="text-lg sm:text-xl md:text-2xl text-amber-300 mb-4 sm:mb-6">جزاكم الله خيرا</p>

        {/* Icon */}
        <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <HandHeart className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
          Make a <span className="text-amber-300">Difference</span> Today
        </h2>
        <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
          Your generosity can transform lives. Every contribution, no matter the size,
          helps us continue our mission of serving those in need.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          <button
            onClick={() => setModalOpen(true)}
            className="btn-gold text-base sm:text-lg group w-full sm:w-auto"
          >
            <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Make a Difference Now
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="relative w-full sm:w-auto">
            <button
              disabled
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white/50 font-semibold rounded-full border border-white/20 cursor-not-allowed text-base sm:text-lg w-full sm:w-auto"
            >
              <Users className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Become a Volunteer
            </button>
            <span className="absolute -top-2.5 -right-2 px-2 py-0.5 bg-amber-400 rounded-full text-[10px] font-bold text-white shadow-sm whitespace-nowrap">
              Under Process
            </span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {[
            { icon: Shield, text: "Secure Donations" },
            { icon: Award, text: "Registered Charitable Foundation" }
          ].map((item, index) => (
            <div key={index} className="flex items-center text-emerald-100/80 text-xs sm:text-sm">
              <item.icon className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-amber-400" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <BankDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} campaign="General Donation" />
    </section>
  );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Impact", href: "#impact" },
    { name: "Gallery", href: "#gallery" }
  ];

  const getInvolved = [
    { name: "Donate", href: "#donate" },
    { name: "Volunteer", href: "#", badge: "Under Process" },
    { name: "Partner With Us", href: "#" },
    { name: "Fundraise", href: "#" },
    { name: "Subscribe to Broadcast", href: "#", badge: "Coming Soon" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-900">
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

      <div className="container-custom section-padding pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <img
                src={`${BASE_URL}assets/logo.png`}
                alt={CONFIG.organization.name}
                className="h-8 sm:h-10 w-auto object-contain brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' }}
              />
              <div>
                <span className="font-serif font-bold text-base sm:text-lg text-white block">
                  {CONFIG.organization.shortName}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-400">
                  {CONFIG.organization.arabicName}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              {CONFIG.organization.mission.slice(0, 120)}...
            </p>
            {/* App Download links */}
            <div className="flex flex-col gap-2 mb-4">
              <a href={CONFIG.organization.appStoreUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm">
                <Smartphone className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                Download on App Store
              </a>
              <a href={CONFIG.organization.playStoreUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm">
                <Smartphone className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                Get it on Google Play
              </a>
            </div>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: CONFIG.organization.facebook },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-base sm:text-lg text-white mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-serif font-semibold text-base sm:text-lg text-white mb-4 sm:mb-6">Get Involved</h4>
            <ul className="space-y-2 sm:space-y-3">
              {getInvolved.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 flex-shrink-0" />
                    {link.name}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[9px] font-semibold border border-amber-500/30">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-base sm:text-lg text-white mb-4 sm:mb-6">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-xs sm:text-sm">
                  {CONFIG.organization.address}
                </span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-400" />
                </div>
                <a
                  href={`tel:${CONFIG.organization.phone}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm"
                >
                  {CONFIG.organization.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Hotline</span>
                  <a
                    href={`tel:${CONFIG.organization.hotline}`}
                    className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-bold"
                  >
                    {CONFIG.organization.hotline}
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-400" />
                </div>
                <a
                  href={`mailto:${CONFIG.organization.email}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm"
                >
                  {CONFIG.organization.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-slate-500 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {CONFIG.organization.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-slate-500 text-xs sm:text-sm">
                Registered Charitable Foundation No: {CONFIG.organization.registration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// FUNERAL ANNOUNCEMENTS SECTION — one-liner carousel, today only
// ============================================================================
const FuneralPostersSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [funerals, setFunerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchFunerals = async () => {
      try {
        const response = await fetch('https://alihsaan.com/api/v1/funerals/approved');
        const data = await response.json();
        if (data.result && data.records) {
          const today = new Date().toISOString().split('T')[0];
          const todayFunerals = data.records.filter(record =>
            record.dateOfFuneral && record.dateOfFuneral.startsWith(today)
          );
          setFunerals(todayFunerals);
        }
      } catch (err) {
        console.error('Failed to fetch funerals:', err);
        setError('Unable to load funeral information');
      } finally {
        setLoading(false);
      }
    };

    fetchFunerals();
    // Refresh every 60 seconds
    const interval = setInterval(fetchFunerals, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -256, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 256, behavior: 'smooth' });

  return (
    <section id="funerals" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 rounded-full text-amber-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-amber-200">
            <HeartHandshake className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Funeral Announcements
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            Daily <span className="gradient-text-gold">Funeral</span> Announcements
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            Providing dignified funeral services and support for families in their time of need.
          </p>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-slate-500">{error}</div>
        ) : funerals.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="text-slate-600 text-sm font-medium">No funeral announcements for today.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll buttons */}
            {funerals.length > 2 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Horizontal scroll strip — big poster images with overlay */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {funerals.map((funeral, index) => (
                <div
                  key={funeral.id || index}
                  className={`flex-shrink-0 w-52 sm:w-60 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <button
                    onClick={() => { setLightboxSrc(funeral.file_name); setLightboxOpen(true); }}
                    className="block w-full relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    {/* Full poster image — natural size, no crop */}
                    {funeral.file_name ? (
                      <img
                        src={funeral.file_name}
                        alt={`Funeral poster for ${funeral.fullNameOfDeceased}`}
                        className="w-full block group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gradient-to-br from-emerald-100 to-slate-100 flex items-center justify-center">
                        <HeartHandshake className="w-14 h-14 text-emerald-300" />
                      </div>
                    )}

                    {/* Gradient overlay — always visible at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/10 to-transparent pointer-events-none" />

                    {/* Service type badge */}
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="px-2.5 py-1 bg-emerald-500/85 backdrop-blur-sm rounded-full text-[10px] text-white font-semibold">
                        {funeral.serviceTypeName || 'Full Services'}
                      </span>
                    </div>

                    {/* Details overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                      <p className="text-white font-semibold text-sm leading-tight mb-1.5">
                        {funeral.fullNameOfDeceased}
                      </p>
                      <p className="text-white/80 text-xs flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {formatTime(funeral.dateOfFuneral)}
                        {funeral.janazaPrayerLocation && (
                          <span className="truncate"> · {funeral.janazaPrayerLocation}</span>
                        )}
                      </p>
                      {funeral.funeralAddress && (
                        <p className="text-white/70 text-xs flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {funeral.funeralAddress}
                        </p>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            Funeral hotline:{' '}
            <a href={`tel:${CONFIG.organization.hotline}`} className="text-amber-600 font-semibold hover:underline">
              {CONFIG.organization.hotline}
            </a>
            {' '}·{' '}
            <a href={`tel:${CONFIG.organization.phone}`} className="text-emerald-600 hover:underline">
              {CONFIG.organization.phone}
            </a>
          </p>
        </div>
      </div>
      <ImageLightboxModal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} src={lightboxSrc} alt="Funeral Poster" />
    </section>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ScrollToTopButton />
      <main>
        <HeroSection />
        <AppDownloadSection />
        <FuneralPostersSection />
        <AboutSection />
        <ProgramsSection />
        <ImpactSection />
        <TeamSection />
        <StoriesSection />
        <GallerySection />
        <DonationCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
