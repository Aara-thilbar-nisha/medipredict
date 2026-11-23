import { motion, useScroll, useTransform } from "framer-motion";
import Chatbot from "../components/Chatbot";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.5, 1.2]);
  const opacityIcon = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <div className="relative bg-[#0d1117] text-white overflow-x-hidden">
      <Chatbot />

      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-8xl font-black tracking-tight mb-6"
        >
          The future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            diagnostics happens together.
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 max-w-3xl mb-12"
        >
          Clinical-grade intelligence tools that evolve with medical research.
          MediPredict brings doctors and explainable AI together on one platform.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
           <a href="/signin" className="btn-emerald px-12 py-5 text-xl">Get Started</a>
        </motion.div>
        <div className="mt-20 animate-bounce text-gray-600 font-mono text-sm tracking-widest">
            SCROLL TO INITIALIZE NEURAL SCAN
        </div>
      </section>

      <section className="py-24 flex flex-col items-center bg-[#010409] border-y border-gray-800">
        <motion.div style={{ scale, opacity: opacityIcon }} className="ai-glow-icon mb-12">
          <div className="w-40 h-40 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-full flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(35,134,54,0.4)]">
            🧬
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="max-w-4xl text-center px-6"
        >
          <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">Advanced Feature Attribution</h2>
          <p className="text-gray-400 text-xl leading-relaxed">
            Our engine utilizes a <span className="text-emerald-400 font-bold">Random Forest Ensemble</span> coupled with <span className="text-emerald-400 font-bold">TreeExplainer</span> logic. 
            This ensures that every "Diabetic" or "Non-Diabetic" classification is backed by 
            mathematical proof, visible in our live XAI Reports.
          </p>
        </motion.div>
      </section>

<section className="py-40 px-10">
  <motion.div 
    initial={{ opacity: 0, x: -50 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20"
  >
    <div className="flex-1">
      <h2 className="text-4xl font-bold mb-6 text-white">Explainable AI (XAI)</h2>
      <p className="text-gray-400 text-lg leading-relaxed">
        We bridge the gap between "Black Box" algorithms and clinical trust. 
        Our platform uses SHAP values to visualize exactly which biometrics 
        contributed to a patient's risk score, allowing for audited decisions.
      </p>
    </div>

    <div className="flex-1 gh-card h-80 relative overflow-hidden flex items-center justify-center border border-gray-700 bg-[#161b22] group">
      <img 
        src="/image.webp" 
        alt="SHAP Data Visualization"
        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80"></div>
    </div>
  </motion.div>
</section>

<section className="py-40 px-10 bg-black/40">
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-20"
  >
    <div className="flex-1">
      <h2 className="text-4xl font-bold mb-6 text-emerald-400">Our Perspective</h2>
      <p className="text-gray-400 text-lg leading-relaxed">
        To empower healthcare providers with real-time decision support. 
        Our motive is to reduce diagnostic latency while maintaining 
        absolute transparency in algorithmic decision making.
      </p>
    </div>

    <div className="flex-1 gh-card h-80 relative overflow-hidden flex items-center justify-center border border-gray-700 bg-[#161b22] group">
      <img 
        src="/images2.jpg" 
        alt="Global Neural Network"
        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-transparent to-transparent opacity-80"></div>
    </div>
  </motion.div>
</section>

      <section className="h-screen flex items-center justify-center px-6">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="gh-card p-20 text-center max-w-4xl bg-gradient-to-b from-[#161b22] to-transparent border border-gray-800"
        >
          <h2 className="text-6xl font-black mb-6">READY TO DIAGNOSE?</h2>
          <p className="mb-10 text-gray-500 text-lg">
            Join the global network of clinicians using explainable neural intelligence 
            to redefine patient outcomes.
          </p>
          <a href="/signin" className="btn-emerald px-16 py-6 text-2xl shadow-xl shadow-emerald-900/20">
            Access Portal Now
          </a>
        </motion.div>
      </section>
    </div>
  );
}