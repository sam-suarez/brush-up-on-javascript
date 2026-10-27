import type { Topic } from "../types";

const topic: Topic = {
  course: "practice",
  slug: "dates",
  title: "JavaScript Dates",
  description: "Construct, format, add, diff and compare dates without a library.",
  tags: ["Date", "formatting"],
  count: 8,
  challenges: [
    {
      slug: "create-from-parts",
      title: "Create a date from parts (month is zero-based)",
      kind: "fix",
      difficulty: 1,
      tags: ["dates"],
      description: `\`makeDate(year, month, day)\` takes a human month (\`1\` = January) and should return a local \`Date\` at midnight on that day. It returns the wrong date. Fix it.

Example: \`makeDate(2024, 1, 15)\` → \`Mon Jan 15 2024 00:00 (local time)\``,
      starter: `function makeDate(year, month, day) {\n  return new Date(year, month, day);\n}\n`,
      solution: `function makeDate(year, month, day) {\n  return new Date(year, month - 1, day);\n}`,
      tests: [
        {
          name: "January is month 1",
          code: `const d = makeDate(2024, 1, 15);
assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate()], [2024, 0, 15]);`,
        },
        {
          name: "December 31 stays in the same year",
          code: `const d = makeDate(2023, 12, 31);
assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate()], [2023, 11, 31]);`,
        },
        { name: "is local midnight", code: `const d = makeDate(2024, 6, 1); assert.equal(d.getHours() + d.getMinutes(), 0);` },
      ],
    },
    {
      slug: "format-iso-date",
      title: "Format as YYYY-MM-DD",
      kind: "implement",
      difficulty: 1,
      tags: ["dates", "formatting"],
      description: `Write \`formatDate(date)\` that returns the date's local calendar day as \`"YYYY-MM-DD"\`, zero-padded.

Don't use \`toISOString()\`: it formats in UTC, so late-evening or early-morning dates come out on the wrong day in most time zones.

Example: \`formatDate(new Date(2024, 0, 5))\` → \`"2024-01-05"\``,
      starter: `function formatDate(date) {\n  \n}\n`,
      solution: `function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}`,
      tests: [
        { name: "zero-pads month and day", code: `assert.equal(formatDate(new Date(2024, 0, 5)), "2024-01-05");` },
        { name: "uses the local day late at night", code: `assert.equal(formatDate(new Date(2023, 11, 31, 23, 59)), "2023-12-31");` },
        { name: "uses the local day just after midnight", code: `assert.equal(formatDate(new Date(2024, 6, 4, 0, 1)), "2024-07-04");` },
        { name: "handles two-digit months", code: `assert.equal(formatDate(new Date(2025, 10, 30)), "2025-11-30");` },
      ],
    },
    {
      slug: "add-days",
      title: "Add days",
      kind: "implement",
      difficulty: 2,
      tags: ["dates", "immutability"],
      description: `Write \`addDays(date, n)\` that returns a new \`Date\` \`n\` calendar days later (\`n\` may be negative), keeping the local time of day. Don't mutate the input. Month and year boundaries and daylight-saving changes must work, so adding \`n * 86400000\` ms is not correct.

Example: \`addDays(new Date(2024, 0, 31), 1)\` → \`Thu Feb 01 2024 00:00 (local time)\``,
      starter: `function addDays(date, n) {\n  \n}\n`,
      solution: `function addDays(date, n) {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}`,
      hints: ["`setDate` normalises out-of-range days for you, including day 0 and negatives."],
      tests: [
        { name: "rolls over the month", code: `assert.deepEqual(addDays(new Date(2024, 0, 31), 1), new Date(2024, 1, 1));` },
        { name: "rolls over the year", code: `assert.deepEqual(addDays(new Date(2023, 11, 30), 3), new Date(2024, 0, 2));` },
        { name: "handles negative n", code: `assert.deepEqual(addDays(new Date(2024, 2, 1), -1), new Date(2024, 1, 29));` },
        { name: "keeps the time of day", code: `assert.deepEqual(addDays(new Date(2024, 4, 10, 15, 30), 2), new Date(2024, 4, 12, 15, 30));` },
        {
          name: "keeps local midnight across daylight-saving changes",
          code: `for (const [y, m, d] of [[2024, 2, 9], [2024, 2, 30], [2024, 9, 26], [2024, 10, 2]]) {
  assert.deepEqual(addDays(new Date(y, m, d), 2), new Date(y, m, d + 2));
}`,
        },
        { name: "does not mutate the input", code: `const d = new Date(2024, 0, 1); addDays(d, 5); assert.equal(d.getDate(), 1);` },
      ],
    },
    {
      slug: "diff-in-days",
      title: "Difference in days",
      kind: "implement",
      difficulty: 2,
      tags: ["dates"],
      description: `Write \`daysBetween(a, b)\` that returns the number of local calendar days from \`a\` to \`b\` (negative if \`b\` is earlier). Time of day is ignored, and the answer must be right across daylight-saving changes.

Example: \`daysBetween(new Date(2024, 0, 1), new Date(2024, 2, 1))\` → \`60\``,
      starter: `function daysBetween(a, b) {\n  return Math.floor((b - a) / 86400000);\n}\n`,
      solution: `function daysBetween(a, b) {
  const dayNumber = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000;
  return dayNumber(b) - dayNumber(a);
}`,
      hints: ["Map each local calendar day to a UTC midnight, where every day is exactly 24 hours."],
      tests: [
        { name: "counts across a leap February", code: `assert.equal(daysBetween(new Date(2024, 0, 1), new Date(2024, 2, 1)), 60);` },
        { name: "ignores the time of day", code: `assert.equal(daysBetween(new Date(2024, 0, 1, 23, 0), new Date(2024, 0, 2, 1, 0)), 1);` },
        { name: "is negative when b is earlier", code: `assert.equal(daysBetween(new Date(2024, 5, 10), new Date(2024, 5, 3)), -7);` },
        { name: "same day is 0", code: `assert.equal(daysBetween(new Date(2024, 5, 10, 8), new Date(2024, 5, 10, 20)), 0);` },
        {
          name: "is exact across daylight-saving changes",
          code: `assert.equal(daysBetween(new Date(2024, 2, 1), new Date(2024, 3, 1)), 31);
assert.equal(daysBetween(new Date(2024, 9, 1), new Date(2024, 11, 1)), 61);
assert.equal(daysBetween(new Date(2024, 0, 1), new Date(2025, 0, 1)), 366);`,
        },
      ],
    },
    {
      slug: "weekday-name",
      title: "Day of the week name",
      kind: "fix",
      difficulty: 1,
      tags: ["dates"],
      description: `\`weekdayName(date)\` should return the English name of the date's local weekday. It's wrong every day of the week. Fix it.

Example: \`weekdayName(new Date(2024, 0, 1))\` → \`"Monday"\``,
      starter: `const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function weekdayName(date) {
  return DAYS[date.getDay()];
}
`,
      solution: `const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function weekdayName(date) {
  return DAYS[date.getDay()];
}`,
      tests: [
        { name: "Jan 1 2024 is a Monday", code: `assert.equal(weekdayName(new Date(2024, 0, 1)), "Monday");` },
        { name: "handles Sunday", code: `assert.equal(weekdayName(new Date(2024, 0, 7)), "Sunday");` },
        { name: "handles the end of the week", code: `assert.equal(weekdayName(new Date(2024, 1, 29)), "Thursday"); assert.equal(weekdayName(new Date(2024, 2, 2)), "Saturday");` },
      ],
    },
    {
      slug: "is-leap-year",
      title: "Is leap year",
      kind: "implement",
      difficulty: 1,
      tags: ["dates"],
      description: `Write \`isLeapYear(year)\` for the Gregorian calendar: divisible by 4, except centuries, which must be divisible by 400.

Example: \`isLeapYear(1900)\` → \`false\``,
      starter: `function isLeapYear(year) {\n  return year % 4 === 0;\n}\n`,
      solution: `function isLeapYear(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;\n}`,
      tests: [
        { name: "2024 is a leap year", code: `assert.equal(isLeapYear(2024), true);` },
        { name: "2023 is not", code: `assert.equal(isLeapYear(2023), false);` },
        { name: "1900 is not (century)", code: `assert.equal(isLeapYear(1900), false);` },
        { name: "2000 is (divisible by 400)", code: `assert.equal(isLeapYear(2000), true);` },
      ],
    },
    {
      slug: "month-bounds",
      title: "Start and end of month",
      kind: "implement",
      difficulty: 2,
      tags: ["dates"],
      description: `Write \`monthBounds(date)\` that returns \`{ start, end }\` for the local month containing \`date\`: \`start\` is the 1st at 00:00:00.000 and \`end\` is the last day at 23:59:59.999, both local time.

Example: \`monthBounds(new Date(2024, 1, 10)).end\` → \`Thu Feb 29 2024 23:59:59.999 (local time)\``,
      starter: `function monthBounds(date) {\n  \n}\n`,
      solution: `function monthBounds(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0, 23, 59, 59, 999),
  };
}`,
      hints: ["Day `0` of next month is the last day of this month."],
      tests: [
        {
          name: "handles a leap February",
          code: `assert.deepEqual(monthBounds(new Date(2024, 1, 10, 13)), {
  start: new Date(2024, 1, 1),
  end: new Date(2024, 1, 29, 23, 59, 59, 999),
});`,
        },
        { name: "handles a non-leap February", code: `assert.equal(monthBounds(new Date(2023, 1, 1)).end.getDate(), 28);` },
        {
          name: "handles December",
          code: `assert.deepEqual(monthBounds(new Date(2024, 11, 31, 23, 59)), {
  start: new Date(2024, 11, 1),
  end: new Date(2024, 11, 31, 23, 59, 59, 999),
});`,
        },
        { name: "handles a 30-day month", code: `assert.equal(monthBounds(new Date(2024, 3, 30)).end.getDate(), 30);` },
      ],
    },
    {
      slug: "parse-and-compare",
      title: "Parse ISO strings and sort",
      kind: "implement",
      difficulty: 2,
      tags: ["dates"],
      description: `Write \`sortByTime(events)\` that takes events shaped \`{ name, at }\`, where \`at\` is an ISO 8601 string with an offset (\`Z\` or \`±hh:mm\`), and returns a new array sorted from earliest to latest instant. Don't mutate the input.

Comparing the strings directly is wrong when offsets differ.

Example: \`sortByTime([{ name: "b", at: "2024-03-01T08:00:00Z" }, { name: "a", at: "2024-03-01T09:00:00+02:00" }])\` → \`a first (07:00Z), then b\``,
      starter: `function sortByTime(events) {\n  return [...events].sort((x, y) => x.at.localeCompare(y.at));\n}\n`,
      solution: `function sortByTime(events) {
  return events.toSorted((x, y) => Date.parse(x.at) - Date.parse(y.at));
}`,
      tests: [
        {
          name: "accounts for offsets",
          code: `const events = [
  { name: "b", at: "2024-03-01T08:00:00Z" },
  { name: "a", at: "2024-03-01T09:00:00+02:00" },
  { name: "c", at: "2024-03-01T05:00:00-05:00" },
];
assert.deepEqual(sortByTime(events).map((e) => e.name), ["a", "b", "c"]);`,
        },
        {
          name: "sorts across days",
          code: `const events = [
  { name: "late", at: "2024-12-31T23:30:00-08:00" },
  { name: "early", at: "2025-01-01T01:00:00Z" },
];
assert.deepEqual(sortByTime(events).map((e) => e.name), ["early", "late"]);`,
        },
        {
          name: "does not mutate the input",
          code: `const events = [{ name: "y", at: "2024-01-02T00:00:00Z" }, { name: "x", at: "2024-01-01T00:00:00Z" }];
const sorted = sortByTime(events);
assert.notEqual(sorted, events);
assert.equal(events[0].name, "y");`,
        },
      ],
    },
  ],
};

export default topic;
