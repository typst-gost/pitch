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
import { QRLinkSlide } from "@/components/presentation/slides/qr-link-slide"

import { 
  Layout, FileText, ListOrdered, Image as ImageIcon, 
  Table, Sigma, Code2, BookOpen, Paperclip, 
  Files, FileType2, AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  FileWarning,
  ArrowUpCircle,
  Brain, 
} from "lucide-react"

// ... imports

// 1. Префикс для "внутренних" слайдов, чтобы сразу работать с контентом
// Мы скрываем титульник, чтобы видеть результаты (таблицы, формулы) сразу.
const contentPrefix = `
#import "@preview/modern-g7-32:0.2.0": *\n
#show: gost.with(
  hide-title: true,
  text-size: (default: 14pt),
)\n\n#set page(width: 400pt, height: auto, margin: 20pt, fill: white, footer: none)\n\n`

// 2. Префикс только для титульного листа (без вызова show)
const setupPrefix = `#import "@preview/modern-g7-32:0.2.0": gost, abstract, appendixes\n\n#set page(fill: white)\n\n`

export const subslides = [
    // ... предыдущие слайды
    
   // ============================================
    // SLIDES 8+: Feature Workshops
    // ============================================
        
        // 1. ТИТУЛЬНЫЙ ЛИСТ (Пишем конфиг с нуля)
        <WorkshopSlide
          key="workshop-title"
          title="Настройка титульного листа"
          subtitle="Мастерская"
          hiddenPrefix={setupPrefix} 
          steps={[
            { action: "type", text: "#show: gost.with(\n", closing: ")" },
            { action: "type", text: '  ministry: "Минобрнауки РФ",\n', closing: ")" },
            { action: "type", text: '  organization: (full: "МГТУ им. Н.Э. Баумана"),\n', closing: ")" },
            { action: "type", text: '  research: "Разработка шаблона Typst",\n', closing: ")" },
            { action: "type", text: '  about: "курсовая работа",\n', closing: ")" },
            { action: "type", text: '  manager: (name: "Иванов И.И.", position: "доцент"),\n', closing: ")" },
            { action: "type", text: "  performers: (\n", closing: "))" },
            { action: "type", text: '    (name: "Елисеев П.А.", part: "разработка"),\n', closing: "))" },
            { action: "type", text: "  ),\n", closing: ")" },
            { action: "type", text: "  city: \"Москва\",\n", closing: ")" },
            { action: "type", text: "  year: auto,\n", closing: ")" },
            { action: "type", text: ")" },
          ]}
          typeSpeed={30}
        />,

        // 2. РЕФЕРАТ (Abstract)
        <WorkshopSlide
          key="workshop-abstract"
          title="Реферат"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#abstract(\n", closing: ")" },
            { action: "type", text: '  "автоматизация",\n', closing: ")" },
            { action: "type", text: '  "документооборот",\n', closing: ")" },
            { action: "type", text: '  "typst"\n', closing: ")" },
            { action: "type", text: ")[\n", closing: ")]" },
            { action: "type", text: "  Настоящий документ описывает шаблон.\n", closing: "]" },
            { action: "type", text: "  Количество страниц считается автоматически.\n", closing: "]" },
            { action: "type", text: "]" },
          ]}
          typeSpeed={35}
        />,

        // 3. СОДЕРЖАНИЕ И ЗАГОЛОВКИ
        <WorkshopSlide
          key="workshop-outline"
          title="Содержание"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#outline()\n\n" },
            { action: "pause", delay: 400 },
            { action: "type", text: "= Введение\n" },
            { action: "type", text: "Шаблон modern-g7-32 упрощает жизнь.\n\n" },
            { action: "type", text: "= Основная часть\n" },
            { action: "type", text: "== Обзор технологий\n" },
            { action: "type", text: "Typst — это современная система вёрстки." },
          ]}
          typeSpeed={38}
        />,

        // 4. ТАБЛИЦЫ
        <WorkshopSlide
          key="workshop-table"
          title="Таблицы"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#figure(\n", closing: ")" },
            { action: "type", text: "  table(\n", closing: "))" },
            { action: "type", text: "    columns: 3,\n", closing: "))" },
            { action: "type", text: "    table.header([Параметр], [Знач.], [Ед.]),\n", closing: "))" },
            { action: "pause", delay: 300 },
            { action: "type", text: "    [Мощность], [100], [Вт],\n", closing: "))" },
            { action: "type", text: "    [Вес], [2.5], [кг],\n", closing: "))" },
            { action: "type", text: "  ),\n", closing: ")" },
            { action: "type", text: "  caption: [Характеристики устройства]\n", closing: ")" },
            { action: "type", text: ") <tab:specs>\n\n" },
            { action: "pause", delay: 300 },
            { action: "type", text: "См. таблицу @tab:specs." },
          ]}
          typeSpeed={35}
        />,

        // 5. РИСУНКИ
        <WorkshopSlide
          key="workshop-image"
          title="Рисунки"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#figure(\n", closing: ")" },
            { action: "type", text: '  image("images/schema.png", width: 80%),\n', closing: ")" },
            { action: "pause", delay: 400 },
            { action: "type", text: "  caption: [Структурная схема]\n", closing: ")" },
            { action: "type", text: ") <fig:schema>\n\n" },
            { action: "type", text: "На рисунке @fig:schema показана схема." },
          ]}
          typeSpeed={38}
        />,

        // 6. ФОРМУЛЫ
        <WorkshopSlide
          key="workshop-equations"
          title="Формулы"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "Расчет суммы:\n" },
            { action: "type", text: "$ sum_(k=0)^n k = (n(n+1)) / 2 $ <eq:sum>\n\n" },
            { action: "pause", delay: 400 },
            { action: "type", text: "Матричное уравнение:\n" },
            { action: "type", text: "$ mat(1, 2; 3, 4) * x = vec(5, 6) $" },
          ]}
          typeSpeed={40}
        />,

        // 7. ЛИСТИНГИ КОДА
        <WorkshopSlide
          key="workshop-code"
          title="Листинги кода"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#figure(\n", closing: ")" },
            { action: "type", text: "  ``````\n)" },
            { action: "type", text: "  fn main() {\n", closing: "\n  }\n  ```"},
            { action: "type", text: '    println!("Hello, World!");\n', closing: "  }\n  ```\n)" },
            { action: "type", text: "  }\n", closing: "  ```"},
            { action: "type", text: "  ```,\n", closing: ")" },
            { action: "type", text: "  caption: [Код на Rust]\n", closing: ")" },
            { action: "type", text: ")" },
          ]}
          typeSpeed={35}
        />,

        <WorkshopSlide
          key="workshop-bib"
          title="Библиография"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#figure(\n", closing: ")" },
            { action: "type", text: "  ``````\n)" },
            { action: "type", text: "  fn main() {\n", closing: "\n  }\n  ```"},
            { action: "type", text: '    println!("Hello, World!");\n', closing: "  }\n  ```\n)" },
            { action: "type", text: "  }\n", closing: "  ```"},
            { action: "type", text: "  ```,\n", closing: ")" },
            { action: "type", text: "  caption: [Код на Rust]\n", closing: ")" },
            { action: "type", text: ")" },
          ]}
          typeSpeed={35}
        />,

        // 8. ПРИЛОЖЕНИЯ
        <WorkshopSlide
          key="workshop-appendix"
          title="Приложения"
          subtitle="Мастерская"
          hiddenPrefix={contentPrefix}
          steps={[
            { action: "type", text: "#show: appendixes\n\n" },
            { action: "type", text: "#appendix-heading(\"справочное\")[Текст приложения]\n" },
            { action: "type", text: "#lorem(50)\n\n" },
            { action: "type", text: "Как видно на рисунке @app-img...\n" },
            { action: "type", text: "#figure(image(\"graph.png\"), caption: \"График\") <app-img>" },
          ]}
          typeSpeed={40}
        />,
      ]


export default function PresentationPage() {
  const slides: (React.ReactNode | SlideConfig)[] = [
    // ============================================
    // SLIDE 1: Title
    // ============================================
    <TitleSlide
      key="title"
      title="Автоматизация оформления научных работ согласно"
      highlight="ГОСТ 7.32-2017"
      subtitle="Сосредоточьтесь на содержании, не думайте о форматировании."
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
            "Рутинные действия при оформлении отчётов",
            "Ручное оформление ссылок и нумерации",
            "Сложный синтаксис и медленная компиляция",
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
          image="/word.png"
          content={
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                <span>Ручная настройка полей, шрифтов и отступов</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-destructive shrink-0" />
                <span>Потеря времени на форматирование вместо содержания</span>
              </li>
              <li className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-destructive shrink-0" />
                <span>Постоянные исправления при изменении структуры</span>
              </li>
            </ul>
          }
        />,
        // Subslide 2.2: Manual references
        <DetailSlide
          key="problem-2"
          subheading="Рассмотрим подробнее"
          heading="Риск неактуальных ссылок"
          layout="image-top-text-bottom"
          image="/ref-issue.png"
          content="В Word перекрёстные ссылки не обновляются автоматически при редактировании. Нужно не забывать принудительно обновлять все поля (F9) перед каждым сохранением, иначе нумерация в тексте разойдется с реальной. В modern-g7-32 ссылки всегда актуальны благодаря компиляции."
        />,
        // Subslide 2.3: LaTeX complexity
        <DetailSlide
          key="problem-3"
          subheading="Рассмотрим подробнее"
          heading="Сложность LaTeX"
          layout="image-left-text-right"
          image="/latex.png"
          content={
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FileWarning className="w-5 h-5 text-destructive shrink-0" />
                <span>Громоздкий синтаксис с множеством команд</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-destructive shrink-0" />
                <span>Медленная компиляция больших документов</span>
              </li>
              <li className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                <span>Сложная настройка окружения и пакетов</span>
              </li>
            </ul>
          }
        />,
        // Subslide 2.4: Reliability
        <DetailSlide
          key="problem-4"
          subheading="Рассмотрим подробнее"
          heading="Проблемы воспроизводимости"
          layout="text-only-centered"
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
      quote="Typst — это новая система верстки на основе разметки, ориентированная на научные тексты."
      author="Typst"
      role="Официальная документация"
    />,

    <DetailSlide
      key="easy-usage"
      subheading="Веб-редактор Typst"
      heading="Простота в использовании"
      layout="text-left-image-right"
      image="/typst-app.png"
      variant="mockup"
      imageScale={1.5}
      offset={{ x: 250, y: 0 }}
      edge="right"
      content="Разные версии программ, шрифтов и шаблонов приводят к непредсказуемому результату. Документ, открытый на другом компьютере, может выглядеть совершенно иначе."
    />,

    // ============================================
    // SLIDE 6: First Workshop - Typst Basics
    // ============================================
    {
      component: (
        <WorkshopSlide
          key="workshop-typst-intro"
          title="Знакомство с Typst"
          subtitle="Мастерская"
          hiddenPrefix="#set page(width: 200pt, height: auto, margin: 20pt, fill: white, footer: none)"
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
            { action: "wait" },
            { action: "clear" },

            // Пример 1: Площадка Typst (упрощенная версия)
            { action: "type", text: "#set page(paper: \"a5\", height: auto)\n" },
            { action: "type", text: "#set heading(numbering: \"1.\")\n\n" },
            { action: "type", text: "#show link: set text(fill: blue, weight: 700)\n" },
            { action: "type", text: "#show link: underline\n\n" },
            { action: "type", text: "= Мастерская Typst\n\n" },
            { action: "type", text: "Добро пожаловать на площадку Typst! Тут мы будем экспериментировать с Typst. " },
            { action: "type", text: "Код слева превращается в результат справа! " },
            { action: "type", text: "Панель предварительного просмотра справа будет обновляться в реальном времени.\n\n" },
            { action: "type", text: "= Основы <basics>\n\n" },
            { action: "type", text: "Typst — это _язык разметки_. " },
            { action: "type", text: "Среди прочего, вы можете использовать его для:\n\n" },
            { action: "type", text: "- *Сильного выделения* текста\n" },
            { action: "type", text: "- Ссылки на @basics\n" },
            { action: "type", text: "- Набора математики: $a, b in { 1/2, sqrt(4 a b) }$\n\n" },
            { action: "type", text: "Но это только поверхность! " },
            { action: "type", text: "Typst имеет мощные системы для скриптинга, стилизации, интроспекции и многого другого.\n\n" },
            { action: "type", text: "= Следующие шаги\n\n" },
            { action: "type", text: "Чтобы узнать больше о Typst, рекомендуем ознакомиться с нашим руководством на " },
            { action: "type", text: "#link('https://typst.app/')[typst]" },

            // Переход ко второму примеру
            { action: "wait" },
            { action: "clear" },

            // Пример 2: Игра Soviet Matrix
            { action: "type", text: "#import \"@preview/soviet-matrix:0.2.1\": game\n" },
            { action: "type", text: "#show: game.with(seed: 123)\n\n" },
            { action: "type", text: "aaeadeffdddfdddeaeafaaafaadfaaeddeddeddfdddfdedddddfaaef\n" },
            { action: "type", text: "aeedededddfsaceeedfceafeaaafeefdddfddddfdddfaaaddddafadd\n" },
            { action: "type", text: "ddddfaeafeaaaaf" },

            // Переход к третьему примеру
            { action: "wait" },
            { action: "clear" },

            // Пример 3: Научная статья IEEE
            { action: "type", text: "#import \"@preview/charged-ieee:0.1.4\": ieee\n\n" },
            { action: "type", text: "#show: ieee.with(\n", closing: ")" },
            { action: "type", text: "  title: [Система верстки для упрощения процесса научного письма],\n", closing: ")" },
            { action: "type", text: "  abstract: [\n", closing: "])" },
            { action: "type", text: "    Процесс научного письма часто запутан из-за сложностей верстки, " },
            { action: "type", text: "что приводит к разочарованию и потере времени исследователями. " },
            { action: "type", text: "Typst упрощает процесс верстки, позволяя исследователям создавать статьи быстрее.\n", closing: "])" },
            { action: "type", text: "  ],\n", closing: ")" },
            { action: "type", text: "  authors: (\n", closing: "))" },
            { action: "type", text: "    (\n", closing: "),))" },
            { action: "type", text: "      name: \"Мартин Хауг\",\n", closing: "),))" },
            { action: "type", text: "      organization: [Typst GmbH],\n", closing: "),))" },
            { action: "type", text: "      location: [Берлин, Германия],\n", closing: "),))" },
            { action: "type", text: "      email: \"haug@typst.app\"\n", closing: "),))" },
            { action: "type", text: "    ),\n", closing: "))" },
            { action: "type", text: "  ),\n", closing: ")" },
            { action: "type", text: "  index-terms: (\"Научное письмо\", \"Верстка\", \"Создание документов\"),\n", closing: ")" },
            { action: "type", text: ")\n\n" },
          ]}
          typeSpeed={50}
          humanize={true}
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
      layout="text-left-image-right"
      variant="mockup"
      image="/modern-g7-32.png"
      content="Шаблон для автоматического оформления отчётов по ГОСТ 7.32-2017. Поддерживает титульные листы вузов, автоматическую нумерацию, библиографию и многое другое."
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
          // FIXME: Поправить иконки
          features={[
            { icon: Layout, title: "Титульный лист", description: "Гибкая настройка по ГОСТ 7.32-2017" },
            { icon: Files, title: "Шаблоны", description: "Готовые пресеты для вузов и организаций" },
            { icon: ListOrdered, title: "Структура", description: "Авто-нумерация рубрик и перечней" },
            { icon: FileText, title: "Реферат", description: "Автоматический подсчет страниц и источников" },
            { icon: FileType2, title: "Содержание", description: "Генерация оглавления одной командой" },
            { icon: ImageIcon, title: "Рисунки", description: "Удобная вставка с подписями" },
            { icon: Table, title: "Таблицы", description: "Оформление заголовков и продолжений" },
            { icon: Sigma, title: "Формулы", description: "Математический синтаксис Typst" },
            { icon: Code2, title: "Листинги", description: "Блоки кода с подсветкой синтаксиса" },
            { icon: BookOpen, title: "Библиография", description: "Поддержка BibTeX/Hayagriva и ГОСТ 7.0.5" },
            { icon: Paperclip, title: "Приложения", description: "Сквозная нумерация приложений" },
          ]}
        />
      ),
      type: "default",
      subslidesType: "workshop",
      subslides: subslides,
    },

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
      showMembersCounter={true}
      telegramChatId="@typst_gost"
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
        { value: 20, suffix: "+", label: "Курсовых работ", description: "Разработано на Typst" },
        { value: 70, suffix: "+", label: "Лабораторных работ", description: "И это только наши" },
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
        {
          icon: Brain,
          title: "Интеграция с ИИ",
          description: "Интеграция с технологиями искусственного интеллекта",
        },
        {
          icon: ArrowUpCircle,
          title: "Доработка",
          description: "Постоянное улучшение и доработка шаблона",
        },
      ]}
    />,

    // ============================================
    // SLIDE: CTA (with QR codes and single author)
    // ============================================
    <CTASlide
      key="cta"
      title="Начните использовать уже сегодня!"
      subtitle="typst-gost.ru"
      showLogo
      author={{
        name: "Елисеев Павел",
        avatar: "/avatar.png",
        email: "forgenet@inbox.ru",
      }}
      qrCodes={[{ label: "Сайт", url: "https://typst-gost.ru" }, { label: "Telegram", url: "https://t.me/typst_gost" }, { label: "Автор", url: "https://t.me/forgenet" }]}
      footerText="Презентация доступна по ссылке pitch.typst-gost.ru"
    />,
  ]

  return <Presentation slides={slides} />
}
