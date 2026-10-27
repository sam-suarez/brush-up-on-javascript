import type { Topic } from "../types";

const topic: Topic = {
  course: "practice",
  slug: "fundamentals",
  title: "JavaScript Fundamentals",
  description: "String and number manipulation, formatting, parsing and a few classics.",
  tags: ["strings", "numbers", "coercion"],
  count: 24,
  challenges: [
    {
      slug: "reverse-string",
      title: "Reverse a string",
      kind: "implement",
      difficulty: 1,
      tags: ["strings"],
      description: `Write \`reverse(str)\` that returns the characters of \`str\` in reverse order. An empty string returns an empty string.

Example: \`reverse("hello")\` → \`"olleh"\``,
      starter: `function reverse(str) {\n  \n}`,
      solution: `function reverse(str) {\n  return [...str].reverse().join("");\n}`,
      tests: [
        { name: 'reverses "hello"', code: `assert.equal(reverse("hello"), "olleh");` },
        { name: "keeps spaces and punctuation in place of the reversal", code: `assert.equal(reverse("ab, cd!"), "!dc ,ba");` },
        { name: "returns an empty string for an empty string", code: `assert.equal(reverse(""), "");` },
        { name: "returns a single character unchanged", code: `assert.equal(reverse("x"), "x");` },
        { name: "a palindrome reverses to itself", code: `assert.equal(reverse("racecar"), "racecar");` },
      ],
    },
    {
      slug: "capitalize-first",
      title: "Capitalize the first letter",
      kind: "implement",
      difficulty: 1,
      tags: ["strings"],
      description: `Write \`capitalize(str)\` that upper-cases the first character and leaves the rest untouched. An empty string returns \`""\`.

Example: \`capitalize("hello world")\` → \`"Hello world"\``,
      starter: `function capitalize(str) {\n  \n}`,
      solution: `function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}`,
      tests: [
        { name: "upper-cases the first letter", code: `assert.equal(capitalize("hello world"), "Hello world");` },
        { name: "leaves the rest of the string untouched", code: `assert.equal(capitalize("hELLO"), "HELLO");` },
        { name: "handles an empty string", code: `assert.equal(capitalize(""), "");` },
        { name: "leaves a leading non-letter alone", code: `assert.equal(capitalize("1st place"), "1st place");` },
        { name: "handles a single character", code: `assert.equal(capitalize("a"), "A");` },
      ],
    },
    {
      slug: "capitalize-words",
      title: "Capitalize each word",
      kind: "implement",
      difficulty: 1,
      tags: ["strings"],
      description: `Write \`capitalizeWords(str)\` that upper-cases the first letter of every space-separated word and lower-cases the rest of each word. Preserve the original spacing, including repeated spaces.

Example: \`capitalizeWords("hELLO wORLD")\` → \`"Hello World"\``,
      starter: `function capitalizeWords(str) {\n  \n}`,
      solution: `function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}`,
      tests: [
        { name: "capitalizes each word", code: `assert.equal(capitalizeWords("the quick brown fox"), "The Quick Brown Fox");` },
        { name: "lower-cases the rest of each word", code: `assert.equal(capitalizeWords("hELLO wORLD"), "Hello World");` },
        { name: "preserves repeated and edge spaces", code: `assert.equal(capitalizeWords(" a  b "), " A  B ");` },
        { name: "handles an empty string", code: `assert.equal(capitalizeWords(""), "");` },
        { name: "handles a single word", code: `assert.equal(capitalizeWords("javaSCRIPT"), "Javascript");` },
      ],
    },
    {
      slug: "count-vowels",
      title: "Count vowels",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "regex"],
      description: `Write \`countVowels(str)\` that returns how many vowels (\`a e i o u\`, either case) \`str\` contains. \`y\` is not a vowel.

Example: \`countVowels("Hello World")\` → \`3\``,
      starter: `function countVowels(str) {\n  \n}`,
      solution: `function countVowels(str) {\n  return str.match(/[aeiou]/gi)?.length ?? 0;\n}`,
      tests: [
        { name: 'counts 3 in "Hello World"', code: `assert.equal(countVowels("Hello World"), 3);` },
        { name: "counts upper-case vowels", code: `assert.equal(countVowels("AEIOU aeiou"), 10);` },
        { name: "returns 0 when there are no vowels", code: `assert.equal(countVowels("rhythm"), 0);` },
        { name: "returns 0 for an empty string", code: `assert.equal(countVowels(""), 0);` },
        { name: "does not count y", code: `assert.equal(countVowels("yay"), 1);` },
      ],
    },
    {
      slug: "is-palindrome",
      title: "Is palindrome (ignore case and non-letters)",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "regex"],
      description: `Write \`isPalindrome(str)\` that returns \`true\` if \`str\` reads the same backwards, ignoring case and every character that is not an ASCII letter (\`a\`–\`z\`). Digits, spaces and punctuation are all ignored. An empty string is a palindrome.

Example: \`isPalindrome("A man, a plan, a canal: Panama")\` → \`true\``,
      starter: `function isPalindrome(str) {\n  \n}`,
      solution: `function isPalindrome(str) {
  const letters = str.toLowerCase().replace(/[^a-z]/g, "");
  return letters === [...letters].reverse().join("");
}`,
      tests: [
        { name: "recognises a classic palindrome sentence", code: `assert.equal(isPalindrome("A man, a plan, a canal: Panama"), true);` },
        { name: "rejects a non-palindrome", code: `assert.equal(isPalindrome("race a car"), false);` },
        { name: "ignores case", code: `assert.equal(isPalindrome("RaceCar"), true);` },
        { name: "ignores punctuation and quotes", code: `assert.equal(isPalindrome("No 'x' in Nixon"), true);` },
        { name: "ignores digits", code: `assert.equal(isPalindrome("ab12ba"), true);` },
        { name: "treats an empty string as a palindrome", code: `assert.equal(isPalindrome(""), true);` },
      ],
    },
    {
      slug: "count-words",
      title: "Count words",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "regex"],
      description: `Write \`countWords(str)\` that returns the number of words in \`str\`. Words are separated by any run of whitespace (spaces, tabs, newlines); leading and trailing whitespace does not count. Empty or all-whitespace strings have \`0\` words.

Example: \`countWords("  hello   big world ")\` → \`3\``,
      starter: `function countWords(str) {\n  return str.split(" ").length;\n}`,
      solution: `function countWords(str) {\n  const trimmed = str.trim();\n  return trimmed === "" ? 0 : trimmed.split(/\\s+/).length;\n}`,
      tests: [
        { name: "counts simple words", code: `assert.equal(countWords("one two three"), 3);` },
        { name: "ignores repeated, leading and trailing spaces", code: `assert.equal(countWords("  hello   big world "), 3);` },
        { name: "treats tabs and newlines as separators", code: `assert.equal(countWords("a\\tb\\nc"), 3);` },
        { name: "returns 0 for an empty string", code: `assert.equal(countWords(""), 0);` },
        { name: "returns 0 for whitespace only", code: `assert.equal(countWords("   \\n "), 0);` },
      ],
    },
    {
      slug: "truncate",
      title: "Truncate with an ellipsis",
      kind: "implement",
      difficulty: 1,
      tags: ["strings"],
      description: `Write \`truncate(str, max)\` that returns \`str\` unchanged if its length is at most \`max\`. Otherwise cut it and append \`"..."\` (three ASCII dots) so the result is exactly \`max\` characters long. You can assume \`max >= 3\`.

Example: \`truncate("Hello world", 8)\` → \`"Hello..."\``,
      starter: `function truncate(str, max) {\n  return str.slice(0, max) + "...";\n}`,
      solution: `function truncate(str, max) {\n  return str.length <= max ? str : str.slice(0, max - 3) + "...";\n}`,
      tests: [
        { name: "truncates to exactly max characters", code: `assert.equal(truncate("Hello world", 8), "Hello...");` },
        { name: "leaves a string of exactly max characters alone", code: `assert.equal(truncate("Hello", 5), "Hello");` },
        { name: "leaves a shorter string alone", code: `assert.equal(truncate("Hi", 10), "Hi");` },
        { name: "handles max = 3", code: `assert.equal(truncate("abcdef", 3), "...");` },
        { name: "handles an empty string", code: `assert.equal(truncate("", 5), "");` },
      ],
    },
    {
      slug: "zero-pad",
      title: "Pad a number with zeros",
      kind: "implement",
      difficulty: 2,
      tags: ["strings", "numbers"],
      description: `Write \`zeroPad(n, width)\` that returns the integer \`n\` as a string with leading zeros so it has at least \`width\` digits. For negative numbers the minus sign goes first and does not count towards \`width\`. Numbers that already have \`width\` or more digits are returned as-is.

Example: \`zeroPad(-7, 3)\` → \`"-007"\``,
      starter: `function zeroPad(n, width) {\n  return String(n).padStart(width, "0");\n}`,
      solution: `function zeroPad(n, width) {\n  const digits = String(Math.abs(n)).padStart(width, "0");\n  return n < 0 ? "-" + digits : digits;\n}`,
      tests: [
        { name: "pads a positive number", code: `assert.equal(zeroPad(7, 3), "007");` },
        { name: "puts the sign before the zeros", code: `assert.equal(zeroPad(-7, 3), "-007");` },
        { name: "leaves a number with enough digits alone", code: `assert.equal(zeroPad(12345, 3), "12345");` },
        { name: "pads zero", code: `assert.equal(zeroPad(0, 2), "00");` },
        { name: "does not pad a negative number that is wide enough", code: `assert.equal(zeroPad(-123, 2), "-123");` },
      ],
      hints: ["`padStart` on `String(-7)` pads in front of the minus sign."],
    },
    {
      slug: "swap-case",
      title: "Swap case",
      kind: "implement",
      difficulty: 1,
      tags: ["strings"],
      description: `Write \`swapCase(str)\` that turns upper-case letters into lower-case and vice versa. Non-letters are unchanged.

Example: \`swapCase("Hello World 42!")\` → \`"hELLO wORLD 42!"\``,
      starter: `function swapCase(str) {\n  \n}`,
      solution: `function swapCase(str) {
  return [...str]
    .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join("");
}`,
      tests: [
        { name: "swaps the case of every letter", code: `assert.equal(swapCase("Hello World"), "hELLO wORLD");` },
        { name: "leaves digits and punctuation alone", code: `assert.equal(swapCase("abc 42!"), "ABC 42!");` },
        { name: "handles an empty string", code: `assert.equal(swapCase(""), "");` },
        { name: "swapping twice restores the original", code: `assert.equal(swapCase(swapCase("MiXeD cAsE")), "MiXeD cAsE");` },
      ],
    },
    {
      slug: "dedupe-chars",
      title: "Remove duplicate characters",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "sets"],
      description: `Write \`dedupeChars(str)\` that removes repeated characters, keeping the first occurrence of each in order. The comparison is case-sensitive, and spaces count as characters.

Example: \`dedupeChars("banana")\` → \`"ban"\``,
      starter: `function dedupeChars(str) {\n  \n}`,
      solution: `function dedupeChars(str) {\n  return [...new Set(str)].join("");\n}`,
      tests: [
        { name: 'turns "banana" into "ban"', code: `assert.equal(dedupeChars("banana"), "ban");` },
        { name: "keeps first occurrences in order", code: `assert.equal(dedupeChars("mississippi"), "misp");` },
        { name: "is case-sensitive", code: `assert.equal(dedupeChars("AaAa"), "Aa");` },
        { name: "treats spaces as characters", code: `assert.equal(dedupeChars("a b c"), "a bc");` },
        { name: "handles an empty string", code: `assert.equal(dedupeChars(""), "");` },
      ],
    },
    {
      slug: "most-frequent-char",
      title: "Most frequent character",
      kind: "implement",
      difficulty: 2,
      tags: ["strings", "maps"],
      description: `Write \`mostFrequentChar(str)\` that returns the character appearing most often in \`str\`, ignoring spaces. On a tie, return the one that appears first in the string. Return \`null\` if there are no non-space characters.

Example: \`mostFrequentChar("hello world")\` → \`"l"\``,
      starter: `function mostFrequentChar(str) {\n  \n}`,
      solution: `function mostFrequentChar(str) {
  const counts = new Map();
  for (const ch of str) {
    if (ch !== " ") counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  let best = null;
  let bestCount = 0;
  for (const [ch, count] of counts) {
    if (count > bestCount) [best, bestCount] = [ch, count];
  }
  return best;
}`,
      tests: [
        { name: 'finds "l" in "hello world"', code: `assert.equal(mostFrequentChar("hello world"), "l");` },
        { name: "breaks ties by first appearance", code: `assert.equal(mostFrequentChar("abab"), "a"); assert.equal(mostFrequentChar("baab"), "b");` },
        { name: "a later character can win with a higher count", code: `assert.equal(mostFrequentChar("aabbb"), "b");` },
        { name: "ignores spaces", code: `assert.equal(mostFrequentChar("a    b b"), "b");` },
        { name: "returns null for an empty string", code: `assert.equal(mostFrequentChar(""), null);` },
        { name: "returns null for spaces only", code: `assert.equal(mostFrequentChar("   "), null);` },
      ],
      hints: ["A `Map` iterates in insertion order, which is first-appearance order."],
    },
    {
      slug: "is-anagram",
      title: "Is anagram",
      kind: "implement",
      difficulty: 2,
      tags: ["strings"],
      description: `Write \`isAnagram(a, b)\` that returns \`true\` if the two strings contain the same letters the same number of times, ignoring case and whitespace.

Example: \`isAnagram("Dormitory", "dirty room")\` → \`true\``,
      starter: `function isAnagram(a, b) {\n  return a.length === b.length;\n}`,
      solution: `function isAnagram(a, b) {
  const normalize = (s) => [...s.toLowerCase().replace(/\\s/g, "")].sort().join("");
  return normalize(a) === normalize(b);
}`,
      tests: [
        { name: "recognises a simple anagram", code: `assert.equal(isAnagram("listen", "silent"), true);` },
        { name: "ignores case and whitespace", code: `assert.equal(isAnagram("Dormitory", "dirty room"), true);` },
        { name: "rejects same letters with different counts", code: `assert.equal(isAnagram("aab", "abb"), false);` },
        { name: "rejects different lengths", code: `assert.equal(isAnagram("abc", "abcd"), false);` },
        { name: "rejects different letters of the same length", code: `assert.equal(isAnagram("abc", "abd"), false);` },
        { name: "two empty strings are anagrams", code: `assert.equal(isAnagram("", ""), true);` },
      ],
    },
    {
      slug: "camel-to-kebab",
      title: "camelCase to kebab-case",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "regex"],
      description: `Write \`camelToKebab(str)\` that converts a camelCase identifier (starting with a lower-case letter) to kebab-case: every upper-case letter becomes \`-\` followed by its lower-case form.

Example: \`camelToKebab("backgroundColor")\` → \`"background-color"\``,
      starter: `function camelToKebab(str) {\n  \n}`,
      solution: `function camelToKebab(str) {\n  return str.replace(/[A-Z]/g, (ch) => "-" + ch.toLowerCase());\n}`,
      tests: [
        { name: "converts backgroundColor", code: `assert.equal(camelToKebab("backgroundColor"), "background-color");` },
        { name: "converts several humps", code: `assert.equal(camelToKebab("borderTopLeftRadius"), "border-top-left-radius");` },
        { name: "splits consecutive capitals one by one", code: `assert.equal(camelToKebab("fontSizeXL"), "font-size-x-l");` },
        { name: "leaves a single lower-case word alone", code: `assert.equal(camelToKebab("color"), "color");` },
        { name: "handles an empty string", code: `assert.equal(camelToKebab(""), "");` },
      ],
    },
    {
      slug: "snake-to-camel",
      title: "snake_case to camelCase",
      kind: "implement",
      difficulty: 1,
      tags: ["strings", "regex"],
      description: `Write \`snakeToCamel(str)\` that converts a lower-case snake_case identifier to camelCase: drop each underscore and upper-case the letter after it.

Example: \`snakeToCamel("user_first_name")\` → \`"userFirstName"\``,
      starter: `function snakeToCamel(str) {\n  return str.replaceAll("_", "");\n}`,
      solution: `function snakeToCamel(str) {\n  return str.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());\n}`,
      tests: [
        { name: "converts user_first_name", code: `assert.equal(snakeToCamel("user_first_name"), "userFirstName");` },
        { name: "converts a single underscore", code: `assert.equal(snakeToCamel("is_valid"), "isValid");` },
        { name: "leaves a word without underscores alone", code: `assert.equal(snakeToCamel("name"), "name");` },
        { name: "handles an empty string", code: `assert.equal(snakeToCamel(""), "");` },
      ],
    },
    {
      slug: "format-currency",
      title: "Format a number as currency",
      kind: "implement",
      difficulty: 1,
      tags: ["numbers", "intl"],
      description: `Write \`formatCurrency(amount, currency = "USD")\` that formats \`amount\` using the \`en-US\` locale (pin it explicitly so the output never depends on the user's machine). Use the currency's standard number of decimals, with thousands separators and the sign in front.

Example: \`formatCurrency(1234.5)\` → \`"$1,234.50"\`

Other cases the tests check: \`-5\` → \`"-$5.00"\`, \`"EUR"\` uses \`€\`, and \`"JPY"\` has no decimals (\`1234.5\` → \`"¥1,235"\`).`,
      starter: `function formatCurrency(amount, currency = "USD") {\n  return "$" + amount.toFixed(2);\n}`,
      solution: `function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}`,
      tests: [
        { name: "formats dollars with a thousands separator and 2 decimals", code: `assert.equal(formatCurrency(1234.5), "$1,234.50");` },
        { name: "formats zero", code: `assert.equal(formatCurrency(0), "$0.00");` },
        { name: "puts the minus sign before the symbol", code: `assert.equal(formatCurrency(-5), "-$5.00");` },
        { name: "formats millions", code: `assert.equal(formatCurrency(1234567.891), "$1,234,567.89");` },
        { name: "supports EUR", code: `assert.equal(formatCurrency(1234.5, "EUR"), "€1,234.50");` },
        { name: "uses no decimals for JPY", code: `assert.equal(formatCurrency(1234.5, "JPY"), "¥1,235");` },
      ],
    },
    {
      slug: "parse-number-safely",
      title: "Parse a number safely",
      kind: "implement",
      difficulty: 2,
      tags: ["numbers", "coercion"],
      description: `Write \`parseNumber(input)\` that returns a finite number or \`null\`.

- A number is returned as-is if it is finite.
- A string is trimmed; if what remains is non-empty and \`Number()\` turns it into a finite number, return that number.
- Everything else returns \`null\`: empty or blank strings, partial numbers like \`"12px"\`, \`NaN\`, \`Infinity\` (as number or string), \`null\`, \`undefined\`, booleans, arrays and objects.

Example: \`parseNumber(" 3.14 ")\` → \`3.14\`, but \`parseNumber("")\` → \`null\` (not \`0\`).`,
      starter: `function parseNumber(input) {\n  const n = Number(input);\n  return Number.isNaN(n) ? null : n;\n}`,
      solution: `function parseNumber(input) {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string" || input.trim() === "") return null;
  const n = Number(input);
  return Number.isFinite(n) ? n : null;
}`,
      tests: [
        { name: "parses numeric strings", code: `assert.equal(parseNumber("42"), 42); assert.equal(parseNumber("-7"), -7); assert.equal(parseNumber("1e3"), 1000);` },
        { name: "trims surrounding whitespace", code: `assert.equal(parseNumber(" 3.14 "), 3.14);` },
        { name: "returns finite numbers as-is", code: `assert.equal(parseNumber(0), 0); assert.equal(parseNumber(12.5), 12.5);` },
        { name: "rejects empty and blank strings", code: `assert.equal(parseNumber(""), null); assert.equal(parseNumber("   "), null);` },
        { name: "rejects partial and non-numeric strings", code: `assert.equal(parseNumber("12px"), null); assert.equal(parseNumber("abc"), null);` },
        { name: "rejects NaN and Infinity", code: `assert.equal(parseNumber(NaN), null); assert.equal(parseNumber(Infinity), null); assert.equal(parseNumber("Infinity"), null);` },
        { name: "rejects non-string, non-number values", code: `for (const v of [null, undefined, true, false, [], [5], {}]) assert.equal(parseNumber(v), null, String(v));` },
      ],
      hints: ["`Number(\"\")`, `Number(null)`, `Number([])` and `Number(false)` are all `0`."],
    },
    {
      slug: "round-to",
      title: "Round to n decimals (fix: floating point)",
      kind: "fix",
      difficulty: 3,
      tags: ["numbers"],
      description: `\`roundTo(n, decimals)\` should round half up based on the decimal digits you see when the number is printed, so \`1.005\` rounds to \`1.01\` and \`2.675\` to \`2.68\`. It currently gets some of these wrong. Fix it.

Example: \`roundTo(1.005, 2)\` → \`1.01\`

Ordinary values like \`roundTo(1.2345, 2)\` → \`1.23\` and whole numbers must keep working. You don't need to handle numbers whose string form already uses exponent notation.`,
      starter: `function roundTo(n, decimals) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}`,
      solution: `function roundTo(n, decimals) {
  // Shift the decimal point in the decimal string, so 1.005 becomes exactly 100.5.
  const shifted = Math.round(Number(\`\${n}e\${decimals}\`));
  return Number(\`\${shifted}e-\${decimals}\`);
}`,
      tests: [
        { name: "rounds 1.005 to 1.01", code: `assert.equal(roundTo(1.005, 2), 1.01);` },
        { name: "rounds 2.675 to 2.68", code: `assert.equal(roundTo(2.675, 2), 2.68);` },
        { name: "rounds 10.235 to 10.24", code: `assert.equal(roundTo(10.235, 2), 10.24);` },
        { name: "rounds ordinary values", code: `assert.equal(roundTo(1.2345, 2), 1.23); assert.equal(roundTo(1.4, 0), 1); assert.equal(roundTo(-1.234, 2), -1.23);` },
        { name: "leaves whole numbers alone", code: `assert.equal(roundTo(5, 2), 5);` },
      ],
      hints: [
        "Check what `1.005 * 100` actually evaluates to.",
        "`Number(\"1.005e2\")` is exactly `100.5`.",
      ],
    },
    {
      slug: "clamp",
      title: "Clamp a number",
      kind: "implement",
      difficulty: 1,
      tags: ["numbers"],
      description: `Write \`clamp(n, min, max)\` that returns \`n\` limited to the inclusive range \`[min, max]\`. Throw a \`RangeError\` if \`min > max\`.

Example: \`clamp(15, 0, 10)\` → \`10\``,
      starter: `function clamp(n, min, max) {\n  return Math.max(min, Math.min(n, max));\n}`,
      solution: `function clamp(n, min, max) {
  if (min > max) throw new RangeError(\`min (\${min}) must not exceed max (\${max})\`);
  return Math.min(Math.max(n, min), max);
}`,
      tests: [
        { name: "returns n when inside the range", code: `assert.equal(clamp(5, 0, 10), 5);` },
        { name: "clamps below min", code: `assert.equal(clamp(-5, 0, 10), 0);` },
        { name: "clamps above max", code: `assert.equal(clamp(15, 0, 10), 10);` },
        { name: "keeps the boundaries", code: `assert.equal(clamp(0, 0, 10), 0); assert.equal(clamp(10, 0, 10), 10);` },
        { name: "works with negative ranges", code: `assert.equal(clamp(-20, -10, -5), -10);` },
        { name: "throws a RangeError when min > max", code: `assert.throws(() => clamp(1, 10, 0), RangeError);` },
      ],
    },
    {
      slug: "is-integer",
      title: "Integer vs float",
      kind: "implement",
      difficulty: 1,
      tags: ["numbers", "coercion"],
      description: `Write \`classifyNumber(value)\` that returns \`"integer"\` for finite whole numbers, \`"float"\` for finite numbers with a fractional part, and \`"invalid"\` for anything else: \`NaN\`, \`±Infinity\` and non-numbers (including numeric strings like \`"5"\`). Note that \`5.0\` is an integer in JavaScript.

Example: \`classifyNumber(0.1 + 0.2)\` → \`"float"\``,
      starter: `function classifyNumber(value) {\n  return value % 1 === 0 ? "integer" : "float";\n}`,
      solution: `function classifyNumber(value) {
  if (!Number.isFinite(value)) return "invalid";
  return Number.isInteger(value) ? "integer" : "float";
}`,
      tests: [
        { name: "classifies integers", code: `assert.equal(classifyNumber(5), "integer"); assert.equal(classifyNumber(-3), "integer"); assert.equal(classifyNumber(0), "integer");` },
        { name: "treats 5.0 as an integer", code: `assert.equal(classifyNumber(5.0), "integer");` },
        { name: "classifies floats", code: `assert.equal(classifyNumber(0.1 + 0.2), "float"); assert.equal(classifyNumber(-2.5), "float");` },
        { name: "NaN and Infinity are invalid", code: `assert.equal(classifyNumber(NaN), "invalid"); assert.equal(classifyNumber(Infinity), "invalid"); assert.equal(classifyNumber(-Infinity), "invalid");` },
        { name: "non-numbers are invalid, even numeric strings", code: `for (const v of ["5", null, true, [], undefined]) assert.equal(classifyNumber(v), "invalid", String(v));` },
      ],
    },
    {
      slug: "fizzbuzz",
      title: "FizzBuzz",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration"],
      description: `Write \`fizzBuzz(n)\` that returns an array of strings for \`1\` to \`n\`: \`"Fizz"\` for multiples of 3, \`"Buzz"\` for multiples of 5, \`"FizzBuzz"\` for multiples of both, otherwise the number as a string. \`fizzBuzz(0)\` returns \`[]\`.

Example: \`fizzBuzz(5)\` → \`["1", "2", "Fizz", "4", "Buzz"]\``,
      starter: `function fizzBuzz(n) {\n  \n}`,
      solution: `function fizzBuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    return (k % 3 === 0 ? "Fizz" : "") + (k % 5 === 0 ? "Buzz" : "") || String(k);
  });
}`,
      tests: [
        { name: "handles 1 to 5", code: `assert.deepEqual(fizzBuzz(5), ["1", "2", "Fizz", "4", "Buzz"]);` },
        { name: "uses FizzBuzz for 15", code: `assert.equal(fizzBuzz(15)[14], "FizzBuzz");` },
        { name: "returns n items", code: `assert.equal(fizzBuzz(100).length, 100);` },
        { name: "returns strings for plain numbers", code: `assert.equal(fizzBuzz(1)[0], "1");` },
        { name: "returns an empty array for 0", code: `assert.deepEqual(fizzBuzz(0), []);` },
      ],
    },
    {
      slug: "sum-of-digits",
      title: "Sum of digits",
      kind: "implement",
      difficulty: 1,
      tags: ["numbers"],
      description: `Write \`sumOfDigits(n)\` that returns the sum of the decimal digits of the integer \`n\`. Negative numbers use their absolute value.

Example: \`sumOfDigits(-123)\` → \`6\``,
      starter: `function sumOfDigits(n) {\n  \n}`,
      solution: `function sumOfDigits(n) {
  let rest = Math.abs(n);
  let sum = 0;
  while (rest > 0) {
    sum += rest % 10;
    rest = Math.floor(rest / 10);
  }
  return sum;
}`,
      tests: [
        { name: "sums 123 to 6", code: `assert.equal(sumOfDigits(123), 6);` },
        { name: "ignores the sign", code: `assert.equal(sumOfDigits(-123), 6);` },
        { name: "returns 0 for 0", code: `assert.equal(sumOfDigits(0), 0);` },
        { name: "handles a single digit", code: `assert.equal(sumOfDigits(7), 7);` },
        { name: "handles larger numbers", code: `assert.equal(sumOfDigits(9999), 36); assert.equal(sumOfDigits(1000001), 2);` },
      ],
    },
    {
      slug: "is-prime",
      title: "Is prime",
      kind: "implement",
      difficulty: 2,
      tags: ["numbers"],
      description: `Write \`isPrime(n)\` that returns \`true\` if \`n\` is a prime number. Numbers below 2 and non-integers are not prime. It must be fast enough for \`1_000_000_007\` (check divisors only up to \`√n\`).

Example: \`isPrime(97)\` → \`true\``,
      starter: `function isPrime(n) {\n  return n % 2 !== 0;\n}`,
      solution: `function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}`,
      tests: [
        { name: "2 and 3 are prime", code: `assert.equal(isPrime(2), true); assert.equal(isPrime(3), true);` },
        { name: "0, 1 and negatives are not prime", code: `assert.equal(isPrime(0), false); assert.equal(isPrime(1), false); assert.equal(isPrime(-7), false);` },
        { name: "perfect squares are not prime", code: `for (const n of [4, 9, 25, 49, 121]) assert.equal(isPrime(n), false, String(n));` },
        { name: "recognises larger primes", code: `assert.equal(isPrime(97), true); assert.equal(isPrime(7919), true);` },
        { name: "is fast for 1_000_000_007", code: `assert.equal(isPrime(1_000_000_007), true);` },
        { name: "non-integers are not prime", code: `assert.equal(isPrime(2.5), false);` },
      ],
    },
    {
      slug: "roman-numerals",
      title: "Convert to Roman numerals",
      kind: "implement",
      difficulty: 2,
      tags: ["strings", "numbers"],
      description: `Write \`toRoman(n)\` that converts an integer from \`1\` to \`3999\` to Roman numerals, using subtractive forms (\`IV\`, \`IX\`, \`XL\`, \`XC\`, \`CD\`, \`CM\`). Throw a \`RangeError\` for anything outside that range.

Example: \`toRoman(1994)\` → \`"MCMXCIV"\``,
      starter: `function toRoman(n) {\n  \n}`,
      solution: `const NUMERALS = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) throw new RangeError(\`Out of range: \${n}\`);
  let result = "";
  for (const [value, symbol] of NUMERALS) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}`,
      tests: [
        { name: "converts single symbols", code: `assert.equal(toRoman(1), "I"); assert.equal(toRoman(5), "V"); assert.equal(toRoman(1000), "M");` },
        { name: "uses subtractive forms", code: `assert.deepEqual([4, 9, 40, 90, 400, 900].map(toRoman), ["IV", "IX", "XL", "XC", "CD", "CM"]);` },
        { name: "converts 1994", code: `assert.equal(toRoman(1994), "MCMXCIV");` },
        { name: "converts 944", code: `assert.equal(toRoman(944), "CMXLIV");` },
        { name: "converts 3999", code: `assert.equal(toRoman(3999), "MMMCMXCIX");` },
        { name: "throws a RangeError outside 1..3999", code: `assert.throws(() => toRoman(0), RangeError); assert.throws(() => toRoman(4000), RangeError);` },
      ],
      hints: ["A table of value/symbol pairs that already includes the subtractive pairs makes this a greedy loop."],
    },
    {
      slug: "coercion-comparisons",
      title: "Fix the comparisons (coercion traps)",
      kind: "fix",
      difficulty: 2,
      tags: ["coercion"],
      description: `Each helper below misbehaves for some inputs because of type coercion. Make every helper match its comment.

Example: \`isZero("")\` → \`false\`, \`withDefault(0, 5)\` → \`0\``,
      starter: `// true only for the number 0 (and -0)
function isZero(value) {
  return value == 0;
}

// true only for the empty string
function isEmptyString(value) {
  return value == "";
}

// returns value unless it is null or undefined
function withDefault(value, fallback) {
  return value || fallback;
}`,
      solution: `// true only for the number 0 (and -0)
function isZero(value) {
  return value === 0;
}

// true only for the empty string
function isEmptyString(value) {
  return value === "";
}

// returns value unless it is null or undefined
function withDefault(value, fallback) {
  return value ?? fallback;
}`,
      tests: [
        { name: "isZero accepts 0 and -0", code: `assert.equal(isZero(0), true); assert.equal(isZero(-0), true);` },
        { name: "isZero rejects values that merely coerce to 0", code: `for (const v of ["", "0", [], false, null, " "]) assert.equal(isZero(v), false, JSON.stringify(v));` },
        { name: "isEmptyString accepts only the empty string", code: `assert.equal(isEmptyString(""), true); for (const v of [0, false, [], [""]]) assert.equal(isEmptyString(v), false, JSON.stringify(v));` },
        { name: "withDefault keeps falsy but present values", code: `assert.equal(withDefault(0, 5), 0); assert.equal(withDefault("", "x"), ""); assert.equal(withDefault(false, true), false);` },
        { name: "withDefault falls back for null and undefined", code: `assert.equal(withDefault(null, 5), 5); assert.equal(withDefault(undefined, 5), 5);` },
      ],
    },
  ],
};

export default topic;
