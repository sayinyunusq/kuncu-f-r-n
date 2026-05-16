"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './globals.css';

export default function UserMenuPage() {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler] = useState(['Hepsi', 'Hamur İşi', 'Kahvaltılık', 'Tatlı', 'Spesiyal']);
  const [seciliKategori, setSeciliKategori] = useState('Hepsi');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Varsayılan lüks koyu tema

  useEffect(() => {
    urunleriGetir();
  }, []);

  async function urunleriGetir() {
    setYukleniyor(true); // Hataya sebep olan satır pürüzsüzce düzeltildi
    try {
      const { data, error } = await supabase
        .from('urunler')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setUrunler(data || []);
    } catch (error) {
      console.error('Menü yüklenirken hata:', error.message);
    } finally {
      setYukleniyor(false);
    }
  }

  const filtrelenmisUrunler = seciliKategori === 'Hepsi' 
    ? urunler 
    : urunler.filter(u => u.kategori === seciliKategori);

  return (
    <main className={`min-h-screen transition-colors duration-500 font-sans relative overflow-hidden ${
      darkMode ? 'bg-[#0F0E0C] text-stone-200' : 'bg-[#FAF8F5] text-stone-800'
    }`}>
      
      {darkMode && (
        <>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />
        </>
      )}

      {/* 👑 PROFESYONEL NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b px-4 py-4 md:px-12 flex justify-between items-center ${
        darkMode ? 'bg-[#161512]/80 border-stone-900' : 'bg-white/80 border-stone-200 shadow-sm'
      }`}>
        <div className="font-serif">
          <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${darkMode ? 'text-amber-500' : 'text-amber-700'}`}>
            KÜNCÜ FIRIN
          </span>
          <span className="text-[9px] font-sans block font-bold uppercase tracking-[0.2em] text-stone-500">
            Chef Bülent
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          {kategoriler.map((kat) => (
            <button 
              key={kat} 
              onClick={() => setSeciliKategori(kat)}
              className={`transition-colors py-1 relative ${
                seciliKategori === kat 
                  ? (darkMode ? 'text-amber-400' : 'text-amber-700') 
                  : 'text-stone-400 hover:text-stone-500'
              }`}
            >
              {kat}
              {seciliKategori === kat && (
                <span className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-700'}`} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 transform active:scale-95 ${
            darkMode 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' 
              : 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200'
          }`}
        >
          {darkMode ? '☀️ Aydınlık Mod' : '🌙 Karanlık Mod'}
        </button>
      </nav>

      {/* ANA İÇERİK ALANI */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12 relative z-10">
        
        <header className="text-center font-serif py-4 max-w-2xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight transition-colors ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>
            Şef Bülent'in <span className="italic font-normal text-amber-600">Özel Seçkisi</span>
          </h1>
          <p className="text-stone-400 text-xs font-sans mt-3 leading-relaxed">
            Yunus'un yönetimindeki dijital vitrinimiz. Tamamı günlük üretilen çıtır hamur işleri, nefis kahvaltılıklar, şerbetli ve sütlü usta işi tatlılar ile spesiyallerimiz.
          </p>
        </header>

        {/* Mobil Kategori Seçici */}
        <div className="flex md:hidden justify-start items-center gap-2 overflow-x-auto pb-2 no-scrollbar font-sans">
          {kategoriler.map((kat) => (
            <button
              key={kat}
              onClick={() => setSeciliKategori(kat)}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                seciliKategori === kat
                  ? 'bg-amber-500 text-neutral-950'
                  : (darkMode ? 'bg-[#161512] text-stone-400' : 'bg-stone-200 text-stone-600')
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* 🍕 KÜÇÜLTÜLMÜŞ LUXURY ÜRÜN VİTRİNİ */}
        {yukleniyor ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
          </div>
        ) : filtrelenmisUrunler.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl border border-dashed p-6 ${darkMode ? 'border-stone-800' : 'border-stone-200'}`}>
            <p className="text-stone-400 italic text-sm font-serif">Tezgâhtaki lezzetler fırından yeni çıkıyor, çok yakında burada...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
            {filtrelenmisUrunler.map((urun) => (
              <div 
                key={urun.id} 
                className={`rounded-2xl overflow-hidden border transition-all duration-500 group flex flex-col justify-between shadow-md transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-[#161512] border-stone-800/60 hover:border-amber-500/30 shadow-black/40' 
                    : 'bg-white border-stone-200/80 hover:border-amber-600/30 shadow-stone-200'
                }`}
              >
                <div className={`relative h-40 w-full overflow-hidden ${darkMode ? 'bg-[#1C1B17]' : 'bg-stone-100'}`}>
                  {urun.gorsel_url ? (
                    <img 
                      src={urun.gorsel_url} 
                      alt={urun.isim} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.90] group-hover:brightness-100" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] italic font-serif">Küncü Masterpiece</div>
                  )}
                  
                  <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-widest bg-neutral-950/80 text-amber-400 px-2 py-1 rounded-md backdrop-blur-sm">
                    {urun.kategori || 'Fırından'}
                  </span>

                  {!urun.stok_var_mi && (
                    <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-[9px] font-bold font-sans uppercase tracking-[0.1em] border border-rose-500/30 bg-rose-950/60 text-rose-400 px-3 py-1.5 rounded-lg">
                        Bitti
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className={`text-base font-serif font-bold transition-colors group-hover:text-amber-500 duration-300 ${
                      darkMode ? 'text-stone-100' : 'text-stone-900'
                    }`}>
                      {urun.isim}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 font-light italic leading-relaxed">
                      {urun.aciklama || 'Şef Bülent’in özel reçetesiyle hazırlanan eşsiz lezzet.'}
                    </p>
                  </div>

                  <div className={`flex items-center justify-between pt-2 border-t ${darkMode ? 'border-stone-900/60' : 'border-stone-100'}`}>
                    <div>
                      <p className="text-[8px] text-stone-500 uppercase tracking-widest font-bold">Fiyat</p>
                      <p className={`text-base font-black mt-0.5 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                        {urun.fiyat} <span className="text-xs font-light text-amber-500">₺</span>
                      </p>
                    </div>

                    {urun.stok_var_mi && (
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                        Taze
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <footer className="text-center font-sans text-[9px] text-stone-500 tracking-widest pt-8 border-t border-stone-900/30 uppercase">
          © 2026 KÜNCÜ FIRIN — Crafted by Yunus & Chef Bülent
        </footer>

      </div>
    </main>
  );
}