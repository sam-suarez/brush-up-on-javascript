import type { Topic } from "../types";

const TREE = `<div id="tree">
  <header id="top"><h1>Site</h1></header>
  <main>
    <section id="post">
      <h2>Title</h2>
      <p>Hello <em>there <strong id="deep">friend</strong></em></p>
    </section>
    <aside id="empty"></aside>
  </main>
  <footer><p>Bye</p></footer>
</div>`;

const topic: Topic = {
  course: "dom",
  slug: "dom-recursion",
  title: "DOM Recursive Functions",
  description: "Walk the tree recursively: count, measure depth and collect leaves.",
  tags: ["recursion", "tree"],
  count: 3,
  challenges: [
    {
      slug: "count-descendants",
      title: "Count all descendants",
      kind: "implement",
      difficulty: 1,
      tags: ["dom", "recursion"],
      description: `Write \`countDescendants(el)\` that returns how many element descendants \`el\` has at any depth (not counting \`el\` itself). Recurse over \`children\`; text nodes don't count.

Example: \`countDescendants(document.getElementById("top"))\` → \`1\``,
      html: TREE,
      starter: `function countDescendants(el) {\n  return el.children.length;\n}\n`,
      solution: `function countDescendants(el) {
  let total = 0;
  for (const child of el.children) {
    total += 1 + countDescendants(child);
  }
  return total;
}`,
      tests: [
        { name: "counts a single child", code: `assert.equal(countDescendants(document.getElementById("top")), 1);` },
        { name: "returns 0 for an element without children", code: `assert.equal(countDescendants(document.getElementById("empty")), 0);` },
        { name: "counts nested descendants", code: `assert.equal(countDescendants(document.getElementById("post")), 4);` },
        { name: "counts the whole tree", code: `assert.equal(countDescendants(document.getElementById("tree")), 11);` },
      ],
    },
    {
      slug: "deepest-level",
      title: "Find the deepest nesting level",
      kind: "implement",
      difficulty: 2,
      tags: ["dom", "recursion"],
      description: `Write \`maxDepth(el)\` that returns how many levels of elements sit below \`el\`: an element with no element children has depth \`0\`, otherwise its depth is one more than its deepest child's.

Example: \`maxDepth(document.getElementById("top"))\` → \`1\``,
      html: TREE,
      starter: `function maxDepth(el) {\n  \n}\n`,
      solution: `function maxDepth(el) {
  let deepest = 0;
  for (const child of el.children) {
    deepest = Math.max(deepest, 1 + maxDepth(child));
  }
  return deepest;
}`,
      tests: [
        { name: "a leaf has depth 0", code: `assert.equal(maxDepth(document.getElementById("deep")), 0);` },
        { name: "one level", code: `assert.equal(maxDepth(document.getElementById("top")), 1);` },
        { name: "follows the deepest branch", code: `assert.equal(maxDepth(document.getElementById("post")), 3);` },
        { name: "measures the whole tree", code: `assert.equal(maxDepth(document.getElementById("tree")), 5);` },
      ],
    },
    {
      slug: "leaf-text",
      title: "Collect the text of all leaf nodes",
      kind: "implement",
      difficulty: 2,
      tags: ["dom", "recursion"],
      description: `Write \`leafTexts(el)\` that returns, in document order, the trimmed \`textContent\` of every leaf element under \`el\` (elements with no element children). Skip leaves whose text is empty. If \`el\` itself is a leaf, it counts.

Example: \`leafTexts(document.getElementById("post"))\` → \`["Title", "friend"]\``,
      html: TREE,
      starter: `function leafTexts(el) {\n  return [...el.children].map((child) => child.textContent.trim());\n}\n`,
      solution: `function leafTexts(el) {
  if (el.children.length === 0) {
    const text = el.textContent.trim();
    return text ? [text] : [];
  }
  return [...el.children].flatMap(leafTexts);
}`,
      tests: [
        { name: "collects nested leaves", code: `assert.deepEqual(leafTexts(document.getElementById("post")), ["Title", "friend"]);` },
        { name: "walks the whole tree in order", code: `assert.deepEqual(leafTexts(document.getElementById("tree")), ["Site", "Title", "friend", "Bye"]);` },
        { name: "skips empty leaves", code: `assert.deepEqual(leafTexts(document.getElementById("empty")), []);` },
        { name: "a leaf returns its own text", code: `assert.deepEqual(leafTexts(document.getElementById("deep")), ["friend"]);` },
      ],
    },
  ],
};

export default topic;
