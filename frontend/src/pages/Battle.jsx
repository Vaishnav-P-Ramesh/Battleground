import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Info, RotateCcw, Settings, Play, CloudLightning, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function Battle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [opponent, setOpponent] = useState(null);

  // Get opponent data from navigation state
  useEffect(() => {
    if (location.state?.opponent) {
      setOpponent(location.state.opponent);
    } else {
      // Fallback opponent if not provided
      setOpponent({
        username: 'dark_coder',
        rating: 1520
      });
    }
  }, [location.state]);

  // ─── State Variables ───
  const [timeLeft, setTimeLeft] = useState(15 * 60);          // Battle countdown timer (15 minutes in seconds)
  const [oppProgress, setOppProgress] = useState(0);          // Opponent's test-case progress (0–100%)
  const [myProgress, setMyProgress] = useState(0);            // Your own test-case progress (0–100%)
  const [oppStatus, setOppStatus] = useState('Typing...');    // Opponent's current activity status label
  const [isThinking, setIsThinking] = useState(false);        // Whether opponent is "thinking" (paused) vs "typing"
  const [mockCodeLines, setMockCodeLines] = useState([40, 60, 80, 40]); // Widths for fake opponent code lines (visual)
  const [toasts, setToasts] = useState([]);                   // Array of toast notification objects {id, message, type}
  const [isSubmitting, setIsSubmitting] = useState(false);    // True while the "Submit" action is processing
  const [isRunning, setIsRunning] = useState(false);          // True while the "Run" action is processing

  // ─── Countdown Timer ───
  // Decrements timeLeft every second. When it hits 0, navigates to the result page (loss).
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          // Time's up → you lose automatically
          navigate('/result', { state: { isWin: false, timeTaken: '15:00' } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Cleanup: stop the timer if the component unmounts (e.g., navigating away)
    return () => clearInterval(timerInterval);
  }, [navigate]);

  // ─── Simulated Opponent Activity ───
  // Every 2 seconds, randomly toggle between "Thinking..." and "Typing..." to mimic
  // a real opponent. When "typing", add a new mock code line to simulate progress.
  // At 15s and 30s, the opponent "passes" test cases (progress jumps).
  useEffect(() => {
    const oppActivityInterval = setInterval(() => {
      const thinking = Math.random() > 0.7; // 30% chance of pausing to "think"
      setIsThinking(thinking);
      setOppStatus(thinking ? 'Thinking...' : 'Typing...');
      if (!thinking) {
        // Add a random-width code line to the mock editor
        const num = Math.floor(Math.random() * 4) * 20 + 20; // 20, 40, 60, or 80
        setMockCodeLines((prev) => {
          const next = [...prev, num];
          if (next.length > 8) next.shift(); // Keep at most 8 visible lines
          return next;
        });
      }
    }, 2000);

    // Simulate opponent passing test cases at timed intervals
    const t1 = setTimeout(() => {
      setOppProgress(33);
      addToast('Opponent passed 1/3 cases!', 'warning');
    }, 15000); // After 15 seconds
    const t2 = setTimeout(() => {
      setOppProgress(66);
      addToast('Opponent passed 2/3 cases!', 'warning');
    }, 30000); // After 30 seconds

    // Cleanup all intervals & timeouts
    return () => {
      clearInterval(oppActivityInterval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ─── Helper: Format seconds → "M:SS" display string ───
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Helper: Show a toast notification ───
  // Creates a toast with a unique ID, adds it to state, and auto-removes after 3s.
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // ─── Run Handler ───
  // Simulates running code against sample test cases (1.5s fake delay).
  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      addToast('Running on sample tests: Accepted!', 'success');
    }, 1500);
  };

  // ─── Submit Handler ───
  // Simulates submitting code against all test cases (2s fake delay).
  // On "success", calculates time taken and navigates to the result page (win).
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('All Test Cases Passed!', 'success');
      setMyProgress(100); // Full progress bar

      // Calculate how long the player took
      const secondsPassed = 15 * 60 - timeLeft;
      const mPass = Math.floor(secondsPassed / 60);
      const sPass = secondsPassed % 60;
      const timeTaken = `${mPass}:${sPass.toString().padStart(2, '0')}`;

      // Navigate to result page after a short victory delay
      setTimeout(() => {
        navigate('/result', { state: { isWin: true, timeTaken } });
      }, 2000);
    }, 2000);
  };

  // ═══════════════════════════════════════════
  //  JSX RENDER
  // ═══════════════════════════════════════════
  return (
    <section id="battle" className="screen active battle-screen-layout">

      {/* ─── Top Battle Header Bar ───
          Shows both players' avatars, the countdown timer, and a dual progress bar. */}
      <div className="battle-header glass-card">
        {/* Your avatar & name (left side) */}
        <div className="player-mini">
          <div className="avatar"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="You" /></div>
          <span>{user?.username || 'You'}</span>
        </div>
        
        {/* Center: countdown timer + dual progress bar */}
        <div className="timer-container">
          <div className="time-left">{formatTime(timeLeft)}</div>
          <div className="progress-bar main-progress">
            {/* Green bar growing from left = your progress */}
            <div className="progress-fill you-progress" style={{ width: `${myProgress}%` }}></div>
            {/* Red bar growing from right = opponent's progress */}
            <div className="progress-fill opponent-progress" style={{ width: `${oppProgress}%` }}></div>
          </div>
        </div>
        
        {/* Opponent avatar & name (right side, reversed layout) */}
        <div className="player-mini opp">
          <span>{opponent?.username || 'Opponent'}</span>
          <div className="avatar"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opponent?.username || 'opponent'}&backgroundColor=ef4444`} alt="Opp" /></div>
        </div>
      </div>

      {/* ─── Main Battle Area ─── */}
      <div className="battle-layout">

        {/* ─── Problem Description Panel ───
            Displays the coding problem title, description, and sample test cases. */}
        <div className="problem-panel glass-card">
          <div className="problem-header">
            <h3 className="problem-title"><span className="accent">[Hard]</span> Merge K Sorted Lists</h3>
            <button className="btn-secondary btn-sm"><Info size={16} /> Details</button>
          </div>
          <div className="problem-desc mt-2">
            <p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order. <em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>
            <div className="test-cases mt-2">
              <div className="tc"><strong>Input:</strong> lists = [[1,4,5],[1,3,4],[2,6]]</div>
              <div className="tc"><strong>Output:</strong> [1,1,2,3,4,4,5,6]</div>
            </div>
          </div>
        </div>

        {/* ─── Split Code Editors (You vs Opponent) ─── */}
        <div className="editors-split">

          {/* ── YOUR Code Editor (left pane) ── */}
          <div className="editor-pane my-editor glass-card">
            {/* Header: language selector + utility buttons */}
            <div className="pane-header">
              <select className="lang-select">
                <option>C++</option>
                <option>Python</option>
                <option>Java</option>
              </select>
              <div className="pane-actions">
                <button className="btn-icon"><RotateCcw size={18} /></button>   {/* Reset code */}
                <button className="btn-icon"><Settings size={18} /></button>    {/* Editor settings */}
              </div>
            </div>
            {/* Code editing area: line numbers + textarea */}
            <div className="editor-area">
              <div className="line-numbers">
                {Array.from({length: 10}).map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <textarea className="code-input" spellCheck="false" defaultValue={`class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here...\n    }\n};`} />
            </div>
            {/* Footer: Run & Submit buttons */}
            <div className="pane-footer">
              <button className="btn-secondary btn-sm" onClick={handleRun} disabled={isRunning}>
                {isRunning ? <Loader size={16} className="spin" /> : <Play size={16} />} Run
              </button>
              <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader size={16} className="spin" /> : <CloudLightning size={16} />} SUBMIT
              </button>
            </div>
          </div>

          {/* ── OPPONENT'S Code Editor (right pane, read-only mock) ── */}
          <div className="editor-pane opponent-editor glass-card">
            {/* Header: shows opponent's language + typing/thinking status */}
            <div className="pane-header opponent-header">
              <div className="lang-display">C++</div>
              {/* Status badge changes color: yellow when typing, grey when thinking */}
              <div className="status-badge typing" style={{ borderColor: isThinking ? 'rgba(255,255,255,0.2)' : 'var(--warning)', color: isThinking ? 'var(--text-secondary)' : 'var(--warning)' }}>
                {!isThinking && <span className="dot" style={{ background: 'var(--warning)' }}></span>}
                {oppStatus}
              </div>
            </div>
            {/* Mock code lines: animated colored bars that simulate typing activity */}
            <div className="editor-area opponent-area">
              <div className="line-numbers">
                {Array.from({length: 6}).map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <div className="mock-code-lines">
                {mockCodeLines.map((w, i) => (
                  <div key={i} className={`code-line w-${w} mt-2`}></div>
                ))}
              </div>
            </div>
            {/* Footer: shows how many test cases the opponent has passed */}
            <div className="pane-footer opp-footer">
              <div className="opp-stats">
                <span>Opponent Progress: <span className="accent">{Math.floor((oppProgress / 100) * 3)}/3</span> Cases Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ─── Toast Notifications ───
          Fixed-position container in the bottom-right.
          Each toast auto-disappears after 3 seconds. */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' && <CheckCircle size={20} />}
            {t.type === 'error' && <XCircle size={20} />}
            {(t.type === 'warning' || t.type === 'info') && <AlertCircle size={20} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Battle;
