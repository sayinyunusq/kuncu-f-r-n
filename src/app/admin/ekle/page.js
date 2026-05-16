"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import '../../globals.css';

export default function UrunEklePage() {
  const [isim, setIsim] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori, setKategori] = useState('Hamur İşi'); // Varsayılan ilk kategori
  const [gorselUrl, setGorselUrl] = useState('');
  const [stokVarMi, setStokVarMi] = useState(true);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yukleniyorResim, setYukleniyorResim] = useState(false);
  const router = useRouter();

  // Ana sayfadaki sıralı sistemle birebir eşleşen kategori listesi
  const sabitKategoriler = ['Hamur İşi', 'Kahvaltılık', 'Tatlı', 'Spesiyal'];

  const resimYukle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setYukleniyorResim(true);
    try {
      const dosyaAdi = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('urun-gorselleri')
        .upload(dosyaAdi, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('urun-gorselleri')
        .getPublicUrl(dosyaAdi);

      setGorselUrl(publicUrlData.publicUrl);
    } catch (error) {
      alert("Görsel yüklenirken bir hata oluştu: " + error.message);
    } finally {
      setYukleniyorResim(false);
    }
  };

  const urunKaydet = async (e) => {
    e.preventDefault();
    setYukleniyor(true);

    try {
      const { error } = await supabase
        .from('urunler')
        .insert([
          {
            isim,
            fiyat: parseFloat(fiyat),
            aciklama,
            kategori, // Seçtiğin kategori doğrudan buraya gidiyor
            gorsel_url: gorselUrl,
            stok_var_mi: stokVarMi
          }
        ]);

      if (error) throw error;
      
      alert("Şef Bülent'in asil lezzeti vitrine başarıyla eklendi!");
      router.push('/admin');
    } catch (error) {
      alert("Ürün eklenirken hata oluştu: " + error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0E0C] text-stone-200 p-4 md:p-12 font-sans flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full bg-[#161512] rounded-3xl p-8 border border-stone-800/80 shadow-2xl relative z-10">
        <header className="mb-6 font-serif border-b border-stone-900 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Yeni Sanat Eseri Ekle</h1>
            <p className="text-stone-500 text-xs font-sans mt-1">Koleksiyona taze bir ürün dahil edin, Şef.</p>
          </div>
          <button onClick={() => router.push('/admin')} className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-wider font-sans font-bold">← Geri Dön</button>
        </header>

        <form onSubmit={urunKaydet} className="space-y-5 font-sans">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ürün İsmi</label>
            <input type="text" required value={isim} onChange={(e) => setIsim(e.target.value)} placeholder="Örn: İzmir Bomba" className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-semibold text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Fiyat (₺)</label>
              <input type="number" step="0.01" required value={fiyat} onChange={(e) => setFiyat(e.target.value)} placeholder="0.00" className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm" />
            </div>

            {/* 🎯 İSTEDİĞİN SEÇMELİ KATEGORİ SİSTEMİ */}
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Vitrin Kategorisi</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm cursor-pointer">
                {sabitKategoriler.map((kat) => (
                  <option key={kat} value={kat} className="bg-[#161512] text-stone-300">
                    {kat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ürün Stoğu</label>
            <select value={stokVarMi ? "var" : "yok"} onChange={(e) => setStokVarMi(e.target.value === "var")} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm cursor-pointer">
              <option value="var" className="bg-[#161512] text-emerald-400">Taze & Stokta Var</option>
              <option value="yok" className="bg-[#161512] text-rose-400">Tükenmiş / Stokta Yok</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ürün Fotoğrafı</label>
            <div className="mt-2 flex items-center gap-4 bg-[#1C1B17] p-4 rounded-xl border border-dashed border-stone-800">
              {gorselUrl && (
                <img src={gorselUrl} alt="Önizleme" className="w-16 h-16 object-cover rounded-xl border border-stone-800" />
              )}
              <div className="flex-1">
                <input type="file" accept="image/*" required={!gorselUrl} onChange={resimYukle} disabled={yukleniyorResim} className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer" />
                {yukleniyorResim && <p className="text-[11px] text-amber-500 font-medium mt-2 animate-pulse">Görsel fırına sürülüyor...</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Şefin Açıklaması</label>
            <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder="Günün taze seçkisi..." className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-300 outline-none transition-all font-light text-sm italic" rows="3" />
          </div>

          <button type="submit" disabled={yukleniyor || yukleniyorResim} className="w-full bg-amber-500 text-neutral-950 py-4 rounded-xl font-bold hover:bg-amber-400 shadow-lg text-xs uppercase tracking-wider transition-all disabled:bg-stone-800 disabled:text-stone-600">
            {yukleniyor ? 'Vitrine Diziliyor...' : 'Lezzeti Vitrine Ekle'}
          </button>
        </form>
      </div>
    </main>
  );
}