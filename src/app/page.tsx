import { ArrowDownRight, Github, Linkedin, Mail, MessageCircle, Sparkles, MoveUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/reveal";
import FloatingNav from "@/components/floating-nav";
import MobileTabBar from "@/components/mobile-tab-bar";
import ProjectsCarousel from "@/components/projects-carousel";


type Profile = {
  full_name: string; headline: string; bio: string; status: string;
  institution: string | null; location: string | null; email: string | null;
  avatar_url: string | null; cv_url: string | null; github_url: string | null;
  linkedin_url: string | null; whatsapp_phone: string | null;
};
type Project = {
  id: string; title: string; description: string; image_url: string | null;
  live_url: string | null; github_url: string | null; technologies: string[] | null;
};

const fallback: Profile = {
  full_name: "Muhammad Rayhan Arfadiansyah",
  headline: "Building digital experiences, from frontend to backend.",
  bio: "I'm a Full Stack Developer and Information Systems student who enjoys turning ideas into thoughtful, functional digital products. I love exploring technology, solving problems, and building things that make an impact.",
  status: "student", institution: "Information Systems Student", location: "Indonesia",
  email: null, avatar_url: null, cv_url: null, github_url: null,
  linkedin_url: "https://www.linkedin.com/in/muhammad-rayhan-741228401",
  whatsapp_phone: null
};

export default async function Home() {
  let profile = fallback;
  let projects: Project[] = [];
  try {
    const supabase = await createClient();
    const [{ data: p }, { data: items }] = await Promise.all([
      supabase.from("profiles").select("*").eq("is_public", true).limit(1).maybeSingle(),
      supabase.from("projects").select("*").eq("is_published", true).order("is_featured", { ascending: false }).order("created_at", { ascending: false })
    ]);
    if (p) profile = p as Profile;
    if (items) projects = items as Project[];
  } catch { /* Render the starter profile until Supabase is configured. */ }

  const statusLabel: Record<string, string> = {
    student: "Information Systems Student", graduated: "Recently graduated",
    working: "Currently working", freelancer: "Available for freelance"
  };
  const whatsappDigits = (profile.whatsapp_phone ?? "").replace(/\D/g, "");
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;
  const safeFileName = `CV-${profile.full_name.replace(/[^a-z0-9]+/gi, "-")}.pdf`;

  return <main id="home" className="site-shell">
    
<div className="ambient ambient-one" />
<div className="ambient ambient-two" />
<FloatingNav />
<MobileTabBar />
<section className="container hero-section">
      <Reveal className="hero-copy">
        <div className="status-pill"><span className="status-dot" /><Sparkles size={14}/> {statusLabel[profile.status] ?? "Open to opportunities"}</div>
        <p className="hero-kicker">HELLO, I&apos;M {profile.full_name.toUpperCase()}</p>
        <h1>{profile.headline}</h1>
        <p className="hero-description">{profile.bio}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">Explore my work <ArrowDownRight size={17}/></a>
          {profile.cv_url && <a className="btn btn-ghost" href={profile.cv_url} download={safeFileName}>Download CV <MoveUpRight size={15}/></a>}
        </div>
        <div className="hero-meta">
          {profile.location && <span><i className="meta-line"/> {profile.location}</span>}
          {profile.institution && <span><i className="meta-line"/> {profile.institution}</span>}
        </div>
      </Reveal>
      <Reveal className="hero-visual" delay={140}>
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        <div className="portrait-card">
          {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="portrait-image"/> :
            <div className="portrait-placeholder"><span>{profile.full_name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><small>FULL STACK<br/>DEVELOPER</small></div>}
          <div className="portrait-caption"><span className="caption-label">CURRENT FOCUS</span><strong>Building for the web<span>.</span></strong></div>
        </div>
        <div className="floating-chip chip-top"><span className="chip-spark">✳</span> Creative problem solver</div>
        <div className="floating-chip chip-bottom"><span className="chip-pulse"/> Open to opportunities</div>
        <div className="visual-index">01 — 04</div>
      </Reveal>
    </section>

    <section id="about" className="section section-border">
      <Reveal className="container about-grid">
        <div><div className="section-label">01 ABOUT ME</div><h2>Curiosity meets<br/><span className="gradient-text">craft & code.</span></h2></div>
        <div className="about-copy"><p>{profile.bio}</p><p className="muted-copy">I’m interested in creating digital experiences that feel intuitive, work reliably, and solve real problems — from the first line of code to the final detail.</p></div>
      </Reveal>
    </section>

    <section id="journey" className="section">
      <Reveal className="container">
        <div className="section-label">02 MY JOURNEY</div>
        <div className="section-heading-row"><h2>Where I am <span className="gradient-text">right now.</span></h2><span className="section-aside">A little snapshot of my path</span></div>
        <div className="journey-card">
          <div className="journey-icon">✳</div>
          <div className="journey-main"><span className="journey-status">{statusLabel[profile.status] ?? "Current status"}</span><h3>{profile.institution ?? "Add your institution or company"}</h3><p>This section is managed from my private admin dashboard.</p></div>
          <span className="journey-tag">{profile.status}</span>
        </div>
      </Reveal>
    </section>

    <section id="projects" className="section projects-section">
      <Reveal className="container">
        <div className="section-label">03 SELECTED WORK</div>
        <div className="section-heading-row"><h2>Things I’ve <span className="gradient-text">built.</span></h2><span className="section-aside">{projects.length.toString().padStart(2,"0")} PROJECTS</span></div>
        {projects.length ? (
  <ProjectsCarousel projects={projects} />
) : (
  <div className="empty-projects">
    <div className="empty-icon">↗</div>
    <h3>Good things are in progress.</h3>
    <p>My selected projects will show up here soon. Stay tuned.</p>
  </div>
)}
      </Reveal>
    </section>

    <section id="contact" className="section contact-section">
      <Reveal className="container">
        <div className="contact-panel">
          <div className="contact-glow"/>
          <div className="section-label">04 GET IN TOUCH</div>
          <h2>Have a good idea?<br/><span className="gradient-text">Let’s build it.</span></h2>
          <p>Open to conversations, opportunities, and collaborations. If you have something interesting in mind, I’d love to hear about it.</p>
          <div className="contact-actions">
            {whatsappUrl && <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Chat via WhatsApp</a>}
            {profile.email && <a className="btn btn-ghost" href={`mailto:${profile.email}`}><Mail size={16}/> Email me</a>}
            {profile.github_url && <a className="btn btn-ghost" href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>}
            {profile.linkedin_url && <a className="btn btn-ghost" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}
            {profile.cv_url && <a className="btn btn-ghost" href={profile.cv_url} download={safeFileName}><MoveUpRight size={15}/> Download CV</a>}
          </div>
        </div>
      </Reveal>
    </section>
    <footer className="container site-footer"><span>© {new Date().getFullYear()} {profile.full_name}</span><span>R Studio Web <b>✳</b></span></footer>
  </main>;
}
