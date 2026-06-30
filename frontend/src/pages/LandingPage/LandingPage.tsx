import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Globe, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  Play
} from 'lucide-react';
import styles from './LandingPage.module.css';

/**
 * Custom Hook for Intersection Observer Animations
 */
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const current = domRef.current;
    if (current) observer.observe(current);
    
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return { ref: domRef, className: isVisible ? styles.revealVisible : styles.revealHidden };
};

/**
 * Animated Counter Component
 */
const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, className } = useScrollReveal();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (className === styles.revealVisible && !hasStarted.current) {
      hasStarted.current = true;
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
    }
  }, [className, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const revealHero = useScrollReveal();
  const revealFeatures = useScrollReveal();
  const revealProcess = useScrollReveal();
  const revealStats = useScrollReveal();

  return (
    <div className={styles.container}>
      {/* Google Fonts Import */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;500;700;900&display=swap');
      </style>

      {/* Background Layers */}
      <div className={styles.starLayerSmall} style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }} />
      <div className={styles.starLayerMedium} style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} />
      <div className={styles.nebulaGlow} style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }} />
      <div className={styles.shootingStar} />

      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <Sparkles size={24} className={styles.logoIcon} />
            <span>SANKAT MOCHAN</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#about">About</a>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.loginLink}>Login</Link>
            <Link to="/register" className={styles.navCta}>Launch Mission</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={`${styles.heroWrapper} ${revealHero.className}`} ref={revealHero.ref}>
          <div className={styles.heroLeft}>
            <div className={styles.trustBadge}>
              <span className={styles.badgeIndicator} />
              NEXT GENERATION AI PRODUCTIVITY
            </div>
            <h1 className={styles.heroTitle}>
              Navigate Your<br />
              <span className={styles.chaosText}>Chaos</span><br />
              With <span className={styles.aiGradient}>AI</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The ultimate neural command center for high-performers. 
              Sankat Mochan synthesizes your complex workflows into elegant, 
              actionable roadmaps using aerospace-grade logic.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register" className={styles.primaryBtn}>
                Launch Your Mission <ArrowRight size={18} />
              </Link>
              <button className={styles.secondaryBtn}>
                <Play size={16} fill="currentColor" /> Watch Demo
              </button>
            </div>
          </div>

          <div className={styles.heroRight} style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}>
            <div className={styles.aiCoreContainer}>
              <div className={styles.coreRingOuter} />
              <div className={styles.coreRingMiddle} />
              <div className={styles.coreRingInner} />
              <div className={styles.coreCenter}>
                <div className={styles.corePulse} />
              </div>
              <div className={styles.satellite} />
              <div className={styles.satelliteTwo} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={`${styles.sectionContainer} ${revealFeatures.className}`} ref={revealFeatures.ref}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Sankat Mochan?</h2>
            <p className={styles.sectionSubtitle}>Engineered for those who demand precision in every second.</p>
          </div>
          <div className={styles.featureGrid}>
            {[
              { icon: <Cpu />, title: 'AI Planning', desc: 'Neural networks optimize your schedule based on biological peak performance windows.' },
              { icon: <Zap />, title: 'Smart Prioritization', desc: 'Dynamic urgency scaling that adapts to your changing environment in real-time.' },
              { icon: <Shield />, title: 'Deadline Prediction', desc: 'Advanced heuristics calculate potential bottlenecks before they happen.' },
              { icon: <Globe />, title: 'Productivity Analytics', desc: 'Deep-dive into your cognitive output with beautiful, data-rich visualizations.' }
            ].map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className={styles.cardGlow} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className={styles.process}>
        <div className={`${styles.sectionContainer} ${revealProcess.className}`} ref={revealProcess.ref}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Protocol</h2>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            {[
              { step: '01', title: 'Describe your task', desc: 'Input your objectives in natural language. Our AI understands context, not just keywords.' },
              { step: '02', title: 'AI analyzes urgency', desc: 'The engine cross-references your existing load and deadlines to determine true priority.' },
              { step: '03', title: 'Personalized roadmap', desc: 'Receive a step-by-step execution plan tailored to your specific working style.' },
              { step: '04', title: 'Complete before deadline', desc: 'Execute with clarity and finish ahead of schedule with AI-assisted focus.' }
            ].map((s, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <span className={styles.stepNumber}>{s.step}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={`${styles.statsContainer} ${revealStats.className}`} ref={revealStats.ref}>
          <div className={styles.statBox}>
            <h3><Counter end={1000} />+</h3>
            <p>Tasks Completed</p>
          </div>
          <div className={styles.statBox}>
            <h3><Counter end={95} />%</h3>
            <p>On-time Completion</p>
          </div>
          <div className={styles.statBox}>
            <h3>24/7</h3>
            <p>AI Assistance</p>
          </div>
          <div className={styles.statBox}>
            <h3><Counter end={100} />%</h3>
            <p>Personalized Plans</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Common Inquiries</h2>
          </div>
          <div className={styles.faqList}>
            {[
              { q: 'How secure is my data?', a: 'We use end-to-end AES-256 encryption. Your data is never used to train public models.' },
              { q: 'Can I integrate with other tools?', a: 'Yes, we support native integrations with Slack, GitHub, and Linear.' },
              { q: 'Is there a mobile app?', a: 'Our web app is fully responsive, and native iOS/Android apps are coming in Q3 2025.' }
            ].map((item, i) => (
              <div key={i} className={`${styles.faqItem} ${activeFaq === i ? styles.faqActive : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className={styles.faqQuestion}>
                  <span>{item.q}</span>
                  <ChevronDown size={18} />
                </div>
                <div className={styles.faqAnswer}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <Sparkles size={20} className={styles.logoIcon} />
              <span>SANKAT MOCHAN</span>
            </div>
            <p>Building the future of human-AI collaboration.</p>
          </div>
          <div className={styles.footerNav}>
            <div className={styles.footerCol}>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Integrations</a>
              <a href="#">Enterprise</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Privacy</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Support</h4>
              <a href="#">Docs</a>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 Sankat Mochan AI. All rights reserved.</p>
          <div className={styles.footerLegal}>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;