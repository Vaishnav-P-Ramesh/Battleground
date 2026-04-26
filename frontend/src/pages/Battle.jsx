import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Info, RotateCcw, Settings, Play, CloudLightning, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function Battle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [opponent, setOpponent] = useState(null);
  const [battleId, setBattleId] = useState(null);

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
  }, [location.state]);

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [oppProgress, setOppProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [oppStatus, setOppStatus] = useState('Typing...');
  const [isThinking, setIsThinking] = useState(false);
  const [mockCodeLines, setMockCodeLines] = useState([40, 60, 80, 40]);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);

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

  // Listen for opponent submission
  useEffect(() => {
    if (!socket) return;

    socket.on('opponent_submitted', (data) => {
      setOppProgress(100);
      setOppStatus('Submitted!');
      addToast(`${data.username} submitted solution!`, 'warning');
      setBattleEnded(true);
      
      // End battle after 2 seconds
      setTimeout(() => {
        const secondsPassed = 15 * 60 - timeLeft;
        const mPass = Math.floor(secondsPassed / 60);
        const sPass = secondsPassed % 60;
        const timeTaken = `${mPass}:${sPass.toString().padStart(2, '0')}`;
        
        navigate('/result', {
          state: {
            isWin: myProgress === 100,
            timeTaken,
            battleId
          }
        });
      }, 2000);
    });

    socket.on('battle_result', (data) => {
      const isWin = data.winnerId === user?.id;
      const secondsPassed = 15 * 60 - timeLeft;
      const mPass = Math.floor(secondsPassed / 60);
      const sPass = secondsPassed % 60;
      const timeTaken = `${mPass}:${sPass.toString().padStart(2, '0')}`;

      navigate('/result', {
        state: {
          isWin,
          timeTaken,
          battleId
        }
      });
    });

    return () => {
      socket.off('opponent_submitted');
      socket.off('battle_result');
    };
  }, [socket, timeLeft, myProgress, user?.id, battleId, navigate]);

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
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      addToast('Running on sample tests: Accepted!', 'success');
    }, 1500);
  };

  const handleSubmit = () => {
    if (battleEnded) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('All Test Cases Passed!', 'success');
      setMyProgress(100);
      setBattleEnded(true);

      const secondsPassed = 15 * 60 - timeLeft;
      const mPass = Math.floor(secondsPassed / 60);
      const sPass = secondsPassed % 60;
      const timeTaken = `${mPass}:${sPass.toString().padStart(2, '0')}`;

      // Send submission to opponent via Socket.IO
      if (socket && battleId) {
        socket.emit('code_submitted', {
          battleId,
          userId: user?.id,
          username: user?.username
        });

        socket.emit('battle_end', {
          battleId,
          winnerId: user?.id
        });
      }

      setTimeout(() => {
        navigate('/result', {
          state: {
            isWin: true,
            timeTaken,
            battleId
          }
        });
      }, 2000);
    }, 2000);
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
              <textarea className="code-input" spellCheck="false" defaultValue={`class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here...\n    }\n};`} />
            </div>
            <div className="pane-footer">
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
                <span>Opponent Progress: <span className="accent">{Math.floor((oppProgress / 100) * 3)}/3</span> Cases Passed</span>
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
