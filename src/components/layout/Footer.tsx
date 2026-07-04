export default function Footer() {
  return (
    <footer className="border-t-2 border-[#F0E8F8]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,248,240,0.8))" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-[14px] font-bold text-[#3D3D4E] mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>📚 GLUT AING 教育平台</h4>
            <p className="text-[12px] text-[#8B8B9B] leading-relaxed">一个专为初中生打造的 AI 互动学习平台，覆盖语文、数学、英语、物理、化学五大学科。通过拍照搜题、互动实验、智能问答等功能，让学习变得有趣又高效！</p>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#3D3D4E] mb-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>🚀 快速开始</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[{ label: "📖 语文", path: "/yuwen" }, { label: "🧮 数学", path: "/math" }, { label: "🌍 英语", path: "/english" }, { label: "⚛️ 物理", path: "/physics" }, { label: "🧪 化学", path: "/chemistry" }].map((item) => (
                <a key={item.label} href={item.path} className="text-[12px] text-[#8B8B9B] hover:text-[#FF7B5C] font-medium transition-colors py-1">{item.label}</a>))}
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#3D3D4E] mb-3" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>💝 我们的心愿</h4>
            <p className="text-[12px] text-[#8B8B9B] leading-relaxed mb-2">让每一位学生都能享受优质的教育资源，在探索中感受知识的魅力 🌌</p>
            <p className="text-[11px] text-[#B0A0C0]">每天进步一点点，未来就会有无限可能 ✨</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 pt-6 border-t border-[#F0E8F8]">
          <div className="flex items-center gap-2"><span className="text-lg">🌟</span><p className="text-[12px] tracking-[0.1em] text-[#8B8B9B] font-bold" style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}>POWERED BY DEEPSEEK AI</p><span className="text-lg">🌟</span></div>
          <p className="text-[11px] tracking-[0.08em] text-[#B0A0C0] font-medium">桂林理工大学 三下乡 · GLUT AING EDUCATION</p>
          <p className="text-[10px] tracking-[0.06em] text-[#CCC0D8]">❤️ 让学习变得更快乐，让知识变得更有趣 ❤️</p>
          <p className="text-[9px] text-[#CCC0D8] mt-1">© 2024 GLUT AING Education. 用心陪伴每一位学生的成长 🌱</p>
        </div>
      </div>
    </footer>
  );
}
