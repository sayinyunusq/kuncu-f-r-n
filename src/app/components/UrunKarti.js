'use client';

export default function UrunKarti({ urun }) {
  const { isim, aciklama, fiyat, gorsel_url, stok_var_mi } = urun;

  return (
    <div 
      className={`relative flex bg-white rounded-2xl p-3 border border-kuncu-altin/10 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up ${
        !stok_var_mi ? 'opacity-60 grayscale-[30%]' : ''
      }`}
    >
      <div className="relative w-24 h-24 flex-shrink-0 bg-kuncu-krem rounded-xl overflow-hidden border border-kuncu-altin/5 flex items-center justify-center">
        {gorsel_url ? (
          <img src={gorsel_url} alt={isim} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-3xl">🥐</span>
        )}
        {!stok_var_mi && (
          <div className="absolute inset-0 bg-kuncu-kahve/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-kuncu-krem tracking-wider bg-kuncu-altin/90 px-2 py-0.5 rounded-md uppercase">
              Tükendi
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between pl-3 flex-grow">
        <div>
          <h3 className="font-semibold text-base text-kuncu-kahve leading-tight">{isim}</h3>
          {aciklama && <p className="text-xs text-kuncu-kahve/60 line-clamp-2 mt-1 font-light">{aciklama}</p>}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className={`text-base font-bold ${!stok_var_mi ? 'text-kuncu-kahve/40 line-through' : 'text-kuncu-altin'}`}>
            {fiyat} TL
          </span>
          {stok_var_mi && (
            <span className="text-[10px] bg-kuncu-krem text-kuncu-kahve/50 border border-kuncu-altin/20 px-2 py-0.5 rounded-full font-medium">
              Taptaze
            </span>
          )}
        </div>
      </div>
    </div>
  );
}