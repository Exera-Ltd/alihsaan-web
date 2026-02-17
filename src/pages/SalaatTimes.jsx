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
  Pause
} from 'lucide-react';

// Get base URL from Vite
const BASE_URL = import.meta.env.BASE_URL;

// ============================================================================
// PRAYER TIMES CONFIGURATION
// ============================================================================
const PRAYER_CONFIG = {
  mosque: {
    name: "Al-Ihsaan Foundation",
    location: "Port Louis, Mauritius"
  },
  prayers: [
    { id: 'fajr', name: 'Fajr', arabicName: 'fajr', icon: Moon, time: '04:45' },
    { id: 'sunrise', name: 'Sunrise', arabicName: 'shurooq', icon: Sunrise, time: '05:58' },
    { id: 'dhuhr', name: 'Dhuhr', arabicName: 'dhuhr', icon: Sun, time: '12:15' },
    { id: 'asr', name: 'Asr', arabicName: 'asr', icon: Sun, time: '15:45' },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'maghrib', icon: Sunset, time: '18:22' },
    { id: 'isha', name: 'Isha', arabicName: 'isha', icon: Moon, time: '19:35' }
  ]
};

// Dummy poster slides
const POSTER_SLIDES = [
  {
    id: 1,
    title: 'Ramadan Mubarak',
    subtitle: 'Join us for Taraweeh prayers every night after Isha',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Jumu\'ah Prayer',
    subtitle: 'Every Friday at 1:00 PM - Don\'t miss the blessings',
    gradient: 'from-amber-500 via-orange-500 to-red-500'
  },
  {
    id: 3,
    title: 'Quran Classes',
    subtitle: 'Weekend classes for children and adults - Register now',
    gradient: 'from-purple-600 via-indigo-500 to-blue-500'
  },
  {
    id: 4,
    title: 'Community Iftar',
    subtitle: 'Breaking fast together - Everyone welcome',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500'
  }
];

// ============================================================================
// MAIN SALAAT TIMES COMPONENT - DISPLAY BOARD LAYOUT
// ============================================================================
const SalaatTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find next prayer
  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayerMinutes = PRAYER_CONFIG.prayers.map(p => {
      const [h, m] = p.time.split(':').map(Number);
      return h * 60 + m;
    });

    for (let i = 0; i < prayerMinutes.length; i++) {
      if (prayerMinutes[i] > currentMinutes) {
        setNextPrayer({ ...PRAYER_CONFIG.prayers[i], index: i });
        return;
      }
    }
    setNextPrayer({ ...PRAYER_CONFIG.prayers[0], index: 0 });
  }, [currentTime]);

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
    if (!isPlaying) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % POSTER_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [isPlaying]);

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % POSTER_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + POSTER_SLIDES.length) % POSTER_SLIDES.length);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content - Single Row Layout */}
      <div className="relative h-full flex">
        
        {/* LEFT SECTION - Time & Prayer Info */}
        <div className="w-[55%] h-full flex flex-col justify-center px-8 xl:px-12">
          
          {/* Header with Logo */}
          <div className="flex items-center gap-4 mb-5">
            <img
              src={`${BASE_URL}assets/logo.png`}
              alt="Al-Ihsaan Foundation"
              className="h-14 xl:h-16 w-auto drop-shadow-lg"
            />
            <div>
              <h1 className="text-xl xl:text-2xl font-bold text-white">{PRAYER_CONFIG.mosque.name}</h1>
              <div className="flex items-center gap-2 text-emerald-400 text-xs xl:text-sm">
                <MapPin className="w-3 h-3" />
                <span>{PRAYER_CONFIG.mosque.location}</span>
              </div>
            </div>
          </div>

          {/* Current Time & Next Prayer - Same Row */}
          <div className="flex gap-4 mb-5">
            {/* Current Time */}
            <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl p-4 xl:p-5 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Current Time</span>
              </div>
              <div className="text-3xl xl:text-4xl font-bold text-white tracking-tight">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-white/60 mt-1">
                {formatDate(currentTime)}
              </div>
            </div>

            {/* Next Prayer Countdown */}
            {nextPrayer && (
              <div className="flex-1 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-xl rounded-2xl p-4 xl:p-5 border border-emerald-500/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Next</span>
                  </div>
                  <span className="text-white font-bold text-lg xl:text-xl">{nextPrayer.name}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {[
                    { value: timeLeft.hours, label: 'H' },
                    { value: timeLeft.minutes, label: 'M' },
                    { value: timeLeft.seconds, label: 'S' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="bg-white/15 rounded-lg px-3 py-1.5 min-w-[45px] text-center">
                        <span className="text-xl xl:text-2xl font-bold text-white">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      {index < 2 && <span className="text-lg text-emerald-400 font-bold">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prayer Times Grid - 2 columns x 3 rows - MAIN FOCUS */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 xl:p-6 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-400 mb-4 px-1">
              <Star className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Today's Prayer Times</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PRAYER_CONFIG.prayers.map((prayer) => {
                const Icon = prayer.icon;
                const isNext = nextPrayer && prayer.id === nextPrayer.id;
                const isPast = nextPrayer && PRAYER_CONFIG.prayers.indexOf(prayer) < nextPrayer.index;

                return (
                  <div
                    key={prayer.id}
                    className={`flex items-center justify-between p-4 xl:p-5 rounded-xl transition-all ${
                      isNext
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : isPast
                        ? 'bg-white/5 text-white/40'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center ${
                        isNext ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <Icon className="w-6 h-6 xl:w-7 xl:h-7" />
                      </div>
                      <div>
                        <span className="font-bold text-lg xl:text-xl">{prayer.name}</span>
                        <span className="text-xs xl:text-sm block opacity-60">{prayer.arabicName}</span>
                      </div>
                    </div>
                    <span className="text-2xl xl:text-3xl font-bold">{prayer.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Poster Slider */}
        <div className="w-[45%] h-full flex items-center justify-center p-6 xl:p-8">
          <div className="relative w-full h-[85%]">
            
            {/* Slides */}
            {POSTER_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 rounded-2xl overflow-hidden transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
                
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
                <div className="relative h-full flex flex-col items-center justify-center p-8 xl:p-12 text-center">
                  {/* Islamic Decorative Top */}
                  <div className="mb-6">
                    <div className="w-24 h-24 xl:w-32 xl:h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Star className="w-12 h-12 xl:w-16 xl:h-16 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-px w-16 bg-white/40" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="h-px w-16 bg-white/40" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  
                  {/* Subtitle */}
                  <p className="text-lg xl:text-xl 2xl:text-2xl text-white/80 mb-8 max-w-md">
                    {slide.subtitle}
                  </p>

                  {/* Decorative Bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px w-20 bg-white/40" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="h-px w-20 bg-white/40" />
                    </div>
                    <p className="text-white/60 text-sm xl:text-base">Al-Ihsaan Foundation</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {POSTER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaatTimes;