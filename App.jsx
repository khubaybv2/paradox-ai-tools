import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./styles.css";

export default function ParadoxAITools() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState({
    summary: "",
    sentiment: "",
    translation: ""
  });
  const [loading, setLoading] = useState({
    summary: false,
    sentiment: false,
    translation: false
  });

  const handleApiCall = async (apiCall, type) => {
    if (!inputText.trim()) {
      setResults(prev => ({ ...prev, [type]: "Please enter some text" }));
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      const result = await apiCall();
      setResults(prev => ({ ...prev, [type]: result }));
    } catch (error) {
      console.error("API Error:", error);
      setResults(prev => ({ ...prev, [type]: error.message || "Service unavailable. Please try again later." }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const summarizeText = async () => {
    const response = await axios.post(
      '/.netlify/functions/hf-proxy',
      {
        model: "facebook/bart-large-cnn",
        inputs: inputText
      }
    );
    return response.data[0]?.summary_text || "No summary generated";
  };

  const analyzeSentiment = async () => {
    const response = await axios.post(
      '/.netlify/functions/hf-proxy',
      {
        model: "cardiffnlp/twitter-roberta-base-sentiment",
        inputs: inputText
      }
    );
    return response.data[0]?.label || "Sentiment analysis failed";
  };

  const translateText = async () => {
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`
    );
    return response.data.responseData?.translatedText || "Translation failed";
  };

  // ... rest of your component ...
}
