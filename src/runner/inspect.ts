// Node-like, single-line value formatting for the console shim and assertion messages.

const MAX_DEPTH = 2;
const MAX_ITEMS = 100;
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

export function formatArgs(args: unknown[]): string {
  return args.map((arg) => (typeof arg === "string" ? arg : inspect(arg))).join(" ");
}

export function inspect(value: unknown): string {
  return format(value, 0, new Set(), true);
}

function quote(s: string): string {
  return `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'`;
}

function formatKey(key: string): string {
  return IDENTIFIER.test(key) ? key : quote(key);
}

function formatFunction(fn: (...args: never[]) => unknown): string {
  const source = Function.prototype.toString.call(fn);
  if (source.startsWith("class")) return fn.name ? `[class ${fn.name}]` : "[class (anonymous)]";
  const kind = fn.constructor?.name && fn.constructor.name !== "Function" ? fn.constructor.name : "Function";
  return fn.name ? `[${kind}: ${fn.name}]` : `[${kind} (anonymous)]`;
}

function isDomNode(value: object): value is Node {
  return typeof Node !== "undefined" && value instanceof Node;
}

function formatDomNode(node: Node): string {
  if (node.nodeType === 3) return `#text ${quote(node.textContent ?? "")}`;
  if (node.nodeType === 9) return "#document";
  if (node.nodeType === 1) {
    const html = (node as Element).outerHTML;
    return html.length > 80 ? `${html.slice(0, 77)}...` : html;
  }
  return node.nodeName;
}

function format(value: unknown, depth: number, seen: Set<object>, topLevel = false): string {
  switch (typeof value) {
    case "string":
      return quote(value);
    case "number":
      return Object.is(value, -0) ? "-0" : String(value);
    case "bigint":
      return `${value}n`;
    case "boolean":
    case "undefined":
      return String(value);
    case "symbol":
      return value.toString();
    case "function":
      return formatFunction(value as (...args: never[]) => unknown);
  }
  if (value === null) return "null";
  const obj = value as object;

  if (seen.has(obj)) return "[Circular]";
  if (isDomNode(obj)) return formatDomNode(obj);
  if (obj instanceof Date) return Number.isNaN(obj.getTime()) ? "Invalid Date" : obj.toISOString();
  if (obj instanceof RegExp) return String(obj);
  if (obj instanceof Error) return topLevel ? `${obj.name}: ${obj.message}` : `[${obj.name}: ${obj.message}]`;
  if (obj instanceof Promise) return "Promise {}";
  if (obj instanceof WeakMap) return "WeakMap { <items unknown> }";
  if (obj instanceof WeakSet) return "WeakSet { <items unknown> }";

  const proto = Object.getPrototypeOf(obj);
  const ctorName: string | undefined = proto === null ? undefined : proto.constructor?.name;

  if (depth > MAX_DEPTH) {
    if (Array.isArray(obj)) return "[Array]";
    return `[${ctorName ?? "Object"}]`;
  }

  seen.add(obj);
  try {
    const next = (v: unknown) => format(v, depth + 1, seen);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const parts: string[] = [];
      let holes = 0;
      const flushHoles = () => {
        if (holes) parts.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
        holes = 0;
      };
      const shown = Math.min(obj.length, MAX_ITEMS);
      for (let i = 0; i < shown; i++) {
        if (!(i in obj)) {
          holes++;
          continue;
        }
        flushHoles();
        parts.push(next(obj[i]));
      }
      flushHoles();
      if (obj.length > MAX_ITEMS) parts.push(`... ${obj.length - MAX_ITEMS} more items`);
      const extra = Object.keys(obj).filter((k) => !/^\d+$/.test(k));
      for (const k of extra)
        parts.push(`${formatKey(k)}: ${next((obj as unknown as Record<string, unknown>)[k])}`);
      const prefix = ctorName && ctorName !== "Array" ? `${ctorName}(${obj.length}) ` : "";
      return `${prefix}[ ${parts.join(", ")} ]`;
    }

    if (obj instanceof Map) {
      if (obj.size === 0) return "Map(0) {}";
      const parts = [...obj].map(([k, v]) => `${next(k)} => ${next(v)}`);
      return `Map(${obj.size}) { ${parts.join(", ")} }`;
    }

    if (obj instanceof Set) {
      if (obj.size === 0) return "Set(0) {}";
      return `Set(${obj.size}) { ${[...obj].map(next).join(", ")} }`;
    }

    if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
      const arr = Array.from(obj as unknown as ArrayLike<number>);
      return `${ctorName}(${arr.length}) [ ${arr.map(next).join(", ")} ]`;
    }

    const parts: string[] = [];
    for (const key of Object.keys(obj)) {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc && (desc.get || desc.set)) {
        parts.push(
          `${formatKey(key)}: [${desc.get && desc.set ? "Getter/Setter" : desc.get ? "Getter" : "Setter"}]`,
        );
      } else {
        parts.push(`${formatKey(key)}: ${next((obj as Record<string, unknown>)[key])}`);
      }
    }
    const prefix =
      proto === null ? "[Object: null prototype] " : ctorName && ctorName !== "Object" ? `${ctorName} ` : "";
    return parts.length ? `${prefix}{ ${parts.join(", ")} }` : `${prefix}{}`;
  } finally {
    seen.delete(obj);
  }
}
