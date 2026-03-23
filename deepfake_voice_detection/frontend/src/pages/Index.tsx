import { useState, useRef } from "react";
const Index = () => {
  const [activeTab, setActiveTab] = useState("voice");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type.startsWith("audio/") || selectedFile.name.endsWith(".flac")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid audio file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "#3182ce";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = "#cbd5e0";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "#cbd5e0";
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      console.log("Starting upload of file:", file.name, "Size:", file.size, "Type:", file.type);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze audio");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      console.error("Error:", errorMsg);
      setError(`Error: ${errorMsg}. Make sure the backend server is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deepfake-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          Deepfake Detection
        </a>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li>
            <span className="nav-dropdown">
              Deepfake Detection Tools ▾
            </span>
          </li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-title">Deepfake Voice Detection Online</h1>
        <p className="hero-subtitle">
          Wondering if that voice clip is fake? Upload it now. Our AI Deepfake Voice Detection will check it
          in real-time and show you which parts are real, which might be fake, and how sure we are.
        </p>
        <div className="tab-switcher">
          {["image", "video", "voice"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </section>
      <div className="upload-section">
        <div
          className="upload-box"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.flac"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="upload-icon">☁️</div>
          <p className="upload-text">
            {file ? `Selected: ${file.name}` : "Drag & drop an audio file or click"}
          </p>
          <p className="upload-formats">WAV, MP3, AAC, OGG, FLAC up to 20MB</p>
        </div>
      </div>
      {error && (
        <div
          style={{
            maxWidth: "1000px",
            margin: "16px auto",
            padding: "16px",
            background: "#fed7d7",
            color: "#c53030",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #fc8181",
          }}
        >
          {error}
        </div>
      )}
      {result && (
        <div
          style={{
            maxWidth: "1000px",
            margin: "24px auto",
            padding: "32px",
            border: "2px solid #38a169",
            borderRadius: "12px",
            background: "#f0fff4",
          }}
        >
          <h2 style={{ color: "#22543d", marginBottom: "20px" }}>✓ Analysis Complete</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#718096", marginBottom: "8px" }}>Prediction</p>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: result.prediction === "Real Voice" ? "#22863a" : "#cb2431",
                }}
              >
                {result.prediction}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#718096", marginBottom: "8px" }}>Confidence</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2b6cb0" }}>{result.accuracy}</p>
            </div>
          </div>
          <p style={{ marginTop: "16px", fontSize: "12px", color: "#718096" }}>
            Model: {result.model}
          </p>
        </div>
      )}
      <div className="social-proof">
        <div className="avatar-stack">
          <div className="avatar">A</div>
          <div className="avatar" style={{ background: "linear-gradient(135deg, #f6ad55, #ed8936)" }}>B</div>
          <div className="avatar" style={{ background: "linear-gradient(135deg, #68d391, #38a169)" }}>C</div>
          <div className="avatar" style={{ background: "linear-gradient(135deg, #fc8181, #e53e3e)" }}>D</div>
        </div>
        <span className="stars">★★★★★</span>
        <span className="proof-text">18,000+ audio files verified successfully</span>
      </div>
      <div className="analyze-wrapper">
        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !file}>
          {loading ? "Analyzing..." : "Analyze Audio"}
        </button>
      </div>
      <p className="example-voices">No audio? Try with example voices:</p>
      {/* HOW TO USE SECTION */}
      <section className="how-to-section">
        <h2 className="section-title">How to Use Deepfake Voice Detection</h2>
        <p className="section-subtitle">
          It's fast and super simple. Just follow a few easy steps to check if your audio is real or fake.
          No tech skills needed—our AI handles the hard stuff. You'll get clear results you can download and share.
        </p>
        <div className="how-to-content">
          <div className="how-to-steps">
            <div className="step">
              <div className="step-header">
                <span className="step-icon">⬆️</span>
                <h3 className="step-title">Step 1: Upload Your Audio File</h3>
              </div>
              <p className="step-desc">
                Click the upload button to select a voice recording from your device. We support most formats like MP3, WAV, and M4A.
                Make sure the audio is clear and at least a few seconds long so the AI can analyze it properly.
              </p>
            </div>
            <div className="step">
              <div className="step-header">
                <span className="step-icon">🤖</span>
                <h3 className="step-title">Step 2: Detect Voice</h3>
              </div>
              <p className="step-desc">
                Once your file is uploaded, our AI instantly starts analyzing the audio. It checks pitch, pauses,
                background noise, and more. In about 10—30 seconds, we'll tell you how likely the voice is real or generated by AI.
              </p>
            </div>
            <div className="step">
              <div className="step-header">
                <span className="step-icon">📊</span>
                <h3 className="step-title">Step 3: Review the Detection Report</h3>
              </div>
              <p className="step-desc">
                You'll see a simple result: a score showing how real or fake the voice sounds. We also highlight suspicious
                time points so you know exactly where problems might be. You get both a quick summary and a full detailed report.
              </p>
            </div>
            <div className="step">
              <div className="step-header">
                <span className="step-icon">⬇️</span>
                <h3 className="step-title">Step 4: Download or Share Your Results</h3>
              </div>
              <p className="step-desc">
                Need to keep a record or show someone else? Just click to download the report as a file.
                You can also copy a shareable link if you want to send it to a colleague.
              </p>
            </div>
          </div>
          <div className="how-to-visual">
            <div className="visual-step">
              <div className="visual-number">1</div>
              <span className="visual-label">Upload</span>
            </div>
            <div className="visual-upload-box">
              <div className="upload-icon">☁️</div>
              <p>Drag & drop an audio file or click</p>
              <p>WAV, MP3, AAC, OGG, FLAC up to 20MB</p>
            </div>
            <div className="visual-step">
              <div className="visual-number">2</div>
              <span className="visual-label">Submit</span>
            </div>
            <div className="visual-submit-box">
              <div className="waveform">
                {[20, 28, 14, 32, 18, 26, 10].map((h, i) => (
                  <div key={i} className="waveform-bar" style={{ height: `${h}px` }} />
                ))}
              </div>
              <button className="visual-analyze-btn">Analyze Audio</button>
            </div>
            <div className="visual-step">
              <div className="visual-number" style={{ background: "#3182ce" }}>3</div>
              <span className="visual-label">Get result</span>
            </div>
            <div className="visual-result-box">
              <div className="result-score">10<span>%</span></div>
              <p className="result-label">Potential Deepfake</p>
            </div>
          </div>
        </div>
      </section>
      {/* WHY CHOOSE SECTION */}
      <section className="why-section">
        <h2 className="section-title">Why Choose our Deepfake Voice Detection Tool</h2>
        <div style={{ height: 48 }} />
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🗣️</div>
            <h3 className="why-card-title">Fast and Easy to Use</h3>
            <p className="why-card-desc">
              You don't need to install anything or create an account. Just upload your audio, and we'll check it right away.
              It's simple enough for anyone to use, even if you're not tech-savvy. Most results show up in under 30 seconds.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">🛡️</div>
            <h3 className="why-card-title">Accurate Results That Make Sense</h3>
            <p className="why-card-desc">
              Our AI analyzes real speech patterns like tone, pacing, and background sounds to spot fake voices.
              You get a clear report with an authenticity score and detailed time markers. It's not just numbers—it tells you what matters.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">🔒</div>
            <h3 className="why-card-title">We Respect Your Privacy</h3>
            <p className="why-card-desc">
              Your audio files stay private. We don't keep or share your data. Every file is processed securely, then deleted
              right after analysis. You stay in control—always. It's safe to use for both personal and business needs.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">🎁</div>
            <h3 className="why-card-title">Always Free for Personal Use</h3>
            <p className="why-card-desc">
              We believe everyone should have access to tools that fight voice fraud. That's why our core detection service
              is 100% free for personal use. No sign-up, no ads, no tricks. Just real protection when you need it.
            </p>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="footer">
        © 2026 Deepfake Detection. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;