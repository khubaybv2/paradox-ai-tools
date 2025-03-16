import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ParadoxAITools() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");

  const summarizeText = async () => {
    if (!text) return;
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        { inputs: text },
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}` } }
      );
      setSummary(response.data[0].summary_text);
    } catch {
      setSummary("Error fetching summary.");
    }
  };

  const analyzeSentiment = async () => {
    if (!text) return;
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
        { inputs: text },
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}` } }
      );
      setSentiment(response.data[0].label);
    } catch {
      setSentiment("Error analyzing sentiment.");
    }
  };

  const translateText = async () => {
    if (!text) return;
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`
      );
      setTranslatedText(response.data.responseData.translatedText);
    } catch {
      setTranslatedText("Error translating text.");
    }
  };

  return (
    <motion.div className="container">
      <h1>Paradox AI Tools</h1>

      {/* Text Summarization */}
      <div className="card">
        <h2>Text Summarization</h2>
        <textarea placeholder="Enter text..." value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={summarizeText}>Summarize</button>
        <p>{summary}</p>
      </div>

      {/* Sentiment Analysis */}
      <div className="card">
        <h2>Sentiment Analysis</h2>
        <button onClick={analyzeSentiment}>Analyze Sentiment</button>
        <p>{sentiment}</p>
      </div>

      {/* Language Translator */}
      <div className="card">
        <h2>Language Translator</h2>
        <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
          <option value="auto">Detect Language</option>
          <option value="en">English</option>
          <option value="bn">Bengali</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <!-- Add more languages -->
        </select>
        <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
          <option value="en">English</option>
          <option value="bn">Bengali</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
        <button onClick={translateText}>Translate</button>
        <p>{translatedText}</p>
      </div>

      <footer>
        Powered by <a href="https://www.khubaybhossain.com">Khubayb Hossain</a>
      </footer>
    </motion.div>
  );
}
