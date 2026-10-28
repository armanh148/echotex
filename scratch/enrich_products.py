import json

def enrich_product(p):
    p.setdefault('rating', 4.9)
    clean_id = p.get('id', 'prod').replace('-', '').upper()[:8]
    p.setdefault('articleNo', f'EP-{clean_id}')
    p.setdefault('volumeNo', f'{p.get("gsm", 45)} GSM LUXURY')
    p.setdefault('originalPrice', round(p.get('pricePerUnit', 0.25) * 1.35, 3))
    p.setdefault('wholesaleMoq', 5)
    img = p.get('image', '/images/bag-green.png')
    p.setdefault('galleryImages', [
        img,
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
    ])
    p.setdefault('recommendedPrint', 'High-Precision Flexographic Custom Imprint')
    p.setdefault('brandName', 'ECOTEX INC.')
    p.setdefault('fabricDetails', f'{p.get("gsm", 45)} GSM Virgin Non-Woven Polypropylene')
    p.setdefault('handles', 'Ultrasonic Thermal Welded Loops')
    p.setdefault('printingMethod', 'High-Precision Flexographic / Gravure Custom Imprint')
    p.setdefault('compliance', 'Certified California SB 270 & ASTM D6400')
    p.setdefault('packingDetails', 'Export-Grade Heavy Duty Corrugated Cartons')
    p.setdefault('guaranteedFabric', '100% Virgin Grade Recyclable Polypropylene')
    p.setdefault('enrouteQuality', 'Enroute to Quality Standard')
    p.setdefault('trustBadge1', 'Fast Delivery')
    p.setdefault('trustBadge2', 'Secure Store')
    p.setdefault('trustBadge3', 'Easy Return')
    p.setdefault('retailPolicyText', 'Retail orders are dispatched within 24-48 hours with door-to-door courier tracking.')
    p.setdefault('wholesalePolicyText', 'Pallet freight delivery with ultrasonic batch testing verification reports.')
    p.setdefault('outOfStockNotice', 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.')
    return p

for fpath in ['backend/db.json', 'backend/db.backup.json']:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        data['products'] = [enrich_product(p) for p in data.get('products', [])]
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f'Enriched products in {fpath}')
    except Exception as e:
        print(f'Error on {fpath}: {e}')
