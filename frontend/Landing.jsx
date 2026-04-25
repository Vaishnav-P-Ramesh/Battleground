import { useNavigate } from 'react-router-dom';
import { Swords, Zap, Users, Trophy, Code, ArrowRight, ChevronDown } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ─── Top Nav ─── */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <Swords className="accent-icon" />
          <span>DSA BATTLEGROUND</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <button className="btn-ghost-nav" onClick={() => navigate('/auth')}>
            Play Now
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-line-dim">TURN CODE</span>
            <span className="hero-line-dim">INTO</span>
            <span className="hero-line-accent">COMBAT</span>
          </h1>
          <p className="hero-subtitle">
            Real-time 1v1 coding duels against real players.
          </p>
          <button className="btn-hero" onClick={() => navigate('/dashboard')}>
            <Zap size={22} /> BATTLE NOW
          </button>
        </div>

        <div className="hero-visual">
          {/* Floating code card mockup */}
          <div className="floating-card card-1">
            <div className="fc-header">
              <span className="fc-dot green"></span>
              <span className="fc-dot yellow"></span>
              <span className="fc-dot red"></span>
              <span className="fc-lang">C++</span>
            </div>
            <div className="fc-body">
              <code><span className="kw">class</span> Solution {'{'}</code>
              <code>  <span className="fn">mergeKLists</span>(<span className="tp">vector</span>&lt;...&gt;) {'{'}</code>
              <code>    <span className="kw">if</span> (lists.<span className="fn">empty</span>()) <span className="kw">return</span> <span className="nl">nullptr</span>;</code>
              <code>    <span className="cm">// Your solution...</span></code>
              <code>  {'}'}</code>
              <code>{'}'};</code>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="fc-status">
              <span className="status-ok">✓ All Tests Passed</span>
              <span className="status-time">Runtime: 12ms</span>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="fc-vs">
              <div className="fc-player">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="P1" />
                <span>2150</span>
              </div>
              <span className="fc-vs-text">VS</span>
              <div className="fc-player">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dark_coder&backgroundColor=ef4444" alt="P2" />
                <span>2185</span>
              </div>
            </div>
          </div>
        </div>

        <a href="#features" className="scroll-hint">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ─── Features Section ─── */}
      <section className="landing-features" id="features">
        <h2 className="section-title">
          <span className="dim">WHY</span> <span className="accent">BATTLEGROUND</span>
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Swords size={32} /></div>
            <h3>1v1 Battles</h3>
            <p>Go head-to-head with opponents of similar skill. Solve problems faster to win.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Users size={32} /></div>
            <h3>Skill Matching</h3>
            <p>ELO-based matchmaking ensures fair and competitive matches every time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Trophy size={32} /></div>
            <h3>Live Contests</h3>
            <p>Join weekly tournaments and blitz events. Climb the global leaderboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Code size={32} /></div>
            <h3>Real-Time Editor</h3>
            <p>Write, run, and submit code in a split-screen battle interface with live opponent activity.</p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="landing-how" id="how-it-works">
        <h2 className="section-title">
          <span className="dim">HOW IT</span> <span className="accent">WORKS</span>
        </h2>
        <div className="steps-row">
          <div className="step-item">
            <div className="step-num">01</div>
            <h4>Find a Match</h4>
            <p>Hit "Battle Now" and our matchmaking pairs you with an opponent of similar rating.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={28} /></div>
          <div className="step-item">
            <div className="step-num">02</div>
            <h4>Solve & Submit</h4>
            <p>Both players receive the same problem. Code your solution and submit before time runs out.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={28} /></div>
          <div className="step-item">
            <div className="step-num">03</div>
            <h4>Win & Rank Up</h4>
            <p>The fastest correct solution wins. Your ELO rating updates and you climb the leaderboard.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="landing-cta">
        <h2>READY TO <span className="accent">COMPETE</span>?</h2>
        <p>Join thousands of coders in real-time battles. No signup required to start.</p>
        <button className="btn-hero" onClick={() => navigate('/dashboard')}>
          <Zap size={22} /> ENTER BATTLEGROUND
        </button>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <Swords size={20} className="accent-icon" />
          <span>DSA BATTLEGROUND</span>
        </div>
        <p>© 2026 DSA Battleground. Built for competitive minds.</p>
      </footer>
    </div>
  );
}

export default Landing;
