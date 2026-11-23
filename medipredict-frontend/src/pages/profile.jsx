import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile({ isAuth }) {
  const [report, setReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Valued User");

  useEffect(() => {
    const saved = localStorage.getItem("lastDiagnosis");
    if (saved) {
      try {
        setReport(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse diagnosis data", e);
      }
    }
  }, []);

  const saveName = () => {
    localStorage.setItem("userName", userName);
    setIsEditing(false);
  };

  const clearHistory = () => {
    if (window.confirm("Permanently delete your clinical assessment history?")) {
      localStorage.removeItem("lastDiagnosis");
      setReport(null);
    }
  };
  const getFactorDetails = () => {
    if (!report || !report.explanation || typeof report.explanation !== 'object') {
      return { overall: "N/A", actionable: "N/A" };
    }

    const entries = Object.entries(report.explanation);
    const nonModifiable = ["Age", "Pregnancies"];
    const sorted = entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

    const overall = sorted[0]?.[0];

    const actionable = sorted.find(
      ([key]) => !nonModifiable.includes(key)
    )?.[0] || "N/A";

    return { overall, actionable };
  };

  const downloadReport = () => {
    if (!report) return;

    const factors = getFactorDetails();

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>Health Report - ${userName}</title></head>
        <body style="font-family: sans-serif; padding: 40px; color: #333;">
          <div style="max-width: 650px; margin: auto; border: 2px solid #10b981; padding: 30px; border-radius: 12px;">
            <h1 style="color: #10b981; margin-bottom: 5px;">MEDI-PREDICT REPORT</h1>
            <p style="color: #666; font-size: 12px; margin-top: 0;">Verified Clinical Assessment</p>
            <hr />
            <p><strong>Patient:</strong> ${userName}</p>
            <p><strong>Result:</strong> 
              <span style="font-weight:bold; color:${report.prediction === 'Diabetic' ? '#ef4444' : '#10b981'}">
                ${report.prediction}
              </span>
            </p>
            <p><strong>Confidence:</strong> ${report.confidence}%</p>

            <h3>Captured Biometrics:</h3>
            <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; list-style: none; padding: 0;">
              ${Object.entries(report.inputs || {}).map(([k, v]) => `
                <li style="background: #f4f4f5; padding: 8px; border-radius: 4px;">
                  <strong>${k}:</strong> ${v}
                </li>
              `).join('')}
            </ul>

            <div style="margin-top: 25px; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981;">
              <strong>Overall Risk Factor:</strong> ${factors.overall}<br/>
              <strong>Actionable Risk Factor:</strong> ${factors.actionable}
            </div>

            <p style="font-size: 10px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
              Generated on ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (!isAuth) {
    return (
      <div className="pt-40 text-center text-gray-500 font-mono tracking-widest uppercase">
        Unauthorized: Please Log In
      </div>
    );
  }

  const factors = getFactorDetails();

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-zinc-950 p-10 rounded-2xl border border-white/10 shadow-xl relative"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-white/5 pb-10">
          <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-5xl">👤</div>
          
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="flex gap-3 justify-center md:justify-start">
                <input 
                  autoFocus
                  className="bg-black border border-emerald-500/50 p-2 rounded-lg text-white outline-none"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button onClick={saveName} className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold">
                  SAVE
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <h2 className="text-3xl font-bold text-white">{userName}</h2>
                <button onClick={() => setIsEditing(true)} className="text-xs text-emerald-500 underline uppercase">
                  Edit
                </button>
              </div>
            )}
            <p className="text-gray-500 text-xs uppercase mt-1">Clinical Profile Active</p>
          </div>

          {report && (
            <button onClick={clearHistory} className="text-xs text-red-500/40 hover:text-red-500">
              [ Wipe History ]
            </button>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-lg font-semibold text-white/80">Health Analytics</h3>

          {report ? (
            <>
              <div className="p-8 bg-zinc-900/50 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-xs text-gray-500 uppercase">AI Diagnostic Verdict</span>
                  <h4 className={`text-5xl font-black mt-2 ${
                    report.prediction === 'Diabetic' ? 'text-red-500' : 'text-emerald-400'
                  }`}>
                    {report.prediction}
                  </h4>

                  <p className="text-gray-500 text-xs mt-3 bg-white/5 px-3 py-1 rounded">
                    Overall Risk: <span className="text-white font-bold">{factors.overall}</span>
                  </p>

                  <p className="text-gray-500 text-xs mt-2 bg-emerald-500/10 px-3 py-1 rounded">
                    Actionable Risk: <span className="text-emerald-400 font-bold">{factors.actionable}</span>
                  </p>
                </div>

                <button 
                  onClick={downloadReport} 
                  className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-emerald-500 hover:text-white"
                >
                  DOWNLOAD PDF 📄
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(report.inputs || {}).map(([key, value]) => (
                  <div key={key} className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase">{key}</p>
                    <p className="text-xl font-bold text-emerald-500">{value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">No diagnostic data found.</p>
              <a href="/dashboard" className="text-emerald-500 underline">
                Start New Scan
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}