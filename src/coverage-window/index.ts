export type CoverageWindow = {
  date: string
  startAt: string
  endAt: string
}

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

function shanghaiParts(now: Date) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "00"
  return {
    year: Number(part("year")),
    month: Number(part("month")),
    day: Number(part("day")),
    time: `${part("hour")}:${part("minute")}:${part("second")}`,
  }
}

export function resolveCoverageWindow(offsetDays: number, now = new Date()): CoverageWindow {
  if (!Number.isInteger(offsetDays) || offsetDays < 0 || offsetDays > 30) {
    throw new Error("offsetDays must be an integer between 0 and 30")
  }

  const shanghai = shanghaiParts(now)
  const dateHolder = new Date(Date.UTC(shanghai.year, shanghai.month - 1, shanghai.day))
  dateHolder.setUTCDate(dateHolder.getUTCDate() + offsetDays)

  const date = `${dateHolder.getUTCFullYear()}-${pad(dateHolder.getUTCMonth() + 1)}-${pad(dateHolder.getUTCDate())}`
  const startAt = offsetDays === 0 ? `${date} ${shanghai.time}` : `${date} 00:00:00`
  return { date, startAt, endAt: `${date} 23:59:59` }
}

export function buildCoverageDedupeKey(childId: string, coverageDate: string): string {
  return `${childId}:${coverageDate}`
}

export function isSameCoverageDay(a: CoverageWindow, b: CoverageWindow): boolean {
  return a.date === b.date
}

