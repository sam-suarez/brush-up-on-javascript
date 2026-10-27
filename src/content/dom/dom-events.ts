import type { Topic } from "../types";

const topic: Topic = {
  course: "dom",
  slug: "dom-events",
  title: "Events and User Interactions",
  description: "Click, input, submit and keyboard events, plus event delegation.",
  tags: ["events", "delegation", "forms"],
  count: 5,
  challenges: [
    {
      slug: "click-counter",
      title: "A click handler that increments a counter",
      kind: "complete",
      difficulty: 1,
      tags: ["dom", "events"],
      description: `Make the \`#inc\` button increment the number shown in \`#count\` by one on every click. Keep the count in a variable rather than parsing the text back.

Example: \`click, click, click\` → \`#count shows "3"\``,
      html: `<button id="inc" type="button">+1</button>
<p>Clicks: <output id="count">0</output></p>`,
      starter: `const button = document.getElementById("inc");
const output = document.getElementById("count");

// your code here
`,
      solution: `const button = document.getElementById("inc");
const output = document.getElementById("count");

let count = 0;
button.addEventListener("click", () => {
  count += 1;
  output.textContent = String(count);
});`,
      tests: [
        { name: "starts at 0", code: `assert.equal(document.getElementById("count").textContent, "0");` },
        {
          name: "one click shows one more",
          code: `const before = Number(document.getElementById("count").textContent);
document.getElementById("inc").click();
assert.equal(document.getElementById("count").textContent, String(before + 1));`,
        },
        {
          name: "keeps counting across clicks",
          code: `const before = Number(document.getElementById("count").textContent);
const button = document.getElementById("inc");
button.click(); button.click(); button.click();
assert.equal(document.getElementById("count").textContent, String(before + 3));`,
        },
      ],
    },
    {
      slug: "input-mirror",
      title: "An input event that mirrors text",
      kind: "implement",
      difficulty: 1,
      tags: ["dom", "events"],
      description: `As the user types into \`#name\`, show the trimmed value in \`#preview\`. When the trimmed value is empty, show \`"stranger"\`.

Update on the \`input\` event, not \`change\`.

Example: \`typing "  Ada "\` → \`Hello, Ada!\``,
      html: `<label>Your name <input id="name" autocomplete="off"></label>
<p>Hello, <span id="preview">stranger</span>!</p>`,
      starter: `const input = document.getElementById("name");
const preview = document.getElementById("preview");

input.addEventListener("change", () => {
  preview.textContent = input.value;
});
`,
      solution: `const input = document.getElementById("name");
const preview = document.getElementById("preview");

input.addEventListener("input", () => {
  preview.textContent = input.value.trim() || "stranger";
});`,
      tests: [
        {
          name: "mirrors typed text",
          code: `const input = document.getElementById("name");
input.value = "Ada";
input.dispatchEvent(new Event("input", { bubbles: true }));
assert.equal(document.getElementById("preview").textContent, "Ada");`,
        },
        {
          name: "trims whitespace",
          code: `const input = document.getElementById("name");
input.value = "  Grace ";
input.dispatchEvent(new Event("input", { bubbles: true }));
assert.equal(document.getElementById("preview").textContent, "Grace");`,
        },
        {
          name: 'falls back to "stranger" when blank',
          code: `const input = document.getElementById("name");
input.value = "Linus";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.value = "   ";
input.dispatchEvent(new Event("input", { bubbles: true }));
assert.equal(document.getElementById("preview").textContent, "stranger");`,
        },
      ],
    },
    {
      slug: "submit-prevent-default",
      title: "Submit: prevent default and read the form",
      kind: "complete",
      difficulty: 2,
      tags: ["dom", "events"],
      description: `Handle submit on \`#signup\`: prevent the page navigation, read the fields with \`FormData\`, push a plain object \`{ email, plan }\` onto \`submissions\`, and set \`#status\` to \`"Thanks, <email>!"\`.

Example: \`submit with ada@example.com / pro\` → \`submissions.at(-1)\` is \`{ email: "ada@example.com", plan: "pro" }\``,
      html: `<form id="signup">
  <label>Email <input name="email" type="email" value="ada@example.com"></label>
  <label>Plan
    <select name="plan">
      <option value="free">Free</option>
      <option value="pro" selected>Pro</option>
    </select>
  </label>
  <button type="submit">Sign up</button>
</form>
<p id="status"></p>`,
      starter: `const submissions = [];
const form = document.getElementById("signup");

// your code here
`,
      solution: `const submissions = [];
const form = document.getElementById("signup");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { email, plan } = Object.fromEntries(new FormData(form));
  submissions.push({ email, plan });
  document.getElementById("status").textContent = "Thanks, " + email + "!";
});`,
      tests: [
        {
          name: "prevents the default submit",
          code: `const event = new Event("submit", { bubbles: true, cancelable: true });
document.getElementById("signup").dispatchEvent(event);
assert.ok(event.defaultPrevented, "call event.preventDefault()");`,
        },
        {
          name: "records the form values",
          code: `const form = document.getElementById("signup");
form.elements.email.value = "grace@example.com";
form.elements.plan.value = "free";
form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
assert.deepEqual(submissions.at(-1), { email: "grace@example.com", plan: "free" });`,
        },
        {
          name: "shows a thank-you message",
          code: `const form = document.getElementById("signup");
form.elements.email.value = "linus@example.com";
form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
assert.equal(document.getElementById("status").textContent, "Thanks, linus@example.com!");`,
        },
      ],
    },
    {
      slug: "event-delegation",
      title: "Event delegation on a list",
      kind: "fix",
      difficulty: 2,
      tags: ["dom", "events", "delegation"],
      description: `Clicking a \`.remove\` button should remove its list item. The current code works for the items that exist on load, but items added later (the app appends them dynamically) can't be removed. Fix it with a single listener on \`#list\`.

Clicks on the item text itself must not remove anything, and clicks on the icon inside a button must still work.

Example: \`append a new <li>, click its .remove\` → \`the new item is gone\``,
      html: `<ul id="list">
  <li>Milk <button class="remove" type="button"><span class="icon">x</span></button></li>
  <li>Eggs <button class="remove" type="button"><span class="icon">x</span></button></li>
  <li>Bread <button class="remove" type="button"><span class="icon">x</span></button></li>
</ul>`,
      starter: `const list = document.getElementById("list");

for (const button of list.querySelectorAll(".remove")) {
  button.addEventListener("click", () => {
    button.closest("li").remove();
  });
}
`,
      solution: `const list = document.getElementById("list");

list.addEventListener("click", (event) => {
  const button = event.target.closest(".remove");
  if (!button || !list.contains(button)) return;
  button.closest("li").remove();
});`,
      hints: ["Listen on the list and inspect `event.target`.", "`event.target` may be the icon span: use `closest`."],
      tests: [
        {
          name: "removes an existing item",
          code: `const list = document.getElementById("list");
list.querySelector("li .remove").click();
assert.equal(list.children.length, 2);
assert.ok(!list.textContent.includes("Milk"));`,
        },
        {
          name: "works when the icon is clicked",
          code: `const list = document.getElementById("list");
const before = list.children.length;
list.querySelector(".icon").click();
assert.equal(list.children.length, before - 1);`,
        },
        {
          name: "removes items added later",
          code: `const list = document.getElementById("list");
const li = document.createElement("li");
li.innerHTML = 'Jam <button class="remove" type="button"><span class="icon">x</span></button>';
list.append(li);
li.querySelector(".remove").click();
assert.ok(!list.contains(li), "the new item should be removed");`,
        },
        {
          name: "clicking the item text does nothing",
          code: `const list = document.getElementById("list");
const before = list.children.length;
list.lastElementChild.click();
assert.equal(list.children.length, before);`,
        },
      ],
    },
    {
      slug: "enter-adds-item",
      title: "Keyboard: Enter adds an item",
      kind: "implement",
      difficulty: 1,
      tags: ["dom", "events"],
      description: `When the user presses Enter in \`#new-item\`, append an \`<li>\` with the trimmed value to \`#items\` and clear the input. Ignore other keys and blank values.

Listen for \`keydown\` and check \`event.key\`.

Example: \`type "Milk", press Enter\` → \`<li>Milk</li>\` appended, input empty`,
      html: `<input id="new-item" placeholder="Add an item and press Enter" autocomplete="off">
<ul id="items"></ul>`,
      starter: `const input = document.getElementById("new-item");
const items = document.getElementById("items");
`,
      solution: `const input = document.getElementById("new-item");
const items = document.getElementById("items");

input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement("li");
  li.textContent = text;
  items.append(li);
  input.value = "";
});`,
      tests: [
        {
          name: "Enter adds the trimmed text",
          code: `const input = document.getElementById("new-item");
input.value = "  Milk ";
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
assert.equal(document.querySelector("#items li:last-child")?.textContent, "Milk");`,
        },
        {
          name: "clears the input after adding",
          code: `const input = document.getElementById("new-item");
input.value = "Eggs";
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
assert.equal(input.value, "");`,
        },
        {
          name: "ignores other keys",
          code: `const input = document.getElementById("new-item");
const before = document.querySelectorAll("#items li").length;
input.value = "Bread";
input.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
assert.equal(document.querySelectorAll("#items li").length, before);
assert.equal(input.value, "Bread");`,
        },
        {
          name: "ignores blank values",
          code: `const input = document.getElementById("new-item");
const before = document.querySelectorAll("#items li").length;
input.value = "   ";
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
assert.equal(document.querySelectorAll("#items li").length, before);`,
        },
      ],
    },
  ],
};

export default topic;
