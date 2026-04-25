import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 Replace with your keys
const supabase = createClient(
  "YOUR_SUPABASE_URL=https://zoxofkykswacnikgclmh.supabase.co",
  "YOUR_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveG9rZnlrc3dhY25pa2djbG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDQ1OTQsImV4cCI6MjA5MjYyMDU5NH0.Ih7_9ga_BefqHYYCdJP7xWvUJPAf3i7l087IiQ3eLZA"
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Login successful ✅");
      } else {
        // 🆕 SIGN UP
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Signup successful 🎉 Check your email");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p style={{ marginTop: 10 }}>{message}</p>

        <p style={{ marginTop: 20 }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            style={styles.toggle}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 Simple styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    padding: 30,
    borderRadius: 10,
    background: "#1e293b",
    color: "white",
    width: 300,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 5,
    border: "none",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  toggle: {
    color: "#3b82f6",
    cursor: "pointer",
    marginLeft: 5,
  },
};