import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

const demoBikes = [
  { id:"d1", category:"Sports", title:"Yamaha MT-15 V2", brand:"Yamaha", model:"MT-15 V2", year:2024, price:168000, city:"Mumbai", fuel_type:"Petrol", mileage:48, image_url:"/bikes/mt15.jpg", description:"Lightweight street sports bike, ideal for city riding and weekend rides." },
  { id:"d2", category:"Sports", title:"Kawasaki Ninja 400", brand:"Kawasaki", model:"Ninja 400", year:2023, price:465000, city:"Mumbai", fuel_type:"Petrol", mileage:25, image_url:"/bikes/ninja-400.jpg", description:"Twin-cylinder sports motorcycle with a sharp riding position and premium styling." },
  { id:"d3", category:"Sports", title:"KTM RC 390", brand:"KTM", model:"RC 390", year:2024, price:320000, city:"Pune", fuel_type:"Petrol", mileage:28, image_url:"/bikes/ktm-rc390.jpg", description:"Aggressive fully-faired sports bike for riders who enjoy spirited road riding." },
  { id:"d4", category:"Sports", title:"Yamaha R15 V4", brand:"Yamaha", model:"R15 V4", year:2024, price:205000, city:"Mumbai", fuel_type:"Petrol", mileage:45, image_url:"/bikes/r15-v4.jpg", description:"Popular entry-level supersport-inspired motorcycle with strong efficiency." },
  { id:"d5", category:"Naked", title:"BMW G 310 RR", brand:"BMW", model:"G 310 RR", year:2023, price:285000, city:"Thane", fuel_type:"Petrol", mileage:30, image_url:"/bikes/bmw-g310rr.jpg", description:"Premium lightweight sports motorcycle with modern electronics and styling." },
  { id:"d6", category:"Adventure", title:"Royal Enfield Himalayan 450", brand:"Royal Enfield", model:"Himalayan 450", year:2024, price:310000, city:"Navi Mumbai", fuel_type:"Petrol", mileage:30, image_url:"/bikes/himalayan450.jpg", description:"Adventure motorcycle built for highways, rough roads and touring." },
  { id:"d7", category:"Adventure", title:"KTM 390 Adventure", brand:"KTM", model:"390 Adventure", year:2023, price:345000, city:"Pune", fuel_type:"Petrol", mileage:28, image_url:"/bikes/ktm-adventure.jpg", description:"Versatile adventure bike for long-distance touring and mixed terrain." },
  { id:"d8", category:"Cruiser", title:"Royal Enfield Super Meteor 650", brand:"Royal Enfield", model:"Super Meteor 650", year:2024, price:365000, city:"Mumbai", fuel_type:"Petrol", mileage:25, image_url:"/bikes/super-meteor650.jpg", description:"Relaxed cruiser with a strong twin-cylinder engine and comfortable stance." },
  { id:"d9", category:"Cruiser", title:"Jawa 42 Bobber", brand:"Jawa", model:"42 Bobber", year:2023, price:225000, city:"Thane", fuel_type:"Petrol", mileage:30, image_url:"/bikes/jawa42.jpg", description:"Stylish bobber-inspired cruiser for city rides and weekend cruising." },
  { id:"d10", category:"Naked", title:"Royal Enfield Hunter 350", brand:"Royal Enfield", model:"Hunter 350", year:2023, price:185000, city:"Pune", fuel_type:"Petrol", mileage:36, image_url:"/bikes/hunter350.jpg", description:"Compact roadster with friendly ergonomics and everyday practicality." },
  { id:"d11", category:"Naked", title:"KTM Duke 250", brand:"KTM", model:"Duke 250", year:2024, price:228000, city:"Mumbai", fuel_type:"Petrol", mileage:32, image_url:"/bikes/duke250.jpg", description:"Sharp naked motorcycle with energetic performance for city and highway use." }
];

const bikeImageMap = {
  "MT-15 V2": "/bikes/mt15.jpg",
  "Ninja 400": "/bikes/ninja-400.jpg",
  "RC 390": "/bikes/ktm-rc390.jpg",
  "R15 V4": "/bikes/r15-v4.jpg",
  "G 310 RR": "/bikes/bmw-g310rr.jpg",
  "Himalayan 450": "/bikes/himalayan450.jpg",
  "390 Adventure": "/bikes/ktm-adventure.jpg",
  "Super Meteor 650": "/bikes/super-meteor650.jpg",
  "42 Bobber": "/bikes/jawa42.jpg",
  "Hunter 350": "/bikes/hunter350.jpg",
  "Duke 250": "/bikes/duke250.jpg",
};
const categoryMap = {
  "MT-15 V2": "Naked",
  "Ninja 400": "Sports",
  "RC 390": "Sports",
  "R15 V4": "Sports",
  "G 310 RR": "Sports",
  "Himalayan 450": "Adventure",
  "390 Adventure": "Adventure",
  "Super Meteor 650": "Cruiser",
  "42 Bobber": "Cruiser",
  "Hunter 350": "Naked",
  "Duke 250": "Naked",
};
function normalizeBike(b) {
  const model = b.model || b.title || "";
  const key = Object.keys(bikeImageMap).find(k => model.toLowerCase().includes(k.toLowerCase()));
  return {
    ...b,
    image_url: key && bikeImageMap[key] ? bikeImageMap[key] : (b.image_url && b.image_url.startsWith("/bikes/") ? b.image_url : imgFallback),
    category: b.category || (key ? categoryMap[key] : "Used")
  };
}

const imgFallback = "/bikes/mt15.jpg";

async function api(path, opts = {}) {
  const token = localStorage.getItem("rh_token");
  let r;
  try {
    r = await fetch(API + path, {
      ...opts,
      headers: { "Content-Type":"application/json", ...(token ? {Authorization:`Bearer ${token}`} : {}) }
    });
  } catch (e) {
    throw new Error(`Backend connect nahi ho raha. Server start karo aur ${API}/health check karo.`);
  }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Error(d.message || "Request failed");
  return d;
}

function App() {
  const [page,setPage] = useState("home");
  const [user,setUser] = useState(null);
  const [modal,setModal] = useState(null);
  const [selectedBike,setSelectedBike] = useState(null);
  const [bikes,setBikes] = useState(demoBikes);
  const [events,setEvents] = useState([]);

  useEffect(() => {
    api("/events").then(setEvents).catch(() => {});
    if (localStorage.getItem("rh_token")) api("/me").then(setUser).catch(() => localStorage.removeItem("rh_token"));
  }, []);

  useEffect(() => {
    if (page === "bikes") api("/bikes").then(x => setBikes(x.length ? [...demoBikes, ...x.map(normalizeBike)] : demoBikes)).catch(() => setBikes(demoBikes));
  }, [page]);

  const logout = () => {
    localStorage.removeItem("rh_token");
    setUser(null);
    setPage("home");
  };

  return <>
    <Nav user={user} page={page} setPage={setPage} setModal={setModal} logout={logout}/>
    {page==="home" && <Home setPage={setPage} setModal={setModal}/>}
    {page==="bikes" && <Marketplace bikes={bikes} setModal={setModal} onDetails={setSelectedBike}/>}
    {page==="calculators" && <Calculators/>}
    {page==="fuel" && <Fuel user={user} setModal={setModal}/>}
    {page==="service" && <Service user={user} setModal={setModal}/>}
    {page==="events" && <Events events={events}/>}
    {page==="community" && <Community user={user} setModal={setModal}/>}
    {page==="admin" && <Admin user={user} setModal={setModal}/>}
    {page==="profile" && <Profile user={user}/>}
    <footer>© 2026 Ride Hub • AI Powered Smart Bike Community & Marketplace</footer>
    {modal === "sell" ? (user ? <SellModal close={()=>setModal(null)} onDone={()=>{setModal(null);setPage("bikes")}}/> : <AuthModal mode="login" close={()=>setModal(null)} onLogin={u=>{setUser(u);setModal(null)}}/>) : modal && <AuthModal mode={modal} close={()=>setModal(null)} onLogin={u=>{setUser(u);setModal(null)}}/>}
    {selectedBike && <DetailsModal bike={selectedBike} close={()=>setSelectedBike(null)}/>}
  </>;
}

function Nav({user,page,setPage,setModal,logout}) {
  return <nav>
    <div className="brand" onClick={()=>setPage("home")}>🏍️ RIDE<span>HUB</span></div>
    <div className="navlinks">
      {["home","bikes","calculators","fuel","service","events","community"].map((p,i)=><button key={p} className={page===p?"active":""} onClick={()=>setPage(p)}>{["Home","Buy Bikes","Calculators","Fuel","Service","Events","Community"][i]}</button>)}
    </div>
    <div className="navright">
      <button className="outline small" onClick={()=>setPage("bikes")}>Buy Bikes</button>
      <button className="primary small" onClick={()=>setModal("sell")}>Sell Bike</button>
      <button className="ghost" onClick={()=>window.location.href="/admin.html"}>Admin</button>
      {user ? <>
        <button className="profile" onClick={()=>setPage("profile")}>👤 {user.name.split(" ")[0]}</button>
        <button className="ghost" onClick={logout}>Logout</button>
      </> : <>
        <button className="ghost" onClick={()=>setModal("login")}>Login</button>
        <button className="primary small" onClick={()=>setModal("register")}>Register</button>
      </>}
    </div>
  </nav>;
}

function Home({setPage,setModal}) {
  return <main>
    <section className="hero">
      <div className="heroText">
        <div className="pill">⚡ ONE PLATFORM • EVERY RIDE</div>
        <h1>Your Ride.<br/><em>Your Community.</em><br/>Your Hub.</h1>
        <p>Buy bikes, compare categories, join rides, track service and fuel, calculate EMI and stay connected with fellow riders — all in one smart platform.</p>
        <div><button className="primary" onClick={()=>setPage("bikes")}>Explore Bikes →</button><button className="outline" onClick={()=>setModal("register")}>Join Ride Hub</button></div>
        <div className="stats"><span><b>10K+</b> Riders</span><span><b>2.5K+</b> Bikes</span><span><b>120+</b> Events</span></div>
      </div>
      <div className="heroBike"><div className="glow"></div><img src={demoBikes[2].image_url} alt="Sports motorcycle"/></div>
    </section>
    <section className="section">
      <div className="sectionHead"><div><span className="eyebrow">SMART TOOLS</span><h2>Everything a rider needs.</h2></div><button className="textbtn" onClick={()=>setPage("calculators")}>View all tools →</button></div>
      <div className="toolgrid">
        <Tool icon="🏍️" title="Bike Explorer" text="Browse sports, adventure, cruiser and naked bikes." page={()=>setPage("bikes")}/>
        <Tool icon="💳" title="EMI Calculator" text="Plan your dream bike with instant monthly EMI." page={()=>setPage("calculators")}/>
        <Tool icon="🛠️" title="Service Reminders" text="Keep service, PUC and insurance dates organized." page={()=>setPage("service")}/>
        <Tool icon="🤖" title="AI Recommendation" text="Find a bike matched to your budget and riding style." page={()=>setPage("bikes")}/>
      </div>
    </section>
    <section className="darkband"><div><span className="eyebrow">RIDING TOGETHER</span><h2>Not just a marketplace.<br/><em>It's a rider community.</em></h2></div><button className="primary" onClick={()=>setPage("community")}>Enter Community →</button></section>
  </main>;
}

function Tool({icon,title,text,page}) {
  return <div className="tool" onClick={page}><div className="toolicon">{icon}</div><h3>{title}</h3><p>{text}</p><span>Open tool →</span></div>;
}

function Marketplace({bikes,setModal,onDetails}) {
  const [q,setQ]=useState(""); const [max,setMax]=useState(""); const [cat,setCat]=useState("All");
  const filtered=useMemo(()=>bikes.filter(b=>
    `${b.title} ${b.brand} ${b.model}`.toLowerCase().includes(q.toLowerCase()) &&
    (!max || Number(b.price)<=Number(max)) && (cat==="All" || b.category===cat)
  ),[bikes,q,max,cat]);
  return <main className="page">
    <div className="pageHero"><div><span className="eyebrow">BIKE EXPLORER • MARKETPLACE</span><h1>Find your next machine.</h1><p>Explore sports, adventure, cruiser and naked bikes with clear details.</p></div><button className="primary" onClick={()=>setModal("sell")}>＋ Sell My Bike</button></div>
    <div className="filters">
      <input placeholder="Search brand, model..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select value={cat} onChange={e=>setCat(e.target.value)}><option>All</option><option>Sports</option><option>Adventure</option><option>Cruiser</option><option>Naked</option></select>
      <select><option>All Fuel</option><option>Petrol</option><option>Electric</option></select>
      <input type="number" placeholder="Max ₹" value={max} onChange={e=>setMax(e.target.value)}/>
    </div>
    <div className="categorychips">{["All","Sports","Adventure","Cruiser","Naked"].map(c=><button className={cat===c?"chip activechip":"chip"} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <div className="bikegrid">{filtered.map((raw,i)=>{const b=normalizeBike(raw); return <div className="bikecard" key={b.id||i}>
      <div className="bikeimg"><img src={b.image_url||imgFallback} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=imgFallback}} alt={b.title}/><span>{b.category||"Used"}</span></div>
      <div className="bikebody"><small>{b.year} • {b.city} • {b.fuel_type}</small><h3>{b.title}</h3><p className="mileage">⚡ {b.mileage||"—"} km/l average</p><div className="price">₹{Number(b.price).toLocaleString("en-IN")}</div><div className="twocol cardActions"><button className="outline full" onClick={()=>onDetails(b)}>View Details →</button><button className="primary full" onClick={()=>onDetails(b)}>Buy / Contact</button></div></div>
    </div>})}</div>
  </main>;
}

function DetailsModal({bike,close}) {
  return <div className="modalbg" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal wide detailsModal"><button className="x" onClick={close}>×</button><img className="detailimg" src={bike.image_url||imgFallback} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=imgFallback}} alt={bike.title}/><span className="eyebrow">{bike.category||"BIKE"} • {bike.year}</span><h2>{bike.title}</h2><p>{bike.description||"A great choice for everyday riding, weekend trips and motorcycle enthusiasts."}</p><div className="detailgrid"><div><small>Price</small><b>₹{Number(bike.price).toLocaleString("en-IN")}</b></div><div><small>Location</small><b>{bike.city}</b></div><div><small>Mileage</small><b>{bike.mileage||"—"} km/l</b></div><div><small>Fuel</small><b>{bike.fuel_type}</b></div></div><button className="primary full" onClick={close}>Close Details</button></div></div>;
}

function Calculators() {
  const [price,setPrice]=useState(180000),[down,setDown]=useState(30000),[rate,setRate]=useState(10),[months,setMonths]=useState(36);
  const p=Math.max(0,price-down),r=rate/1200,emi=r?(p*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1):p/months;
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">FINANCIAL TOOLS</span><h1>Calculate before you ride.</h1><p>Simple planning tools for smarter bike decisions.</p></div></div><div className="calcgrid"><div className="calculator"><div className="calcTitle"><span>💳</span><div><h2>Bike EMI Calculator</h2><p>Estimate your monthly loan payment.</p></div></div><Field label="Bike Price" value={price} set={setPrice}/><Field label="Down Payment" value={down} set={setDown}/><Field label="Interest Rate %" value={rate} set={setRate}/><Field label="Loan Period (months)" value={months} set={setMonths}/><div className="result"><small>Estimated Monthly EMI</small><strong>₹{Math.round(emi).toLocaleString("en-IN")}</strong><span>Loan amount ₹{p.toLocaleString("en-IN")} • {months} months</span></div></div><div className="calculator"><div className="calcTitle"><span>🛡️</span><div><h2>Insurance Estimator</h2><p>Quick indicative premium range.</p></div></div><Field label="Bike IDV / Value" value={price} set={setPrice}/><div className="result"><small>Indicative annual premium</small><strong>₹{Math.round(price*0.028+1200).toLocaleString("en-IN")}</strong><span>Actual premium varies by insurer, city and coverage.</span></div></div></div></main>;
}

function Field({label,value,set}) { return <label className="field"><span>{label}</span><input type="number" value={value} onChange={e=>set(Number(e.target.value))}/></label>; }

function Fuel({user,setModal}) {
  const [rows,setRows]=useState([]),[form,setForm]=useState({amount:"",litres:"",fuel_price:"",odometer:"",expense_date:new Date().toISOString().slice(0,10),notes:""});
  useEffect(()=>{if(user)api("/fuel").then(setRows).catch(()=>{})},[user]);
  if(!user)return <LoginBox icon="⛽" title="Fuel Expense Tracker" text="Login to save your fuel history and monthly riding costs." setModal={setModal}/>;
  const total=rows.reduce((s,r)=>s+Number(r.amount),0);
  const submit=async e=>{e.preventDefault();try{await api("/fuel",{method:"POST",body:JSON.stringify(form)});setRows(await api("/fuel"));setForm({...form,amount:"",litres:"",fuel_price:"",odometer:"",notes:""})}catch(e){alert(e.message)}};
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">PERSONAL FINANCE</span><h1>Know what your ride costs.</h1><p>Track fuel expenses and monthly riding cost.</p></div><div className="total"><small>Total logged</small><b>₹{total.toLocaleString("en-IN")}</b></div></div><div className="fuelgrid"><form className="panel" onSubmit={submit}><h2>Add Fuel Expense</h2><div className="twocol"><Field label="Amount ₹" value={form.amount} set={v=>setForm({...form,amount:v})}/><Field label="Litres" value={form.litres} set={v=>setForm({...form,litres:v})}/><Field label="Fuel Price ₹/L" value={form.fuel_price} set={v=>setForm({...form,fuel_price:v})}/><Field label="Odometer" value={form.odometer} set={v=>setForm({...form,odometer:v})}/></div><label className="field"><span>Date</span><input type="date" value={form.expense_date} onChange={e=>setForm({...form,expense_date:e.target.value})}/></label><label className="field"><span>Notes</span><input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label><button className="primary">Save Expense</button></form><div className="panel"><h2>Recent Expenses</h2>{rows.length?<div className="rows">{rows.map(r=><div className="row" key={r.id}><div><b>₹{Number(r.amount).toLocaleString("en-IN")}</b><small>{r.expense_date} {r.litres?`• ${r.litres} L`:""}</small></div><button onClick={async()=>{await api("/fuel/"+r.id,{method:"DELETE"});setRows(await api("/fuel"))}}>×</button></div>)}</div>:<p className="muted">No expenses yet.</p>}</div></div></main>;
}

function Service({user,setModal}) {
  const [rows,setRows]=useState([]),[form,setForm]=useState({title:"",type:"Service",due_date:""});
  const load=()=>api("/service-reminders").then(setRows).catch(()=>{});
  useEffect(()=>{if(user)load()},[user]);
  if(!user)return <LoginBox icon="🛠️" title="Service & Reminder Center" text="Login to save service, PUC and insurance reminders." setModal={setModal}/>;
  const add=async e=>{e.preventDefault();try{await api("/service-reminders",{method:"POST",body:JSON.stringify(form)});setForm({title:"",type:"Service",due_date:""});load()}catch(e){alert(e.message)}};
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">BIKE CARE</span><h1>Never miss bike maintenance.</h1><p>Keep service, PUC and insurance renewal dates in one place.</p></div></div><div className="fuelgrid"><form className="panel" onSubmit={add}><h2>Add Reminder</h2><label className="field"><span>Reminder title</span><input required placeholder="e.g. Full service" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label className="field"><span>Type</span><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Service</option><option>PUC</option><option>Insurance</option></select></label><label className="field"><span>Due date</span><input type="date" required value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/></label><button className="primary">Save Reminder</button></form><div className="panel"><h2>Your Reminders</h2>{rows.length?rows.map(r=><div className="serviceRow" key={r.id}><div><b>{r.title}</b><small>{r.type} • Due {r.due_date}</small></div><button onClick={async()=>{await api("/service-reminders/"+r.id,{method:"DELETE"});load()}}>×</button></div>):<p className="muted">No reminders yet. Add your next service date.</p>}</div></div></main>;
}

function LoginBox({icon,title,text,setModal}) { return <main className="page empty"><div className="emptybox"><div>{icon}</div><h2>{title}</h2><p>{text}</p><button className="primary" onClick={()=>setModal("login")}>Login to Continue</button></div></main>; }

function Events({events}) {
  const fallback=[{title:"Mumbai Riders Night",date:"2026-10-18",location:"Bandra, Mumbai",description:"Evening city ride and rider meet-up."},{title:"Western Ghats Ride",date:"2026-11-02",location:"Lonavala, Maharashtra",description:"Weekend group ride for registered riders."}];
  const list=events.length?events:fallback;
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">RIDE CALENDAR</span><h1>Events worth riding for.</h1><p>Rallies, rides and community meet-ups.</p></div></div><div className="eventgrid">{list.map((e,i)=><div className="eventcard" key={e.id||i}><div className="eventdate"><b>{new Date(e.date).toLocaleDateString("en-IN",{day:"2-digit"})}</b><small>{new Date(e.date).toLocaleDateString("en-IN",{month:"short"}).toUpperCase()}</small></div><div><span className="eyebrow">🏍️ RIDE EVENT</span><h2>{e.title}</h2><p>{e.description}</p><b>📍 {e.location}</b></div><button className="outline">Register</button></div>)}</div></main>;
}

function Community({user,setModal}) {
  const [posts,setPosts]=useState([]),[content,setContent]=useState("");
  useEffect(()=>{api("/posts").then(setPosts).catch(()=>{})},[]);
  const post=async()=>{if(!user)return setModal("login");if(!content.trim())return;try{await api("/posts",{method:"POST",body:JSON.stringify({content})});setContent("");setPosts(await api("/posts"))}catch(e){alert(e.message)}};
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">RIDER COMMUNITY</span><h1>Talk bikes. Share rides.</h1><p>Ask questions, share experience and connect with riders.</p></div></div><div className="community"><div className="compose"><textarea value={content} onChange={e=>setContent(e.target.value)} placeholder={user?"Share something with the community...":"Login to write a post"}/><button className="primary" onClick={post}>Post to Community</button></div>{posts.length?posts.map(p=><article className="post" key={p.id}><div className="avatar">{p.name?.[0]}</div><div><b>{p.name}</b><small>{new Date(p.created_at).toLocaleString()}</small><p>{p.content}</p></div></article>):<div className="panel"><h3>Be the first rider to post.</h3><p className="muted">The community feed will appear here once riders start sharing.</p></div>}</div></main>;
}

function Profile({user}) { return <main className="page"><div className="profileCard"><div className="bigavatar">{user?.name?.[0]}</div><span className="eyebrow">MY PROFILE</span><h1>{user?.name}</h1><p>{user?.email}</p><div className="profilechips"><span>Role: {user?.role}</span><span>Ride Hub Member</span></div></div></main>; }

function Admin({user,setModal}) {
  const [stats,setStats]=useState(null),[users,setUsers]=useState([]),[title,setTitle]=useState(""),[date,setDate]=useState(""),[location,setLocation]=useState("");
  useEffect(()=>{if(user?.role==="admin"){api("/admin/stats").then(setStats).catch(()=>{});api("/admin/users").then(setUsers).catch(()=>{})}},[user]);
  if(!user)return <LoginBox icon="🔐" title="Admin Dashboard" text="Login first. Your account must have the admin role to view management information." setModal={setModal}/>;
  if(user.role!=="admin")return <main className="page empty"><div className="emptybox"><div>🔐</div><h2>Admin access required</h2><p>Your account is currently a normal rider account. For the college demo, set its role to admin in MySQL, then logout and login again.</p><code>UPDATE users SET role='admin' WHERE email='{user.email}';</code></div></main>;
  const create=async()=>{try{await api("/events",{method:"POST",body:JSON.stringify({title,description:"Ride Hub community event",date,location})});alert("Event created");setTitle("");setDate("");setLocation("")}catch(e){alert(e.message)}};
  return <main className="page"><div className="pageHero"><div><span className="eyebrow">CONTROL CENTER</span><h1>Admin Dashboard</h1><p>User information, marketplace statistics and event management.</p></div></div><div className="adminstats">{Object.entries(stats||{users:"—",bikes:"—",events:"—",posts:"—"}).map(([k,v])=><div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div><div className="adminGrid"><div className="panel"><h2>Registered Users</h2><div className="tableWrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>City</th><th>Joined</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone||"—"}</td><td><span className="tag">{u.role}</span></td><td>{u.city||"—"}</td><td>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}</td></tr>)}</tbody></table></div></div><div className="panel"><h2>Create Event</h2><label className="field"><span>Title</span><input value={title} onChange={e=>setTitle(e.target.value)}/></label><label className="field"><span>Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="field"><span>Location</span><input value={location} onChange={e=>setLocation(e.target.value)}/></label><button className="primary" onClick={create}>Create Event</button></div></div></main>;
}

function SellModal({close,onDone}) {
  const [form,setForm]=useState({title:"",brand:"",model:"",year:"2024",price:"",city:"Mumbai",fuel_type:"Petrol",mileage:"",description:"",image_url:"",seller_phone:""}),[err,setErr]=useState(""),[loading,setLoading]=useState(false);
  const submit=async e=>{e.preventDefault();setLoading(true);setErr("");try{await api("/bikes",{method:"POST",body:JSON.stringify(form)});onDone()}catch(e){setErr(e.message)}finally{setLoading(false)}};
  return <div className="modalbg" onMouseDown={e=>e.target===e.currentTarget&&close()}><form className="modal wide" onSubmit={submit}><button type="button" className="x" onClick={close}>×</button><div className="modalbrand">🏍️ RIDE<span>HUB</span></div><h2>List your bike.</h2><p>Publish a marketplace listing for other riders.</p>{err&&<div className="error">{err}</div>}<div className="twocol">{["title","brand","model","year","price","city","fuel_type","mileage"].map(k=><input key={k} type={["year","price","mileage"].includes(k)?"number":"text"} placeholder={k.replace("_"," ")} required={["title","brand","model","price"].includes(k)} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}</div><input placeholder="Image URL (optional)" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})}/><input placeholder="Seller phone" value={form.seller_phone} onChange={e=>setForm({...form,seller_phone:e.target.value})}/><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="primary full" disabled={loading}>{loading?"Publishing...":"Publish Bike"}</button></form></div>;
}

function AuthModal({mode,close,onLogin}) {
  const [isReg,setIsReg]=useState(mode==="register"),[form,setForm]=useState({name:"",email:"",password:"",phone:"",city:""}),[loading,setLoading]=useState(false),[err,setErr]=useState("");
  const submit=async e=>{e.preventDefault();setLoading(true);setErr("");try{const d=await api(isReg?"/auth/register":"/auth/login",{method:"POST",body:JSON.stringify(form)});localStorage.setItem("rh_token",d.token);onLogin(d.user)}catch(e){setErr(e.message)}finally{setLoading(false)}};
  return <div className="modalbg" onMouseDown={e=>e.target===e.currentTarget&&close()}><form className="modal" onSubmit={submit}><button type="button" className="x" onClick={close}>×</button><div className="modalbrand">🏍️ RIDE<span>HUB</span></div><h2>{isReg?"Join the ride.":"Welcome back."}</h2><p>{isReg?"Create your free rider account.":"Login to access your personal tools."}</p>{err&&<div className="error">{err}</div>}{isReg&&<><input placeholder="Full name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></>}<input type="email" placeholder="Email address" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password (6+ characters)" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="primary full" disabled={loading}>{loading?"Please wait...":isReg?"Create Account":"Login"}</button><button type="button" className="switch" onClick={()=>{setIsReg(!isReg);setErr("")}}>{isReg?"Already have an account? Login":"New to Ride Hub? Create account"}</button></form></div>;
}

createRoot(document.getElementById("root")).render(<App/>);
