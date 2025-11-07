'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Image src="/images/Logo1.jpeg" alt="Isipathana Logo" fill style={{objectFit: 'cover'}} />
            </div>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#home">Home</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#programs">Events and Programs</a></li>
            <li className={styles.languageToggle}>🌐 EN / සිං</li>
          </ul>
          <Link href="/register" className={styles.signUpBtn}>Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
        <h1>Find Your Inner Peace</h1>
        <p>Join our meditation community and embark on a journey of mindfulness, wisdom, and spiritual growth in the heart of Sri Lanka.</p>
        <button className={styles.ctaButton}>Begin Your Journey</button>
      </section>

      {/* Introduction Section */}
      <section className={styles.introduction}>
        <div className={styles.sectionContainer}>
          <h2>Welcome to Isipathana</h2>
          <div className={styles.introContent}>
            <div className={styles.introText}>
              <p>At Isipathana International Meditation Center, we offer a sanctuary for spiritual growth and inner development. Our center combines ancient Buddhist wisdom with modern meditation techniques, providing a comprehensive approach to mindfulness and enlightenment.</p>
              <p>Whether you are a beginner seeking peace or an experienced practitioner deepening your practice, our welcoming community offers guidance, support, and authentic teachings rooted in the Buddha&apos;s original instructions.</p>
              <p><strong>Why Meditation Matters:</strong> In today&apos;s fast-paced world, meditation offers a path to clarity, compassion, and lasting peace. Through regular practice, discover profound benefits for your mental, emotional, and spiritual well-being.</p>
            </div>
            <div className={styles.introImage}>
              <Image src="/images/meditationHall.jpeg" alt="Meditation Hall" fill style={{objectFit: 'cover'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className={styles.quickNav}>
        <div className={styles.sectionContainer}>
          <h2>Explore Our Center</h2>
          <div className={styles.navCards}>
            <div className={styles.navCard}>
              <div className={styles.navCardIcon}>🏛️</div>
              <h3>About Us</h3>
              <p>Discover our story, philosophy, and mission to spread mindfulness</p>
            </div>
            <div className={styles.navCard}>
              <div className={styles.navCardIcon}>🧘</div>
              <h3>Programs</h3>
              <p>Join our regular meditation sessions and retreats</p>
            </div>
            <div className={styles.navCard}>
              <div className={styles.navCardIcon}>🎯</div>
              <h3>Events</h3>
              <p>Special ceremonies, workshops, and spiritual gatherings</p>
            </div>
            <div className={styles.navCard}>
              <div className={styles.navCardIcon}>📍</div>
              <h3>Contact</h3>
              <p>Visit us or get in touch with our community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Highlights */}
      <section className={styles.highlights}>
        <div className={styles.sectionContainer}>
          <h2>Upcoming Highlights</h2>
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightImage}>📅</div>
              <div className={styles.highlightContent}>
                <div className={styles.highlightDate}>Next Event • December 15, 2025</div>
                <h3>Weekend Meditation Retreat</h3>
                <p>Join us for a transformative weekend of silent meditation, dharma talks, and mindful walking in our peaceful surroundings.</p>
              </div>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightImage}>📖</div>
              <div className={styles.highlightContent}>
                <div className={styles.highlightDate}>Latest Blog Post</div>
                <h3>The Path to Inner Peace</h3>
                <p>Discover practical techniques for cultivating mindfulness in daily life and overcoming common meditation challenges.</p>
              </div>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightImage}>💬</div>
              <div className={styles.highlightContent}>
                <div className={styles.highlightDate}>Community Testimonial</div>
                <h3>&quot;A Life-Changing Experience&quot;</h3>
                <p>&quot;The teachings at Isipathana have transformed my life. I&apos;ve found peace, clarity, and a supportive spiritual community.&quot; - Sarah M.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Meditate Section */}
      <section className={styles.whyMeditate}>
        <div className={styles.sectionContainer}>
          <h2>Why Meditate?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>☮️</div>
              <h3>Inner Peace</h3>
              <p>Find calmness and serenity amidst life&apos;s challenges through regular practice</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>💡</div>
              <h3>Mental Clarity</h3>
              <p>Sharpen your focus and develop clear, insightful thinking</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>❤️</div>
              <h3>Compassion</h3>
              <p>Cultivate loving-kindness toward yourself and all beings</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🌟</div>
              <h3>Wisdom</h3>
              <p>Gain deep insights into the nature of reality and existence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className={styles.quickContact}>
        <div className={styles.sectionContainer}>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📱</div>
              <h3>Phone & WhatsApp</h3>
              <p><a href="tel:+94771234567">+94 77 123 4567</a></p>
              <p>Available 9 AM - 6 PM</p>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📍</div>
              <h3>Location</h3>
              <p>123 Meditation Path<br/>Colombo, Sri Lanka</p>
              <p><a href="#">View on Map</a></p>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>⏰</div>
              <h3>Operating Hours</h3>
              <p>Daily: 6:00 AM - 8:00 PM</p>
              <p>Meditation Sessions: 6 AM & 6 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>About Isipathana</h4>
            <p>We are dedicated to preserving and sharing authentic Buddhist teachings and meditation practices for the benefit of all beings.</p>
            <div className={styles.socialLinks}>
              <div className={styles.socialIcon}>📘</div>
              <div className={styles.socialIcon}>📷</div>
              <div className={styles.socialIcon}>🐦</div>
              <div className={styles.socialIcon}>📺</div>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#programs">Programs</a>
            <a href="#events">Events</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <a href="#teachings">Teachings</a>
            <a href="#schedule">Class Schedule</a>
            <a href="#donate">Donate</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact Info</h4>
            <p>📧 info@isipathana.lk</p>
            <p>📱 +94 77 123 4567</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Isipathana International Meditation Center. All rights reserved. | 🌐 EN / සිංහල</p>
        </div>
      </footer>
    </div>
  );
}
