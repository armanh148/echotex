const fs = require('fs');

// 1. AdminTopBar.tsx
let topbar = fs.readFileSync('frontend/src/admin/components/AdminTopBar.tsx', 'utf8');
topbar = topbar.replace(
  'px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs',
  'px-3 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs'
);
topbar = topbar.replace(
  '<h1 className="text-lg sm:text-xl font-black text-[#0f172a] tracking-tight">',
  '<h1 className="text-sm xs:text-base sm:text-xl font-black text-[#0f172a] tracking-tight truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">'
);
fs.writeFileSync('frontend/src/admin/components/AdminTopBar.tsx', topbar, 'utf8');
console.log('AdminTopBar.tsx updated!');

// 2. HomepageManager.tsx
let hp = fs.readFileSync('frontend/src/admin/components/HomepageManager.tsx', 'utf8');
hp = hp.replace(
  'className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer w-full text-left border group ${',
  'className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-w-[190px] lg:w-full text-left border group ${'
);
hp = hp.replace(
  '<div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">',
  '<div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">'
);
fs.writeFileSync('frontend/src/admin/components/HomepageManager.tsx', hp, 'utf8');
console.log('HomepageManager.tsx updated!');

// 3. DashboardOverview.tsx
let dash = fs.readFileSync('frontend/src/admin/components/DashboardOverview.tsx', 'utf8');
dash = dash.replace(
  'rounded-3xl bg-gradient-to-r from-[#4E9F76] via-[#007018] to-[#0f172a] text-white p-6 sm:p-8 shadow-xl',
  'rounded-3xl bg-gradient-to-r from-[#4E9F76] via-[#007018] to-[#0f172a] text-white p-4 sm:p-8 shadow-xl'
);
dash = dash.replace(
  '<div className="flex items-center justify-between gap-3 mb-3">',
  '<div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">'
);
dash = dash.replace(
  '<div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">',
  '<div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">'
);
dash = dash.replace(
  '<div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">',
  '<div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">'
);
fs.writeFileSync('frontend/src/admin/components/DashboardOverview.tsx', dash, 'utf8');
console.log('DashboardOverview.tsx updated!');

// 4. CategoriesManager.tsx
let cat = fs.readFileSync('frontend/src/admin/components/CategoriesManager.tsx', 'utf8');
cat = cat.replace(
  '<div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#B2E2C5]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">',
  '<div className="bg-white p-4 sm:p-7 rounded-3xl border border-[#B2E2C5]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">'
);
cat = cat.replace(
  '<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">',
  '<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">'
);
fs.writeFileSync('frontend/src/admin/components/CategoriesManager.tsx', cat, 'utf8');
console.log('CategoriesManager.tsx updated!');

// 5. OffersDealsManager.tsx
let offers = fs.readFileSync('frontend/src/admin/components/OffersDealsManager.tsx', 'utf8');
offers = offers.replace(
  '<div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">',
  '<div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs">'
);
offers = offers.replace(
  '<div className="w-full rounded-[32px] sm:rounded-[40px] bg-[#FFF5ED] border border-[#FFE0CC] p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">',
  '<div className="w-full rounded-[32px] sm:rounded-[40px] bg-[#FFF5ED] border border-[#FFE0CC] p-4 sm:p-10 lg:p-12 shadow-xs overflow-hidden">'
);
offers = offers.replace(
  '<div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200/70 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">',
  '<div className="bg-white rounded-3xl p-4 sm:p-8 shadow-lg border border-stone-200/70 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">'
);
fs.writeFileSync('frontend/src/admin/components/OffersDealsManager.tsx', offers, 'utf8');
console.log('OffersDealsManager.tsx updated!');

// 6. MediaLibraryManager.tsx
let media = fs.readFileSync('frontend/src/admin/components/MediaLibraryManager.tsx', 'utf8');
media = media.replace(
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">',
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">'
);
fs.writeFileSync('frontend/src/admin/components/MediaLibraryManager.tsx', media, 'utf8');
console.log('MediaLibraryManager.tsx updated!');

// 7. RfqOrdersInbox.tsx
let rfq = fs.readFileSync('frontend/src/admin/components/RfqOrdersInbox.tsx', 'utf8');
rfq = rfq.replace(
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">',
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">'
);
fs.writeFileSync('frontend/src/admin/components/RfqOrdersInbox.tsx', rfq, 'utf8');
console.log('RfqOrdersInbox.tsx updated!');

// 8. CustomSelect.tsx
let select = fs.readFileSync('frontend/src/admin/components/ui/CustomSelect.tsx', 'utf8');
select = select.replace(
  'max-w-[280px]',
  'max-w-[calc(100vw-2rem)] sm:max-w-[280px]'
);
fs.writeFileSync('frontend/src/admin/components/ui/CustomSelect.tsx', select, 'utf8');
console.log('CustomSelect.tsx updated!');

// 9. PageContentEditor.tsx
let pce = fs.readFileSync('frontend/src/admin/components/PageContentEditor.tsx', 'utf8');
pce = pce.replace(
  '<div className="flex-1 min-w-0 w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/40 shadow-xs">',
  '<div className="flex-1 min-w-0 w-full bg-white rounded-3xl p-4 sm:p-8 border border-[#B2E2C5]/40 shadow-xs">'
);
fs.writeFileSync('frontend/src/admin/components/PageContentEditor.tsx', pce, 'utf8');
console.log('PageContentEditor.tsx updated!');

// 10. SiteSettingsManager.tsx
let ssm = fs.readFileSync('frontend/src/admin/components/SiteSettingsManager.tsx', 'utf8');
ssm = ssm.replace(
  '<div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">',
  '<div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">'
);
fs.writeFileSync('frontend/src/admin/components/SiteSettingsManager.tsx', ssm, 'utf8');
console.log('SiteSettingsManager.tsx updated!');
