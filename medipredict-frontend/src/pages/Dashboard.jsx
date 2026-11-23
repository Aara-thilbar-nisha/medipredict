import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";


export default function Dashboard({ isAuth }) {
  const [formData, setFormData] = useState({
    pregnancies: "", glucose: "", diastolic: "", triceps: "", 
    insulin: "", bmi: "", dpf: "", age: ""
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ranges = {
    pregnancies: [0, 8],
    glucose: [50, 200],
    diastolic: [0, 120],
    triceps: [0, 60],
    insulin: [0, 300],
    bmi: [15, 50],
    dpf: [0.0, 2.5],
    age: [10, 90]
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastDiagnosis");
    if (saved && isAuth) {
      setResult(JSON.parse(saved));
    }
  }, [isAuth]);

const handleAutoFill = () => {
  const sampleData = {
    pregnancies: "2",
    glucose: "130",
    diastolic: "85",
    triceps: "28",
    insulin: "110",
    bmi: "31.2",
    dpf: "0.6",
    age: "40"
  };

  setFormData((prev) => {
    const updated = { ...prev };

    Object.keys(sampleData).forEach((key) => {
      if (!updated[key]) {
        updated[key] = sampleData[key];
      }
    });

    return updated;
  });

  setErrors({});
};

  const validate = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = parseFloat(formData[key]);
      const [min, max] = ranges[key];

      if (formData[key] === "") {
        newErrors[key] = "Required";
      } else if (isNaN(value)) {
        newErrors[key] = "Invalid number";
      } else if (value < min || value > max) {
        newErrors[key] = `Range ${min}-${max}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData);

      const fullData = {
        ...res.data,
        inputs: formData
      };

      setResult(fullData);

      localStorage.setItem("xaiData", JSON.stringify(fullData));
      localStorage.setItem("lastDiagnosis", JSON.stringify(fullData));

    } catch (err) {
      alert("System Error: Neural Engine Offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewDiagnosis = () => {
    setResult(null);

    localStorage.removeItem("lastDiagnosis");
    localStorage.removeItem("xaiData");

    setFormData({
      pregnancies: "",
      glucose: "",
      diastolic: "",
      triceps: "",
      insulin: "",
      bmi: "",
      dpf: "",
      age: ""
    });

    setErrors({});
  };

  if (!isAuth) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Unauthorized Access
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

      <AnimatePresence mode="wait">
        {!result ? (

          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="gh-card p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Patient Intake Form
            </h2>

            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-4 py-2 text-sm border border-gray-700 text-white rounded hover:bg-white/5"
              >
                Auto Fill Sample Data
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 uppercase mb-2">
                    {key}
                  </label>

                  <input 
                    type="number"
                    step="any"
                    value={formData[key]}
                    className="gh-input w-full"
                    onChange={(e) => {
                      setFormData({ ...formData, [key]: e.target.value });
                      setErrors({ ...errors, [key]: "" });
                    }}
                  />

                  {errors[key] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[key]}
                    </p>
                  )}

                  <p className="text-gray-500 text-xs mt-1">
                    Range: {ranges[key][0]} - {ranges[key][1]}
                  </p>
                </div>
              ))}

              <button className="md:col-span-2 btn-emerald py-4 mt-4 font-bold">
                {loading ? "PROCESSING..." : "RUN AI DIAGNOSIS"}
              </button>
            </form>
          </motion.div>

        ) : (

          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gh-card p-12 text-center"
          >
            <h3 className="text-emerald-500 mb-4">
              Neural Scan Complete
            </h3>

            <div className={`text-7xl font-black mb-4 ${
              result.prediction === 'Diabetic'
                ? 'text-red-500'
                : 'text-emerald-500'
            }`}>
              {result.prediction}
            </div>

            <p className="text-gray-400 text-xl mb-10">
              AI Confidence: {result.confidence}%
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4">

              <button 
                onClick={handleNewDiagnosis}
                className="px-8 py-3 border border-gray-700 rounded text-white"
              >
                New Diagnosis
              </button>

              <a href="/xai" className="btn-emerald px-8 flex items-center justify-center">
                View XAI Evidence →
              </a>

            </div>
          </motion.div>

        )}
      </AnimatePresence>

    </div>
  );
}

const handleWipeHistory = async () => {
  if (!auth.currentUser) return;

  const confirmWipe = window.confirm("PERMANENT DATA PURGE: Are you sure? This cannot be undone.");
  
  if (confirmWipe) {
    try {
      const q = query(
        collection(db, "diagnoses"), 
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((document) => 
        deleteDoc(doc(db, "diagnoses", document.id))
      );

      await Promise.all(deletePromises);

      localStorage.removeItem("lastDiagnosis");
      localStorage.removeItem("xaiData");

      alert("Cloud Database Synchronized: History Wiped.");
    } catch (error) {
      console.error("Wipe Failed:", error);
      alert("System Error: Could not reach the Cloud Server.");
    }
  }
};