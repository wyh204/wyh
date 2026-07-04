"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ParticleStars from "@/components/home/ParticleStars";
import SubjectCard from "@/components/shared/SubjectCard";
import WeeklyRecommend from "@/components/home/WeeklyRecommend";
import PlatformFeatures from "@/components/home/PlatformFeatures";
import UserReviews from "@/components/home/UserReviews";
import type { Subject } from "@/types";

const subjects: Subject[] = ["yuwen", "math", "english", "physics", "chemistry"];

const heroChars = [
  { char: "探", color: "#FF7B5C" }, { char: "索", color: "#FF7B5C" },
  { char: " · ", color: "transparent" }, { char: "知", color: "#5BA4E6" }, { char: "识", color: "#5BA4E6" },
  { char: " · ", color: "transparent" }, { char: "宇", color: "#6DBE6D" }, { char: "宙", color: "#6DBE6D" },
];

function HeroTitle() {
  return (
    <div className="mb-8">
      <motion.div className="flex items-center justify-center md:justify-start gap-2 mb-4" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <span className="text-2xl md:text-3xl animate-twinkle" style={{ animationDelay:"0s" }}>⭐</span>
        <span className="text-xl md:text-2xl animate-twinkle" style={{ animationDelay:"0.3s" }}>🌟</span>
        <span className="text-2xl md:text-3xl animate-twinkle" style={{ animationDelay:"0.6s" }}>⭐</span>
      </motion.div>
      <motion.div className="flex flex-wrap items-baseline gap-x-1.5 justify-center md:justify-start" initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.04, delayChildren:0.2 } } }}>
        {heroChars.map((item,i) => (
          <motion.span key={i} variants={{ hidden:{ opacity:0, y:28, filter:"blur(6px)" }, visible:{ opacity:1, y:0, filter:"blur(0px)" } }}
            transition={{ duration:0.55, ease:"easeOut" }}
            className="text-[56px] md:text-[76px] font-[900] tracking-[0.04em] leading-[1.1]"
            style={{ fontFamily:item.color!=="transparent"?"var(--font-cartoon),'YouYuan',sans-serif":undefined,
              color:item.color!=="transparent"?item.color:"transparent",
              textShadow:item.color!=="transparent"?`3px 3px 0px rgba(0,0,0,0.06), 0 0 20px ${item.color}30`:"none",
              borderBottom:item.color!=="transparent"?"5px solid":"none", borderColor:item.color!=="transparent"?item.color:undefined,
              paddingBottom:item.color!=="transparent"?"2px":"0" }}>{item.char}</motion.span>
        ))}
      </motion.div>
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.85 }}
        className="flex items-center gap-3 mt-4 justify-center md:justify-start">
        <span className="text-xl">📚</span>
        <span className="text-[16px] md:text-[20px] font-bold text-[#6B6B7B]" style={{ fontFamily:"var(--font-cartoon),'YouYuan',sans-serif" }}>快乐学习</span>
        <span className="h-4 w-0.5 bg-[#DDD0E8] rounded-full" />
        <span className="text-[14px] md:text-[15px] font-medium text-[#8B8B9B]">AI · 互动探索</span>
        <span className="text-xl">✏️</span>
      </motion.div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}>
      <span className="text-[11px] text-[#B0A0C0] font-bold" style={{ fontFamily:"var(--font-cartoon),'YouYuan',sans-serif" }}>往下看 👀</span>
      <motion.div animate={{ y:[0,10,0], opacity:[0.6,1,0.6] }} transition={{ duration:1.8, repeat:Infinity }}>
        <ChevronDown className="w-5 h-5 text-[#FF7B5C]" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  );
}

function CartoonDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] -top-32 left-[15%]" style={{ background:"radial-gradient(circle, rgba(255,180,140,0.35), transparent 70%)" }} />
      <div className="glow-orb w-[400px] h-[400px] top-32 right-[10%]" style={{ background:"radial-gradient(circle, rgba(150,190,240,0.3), transparent 70%)" }} />
      <div className="glow-orb w-[350px] h-[350px] top-[60%] left-[5%]" style={{ background:"radial-gradient(circle, rgba(200,170,230,0.25), transparent 70%)" }} />
      <div className="cartoon-cloud" style={{ width:120,height:60,top:"8%",left:"5%",animation:"cloud-float 12s ease-in-out infinite alternate"}} />
      <div className="cartoon-cloud" style={{ width:90,height:45,top:"22%",right:"8%",animation:"cloud-float 10s ease-in-out infinite alternate-reverse"}} />
      <span className="absolute text-2xl animate-twinkle" style={{ top:"15%",left:"25%" }}>⭐</span>
      <span className="absolute text-xl animate-twinkle" style={{ top:"35%",right:"20%",animationDelay:"0.8s" }}>✨</span>
      <span className="absolute text-lg animate-twinkle" style={{ top:"50%",left:"12%",animationDelay:"1.4s" }}>🌟</span>
      <motion.div className="absolute text-3xl" style={{ top:"18%",right:"15%" }} animate={{ y:[0,-15,0], rotate:[-3,3,-3] }} transition={{ duration:4, repeat:Infinity }}>🚀</motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <ParticleStars />
      <section id="hero-area" className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <CartoonDecorations />
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <HeroTitle />
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.0 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <p className="text-[15px] md:text-[17px] text-[#6B6B7B] tracking-[0.03em] leading-relaxed max-w-[500px] font-medium">
              🌈 AI 驱动的互动学习体验，覆盖语文、数学、英语、物理、化学五大学科。
              让每一位初中生<strong className="text-[#FF7B5C] font-bold">感受知识的魅力</strong>，快乐成长！
            </p>
            <motion.a href="#subjects-section" whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
              className="btn-cartoon self-start sm:self-end shrink-0 group"
              style={{ background:"linear-gradient(135deg, #FF7B5C 0%, #FFB09C 50%, #FF9A85 100%)", color:"#FFFFFF",
                boxShadow:"0 6px 24px rgba(255,123,92,0.35)", fontSize:"18px", padding:"16px 40px" }}>
              🚀 开始探索 <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" strokeWidth={2.5} />
            </motion.a>
          </motion.div>
        </div>
        <ScrollIndicator />
      </section>

      <section id="subjects-section" className="relative pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div className="flex items-center gap-4 mb-10" initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
            <span className="text-[16px] md:text-[18px] font-bold text-[#6B6B7B] shrink-0 px-3 py-1" style={{ fontFamily:"var(--font-cartoon),'YouYuan',sans-serif" }}>🎯 选择学科</span>
            <span className="text-[10px] tracking-[0.12em] text-[#B0A0C0] font-medium shrink-0">CHOOSE SUBJECT</span>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#DDD0E8] to-transparent rounded-full" />
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }}
            variants={{ visible:{ transition:{ staggerChildren:0.07 } } }}>
            {subjects.map((s) => (
              <motion.div key={s} variants={{ hidden:{ opacity:0, y:24, scale:0.97 }, visible:{ opacity:1, y:0, scale:1 } }} transition={{ duration:0.45 }}>
                <SubjectCard subject={s} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8"><WeeklyRecommend /></div>
        </div>
      </section>

      <PlatformFeatures />
      <UserReviews />
    </div>
  );
}
