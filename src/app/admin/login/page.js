"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // İki kat yukarı çıkıp lib'e ulaşıyoruz
import '../../globals.css'; // Eğer login sayfasında tasarım bozuksa bunu ekle

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hata, setHata] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const router = useRouter();

  const girisYap = async (e) => {
    e.preventDefault();
    setYukleniyor(true);
    setHata(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Giriş başarılıysa admin ana sayfasına yönlendir
      router.push('/admin');
    } catch (error) {
      setHata("Giriş başarısız: Bilgilerinizi kontrol edin.");
      console.error("Giriş hatası:", error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-amber-100">
        <h2 className="text-2-xl font-bold text-center text-orange-700 mb-6">
          Küncü Admin Girişi
        </h2>

        <form onSubmit={girisYap} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {hata && (
            <p className="text-red-500 text-sm font-medium text-center">{hata}</p>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
          >
            {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}