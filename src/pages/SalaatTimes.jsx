import { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Bell,
  Play,
  Pause,
  Loader2,
  SunDim
} from 'lucide-react';

// Get base URL from Vite
const BASE_URL = import.meta.env.BASE_URL;

// Google Sheet CSV URL - Replace with your published sheet URL
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || null;

// Default fallback prayer times
const DEFAULT_PRAYERS = [
  { id: 'fajr', name: 'Fajr', arabicName: 'fajr', time: '04:45' },
  { id: 'sunrise', name: 'Sunrise', arabicName: 'shurooq', time: '05:58' },
  { id: 'dhuhr', name: 'Dhuhr', arabicName: 'dhuhr', time: '12:15' },
  { id: 'asr', name: 'Asr', arabicName: 'asr', time: '15:45' },
  { id: 'maghrib', name: 'Maghrib', arabicName: 'maghrib', time: '18:22' },
  { id: 'isha', name: 'Isha', arabicName: 'isha', time: '19:35' }
];

// Default fallback slides
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'MASJID AL IHSAAN',
    subtitle: 'Serving Humanity Since 2006',
    imageUrl: '',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500'
  }
];

// Parse CSV data from Google Sheets
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const data = {
    prayers: [],
    slides: []
  };
  
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section markers
    if (line.toLowerCase().startsWith('#prayers')) {
      currentSection = 'prayers';
      continue;
    }
    if (line.toLowerCase().startsWith('#slides')) {
      currentSection = 'slides';
      continue;
    }
    
    // Skip empty lines or header rows (case-insensitive)
    if (!line || line.toLowerCase().startsWith('id,') || line.toLowerCase().startsWith('"id')) {
      continue;
    }
    
    const cols = parseCSVLine(line);
    
    if (currentSection === 'prayers' && cols.length >= 4) {
      const id = cols[0].trim().toLowerCase();
      // Skip if id is 'id' (header row)
      if (id === 'id') continue;
      data.prayers.push({
        id: id,
        name: cols[1].trim(),
        arabicName: cols[2].trim(),
        time: cols[3].trim()
      });
    } else if (currentSection === 'slides' && cols.length >= 4) {
      const id = cols[0].trim();
      // Skip if id is 'id' (header row)
      if (id.toLowerCase() === 'id') continue;
      data.slides.push({
        id: id,
        title: cols[1].trim(),
        subtitle: cols[2].trim(),
        imageUrl: cols[3].trim(),
        gradient: cols.length > 4 ? cols[4].trim() : 'from-emerald-600 via-teal-500 to-cyan-500'
      });
    }
  }
  
  return data;
};

// Parse CSV line handling quoted fields
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
};

// ============================================================================
// MAIN SALAAT TIMES COMPONENT
// ============================================================================
const SalaatTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerData, setPrayerData] = useState(null);
  const [funeralSlides, setFuneralSlides] = useState([]);
  const [googleSlides, setGoogleSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Combined slides: Mayyat first, then Google Sheet slides
  const slides = [...funeralSlides, ...googleSlides];

  // Load prayer times and slides
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch funeral (mayyat) data from API
        try {
          const funeralResponse = await fetch('https://alihsaan.com/api/v1/funerals/approved');
          if (funeralResponse.ok) {
            const funeralData = await funeralResponse.json();
            if (funeralData.result && funeralData.records) {
              // Get today's funerals first, then all approved
              const today = new Date().toISOString().split('T')[0];
              const todayFunerals = funeralData.records.filter(record => 
                record.dateOfFuneral && record.dateOfFuneral.startsWith(today)
              );
              const funeralsToShow = todayFunerals.length > 0 ? todayFunerals : funeralData.records;
              
              // Convert funeral records to slides
              const funeralSlideData = funeralsToShow
                .filter(f => f.file_name)
                .map((funeral, index) => ({
                  id: `funeral-${funeral.id || index}`,
                  title: funeral.fullNameOfDeceased || 'Janaza',
                  subtitle: funeral.dateOfFuneral 
                    ? `${new Date(funeral.dateOfFuneral).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`
                    : 'Funeral Service',
                  imageUrl: funeral.file_name,
                  gradient: 'from-slate-700 via-slate-600 to-slate-800',
                  isFuneral: true,
                  details: funeral
                }));
              setFuneralSlides(funeralSlideData);
            }
          }
        } catch (err) {
          console.error('Failed to fetch funerals:', err);
        }

        // Try Google Sheets/Apps Script for prayer times and additional slides
        if (GOOGLE_SHEET_URL) {
          const response = await fetch(GOOGLE_SHEET_URL);
          if (response.ok) {
            const text = await response.text();
            
            // Check if response is JSON (from Apps Script) or CSV (from Sheets)
            let data;
            if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
              // JSON response from Apps Script
              data = JSON.parse(text);
            } else {
              // CSV response from Google Sheets
              data = parseCSV(text);
            }
            
            if (data.prayers && data.prayers.length > 0) {
              setPrayerData({
                mosque: { name: "Al-Ihsaan Foundation", location: "Port Louis, Mauritius" },
                prayers: data.prayers
              });
            }
            if (data.slides && data.slides.length > 0) {
              setGoogleSlides(data.slides);
            }
            
            if (data.prayers && data.prayers.length > 0) {
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to local JSON
        const response = await fetch(`${BASE_URL}prayer-times.json`);
        if (response.ok) {
          const data = await response.json();
          setPrayerData(data);
          if (data.slides) {
            setGoogleSlides(data.slides);
          }
        } else {
          // Use hardcoded defaults
          setPrayerData({
            mosque: { name: "Al-Ihsaan Foundation", location: "Port Louis, Mauritius" },
            prayers: DEFAULT_PRAYERS
          });
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setPrayerData({
          mosque: { name: "Al-Ihsaan Foundation", location: "Port Louis, Mauritius" },
          prayers: DEFAULT_PRAYERS
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find next prayer
  useEffect(() => {
    if (!prayerData) return;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayerMinutes = prayerData.prayers.map(p => {
      const [h, m] = p.time.split(':').map(Number);
      return h * 60 + m;
    });

    for (let i = 0; i < prayerMinutes.length; i++) {
      if (prayerMinutes[i] > currentMinutes) {
        setNextPrayer({ ...prayerData.prayers[i], index: i });
        return;
      }
    }
    setNextPrayer({ ...prayerData.prayers[0], index: 0 });
  }, [currentTime, prayerData]);

  // Countdown timer
  useEffect(() => {
    if (!nextPrayer) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const [hours, minutes] = nextPrayer.time.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nextPrayer]);

  // Auto-slide
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [isPlaying, slides.length]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Theme classes
  const theme = {
    bg: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900' 
      : 'bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    textMuted: isDarkMode ? 'text-white/60' : 'text-slate-500',
    card: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200',
    cardAlt: isDarkMode ? 'bg-white/10' : 'bg-emerald-50',
    cardHighlight: isDarkMode ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-400',
    accent: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
    accentBg: isDarkMode ? 'bg-white/10' : 'bg-emerald-100',
    glow: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/5',
  };

  // Loading state
  if (loading) {
    return (
      <div className={`h-screen w-screen flex items-center justify-center ${theme.bg}`}>
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const prayers = prayerData?.prayers || DEFAULT_PRAYERS;
  const mosque = prayerData?.mosque || { name: "Al-Ihsaan Foundation", location: "Port Louis, Mauritius" };

  return (
    <div className={`h-screen w-screen overflow-hidden ${theme.bg}`}>
      {/* Background Pattern */}
      <div className={`fixed inset-0 ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Decorative Glows */}
      <div className={`fixed top-0 left-1/4 w-[600px] h-[600px] ${theme.glow} rounded-full blur-3xl pointer-events-none`} />
      <div className={`fixed bottom-0 right-1/4 w-[600px] h-[600px] ${theme.glow} rounded-full blur-3xl pointer-events-none`} />

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isDarkMode 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
        }`}
      >
        {isDarkMode ? <SunDim className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Content - Responsive Layout - Optimized for 960x540 */}
      <div className="relative h-full flex flex-col md:flex-row">
        
        {/* LEFT SECTION - Time & Prayer Info */}
        <div className="w-full md:w-[55%] h-full flex flex-col justify-center px-3 py-3 md:px-5 md:py-4">
          
          {/* Header with Logo - Compact */}
          <div className={`backdrop-blur-xl rounded-xl p-3 md:p-4 border mb-2 md:mb-3 ${theme.card}`}>
            <div className="flex items-center gap-3">
              <img
                src={`${BASE_URL}assets/al-ihsaan-logo.webp`}
                alt="Al-Ihsaan Foundation"
                className="h-12 md:h-16 w-auto drop-shadow-lg"
              />
              <div className="flex-1 text-center">
                <h1 className={`text-lg md:text-xl font-bold mb-0.5 ${theme.text}`}>MASJID AL-IHSAAN</h1>
                <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Islamic Help Reaching People in Need</p>
                <div className={`flex items-center justify-center gap-1.5 text-[10px] md:text-xs ${theme.textMuted}`}>
                  <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span>{mosque.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Time & Next Prayer - Same Row */}
          <div className="flex gap-2 md:gap-3 mb-2 md:mb-3">
            {/* Current Time */}
            <div className={`flex-1 backdrop-blur-xl rounded-xl p-2.5 md:p-3 border ${theme.card}`}>
              <div className={`flex items-center gap-1.5 mb-0.5 ${theme.accent}`}>
                <Clock className="w-3 h-3" />
                <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Current Time</span>
              </div>
              <div className={`text-lg md:text-xl font-bold tracking-tight ${theme.text}`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-[10px] md:text-xs mt-0.5 ${theme.textMuted}`}>
                {formatDate(currentTime)}
              </div>
            </div>

            {/* Next Prayer Countdown */}
            {nextPrayer && (
              <div className={`flex-1 backdrop-blur-xl rounded-xl p-2.5 md:p-3 border ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/40' 
                  : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    <Bell className="w-3 h-3" />
                    <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Next</span>
                  </div>
                  <span className={`font-bold text-sm md:text-base ${theme.text}`}>{nextPrayer.name}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[
                    { value: timeLeft.hours, label: 'H' },
                    { value: timeLeft.minutes, label: 'M' },
                    { value: timeLeft.seconds, label: 'S' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-0.5">
                      <div className={`rounded-md px-1.5 py-0.5 md:px-2 md:py-1 min-w-[32px] md:min-w-[38px] text-center ${
                        isDarkMode ? 'bg-white/15' : 'bg-white/80'
                      }`}>
                        <span className={`text-sm md:text-base font-bold ${theme.text}`}>
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      {index < 2 && <span className={`text-xs md:text-sm font-bold ${theme.accent}`}>:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prayer Times Grid - 2 columns x 3 rows - MAIN FOCUS */}
          <div className={`backdrop-blur-xl rounded-xl p-2.5 md:p-3 border flex-1 md:flex-none ${theme.card}`}>
            <div className={`flex items-center gap-1.5 mb-2 px-1 ${theme.accent}`}>
              <Star className="w-3 h-3" />
              <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Today's Prayer Times</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2">
              {prayers.filter(p => p && p.id && p.name && p.time).map((prayer) => {
                const Icon = prayer.id === 'fajr' || prayer.id === 'isha' ? Moon :
                           prayer.id === 'sunrise' ? Sunrise :
                           prayer.id === 'maghrib' ? Sunset : Sun;
                const isNext = nextPrayer && prayer.id === nextPrayer.id;
                const isPast = nextPrayer && prayers.indexOf(prayer) < nextPrayer.index;
                
                // Check if time is a text message (not a time format)
                const isTextTime = prayer.time && !prayer.time.match(/^\d{1,2}:\d{2}$/);

                return (
                  <div
                    key={prayer.id}
                    className={`flex items-center justify-between p-2 md:p-2.5 rounded-lg transition-all ${
                      isNext
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : isPast
                        ? theme.cardHighlight
                        : isDarkMode 
                        ? 'bg-white/10 text-white' 
                        : 'bg-emerald-50 text-slate-800 border border-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                        isNext ? 'bg-white/20' : isDarkMode ? 'bg-white/10' : 'bg-emerald-100'
                      }`}>
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs md:text-sm">{prayer.name}</span>
                        <span className={`text-[8px] md:text-[10px] block ${isNext ? 'opacity-80' : 'opacity-60'}`}>{prayer.arabicName}</span>
                      </div>
                    </div>
                    {isTextTime ? (
                      <span className="text-[10px] md:text-xs font-medium text-right max-w-[50%]">{prayer.time}</span>
                    ) : (
                      <span className="text-sm md:text-base font-bold">{prayer.time}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Poster Slider */}
        <div className="hidden md:flex md:w-[45%] h-full flex-col items-center justify-center p-3 md:p-4">
          <div className="relative w-full flex-1">
            
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {/* Funeral Slide - Show poster image directly */}
                {slide.isFuneral && slide.imageUrl ? (
                  <>
                    {/* Full poster image */}
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-contain bg-slate-900"
                    />
                    {/* Funeral badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-white text-[10px] font-medium flex items-center gap-1">
                      <Bell className="w-2.5 h-2.5" />
                      Janaza Announcement
                    </div>
                  </>
                ) : (
                  <>
                    {/* Regular slide - Background Image or Gradient */}
                    {slide.imageUrl ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                      >
                        {/* Very light overlay for image visibility */}
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
                    )}
                    
                    {/* Decorative Pattern - very subtle */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40L80 0v80L40 40zm0 0L0 0v80l40-40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }} />
                    </div>

                    {/* Decorative Elements - very subtle */}
                    <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-8 left-8 w-36 h-36 bg-white/5 rounded-full blur-3xl" />
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-4 md:p-5 text-center">
                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 md:mb-2 leading-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                      
                      {/* Subtitle */}
                      <p className="text-xs md:text-sm text-white/70 mb-3 md:mb-4 max-w-xs drop-shadow-md">
                        {slide.subtitle}
                      </p>

                      {/* Decorative Bottom */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                          <div className="h-px w-12 bg-white/20" />
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                          <div className="h-px w-12 bg-white/20" />
                        </div>
                        <p className="text-white/50 text-[10px] md:text-xs">MASJID AL-IHSAAN</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Navigation Arrows - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Play/Pause Button - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            )}

            {/* Slide Indicators - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-5 bg-white'
                        : 'w-1 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Powered By Card */}
          <div className={`mt-2 w-full backdrop-blur-md rounded-lg p-2.5 border ${
            isDarkMode 
              ? 'bg-white/90 border-white/20' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-500 text-[10px]">Powered by</span>
              <img
                src={`${BASE_URL}assets/exera-logo.png`}
                alt="Exera"
                className="h-4 w-auto"
              />
              <span className="text-slate-300 text-sm">|</span>
              <img
                src={`${BASE_URL}assets/made-in-moris.png`}
                alt="Made in Moris"
                className="h-4 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaatTimes;