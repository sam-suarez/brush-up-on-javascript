# 04 — Curriculum

Five courses, 28 topics, 353 challenges. Counts match JSChallenger's challenge counts per topic (their listed totals included lessons and exams, which are excluded here). DOM Recursive Functions is expanded from 1 to 3 because one challenge is not a topic. Interview Prep is new.

Slugs are the URL segments. Titles are what the timeline shows.

## Course 1 — `core` · JavaScript Core (60)

Chips: functions · arrays · objects · loops. Where JSChallenger's Basics course starts for us.

### `functions-i` · Functions I (23)
1. declare-a-function — Declare a function
2. call-and-capture — Call a function and capture its return value
3. return-dont-log — Return a value instead of logging it
4. missing-function-keyword — Add the missing function keyword (fix)
5. missing-function-name — Add the missing function name (fix)
6. return-the-right-value — Return the right value (fix: unreachable code after return)
7. complete-the-body — Complete the function body
8. two-parameters — A function with two parameters
9. missing-parameters — Add the missing parameters (fix)
10. subtract-parameter-order — Find the bug: parameter order in subtract (fix)
11. complete-greet — Complete the greet function
12. function-as-argument — Pass a function as an argument
13. return-a-function — Return a function from a function
14. return-early — Return early with a guard clause
15. is-adult — isAdult
16. is-empty-string — isEmptyString
17. is-weekend — isWeekend
18. refactor-discount — Refactor repeated discount calculations into a function
19. refactor-math — Refactor duplicated math into a function
20. default-greeting — Default parameter: greeting
21. default-multiplier — Default parameter: multiplier
22. default-alongside-required — Default parameter alongside a required one
23. default-depends-on-earlier — Default parameter that depends on an earlier parameter

### `arrays` · Arrays (15)
1. create-numbers — Create an array of numbers
2. create-fruits — Create an array of fruits
3. mixed-types — Create an array with mixed types
4. access-by-index — Access an element by index
5. middle-element — Access the middle element
6. last-element — Get the last element of any array
7. length-of-list — Find the length of a movie list
8. songs-left — Count songs left in the playlist
9. change-by-index — Change an element by index
10. from-variables — Build an array from variables
11. index-of — Find the index of an element
12. chocolate-position — Find the chocolate's position (handle missing)
13. add-elements — Add an element to the end and to the start
14. swap-two — Swap two elements
15. replace-without-mutating — Replace an element at an index without mutating

### `objects` · Objects (13)
1. create-object — Create an object literal
2. dot-access — Access a property with dot notation
3. bracket-access — Access a property with bracket notation
4. nested-access — Access a nested property
5. add-property — Add a property to an existing object
6. update-property — Update a property
7. delete-property — Delete a property
8. has-property — Check whether a property exists
9. method-with-this — An object method that uses `this`
10. shorthand-properties — Shorthand property names
11. computed-keys — Computed property names
12. from-two-arrays — Build an object from a keys array and a values array
13. copy-with-change — Return a new object with one field changed

### `loops` · Loops (9)
1. for-sum — Sum numbers with a for loop
2. while-countdown — Count down with a while loop
3. for-of — Iterate an array with for...of
4. for-in — Iterate object keys with for...in
5. break-when-found — Break out of a loop when a value is found
6. continue-skip — Skip values with continue
7. nested-table-row — Nested loops: a multiplication table
8. string-characters — Loop over a string's characters
9. do-while — do...while: run at least once

## Course 2 — `intermediate` · Intermediate JavaScript (110)

Chips: ES6+ · array methods · logic building.

### `array-methods` · Array Methods (33)
1. foreach-log — forEach: log each item
2. map-double — map: double every number
3. map-pluck — map: extract a property from objects
4. map-with-index — map with index
5. filter-even — filter: even numbers
6. filter-by-property — filter: objects by property
7. filter-falsy — Filter out falsy values
8. find-first — find: the first match
9. find-index — findIndex
10. find-last — findLast
11. some-negative — some: any negative number
12. every-string — every: all strings
13. includes-vs-indexof — includes vs indexOf (NaN)
14. reduce-sum — reduce: sum
15. reduce-max — reduce: max
16. reduce-count — reduce: count occurrences
17. reduce-group-by — reduce: group by
18. reduce-pairs-to-object — reduce: build an object from pairs
19. sort-numbers — Sort numbers correctly (fix)
20. sort-objects-by-key — Sort objects by key
21. sort-case-insensitive — Sort strings case-insensitively
22. to-sorted — Sort without mutating (toSorted)
23. to-reversed — Reverse without mutating (toReversed)
24. slice-vs-splice — slice vs splice (fix)
25. splice-remove-insert — splice: remove and insert
26. concat-and-spread — concat and spread
27. flat — flat
28. flat-map — flatMap
29. join-sentence — join into a sentence
30. array-from-map — Array.from with a mapping function
31. array-of-fill — Array.of and fill (fix: fill with shared object)
32. at-negative — at() with a negative index
33. chain — Chain map, filter and reduce

### `objects-ii` · Objects II (18)
1. object-keys — Object.keys
2. object-values — Object.values
3. object-entries — Object.entries
4. from-entries — Object.fromEntries
5. transform-values — Loop over entries and transform values
6. dynamic-access — Dynamic property access by variable
7. optional-chaining — Optional chaining on a missing path
8. nullish-default — Nullish coalescing vs || (fix)
9. assign-vs-spread — Object.assign vs spread (shallow copy trap)
10. freeze — Freeze an object and prove it
11. has-own-vs-in — Object.hasOwn vs in
12. destructure-rename-default — Destructure with rename and default
13. nested-destructure — Nested destructuring
14. rest-destructure — Rest in destructuring
15. count-properties — Count properties
16. invert — Invert keys and values
17. pick — Pick a subset of keys
18. omit — Omit keys

### `scope` · Scope (10)
1. block-scope — Block scope: let vs var
2. function-scope — Function scope: variable not visible outside (fix)
3. shadowing — Shadowing
4. global-leak — Global leak from a missing declaration (fix)
5. closure-counter — A closure capturing a counter
6. loop-closure — Loop closure with var (fix)
7. tdz — Temporal dead zone (fix)
8. hoisting — Hoisting: declarations vs expressions (fix)
9. iife — IIFE to create a private scope
10. module-pattern — Module pattern: expose a public API

### `functions-ii` · Functions II (14)
1. arrow-syntax — Arrow function syntax
2. arrow-return-object — Arrow function returning an object literal (fix)
3. arrow-this — Arrow functions and this (fix)
4. rest-parameters — Rest parameters: sum any number of arguments
5. spread-arguments — Spread an array into a call
6. apply-twice — Higher-order: apply a function twice
7. multiplier-factory — A function returning a function
8. callbacks — Callbacks: run after each item
9. private-counter — Closures: a private counter with increment and decrement
10. recursion-factorial — Recursion: factorial
11. recursion-sum-nested — Recursion: sum a nested array
12. length-and-name — Function.length and Function.name
13. call-and-apply — call and apply
14. bind-lost-this — bind: fix a lost this

### `async` · Asynchronous JavaScript (13)
1. settimeout — setTimeout: run after a delay
2. create-promise — Create and resolve a promise
3. reject-and-catch — Reject and catch
4. then-chain — then chaining transforms
5. async-await — async/await basics
6. try-catch-await — try/catch with await
7. promise-all — Promise.all
8. all-settled — Promise.allSettled
9. race — Promise.race
10. any — Promise.any
11. sequential-vs-parallel — Sequential vs parallel awaits (fix)
12. callback-to-promise — Convert a callback API to a promise
13. microtask-order — Microtask vs macrotask order (predict)

### `classes` · Classes (22)
1. declare-class — Declare a class with a constructor
2. add-method — Add a method
3. instantiate — Instantiate and call
4. getter — Getter
5. setter-validation — Setter with validation
6. static-method — Static method
7. static-property — Static property
8. private-field — Private field
9. private-method — Private method
10. extends — Inheritance with extends
11. super-constructor — super in the constructor (fix)
12. override-and-super — Override a method and call super
13. instanceof — instanceof
14. class-expression — Class expression
15. tostring — toString override
16. field-defaults — Class fields with defaults
17. chaining — Method chaining (return this)
18. iterable-class — Symbol.iterator on a class
19. abstract-base — Abstract-style base class
20. mixin — Mixin via a function
21. static-factory — Static factory method
22. value-equals — Value object equals()

## Course 3 — `dom` · JavaScript DOM Exercises (21)

Chips: access elements · modify elements · respond to events. Every challenge sets `html`.

### `dom-selectors` · DOM Selector Methods (4)
1. get-element-by-id — getElementById
2. query-selector — querySelector by class
3. query-selector-all — querySelectorAll and count
4. closest — closest and parent traversal

### `dom-events` · Events and User Interactions (5)
1. click-counter — A click handler that increments a counter
2. input-mirror — An input event that mirrors text
3. submit-prevent-default — Submit: prevent default and read the form
4. event-delegation — Event delegation on a list
5. enter-adds-item — Keyboard: Enter adds an item

### `dom-manipulation` · DOM Manipulation (4)
1. create-and-append — createElement and append
2. remove-element — Remove an element
3. toggle-class — Toggle a class
4. attributes-and-dataset — Set attributes and dataset

### `dom-fundamentals` · DOM Fundamentals (5)
1. render-list — Render a list from an array
2. build-table — Build a table from objects
3. filter-as-you-type — Filter a list as the user types
4. tabs — Tabs: show one panel at a time
5. todo — A minimal todo: add and remove

### `dom-recursion` · DOM Recursive Functions (3)
1. count-descendants — Count all descendants
2. deepest-level — Find the deepest nesting level
3. leaf-text — Collect the text of all leaf nodes

## Course 4 — `practice` · JavaScript Practice (80)

Chips: challenges · test your understanding · mixed difficulty.

### `fundamentals` · JavaScript Fundamentals (24)
1. reverse-string — Reverse a string
2. capitalize-first — Capitalize the first letter
3. capitalize-words — Capitalize each word
4. count-vowels — Count vowels
5. is-palindrome — Is palindrome (ignore case and non-letters)
6. count-words — Count words
7. truncate — Truncate with an ellipsis
8. zero-pad — Pad a number with zeros
9. swap-case — Swap case
10. dedupe-chars — Remove duplicate characters
11. most-frequent-char — Most frequent character
12. is-anagram — Is anagram
13. camel-to-kebab — camelCase to kebab-case
14. snake-to-camel — snake_case to camelCase
15. format-currency — Format a number as currency
16. parse-number-safely — Parse a number safely
17. round-to — Round to n decimals (fix: floating point)
18. clamp — Clamp a number
19. is-integer — Integer vs float
20. fizzbuzz — FizzBuzz
21. sum-of-digits — Sum of digits
22. is-prime — Is prime
23. roman-numerals — Convert to Roman numerals
24. coercion-comparisons — Fix the comparisons (coercion traps)

### `arrays-practice` · JavaScript Arrays (22)
1. remove-duplicates — Remove duplicates
2. intersection — Intersection
3. difference — Difference
4. union — Union
5. chunk — Chunk
6. zip — Zip two arrays
7. unzip — Unzip
8. rotate — Rotate left by n
9. move-element — Move an element from one index to another
10. range — Range
11. column-sum — Sum a column in a 2D array
12. transpose — Transpose a matrix
13. flatten-deep — Flatten deeply
14. second-largest — Second largest
15. most-frequent — Most frequent element
16. partition — Partition by predicate
17. running-total — Running total
18. compact — Compact
19. sort-multi-key — Sort by multiple keys
20. binary-search — Binary search
21. merge-sorted — Merge two sorted arrays
22. max-window-sum — Sliding window: max sum of k

### `objects-practice` · JavaScript Objects (19)
1. deep-get — Deep get by path string
2. deep-set — Deep set by path
3. deep-clone — Deep clone
4. deep-equal — Deep equal
5. deep-merge — Deep merge
6. flatten-keys — Flatten a nested object to dot keys
7. unflatten-keys — Unflatten dot keys
8. map-values — Map object values
9. filter-object — Filter an object by predicate
10. count-by — Count by property
11. index-by — Index by key
12. rename-keys — Rename keys
13. remove-nullish — Remove undefined and null values
14. pairs-round-trip — Pairs to object and back
15. is-empty — Is empty object
16. same-shape — Same keys
17. safe-json-parse — Safe JSON parse
18. stable-stringify — Serialize with sorted keys
19. map-vs-object — Word counts with Map

### `dates` · JavaScript Dates (8)
1. create-from-parts — Create a date from parts (month is zero-based)
2. format-iso-date — Format as YYYY-MM-DD
3. add-days — Add days
4. diff-in-days — Difference in days
5. weekday-name — Day of the week name
6. is-leap-year — Is leap year
7. month-bounds — Start and end of month
8. parse-and-compare — Parse ISO strings and sort

### `sets` · JavaScript Sets (7)
1. create-and-add — Create a set and add
2. dedupe-with-set — Remove duplicates via Set
3. has-delete-size — has, delete, size
4. set-union — Union
5. set-intersection — Intersection
6. set-difference — Difference
7. is-subset — Is subset

## Course 5 — `interview` · Interview Prep (82)

Chips: closures · this · prototypes · event loop · implement the built-ins. The reason this project exists.

### `closures` · Closures (8)
1. counter-factory — Counter factory with independent instances
2. once — once()
3. memoize-single — Memoize a single-argument function
4. revealing-module — Private state with a revealing module
5. loop-closure-fix — Closure in a loop: produce 0, 1, 2 (fix)
6. call-counter — A function that remembers how many times it was called
7. partial — Partial application
8. bank-account — createBankAccount with a closure-protected balance

### `this-and-binding` · this and binding (8)
1. extracted-method — A method loses this when extracted (fix)
2. arrow-method — Arrow method in an object literal (fix)
3. this-in-settimeout — this inside a setTimeout callback (fix)
4. explicit-call — Explicit binding with call
5. apply-array — apply with an array of arguments
6. hard-bind — Hard binding with bind
7. new-binding — new binding with a constructor function
8. precedence — Binding precedence: new vs bind (predict)

### `prototypes` · Prototypes (8)
1. object-create — Object.create and the prototype chain
2. add-to-prototype — Add a method to a prototype
3. constructor-function — Constructor function with a prototype method
4. lookup-order — Prototype chain lookup order (predict)
5. own-vs-inherited — Own vs inherited properties
6. set-prototype-of — Inheritance with Object.setPrototypeOf
7. desugar-class — A class desugared to constructor + prototype
8. implement-instanceof — Implement instanceof

### `event-loop` · Event Loop (8)
1. sync-micro-macro — Sync, microtask, macrotask (predict)
2. nested-promises — Nested promise ordering (predict)
3. timeout-vs-resolve — setTimeout 0 vs Promise.resolve (predict)
4. await-ordering — await ordering (predict)
5. queue-microtask — queueMicrotask (predict)
6. starved-timer — A starved timer (fix)
7. ordered-scheduler — Implement a scheduler that logs in the required order
8. interval-cleanup — setInterval cleanup

### `promise-patterns` · Promise Patterns (10)
1. sleep — Implement sleep
2. implement-all — Implement Promise.all
3. implement-all-settled — Implement Promise.allSettled
4. implement-race — Implement Promise.race
5. retry — Retry with attempts
6. with-timeout — Timeout wrapper
7. sequential — Run async tasks sequentially
8. concurrency-limit — Concurrency limit (pool)
9. promisify — promisify
10. async-queue — Async queue that preserves order

### `iterators-and-generators` · Iterators and Generators (8)
1. make-iterable — Make an object iterable
2. manual-iterator — A manual iterator with next()
3. generator-basics — Generator basics
4. infinite-take — Infinite generator with take
5. yield-delegation — Generator delegation with yield*
6. lazy-map-filter — Lazy map and filter with generators
7. async-generator — Async generator
8. spread-destructure — Spread and destructure iterables

### `coercion-and-equality` · Coercion and Equality (8)
1. loose-vs-strict — == vs === (predict)
2. truthy-falsy — Truthy and falsy
3. string-to-number — Number coercion of strings
4. object-is — Object.is vs ===
5. array-to-string — Array to string coercion (predict)
6. typeof-quirks — typeof quirks (predict)
7. comparing-objects — Comparing objects
8. nan-detection — NaN detection

### `implement-the-built-ins` · Implement the Built-ins (14)
1. debounce — debounce
2. throttle — throttle
3. memoize — memoize with multiple arguments
4. curry — curry
5. compose-pipe — compose and pipe
6. deep-clone — deepClone (cycles not required)
7. flatten-depth — flatten with depth
8. group-by — groupBy
9. bind-polyfill — Function.prototype.bind polyfill
10. map-polyfill — Array.prototype.map polyfill
11. reduce-polyfill — Array.prototype.reduce polyfill
12. event-emitter — EventEmitter
13. lru-cache — LRU cache
14. stringify-lite — JSON.stringify lite

### `classic-puzzles` · Classic Puzzles (10)
1. two-sum — Two sum
2. valid-parentheses — Valid parentheses
3. longest-unique-substring — Longest substring without repeating characters
4. deep-freeze — Deep freeze
5. array-equal — Array equality
6. count-islands — Count islands in a grid
7. route-matcher — A simple route matcher
8. parse-query-string — Parse a query string
9. top-k-frequent — Top k frequent elements
10. flatten-comments — Flatten a threaded comment tree

## Totals

| Course | Topics | Challenges |
| --- | --- | --- |
| core | 4 | 60 |
| intermediate | 6 | 110 |
| dom | 5 | 21 |
| practice | 5 | 80 |
| interview | 9 | 82 |
| **total** | **29** | **353** |
