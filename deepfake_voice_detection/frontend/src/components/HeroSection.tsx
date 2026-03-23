import { useState } from "react";
// import heroImage from "@/assets/hero-abstract.jpg";
import "./HeroSection.css";
const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("voice");
  return (
    <>
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
        <div className="upload-box">
          <div className="upload-icon">☁️</div>
          <p className="upload-text">Drag & drop an audio file or click</p>
          <p className="upload-formats">WAV, MP3, AAC, OGG, FLAC up to 20MB</p>
        </div>
        <div className="hero-image">
          {/* <img src={heroImage} alt="Abstract visualization" /> */}
        </div>
      </div>
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
        <button className="analyze-btn">Analyze Audio</button>
      </div>
      <p className="example-voices">No audio? Try with example voices:</p>
    </>
  );
};
export default HeroSection;