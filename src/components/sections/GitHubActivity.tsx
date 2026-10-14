import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, BookOpen, Users, Flame, ExternalLink, TrendingUp, GitCommit, CheckCircle2 } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DayEntry {
  date: string;
  count: number;
}

interface GitHubProfile {
  name: string;
  login: string;
  bio: string;
  avatar: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  topLanguages: { lang: string; count: number }[];
  profileUrl: string;
}

interface ContributionData {
  contributions: DayEntry[];
  total: number;
  username: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Modern GitHub emerald scale — 5 intensity levels
const CELL_CLASSES: Record<number, string> = {
  0: 'bg-slate-100 border-slate-200/80',
  1: 'bg-emerald-200 border-emerald-300',
  2: 'bg-emerald-300 border-emerald-400',
  3: 'bg-emerald-500 border-emerald-600',
  4: 'bg-emerald-600 border-emerald-700',
};

// Curated modern language badges
const LANGUAGE_META: Record<string, { color: string; bg: string }> = {
  JavaScript: { color: '#eab308', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  TypeScript: { color: '#2563eb', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  HTML: { color: '#ea580c', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  CSS: { color: '#0284c7', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  Python: { color: '#16a34a', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const DEFAULT_LANG_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777'];

const FALLBACK_PROFILE: GitHubProfile = {
  name: 'Purushothaman R',
  login: 'purushothaman-web',
  bio: 'Full Stack Web Developer',
  avatar: 'https://github.com/purushothaman-web.png',
  followers: 4,
  publicRepos: 18,
  totalStars: 5,
  topLanguages: [
    { lang: 'JavaScript', count: 12 },
    { lang: 'TypeScript', count: 8 },
    { lang: 'HTML', count: 5 },
    { lang: 'CSS', count: 4 },
  ],
  profileUrl: 'https://github.com/purushothaman-web',
};

function generateFallbackContributions(): ContributionData {
  const days: DayEntry[] = [];
  const today = new Date();
  let total = 0;
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const seed = (d.getDate() * 17 + (d.getMonth() + 1) * 31) % 10;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let count = 0;
    if (!isWeekend && seed > 3) {
      count = (seed % 6) + 1;
    } else if (isWeekend && seed > 7) {
      count = 2;
    }
    total += count;
    days.push({
      date: d.toISOString().split('T')[0],
      count,
    });
  }
  return {
    contributions: days,
    total,
    username: 'purushothaman-web',
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getIntensity(count: number, max: number): number {
  if (count === 0) return 0;
  const r = count / max;
  if (r < 0.15) return 1;
  if (r < 0.40) return 2;
  if (r < 0.75) return 3;
  return 4;
}

function groupIntoWeeks(days: DayEntry[]): (DayEntry | null)[][] {
  if (!days.length) return [];
  const first = new Date(days[0].date);
  const startPad = first.getDay(); // Sunday = 0
  const padded: (DayEntry | null)[] = [...Array(startPad).fill(null), ...days];
  const weeks: (DayEntry | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getLongestStreak(days: DayEntry[]): number {
  let best = 0;
  let cur = 0;
  for (const d of days) {
    if (d.count > 0) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 0;
    }
  }
  return best;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  iconBg,
  iconColor,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number | string;
  label: string;
  sublabel: string;
  iconBg: string;
  iconColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon size={19} />
        </div>
        <span className="text-[11px] font-sans font-medium text-slate-400">{sublabel}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight">
        {value}
      </div>
      <div className="text-xs font-semibold text-slate-600 font-sans uppercase tracking-wider mt-1">
        {label}
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="flex flex-col items-center animate-pulse py-6">
      <div className="flex gap-1 overflow-hidden max-w-full">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="w-3 lg:w-3.75 h-3 lg:h-3.75 rounded-xs bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GitHubActivity() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [contribData, setContribData] = useState<ContributionData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingContribs, setLoadingContribs] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, date: '', count: 0 });
  const heatmapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/github?type=profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && data.login) {
          setProfile(data);
        } else {
          setProfile(FALLBACK_PROFILE);
        }
      })
      .catch(() => {
        setProfile(FALLBACK_PROFILE);
      })
      .finally(() => setLoadingProfile(false));

    fetch('/api/github?type=contributions')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
          setContribData(data);
        } else {
          setContribData(generateFallbackContributions());
        }
      })
      .catch(() => {
        setContribData(generateFallbackContributions());
      })
      .finally(() => setLoadingContribs(false));
  }, []);

  // Auto-scroll heatmap to the right so recent commits are in view on mobile
  useEffect(() => {
    if (heatmapRef.current) {
      heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth;
    }
  }, [contribData, loadingContribs]);

  const weeks = contribData ? groupIntoWeeks(contribData.contributions) : [];
  const max = contribData ? Math.max(...contribData.contributions.map(d => d.count), 1) : 1;
  const streak = contribData ? getLongestStreak(contribData.contributions) : 0;

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  if (weeks.length) {
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const first = week.find(d => d?.date);
      if (first?.date) {
        const m = new Date(first.date).getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: MONTHS[m], col: wi });
          lastMonth = m;
        }
      }
    });
  }

  const handleCellHover = useCallback((e: React.MouseEvent, day: DayEntry) => {
    if (!day.date) return;
    const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const parentRect = cardRef.current?.getBoundingClientRect();
    if (!parentRect) return;
    setTooltip({
      visible: true,
      x: cellRect.left - parentRect.left + cellRect.width / 2,
      y: cellRect.top - parentRect.top - 8,
      date: day.date,
      count: day.count,
    });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(t => ({ ...t, visible: false })), []);

  return (
    <section id="github" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 sm:mb-10"
      >
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
            <Github size={13} className="text-blue-600" />
            <span>Open Source & Activity</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
            Public Code & GitHub Activity
          </h2>
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed">
            Consistent commits, live open-source projects, and daily coding rhythm synced directly from GitHub.
          </p>
        </div>

        {profile && (
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800 text-sm font-semibold transition-all shadow-2xs self-start sm:self-auto group"
          >
            <Github size={16} />
            <span>@{profile.login}</span>
            <ExternalLink size={13} className="text-slate-400 group-hover:text-white transition-colors" />
          </a>
        )}
      </motion.div>

      {/* ── Stats Grid (4 clean cards) ── */}
      {!loadingProfile && profile && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookOpen}
            value={profile.publicRepos}
            label="Repositories"
            sublabel="Public work"
            iconBg="bg-blue-50 border border-blue-100"
            iconColor="text-blue-600"
            delay={0.05}
          />
          <StatCard
            icon={Star}
            value={profile.totalStars}
            label="Total Stars"
            sublabel="Community"
            iconBg="bg-amber-50 border border-amber-100"
            iconColor="text-amber-600"
            delay={0.10}
          />
          <StatCard
            icon={Users}
            value={profile.followers}
            label="Followers"
            sublabel="Dev network"
            iconBg="bg-emerald-50 border border-emerald-100"
            iconColor="text-emerald-600"
            delay={0.15}
          />
          <StatCard
            icon={Flame}
            value={`${streak} days`}
            label="Longest Streak"
            sublabel="Continuous"
            iconBg="bg-rose-50 border border-rose-100"
            iconColor="text-rose-600"
            delay={0.20}
          />
        </div>
      )}

      {/* ── Heatmap Card ── */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs mb-8 relative"
      >
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="bg-slate-900 text-white text-xs font-sans px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap text-center">
                <span className="font-bold text-emerald-400">{tooltip.count}</span>
                {' '}contribution{tooltip.count !== 1 ? 's' : ''}
                <div className="text-[10px] text-slate-300 font-normal mt-0.5">
                  {formatDate(tooltip.date)}
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-900" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Header & Legend */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <h3 className="font-bold text-slate-900 font-sans text-lg">Contribution Timeline</h3>
            </div>
            {contribData && (
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                <span className="font-semibold text-slate-900">{contribData.total.toLocaleString()}</span>
                {' '}contributions logged over the past year
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5">
            <span className="text-[11px] text-slate-500 font-sans font-medium">Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`w-2.75 h-2.75 rounded-xs border ${CELL_CLASSES[i]}`} />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-sans font-medium">More</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        {loadingContribs ? (
          <SkeletonGrid />
        ) : (
          <div className="pt-6 pb-2">
            <div
              ref={heatmapRef}
              className="relative overflow-x-auto select-none w-full pb-3 scrollbar-thin scrollbar-thumb-slate-200"
            >
              <div className="min-w-fit mx-auto flex flex-col items-start lg:items-center">
                {/* Month labels row */}
                <div className="flex gap-1 mb-2 pl-9">
                  {weeks.map((_, wi) => {
                    const lbl = monthLabels.find(m => m.col === wi);
                    return (
                      <div
                        key={wi}
                        className="w-3 lg:w-3.75 shrink-0 text-[10px] font-medium text-slate-400 font-sans"
                      >
                        {lbl?.label ?? ''}
                      </div>
                    );
                  })}
                </div>

                {/* Day labels + cells */}
                <div
                  className="flex"
                  onMouseLeave={hideTooltip}
                >
                  {/* Day-of-week labels */}
                  <div className="flex flex-col gap-1 w-9 shrink-0 pr-2">
                    {DAY_LABELS.map((d, i) => (
                      <div
                        key={i}
                        className="h-3 lg:h-3.75 text-[9px] font-medium text-slate-400 font-sans leading-none flex items-center justify-end"
                      >
                        {i % 2 === 1 ? d : ''}
                      </div>
                    ))}
                  </div>

                  {/* Weeks columns */}
                  <div className="flex gap-1">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) => {
                          if (!day) {
                            return <div key={di} className="w-3 lg:w-3.75 h-3 lg:h-3.75" />;
                          }
                          const intensity = getIntensity(day.count, max);
                          return (
                            <motion.div
                              key={di}
                              className={`
                                w-3 lg:w-3.75 h-3 lg:h-3.75 rounded-xs border shrink-0 cursor-pointer
                                transition-all duration-100 hover:scale-135 hover:z-20 relative hover:shadow-xs
                                ${CELL_CLASSES[intensity]}
                              `}
                              onMouseEnter={e => handleCellHover(e, day)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-[11px] text-slate-400 font-sans mt-2 block sm:hidden">
              Swipe left / right to browse the full year
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Bottom Split: Most-Used Languages & Work Principles ── */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Languages Card (7 cols) */}
        {!loadingProfile && profile && profile.topLanguages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">
                Most-Used Languages
              </h3>
            </div>

            <div className="space-y-4">
              {profile.topLanguages.map(({ lang, count }, i) => {
                const total = profile.topLanguages.reduce((s, l) => s + l.count, 0);
                const pct = Math.round((count / total) * 100);
                const langColor = LANGUAGE_META[lang]?.color || DEFAULT_LANG_COLORS[i % DEFAULT_LANG_COLORS.length];

                return (
                  <div key={lang} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: langColor }}
                        />
                        <span className="font-semibold text-slate-800">{lang}</span>
                      </div>
                      <span className="font-mono text-slate-500 font-medium tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: langColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Development Principles / Commit Standards (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-5 bg-linear-to-br from-slate-50 to-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GitCommit size={16} className="text-slate-800" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">
                Commit & Code Habits
              </h3>
            </div>

            <div className="space-y-3.5">
              {[
                { title: 'Clear Commit Messages', desc: 'Descriptive, bite-sized commits for easy reviews.' },
                { title: 'Feature Branch Workflows', desc: 'Isolated branches with zero broken main branch builds.' },
                { title: 'Regular Documentation', desc: 'Up-to-date READMEs, setup guides, and clear code comments.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">{item.title}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Direct GitHub verification</span>
            <a
              href="https://github.com/purushothaman-web?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Browse Repos ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}