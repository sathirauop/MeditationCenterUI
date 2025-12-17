'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' }
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLanguage = (newLocale) => {
        // Replace the current locale in the pathname with the new one
        const segments = pathname.split('/');
        segments[1] = newLocale; // Replace locale segment
        const newPath = segments.join('/');
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button
                className="language-switcher__toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <span className="language-switcher__flag">{currentLanguage.flag}</span>
                <span className="language-switcher__code">{currentLanguage.code.toUpperCase()}</span>
                <svg
                    className={`language-switcher__arrow ${isOpen ? 'language-switcher__arrow--open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="language-switcher__dropdown">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`language-switcher__option ${language.code === locale ? 'language-switcher__option--active' : ''}`}
                            onClick={() => switchLanguage(language.code)}
                        >
                            <span className="language-switcher__flag">{language.flag}</span>
                            <span className="language-switcher__name">{language.name}</span>
                            {language.code === locale && (
                                <svg className="language-switcher__check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-switcher__toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: inherit;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .language-switcher__toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .language-switcher__flag {
          font-size: 16px;
        }

        .language-switcher__code {
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .language-switcher__arrow {
          transition: transform 0.2s ease;
        }

        .language-switcher__arrow--open {
          transform: rotate(180deg);
        }

        .language-switcher__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 160px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 100;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .language-switcher__option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #1a1a2e;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .language-switcher__option:hover {
          background: #f5f5f7;
        }

        .language-switcher__option--active {
          background: #f0f7ff;
          color: #4f46e5;
        }

        .language-switcher__name {
          flex: 1;
        }

        .language-switcher__check {
          color: #4f46e5;
        }
      `}</style>
        </div>
    );
}
