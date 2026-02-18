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
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load prayer times and slides
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try Google Sheets first if URL is configured
        if (GOOGLE_SHEET_URL) {
          const response = await fetch(GOOGLE_SHEET_URL);
          if (response.ok) {
            const csvText = await response.text();
            const data = parseCSV(csvText);
            
            if (data.prayers.length > 0) {
              setPrayerData({
                mosque: { name: "Al-Ihsaan Foundation", location: "Port Louis, Mauritius" },
                prayers: data.prayers
              });
            }
            if (data.slides.length > 0) {
              setSlides(data.slides);
            }
            
            if (data.prayers.length > 0) {
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
            setSlides(data.slides);
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

      {/* Main Content - Responsive Layout */}
      <div className="relative h-full flex flex-col lg:flex-row">
        
        {/* LEFT SECTION - Time & Prayer Info */}
        <div className="w-full lg:w-[55%] h-full flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-12">
          
          {/* Header with Logo */}
          <div className={`backdrop-blur-xl rounded-2xl p-4 sm:p-5 lg:p-6 border mb-3 sm:mb-4 lg:mb-5 ${theme.card}`}>
            <div className="flex items-center gap-4">
              <img
                src={`${BASE_URL}assets/al-ihsaan-logo.webp`}
                alt="Al-Ihsaan Foundation"
                className="h-16 sm:h-20 lg:h-24 xl:h-28 w-auto drop-shadow-lg"
              />
              <div className="flex-1 text-center">
                <h1 className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 ${theme.text}`}>MASJID AL-IHSAAAN</h1>
                <p className={`text-sm sm:text-base lg:text-lg font-medium mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Islamic Help Reaching People in Need</p>
                <div className={`flex items-center justify-center gap-2 text-xs sm:text-sm ${theme.textMuted}`}>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{mosque.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Time & Next Prayer - Same Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-5">
            {/* Current Time */}
            <div className={`flex-1 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border ${theme.card}`}>
              <div className={`flex items-center gap-2 mb-1 ${theme.accent}`}>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Current Time</span>
              </div>
              <div className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight ${theme.text}`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-xs sm:text-sm mt-1 hidden sm:block ${theme.textMuted}`}>
                {formatDate(currentTime)}
              </div>
            </div>

            {/* Next Prayer Countdown */}
            {nextPrayer && (
              <div className={`flex-1 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/40' 
                  : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className={`flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Next</span>
                  </div>
                  <span className={`font-bold text-sm sm:text-base lg:text-lg xl:text-xl ${theme.text}`}>{nextPrayer.name}</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[
                    { value: timeLeft.hours, label: 'H' },
                    { value: timeLeft.minutes, label: 'M' },
                    { value: timeLeft.seconds, label: 'S' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className={`rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 min-w-[40px] sm:min-w-[45px] text-center ${
                        isDarkMode ? 'bg-white/15' : 'bg-white/80'
                      }`}>
                        <span className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-bold ${theme.text}`}>
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      {index < 2 && <span className={`text-sm sm:text-base lg:text-lg font-bold ${theme.accent}`}>:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prayer Times Grid - 2 columns x 3 rows - MAIN FOCUS */}
          <div className={`backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 border flex-1 sm:flex-none ${theme.card}`}>
            <div className={`flex items-center gap-2 mb-2 sm:mb-3 lg:mb-4 px-1 ${theme.accent}`}>
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Today's Prayer Times</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {prayers.filter(p => p && p.id && p.name && p.time).map((prayer) => {
                const Icon = prayer.id === 'fajr' || prayer.id === 'isha' ? Moon :
                           prayer.id === 'sunrise' ? Sunrise :
                           prayer.id === 'maghrib' ? Sunset : Sun;
                const isNext = nextPrayer && prayer.id === nextPrayer.id;
                const isPast = nextPrayer && prayers.indexOf(prayer) < nextPrayer.index;

                return (
                  <div
                    key={prayer.id}
                    className={`flex items-center justify-between p-2 sm:p-3 lg:p-4 xl:p-5 rounded-lg sm:rounded-xl transition-all ${
                      isNext
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : isPast
                        ? theme.cardHighlight
                        : isDarkMode 
                        ? 'bg-white/10 text-white' 
                        : 'bg-emerald-50 text-slate-800 border border-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg sm:rounded-xl flex items-center justify-center ${
                        isNext ? 'bg-white/20' : isDarkMode ? 'bg-white/10' : 'bg-emerald-100'
                      }`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                      </div>
                      <div>
                        <span className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl">{prayer.name}</span>
                        <span className={`text-[10px] sm:text-xs block ${isNext ? 'opacity-80' : 'opacity-60'}`}>{prayer.arabicName}</span>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold">{prayer.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Poster Slider */}
        <div className="hidden lg:flex lg:w-[45%] h-full flex-col items-center justify-center p-4 lg:p-6 xl:p-8">
          <div className="relative w-full flex-1">
            
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {/* Background - Image or Gradient */}
                {slide.imageUrl ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  >
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
                )}
                
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40L80 0v80L40 40zm0 0L0 0v80l40-40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 lg:p-8 xl:p-12 text-center">
                  {/* Islamic Decorative Top */}
                  <div className="mb-4 lg:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 mx-auto mb-3 lg:mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-px w-12 sm:w-16 bg-white/40" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="h-px w-12 sm:w-16 bg-white/40" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 lg:mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  
                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 mb-4 lg:mb-8 max-w-md">
                    {slide.subtitle}
                  </p>

                  {/* Decorative Bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-center gap-2 mb-3 lg:mb-4">
                      <div className="h-px w-16 sm:w-20 bg-white/40" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="h-px w-16 sm:w-20 bg-white/40" />
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm lg:text-base">MASJID AL-IHSAAAN</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </>
            )}

            {/* Play/Pause Button - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-3 lg:top-4 right-3 lg:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              >
                {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            )}

            {/* Slide Indicators - Only show if more than 1 slide */}
            {slides.length > 1 && (
              <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-6 sm:w-8 bg-white'
                        : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Powered By Card */}
          <div className={`mt-4 w-full backdrop-blur-md rounded-xl p-3 border ${
            isDarkMode 
              ? 'bg-white/90 border-white/20' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-500 text-xs">Powered by</span>
              <img
                src={`${BASE_URL}assets/exera-logo.png`}
                alt="Exera"
                className="h-5 w-auto"
              />
              <span className="text-slate-300 text-lg">|</span>
              <img
                src={`${BASE_URL}assets/made-in-moris.png`}
                alt="Made in Moris"
                className="h-5 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaatTimes;