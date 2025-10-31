'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.scss';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>
            Isipathana International Meditation Center
          </h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeHeader}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2>Welcome, {user.name || user.email || 'Friend'}!</h2>
          </div>

          <p className={styles.welcomeText}>
            Welcome to the Isipathana International Meditation Center.
            You have successfully logged in to your account.
          </p>

          <div className={styles.infoBox}>
            <h3>Your Account Information</h3>
            <div className={styles.infoGrid}>
              {user.email && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
              )}
              {user.role && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Role:</span>
                  <span className={styles.infoValue}>{user.role}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.features}>
            <h3>Quick Links</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <h4>Programs</h4>
                <p>Browse and register for meditation programs</p>
                <span className={styles.comingSoon}>Coming Soon</span>
              </div>
              <div className={styles.featureCard}>
                <h4>Events</h4>
                <p>View upcoming meditation events</p>
                <span className={styles.comingSoon}>Coming Soon</span>
              </div>
              <div className={styles.featureCard}>
                <h4>Donations</h4>
                <p>Support our meditation center</p>
                <span className={styles.comingSoon}>Coming Soon</span>
              </div>
              <div className={styles.featureCard}>
                <h4>Profile</h4>
                <p>Manage your account settings</p>
                <span className={styles.comingSoon}>Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Isipathana International Meditation Center. All rights reserved.</p>
      </footer>
    </div>
  );
}
