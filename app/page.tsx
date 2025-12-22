"use client"

import { Presentation } from "@/components/presentation/presentation"
import { TitleSlide } from "@/components/presentation/slides/title-slide"
import { BulletSlide } from "@/components/presentation/slides/bullet-slide"
import { ComparisonSlide } from "@/components/presentation/slides/comparison-slide"
import { MetricsSlide } from "@/components/presentation/slides/metrics-slide"
import { CTASlide } from "@/components/presentation/slides/cta-slide"
import { CodeScrollSlide } from "@/components/presentation/slides/code-scroll-slide"
import { FeatureGridSlide } from "@/components/presentation/slides/feature-grid-slide"
import { ThreeColumnSlide } from "@/components/presentation/slides/three-column-slide"
import { QuoteSlide } from "@/components/presentation/slides/quote-slide"
import {
  Zap,
  Code2,
  FileText,
  BookOpen,
  Brain,
  ArrowUpCircle,
  Layout,
  ListOrdered,
  Table,
  ImageIcon,
} from "lucide-react"

export default function PresentationPage() {
  const slides = [
    // Slide 1: Title
    <TitleSlide
      key="title"
      badge="ГОСТ 7.32-2017"
      title="Оформляйте документы"
      highlight="автоматически"
      subtitle="Шаблон для оформления работ в соответствии с ГОСТ 7.32-2017. Сосредоточьтесь на содержании, а не на форматировании."
      showLogo
      showMaiLogo
    />,

    // Slide 2: Problem Statement
    <BulletSlide
      key="problem"
      title="Проблемы существующих подходов"
      subtitle="Почему нужен новый инструмент"
      bullets={[
        "Рутинные действия при оформлении отчётов в Word",
        "Сложный синтаксис и медленная компиляция LaTeX",
        "Ручное оформление ссылок и нумерации",
        "Проблемы с надёжностью и воспроизводимостью",
      ]}
    />,

    // Slide 3: Comparison
    <ComparisonSlide
      key="comparison"
      title="Word vs LaTeX vs Typst"
      columns={[
        {
          title: "Традиционные инструменты",
          items: [
            { text: "Рутинное ручное оформление", positive: false },
            { text: "Медленная компиляция", positive: false },
            { text: "Сложный синтаксис", positive: false },
            { text: "Большой размер установки", positive: false },
          ],
        },
        {
          title: "Typst + modern-g7-32",
          highlight: true,
          items: [
            { text: "Молниеносная компиляция", positive: true },
            { text: "Чистый и простой синтаксис", positive: true },
            { text: "Автоматическое оформление", positive: true },
            { text: "Работает в браузере", positive: true },
          ],
        },
      ]}
    />,

    // Slide 4: Quote
    <QuoteSlide
      key="quote"
      quote="Typst — это современная система вёрстки документов с открытым исходным кодом. Она работает быстрее LaTeX и позволяет сосредоточиться на содержании."
      author="Typst"
      role="Официальная документация"
    />,

    // Slide 5: Features Grid
    <FeatureGridSlide
      key="features"
      title="Возможности шаблона"
      subtitle="modern-g7-32"
      features={[
        { icon: Layout, title: "Титульный лист", description: "Автоматическое формирование по шаблону вуза" },
        { icon: ListOrdered, title: "Нумерация", description: "Все элементы нумеруются автоматически" },
        { icon: Table, title: "Таблицы", description: "Оформление согласно ГОСТ" },
        { icon: ImageIcon, title: "Рисунки", description: "Подписи и нумерация автоматически" },
        { icon: FileText, title: "Реферат", description: "Автоматическая генерация" },
        { icon: BookOpen, title: "Библиография", description: "Форматирование источников" },
        { icon: Code2, title: "Листинги", description: "Подсветка синтаксиса кода" },
        { icon: Zap, title: "Скорость", description: "Компиляция за миллисекунды" },
      ]}
    />,

    // Slide 6: Three Columns - Project Structure
    <ThreeColumnSlide
      key="structure"
      title="Что из себя представляет наш проект?"
      subtitle="Typst Gost"
      columns={[
        { number: "1", title: "Шаблон", description: "Автоматизирующий оформление работ по ГОСТ 7.32-2017" },
        { number: "2", title: "Сайт", description: "С полезной информацией и документацией проекта" },
        { number: "3", title: "Сообщество", description: "Где можно попросить помощи и следить за обновлениями" },
      ]}
    />,

    // Slide 7: Code Demo
    <CodeScrollSlide
      key="code"
      title="Простой синтаксис"
      blocks={[
        {
          title: "Импорт шаблона",
          code: `#import "@preview/modern-g7-32:0.2.0": gost, abstract

#show: gost.with(
  title-template: title-templates.mai-university-lab,
  performers: (
    (name: "Елисеев П.А.", position: "Студент"),
  ),
)`,
          output: `Титульный лист МАИ
автоматически сгенерирован
с корректным оформлением`,
        },
        {
          title: "Создание реферата",
          code: `#abstract(
  "Ключевое слово", "Работа", "Оформление"
)[
  Настоящий документ представляет собой 
  описание шаблона modern-g7-32...
]`,
          output: `РЕФЕРАТ

Отчёт 28 с., 3 рис., 7 табл., 2 прил.

КЛЮЧЕВОЕ СЛОВО, РАБОТА, ОФОРМЛЕНИЕ

Настоящий документ представляет собой 
описание шаблона modern-g7-32...`,
        },
        {
          title: "Структурные заголовки",
          code: `#structure-heading [Цели и задачи]

Составить микропрограмму функционирования 
центрального процессора.

#structure-heading [Ход работы]

Рассмотрим схему на рисунке @fig:schema.`,
          output: `ЦЕЛИ И ЗАДАЧИ

Составить микропрограмму функционирования 
центрального процессора.

ХОД РАБОТЫ

Рассмотрим схему на рисунке 1.`,
        },
      ]}
    />,

    // Slide 8: Metrics
    <MetricsSlide
      key="metrics"
      title="Результаты внедрения"
      subtitle="В цифрах"
      metrics={[
        { value: 3, label: "Дипломные работы", description: "Написано с помощью шаблона" },
        { value: 50, suffix: "+", label: "Курсовых работ", description: "Разработано на Typst" },
        { value: 70, suffix: "+", label: "Участников", description: "В телеграм-сообществе" },
      ]}
    />,

    // Slide 9: Future Plans
    <ThreeColumnSlide
      key="future"
      title="Планы на будущее"
      subtitle="Развитие проекта"
      columns={[
        {
          icon: BookOpen,
          title: "Документация",
          description: "Разработка подробной документации по использованию шаблона",
        },
        { icon: Brain, title: "Интеграция с ИИ", description: "Интеграция с технологиями искусственного интеллекта" },
        { icon: ArrowUpCircle, title: "Доработка", description: "Постоянное улучшение и доработка шаблона" },
      ]}
    />,

    // Slide 10: CTA
    <CTASlide
      key="cta"
      title="Начните использовать уже сегодня"
      subtitle="typst-gost.ru"
      ctaText="Открыть документацию"
      showLogo
      contacts={[
        { name: "Елисеев Павел", email: "forgenet@inbox.ru" },
        { name: "Лисняк Александр", email: "sashalisnak.ml@gmail.com" },
      ]}
      links={[
        { label: "Сайт проекта", url: "https://typst-gost.ru" },
        { label: "Сообщество", url: "https://t.me/typst_gost" },
        { label: "GitHub", url: "https://github.com/typst-g7-32" },
      ]}
    />,
  ]

  return <Presentation slides={slides} />
}
