export type Interval = { start: number; end: number };
export type LabeledStatus = 'available' | 'break' | 'booked' | 'unavailable';

export const toMinutes = (t: string): number => {
  
  if (t === '24:00') return 1440;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
export const isTimeGreater = (t1: string, t2: string): boolean => {
  const time1=toMinutes(t1)
  const time2=toMinutes(t2)
  return time1 > time2;
};
export const doTimesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  const aStart = toMinutes(startA);
  const aEnd   = toMinutes(endA);
  const bStart = toMinutes(startB);
  const bEnd   = toMinutes(endB);
  return aStart < bEnd && aEnd > bStart;
};
export const fromMinutes = (n: number): string => {
  
  if (n <= 0) return '00:00';
  if (n >= 1440) return '24:00';
  const h = Math.floor(n / 60).toString().padStart(2, '0');
  const m = (n % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const dateKey = (d: Date): string => {
  
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  const y = dd.getFullYear();
  const m = (dd.getMonth() + 1).toString().padStart(2, '0');
  const da = dd.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${da}`;
};

export const dayBounds = (d: Date): { start: Date; end: Date } => {
  
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  const e = new Date(s);
  e.setDate(e.getDate() + 1);
  return { start: s, end: e };
};

export const mergeIntervals = (arr: Interval[]): Interval[] => {
  if (!arr.length) return [];
  const a = [...arr].sort((x, y) => x.start - y.start);
  const out: Interval[] = [];
  for (const it of a) {
    if (!out.length || it.start > out[out.length - 1].end) {
      out.push({ ...it });
    } else {
      out[out.length - 1].end = Math.max(out[out.length - 1].end, it.end);
    }
  }
  return out;
};

export const subtractIntervals = (base: Interval[], cuts: Interval[]): Interval[] => {
  
  let res = mergeIntervals(base);
  const cc = mergeIntervals(cuts);
  for (const c of cc) {
    const next: Interval[] = [];
    for (const b of res) {
      if (c.end <= b.start || c.start >= b.end) {
        next.push(b);
        continue;
      }
      
      if (c.start > b.start) next.push({ start: b.start, end: Math.min(c.start, b.end) });
      
      if (c.end < b.end) next.push({ start: Math.max(c.end, b.start), end: b.end });
    }
    res = next;
  }
  return mergeIntervals(res);
};

export const buildLabeledTimeline = (
  available: Interval[],
  breaks: Interval[],
  booked: Interval[],
): Array<{ start: number; end: number; status: LabeledStatus }> => {
  
  const points = new Set<number>([0, 1440]);
  for (const v of available) { points.add(v.start); points.add(v.end); }
  for (const v of breaks) { points.add(v.start); points.add(v.end); }
  for (const v of booked) { points.add(v.start); points.add(v.end); }
  const xs = [...points].sort((a, b) => a - b);

  const contains = (iv: Interval[], s: number, e: number) => iv.some((v) => s < v.end && e > v.start);

  const raw: Array<{ start: number; end: number; status: LabeledStatus }> = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const s = xs[i]; const
      e = xs[i + 1];
    if (e <= s) continue;
    let status: LabeledStatus = 'unavailable';
    if (contains(booked, s, e)) status = 'booked';
    else if (contains(breaks, s, e)) status = 'break';
    else if (contains(available, s, e)) status = 'available';
    raw.push({ start: s, end: e, status });
  }

  
  const merged: typeof raw = [];
  for (const seg of raw) {
    const last = merged[merged.length - 1];
    if (last && last.status === seg.status && last.end === seg.start) {
      last.end = seg.end;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
};
export const addDurationToTime=(startTime: string, durationHours: number): string =>{
  const [hours, minutes] = startTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const addedMinutes = durationHours * 60;
  startDate.setMinutes(startDate.getMinutes() + addedMinutes);

  const endH = String(startDate.getHours()).padStart(2, "0");
  const endM = String(startDate.getMinutes()).padStart(2, "0");

  return `${endH}:${endM}`;
}
