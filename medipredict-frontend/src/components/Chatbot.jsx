import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, Dr. I am the MediPredict Assistant. How can I clarify today's diagnosis?", isBot: true }
  ]);
  const [input, setInput] = useState("");

const handleSend = () => {
  if (!input.trim()) return;

  const userMsg = input.toLowerCase();
  setMessages(prev => [...prev, { text: input, isBot: false }]);
  setInput("");

  const medicalKnowledge = {
    glucose: "High glucose (over 140 mg/dL) is a primary indicator of diabetes risk in our model.",
    shap: "SHAP values show how much each biometric (like BMI) changed the final prediction.",
    bmi: "A BMI over 30 is categorized as obese and significantly increases the risk score.",
    age: "Our data shows that risk factors generally increase after the age of 45."
  };

  setTimeout(() => {
    const keyword = Object.keys(medicalKnowledge).find(key => userMsg.includes(key));
    
    const response = keyword 
      ? medicalKnowledge[keyword] 
      : "I am trained on Glucose, BMI, Age, and SHAP. Please ask about those specific metrics.";

    setMessages(prev => [...prev, { text: response, isBot: true }]);
  }, 600);
};

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-panel w-80 h-96 flex flex-col mb-4 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between">
              <span className="font-bold text-green-500 text-xs tracking-widest uppercase">Clinical AI Assistant</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-500">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 max-w-[80%] ${m.isBot ? 'chat-msg-bot self-start text-gray-300' : 'chat-msg-user self-end text-white ml-auto'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-black/40 border-t border-gray-800 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="bg-transparent flex-1 text-xs outline-none text-white" 
                placeholder="Ask about SHAP weights..." 
              />
              <button onClick={handleSend} className="text-green-500">➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/40 hover:scale-110 transition-transform"
      >
        <span className="text-2xl text-white">🤖</span>
      </button>
    </div>
  );
}