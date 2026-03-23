import "./WhyChooseSection.css";
const WhyChooseSection = () => {
  return (
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
  );
};
export default WhyChooseSection;

