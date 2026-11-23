import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";

export default function XAIReport({ isAuth }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("xaiData");
    if (raw) {
      const parsed = JSON.parse(raw);
      const chartArr = Object.entries(parsed.explanation).map(([name, value]) => ({
        name, 
        value, 
        color: value > 0 ? "#ff7b72" : "#3fb950" 
      }));
      setData({ ...parsed, chartArr });
    }
  }, []);

  if (!data) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-extrabold text-emerald-500 mb-8 tracking-tight uppercase">
            Project Motive & Perspective
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">The "Black Box" Barrier</h3>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                Standard AI models provide results without reasoning. In medicine, this is dangerous. 
                Our perspective is that transparency is as important as accuracy.
              </p>
              <h3 className="text-2xl font-bold text-white">Clinical Trust via XAI</h3>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                We utilize <span className="text-white font-semibold">SHAP (SHapley Additive exPlanations)</span> 
                to show doctors the "why." Every biomarker is weighed, allowing clinicians to 
                audit the machine's logic before making a final patient decision.
              </p>
            </div>
            <div className="gh-card p-8 bg-emerald-500/5 border-dashed border-emerald-900/40">
              <h4 className="text-emerald-500 font-mono text-sm mb-4">GOAL v1.0</h4>
              <ul className="text-gray-300 text-sm space-y-4 font-light">
                <li className="flex items-start gap-2"><span>✔</span> Reduce diagnostic uncertainty.</li>
                <li className="flex items-start gap-2"><span>✔</span> Visualize biometric feature weights.</li>
                <li className="flex items-start gap-2"><span>✔</span> Align AI outputs with clinical reality.</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
             <a href="/dashboard" className="btn-emerald">Back to Dashboard</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Feature Contribution Report</h2>
            <p className="text-gray-500 font-mono text-xs mt-2">RESULT: {data.prediction} | CONFIDENCE: {data.confidence}%</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("xaiData"); window.location.reload(); }}
            className="text-xs text-gray-500 hover:text-white underline font-mono"
          >
            RESET ANALYTICS
          </button>
        </div>

        <div className="gh-card p-10 h-[550px] shadow-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartArr} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#8b949e" 
                tick={{fontSize: 12, fontWeight: 600}} 
                width={120} 
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px'}}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={35}>
                {data.chartArr.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-6 text-center text-gray-500 text-xs font-mono">
          Note: Positive values (Red) indicate features that increased the risk of {data.prediction}.
        </p>
      </motion.div>
    </div>
  );
}