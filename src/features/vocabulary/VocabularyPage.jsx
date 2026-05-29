import React, { useState } from 'react';
import apiClient from '../../api/client';

export default function VocabularyPage({ words, telegramId, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!words || words.length === 0) {
    return <div className="center-box">Bugun uchun so'zlar tugadi! 🎉</div>;
  }

  const currentWord = words[currentIndex];

  const handleReview = async (isCorrect) => {
    setLoading(true);
    try {
      // Backendga natijani yuborish
      await apiClient.post('/words/review', {
        telegram_id: telegramId,
        word_id: currentWord.id,
        is_correct: isCorrect,
      });

      // Keyingi so'zga o'tish logikasi
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
        setShowTranslation(false);
      } else {
        onFinish(); // Hamma so'z tugaganda eslatma funksiyasi
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      alert("Ma'lumotni saqlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vocab-container">
      {/* Progress hisoblagichi */}
      <div className="progress-text">
        So'z: {currentIndex + 1} / {words.length}
      </div>

      {/* Kartochka */}
      <div 
        className={`word-card ${showTranslation ? 'flipped' : ''}`}
        onClick={() => setShowTranslation(!showTranslation)}
      >
        <div className="card-content">
          <h1 className="word-title">{currentWord.word}</h1>
          <p className="word-context"><i>Context:</i> {currentWord.context}</p>
          
          {showTranslation && (
            <div className="translation-section">
              <hr />
              <h2 className="word-translation">{currentWord.translation}</h2>
            </div>
          )}
          
          {!showTranslation && (
            <p className="hint-text">Tarjimani ko'rish uchun bosing</p>
          )}
        </div>
      </div>

      {/* Amallar tugmalari */}
      <div className="button-group">
        <button 
          className="btn btn-red" 
          disabled={loading} 
          onClick={() => handleReview(false)}
        >
          🔴 Bilmadim
        </button>
        <button 
          className="btn btn-green" 
          disabled={loading} 
          onClick={() => handleReview(true)}
        >
          🟢 Bildim
        </button>
      </div>
    </div>
  );
}