import { useLanguage, languageNames } from '../context/LanguageContext'

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  return (
    <label className={`flex items-center gap-2 ${compact ? 'text-white/70' : 'text-text-secondary'}`}>
      <span className={compact ? 'sr-only' : 'text-sm'}>{t.ui.language}</span>
      <select
        aria-label={t.ui.language}
        value={language}
        onChange={(event) => setLanguage(event.target.value as 'ru' | 'kk' | 'en')}
        className={`min-h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue ${compact ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 bg-white text-text-primary'}`}
      >
        {(['ru', 'kk', 'en'] as const).map((code) => (
          <option key={code} value={code} className="text-text-primary">{languageNames[code]}</option>
        ))}
      </select>
    </label>
  )
}
