import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, BookOpen, Users, Flame, ExternalLink, TrendingUp } from 'lucide-react';

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
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Navy/red portfolio palette — 5 intensity levels
const CELL_CLASSES: Record<number, string> = {
  0: 'bg-gray-100 border-gray-200/80',
  1: 'bg-[#dce8f5] border-[#c0d6ec]',
  2: 'bg-[#7fafd4] border-[#5c97c7]',
  3: 'bg-[#1d3557] border-[#162a45]',
  4: 'bg-[#e63946] border-[#cc2f3c]',
};

const LANG_COLORS = ['#1d3557', '#e63946', '#457b9d', '#a8dadc', '#f4a261'];

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
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function getLongestStreak(days: DayEntry[]): number {
  let best = 0, cur = 0;
  for (const d of days) {
    if (d.count > 0) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }
  return best;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatPill({
  icon: Icon, value, label, delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number | string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 editorial-card"
    >
      <div className="w-10 h-10 rounded-xl bg-[#fff9ed] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#1d3557]" />
      </div>
      <div>
        <div className="text-xl font-bold text-[#1d3557] font-sans leading-none">{value}</div>
        <div className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="flex gap-[4px]">
        {Array.from({ length: 53 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[4px]">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="w-[12px] lg:w-[16px] h-[12px] lg:h-[16px] rounded-sm bg-gray-200" />
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
      .then(r => r.json())
      .then(setProfile)
      .finally(() => setLoadingProfile(false));

    fetch('/api/github?type=contributions')
      .then(r => r.json())
      .then(setContribData)
      .finally(() => setLoadingContribs(false));
  }, []);

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
        if (m !== lastMonth) { monthLabels.push({ label: MONTHS[m], col: wi }); lastMonth = m; }
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
      y: cellRect.top - parentRect.top - 6,
      date: day.date,
      count: day.count,
    });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(t => ({ ...t, visible: false })), []);

  return (
    <section id="github" className="py-32 px-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1d3557] flex items-center justify-center">
              <Github size={20} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans">
              GitHub Activity
            </h2>
          </div>
          <div className="w-16 h-1 bg-[#e63946] rounded-full ml-[52px]" />
          <p className="text-gray-500 font-sans leading-relaxed max-w-xl ml-[52px]">
            Live contribution data pulled from the GitHub API — no third-party widgets.
          </p>
        </div>

        {profile && (
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1d3557] border border-[#1d3557]/20 rounded-xl px-5 py-3 hover:bg-[#1d3557] hover:text-white transition-all self-start sm:self-auto"
          >
            <Github size={14} />
            @{profile.login}
            <ExternalLink size={11} />
          </a>
        )}
      </motion.div>

      {/* ── Stats Row ── */}
      {!loadingProfile && profile && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatPill icon={BookOpen} value={profile.publicRepos} label="Repositories" delay={0.05} />
          <StatPill icon={Star}     value={profile.totalStars}  label="Total Stars"  delay={0.10} />
          <StatPill icon={Users}    value={profile.followers}   label="Followers"    delay={0.15} />
          <StatPill icon={Flame}    value={streak}              label="Best Streak"  delay={0.20} />
        </div>
      )}

      {/* ── Heatmap Card ── */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white editorial-card rounded-3xl p-7 mb-6 relative"
      >
        {/* Tooltip (Highest Level - child of relative Card) */}
        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="bg-[#1d3557] text-white text-[11px] font-sans px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                <span className="font-bold text-[#a8dadc]">{tooltip.count}</span>
                {' '}contribution{tooltip.count !== 1 ? 's' : ''}
                <br />
                <span className="opacity-75">{formatDate(tooltip.date)}</span>
              </div>
              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1d3557]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-[#1d3557] font-sans text-lg">Contribution Graph</h3>
            {contribData && (
              <p className="text-sm text-gray-400 font-sans mt-0.5">
                <span className="font-semibold text-[#1d3557]">{contribData.total.toLocaleString()}</span>
                {' '}contributions in the last year
              </p>
            )}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-sans mr-1">Less</span>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`w-[11px] h-[11px] rounded-sm border ${CELL_CLASSES[i]}`} />
            ))}
            <span className="text-[11px] text-gray-400 font-sans ml-1">More</span>
          </div>
        </div>

        {/* Grid Container */}
        {loadingContribs ? (
          <SkeletonGrid />
        ) : (
          <div className="flex flex-col items-center pt-8 pb-2">
            <div ref={heatmapRef} className="relative overflow-x-auto select-none w-full max-w-full pb-2">
              {/* Month labels row */}
              <div className="flex justify-center w-full">
                <div className="flex gap-[4px] mb-1 pl-10">
                  {weeks.map((_, wi) => {
                    const lbl = monthLabels.find(m => m.col === wi);
                    return (
                      <div key={wi} className="w-[12px] lg:w-[16px] flex-shrink-0 text-[10px] text-gray-400 font-sans">
                        {lbl?.label ?? ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day labels + cells */}
              <div
                className="flex justify-center w-full"
                onMouseLeave={hideTooltip}
              >
                <div
                  className="flex gap-[4px]"
                >
                {/* Day-of-week labels */}
                  <div className="flex flex-col gap-[4px] w-10 flex-shrink-0 pr-2">
                    {DAY_LABELS.map((d, i) => (
                      <div
                        key={i}
                        className="h-[12px] lg:h-[16px] text-[9px] text-gray-400 font-sans leading-none flex items-center justify-end"
                      >
                        {i % 2 === 1 ? d : ''}
                      </div>
                    ))}
                  </div>
                {/* Weeks */}
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[4px]">
                      {week.map((day, di) => {
                        if (!day) {
                          return <div key={di} className="w-[12px] lg:w-[16px] h-[12px] lg:h-[16px]" />;
                        }
                        const intensity = getIntensity(day.count, max);
                        return (
                          <motion.div
                            key={di}
                            className={`
                              w-[12px] lg:w-[16px] h-[12px] lg:h-[16px] rounded-sm border flex-shrink-0 cursor-default
                              transition-transform duration-75
                              hover:scale-150 hover:z-10 relative
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
        )}
      </motion.div>

      {/* ── Top Languages ── */}
      {!loadingProfile && profile && profile.topLanguages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white editorial-card rounded-2xl p-7 lg:p-10"
        >
          <div className="flex items-center gap-2 mb-7">
            <TrendingUp size={16} className="text-[#e63946]" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Most-Used Languages
            </h3>
          </div>

          <div className="space-y-4">
            {profile.topLanguages.map(({ lang, count }, i) => {
              const total = profile.topLanguages.reduce((s, l) => s + l.count, 0);
              const pct = Math.round((count / total) * 100);
              return (
                <div key={lang}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: LANG_COLORS[i] }}
                      />
                      <span className="text-sm font-semibold text-gray-700 font-sans">{lang}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-sans font-medium tabular-nums">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: LANG_COLORS[i] }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </section>
  );
}