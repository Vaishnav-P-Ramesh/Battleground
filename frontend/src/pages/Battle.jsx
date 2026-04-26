import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Info, RotateCcw, Settings, Play, CloudLightning, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function Battle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const codeRef = useRef(null);
  const [opponent, setOpponent] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [maxTestCases, setMaxTestCases] = useState(3);

  // Get opponent data from navigation state
  useEffect(() => {
    if (location.state?.opponent) {
      setOpponent(location.state.opponent);
    } else {
      setOpponent({ username: 'dark_coder', rating: 1520 });
    }
    if (location.state?.battleId) {
      setBattleId(location.state.battleId);
    }
    if (location.state?.question) {
      setQuestion(location.state.question);
      setMaxTestCases(location.state.question.testCaseCount || 3);
    }
  }, [location.state]);

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [oppProgress, setOppProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [myTestCases, setMyTestCases] = useState(0);
  const [oppTestCases, setOppTestCases] = useState(0);
  const [oppStatus, setOppStatus] = useState('Typing...');
  const [isThinking, setIsThinking] = useState(false);
  const [mockCodeLines, setMockCodeLines] = useState([40, 60, 80, 40]);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [codeSubmittedOnce, setCodeSubmittedOnce] = useState(false);

  // Listen for get_battle_details response from server
  useEffect(() => {
    if (!socket || !battleId) return;

    const handleBattleDetails = (data) => {
      if (data.question) {
        setQuestion(data.question);
        setMaxTestCases(data.question.testCaseCount || 3);
      }
    };

    socket.on('battle_details', handleBattleDetails);
    
    // Request battle details from server to ensure we get the correct question
    socket.emit('get_battle_details', { battleId });

    return () => {
      socket.off('battle_details', handleBattleDetails);
    };
  }, [socket, battleId]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          navigate('/result', { state: { isWin: false, timeTaken: '15:00' } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [navigate]);

  useEffect(() => {
    const oppActivityInterval = setInterval(() => {
      const thinking = Math.random() > 0.7;
      setIsThinking(thinking);
      setOppStatus(thinking ? 'Thinking...' : 'Typing...');
      if (!thinking) {
        const num = Math.floor(Math.random() * 4) * 20 + 20;
        setMockCodeLines((prev) => {
          const next = [...prev, num];
          if (next.length > 8) next.shift();
          return next;
        });
      }
    }, 2000);

    return () => clearInterval(oppActivityInterval);
  }, []);

  // Listen for opponent submission and battle result
  useEffect(() => {
    if (!socket) return;

    socket.on('opponent_submitted', (data) => {
      setOppProgress(100);
      setOppTestCases(data.testCasesPassed || 0);
      setOppStatus('Submitted!');
      addToast(`${data.username} submitted (${data.testCasesPassed}/${maxTestCases} cases)!`, 'warning');
    });

    socket.on('battle_result', (data) => {
      const isWin = data.isWin;
      const secondsPassed = 15 * 60 - timeLeft;
      const mPass = Math.floor(secondsPassed / 60);
      const sPass = secondsPassed % 60;
      const timeTaken = `${mPass}:${sPass.toString().padStart(2, '0')}`;

      // Navigate to result with winner determination from backend
      setTimeout(() => {
        navigate('/result', {
          state: {
            result: isWin ? 'victory' : 'defeat',
            timeTaken,
            battleId,
            yourTestCases: data.yourTestCases,
            opponentTestCases: data.opponentTestCases,
            opponentName: data.opponent?.username
          }
        });
      }, 2000);
    });

    return () => {
      socket.off('opponent_submitted');
      socket.off('battle_result');
    };
  }, [socket, timeLeft, user?.id, battleId, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleRun = () => {
    // Check if there's actual code (not just comments/template)
    const code = codeRef.current?.value || '';
    
    // Remove all comments
    let cleanCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    
    // Remove all whitespace and common template keywords
    cleanCode = cleanCode
      .replace(/\s+/g, '')
      .replace(/class|Solution|public|private|protected|void|int|vector|ListNode|function|const|let|var|return/g, '');
    
    // If the remaining code is empty or too short, it's just a template
    if (!cleanCode || cleanCode.length < 5) {
      addToast('Please write actual implementation code first!', 'error');
      return;
    }

    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Simulate test cases passed (0-maxTestCases)
      const testsPassed = Math.floor(Math.random() * (maxTestCases + 1));
      setMyTestCases(testsPassed);
      if (testsPassed === maxTestCases) {
        addToast(`Running on sample tests: All ${testsPassed}/${maxTestCases} Passed!`, 'success');
      } else {
        addToast(`Running on sample tests: ${testsPassed}/${maxTestCases} Passed`, 'warning');
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (battleEnded || codeSubmittedOnce || !socket || !battleId) return;
    
    setIsSubmitting(true);
    setMyProgress(100);
    setBattleEnded(true);
    setCodeSubmittedOnce(true);

    addToast(`Solution submitted: ${myTestCases}/${maxTestCases} cases!`, 'success');

    // Send submission to backend - backend will determine winner
    socket.emit('code_submitted', {
      battleId,
      userId: user?.id,
      username: user?.username,
      testCasesPassed: myTestCases
    });

    // Emit battle_end to trigger winner determination on backend
    socket.emit('battle_end', {
      battleId,
      userId: user?.id,
      testCasesPassed: myTestCases
    });

    setIsSubmitting(false);
  };

  return (
    <section id="battle" className="screen active battle-screen-layout">
      <div className="battle-header glass-card">
        <div className="player-mini">
          <div className="avatar"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="You" /></div>
          <span>{user?.username || 'You'}</span>
        </div>
        
        <div className="timer-container">
          <div className="time-left">{formatTime(timeLeft)}</div>
          <div className="progress-bar main-progress">
            <div className="progress-fill you-progress" style={{ width: `${myProgress}%` }}></div>
            <div className="progress-fill opponent-progress" style={{ width: `${oppProgress}%` }}></div>
          </div>
        </div>
        
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
            <h3 className="problem-title">
              <span className="accent">[{question?.difficulty || 'Hard'}]</span> {question?.title || 'Loading...'}
            </h3>
            <button className="btn-secondary btn-sm"><Info size={16} /> Details</button>
          </div>
          <div className="problem-desc mt-2">
            <p>{question?.description || 'Loading problem details...'}</p>
            {question?.examples && (
              <div className="test-cases mt-2">
                <div className="tc"><strong>Input:</strong> {question.examples.input}</div>
                <div className="tc"><strong>Output:</strong> {question.examples.output}</div>
              </div>
            )}
          </div>
        </div>

        <div className="editors-split">
          <div className="editor-pane my-editor glass-card">
            <div className="pane-header">
              <select className="lang-select">
                <option>C++</option>
                <option>Python</option>
                <option>Java</option>
              </select>
              <div className="pane-actions">
                <button className="btn-icon"><RotateCcw size={18} /></button>
                <button className="btn-icon"><Settings size={18} /></button>
              </div>
            </div>
            <div className="editor-area">
              <div className="line-numbers">
                {Array.from({length: 10}).map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <textarea ref={codeRef} className="code-input" spellCheck="false" defaultValue={`class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here...\n    }\n};`} />
            </div>
            <div className="pane-footer">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Test Cases: <span className="accent">{myTestCases}/{maxTestCases}</span>
              </div>
              <button className="btn-secondary btn-sm" onClick={handleRun} disabled={isRunning}>
                {isRunning ? <Loader size={16} className="spin" /> : <Play size={16} />} Run
              </button>
              <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader size={16} className="spin" /> : <CloudLightning size={16} />} SUBMIT
              </button>
            </div>
          </div>

          <div className="editor-pane opponent-editor glass-card">
            <div className="pane-header opponent-header">
              <div className="lang-display">C++</div>
              <div className="status-badge typing" style={{ borderColor: isThinking ? 'rgba(255,255,255,0.2)' : 'var(--warning)', color: isThinking ? 'var(--text-secondary)' : 'var(--warning)' }}>
                {!isThinking && <span className="dot" style={{ background: 'var(--warning)' }}></span>}
                {oppStatus}
              </div>
            </div>
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
            <div className="pane-footer opp-footer">
              <div className="opp-stats">
                <span>Opponent: <span className="accent">{oppTestCases}/{maxTestCases}</span> Cases Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
