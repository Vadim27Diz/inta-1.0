#!/usr/bin/env node
// Цифровая сверка Figma ↔ код для контролов группы 1.
//
//   node scripts/figma-code-diff.mjs [--no-build]
//
// Слева — числа из Figma (геометрия вариантов и имена привязанных переменных,
// прочитанные через Figma MCP и зафиксированные в EXPECT).
// Справа — то, что реально считает Chrome на собранном Storybook: getComputedStyle
// у настоящего элемента в каждой из четырёх комбинаций бренд × тема.
// Цвета не хардкодим: ожидание — значение CSS-переменной в том же документе,
// поэтому проверяется именно «класс ведёт к токену», а не совпадение с хексом Main/Light.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(repo, "storybook-static");
const PORT = 6009;

// px — число из Figma; token — имя CSS-переменной, значение которой должно совпасть
const EXPECT = [
  { story: "components-input--variants", title: "Input", probes: [
    { sel: "input:nth-of-type(1)", at: 0, name: "sm value",      height: 32, padX: 12, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "input", at: 2, name: "md value",                     height: 36, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "input", at: 4, name: "lg value",                     height: 40, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [16, 24, 400] },
  ] },
  { story: "components-input--states", title: "Input states", probes: [
    { sel: "input", at: 0, name: "default",       height: 36, padX: 16, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface" },
    { sel: "input", at: 1, name: "focus",         height: 36, border: "--ds-color-border-input", ring: "--ds-color-focus-ring", ringWidth: 3 },
    { sel: "input", at: 2, name: "invalid",       height: 36, border: "--ds-color-danger" },
    { sel: "input", at: 3, name: "invalid+focus", height: 36, border: "--ds-color-danger", ring: "--ds-color-focus-ring", ringWidth: 3 },
    { sel: "input", at: 4, name: "disabled",      height: 36, bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
  ] },
  { story: "components-textarea--states", title: "Textarea", probes: [
    { sel: "textarea", at: 0, name: "default",       minHeight: 64, padX: 12, padY: 8, radius: "--ds-radius-md", border: "--ds-color-border-input", color: "--ds-color-on-surface", font: [14, 20, 400] },
    { sel: "textarea", at: 1, name: "focus",         ring: "--ds-color-focus-ring", ringWidth: 3 },
    { sel: "textarea", at: 2, name: "invalid",       border: "--ds-color-danger" },
    { sel: "textarea", at: 4, name: "disabled",      bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
  ] },
  { story: "components-checkbox--states", title: "Checkbox", probes: [
    { sel: "[data-slot=checkbox]", at: 0, name: "unchecked",      height: 16, width: 16, radius: "--ds-radius-sm", border: "--ds-color-border-input" },
    { sel: "[data-slot=checkbox]", at: 4, name: "checked",        height: 16, width: 16, radius: "--ds-radius-sm", border: "--ds-color-primary", bg: "--ds-color-primary", color: "--ds-color-on-primary" },
    { sel: "[data-slot=checkbox]", at: 5, name: "checked focus",  outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "[data-slot=checkbox]", at: 2, name: "invalid",        border: "--ds-color-danger" },
    { sel: "[data-slot=checkbox]", at: 6, name: "checked invalid", border: "--ds-color-primary" },
    { sel: "[data-slot=checkbox]", at: 7, name: "disabled",       bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
    { sel: "[data-slot=checkbox] svg", at: 0, name: "галка 12",   height: 12, width: 12 },
  ] },
  { story: "components-radiogroup--states", title: "Radio Group", probes: [
    { sel: "[data-slot=radio-group-item]", at: 0, name: "checked",        height: 16, width: 16, radiusFull: true, border: "--ds-color-primary" },
    { sel: "[data-slot=radio-group-item]", at: 1, name: "unchecked",      height: 16, width: 16, radiusFull: true, border: "--ds-color-border-input" },
    { sel: "[data-slot=radio-group-item]", at: 2, name: "focus",          outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "[data-slot=radio-group-item]", at: 4, name: "checked invalid", border: "--ds-color-primary" },
    { sel: "[data-slot=radio-group-item]", at: 5, name: "invalid",        border: "--ds-color-danger" },
    { sel: "[data-slot=radio-group-item]", at: 6, name: "disabled",       bg: "--ds-color-disabled", borderTransparent: true },
    { sel: "[data-slot=radio-group-indicator] span", at: 0, name: "точка 8", height: 8, width: 8, radiusFull: true, bg: "--ds-color-primary" },
  ] },
  { story: "components-switch--states", title: "Switch", probes: [
    { sel: "[data-slot=switch]", at: 0, name: "off",          height: 20, width: 36, radiusFull: true, bg: "--ds-color-border-input", padX: 2 },
    { sel: "[data-slot=switch]", at: 1, name: "off focus",    outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "[data-slot=switch]", at: 2, name: "off disabled", bg: "--ds-color-disabled" },
    { sel: "[data-slot=switch]", at: 3, name: "on",           height: 20, width: 36, bg: "--ds-color-primary" },
    { sel: "[data-slot=switch]", at: 5, name: "on disabled",  bg: "--ds-color-disabled" },
    { sel: "[data-slot=switch-thumb]", at: 0, name: "бегунок", height: 16, width: 16, radiusFull: true, bg: "--ds-switch-thumb" },
    { sel: "[data-slot=switch-thumb]", at: 5, name: "бегунок disabled", bg: "--ds-color-on-disabled" },
  ] },
  { story: "components-label--variants", title: "Label", probes: [
    { sel: "label", at: 0, name: "default",  height: 20, color: "--ds-color-on-surface", font: [14, 20, 500], gap: 4 },
    { sel: "label", at: 1, name: "required", height: 20, color: "--ds-color-on-surface", font: [14, 20, 500], gap: 4, markColor: "--ds-color-on-surface-danger" },
  ] },
  { story: "components-button--sizes", title: "Button sizes", probes: [
    { sel: "[data-slot=button]", at: 0, name: "sm",      height: 32, padX: 12, radius: "--ds-radius-md" },
    { sel: "[data-slot=button]", at: 1, name: "md",      height: 36, padX: 16, radius: "--ds-radius-md" },
    { sel: "[data-slot=button]", at: 2, name: "lg",      height: 40, padX: 24, radius: "--ds-radius-md" },
    { sel: "[data-slot=button]", at: 3, name: "icon",    height: 36, width: 36, radius: "--ds-radius-md" },
    { sel: "[data-slot=button]", at: 4, name: "icon-sm", height: 32, width: 32, radius: "--ds-radius-md" },
    { sel: "[data-slot=button]", at: 5, name: "icon-lg", height: 40, width: 40, radius: "--ds-radius-md" },
  ] },
  { story: "components-button--variants", title: "Button variants", probes: [
    { sel: "[data-slot=button]", at: 0, name: "primary",      bg: "--ds-color-primary",        color: "--ds-color-on-primary" },
    { sel: "[data-slot=button]", at: 1, name: "secondary",    bg: "--ds-color-primary-subtle", color: "--ds-color-on-primary-subtle" },
    { sel: "[data-slot=button]", at: 2, name: "neutral",      bg: "--ds-color-neutral",        color: "--ds-color-on-neutral" },
    { sel: "[data-slot=button]", at: 3, name: "outline",      border: "--ds-color-border",     color: "--ds-color-on-surface" },
    { sel: "[data-slot=button]", at: 4, name: "ghost",        color: "--ds-color-on-surface" },
    { sel: "[data-slot=button]", at: 5, name: "danger",       bg: "--ds-color-danger",         color: "--ds-color-on-danger" },
    { sel: "[data-slot=button]", at: 6, name: "danger-subtle", bg: "--ds-color-danger-subtle", color: "--ds-color-on-danger-subtle" },
    { sel: "[data-slot=button]", at: 7, name: "inverse",      bg: "--ds-color-inverse",        color: "--ds-color-on-inverse" },
    { sel: "[data-slot=button]", at: 8, name: "link",         color: "--ds-color-link" },
    { sel: "[data-slot=button]", at: 9, name: "link-danger",  color: "--ds-color-link-danger" },
  ] },
  // id-пробы читают состояния, зафиксированные storybook-addon-pseudo-states через
  // parameters.pseudo (hover/active/focusVisible) — тот же механизм, что у Item/Checkbox/Switch
  // states выше; подмножество вариантов, а не все 10 — проверяем разные ветки cva (сплошной фон,
  // subtle, outline/ghost без фона, text-only link), не каждую комбинацию.
  { story: "components-button--states", title: "Button states", probes: [
    { sel: "#primary-hover",    at: 0, name: "primary hover",    bg: "--ds-color-primary-hover" },
    { sel: "#primary-pressed",  at: 0, name: "primary pressed",  bg: "--ds-color-primary-pressed" },
    { sel: "#primary-focus",    at: 0, name: "primary focus",    outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
    { sel: "#secondary-hover",  at: 0, name: "secondary hover",  bg: "--ds-color-primary-subtle-hover" },
    { sel: "#outline-hover",    at: 0, name: "outline hover",    bg: "--ds-color-surface-hover", color: "--ds-color-on-surface-hover" },
    { sel: "#ghost-hover",      at: 0, name: "ghost hover",      bg: "--ds-color-surface-hover", color: "--ds-color-on-surface-hover" },
    { sel: "#danger-hover",     at: 0, name: "danger hover",     bg: "--ds-color-danger-hover" },
    { sel: "#link-hover",       at: 0, name: "link hover",       color: "--ds-color-link-hover" },
    { sel: "[data-slot=button][disabled]",  at: 0, name: "primary disabled", bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
    { sel: "[data-slot=button][disabled]",  at: 3, name: "outline disabled", bg: "--ds-color-disabled", color: "--ds-color-on-disabled", borderTransparent: true },
  ] },
  { story: "components-badge--variants", title: "Badge", probes: [
    { sel: "[data-slot=badge]", at: 0, name: "primary",       height: 20, radiusFull: true, padX: 10, padY: 2, font: [12, 16, 500], bg: "--ds-color-primary", color: "--ds-color-on-primary" },
    { sel: "[data-slot=badge]", at: 1, name: "secondary",     bg: "--ds-color-primary-subtle", color: "--ds-color-on-primary-subtle" },
    { sel: "[data-slot=badge]", at: 2, name: "neutral",       bg: "--ds-color-neutral", color: "--ds-color-on-neutral" },
    { sel: "[data-slot=badge]", at: 3, name: "outline",       border: "--ds-color-border", color: "--ds-color-on-surface" },
    { sel: "[data-slot=badge]", at: 4, name: "danger",        bg: "--ds-color-danger", color: "--ds-color-on-danger" },
    { sel: "[data-slot=badge]", at: 5, name: "danger-subtle", bg: "--ds-color-danger-subtle", color: "--ds-color-on-danger-subtle" },
    { sel: "[data-slot=badge]", at: 6, name: "success",       bg: "--ds-color-success-subtle", color: "--ds-color-on-success-subtle" },
    { sel: "[data-slot=badge]", at: 7, name: "warning",       bg: "--ds-color-warning-subtle", color: "--ds-color-on-warning-subtle" },
    { sel: "[data-slot=badge]", at: 8, name: "info",          bg: "--ds-color-info-subtle", color: "--ds-color-on-info-subtle" },
  ] },
  { story: "components-separator--variants", title: "Separator", probes: [
    { sel: "[data-slot=separator]", at: 0, name: "horizontal", height: 1, width: 256, bg: "--ds-color-border" },
    { sel: "[data-slot=separator]", at: 1, name: "vertical",   height: 48, width: 1, bg: "--ds-color-border" },
  ] },
  { story: "components-kbd--variants", title: "Kbd", probes: [
    { sel: "[data-slot=kbd]", at: 0, name: "K", height: 20, radius: "--ds-radius-sm", border: "--ds-color-border-input", bg: "--ds-color-surface-muted", color: "--ds-color-on-surface-muted", font: [14, 20, 400], fontFamily: "JetBrains Mono" },
  ] },
  { story: "components-spinner--variants", title: "Spinner", probes: [
    { sel: "[data-slot=spinner]", at: 0, name: "size-3", height: 12, width: 12, color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=spinner]", at: 1, name: "size-4", height: 16, width: 16, color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=spinner]", at: 4, name: "size-8", height: 32, width: 32, color: "--ds-color-on-surface-muted" },
  ] },
  { story: "components-skeleton--variants", title: "Skeleton", probes: [
    { sel: "[data-slot=skeleton]", at: 0, name: "avatar", height: 40, width: 40, radiusFull: true, bg: "--ds-color-surface-muted" },
    { sel: "[data-slot=skeleton]", at: 1, name: "line 1",  height: 16, width: 192, radius: "--ds-radius-md", bg: "--ds-color-surface-muted" },
    { sel: "[data-slot=skeleton]", at: 2, name: "line 2",  height: 12, width: 128, bg: "--ds-color-surface-muted" },
  ] },
  // blockquote — только font/color: левая обводка (border-l-2) не ловится этим харнессом
  // (он читает s.borderTopColor), проверена глазами на снимках npm run visual.
  { story: "components-typography--variants", title: "Typography", probes: [
    { sel: "[data-slot=typography]", at: 0,  name: "h1",          font: [36, 40, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=typography]", at: 1,  name: "h2",          font: [30, 36, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=typography]", at: 2,  name: "h3",          font: [24, 32, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=typography]", at: 3,  name: "h4",          font: [20, 28, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=typography]", at: 4,  name: "p",           font: [16, 24, 400], color: "--ds-color-on-surface" },
    { sel: "[data-slot=typography]", at: 5,  name: "lead",        font: [18, 28, 400], color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=typography]", at: 6,  name: "large",       font: [20, 28, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=typography]", at: 7,  name: "small",       font: [14, 20, 500], color: "--ds-color-on-surface" },
    { sel: "[data-slot=typography]", at: 8,  name: "muted",       font: [14, 20, 400], color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=typography]", at: 9,  name: "blockquote",  font: [16, 24, 400], color: "--ds-color-on-surface" },
    { sel: "[data-slot=typography]", at: 10, name: "inline-code", font: [14, 20, 400], fontFamily: "JetBrains Mono", color: "--ds-color-on-surface", bg: "--ds-color-surface-muted", radius: "--ds-radius-sm" },
    { sel: "[data-slot=typography]", at: 11, name: "list",        font: [16, 24, 400], color: "--ds-color-on-surface" },
  ] },
  { story: "components-avatar--variants", title: "Avatar", probes: [
    { sel: "[data-slot=avatar]", at: 0, name: "sm", height: 32, width: 32, radiusFull: true },
    { sel: "[data-slot=avatar]", at: 1, name: "md", height: 40, width: 40, radiusFull: true },
    { sel: "[data-slot=avatar]", at: 2, name: "lg", height: 48, width: 48, radiusFull: true },
  ] },
  { story: "components-avatar--content", title: "Avatar fallback", probes: [
    { sel: "[data-slot=avatar-fallback]", at: 0, name: "initials", bg: "--ds-color-neutral", color: "--ds-color-on-neutral", font: [12, 16, 500] },
  ] },
  { story: "components-item--variants", title: "Item", probes: [
    { sel: "[data-slot=item]", at: 0, name: "default",        radius: "--ds-radius-md" },
    { sel: "[data-slot=item]", at: 1, name: "outline",        radius: "--ds-radius-md", border: "--ds-color-border" },
    { sel: "[data-slot=item]", at: 2, name: "muted",          radius: "--ds-radius-md", bg: "--ds-color-surface-muted" },
    { sel: "[data-slot=item-media]", at: 0, name: "media",    height: 32, width: 32, radius: "--ds-radius-sm", border: "--ds-color-border", bg: "--ds-color-surface-muted" },
    { sel: "[data-slot=item-title]", at: 0, name: "title",    font: [14, 20, 500], color: "--ds-color-on-surface" },
    { sel: "[data-slot=item-description]", at: 0, name: "description", font: [14, 20, 400], color: "--ds-color-on-surface-muted" },
  ] },
  { story: "components-item--states", title: "Item states", probes: [
    { sel: "#item-hover", at: 0, name: "hover",  bg: "--ds-color-surface-hover" },
    { sel: "#item-focus", at: 0, name: "focus",  outline: "--ds-color-focus-ring", outlineWidth: 2, outlineOffset: 2 },
  ] },
  // ring-2 ring-surface (box-shadow) не проверяем числом — та же причина, что у Item
  // blockquote: харнесс для ring заточен под focus-состояние, не под всегда-включённый ring;
  // проверено глазами на npm run visual.
  { story: "components-avatar--badge", title: "Avatar badge", probes: [
    { sel: "[data-slot=avatar-badge]", at: 0, name: "sm", height: 10, width: 10, radiusFull: true, bg: "--ds-color-primary" },
    { sel: "[data-slot=avatar-badge]", at: 1, name: "md", height: 12, width: 12, radiusFull: true, bg: "--ds-color-primary" },
    { sel: "[data-slot=avatar-badge]", at: 2, name: "lg", height: 14, width: 14, radiusFull: true, bg: "--ds-color-primary" },
  ] },
  { story: "components-avatar--group", title: "Avatar group", probes: [
    // ширина строки = 4 круга минус 3 перекрытия по 8px (−space-x-2 из исходника shadcn)
    { sel: "[data-slot=avatar-group]", at: 0, name: "sm row (4×32−3×8)", width: 104 },
    { sel: "[data-slot=avatar-group]", at: 1, name: "md row (4×40−3×8)", width: 136 },
    { sel: "[data-slot=avatar-group]", at: 2, name: "lg row (4×48−3×8)", width: 168 },
    { sel: "[data-slot=avatar-group-count]", at: 0, name: "count sm", height: 32, width: 32, radiusFull: true, bg: "--ds-color-surface-muted", color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=avatar-group-count]", at: 1, name: "count md", height: 40, width: 40, radiusFull: true, bg: "--ds-color-surface-muted", color: "--ds-color-on-surface-muted" },
    { sel: "[data-slot=avatar-group-count]", at: 2, name: "count lg", height: 48, width: 48, radiusFull: true, bg: "--ds-color-surface-muted", color: "--ds-color-on-surface-muted" },
  ] },
  // контейнер без width/height: border-dashed на auto-hug фрейме в Figma считает ширину на 2px
  // больше (434 vs 432) даже при strokeAlign=INSIDE — тот же эффект уже был у Item/outline
  // (382 vs 384), поэтому здесь, как и там, геометрия root не проверяется числом.
  { story: "components-empty--variants", title: "Empty", probes: [
    { sel: "[data-slot=empty]", at: 1, name: "container", radius: "--ds-radius-lg", border: "--ds-color-border" },
    { sel: "[data-slot=empty-icon][data-variant=icon]", at: 0, name: "media icon", height: 40, width: 40, radius: "--ds-radius-lg", bg: "--ds-color-surface-muted", color: "--ds-color-on-surface" },
    { sel: "[data-slot=empty-title]", at: 1, name: "title", font: [20, 28, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=empty-description]", at: 1, name: "description", font: [14, 20, 400], color: "--ds-color-on-surface-muted" },
  ] },
  { story: "components-card--variants", title: "Card", probes: [
    { sel: "[data-slot=card]", at: 0, name: "container", radius: "--ds-radius-xl", border: "--ds-color-border", bg: "--ds-color-surface-raised", color: "--ds-color-on-surface-raised" },
    { sel: "[data-slot=card-title]", at: 1, name: "title", font: [20, 28, 600], color: "--ds-color-on-surface", headingFont: true },
    { sel: "[data-slot=card-description]", at: 1, name: "description", font: [14, 20, 400], color: "--ds-color-on-surface-muted" },
  ] },
  // border-border всегда — обводка нейтральная для всех 5 статусов (решение принято, не
  // цветная под вариант). Title/Icon красятся под Variant (--ds-color-on-<variant>-subtle),
  // Description — ВСЕГДА --ds-color-on-surface-muted, независимо от варианта (см. alert.tsx:
  // AlertDescription задаёт цвет явно, AlertTitle наследует от Alert).
  { story: "components-alert--variants", title: "Alert", probes: [
    { sel: "[data-slot=alert]", at: 0, name: "container default", radius: "--ds-radius-lg", border: "--ds-color-border", bg: "--ds-color-surface-raised", color: "--ds-color-on-surface-raised" },
    { sel: "[data-slot=alert]", at: 4, name: "container danger", radius: "--ds-radius-lg", border: "--ds-color-border", bg: "--ds-color-danger-subtle", color: "--ds-color-on-danger-subtle" },
    { sel: "[data-slot=alert-title]", at: 1, name: "title info", font: [14, 20, 500], color: "--ds-color-on-info-subtle" },
    { sel: "[data-slot=alert-description]", at: 3, name: "description warning", font: [14, 20, 400], color: "--ds-color-on-surface-muted" },
  ] },
];
const COMBOS = [
  { brand: "main", theme: "light" },
  { brand: "main", theme: "dark" },
  { brand: "demo", theme: "light" },
  { brand: "demo", theme: "dark" },
];

const args = process.argv.slice(2);
if (!args.includes("--no-build")) execFileSync("npx", ["storybook", "build", "--quiet"], { cwd: repo, stdio: "inherit" });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const f = path.join(STATIC, decodeURIComponent(req.url.split("?")[0]));
  const t = fs.existsSync(f) && fs.statSync(f).isDirectory() ? path.join(f, "index.html") : f;
  if (!fs.existsSync(t)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(t)] || "application/octet-stream" });
  fs.createReadStream(t).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
// reducedMotion: "reduce" — иначе Spinner в середине motion-safe:animate-spin даёт повёрнутый
// getBoundingClientRect() (ось-выровненный прямоугольник у повёрнутого квадрата больше исходного)
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const rows = [];
for (const group of EXPECT) {
  for (const c of COMBOS) {
    await page.goto(`http://localhost:${PORT}/iframe.html?id=${group.story}&viewMode=story&globals=brand:${c.brand};theme:${c.theme}`, { waitUntil: "load" });
    await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const measured = await page.evaluate((probes) => {
      const root = document.documentElement;
      const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();
      const toPx = (v) => (v.endsWith("px") ? parseFloat(v) : parseFloat(v));
      const rgb = (v) => { const d = document.createElement("div"); d.style.color = v; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
      // размеры токенов объявлены в rem — переводим в px так же, как это делает браузер
      const px = (v) => { const d = document.createElement("div"); d.style.width = v; document.body.appendChild(d); const w = getComputedStyle(d).width; d.remove(); return parseFloat(w); };
      return probes.map((p) => {
        const el = document.querySelectorAll(p.sel)[p.at];
        if (!el) return { missing: true };
        const s = getComputedStyle(el);
        const mark = el.querySelector("span[aria-hidden]");
        return {
          height: el.getBoundingClientRect().height,
          width: el.getBoundingClientRect().width,
          minHeight: toPx(s.minHeight),
          padLeft: toPx(s.paddingLeft), padRight: toPx(s.paddingRight),
          padTop: toPx(s.paddingTop), padBottom: toPx(s.paddingBottom),
          radius: toPx(s.borderTopLeftRadius),
          borderColor: s.borderTopColor, borderWidth: toPx(s.borderTopWidth),
          color: s.color, bg: s.backgroundColor,
          outlineColor: s.outlineColor, outlineWidth: toPx(s.outlineWidth), outlineStyle: s.outlineStyle, outlineOffset: toPx(s.outlineOffset),
          boxShadow: s.boxShadow,
          fontSize: toPx(s.fontSize), lineHeight: toPx(s.lineHeight), fontWeight: Number(s.fontWeight), fontFamily: s.fontFamily.split(",")[0].replace(/["']/g, ""),
          gap: toPx(s.columnGap),
          markColor: mark ? getComputedStyle(mark).color : null,
          // тип переменной — по полю, в котором она объявлена в EXPECT (radius = размер, остальные = цвет),
          // а не по имени: токены Component-слоя (switch/thumb, sidebar/*) не содержат "color" в названии
          vars: Object.fromEntries([
            ...new Set(probes.flatMap((x) => (x.radius ? [[x.radius, "size"]] : []).concat(["border", "color", "bg", "outline", "ring", "markColor"].map((k) => x[k] && [x[k], "color"]).filter(Boolean)).map((e) => JSON.stringify(e)))),
          ].map((e) => JSON.parse(e)).map(([n, kind]) => [n, kind === "color" ? rgb(cssVar(n)) : String(px(cssVar(n)))])),
        };
      });
    }, group.probes);

    group.probes.forEach((p, i) => {
      const m = measured[i];
      const checks = [];
      const eq = (label, got, want) => checks.push({ label, got, want, ok: got === want });
      const near = (label, got, want) => checks.push({ label, got, want, ok: Math.abs(got - want) < 0.51 });
      if (m.missing) { rows.push({ group: group.title, combo: `${c.brand}/${c.theme}`, probe: p.name, checks: [{ label: "элемент", got: "нет", want: p.sel, ok: false }] }); return; }
      if (p.height != null) near("height", m.height, p.height);
      if (p.width != null) near("width", m.width, p.width);
      if (p.radiusFull) checks.push({ label: "radius", got: m.radius >= 999 ? "круг" : m.radius, want: "круг", ok: m.radius >= 999 });
      if (p.minHeight != null) near("min-height", m.minHeight, p.minHeight);
      if (p.padX != null) { near("padding-x", m.padLeft, p.padX); near("padding-x", m.padRight, p.padX); }
      if (p.padY != null) { near("padding-y", m.padTop, p.padY); near("padding-y", m.padBottom, p.padY); }
      if (p.radius) near("radius", m.radius, parseFloat(m.vars[p.radius]));
      if (p.border) eq("border-color", m.borderColor, m.vars[p.border]);
      if (p.borderTransparent) eq("border-color", m.borderColor, "rgba(0, 0, 0, 0)");
      if (p.bg) eq("background", m.bg, m.vars[p.bg]);
      if (p.color) eq("color", m.color, m.vars[p.color]);
      if (p.markColor) eq("звёздочка", m.markColor, m.vars[p.markColor]);
      if (p.outline) { eq("outline-color", m.outlineColor, m.vars[p.outline]); eq("outline-style", m.outlineStyle, "solid"); near("outline-width", m.outlineWidth, p.outlineWidth); near("outline-offset", m.outlineOffset, p.outlineOffset); }
      if (p.ring) {
        // Kind=field — кольцо через box-shadow (Tailwind ring-N), не outline: вплотную, без
        // зазора. box-shadow — список слоёв через запятую ("<color> Xpx Xpx Xpx Spx" каждый);
        // настоящее кольцо — единственный слой с ненулевым spread (4-е число), остальные
        // (inset-shadow/ring-offset-shadow/shadow) — заглушки "0 0 0 0".
        const layers = (m.boxShadow || "").split(/,(?![^(]*\))/).map((s) => s.trim());
        const ring = layers.map((l) => l.match(/^(.+?)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px$/))
          .find((mm) => mm && parseFloat(mm[5]) !== 0);
        checks.push({ label: "ring", got: ring ? "found" : "none", want: "found", ok: !!ring });
        if (ring) {
          eq("ring-color", ring[1], m.vars[p.ring]);
          near("ring-width", parseFloat(ring[5]), p.ringWidth);
          near("ring-offset", parseFloat(ring[2]), 0); near("ring-offset", parseFloat(ring[3]), 0);
        }
      }
      if (p.font) {
        near("font-size", m.fontSize, p.font[0]); near("line-height", m.lineHeight, p.font[1]); near("font-weight", m.fontWeight, p.font[2]);
        // typo-code/numeric-* висят на font/mono; typo-heading-* — на font/heading (в Demo это
        // IBM Plex SERIF, а не Sans — в остальных токенах такого различия не было, пока не
        // появился Typography, тестирующий сами заголовочные стили)
        const wantFamily = p.fontFamily || (p.headingFont
          ? (c.brand === "main" ? "Inter" : "IBM Plex Serif")
          : (c.brand === "main" ? "Inter" : "IBM Plex Sans"));
        checks.push({ label: "font-family", got: m.fontFamily, want: wantFamily, ok: m.fontFamily === wantFamily });
      }
      if (p.gap != null) near("gap", m.gap, p.gap);
      rows.push({ group: group.title, combo: `${c.brand}/${c.theme}`, probe: p.name, checks });
    });
  }
}
await browser.close();
server.close();

let bad = 0, total = 0;
let lastGroup = null;
for (const r of rows) {
  if (r.group !== lastGroup) { console.log(`\n=== ${r.group} ===`); lastGroup = r.group; }
  const fails = r.checks.filter((c) => !c.ok);
  total += r.checks.length;
  bad += fails.length;
  const mark = fails.length ? "✗" : "✓";
  console.log(`${mark} ${r.combo.padEnd(11)} ${r.probe.padEnd(14)} ${r.checks.length} проверок${fails.length ? ": " + fails.map((f) => `${f.label} ${f.got} ≠ ${f.want}`).join("; ") : ""}`);
}
console.log(`\n${rows.length} срезов · ${total} проверок · ${bad} расхождений`);
process.exit(bad ? 1 : 0);
