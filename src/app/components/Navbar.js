'use client';

export default function Navbar({ aktifKategori, setAktifKategori }) {
  const kategoriler = [
    { id: 'tum', etiket: '✨ Tüm Ürünler' },
    { id: 'tuzlu', etiket: '🥐 Tuzlular & Simit' },
    { id: 'tatli', etiket: '🍰 Tatlı & Kurabiye' },
    { id: 'icecek', etiket: '☕ İçecekler' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-kuncu-krem/90 backdrop-blur-md border-b border-kuncu-altin/20 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-kuncu-kahve tracking-wide">KÜNCÜ</h1>
          <p className="text-xs text-kuncu-altin italic font-light">Taptaze Fırın Lezzetleri</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth snap-x">
          {kategoriler.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setAktifKategori(kat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 snap-center ${
                aktifKategori === kat.id
                  ? 'bg-kuncu-kahve text-kuncu-krem shadow-md scale-105'
                  : 'bg-kuncu-altin/10 text-kuncu-kahve hover:bg-kuncu-altin/20'
              }`}
            >
              {kat.etiket}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}