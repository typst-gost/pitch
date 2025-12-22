"use client"

import type React from "react"

import { Presentation, type SlideConfig } from "@/components/presentation/presentation"
import { TitleSlide } from "@/components/presentation/slides/title-slide"
import { BulletSlide } from "@/components/presentation/slides/bullet-slide"
import { ComparisonSlide } from "@/components/presentation/slides/comparison-slide"
import { MetricsSlide } from "@/components/presentation/slides/metrics-slide"
import { CTASlide } from "@/components/presentation/slides/cta-slide"
import { FeatureGridSlide } from "@/components/presentation/slides/feature-grid-slide"
import { ThreeColumnSlide } from "@/components/presentation/slides/three-column-slide"
import { QuoteSlide } from "@/components/presentation/slides/quote-slide"
import { DetailSlide } from "@/components/presentation/slides/detail-slide"
import { WorkshopSlide } from "@/components/presentation/slides/workshop-slide"
import { GallerySlide } from "@/components/presentation/slides/gallery-slide"
import { PDFViewerSlide } from "@/components/presentation/slides/pdf-viewer-slide"
import { QRLinkSlide } from "@/components/presentation/slides/qr-link-slide"
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
  AlertTriangle,
  Clock,
  RefreshCw,
  FileWarning,
} from "lucide-react"

export default function PresentationPage() {
  const slides: (React.ReactNode | SlideConfig)[] = [
    // ============================================
    // SLIDE 1: Title
    // ============================================
    <TitleSlide
      key="title"
      badge="ГОСТ 7.32-2017"
      title="Оформляйте документы"
      highlight="автоматически"
      subtitle="Шаблон для оформления работ в соответствии с ГОСТ 7.32-2017. Сосредоточьтесь на содержании, а не на форматировании."
      showLogo
      showMaiLogo
    />,

    // ============================================
    // SLIDE 2: Problems Overview (with subslides)
    // ============================================
    {
      component: (
        <BulletSlide
          key="problems"
          title="Проблемы существующих подходов"
          subtitle="Почему нужен новый инструмент"
          bullets={[
            "Рутинные действия при оформлении отчётов в Word",
            "Сложный синтаксис и медленная компиляция LaTeX",
            "Ручное оформление ссылок и нумерации",
            "Проблемы с надёжностью и воспроизводимостью",
          ]}
          expandable
        />
      ),
      subslides: [
        // Subslide 2.1: Routine actions
        <DetailSlide
          key="problem-1"
          subheading="Рассмотрим подробнее"
          heading="Рутинные действия в Word"
          layout="text-left-image-right"
          image="/microsoft-word-document-formatting-frustration.jpg"
          content={
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-1 shrink-0" />
                <span>Ручная настройка полей, шрифтов и отступов</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-destructive mt-1 shrink-0" />
                <span>Потеря времени на форматирование вместо содержания</span>
              </li>
              <li className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-destructive mt-1 shrink-0" />
                <span>Постоянные исправления при изменении структуры</span>
              </li>
            </ul>
          }
        />,
        // Subslide 2.2: LaTeX complexity
        <DetailSlide
          key="problem-2"
          subheading="Рассмотрим подробнее"
          heading="Сложность LaTeX"
          layout="image-left-text-right"
          image="/latex-complex-code-terminal-compilation.jpg"
          content={
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FileWarning className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                <span>Громоздкий синтаксис с множеством команд</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                <span>Медленная компиляция больших документов</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-1 shrink-0" />
                <span>Сложная настройка окружения и пакетов</span>
              </li>
            </ul>
          }
        />,
        // Subslide 2.3: Manual references
        <DetailSlide
          key="problem-3"
          subheading="Рассмотрим подробнее"
          heading="Ручное оформление ссылок"
          layout="text-only-centered"
          content="При изменении структуры документа приходится вручную обновлять все ссылки на рисунки, таблицы и источники. Одна ошибка — и вся нумерация сбивается."
        />,
        // Subslide 2.4: Reliability
        <DetailSlide
          key="problem-4"
          subheading="Рассмотрим подробнее"
          heading="Проблемы воспроизводимости"
          layout="text-left-image-right"
          image="/document-versioning-merge-conflict-chaos.jpg"
          content="Разные версии программ, шрифтов и шаблонов приводят к непредсказуемому результату. Документ, открытый на другом компьютере, может выглядеть совершенно иначе."
        />,
      ],
    },

    // ============================================
    // SLIDE 3: Comparison
    // ============================================
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

    // ============================================
    // SLIDE 4: Typst Introduction (Quote)
    // ============================================
    <QuoteSlide
      key="typst-intro"
      quote="Typst — это современная система вёрстки документов с открытым исходным кодом. Она работает быстрее LaTeX и позволяет сосредоточиться на содержании."
      author="Typst"
      role="Официальная документация"
    />,

    // ============================================
    // SLIDE 5: First Workshop - Typst Basics
    // ============================================
    {
      component: (
        <WorkshopSlide
          key="workshop-typst-intro"
          title="Знакомство с Typst"
          subtitle="Мастерская"
          initialCode=""
          steps={[
            { action: "type", text: "= Привет, Typst!\n\n" },
            { action: "pause", delay: 500 },
            { action: "type", text: "Это *жирный* текст.\n" },
            { action: "pause", delay: 300 },
            { action: "type", text: "А это _курсив_.\n\n" },
            { action: "pause", delay: 500 },
            { action: "type", text: "- Первый пункт\n" },
            { action: "type", text: "- Второй пункт\n" },
            { action: "type", text: "- Третий пункт" },
          ]}
          typeSpeed={35}
          humanize={true}
          previewPlaceholder="Здесь будет предпросмотр документа"
        />
      ),
      type: "workshop",
    },

    // ============================================
    // SLIDE 6: Project Structure
    // ============================================
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

    // ============================================
    // SECTION: Template (modern-g7-32)
    // ============================================
    <DetailSlide
      key="template-intro"
      subheading="Шаблон"
      heading="modern-g7-32"
      layout="text-only-centered"
      content="Шаблон для автоматического оформления отчётов по ГОСТ 7.32-2017. Поддерживает титульные листы вузов, автоматическую нумерацию, библиографию и многое другое."
    />,

    // SLIDE 7: PDF Viewer for template example
    <PDFViewerSlide
      key="pdf-example"
      title="Пример готового документа"
      subtitle="modern-g7-32"
      description="Документ полностью соответствует требованиям ГОСТ 7.32-2017"
    />,

    // ============================================
    // SLIDES 8+: Feature Workshops (with special transition)
    // ============================================
    {
      component: (
        <FeatureGridSlide
          key="features-overview"
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
        />
      ),
      type: "default",
      subslides: [
        // Workshop: Title page
        <WorkshopSlide
          key="workshop-title"
          title="Титульный лист"
          subtitle="Возможность 1"
          initialCode=""
          steps={[
            { action: "type", text: '#import "@preview/modern-g7-32:0.2.0": gost\n\n' },
            { action: "pause", delay: 400 },
            { action: "type", text: "#show: gost.with(\n" },
            { action: "type", text: "  title-template: title-templates.mai,\n" },
            { action: "pause", delay: 300 },
            { action: "type", text: "  performers: (\n" },
            { action: "type", text: '    (name: "Елисеев П.А."),\n' },
            { action: "type", text: "  ),\n" },
            { action: "type", text: ")" },
          ]}
          typeSpeed={30}
        />,

        // Workshop: Auto numbering
        <WorkshopSlide
          key="workshop-numbering"
          title="Автоматическая нумерация"
          subtitle="Возможность 2"
          initialCode=""
          steps={[
            { action: "type", text: "= Введение\n\n" },
            { action: "type", text: "Текст введения...\n\n" },
            { action: "pause", delay: 500 },
            { action: "type", text: "= Основная часть\n\n" },
            { action: "type", text: "== Теоретические основы\n\n" },
            { action: "type", text: "Текст раздела..." },
          ]}
          typeSpeed={40}
        />,

        // Workshop: Tables
        <WorkshopSlide
          key="workshop-tables"
          title="Таблицы по ГОСТ"
          subtitle="Возможность 3"
          initialCode=""
          steps={[
            { action: "type", text: "#figure(\n" },
            { action: "type", text: "  table(\n" },
            { action: "type", text: "    columns: 3,\n" },
            { action: "pause", delay: 300 },
            { action: "type", text: "    [Параметр], [Значение], [Ед. изм.],\n" },
            { action: "type", text: "    [Мощность], [100], [Вт],\n" },
            { action: "type", text: "    [Масса], [2.5], [кг],\n" },
            { action: "type", text: "  ),\n" },
            { action: "type", text: "  caption: [Характеристики устройства]\n" },
            { action: "type", text: ") <tab:specs>" },
          ]}
          typeSpeed={35}
        />,

        // Workshop: Figures
        <WorkshopSlide
          key="workshop-figures"
          title="Рисунки и подписи"
          subtitle="Возможность 4"
          initialCode=""
          steps={[
            { action: "type", text: "#figure(\n" },
            { action: "type", text: '  image("schema.png", width: 80%),\n' },
            { action: "pause", delay: 400 },
            { action: "type", text: "  caption: [Структурная схема системы]\n" },
            { action: "type", text: ") <fig:schema>\n\n" },
            { action: "pause", delay: 500 },
            { action: "type", text: "На @fig:schema показана схема." },
          ]}
          typeSpeed={38}
        />,

        // Workshop: Abstract
        <WorkshopSlide
          key="workshop-abstract"
          title="Автоматический реферат"
          subtitle="Возможность 5"
          initialCode=""
          steps={[
            { action: "type", text: '#import "@preview/modern-g7-32:0.2.0": abstract\n\n' },
            { action: "pause", delay: 400 },
            { action: "type", text: "#abstract(\n" },
            { action: "type", text: '  "АВТОМАТИЗАЦИЯ", "ГОСТ", "TYPST"\n' },
            { action: "type", text: ")[\n" },
            { action: "type", text: "  Настоящий документ описывает\n" },
            { action: "type", text: "  шаблон modern-g7-32...\n" },
            { action: "type", text: "]" },
          ]}
          typeSpeed={32}
        />,

        // Workshop: Bibliography
        <WorkshopSlide
          key="workshop-bib"
          title="Библиография"
          subtitle="Возможность 6"
          initialCode=""
          steps={[
            { action: "type", text: "#bibliography(\n" },
            { action: "type", text: '  "refs.bib",\n' },
            { action: "type", text: '  style: "gost-r-7-0-5-2008-numeric"\n' },
            { action: "type", text: ")\n\n" },
            { action: "pause", delay: 500 },
            { action: "type", text: "// В тексте:\n" },
            { action: "type", text: "Согласно @smith2023..." },
          ]}
          typeSpeed={35}
        />,

        // Workshop: Code listings
        <WorkshopSlide
          key="workshop-code"
          title="Листинги кода"
          subtitle="Возможность 7"
          initialCode=""
          steps={[
            { action: "type", text: "#figure(\n" },
            { action: "type", text: "  ```python\n" },
            { action: "type", text: "  def hello():\n" },
            { action: "type", text: '      print("Hello!")\n' },
            { action: "type", text: "  ```\n" },
            { action: "type", text: ") <lst:hello>\n\n" },
            { action: "pause", delay: 400 },
            { action: "type", text: "В @lst:hello показан пример." },
          ]}
          typeSpeed={40}
        />,
      ],
    },

    // ============================================
    // SECTION: Website (Gallery with QR)
    // ============================================
    <GallerySlide
      key="website-gallery"
      title="Сайт проекта"
      subtitle="typst-gost.ru"
      images={[
        { src: "/documentation-website-dark-theme-modern-landing.jpg", alt: "Landing page", title: "Главная страница", size: "large" },
        { src: "/documentation-page-code-examples-syntax.jpg", alt: "Documentation", title: "Документация", size: "medium" },
        { src: "/code-examples-syntax-highlighting-dark.jpg", alt: "Examples", title: "Примеры", size: "small" },
        { src: "/blog-articles-tech-writing-markdown.jpg", alt: "Blog", title: "Блог", size: "medium" },
        { src: "/faq-help-support-page-minimal.jpg", alt: "FAQ", title: "FAQ", size: "small" },
      ]}
      link="https://typst-gost.ru"
      linkLabel="typst-gost.ru"
      qrLabel="Отсканируйте"
      autoAdvance={true}
    />,

    // ============================================
    // SECTION: Community (QR focused)
    // ============================================
    <QRLinkSlide
      key="community"
      title="Сообщество Typst Gost"
      subtitle="Telegram"
      description="Присоединяйтесь к нашему сообществу в Telegram! Здесь вы можете задать вопросы, поделиться опытом и следить за обновлениями проекта."
      link="https://t.me/typst_gost"
      linkLabel="Присоединиться"
    />,

    // ============================================
    // SLIDE: Metrics (with animated arrows)
    // ============================================
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

    // ============================================
    // SLIDE: Future Plans
    // ============================================
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

    // ============================================
    // SLIDE: CTA (with QR codes and single author)
    // ============================================
    <CTASlide
      key="cta"
      title="Начните использовать уже сегодня"
      subtitle="typst-gost.ru"
      ctaText="Открыть документацию"
      showLogo
      author={{
        name: "Елисеев Павел",
        email: "forgenet@inbox.ru",
      }}
      qrCodes={[{ label: "Сайт" }, { label: "Telegram" }, { label: "Автор" }]}
      links={[
        { label: "Сайт проекта", url: "https://typst-gost.ru" },
        { label: "Сообщество", url: "https://t.me/typst_gost" },
        { label: "GitHub", url: "https://github.com/typst-g7-32" },
      ]}
    />,
  ]

  return <Presentation slides={slides} />
}
