import type { Topic } from "../types";

const topic: Topic = {
  course: "dom",
  slug: "dom-fundamentals",
  title: "DOM Fundamentals",
  description: "Small UI pieces end to end: render lists and tables, filter, tabs and a todo.",
  tags: ["rendering", "state", "ui"],
  count: 5,
  challenges: [
    {
      slug: "render-list",
      title: "Render a list from an array",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Write \`renderUsers(users)\` that renders \`#users\` from an array of \`{ name, role }\`: one \`<li>\` per user with the text \`"name (role)"\`. Each call replaces what was there.

For an empty array render a single \`<li class="empty">No users</li>\`. Names are user input, so render text, not HTML.

Example: \`renderUsers([{ name: "Ada", role: "admin" }])\` → \`<li>Ada (admin)</li>\``,
      html: `<h2>Team</h2>
<ul id="users"><li>Loading…</li></ul>`,
      starter: `function renderUsers(users) {\n  \n}\n`,
      solution: `function renderUsers(users) {
  const items = users.map(({ name, role }) => {
    const li = document.createElement("li");
    li.textContent = name + " (" + role + ")";
    return li;
  });
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No users";
    items.push(empty);
  }
  document.getElementById("users").replaceChildren(...items);
}`,
      tests: [
        {
          name: "renders one li per user",
          code: `renderUsers([{ name: "Ada", role: "admin" }, { name: "Grace", role: "dev" }]);
const texts = [...document.querySelectorAll("#users li")].map((li) => li.textContent);
assert.deepEqual(texts, ["Ada (admin)", "Grace (dev)"]);`,
        },
        {
          name: "replaces previous content",
          code: `renderUsers([{ name: "Ada", role: "admin" }]);
renderUsers([{ name: "Linus", role: "dev" }]);
assert.equal(document.querySelectorAll("#users li").length, 1);
assert.equal(document.querySelector("#users li").textContent, "Linus (dev)");`,
        },
        {
          name: "shows an empty state",
          code: `renderUsers([]);
const items = document.querySelectorAll("#users li");
assert.equal(items.length, 1);
assert.ok(items[0].classList.contains("empty"));
assert.equal(items[0].textContent, "No users");`,
        },
        {
          name: "renders names as text",
          code: `renderUsers([{ name: "<img src=x>", role: "x" }]);
assert.equal(document.querySelector("#users img"), null);`,
        },
      ],
    },
    {
      slug: "build-table",
      title: "Build a table from objects",
      kind: "implement",
      difficulty: 2,
      tags: ["dom"],
      description: `Write \`renderTable(rows, columns)\` that replaces the contents of \`#table-root\` with a \`<table>\` containing a \`<thead>\` row of \`<th>\` (the column keys as text) and a \`<tbody>\` with one \`<tr>\` per object, one \`<td>\` per column.

Missing or nullish values render as an empty cell.

Example: \`renderTable([{ name: "Ada", age: 36 }], ["name", "age"])\` → \`<table><thead><tr><th>name</th><th>age</th></tr></thead><tbody><tr><td>Ada</td><td>36</td></tr></tbody></table>\``,
      html: `<div id="table-root"><p>No data yet.</p></div>`,
      starter: `function renderTable(rows, columns) {\n  \n}\n`,
      solution: `function renderTable(rows, columns) {
  const table = document.createElement("table");
  const headRow = table.createTHead().insertRow();
  for (const column of columns) {
    const th = document.createElement("th");
    th.textContent = column;
    headRow.append(th);
  }
  const body = table.createTBody();
  for (const row of rows) {
    const tr = body.insertRow();
    for (const column of columns) {
      tr.insertCell().textContent = row[column] ?? "";
    }
  }
  document.getElementById("table-root").replaceChildren(table);
}`,
      tests: [
        {
          name: "renders the header",
          code: `renderTable([{ name: "Ada", age: 36 }], ["name", "age"]);
const ths = [...document.querySelectorAll("#table-root thead th")].map((th) => th.textContent);
assert.deepEqual(ths, ["name", "age"]);`,
        },
        {
          name: "renders one row per object",
          code: `renderTable([{ name: "Ada", age: 36 }, { name: "Grace", age: 45 }], ["name", "age"]);
const rows = [...document.querySelectorAll("#table-root tbody tr")].map((tr) => [...tr.cells].map((td) => td.textContent));
assert.deepEqual(rows, [["Ada", "36"], ["Grace", "45"]]);`,
        },
        {
          name: "renders missing values as empty cells",
          code: `renderTable([{ name: "Linus", age: null }, { name: "Ken" }], ["name", "age"]);
const cells = [...document.querySelectorAll("#table-root tbody td")].map((td) => td.textContent);
assert.deepEqual(cells, ["Linus", "", "Ken", ""]);`,
        },
        {
          name: "replaces previous content",
          code: `renderTable([{ a: 1 }], ["a"]);
renderTable([{ a: 2 }], ["a"]);
assert.equal(document.querySelectorAll("#table-root table").length, 1);
assert.equal(document.querySelector("#table-root p"), null);`,
        },
      ],
    },
    {
      slug: "filter-as-you-type",
      title: "Filter a list as the user types",
      kind: "implement",
      difficulty: 2,
      tags: ["dom", "events"],
      description: `On every \`input\` event in \`#search\`, hide (via the \`hidden\` property) each \`#fruits li\` whose text does not contain the query, case-insensitively and ignoring surrounding whitespace in the query. Show the rest. Update \`#count\` to \`"<n> shown"\`.

An empty query shows everything.

Example: \`typing "an"\` → \`Banana and Mango visible, "2 shown"\``,
      html: `<input id="search" type="search" placeholder="Filter fruit" autocomplete="off">
<p id="count">5 shown</p>
<ul id="fruits">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
  <li>Mango</li>
  <li>Pear</li>
</ul>`,
      starter: `const search = document.getElementById("search");
const items = document.querySelectorAll("#fruits li");
const count = document.getElementById("count");
`,
      solution: `const search = document.getElementById("search");
const items = document.querySelectorAll("#fruits li");
const count = document.getElementById("count");

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  let shown = 0;
  for (const li of items) {
    li.hidden = !li.textContent.toLowerCase().includes(query);
    if (!li.hidden) shown += 1;
  }
  count.textContent = shown + " shown";
});`,
      tests: [
        {
          name: "hides items that do not match",
          code: `const search = document.getElementById("search");
search.value = "an";
search.dispatchEvent(new Event("input", { bubbles: true }));
const visible = [...document.querySelectorAll("#fruits li")].filter((li) => !li.hidden).map((li) => li.textContent);
assert.deepEqual(visible, ["Banana", "Mango"]);`,
        },
        {
          name: "is case-insensitive and trims the query",
          code: `const search = document.getElementById("search");
search.value = "  PEA ";
search.dispatchEvent(new Event("input", { bubbles: true }));
const visible = [...document.querySelectorAll("#fruits li")].filter((li) => !li.hidden).map((li) => li.textContent);
assert.deepEqual(visible, ["Pear"]);`,
        },
        {
          name: "updates the count",
          code: `const search = document.getElementById("search");
search.value = "e";
search.dispatchEvent(new Event("input", { bubbles: true }));
assert.equal(document.getElementById("count").textContent, "3 shown");`,
        },
        {
          name: "an empty query shows everything",
          code: `const search = document.getElementById("search");
search.value = "zzz";
search.dispatchEvent(new Event("input", { bubbles: true }));
search.value = "";
search.dispatchEvent(new Event("input", { bubbles: true }));
assert.ok([...document.querySelectorAll("#fruits li")].every((li) => !li.hidden));
assert.equal(document.getElementById("count").textContent, "5 shown");`,
        },
      ],
    },
    {
      slug: "tabs",
      title: "Tabs: show one panel at a time",
      kind: "implement",
      difficulty: 2,
      tags: ["dom", "events"],
      description: `Wire up the tabs. Clicking a \`.tab\` button selects it: set its \`aria-selected\` to \`"true"\` and every other tab's to \`"false"\`, show the panel whose id is \`panel-<data-tab>\` and set \`hidden\` on every other \`.panel\`.

Example: \`click the "Billing" tab\` → \`#panel-billing visible, the other panels hidden\``,
      html: `<div class="tabs" role="tablist">
  <button class="tab" type="button" role="tab" data-tab="profile" aria-selected="true">Profile</button>
  <button class="tab" type="button" role="tab" data-tab="billing" aria-selected="false">Billing</button>
  <button class="tab" type="button" role="tab" data-tab="security" aria-selected="false">Security</button>
</div>
<section class="panel" id="panel-profile" role="tabpanel">Your profile settings.</section>
<section class="panel" id="panel-billing" role="tabpanel" hidden>Your invoices.</section>
<section class="panel" id="panel-security" role="tabpanel" hidden>Passwords and 2FA.</section>`,
      starter: `const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
`,
      solution: `const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function select(name) {
  for (const tab of tabs) {
    tab.setAttribute("aria-selected", String(tab.dataset.tab === name));
  }
  for (const panel of panels) {
    panel.hidden = panel.id !== "panel-" + name;
  }
}

for (const tab of tabs) {
  tab.addEventListener("click", () => select(tab.dataset.tab));
}`,
      tests: [
        {
          name: "shows the clicked panel only",
          code: `document.querySelector('[data-tab="billing"]').click();
const visible = [...document.querySelectorAll(".panel")].filter((p) => !p.hidden).map((p) => p.id);
assert.deepEqual(visible, ["panel-billing"]);`,
        },
        {
          name: "marks only the clicked tab selected",
          code: `document.querySelector('[data-tab="security"]').click();
const selected = [...document.querySelectorAll(".tab")].map((t) => t.getAttribute("aria-selected"));
assert.deepEqual(selected, ["false", "false", "true"]);`,
        },
        {
          name: "can switch back to the first tab",
          code: `document.querySelector('[data-tab="security"]').click();
document.querySelector('[data-tab="profile"]').click();
assert.ok(!document.getElementById("panel-profile").hidden);
assert.ok(document.getElementById("panel-security").hidden);
assert.equal(document.querySelector('[data-tab="profile"]').getAttribute("aria-selected"), "true");`,
        },
      ],
    },
    {
      slug: "todo",
      title: "A minimal todo: add and remove",
      kind: "implement",
      difficulty: 2,
      tags: ["dom", "events", "delegation"],
      description: `Build the todo. Submitting \`#todo-form\` (prevent the navigation) adds an \`<li>\` to \`#todo-list\` containing a \`<span>\` with the trimmed text and a \`<button class="delete">\`, then clears the input. Blank input adds nothing.

Clicking a \`.delete\` button removes its item, including items added after load.

Example: \`type "Ship it", submit\` → \`<li><span>Ship it</span><button class="delete">Delete</button></li>\``,
      html: `<form id="todo-form">
  <input id="todo-input" placeholder="What needs doing?" autocomplete="off">
  <button type="submit">Add</button>
</form>
<ul id="todo-list"></ul>`,
      starter: `const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
`,
      solution: `const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete";
  button.textContent = "Delete";
  li.append(span, button);
  list.append(li);
  input.value = "";
});

list.addEventListener("click", (event) => {
  event.target.closest(".delete")?.closest("li").remove();
});`,
      hints: ["Give the delete button `type=\"button\"` so it never submits anything.", "One click listener on the list handles every delete button."],
      tests: [
        {
          name: "submitting adds a todo and prevents navigation",
          code: `const input = document.getElementById("todo-input");
input.value = "  Ship it ";
const event = new Event("submit", { bubbles: true, cancelable: true });
document.getElementById("todo-form").dispatchEvent(event);
assert.ok(event.defaultPrevented, "call preventDefault");
assert.equal(document.querySelector("#todo-list li:last-child span")?.textContent, "Ship it");
assert.equal(input.value, "");`,
        },
        {
          name: "ignores blank input",
          code: `const before = document.querySelectorAll("#todo-list li").length;
document.getElementById("todo-input").value = "  ";
document.getElementById("todo-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
assert.equal(document.querySelectorAll("#todo-list li").length, before);`,
        },
        {
          name: "delete removes the item",
          code: `const input = document.getElementById("todo-input");
const form = document.getElementById("todo-form");
input.value = "Keep"; form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
input.value = "Drop"; form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
const items = [...document.querySelectorAll("#todo-list li")];
items.at(-1).querySelector(".delete").click();
const texts = [...document.querySelectorAll("#todo-list span")].map((s) => s.textContent);
assert.ok(texts.includes("Keep"));
assert.ok(!texts.includes("Drop"));`,
        },
      ],
    },
  ],
};

export default topic;
