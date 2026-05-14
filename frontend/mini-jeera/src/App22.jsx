import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   CONFIG — update API_BASE to match your FastAPI server
══════════════════════════════════════════════════════════════ */
const API_BASE = "http://localhost:8000";

// Route prefixes (adjust to match how you mount your routers in main.py)
const ROUTES = {
  login:            "/auth/login",
  signup:           "/auth/Signup",
  allWorkspaces:    "/workspace/allworkspace",
  createWorkspace:  "/workspace/create_workspace",
  deleteWorkspace:  (id) => `/workspace/${id}`,
  getMembers:       (wid) => `/workspace/${wid}/members`,
  inviteMember:     (wid) => `/workspace/${wid}/new_member`,
  createProject:    (wid) => `/${wid}/create_project`,
  deleteProject:    (wid, pid) => `/${wid}/${pid}/delete_name`,
  createTask:       (wid, pid, uid) => `/${wid}/${pid}/create_task?user_id=${uid || 0}`,
  allTasks:         (pid) => `/tasks/${pid}`,
  updateTask:       (tid) => `/tasks/${tid}`,
  deleteTask:       (tid) => `/tasks/${tid}`,
};

/* ══════════════════════════════════════════════════════════════
   API HELPER
══════════════════════════════════════════════════════════════ */
const apiFetch = async (path, opts = {}, token = null) => {
  const headers = {};
  if (!(opts.body instanceof URLSearchParams)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { headers, ...opts });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.detail || `Error ${res.status}`);
  return data;
};

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════ */
function GlobalStyles({ dark }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:       ${dark ? "#0A0A0A" : "#F4F4EF"};
      --srf:      ${dark ? "#141414" : "#FFFFFF"};
      --srf2:     ${dark ? "#1C1C1C" : "#EBEBEB"};
      --bdr:      ${dark ? "#242424" : "#DDDDD8"};
      --txt:      ${dark ? "#F0F0EA" : "#111111"};
      --txt2:     ${dark ? "#6A6A6A" : "#6A6A6A"};
      --acc:      ${dark ? "#D4FF00" : "#111111"};
      --acc-fg:   ${dark ? "#0A0A0A" : "#FFFFFF"};
      --red:      #FF4545;
      --orange:   #FF8C00;
      --green:    #3DFF96;
      --r:        10px;
      --rsm:      7px;
      --sh:       ${dark ? "0 2px 20px rgba(0,0,0,.55)" : "0 2px 20px rgba(0,0,0,.08)"};
      --sh-lg:    ${dark ? "0 8px 48px rgba(0,0,0,.7)" : "0 8px 48px rgba(0,0,0,.14)"};
      --font-d:   'Syne', sans-serif;
      --font-b:   'Figtree', sans-serif;
    }
    html, body { font-family: var(--font-b); background: var(--bg); color: var(--txt); min-height: 100vh; }
    * { transition: background-color .2s, border-color .2s, color .15s; }
    input, textarea, select {
      font-family: var(--font-b); background: var(--srf2); color: var(--txt);
      border: 1.5px solid var(--bdr); border-radius: var(--rsm);
      padding: 10px 14px; font-size: 14px; width: 100%; outline: none;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--acc);
      box-shadow: 0 0 0 3px ${dark ? "rgba(212,255,0,.12)" : "rgba(0,0,0,.1)"};
    }
    button { cursor: pointer; font-family: var(--font-b); }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--bdr); border-radius: 99px; }
    .fi { animation: fi .28s ease both; }
    @keyframes fi { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse2 { 0%,100% { opacity:1; } 50% { opacity:.4; } }
    .hover-card:hover { transform: translateY(-2px); border-color: var(--acc) !important; }
    .nav-item:hover { background: var(--srf2) !important; color: var(--txt) !important; }
    .btn-ghost:hover { background: var(--srf2) !important; }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
function Ico({ n, s = 18, c = "currentColor" }) {
  const p = {
    grid:     <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    house:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    folder:   <><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></>,
    check:    <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    sun:      <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:     <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    logout:   <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arr:      <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    menu:     <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    zap:      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    layers:   <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    chev:     <polyline points="9 18 15 12 9 6"/>,
    ref:      <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    bar:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {p[n]}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRIMITIVES
══════════════════════════════════════════════════════════════ */
function Btn({ children, v = "primary", onClick, disabled, style = {}, sz = "md" }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-b)",
    fontWeight: 600, borderRadius: "var(--rsm)", border: "none", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? .55 : 1, whiteSpace: "nowrap",
    padding: sz === "sm" ? "6px 13px" : sz === "lg" ? "13px 28px" : "9px 18px",
    fontSize: sz === "sm" ? 13 : sz === "lg" ? 16 : 14,
  };
  const vs = {
    primary:   { background: "var(--acc)", color: "var(--acc-fg)" },
    secondary: { background: "var(--srf2)", color: "var(--txt)", border: "1.5px solid var(--bdr)" },
    ghost:     { background: "transparent", color: "var(--txt2)", border: "none" },
    danger:    { background: "rgba(255,69,69,.12)", color: "var(--red)", border: "1px solid rgba(255,69,69,.3)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...vs[v], ...style }}
      onMouseEnter={e => { if (!disabled && v === "primary") e.currentTarget.style.filter = "brightness(0.88)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
    >{children}</button>
  );
}

function Card({ children, style = {}, className = "", onClick }) {
  return (
    <div className={className} onClick={onClick} style={{
      background: "var(--srf)", border: "1.5px solid var(--bdr)",
      borderRadius: "var(--r)", padding: 24,
      transition: "transform .2s, border-color .2s",
      ...style
    }}>{children}</div>
  );
}

function Badge({ s }) {
  const m = {
    PENDING:     { bg: "rgba(106,106,106,.15)", c: "var(--txt2)", label: "Pending" },
    IN_PROGRESS: { bg: "rgba(255,140,0,.15)",   c: "var(--orange)", label: "In Progress" },
    DONE:        { bg: "rgba(61,255,150,.15)",   c: "var(--green)", label: "Done" },
  };
  const cfg = m[s] || m.PENDING;
  return (
    <span style={{
      background: cfg.bg, color: cfg.c, fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 99, letterSpacing: ".05em", textTransform: "uppercase"
    }}>{cfg.label}</span>
  );
}

function Spin() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <div style={{ width: 30, height: 30, border: "2.5px solid var(--bdr)", borderTopColor: "var(--acc)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
    </div>
  );
}

function Empty({ icon, title, sub, cta, onCta }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--txt2)" }}>
      <div style={{ opacity: .4, marginBottom: 16 }}><Ico n={icon} s={44} /></div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 14, marginBottom: cta ? 24 : 0 }}>{sub}</p>
      {cta && <Btn v="primary" onClick={onCta}><Ico n="plus" s={15} /> {cta}</Btn>}
    </div>
  );
}

function Modal({ title, onClose, children, w = 480 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      backdropFilter: "blur(6px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fi" style={{
        background: "var(--srf)", border: "1.5px solid var(--bdr)", borderRadius: "var(--r)",
        width: "100%", maxWidth: w, boxShadow: "var(--sh-lg)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--bdr)" }}>
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--txt2)", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6 }}><Ico n="x" s={18} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 6, color: "var(--txt2)", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>
      {children}
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  const ok = msg.toLowerCase().includes("creat") || msg.toLowerCase().includes("success");
  return (
    <div style={{ background: ok ? "rgba(61,255,150,.1)" : "rgba(255,69,69,.1)", color: ok ? "var(--green)" : "var(--red)", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
      {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════ */
function Landing({ goAuth, dark, setDark }) {
  const feats = [
    { i: "house",   t: "Workspaces",       d: "Dedicated spaces per team. Invite members with precise role-based permissions." },
    { i: "folder",  t: "Projects",          d: "Structure work into focused projects. Rename, delete, track progress." },
    { i: "check",   t: "Task Board",        d: "Kanban-style boards. Assign tasks, set status, move cards effortlessly." },
    { i: "shield",  t: "Role-Based Access", d: "PM, Developer, or Viewer — control who sees and edits what." },
    { i: "users",   t: "Team Management",   d: "Invite teammates by username. See every member and their role." },
    { i: "bar",     t: "Live Dashboard",    d: "Real-time overview of tasks, progress, and workspace activity." },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 52px", borderBottom: "1px solid var(--bdr)",
        position: "sticky", top: 0, background: "var(--bg)", zIndex: 100,
      }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle dark={dark} setDark={setDark} />
          <Btn v="secondary" onClick={goAuth}>Sign in</Btn>
          <Btn v="primary" onClick={goAuth}>Get started free</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "108px 28px 72px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "var(--srf)",
          border: "1px solid var(--bdr)", padding: "5px 16px", borderRadius: 99,
          fontSize: 13, fontWeight: 600, color: "var(--txt2)", marginBottom: 36,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse2 2.2s infinite" }} />
          Team Task Manager · 2026
        </div>
        <h1 style={{
          fontFamily: "var(--font-d)", fontWeight: 800, letterSpacing: "-.045em",
          lineHeight: 1.0, marginBottom: 28,
          fontSize: "clamp(52px, 8.5vw, 100px)",
        }}>
          Ship faster Togather.<br />
         
        </h1>
        <p style={{ fontSize: 19, color: "var(--txt2)", maxWidth: 520, margin: "0 auto 52px", lineHeight: 1.65, fontWeight: 400 }}>
          The project management tool your engineering team will actually use. Workspaces, boards, and role-based access — all in one.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn v="primary" sz="lg" onClick={goAuth}>Start building <Ico n="arr" s={16} /></Btn>
          {/* <Btn v="secondary" sz="lg">Watch demo</Btn> */}
        </div>

        {/* Stats strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
          background: "var(--bdr)", borderRadius: "var(--r)", border: "1px solid var(--bdr)",
          maxWidth: 580, margin: "80px auto 0", overflow: "hidden",
        }}>
          {[["12K+","Active teams"],["3.2M+","Tasks shipped"],["99.9%","Uptime"]]
            .map(([v,l]) => (
              <div key={l} style={{ background: "var(--srf)", padding: "28px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 34, fontWeight: 800, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 13, color: "var(--txt2)" }}>{l}</div>
              </div>
            ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 28px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: 42, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 14 }}>
            Built for real teams
          </h2>
          <p style={{ color: "var(--txt2)", fontSize: 17 }}>Everything from planning to delivery, in one cohesive workspace.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 14 }}>
          {feats.map((f, i) => (
            <Card key={i} className="hover-card" style={{ cursor: "default", padding: "26px 24px" }}>
              <div style={{ width: 42, height: 42, background: "var(--srf2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ico n={f.i} s={20} />
              </div>
              <h3 style={{ fontFamily: "var(--font-d)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.t}</h3>
              <p style={{ color: "var(--txt2)", fontSize: 14, lineHeight: 1.65 }}>{f.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: 1064, margin: "0 auto 88px", padding: "0 28px" }}>
        <div style={{ background: "var(--acc)", borderRadius: "var(--r)", padding: "64px 52px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: 46, fontWeight: 800, letterSpacing: "-.03em", color: "var(--acc-fg)", marginBottom: 18 }}>
            Ready to get started?
          </h2>
          <p style={{ color: "var(--acc-fg)", fontSize: 18, opacity: .75, marginBottom: 36 }}>
            Free to use. No credit card required.
          </p>
          <button onClick={goAuth} style={{
            background: "var(--acc-fg)", color: "var(--acc)", fontFamily: "var(--font-b)", fontWeight: 700,
            fontSize: 16, padding: "13px 30px", borderRadius: "var(--rsm)", border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Create your workspace <Ico n="arr" s={16} c="var(--acc)" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--bdr)", padding: "24px 52px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--txt2)", fontSize: 13 }}>
        <Logo />
        <span>© 2026 Jira. All rights reserved.</span>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUTH (Login / Sign-up)
══════════════════════════════════════════════════════════════ */
// function Auth({ goBack, onLogin, dark, setDark }) {
//   const [view, setView] = useState("login");
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

//   async function handleLogin() {
//     setLoading(true); setMsg("");
//     try {
//       const body = new URLSearchParams();
//       body.append("username", form.email);
//       body.append("password", form.password);
//       const data = await apiFetch(ROUTES.login, { method: "POST", body });
//       if (!data.access_token) throw new Error(data.detail || "Login failed");
//       onLogin(data.access_token, { email: form.email, username: form.email.split("@")[0] });
//     } catch (e) { setMsg(e.message); }
//     setLoading(false);
//   }

//   async function handleSignup() {
//     setLoading(true); setMsg("");
//     try {
//       await apiFetch(ROUTES.signup, { method: "POST", body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
//       setMsg("Account created! Please sign in.");
//       setView("login");
//     } catch (e) { setMsg(e.message); }
//     setLoading(false);
//   }

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 36px" }}>
//         <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
//           <Logo />
//         </button>
//         <ThemeToggle dark={dark} setDark={setDark} />
//       </div>

//       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
//         <div className="fi" style={{ width: "100%", maxWidth: 420 }}>
//           <div style={{ textAlign: "center", marginBottom: 36 }}>
//             <div style={{ width: 56, height: 56, background: "var(--acc)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
//               <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 24, color: "var(--acc-fg)" }}>J</span>
//             </div>
//             <h1 style={{ fontFamily: "var(--font-d)", fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>
//               {view === "login" ? "Welcome back" : "Get started"}
//             </h1>
//             <p style={{ color: "var(--txt2)", fontSize: 15 }}>
//               {view === "login" ? "Sign in to your workspace" : "Create your free account"}
//             </p>
//           </div>

//           <Card style={{ padding: 32 }}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {view === "signup" && (
//                 <Field label="Full Name">
//                   <input placeholder="Jane Smith" value={form.name} onChange={f("name")} />
//                 </Field>
//               )}
//               <Field label="Email">
//                 <input type="email" placeholder="you@company.com" value={form.email} onChange={f("email")} />
//               </Field>
//               <Field label="Password">
//                 <input type="password" placeholder="••••••••" value={form.password} onChange={f("password")}
//                   onKeyDown={e => e.key === "Enter" && (view === "login" ? handleLogin() : handleSignup())} />
//               </Field>
//               <ErrBox msg={msg} />
//               <Btn v="primary" onClick={view === "login" ? handleLogin : handleSignup} disabled={loading}
//                 style={{ width: "100%", justifyContent: "center", paddingTop: 12, paddingBottom: 12 }}>
//                 {loading ? "Please wait…" : view === "login" ? "Sign In" : "Create Account"}
//               </Btn>
//             </div>
//           </Card>

//           <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--txt2)" }}>
//             {view === "login" ? "Don't have an account? " : "Already have an account? "}
//             <button onClick={() => { setView(v => v === "login" ? "signup" : "login"); setMsg(""); }}
//               style={{ background: "none", border: "none", color: "var(--acc)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
//               {view === "login" ? "Sign up free" : "Sign in"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
function Auth({ goBack, onLogin, dark, setDark }) {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleLogin() {
    setLoading(true); setMsg("");
    try {
      const body = new URLSearchParams();
      body.append("username", form.username); // sends whatever user typed (email or username)
      body.append("password", form.password);
      const data = await apiFetch(ROUTES.login, { method: "POST", body });
      if (!data.access_token) throw new Error(data.detail || "Login failed");
      onLogin(data.access_token, { email: form.username, username: form.username.split("@")[0] });
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true); setMsg("");
    try {
      await apiFetch(ROUTES.signup, { method: "POST", body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      setMsg("Account created! Please sign in.");
      setView("login");
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 36px" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Logo />
        </button>
        <ThemeToggle dark={dark} setDark={setDark} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="fi" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 56, height: 56, background: "var(--acc)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 24, color: "var(--acc-fg)" }}>J</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-d)", fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>
              {view === "login" ? "Welcome back" : "Get started"}
            </h1>
            <p style={{ color: "var(--txt2)", fontSize: 15 }}>
              {view === "login" ? "Sign in to your workspace" : "Create your free account"}
            </p>
          </div>
          <Card style={{ padding: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {view === "signup" && (
                <Field label="Full Name">
                  <input placeholder="Jane Smith" value={form.name} onChange={f("name")} />
                </Field>
              )}
              {view === "login" ? (
                <Field label="Username or Email">
                  <input placeholder="username or you@company.com" value={form.username} onChange={f("username")} />
                </Field>
              ) : (
                <Field label="Email">
                  <input type="email" placeholder="you@company.com" value={form.email} onChange={f("email")} />
                </Field>
              )}
              <Field label="Password">
                <input type="password" placeholder="••••••••" value={form.password} onChange={f("password")}
                  onKeyDown={e => e.key === "Enter" && (view === "login" ? handleLogin() : handleSignup())} />
              </Field>
              <ErrBox msg={msg} />
              <Btn v="primary" onClick={view === "login" ? handleLogin : handleSignup} disabled={loading}
                style={{ width: "100%", justifyContent: "center", paddingTop: 12, paddingBottom: 12 }}>
                {loading ? "Please wait…" : view === "login" ? "Sign In" : "Create Account"}
              </Btn>
            </div>
          </Card>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--txt2)" }}>
            {view === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setView(v => v === "login" ? "signup" : "login"); setMsg(""); }}
              style={{ background: "none", border: "none", color: "var(--acc)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {view === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
function Sidebar({ active, setActive, onLogout, col }) {
  const nav = [
    { id: "overview",    i: "grid",   l: "Overview" },
    { id: "workspaces",  i: "house",  l: "Workspaces" },
    { id: "projects",    i: "folder", l: "Projects" },
    { id: "board",       i: "check",  l: "Board" },
    { id: "members",     i: "users",  l: "Members" },
    { id: "profile",     i: "user",   l: "Profile" },
  ];
  return (
    <aside style={{
      width: col ? 60 : 218, minWidth: col ? 60 : 218,
      background: "var(--srf)", borderRight: "1.5px solid var(--bdr)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
      transition: "width .3s ease, min-width .3s ease", overflow: "hidden",
    }}>
      <div style={{ padding: col ? "18px 14px" : "18px 16px", borderBottom: "1px solid var(--bdr)", display: "flex", alignItems: "center", gap: 10, minHeight: 62 }}>
        <div style={{ width: 30, height: 30, background: "var(--acc)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 15, color: "var(--acc-fg)" }}>J</span>
        </div>
        {!col && <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 19, letterSpacing: "-.02em", whiteSpace: "nowrap" }}>Jira</span>}
      </div>

      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} className={on ? "" : "nav-item"} style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: col ? "9px 15px" : "9px 12px",
              borderRadius: 8, border: "none", cursor: "pointer", width: "100%",
              background: on ? "var(--srf2)" : "transparent",
              color: on ? "var(--txt)" : "var(--txt2)",
              fontSize: 14, fontWeight: on ? 600 : 500,
              borderLeft: on ? "2.5px solid var(--acc)" : "2.5px solid transparent",
              transition: "all .15s",
            }}>
              <Ico n={item.i} s={17} c={on ? "var(--acc)" : "currentColor"} />
              {!col && <span style={{ whiteSpace: "nowrap" }}>{item.l}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "10px 8px", borderTop: "1px solid var(--bdr)" }}>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 11,
          padding: col ? "9px 15px" : "9px 12px",
          borderRadius: 8, border: "none", cursor: "pointer", width: "100%",
          background: "transparent", color: "var(--txt2)", fontSize: 14, fontWeight: 500,
          transition: "all .15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,69,69,.1)"; e.currentTarget.style.color = "var(--red)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--txt2)"; }}
        >
          <Ico n="logout" s={17} c="currentColor" />
          {!col && <span style={{ whiteSpace: "nowrap" }}>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════════════ */
function Topbar({ title, dark, setDark, user, toggleCol }) {
  return (
    <header style={{
      height: 62, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 22px", borderBottom: "1.5px solid var(--bdr)",
      background: "var(--srf)", position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="btn-ghost" onClick={toggleCol} style={{ background: "var(--srf2)", border: "1px solid var(--bdr)", color: "var(--txt2)", padding: "7px 9px", borderRadius: 7, cursor: "pointer", display: "flex", transition: "background .15s" }}>
          <Ico n="menu" s={18} />
        </button>
        <h2 style={{ fontFamily: "var(--font-d)", fontSize: 19, fontWeight: 700, letterSpacing: "-.02em" }}>{title}</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle dark={dark} setDark={setDark} />
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "var(--acc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-d)", fontWeight: 700, fontSize: 13, color: "var(--acc-fg)", cursor: "default",
          border: "2px solid var(--bdr)",
        }}>
          {(user?.username || user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW PAGE
══════════════════════════════════════════════════════════════ */
function Overview({ token, workspaces, allTasks, setActive }) {
  const done = allTasks.filter(t => t.status === "DONE").length;
  const inp  = allTasks.filter(t => t.status === "IN_PROGRESS").length;
  const pend = allTasks.filter(t => t.status === "PENDING").length;
  const total = allTasks.length;

  const stats = [
    { l: "Total Tasks",    v: total, accent: "var(--txt)" },
    { l: "In Progress",    v: inp,   accent: "var(--orange)" },
    { l: "Pending",        v: pend,  accent: "var(--txt2)" },
    { l: "Completed",      v: done,  accent: "var(--green)" },
    { l: "Workspaces",     v: workspaces.length, accent: "var(--acc)" },
  ];

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="fi" style={{ padding: 26 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 4 }}>
          {greet()} 👋
        </h1>
        <p style={{ color: "var(--txt2)", fontSize: 15 }}>Here's your workspace summary.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 26 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "18px 22px" }}>
            <div style={{ fontSize: 12.5, color: "var(--txt2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-d)", fontSize: 38, fontWeight: 800, color: s.accent }}>{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Progress */}
      {total > 0 && (
        <Card style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 700 }}>Overall Progress</h3>
            <span style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 600 }}>{Math.round((done / total) * 100)}%</span>
          </div>
          <div style={{ background: "var(--srf2)", borderRadius: 99, height: 7 }}>
            <div style={{ width: `${(done / total) * 100}%`, height: "100%", background: "var(--acc)", borderRadius: 99, transition: "width 1s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
            {[["Done", done, "var(--green)"], ["In Progress", inp, "var(--orange)"], ["Pending", pend, "var(--txt2)"]].map(([l, v, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} />
                <span style={{ color: "var(--txt2)" }}>{l}:</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </span>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Recent tasks */}
        <Card>
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Tasks</h3>
          {allTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--txt2)", fontSize: 14 }}>
              No tasks yet. <button onClick={() => setActive("board")} style={{ background: "none", border: "none", color: "var(--acc)", fontWeight: 700, cursor: "pointer" }}>Create one →</button>
            </div>
          ) : allTasks.slice(0, 6).map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < Math.min(allTasks.length, 6) - 1 ? "1px solid var(--bdr)" : "none" }}>
              <div style={{ minWidth: 0, flex: 1, paddingRight: 10 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--txt2)", marginTop: 1 }}>by {t.created_by || "Unknown"}</div>
              </div>
              <Badge s={t.status} />
            </div>
          ))}
        </Card>

        {/* Workspaces */}
        <Card>
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Workspaces</h3>
          {workspaces.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--txt2)", fontSize: 14 }}>
              No workspaces. <button onClick={() => setActive("workspaces")} style={{ background: "none", border: "none", color: "var(--acc)", fontWeight: 700, cursor: "pointer" }}>Create one →</button>
            </div>
          ) : workspaces.map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < workspaces.length - 1 ? "1px solid var(--bdr)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 16, color: "var(--acc-fg)", flexShrink: 0 }}>
                {w.workspacename[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{w.workspacename}</div>
                <div style={{ fontSize: 11.5, color: "var(--txt2)" }}>Created {w.created_at || "recently"}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WORKSPACES PAGE
══════════════════════════════════════════════════════════════ */
function WorkspacesPage({ token, workspaces, setWorkspaces, setSelWS, setActive }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", role: "DEVELOPER" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [invWS, setInvWS] = useState(null);

  async function load() {
    try {
      const d = await apiFetch(ROUTES.allWorkspaces, {}, token);
      setWorkspaces(Array.isArray(d) ? d : []);
    } catch {}
  }

  useEffect(() => { load(); }, [token]);

  async function create() {
    if (!form.name.trim()) return;
    setLoading(true); setMsg("");
    try {
      await apiFetch(ROUTES.createWorkspace, { method: "POST", body: JSON.stringify({ name: form.name }) }, token);
      setModal(null); setForm(p => ({ ...p, name: "" })); load();
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  async function del(id) {
    if (!confirm("Delete this workspace and all its projects?")) return;
    try { await apiFetch(ROUTES.deleteWorkspace(id), { method: "DELETE" }, token); load(); }
    catch (e) { alert(e.message); }
  }

  async function invite() {
    if (!invWS || !form.username) return;
    setLoading(true); setMsg("");
    try {
      await apiFetch(ROUTES.inviteMember(invWS.work_id), { method: "POST", body: JSON.stringify({ username: form.username, role: form.role }) }, token);
      setModal(null); setMsg(""); setForm(p => ({ ...p, username: "", role: "DEVELOPER" }));
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  function select(w) { setSelWS(w); setActive("projects"); }

  return (
    <div className="fi" style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 4 }}>Workspaces</h1>
          <p style={{ color: "var(--txt2)", fontSize: 15 }}>Manage your teams and organizations.</p>
        </div>
        <Btn v="primary" onClick={() => { setModal("create"); setMsg(""); }}>
          <Ico n="plus" s={15} /> New Workspace
        </Btn>
      </div>

      {workspaces.length === 0
        ? <Empty icon="house" title="No workspaces yet" sub="Create your first workspace to get started." cta="Create Workspace" onCta={() => setModal("create")} />
        : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
            {workspaces.map((w, i) => (
              <Card key={i} className="hover-card" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 50, height: 50, background: "var(--acc)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 22, color: "var(--acc-fg)" }}>
                    {w.workspacename[0].toUpperCase()}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={e => { e.stopPropagation(); setInvWS(w); setModal("invite"); setMsg(""); }}
                      title="Invite member"
                      style={{ background: "var(--srf2)", border: "none", color: "var(--txt2)", padding: "6px 8px", borderRadius: 6, cursor: "pointer", display: "flex" }}>
                      <Ico n="users" s={14} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); del(w.work_id); }}
                      title="Delete workspace"
                      style={{ background: "rgba(255,69,69,.1)", border: "none", color: "var(--red)", padding: "6px 8px", borderRadius: 6, cursor: "pointer", display: "flex" }}>
                      <Ico n="trash" s={14} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontFamily: "var(--font-d)", fontSize: 18, fontWeight: 700, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.workspacename}</h3>
                <p style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 18 }}>Created {w.created_at || "recently"}</p>
                <Btn v="secondary" sz="sm" onClick={() => select(w)}>Open Projects <Ico n="chev" s={13} /></Btn>
              </Card>
            ))}
          </div>
        )
      }

      {modal === "create" && (
        <Modal title="New Workspace" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Workspace Name"><input placeholder="e.g. Engineering Team" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && create()} /></Field>
            <ErrBox msg={msg} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn v="primary" onClick={create} disabled={loading}>{loading ? "Creating…" : "Create"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === "invite" && (
        <Modal title={`Invite to "${invWS?.workspacename}"`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Username"><input placeholder="johndoe" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} /></Field>
            <Field label="Role">
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="DEVELOPER">Developer</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </Field>
            <ErrBox msg={msg} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn v="primary" onClick={invite} disabled={loading}>{loading ? "Inviting…" : "Send Invite"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROJECTS PAGE
══════════════════════════════════════════════════════════════ */
function ProjectsPage({ token, workspaces, selWS, setSelWS, projects, setProjects, setSelProj, setActive }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function create() {
    if (!selWS || !form.name.trim()) return;
    setLoading(true); setMsg("");
    try {
      const d = await apiFetch(ROUTES.createProject(selWS.work_id), { method: "POST", body: JSON.stringify({ name: form.name }) }, token);
      setProjects(p => [...p, { ...d, _wsId: selWS.work_id }]);
      setModal(null); setForm({ name: "" });
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  async function del(wsId, pid) {
    if (!confirm("Delete this project?")) return;
    try {
      await apiFetch(ROUTES.deleteProject(wsId, pid), { method: "DELETE" }, token);
      setProjects(p => p.filter(x => x.project_id !== pid));
    } catch (e) { alert(e.message); }
  }

  function open(p) { setSelProj(p); setActive("board"); }

  return (
    <div className="fi" style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 4 }}>Projects</h1>
          <p style={{ color: "var(--txt2)", fontSize: 15 }}>
            {selWS ? <>Workspace: <strong>{selWS.workspacename}</strong></> : "Select a workspace to view projects"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={selWS?.work_id || ""} onChange={e => setSelWS(workspaces.find(w => w.work_id == e.target.value) || null)}
            style={{ padding: "9px 14px", minWidth: 180 }}>
            <option value="">Select workspace…</option>
            {workspaces.map(w => <option key={w.work_id} value={w.work_id}>{w.workspacename}</option>)}
          </select>
          {selWS && <Btn v="primary" onClick={() => { setModal("create"); setMsg(""); }}><Ico n="plus" s={15} /> New Project</Btn>}
        </div>
      </div>

      {!selWS
        ? <Empty icon="layers" title="No workspace selected" sub="Choose a workspace from the dropdown above." />
        : projects.filter(p => p._wsId === selWS.work_id || p.workspace_id === selWS.work_id).length === 0
          ? <Empty icon="folder" title="No projects yet" sub="Create your first project in this workspace." cta="Create Project" onCta={() => setModal("create")} />
          : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {projects.filter(p => p._wsId === selWS.work_id || p.workspace_id === selWS.work_id).map((p, i) => (
                <Card key={i} className="hover-card" style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: "var(--srf2)", borderRadius: 10, border: "1.5px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ico n="folder" s={20} />
                    </div>
                    <button onClick={e => { e.stopPropagation(); del(selWS.work_id, p.project_id); }}
                      style={{ background: "rgba(255,69,69,.1)", border: "none", color: "var(--red)", padding: "6px 8px", borderRadius: 6, cursor: "pointer", display: "flex" }}>
                      <Ico n="trash" s={14} />
                    </button>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-d)", fontSize: 18, fontWeight: 700, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.project_name || p.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 18 }}>ID #{p.project_id}</p>
                  <Btn v="secondary" sz="sm" onClick={() => open(p)}>Open Board <Ico n="chev" s={13} /></Btn>
                </Card>
              ))}
            </div>
          )
      }

      {modal === "create" && (
        <Modal title="New Project" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Project Name"><input placeholder="e.g. Backend API" value={form.name} onChange={e => setForm({ name: e.target.value })} onKeyDown={e => e.key === "Enter" && create()} /></Field>
            <ErrBox msg={msg} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn v="primary" onClick={create} disabled={loading}>{loading ? "Creating…" : "Create"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOARD (Kanban Tasks)
══════════════════════════════════════════════════════════════ */
function Board({ token, selProj, setSelProj, selWS, projects, tasks, setTasks }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "PENDING", assignee_id: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState("");
  const [members, setMembers] = useState([]);

  const cols = [
    { id: "PENDING",     label: "Pending",     dot: "var(--txt2)"   },
    { id: "IN_PROGRESS", label: "In Progress", dot: "var(--orange)" },
    { id: "DONE",        label: "Done",        dot: "var(--green)"  },
  ];

  async function loadTasks() {
    if (!selProj) return;
    setFetching(true);
    try {
      const d = await apiFetch(ROUTES.allTasks(selProj.project_id), {}, token);
      setTasks(Array.isArray(d) ? d : []);
    } catch { setTasks([]); }
    setFetching(false);
  }

  async function loadMembers() {
    if (!selWS) return;
    try {
      const d = await apiFetch(ROUTES.getMembers(selWS.work_id), {}, token);
      setMembers(Array.isArray(d) ? d : []);
    } catch {}
  }

  useEffect(() => { loadTasks(); loadMembers(); }, [selProj, token]);

  async function createTask() {
    if (!selProj || !form.title.trim()) { setMsg("Title is required."); return; }
    setLoading(true); setMsg("");
    const wsId = selWS?.work_id || selProj.workspace_id || selProj._wsId || 0;
    try {
      await apiFetch(
        ROUTES.createTask(wsId, selProj.project_id, form.assignee_id || 0),
        { method: "POST", body: JSON.stringify({ title: form.title, description: form.description, status: form.status, assignee_id: form.assignee_id ? parseInt(form.assignee_id) : null }) },
        token
      );
      setModal(null);
      setForm({ title: "", description: "", status: "PENDING", assignee_id: "" });
      loadTasks();
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  }

  async function updateStatus(tid, status) {
    try {
      await apiFetch(ROUTES.updateTask(tid), { method: "PUT", body: JSON.stringify({ status }) }, token);
      setTasks(prev => prev.map(t => t.task_id === tid ? { ...t, status } : t));
    } catch (e) { alert(e.message); }
  }

  async function delTask(tid) {
    if (!confirm("Delete this task?")) return;
    try {
      await apiFetch(ROUTES.deleteTask(tid), { method: "DELETE" }, token);
      setTasks(prev => prev.filter(t => t.task_id !== tid));
    } catch (e) { alert(e.message); }
  }

  const colTasks = id => tasks.filter(t => t.status === id);

  return (
    <div className="fi" style={{ padding: 26, height: "calc(100vh - 62px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 4 }}>Board</h1>
          <p style={{ color: "var(--txt2)", fontSize: 15 }}>
            {selProj ? <>Project: <strong>{selProj.project_name || selProj.name}</strong></> : "Select a project to manage tasks"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={selProj?.project_id || ""} onChange={e => setSelProj(projects.find(p => p.project_id == e.target.value) || null)}
            style={{ padding: "9px 14px", minWidth: 180 }}>
            <option value="">Select project…</option>
            {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_name || p.name}</option>)}
          </select>
          {selProj && (
            <button onClick={loadTasks} title="Refresh" style={{ background: "var(--srf2)", border: "1.5px solid var(--bdr)", color: "var(--txt2)", padding: "8px 10px", borderRadius: 7, cursor: "pointer", display: "flex" }}>
              <Ico n="ref" s={16} />
            </button>
          )}
          {selProj && <Btn v="primary" onClick={() => { setModal("task"); setMsg(""); }}><Ico n="plus" s={15} /> New Task</Btn>}
        </div>
      </div>

      {!selProj
        ? <Empty icon="check" title="No project selected" sub="Choose a project from the dropdown above." />
        : fetching ? <Spin />
        : (
          /* Kanban columns */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, flex: 1, overflow: "hidden", minHeight: 0 }}>
            {cols.map(col => (
              <div key={col.id} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "9px 14px", background: "var(--srf)", borderRadius: "var(--rsm)", border: "1.5px solid var(--bdr)", flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.dot }} />
                  <span style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: 13 }}>{col.label}</span>
                  <span style={{ marginLeft: "auto", background: "var(--srf2)", color: "var(--txt2)", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                    {colTasks(col.id).length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 4 }}>
                  {colTasks(col.id).map((task, i) => (
                    <div key={i} style={{
                      background: "var(--srf)", border: "1.5px solid var(--bdr)", borderRadius: "var(--r)", padding: "13px 14px",
                      transition: "transform .15s, border-color .15s", cursor: "default",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = col.dot; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--bdr)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--txt2)", fontWeight: 600, background: "var(--srf2)", padding: "2px 7px", borderRadius: 99 }}>
                          #{task.task_id}
                        </span>
                        <button onClick={() => delTask(task.task_id)} style={{ background: "none", border: "none", color: "var(--txt2)", cursor: "pointer", opacity: .45, padding: 2 }}>
                          <Ico n="trash" s={12} />
                        </button>
                      </div>
                      <h4 style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{task.title}</h4>
                      {task.description && (
                        <p style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.55, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: "var(--txt2)" }}>By: {task.created_by || "—"}</span>
                        {task.created_at && <span style={{ fontSize: 11, color: "var(--txt2)" }}>{task.created_at}</span>}
                      </div>
                      <select value={task.status} onChange={e => updateStatus(task.task_id, e.target.value)}
                        style={{ fontSize: 12, padding: "5px 9px", width: "100%", borderRadius: "var(--rsm)" }}>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  ))}
                  {colTasks(col.id).length === 0 && (
                    <div style={{ border: "2px dashed var(--bdr)", borderRadius: "var(--r)", padding: "30px 16px", textAlign: "center", color: "var(--txt2)", fontSize: 13 }}>
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal === "task" && (
        <Modal title="Create Task" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Title *"><input placeholder="Implement auth middleware" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></Field>
            <Field label="Description">
              <textarea placeholder="Describe the task…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: "vertical", minHeight: 80 }} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </Field>
            {members.length > 0 && (
              <Field label="Assign To">
                <select value={form.assignee_id} onChange={e => setForm(p => ({ ...p, assignee_id: e.target.value }))}>
                  <option value="">Unassigned</option>
                  {members.map(m => {
                    const uid = m.user?.user_id || m.user_id;
                    const un = m.user?.username || m.username || "Member";
                    return <option key={uid} value={uid}>{un}</option>;
                  })}
                </select>
              </Field>
            )}
            <ErrBox msg={msg} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="secondary" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn v="primary" onClick={createTask} disabled={loading}>{loading ? "Creating…" : "Create Task"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MEMBERS PAGE
══════════════════════════════════════════════════════════════ */
function MembersPage({ token, selWS, setSelWS, workspaces }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selWS) return;
    setLoading(true);
    apiFetch(ROUTES.getMembers(selWS.work_id), {}, token)
      .then(d => setMembers(Array.isArray(d) ? d : []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [selWS, token]);

  const roleBadge = role => {
    const r = (role || "VIEWER").replace("Roles.", "").replace(/\./g, "");
    const map = {
      PROJECT_MANAGER: { bg: "rgba(212,255,0,.12)", c: "var(--acc)", l: "PM" },
      DEVELOPER:       { bg: "rgba(68,136,255,.12)", c: "#5599FF", l: "Dev" },
      VIEWER:          { bg: "rgba(128,128,128,.12)", c: "var(--txt2)", l: "Viewer" },
    };
    const cfg = map[r] || map.VIEWER;
    return (
      <span style={{ background: cfg.bg, color: cfg.c, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: ".05em", textTransform: "uppercase" }}>
        {cfg.l}
      </span>
    );
  };

  return (
    <div className="fi" style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 4 }}>Members</h1>
          <p style={{ color: "var(--txt2)", fontSize: 15 }}>
            {selWS ? <>Team in <strong>{selWS.workspacename}</strong></> : "Select a workspace"}
          </p>
        </div>
        <select value={selWS?.work_id || ""} onChange={e => setSelWS(workspaces.find(w => w.work_id == e.target.value) || null)}
          style={{ padding: "9px 14px", minWidth: 200 }}>
          <option value="">Select workspace…</option>
          {workspaces.map(w => <option key={w.work_id} value={w.work_id}>{w.workspacename}</option>)}
        </select>
      </div>

      {!selWS
        ? <Empty icon="users" title="No workspace selected" sub="Choose a workspace from the dropdown above." />
        : loading ? <Spin />
        : members.length === 0
          ? <Empty icon="users" title="No members found" sub="Invite team members from the Workspaces page." />
          : (
            <Card>
              {members.map((m, i) => {
                const role = m.role || "VIEWER";
                const uname = m.user?.username || m.username || "Member";
                const email = m.user?.email || m.email || "";
                const uid = m.user?.user_id || m.user_id || i;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < members.length - 1 ? "1px solid var(--bdr)" : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-d)", fontWeight: 700, fontSize: 16, color: "var(--acc-fg)", flexShrink: 0 }}>
                      {uname[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{uname}</div>
                      <div style={{ fontSize: 12, color: "var(--txt2)" }}>{email || `User #${uid}`}</div>
                    </div>
                    {roleBadge(role)}
                  </div>
                );
              })}
            </Card>
          )
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════════════════ */
function ProfilePage({ user, onLogout, tasks }) {
  const done = tasks.filter(t => t.status === "DONE").length;
  const inp  = tasks.filter(t => t.status === "IN_PROGRESS").length;

  return (
    <div className="fi" style={{ padding: 26 }}>
      <h1 style={{ fontFamily: "var(--font-d)", fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 24 }}>Profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 780 }}>
        {/* Profile card */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 30, color: "var(--acc-fg)", flexShrink: 0 }}>
              {(user?.username || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-d)", fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{user?.username || "User"}</h2>
              <p style={{ color: "var(--txt2)", fontSize: 14 }}>{user?.email || "No email"}</p>
            </div>
          </div>
          {[
            ["Username",    user?.username   || "—"],
            ["Email",       user?.email      || "—"],
            ["User ID",     user?.user_id    || "—"],
            ["Member since",user?.create_at  || "Recently"],
          ].map(([l, v], i, arr) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--bdr)" : "none" }}>
              <span style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 500 }}>{l}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Activity cards */}
        <Card style={{ textAlign: "center", padding: "30px 24px" }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: 42, fontWeight: 800, color: "var(--green)", marginBottom: 6 }}>{done}</div>
          <div style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Tasks Done</div>
        </Card>
        <Card style={{ textAlign: "center", padding: "30px 24px" }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: 42, fontWeight: 800, color: "var(--orange)", marginBottom: 6 }}>{inp}</div>
          <div style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>In Progress</div>
        </Card>

        {/* Sign out */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Account Actions</h3>
          <Btn v="danger" onClick={onLogout}><Ico n="logout" s={16} /> Sign Out</Btn>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, background: "var(--acc)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 14, color: "var(--acc-fg)" }}>J</span>
      </div>
      <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: 19, letterSpacing: "-.02em" }}>Jira</span>
    </div>
  );
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)} style={{
      background: "var(--srf2)", border: "1.5px solid var(--bdr)", color: "var(--txt)", padding: "7px 9px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center",
    }}>
      <Ico n={dark ? "sun" : "moon"} s={16} />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD SHELL
══════════════════════════════════════════════════════════════ */
function Dashboard({ token, user, setToken, setUser, setPage, dark, setDark }) {
  const [active, setActive] = useState("overview");
  const [col, setCol] = useState(false);

  // Shared data
  const [workspaces, setWorkspaces] = useState([]);
  const [selWS, setSelWS] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selProj, setSelProj] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    apiFetch(ROUTES.allWorkspaces, {}, token)
      .then(d => setWorkspaces(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [token]);

  function logout() {
    localStorage.removeItem("jira_token");
    localStorage.removeItem("jira_user");
    setToken(null); setUser(null); setPage("LANDING");
  }

  const titles = { overview: "Overview", workspaces: "Workspaces", projects: "Projects", board: "Board", members: "Members", profile: "Profile" };

  function renderPage() {
    switch (active) {
      case "overview":   return <Overview token={token} workspaces={workspaces} allTasks={tasks} setActive={setActive} />;
      case "workspaces": return <WorkspacesPage token={token} workspaces={workspaces} setWorkspaces={setWorkspaces} setSelWS={ws => { setSelWS(ws); }} setActive={setActive} />;
      case "projects":   return <ProjectsPage token={token} workspaces={workspaces} selWS={selWS} setSelWS={setSelWS} projects={projects} setProjects={setProjects} setSelProj={setSelProj} setActive={setActive} />;
      case "board":      return <Board token={token} selProj={selProj} setSelProj={setSelProj} selWS={selWS} projects={projects} tasks={tasks} setTasks={setTasks} />;
      case "members":    return <MembersPage token={token} selWS={selWS} setSelWS={setSelWS} workspaces={workspaces} />;
      case "profile":    return <ProfilePage user={user} onLogout={logout} tasks={tasks} />;
      default: return null;
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} onLogout={logout} col={col} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar title={titles[active]} dark={dark} setDark={setDark} user={user} toggleCol={() => setCol(c => !c)} />
        <main style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page,  setPage]  = useState("LANDING");
  const [dark,  setDark]  = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("jira_token") || null);
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem("jira_user") || "null"); } catch { return null; } });

  useEffect(() => { if (token) setPage("DASHBOARD"); }, []);

  function handleLogin(t, u) {
    localStorage.setItem("jira_token", t);
    localStorage.setItem("jira_user", JSON.stringify(u));
    setToken(t); setUser(u); setPage("DASHBOARD");
  }

  function handleSetToken(t) {
    if (t) localStorage.setItem("jira_token", t);
    else { localStorage.removeItem("jira_token"); localStorage.removeItem("jira_user"); }
    setToken(t);
  }

  return (
    <>
      <GlobalStyles dark={dark} />
      {page === "LANDING"   && <Landing goAuth={() => setPage("AUTH")} dark={dark} setDark={setDark} />}
      {page === "AUTH"      && <Auth goBack={() => setPage("LANDING")} onLogin={handleLogin} dark={dark} setDark={setDark} />}
      {page === "DASHBOARD" && <Dashboard token={token} user={user} setToken={handleSetToken} setUser={setUser} setPage={setPage} dark={dark} setDark={setDark} />}
    </>
  );
}
