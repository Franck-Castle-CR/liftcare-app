import { useState } from 'react'
import { useLanguage, languageNames } from '../context/LanguageContext'
import { ChevronDown, ArrowUpDown } from 'lucide-react'

export default function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)

  const languages = [
    { code: 'ru' as const, name: languageNames.ru },
    { code: 'kk' as const, name: languageNames.kk },
    { code: 'en' as const, name: languageNames.en },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-dark-blue to-primary-blue">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-dark-blue">{t.common.liftcare}</span>
              <p className="text-xs text-light-blue font-medium">{t.common.slogan}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#solution" className="text-text-primary hover:text-primary-blue transition-colors font-medium">
              {t.header.solution}
            </a>
            <a href="#features" className="text-text-primary hover:text-primary-blue transition-colors font-medium">
              {t.header.features}
            </a>
            <a href="#for-who" className="text-text-primary hover:text-primary-blue transition-colors font-medium">
              {t.header.forWho}
            </a>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors border border-gray-200 rounded-lg hover:border-gray-300"
              >
                {languageNames[language]}
                <ChevronDown className="w-4 h-4" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-light-blue transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <a
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-primary-blue hover:text-dark-blue transition-colors"
            >
              {t.common.login}
            </a>
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-blue hover:bg-dark-blue rounded-lg transition-colors"
            >
              {t.header.openDemo}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
