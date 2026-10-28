import { ArrowRight, Play } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-dark-blue to-primary-blue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Начните с пилотного проекта
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Попробуйте LiftCare бесплатно в течение 14 дней. Без обязательств и кредитной карты.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-dark-blue bg-white hover:bg-gray-100 rounded-lg transition-colors"
          >
            Открыть демоверсию
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#solution"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Смотреть видео
          </a>
        </div>
        <p className="mt-6 text-sm text-white/60">
          Готовы к внедрению? <a href="mailto:info@liftcare.kz?subject=Пилотный%20проект%20LiftCare" className="text-white hover:underline">Свяжитесь с нами</a>
        </p>
      </div>
    </section>
  )
}
