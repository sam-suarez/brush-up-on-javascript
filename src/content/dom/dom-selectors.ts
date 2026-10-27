import type { Topic } from "../types";

const topic: Topic = {
  course: "dom",
  slug: "dom-selectors",
  title: "DOM Selector Methods",
  description: "getElementById, querySelector, querySelectorAll and traversal.",
  tags: ["selectors", "traversal"],
  count: 4,
  challenges: [
    {
      slug: "get-element-by-id",
      title: "getElementById",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Select the element with id \`title\` and change its text to \`"Selected!"\`. Also write \`getTitleText()\` that returns the current text of that element.

Example: after your code runs, \`getTitleText()\` → \`"Selected!"\``,
      html: `<h1 id="title">Original</h1>\n<p id="intro">Leave me alone.</p>`,
      starter: `function getTitleText() {\n  \n}\n`,
      solution: `const title = document.getElementById("title");
title.textContent = "Selected!";

function getTitleText() {
  return document.getElementById("title").textContent;
}`,
      tests: [
        { name: "changes the heading text", code: `assert.equal(document.getElementById("title").textContent, "Selected!");` },
        { name: "getTitleText reads the current text", code: `document.getElementById("title").textContent = "Later"; assert.equal(getTitleText(), "Later");` },
        { name: "does not touch other elements", code: `assert.equal(document.getElementById("intro").textContent, "Leave me alone.");` },
      ],
    },
    {
      slug: "query-selector",
      title: "querySelector by class",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Write \`activeLabel()\` that returns the text of the first element inside \`.menu\` that has both the \`item\` and \`active\` classes. Return \`null\` when no item is active.

It must read the DOM on every call, not cache the answer.

Example: with the markup shown, \`activeLabel()\` → \`"Docs"\``,
      html: `<nav>
  <ul class="menu">
    <li class="item">Home</li>
    <li class="item active">Docs</li>
    <li class="item active">Blog</li>
  </ul>
  <p class="active">Not a menu item</p>
</nav>`,
      starter: `function activeLabel() {\n  \n}\n`,
      solution: `function activeLabel() {
  return document.querySelector(".menu .item.active")?.textContent ?? null;
}`,
      tests: [
        { name: "returns the first active item", code: `assert.equal(activeLabel(), "Docs");` },
        {
          name: "reflects the current DOM",
          code: `const items = document.querySelectorAll(".menu .item");
items[1].classList.remove("active");
assert.equal(activeLabel(), "Blog");`,
        },
        {
          name: "returns null when nothing is active",
          code: `document.querySelectorAll(".menu .item").forEach((li) => li.classList.remove("active"));
assert.equal(activeLabel(), null);`,
        },
      ],
    },
    {
      slug: "query-selector-all",
      title: "querySelectorAll and count",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Write \`checkedLabels()\` that returns a real array with the trimmed label text of every checked checkbox inside \`#prefs\`, in document order. Also write \`countChecked()\` that returns how many are checked.

Example: with the markup shown, \`checkedLabels()\` → \`["Email", "Push"]\``,
      html: `<fieldset id="prefs">
  <legend>Notifications</legend>
  <label><input type="checkbox" checked> Email</label>
  <label><input type="checkbox"> SMS</label>
  <label><input type="checkbox" checked> Push</label>
</fieldset>
<label><input type="checkbox" checked> Outside the fieldset</label>`,
      starter: `function checkedLabels() {\n  \n}\n\nfunction countChecked() {\n  \n}\n`,
      solution: `function checkedBoxes() {
  return [...document.querySelectorAll("#prefs input[type=checkbox]")].filter((box) => box.checked);
}

function checkedLabels() {
  return checkedBoxes().map((box) => box.closest("label").textContent.trim());
}

function countChecked() {
  return checkedBoxes().length;
}`,
      tests: [
        { name: "lists the checked labels", code: `assert.deepEqual(checkedLabels(), ["Email", "Push"]);` },
        { name: "returns a real array", code: `assert.ok(Array.isArray(checkedLabels()));` },
        { name: "counts checked boxes inside #prefs only", code: `assert.equal(countChecked(), 2);` },
        {
          name: "reflects boxes checked later",
          code: `document.querySelectorAll("#prefs input")[1].checked = true;
assert.deepEqual(checkedLabels(), ["Email", "SMS", "Push"]);
assert.equal(countChecked(), 3);`,
        },
      ],
    },
    {
      slug: "closest",
      title: "closest and parent traversal",
      kind: "implement",
      difficulty: 2,
      tags: ["dom"],
      description: `Write \`rowIdFor(el)\` that takes any element inside the orders table and returns the numeric \`data-id\` of the table row that contains it. Return \`null\` if the element is not inside a row with a \`data-id\`.

The element may be nested several levels deep inside the row.

Example: \`rowIdFor(document.querySelector("[data-id='2'] button"))\` → \`2\``,
      html: `<table id="orders">
  <thead><tr><th>Order</th><th></th></tr></thead>
  <tbody>
    <tr data-id="1"><td>Coffee beans</td><td><button>Cancel</button></td></tr>
    <tr data-id="2"><td>Grinder</td><td><button><span class="icon">x</span> Cancel</button></td></tr>
  </tbody>
</table>
<p id="footer">Two orders</p>`,
      starter: `function rowIdFor(el) {\n  return el.parentElement.dataset.id;\n}\n`,
      solution: `function rowIdFor(el) {
  const row = el.closest("tr[data-id]");
  return row ? Number(row.dataset.id) : null;
}`,
      tests: [
        { name: "finds the row of a button", code: `assert.equal(rowIdFor(document.querySelector("[data-id='1'] button")), 1);` },
        { name: "works from a deeply nested element", code: `assert.equal(rowIdFor(document.querySelector(".icon")), 2);` },
        { name: "returns a number", code: `assert.type(rowIdFor(document.querySelector("[data-id='2'] td")), "number");` },
        { name: "returns null outside a row", code: `assert.equal(rowIdFor(document.getElementById("footer")), null);` },
        { name: "returns null for a header cell", code: `assert.equal(rowIdFor(document.querySelector("th")), null);` },
      ],
    },
  ],
};

export default topic;
