import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import Home from "@/screens/Home";
import InningsDetail from "@/screens/InningsDetail";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

export default function App() {
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"A website for kohli"}
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/home" className={navLinkClass}>
            {"Kohli \u2014 Home"}
          </NavLink>
          <NavLink to="/innings-detail" className={navLinkClass}>
            {"Innings Write-Up"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/innings-detail" element={<InningsDetail />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}
