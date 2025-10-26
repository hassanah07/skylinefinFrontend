"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";

const STATUS_ORDER = ["none", "present", "absent", "leave"];
const STATUS_STYLES = {
  none: "bg-transparent border border-dashed border-gray-200",
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  leave: "bg-yellow-100 text-yellow-800",
};
// Helper to compute totals for a given year/month from the attendance map
function getMonthTotals(attendance = {}, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let present = 0,
    absent = 0,
    leave = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = isoDate(year, month, d);
    const s = attendance[iso];
    if (s === "present") present++;
    else if (s === "absent") absent++;
    else if (s === "leave") leave++;
  }
  return { present, absent, leave };
}

// Small presentational component to render the totals for the currently viewed month.
// Use this inside the main component where you want the counts shown, for example:
// <MonthTotals attendance={attendance} year={year} month={month} />
function MonthTotals({ attendance, year, month }) {
  const totals = useMemo(
    () => getMonthTotals(attendance, year, month),
    [attendance, year, month]
  );

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />
          <span>
            Present: <span className="font-semibold">{totals.present}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />
          <span>
            Absent: <span className="font-semibold">{totals.absent}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200" />
          <span>
            Leave: <span className="font-semibold">{totals.leave}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function isoDate(y, m0, d) {
  return `${y}-${pad(m0 + 1)}-${pad(d)}`;
}

/* Demo attendance data for Sep + Oct 2025.
   Replace with backend data later. */
const DEMO_ATTENDANCE = {
  // Some days in previous month (September 2025)
  "2025-09-29": "present",
  "2025-09-30": "present",

  // October 2025 examples
  "2025-10-01": "present",
  "2025-10-02": "present",
  "2025-10-03": "absent",
  "2025-10-06": "present",
  "2025-10-07": "leave",
  "2025-10-08": "present",
  "2025-10-09": "absent",
  "2025-10-10": "present",
  "2025-10-15": "leave",
  "2025-10-20": "present",
  "2025-10-28": "absent",
};

export default function EmployeeAttendanceCalendar() {
  const params = useParams?.() ?? {};
  const slug = params?.slag ?? "unknown-employee";

  // Start explicitly at October 2025 (month is 0-based)
  const INITIAL_YEAR = 2025;
  const INITIAL_MONTH = 9;

  const [year, setYear] = useState(INITIAL_YEAR);
  const [month, setMonth] = useState(INITIAL_MONTH);
  // attendance keyed by ISO date "YYYY-MM-DD" -> "present"|"absent"|"leave"
  const [attendance, setAttendance] = useState(DEMO_ATTENDANCE);
  const saveTimer = useRef(null);

  // Build calendar (same as before)
  const calendar = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = firstOfMonth.getDay();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return {
      cells,
      daysInMonth,
      monthLabel: firstOfMonth.toLocaleString(undefined, { month: "long" }),
      startWeekday,
    };
  }, [year, month]);

  // compute range to fetch: previous month start -> current month end
  function computeFetchRange(y, m0) {
    const prev = new Date(y, m0, 1);
    prev.setMonth(prev.getMonth() - 1);
    const start = new Date(prev.getFullYear(), prev.getMonth(), 1);
    const end = new Date(y, m0 + 1, 0); // last day of current month
    const startStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(
      start.getDate()
    )}`;
    const endStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(
      end.getDate()
    )}`;
    return { start: startStr, end: endStr };
  }

  // Load attendance from backend for range (previous month + current month)
  useEffect(() => {
    // For demo: use the local DEMO_ATTENDANCE and do not call the API.
    // When ready to re-enable backend, replace this block with the fetch (example below).
    let mounted = true;
    (async function loadDemo() {
      try {
        // simulate small delay
        await new Promise((r) => setTimeout(r, 120));
        if (mounted) setAttendance(DEMO_ATTENDANCE);
      } catch (e) {
        console.error("Demo load error", e);
        if (mounted) setAttendance({});
      }
    })();

    /* Example real fetch to re-enable later:
        let mounted = true;
        async function load() {
            const { start, end } = computeFetchRange(year, month);
            try {
                const res = await fetch(`/api/attendance?slug=${encodeURIComponent(slug)}&start=${start}&end=${end}`);
                if (!res.ok) throw new Error("fetch failed");
                const data = await res.json();
                if (mounted) setAttendance(data || {});
            } catch (e) {
                console.error("Attendance load error", e);
                if (mounted) setAttendance({});
            }
        }
        load();
        */
    return () => {
      mounted = false;
    };
  }, [slug, year, month]);

  // Persist single-day change to backend (debounced to avoid rapid calls).
  function persistSingle(dateIso, status) {
    // cancel previous timer
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    // debounce 400ms
    saveTimer.current = setTimeout(async () => {
      try {
        // Demo: do not call backend, just log. Replace with fetch when enabling backend.
        console.log("Persist (demo):", { slug, date: dateIso, status });

        /* Real request example:
                await fetch("/api/attendance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug, date: dateIso, status }),
                });
                */
      } catch (e) {
        console.error("Save error", e);
      }
    }, 400);
  }

  function cycleStatusForDay(day) {
    const dateIso = isoDate(year, month, day);
    setAttendance((prev) => {
      const cur = prev[dateIso] || "none";
      const idx = STATUS_ORDER.indexOf(cur);
      const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
      const copy = { ...prev };
      if (next === "none") delete copy[dateIso];
      else copy[dateIso] = next;
      // optimistic save (demo)
      persistSingle(dateIso, next === "none" ? null : next);
      return copy;
    });
  }

  function goPrevMonth() {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }
  function goNextMonth() {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }
  async function clearMonth() {
    if (!confirm("Clear all attendance for this month?")) return;
    // clear locally for visible days
    const updates = {};
    for (let d = 1; d <= calendar.daysInMonth; d++) {
      const iso = isoDate(year, month, d);
      updates[iso] = null;
    }
    setAttendance((prev) => {
      const copy = { ...prev };
      Object.keys(updates).forEach((k) => delete copy[k]);
      return copy;
    });

    // Demo: do not call backend. Replace with real request when backend ready.
    console.log("Clear month (demo):", { slug, year, month: month + 1 });

    /*
        try {
            await fetch("/api/attendance/clearMonth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, year, month: month + 1 }),
            });
        } catch (e) {
            console.error("clear month error", e);
        }
        */
  }

  const today = new Date();
  const isTodayInView =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Attendance — Employee: {slug}
          </h2>
          <p className="text-sm">
            Month: {calendar.monthLabel} {year}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrevMonth}
            className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-md text-sm"
            aria-label="Previous month"
          >
            ⏮️ Prev
          </button>
          <button
            onClick={goNextMonth}
            className="px-3 py-2 bg-green-400 hover:bg-green-500 rounded-md text-sm"
            aria-label="Next month"
          >
            Next ⏭️
          </button>
          <button
            onClick={clearMonth}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-green-200 dark:bg-slate-700 shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2">
            {calendar.cells.map((day, idx) => {
              if (day === null)
                return (
                  <div key={`empty-${idx}`} className="h-20 sm:h-24 p-2"></div>
                );
              const iso = isoDate(year, month, day);
              const status = attendance[iso] || "none";
              const classes =
                "h-20 sm:h-24 p-2 rounded-md flex flex-col justify-between cursor-pointer transition-colors " +
                STATUS_STYLES[status];
              const isToday = isTodayInView && day === todayDate;
              return (
                <button
                  key={iso}
                  onClick={() => cycleStatusForDay(day)}
                  className={classes}
                  title={`Day ${day} — click to change attendance (current: ${status})`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{day}</span>
                    {isToday && (
                      <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-0.5">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-left">
                    {status === "none" && (
                      <span className="text-gray-400">Unmarked</span>
                    )}
                    {status === "present" && (
                      <span className="font-semibold">Present</span>
                    )}
                    {status === "absent" && (
                      <span className="font-semibold">Absent</span>
                    )}
                    {status === "leave" && (
                      <span className="font-semibold">Leave</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200" />
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-transparent border border-dashed border-gray-200" />
                <span>Unmarked</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Tip: Tap a day to cycle attendance. Data loaded/saved via backend
              (currently demo data).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
