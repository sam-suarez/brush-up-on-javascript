import type { Topic } from "../types";

const topic: Topic = {
  course: "dom",
  slug: "dom-manipulation",
  title: "DOM Manipulation",
  description: "Create, remove and modify elements, classes, attributes and dataset.",
  tags: ["createElement", "classList", "dataset"],
  count: 4,
  challenges: [
    {
      slug: "create-and-append",
      title: "createElement and append",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Write \`addNotification(message, type = "info")\` that creates an \`<li>\` with classes \`notification\` and \`notification--<type>\`, sets its text to \`message\`, appends it to \`#notifications\` and returns it.

The message is user input: it must render as text, never as HTML.

Example: \`addNotification("Saved", "success")\` → \`<li class="notification notification--success">Saved</li>\``,
      html: `<h2>Notifications</h2>
<ul id="notifications"></ul>`,
      starter: `function addNotification(message, type = "info") {\n  \n}\n`,
      solution: `function addNotification(message, type = "info") {
  const li = document.createElement("li");
  li.classList.add("notification", "notification--" + type);
  li.textContent = message;
  document.getElementById("notifications").append(li);
  return li;
}`,
      tests: [
        {
          name: "appends an li with the message",
          code: `const li = addNotification("Saved", "success");
const list = document.getElementById("notifications");
assert.equal(list.lastElementChild, li);
assert.equal(li.tagName, "LI");
assert.equal(li.textContent, "Saved");`,
        },
        {
          name: "sets both classes",
          code: `const li = addNotification("Disk almost full", "warning");
assert.ok(li.classList.contains("notification"));
assert.ok(li.classList.contains("notification--warning"));`,
        },
        { name: 'defaults the type to "info"', code: `assert.ok(addNotification("Hi").classList.contains("notification--info"));` },
        {
          name: "renders the message as text",
          code: `const li = addNotification("<b>bold</b>");
assert.equal(li.querySelector("b"), null);
assert.equal(li.textContent, "<b>bold</b>");`,
        },
        {
          name: "appends in order",
          code: `addNotification("first"); addNotification("second");
const texts = [...document.querySelectorAll("#notifications li")].map((li) => li.textContent);
assert.deepEqual(texts.slice(-2), ["first", "second"]);`,
        },
      ],
    },
    {
      slug: "remove-element",
      title: "Remove an element",
      kind: "implement",
      difficulty: 1,
      tags: ["dom"],
      description: `Write \`removeCompleted()\` that removes every \`li.completed\` from \`#tasks\` and returns how many it removed. Items without the class stay, in order. A second call finds nothing left and returns \`0\`.

Example: the list starts with four items, two of them completed, so \`removeCompleted()\` → \`2\``,
      html: `<ul id="tasks">
  <li class="completed">Write tests</li>
  <li>Fix the bug</li>
  <li class="completed">Code review</li>
  <li>Deploy</li>
</ul>`,
      starter: `function removeCompleted() {\n  \n}\n`,
      solution: `function removeCompleted() {
  const done = document.querySelectorAll("#tasks li.completed");
  done.forEach((li) => li.remove());
  return done.length;
}`,
      tests: [
        { name: "returns the number removed", code: `assert.equal(removeCompleted(), 2);` },
        {
          name: "keeps the other items in order",
          code: `removeCompleted();
const texts = [...document.querySelectorAll("#tasks li")].map((li) => li.textContent);
assert.deepEqual(texts, ["Fix the bug", "Deploy"]);`,
        },
        { name: "returns 0 when nothing is completed", code: `removeCompleted(); assert.equal(removeCompleted(), 0);` },
      ],
    },
    {
      slug: "toggle-class",
      title: "Toggle a class",
      kind: "implement",
      difficulty: 1,
      tags: ["dom", "events"],
      description: `Clicking \`#theme-toggle\` toggles the \`dark\` class on \`#app\` (without touching its other classes) and sets the button's \`aria-pressed\` attribute to \`"true"\` or \`"false"\` to match.

Example: \`first click\` → \`#app has class "dark", aria-pressed="true"\``,
      html: `<div id="app" class="app shell">
  <button id="theme-toggle" type="button" aria-pressed="false">Dark mode</button>
  <p>Some content.</p>
</div>`,
      starter: `const app = document.getElementById("app");
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  app.className = "dark";
});
`,
      solution: `const app = document.getElementById("app");
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  const isDark = app.classList.toggle("dark");
  toggle.setAttribute("aria-pressed", String(isDark));
});`,
      tests: [
        {
          name: "first click turns dark mode on",
          code: `document.getElementById("theme-toggle").click();
assert.ok(document.getElementById("app").classList.contains("dark"));
assert.equal(document.getElementById("theme-toggle").getAttribute("aria-pressed"), "true");`,
        },
        {
          name: "a second click turns it off",
          code: `const app = document.getElementById("app");
const toggle = document.getElementById("theme-toggle");
const wasDark = app.classList.contains("dark");
toggle.click();
assert.equal(app.classList.contains("dark"), !wasDark);
assert.equal(toggle.getAttribute("aria-pressed"), String(!wasDark));`,
        },
        {
          name: "keeps the other classes",
          code: `document.getElementById("theme-toggle").click();
const app = document.getElementById("app");
assert.ok(app.classList.contains("app") && app.classList.contains("shell"));`,
        },
      ],
    },
    {
      slug: "attributes-and-dataset",
      title: "Set attributes and dataset",
      kind: "implement",
      difficulty: 2,
      tags: ["dom"],
      description: `Write \`configureLink(link, { href, external = false, trackingId })\` that sets the link's \`href\`, stores \`trackingId\` as \`data-tracking-id\` via \`dataset\`, and returns the link.

When \`external\` is true, set \`target="_blank"\` and \`rel="noopener noreferrer"\`. When it is false, remove both attributes (the link may have been external before).

Example: \`configureLink(a, { href: "/docs", trackingId: "nav-docs" })\` → \`<a href="/docs" data-tracking-id="nav-docs">\``,
      html: `<nav>
  <a id="docs">Docs</a>
  <a id="github" href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
</nav>`,
      starter: `function configureLink(link, { href, external = false, trackingId }) {\n  \n}\n`,
      solution: `function configureLink(link, { href, external = false, trackingId }) {
  link.setAttribute("href", href);
  link.dataset.trackingId = trackingId;
  if (external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.removeAttribute("target");
    link.removeAttribute("rel");
  }
  return link;
}`,
      tests: [
        {
          name: "sets href and data-tracking-id",
          code: `const a = document.getElementById("docs");
assert.equal(configureLink(a, { href: "/docs", trackingId: "nav-docs" }), a);
assert.equal(a.getAttribute("href"), "/docs");
assert.equal(a.getAttribute("data-tracking-id"), "nav-docs");`,
        },
        {
          name: "marks external links",
          code: `const a = configureLink(document.getElementById("docs"), { href: "https://example.com", external: true, trackingId: "ext" });
assert.equal(a.getAttribute("target"), "_blank");
assert.equal(a.getAttribute("rel"), "noopener noreferrer");`,
        },
        {
          name: "removes target and rel for internal links",
          code: `const a = configureLink(document.getElementById("github"), { href: "/github", trackingId: "gh" });
assert.ok(!a.hasAttribute("target"));
assert.ok(!a.hasAttribute("rel"));`,
        },
      ],
    },
  ],
};

export default topic;
