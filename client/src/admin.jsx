import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

async function request(path, opts = {}) {
  const token = localStorage.getItem("rh_token");
  const r = await fetch(API + path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || "Request failed");
  return data;
}

function AdminApp() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({ title: "", date: "", location: "", description: "" });

  const load = async () => {
    const [me, st, us, ev] = await Promise.all([
      request("/me"), request("/admin/stats"), request("/admin/users"), request("/events")
    ]);
    if (me.role !== "admin") throw new Error("This account is not an admin account.");
    setUser(me); setStats(st); setUsers(us); setEvents(ev);
  };

  useEffect(() => {
    if (localStorage.getItem("rh_token")) load().catch(e => {
      localStorage.removeItem("rh_token"); setErr(e.message);
    });
  }, []);

  const doLogin = async e => {
    e.preventDefault(); setErr("");
    try {
      const d = await request("/auth/login", { method: "POST", body: JSON.stringify(login) });
      localStorage.setItem("rh_token", d.token);
      if (d.user.role !== "admin") throw new Error("This account is not an admin account.");
      await load();
    } catch (e) { setErr(e.message); localStorage.removeItem("rh_token"); }
  };

  const logout = () => { localStorage.removeItem("rh_token"); location.reload(); };

  const createEvent = async e => {
    e.preventDefault();
    try {
      await request("/events", { method: "POST", body: JSON.stringify(event) });
      setEvent({ title: "", date: "", location: "", description: "" });
      const ev = await request("/events"); setEvents(ev);
      alert("Event created successfully.");
    } catch (e) { alert(e.message); }
  };

  if (!user) return <main className="adminShell"><div className="adminLogin">
    <div className="adminLogo">🏍️ RIDE<span>HUB</span></div>
    <div className="eyebrow">PRIVATE ADMIN PORTAL</div>
    <h1>Admin Control Center</h1>
    <p>Sign in with an administrator account to manage Ride Hub.</p>
    <form onSubmit={doLogin}>
      <input type="email" placeholder="Admin email" required value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/>
      <input type="password" placeholder="Password" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/>
      {err && <div className="error">{err}</div>}
      <button className="primary full">Open Admin Dashboard</button>
    </form>
    <button className="ghost" onClick={()=>location.href="/"}>← Back to RIDE HUB</button>
  </div></main>;

  return <main className="adminShell">
    <header className="adminHeader">
      <div><div className="adminLogo">🏍️ RIDE<span>HUB</span></div><small>PRIVATE ADMIN PORTAL</small></div>
      <div><button className="ghost" onClick={()=>location.href="/"}>View Website</button><button className="primary small" onClick={logout}>Logout</button></div>
    </header>
    <section className="adminPage">
      <div className="pageHero"><div><span className="eyebrow">CONTROL CENTER</span><h1>Admin Dashboard</h1><p>Manage users, marketplace activity and community events.</p></div></div>
      <div className="adminstats">
        {Object.entries(stats || {}).map(([k,v])=><div key={k}><small>{k}</small><strong>{v}</strong></div>)}
      </div>
      <div className="panel">
        <h2>Registered Users</h2>
        <div className="tableWrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>City</th><th>Joined</th></tr></thead>
        <tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone||"—"}</td><td><span className="tag">{u.role}</span></td><td>{u.city||"—"}</td><td>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}</td></tr>)}</tbody></table></div>
      </div>
      <div className="adminGrid">
        <form className="panel" onSubmit={createEvent}><h2>Create Event</h2>
          <label className="field"><span>Event title</span><input required value={event.title} onChange={e=>setEvent({...event,title:e.target.value})}/></label>
          <label className="field"><span>Date</span><input required type="date" value={event.date} onChange={e=>setEvent({...event,date:e.target.value})}/></label>
          <label className="field"><span>Location</span><input required value={event.location} onChange={e=>setEvent({...event,location:e.target.value})}/></label>
          <label className="field"><span>Description</span><textarea value={event.description} onChange={e=>setEvent({...event,description:e.target.value})}/></label>
          <button className="primary">Create Event</button>
        </form>
        <div className="panel"><h2>Upcoming Events</h2>{events.map(e=><div className="serviceRow" key={e.id}><div><b>{e.title}</b><small>{e.date} • {e.location}</small></div></div>)}</div>
      </div>
    </section>
  </main>;
}
createRoot(document.getElementById("admin-root")).render(<AdminApp />);
