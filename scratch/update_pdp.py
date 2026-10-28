import re

with open('frontend/src/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize CRLF to LF for reliable replacements
is_crlf = '\r\n' in text
text = text.replace('\r\n', '\n')

old_state = """    trustBadge3: product.trustBadge3 || 'Easy Return',
  });"""

new_state = """    trustBadge3: product.trustBadge3 || 'Easy Return',
    retailPolicyText: product.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
    wholesalePolicyText: product.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
    outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
  });"""

old_effect = """      trustBadge3: product.trustBadge3 || 'Easy Return',
    });
  }, [product]);"""

new_effect = """      trustBadge3: product.trustBadge3 || 'Easy Return',
      retailPolicyText: product.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: product.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    });
  }, [product]);"""

old_save = """      trustBadge3: editForm.trustBadge3.trim(),
    };"""

new_save = """      trustBadge3: editForm.trustBadge3.trim(),
      retailPolicyText: editForm.retailPolicyText.trim(),
      wholesalePolicyText: editForm.wholesalePolicyText.trim(),
      outOfStockNotice: editForm.outOfStockNotice.trim(),
    };"""

old_oos = """                    <p className="font-bold">Yeh item abhi out of stock ho chuka hai</p>
                    <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                      Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.
                    </p>"""

new_oos = """                    <p className="font-bold">Yeh item abhi out of stock ho chuka hai</p>
                    <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                      {product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'}
                    </p>"""

old_badges_tab = """                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Trust Badge 3 (Return Icon)</span>
                        <input
                          type="text"
                          value={editForm.trustBadge3}
                          onChange={(e) => setEditForm({ ...editForm, trustBadge3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                          placeholder="Easy Return"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}"""

new_badges_tab = """                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Trust Badge 3 (Return Icon)</span>
                        <input
                          type="text"
                          value={editForm.trustBadge3}
                          onChange={(e) => setEditForm({ ...editForm, trustBadge3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs"
                          placeholder="Easy Return"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <label className="block font-bold text-slate-800">
                      Ordering Policies & Out of Stock Notification
                    </label>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">Retail Order Policy Text</span>
                      <textarea
                        rows={2}
                        value={editForm.retailPolicyText}
                        onChange={(e) => setEditForm({ ...editForm, retailPolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                        placeholder="Retail policy notice..."
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">Wholesale Order Policy Text</span>
                      <textarea
                        rows={2}
                        value={editForm.wholesalePolicyText}
                        onChange={(e) => setEditForm({ ...editForm, wholesalePolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                        placeholder="Wholesale policy notice..."
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-rose-700 block mb-1">Out of Stock Notice Text (When Stock is 0)</span>
                      <textarea
                        rows={2}
                        value={editForm.outOfStockNotice}
                        onChange={(e) => setEditForm({ ...editForm, outOfStockNotice: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs font-medium text-rose-900"
                        placeholder="Out of stock notification..."
                      />
                    </div>
                  </div>
                </div>
              )}"""

for name, o, n in [
    ("state", old_state, new_state),
    ("effect", old_effect, new_effect),
    ("save", old_save, new_save),
    ("oos", old_oos, new_oos),
    ("badges", old_badges_tab, new_badges_tab),
]:
    if o in text:
        text = text.replace(o, n, 1)
        print(f"Applied {name}")
    else:
        print(f"NOT FOUND: {name}")

if is_crlf:
    text = text.replace('\n', '\r\n')

with open('frontend/src/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated ProductDetailPage.tsx successfully!")
