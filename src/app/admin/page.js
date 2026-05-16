"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import '../globals.css';

const encode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  })).split('').reverse().join('');
};

const HASHED_USER = encode('admin');
const HASHED_PASS = encode('kuncufırın');

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenlenenUrun, setDuzenlenenUrun] = useState(null);
  const [yukleniyorResim, setYukleniyorResim] = useState(false);
  const router = useRouter();

  // Düzenleme ekranı için de sabit sıralı kategorilerimiz
  const sabitKategoriler = ['Hamur İşi', 'Kahvaltılık', 'Tatlı', 'Spesiyal'];

  useEffect(() => {
    const session = localStorage.getItem('kuncu_admin_session');
    if (session === 'active_authenticated') {
      setIsLoggedIn(true);
      urunleriGetir();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (encode(username) === HASHED_USER && encode(password) === HASHED_PASS) {
      localStorage.setItem('kuncu_admin_session', 'active_authenticated');
      setIsLoggedIn(true);
      setLoginError('');
      urunleriGetir();
    } else {
      setLoginError('Erişim reddedildi. Bilgileri kontrol edin.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kuncu_admin_session');
    setIsLoggedIn(false);
  };

  async function urunleriGetir() {
    setYukleniyor(true);
    try {
      const { data, error } = await supabase
        .from('urunler')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setUrunler(data || []);
    } catch (error) {
      console.error('Hata:', error.message);
    } finally {
      setYukleniyor(false);
    }
  }

  const urunSil = async (id) => {
    if (!window.confirm("Bu asil lezzeti listeden kaldırmak istediğinize emin misiniz?")) return;
    const { error } = await supabase.from('urunler').delete().eq('id', id);
    if (!error) setUrunler(urunler.filter(u => u.id !== id));
  };

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

      setDuzenlenenUrun({ ...duzenlenenUrun, gorsel_url: publicUrlData.publicUrl });
    } catch (error) {
      alert("Görsel işlenirken hata oluştu: " + error.message);
    } finally {
      setYukleniyorResim(false);
    }
  };

  const urunGuncelle = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('urunler')
        .update({
          isim: duzenlenenUrun.isim,
          fiyat: parseFloat(duzenlenenUrun.fiyat),
          aciklama: duzenlenenUrun.aciklama,
          kategori: duzenlenenUrun.kategori, // Güncellenen seçmeli kategori
          gorsel_url: duzenlenenUrun.gorsel_url, 
          stok_var_mi: duzenlenenUrun.stok_var_mi
        })
        .eq('id', duzenlenenUrun.id);
      
      if (error) throw error;
      setDuzenlenenUrun(null);
      urunleriGetir();
    } catch (error) {
      alert("Güncelleme başarısız: " + error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0E0C] p-4 relative overflow-hidden font-serif">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px]" />

        <div className="max-w-md w-full bg-[#161512] rounded-3xl p-10 border border-amber-900/30 shadow-2xl relative z-10 duration-700">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-amber-500 tracking-tight select-none">KÜNCÜ</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500 mt-2 font-sans font-semibold">
              Boutique Bakery <span className="italic text-amber-600/80 lowercase font-serif font-normal">control panel</span>
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 font-sans">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Yönetici Adı</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-4 rounded-xl text-stone-200 outline-none transition-all font-medium text-sm focus:ring-1" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Güvenlik Anahtarı</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-4 rounded-xl text-stone-200 outline-none transition-all font-medium text-sm focus:ring-1" />
            </div>

            {loginError && (
              <p className="text-rose-400 text-xs font-semibold text-center bg-rose-950/20 py-2.5 rounded-xl border border-rose-900/30">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 transition-all duration-300 text-neutral-950 py-4 rounded-xl font-bold tracking-wider text-xs uppercase shadow-lg transform active:scale-[0.98]">
              Kapıyı Aç
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0E0C] text-stone-200 p-4 md:p-12 font-sans relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#161512] p-8 rounded-3xl border border-stone-800/60 shadow-xl gap-6 backdrop-blur-md">
          <div className="font-serif">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-amber-500 tracking-tight">KÜNCÜ</h1>
              <span className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20">Chef Menu</span>
            </div>
            <p className="text-stone-400 text-xs mt-2 font-sans">
              Tezgâhtaki sanatı ve stok durumunu buradan yönetin, <span className="italic text-amber-500/70 font-serif">Yunus.</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto font-sans">
            <button onClick={() => router.push('/admin/ekle')} className="flex-1 lg:flex-none bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md transform hover:-translate-y-0.5">+ Koleksiyona Ürün Ekle</button>
            <button onClick={handleLogout} className="border border-stone-800 hover:border-stone-700 hover:bg-stone-900/50 text-stone-400 hover:text-stone-200 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Güvenli Çıkış</button>
          </div>
        </header>

        {yukleniyor ? (
          <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urunler.map((urun) => (
              <div key={urun.id} className="bg-[#161512] rounded-3xl overflow-hidden border border-stone-800/60 hover:border-amber-500/30 transition-all duration-500 group flex flex-col justify-between shadow-lg">
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  {urun.gorsel_url ? (
                    <img src={urun.gorsel_url} alt={urun.isim} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs italic">Görsel bulunmuyor</div>
                  )}
                  <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest bg-neutral-950/80 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-sm">{urun.kategori || 'Genel'}</span>
                  <span className={`absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg backdrop-blur-sm border ${urun.stok_var_mi ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/20' : 'bg-rose-950/80 text-rose-400 border-rose-500/20'}`}>{urun.stok_var_mi ? '● Stokta' : '○ Tükendi'}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-amber-400 transition-colors duration-300">{urun.isim}</h3>
                    <p className="text-xs text-stone-400 mt-2 line-clamp-2 font-light italic leading-relaxed">{urun.aciklama || 'Şef Bülent’in gizli tarifiyle hazırlanan, günün en taze asil seçkisi.'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-900">
                    <div>
                      <p className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Fiyatlandırma</p>
                      <p className="text-lg font-black text-stone-200 mt-0.5">{urun.fiyat} <span className="text-sm font-light text-amber-500">₺</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setDuzenlenenUrun(urun)} className="px-3.5 py-2 text-xs font-bold text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-xl transition-all">Düzenle</button>
                      <button onClick={() => urunSil(urun.id)} className="px-3.5 py-2 text-xs font-bold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all">Sil</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Gelişmiş Düzenleme Penceresi (Modal) --- */}
      {duzenlenenUrun && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#161512] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-800 relative">
            <div className="bg-gradient-to-r from-amber-900/40 to-stone-900 p-6 border-b border-stone-800 flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-amber-400">Tarif ve Raf Detaylarını Güncelle</h2>
              <button type="button" onClick={() => setDuzenlenenUrun(null)} className="text-stone-500 hover:text-stone-300 text-sm">✕</button>
            </div>

            <form onSubmit={urunGuncelle} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ürün İsmi</label>
                <input type="text" required value={duzenlenenUrun.isim} onChange={(e) => setDuzenlenenUrun({...duzenlenenUrun, isim: e.target.value})} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-semibold text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Fiyat (₺)</label>
                  <input type="number" step="0.01" required value={duzenlenenUrun.fiyat} onChange={(e) => setDuzenlenenUrun({...duzenlenenUrun, fiyat: e.target.value})} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm" />
                </div>
                
                {/* 🎯 DÜZENLEME EKRANINDA DA SEÇMELİ KATEGORİ SİSTEMİ */}
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Vitrin Kategorisi</label>
                  <select value={duzenlenenUrun.kategori || 'Hamur İşi'} onChange={(e) => setDuzenlenenUrun({...duzenlenenUrun, kategori: e.target.value})} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm cursor-pointer">
                    {sabitKategoriler.map((kat) => (
                      <option key={kat} value={kat} className="bg-[#161512] text-stone-300">
                        {kat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stok Durumu</label>
                <select value={duzenlenenUrun.stok_var_mi ? "var" : "yok"} onChange={(e) => setDuzenlenenUrun({...duzenlenenUrun, stok_var_mi: e.target.value === "var"})} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-200 outline-none transition-all font-bold text-sm cursor-pointer">
                  <option value="var" className="bg-[#161512] text-emerald-400">Stokta Var (Aktif)</option>
                  <option value="yok" className="bg-[#161512] text-rose-400">Stokta Yok (Tükendi)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ürün Görseli Değiştir</label>
                <div className="mt-2 flex items-center gap-4 bg-[#1C1B17] p-4 rounded-xl border border-dashed border-stone-800">
                  {duzenlenenUrun.gorsel_url && (
                    <img src={duzenlenenUrun.gorsel_url} alt="Önizleme" className="w-20 h-20 object-cover rounded-xl border border-stone-800 filter brightness-90" />
                  )}
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={resimYukle} disabled={yukleniyorResim} className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer" />
                    {yukleniyorResim && <p className="text-[11px] text-amber-500 font-medium mt-2 animate-pulse">Görsel sanal fırına sürülüyor...</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Şefin Açıklaması / Hikayesi</label>
                <textarea value={duzenlenenUrun.aciklama || ''} onChange={(e) => setDuzenlenenUrun({...duzenlenenUrun, aciklama: e.target.value})} className="w-full mt-2 bg-[#1C1B17] border border-stone-800 focus:border-amber-500/50 p-3.5 rounded-xl text-stone-300 outline-none transition-all font-light text-sm italic leading-relaxed" rows="3" placeholder="Çıtır kabuklu, ekşi mayalı özel üretim..." />
              </div>

              <div className="flex gap-4 pt-4 border-t border-stone-900">
                <button type="button" onClick={() => setDuzenlenenUrun(null)} className="flex-1 py-3.5 font-bold text-stone-400 hover:text-stone-200 transition-colors text-xs uppercase tracking-wider">Değişiklikleri İptal Et</button>
                <button type="submit" disabled={yukleniyorResim} className="flex-1 bg-amber-500 text-neutral-950 py-3.5 rounded-xl font-bold hover:bg-amber-400 shadow-md text-xs uppercase tracking-wider disabled:bg-stone-700 disabled:text-stone-500">Değişiklikleri Yayınla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}