const fs = require('fs');
let code = fs.readFileSync('frontend/src/admin/components/CustomerMessagesManager.tsx', 'utf8');

// Normalize line endings
const isCRLF = code.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';

// 1. Add ChevronLeft import if not present
if (!code.includes('ChevronLeft,')) {
  code = code.replace(/ChevronRight,/, `ChevronLeft,${nl}  ChevronRight,`);
}

// 2. Left pane toggle on mobile
code = code.replace(
  '<div className="lg:col-span-4 border-r border-slate-100 flex flex-col bg-[#fcfdfc]">',
  `<div className={"lg:col-span-4 border-r border-slate-100 flex flex-col bg-[#fcfdfc] " + (selectedThreadId ? "hidden lg:flex" : "flex")}>`
);

// 3. Right pane toggle on mobile
code = code.replace(
  '<div className="lg:col-span-8 flex flex-col bg-white">',
  `<div className={"lg:col-span-8 flex flex-col bg-white " + (selectedThreadId ? "flex" : "hidden lg:flex")}>`
);

// 4. Back button in active thread header
const oldHeader = `<div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fbfdfb]">`;
const newHeader = `<div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#fbfdfb]">
                {/* Back to Conversations Button on Mobile */}
                <button
                  type="button"
                  onClick={() => setSelectedThreadId('')}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Conversations</span>
                </button>`;

if (code.includes(oldHeader)) {
  code = code.replace(oldHeader, newHeader);
}

fs.writeFileSync('frontend/src/admin/components/CustomerMessagesManager.tsx', code, 'utf8');
console.log('CustomerMessagesManager updated successfully!');
