import React, { useEffect, useState } from 'react';
import apiClient from './api/client';
import VocabularyPage from './features/vocabulary/VocabularyPage';
import './App.css'; // Chiroyli ko'rinish berish uchun CSS

export default function App() {
  const [telegramId, setTelegramId] = useState(1234567); // Test uchun standart ID (agar brauzerda ochilsa)
  const [userName, setUserName] = useState('Foydalanuvchi');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Telegram WebApp ochiq bo'lsa ma'lumotlarni aniqlaymjs
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Ekran loyihani to'liq yopsin

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramId(user.id);
        setUserName(user.first_name);
      }
    }
  }, []);

  // Bugungi darslik so'zlarni backenddan yuklash funksiyasi
  const fetchDailyWords = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/words/daily?telegram_id=${telegramId}`);
      setWords(response.data);
    } catch (error) {
      console.error("So'zlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyWords();
  }, [telegramId]);

  if (loading) {
    return <div className="center-box">Yuklanmoqda... ⏳</div>;
  }

  if (isFinished) {
    return (
      <div className="center-box finish-screen">
        <h2>Ajoyib, {userName}! 🎉</h2>
        <p>Bugungi 10 ta so'z bo'yicha mashg'ulotni muvaffaqiyatli yakunladingiz.</p>
        <p className="srs-note">SM-2 algoritmi dars natijalarini saqladi. Keyingi dars ertaga yangilanadi!</p>
        <button className="btn btn-blue" onClick={() => { setIsFinished(false); fetchDailyWords(); }}>
          Qaytadan boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <h3>PEA Vocabulary</h3>
        <span>Salom, {userName}! 👋</span>
      </header>
      
      <main className="app-main-content">
        <VocabularyPage 
          words={words} 
          telegramId={telegramId} 
          onFinish={() => setIsFinished(true)} 
        />
      </main>
    </div>
  );
}