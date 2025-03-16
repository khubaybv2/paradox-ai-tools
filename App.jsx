import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./styles.css";

export default function ParadoxAITools() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");
  const [loading, setLoading] = useState({
    summary: false,
    sentiment: false,
    translation: false
  });

  const handleApiCall = async (apiCall, type) => {
    if (!inputText) return;
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      await apiCall();
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const summarizeText = async () => {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: inputText },
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}` } }
    );
    setSummary(response.data[0]?.summary_text || "Error generating summary");
  };

  const analyzeSentiment = async () => {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
      { inputs: inputText },
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}` } }
    );
    setSentiment(response.data[0]?.label || "Error analyzing sentiment");
  };

  const translateText = async () => {
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`
    );
    setTranslatedText(response.data.responseData?.translatedText || "Translation error");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <header>
        <h1>Paradox AI Tools</h1>
        <p>Advanced AI-Powered Text Processing Solutions</p>
      </header>

      <div className="grid">
        {/* Text Summarization */}
        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
        >
          <h2>📝 Text Summarization</h2>
          <textarea 
            placeholder="Enter text to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            onClick={() => handleApiCall(summarizeText, 'summary')}
            disabled={loading.summary}
          >
            {loading.summary ? <div className="loading" /> : "Summarize"}
          </button>
          <div className="result">{summary}</div>
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
        >
          <h2>🧠 Sentiment Analysis</h2>
          <button 
            onClick={() => handleApiCall(analyzeSentiment, 'sentiment')}
            disabled={loading.sentiment}
          >
            {loading.sentiment ? <div className="loading" /> : "Analyze Sentiment"}
          </button>
          <div className="result">{sentiment}</div>
        </motion.div>

        {/* Language Translator */}
        <motion.div 
          className="card"
          whileHover={{ scale: 1.02 }}
        >
          <h2>🌍 Language Translator</h2>
          <div className="select-group">
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
              <option value="auto">Detect Language</option>
              <option value="en">English</option>
              <option value="bn">Bengali</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
            <span>→</span>
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
              <option value="en">English</option>
              <option value="bn">Bengali</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <button 
            onClick={() => handleApiCall(translateText, 'translation')}
            disabled={loading.translation}
          >
            {loading.translation ? <div className="loading" /> : "Translate"}
          </button>
          <div className="result">{translatedText}</div>
        </motion.div>
      </div>

      <footer>
        Powered by <a href="https://www.khubaybhossain.com">Khubayb Hossain</a>
      </footer>
    </motion.div>
  );
}
