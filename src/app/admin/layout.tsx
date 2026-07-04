"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, ArrowLeft, Home } from "lucide-react";

const navItems = [
  { href: "/admin", label: "数据看板", icon: LayoutDashboard },
  { href: "/admin/content", label: "内容管理", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* ============ 左侧边栏 ============ */}
      <aside
        className="w-60 shrink-0 flex flex-col h-full"
        style={{
          background: "linear-gradient(180deg, #FFF8F0 0%, #F0F4FF 50%, #FFF0F5 100%)",
          borderRight: "2px solid rgba(255, 180, 140, 0.2)",
          boxShadow: "2px 0 24px rgba(180, 160, 200, 0.12)",
        }}
      >
        {/* Logo 区域 */}
        <div className="px-5 pt-6 pb-4 border-b border-[#F0E8F8]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #FF7B5C 0%, #FFB09C 100%)",
                boxShadow: "0 3px 12px rgba(255, 123, 92, 0.25)",
              }}
            >
              <span className="text-lg">📚</span>
            </div>
            <span
              className="text-[13px] font-bold tracking-[0.06em] text-[#3D3D4E] group-hover:text-[#FF7B5C] transition-colors"
              style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
            >
              GLUT AING
            </span>
          </Link>
          <p className="text-[10px] tracking-[0.1em] text-[#B0A0C0] font-medium mt-2 px-1">
            🛠️ 后台管理
          </p>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold tracking-[0.05em] transition-colors duration-200`}
                  style={{
                    color: active ? "#FF7B5C" : "#6B6B7B",
                    background: active
                      ? "linear-gradient(135deg, #FFF0EB 0%, #FFE8E0 100%)"
                      : "transparent",
                    fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif",
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <item.icon className={`w-4 h-4 ${active ? "text-[#FF7B5C]" : "text-[#B0A0C0]"}`} strokeWidth={2.5} />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="admin-nav-indicator"
                      className="w-1.5 h-1.5 rounded-full bg-[#FF7B5C] ml-auto"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* 底部返回按钮 */}
        <div className="px-4 py-4 border-t border-[#F0E8F8] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#8B8B9B] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all duration-200"
          >
            <Home className="w-3.5 h-3.5" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* ============ 右侧内容区 ============ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 顶栏 */}
        <header
          className="h-14 shrink-0 flex items-center justify-between px-6"
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(16px)",
            borderBottom: "2px solid rgba(255, 180, 140, 0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🌟</span>
            <span
              className="text-[14px] font-bold text-[#3D3D4E] tracking-[0.06em]"
              style={{ fontFamily: "var(--font-cartoon), 'YouYuan', sans-serif" }}
            >
              管理后台
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#8B8B9B] hover:text-[#FF7B5C] hover:bg-[#FFF0EB] transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            回到主页
          </Link>
        </header>

        {/* 内容滚动区 */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: "linear-gradient(180deg, #FFFDF9 0%, #FFF8F0 100%)" }}
        >
          <motion.div
            className="p-6 md:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={pathname}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
