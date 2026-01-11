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
  Users,
} from "lucide-react"

// Мы скрываем титульник, чтобы видеть результаты (таблицы, формулы) сразу
const contentPrefix = `
#import "@preview/modern-g7-32:0.2.0": *\n
#show: gost.with(
  hide-title: true, // Отключаем титульный лист для демонстрации
  text-size: (default: 14pt),
)\n\n#set page(width: 400pt, height: auto, margin: 20pt, fill: white, footer: none)\n\n`

// 2. Префикс только для титульного листа (без вызова show
const setupPrefix = `#import "@preview/modern-g7-32:0.2.0": gost, abstract, appendixes, title-templates\n\n#set page(fill: white)\n\n`

export const subslides = [
  <WorkshopSlide
    key="workshop-title"
    title="Титульный лист"
    subtitle="Мастерская"
    largePreview={true}
    hiddenPrefix={setupPrefix}
    typeSpeed={20}
    steps={[
      { action: "type", text: "#show: gost.with(\n", closing: ")" },

      // Строковые параметры (нужна закрывающая кавычка и скобка функции)
      { action: "type", text: '  ministry: "Наименование министерства (ведомства) или другого структурного образования, в систему которого входит организация-исполнитель",\n', closing: '")' },

      // Открываем словарь (нужна скобка словаря + скобка функции)
      { action: "type", text: "  organization: (\n", closing: "))" },
      // Внутри словаря строки (кавычка + скобка словаря + скобка функции)
      { action: "type", text: '    full: "Полное наименование организации — исполнителя НИР",\n', closing: '"))' },
      { action: "type", text: '    short: "Сокращённое наименование организации",\n', closing: '"))' },
      // Закрываем словарь (остается только скобка функции)
      { action: "type", text: "  ),\n", closing: ")" },

      // Простые строки
      { action: "type", text: '  udk: "индекс УДК",\n', closing: '")' },
      { action: "type", text: '  research-number: "регистрационный номер НИР",\n', closing: '")' },
      { action: "type", text: '  report-number: "регистрационный номер отчета",\n', closing: '")' },

      // Approved-by (словарь)
      { action: "type", text: "  approved-by: (\n", closing: "))" },
      { action: "type", text: '    name: "Фамилия И.О.",\n', closing: '", position: ""))' },
      { action: "type", text: '    position: "Должность, наимен. орг.",\n', closing: '"))' },
      { action: "type", text: "    year: 2017,\n", closing: "))" },
      { action: "type", text: "  ), // Гриф согласования\n", closing: ")" },

      // Agreed-by (словарь)
      { action: "type", text: "  agreed-by: (\n", closing: "))" },
      { action: "type", text: '    name: "Фамилия И.О.",\n', closing: '"))' },
      { action: "type", text: '    position: "Должность, наимен. орг.",\n', closing: '"))' },
      { action: "type", text: "    year: auto,\n", closing: "))" },
      { action: "type", text: "  ), // Гриф утверждения\n", closing: ")" },

      // Строки описания
      { action: "type", text: '  report-type: "отчёт",\n', closing: '")' },
      { action: "type", text: '  about: "О научно-исследовательской работе",\n', closing: '")' },
      { action: "type", text: '  research: "Наименование НИР",\n', closing: '")' },
      { action: "type", text: "  bare-subject: false, // Можно убрать 'по теме'\n", closing: ")" },
      { action: "type", text: '  subject: "Наименование отчёта",\n', closing: '")' },

      // Руководитель (словарь)
      { action: "type", text: "  manager: (\n", closing: "))" },
      { action: "type", text: '    name: "Фамилия И.О.",\n', closing: '"))' },
      { action: "type", text: '    position: "Должность",\n', closing: '"))' },
      { action: "type", text: '    title: "Руководитель НИР,",\n', closing: '"))' },
      { action: "type", text: "  ), // Руководитель отчёта\n", closing: ")" },

      // Параметры
      { action: "type", text: "  year: 2022,\n", closing: ")" },
      { action: "type", text: '  stage: (type: "вид отчёта", num: 1), // Этап отчёта\n', closing: ")" },
      { action: "type", text: '  federal: "Наименование федеральной программы",\n', closing: '")' },
      { action: "type", text: "  part: 2, // Номер книги отчёта\n", closing: ")" },
      { action: "type", text: '  city: "Город",\n', closing: '")' },

      // Исполнители (массив кортежей)
      { action: "type", text: "  performers: (\n", closing: "))" }, // Открыли массив
      { action: "type", text: "    (\n", closing: ")))" }, // Открыли кортеж (кортеж + массив + функция)
      { action: "type", text: '      name: "И.О. Фамилия",\n', closing: '")))' }, // Строка внутри
      { action: "type", text: '      position: "Должность",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" }, // Закрыли кортеж, остались в массиве
      { action: "type", text: "  ),\n", closing: ")" }, // Закрыли массив

      { action: "type", text: ")" }
    ]}
  />,
  <WorkshopSlide
    key="workshop-templates"
    title="Шаблоны титульных листов"
    subtitle="Мастерская"
    largePreview={true}
    hiddenPrefix={setupPrefix}
    steps={[
      { action: "type", text: "#show: gost.with(\n", closing: ")" },
      // Выбор пресета МАИ
      { action: "type", text: "  title-template: title-templates.mai-university-lab,\n", closing: ")" },

      // Блок института
      { action: "type", text: "  institute: (\n", closing: "))" },
      { action: "type", text: "    number: 3,\n", closing: "))" },
      { action: "type", text: '    name: "Системы управления, информатика и электроэнергетика",\n', closing: '"))' },
      { action: "type", text: "  ),\n", closing: ")" },

      // Блок кафедры
      { action: "type", text: "  department: (\n", closing: "))" },
      { action: "type", text: "    number: 307,\n", closing: "))" },
      { action: "type", text: '    name: "Цифровые технологии и информационные системы",\n', closing: '"))' },
      { action: "type", text: "  ),\n", closing: ")" },

      // Исполнители (в одну строку для компактности)
      { action: "type", text: "  performers: (\n", closing: "))" },
      { action: "type", text: '    (name: "Фамилия И.О.", position: "Студент"),\n', closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },

      // Тема работы
      { action: "type", text: "  bare-subject: false,\n", closing: ")" },
      { action: "type", text: '  subject: "Пользовательский интерфейс для работы с базой данных",\n', closing: '")' },

      // Руководитель
      { action: "type", text: '  manager: (name: "Фамилия И.О.", position: "Преподаватель"),\n', closing: ")" },

      { action: "type", text: '  city: "Москва",\n', closing: '")' },
      { action: "type", text: ")" }
    ]}
  />,
  <WorkshopSlide
    key="workshop-performers"
    title="Исполнители"
    subtitle="Мастерская"
    largePreview={true}
    hiddenPrefix={'#import "@preview/modern-g7-32:0.2.0": gost, abstract, appendixes\n\n#set page(fill: white, height: 400pt)\n\n'}
    typeSpeed={40}
    steps={[
      // === ПРИМЕР 1: Один исполнитель на титульном листе ===
      { action: "type", text: "#show: gost.with(\n", closing: ")" },
      { action: "type", text: "  performers: (\n", closing: "))" },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "И.И. Иванов",\n', closing: '")))' },
      { action: "type", text: '      position: "Руководитель",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "wait" },
      { action: "type", text: "    // Добавим ещё одного исполнителя\n", closing: "))" },
      { action: "pause", delay: 300 },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "И.П. Елисеев",\n', closing: '")))' },
      { action: "type", text: '      position: "Партнёр",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },
      { action: "type", text: ")" },
      { action: "wait" },
      { action: "clear" },

      { action: "prefix", text: '#import "@preview/modern-g7-32:0.2.0": gost, abstract, appendixes\n\n#set page(fill: white)\n#counter(page).update(2)\n\n' },

      // === ПРИМЕР 3: Добавляем части (part) и соисполнителя ===
      { action: "type", text: "#show: gost.with(\n  hide-title: true, // Отключаем титульный лист для демонстрации\n  force-performers: true, // Отключаем перенос на титульный лист\n  performers: (\n" },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "И.И. Иванов",\n', closing: '")))' },
      { action: "type", text: '      position: "Руководитель",\n', closing: '")))' },
      { action: "type", text: '      part: "введение, раздел 1",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "С.С. Сидоров",\n', closing: '")))' },
      { action: "type", text: '      position: "Соисполнитель",\n', closing: '")))' },
      { action: "type", text: "      co-performer: true,\n", closing: ")))" },
      { action: "type", text: '      part: "раздел 2",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "П.П. Петров",\n', closing: '")))' },
      { action: "type", text: '      position: "Исполнитель",\n', closing: '")))' },
      { action: "type", text: '      part: "раздел 1, 2",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },
      { action: "type", text: ")" },
      { action: "wait" },

      // === ПРИМЕР 4: Организации ===
      { action: "put", text: "#show: gost.with(\n  hide-title: true, // Отключаем титульный лист для демонстрации\n  force-performers: true, // Отключаем перенос на титульный лист\n  performers: (\n" },
      { action: "type", text: '    "ВИНИТИ РАН",\n', closing: '"))' },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "И.И. Иванов",\n', closing: '")))' },
      { action: "type", text: '      position: "Руководитель",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "А.А. Аванесов",\n', closing: '")))' },
      { action: "type", text: '      position: "Помощник",\n', closing: '")))' },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: '    "ГПНТБ России",\n', closing: '"))' },
      { action: "type", text: "    (\n", closing: ")))" },
      { action: "type", text: '      name: "М.А. Волков",\n', closing: '")))' },
      { action: "type", text: '      position: "Соисполнитель",\n', closing: '")))' },
      { action: "type", text: "      co-performer: true,\n", closing: ")))" },
      { action: "type", text: "    ),\n", closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },
      { action: "type", text: ")" },
    ]}
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
      { action: "type", text: ")[\n", closing: "" },
      { action: "type", text: "  Настоящий документ описывает шаблон.\n", closing: "]" },
      { action: "type", text: "  Количество страниц считается автоматически.\n", closing: "]" },
      { action: "type", text: "]\n" },
      { action: "pause", delay: 500 },
      { action: "type", text: "// Добавим страниц в отчёт\n" },
      { action: "pause", delay: 200 },
      { action: "prefix", text: contentPrefix + "\n#counter(page).update(12)\n" },
      { action: "pause", delay: 500 },
      { action: "type", text: "// Добавим таблиц в отчёт\n" },
      { action: "pause", delay: 200 },
      { action: "prefix", text: contentPrefix + '\n#counter(page).update(12)\n#counter("table").update(2)\n' },
      { action: "pause", delay: 500 },
      { action: "type", text: "// Добавим изображений в отчёт\n" },
      { action: "pause", delay: 200 },
      { action: "prefix", text: contentPrefix + '\n#counter(page).update(12)\n#counter("table").update(2)\n#counter("image").update(2)\n' },
      { action: "pause", delay: 500 },
      { action: "type", text: "// Добавим приложений в отчёт\n" },
      { action: "pause", delay: 200 },
      { action: "prefix", text: contentPrefix + '\n#counter(page).update(12)\n#counter("table").update(2)\n#counter("image").update(2)\n#counter("appendix").update(2)\n' },
    ]}
    typeSpeed={35}
  />,

  // 3. СОДЕРЖАНИЕ И ЗАГОЛОВКИ
  <WorkshopSlide
    key="workshop-outline"
    largePreview={true}
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
      { action: "type", text: "= Ещё заголовок\n" },
      { action: "type", text: "== Подзаголовок\n\n" },
      { action: "type", text: "// Рассмотрим приложения\n" },
      { action: "wait" },
      { action: "put", text: "#outline()\n\n" },
      { action: "pause", delay: 400 },
      { action: "type", text: "#show: appendixes\n" },
      { action: "type", text: "= Некоторое дополнение\n" },
      { action: "type", text: "== Подприложение\n" },
      { action: "type", text: "=== Подподприложение\n" },
      { action: "type", text: '#appendix-heading("основное", level: 1)[Приложение с указанием статуса]\n', closing: "]" },
      { action: "type", text: '#appendix-heading("дополнительное", level: 2)[Приложение с указанием статуса второго уровня]\n', closing: "]" },
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
      { action: "type", text: "    table.header([Параметр], [Знач.], [Ед.]),\n", closing: ")))" },
      { action: "pause", delay: 300 },
      { action: "type", text: "    [Мощность], [100], [Вт],\n", closing: "))" },
      { action: "type", text: "    [Вес], [2.5], [кг],\n", closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },
      { action: "type", text: "  caption: [Характеристики устройства]", closing: "])" },
      { action: "type", text: "\n) <specs> // Якорь таблицы\n\n" },
      { action: "pause", delay: 300 },
      { action: "type", text: "Смотреть таблицу @specs. // Кликабельная ссылка на таблицу" },
    ]}
    typeSpeed={35}
  />,

  // 5. РИСУНКИ
  <WorkshopSlide
    key="workshop-image"
    title="Рисунки"
    subtitle="Мастерская"
    assets={["home.jpg"]}
    hiddenPrefix={contentPrefix}
    steps={[
      { action: "type", text: "#figure(\n" },
      { action: "type", text: '  image("home.jpg", width: 80%),\n', closing: ")" },
      { action: "pause", delay: 400 },
      { action: "type", text: "  caption: [Интерьер]\n", closing: "])" },
      { action: "type", text: ") <interior>\n\n", closing: "" },
      { action: "wait", delay: 200 },
      { action: "type", text: "На рисунке @interior продемонстрирован красивый интерьер." },
    ]}
  />,

  // 6. ФОРМУЛЫ
  <WorkshopSlide
    key="workshop-equations"
    title="Формулы"
    subtitle="Мастерская"
    hiddenPrefix={contentPrefix}
    steps={[
      { action: "type", text: "*Расчет суммы:*\n", closing: "*" },
      { action: "type", text: "$ sum_(k=0)^n k = (n(n+1)) / 2 $ <sum>\n", closing: " $" },
      { action: "pause", delay: 400 },
      { action: "type", text: "Ссылка на уравнение @sum.\n\n", closing: "" },
      { action: "pause", delay: 400 },
      { action: "type", text: "*Матричное уравнение:\n*" },
      { action: "type", text: "$ mat(1, 2; 3, 4) * x = vec(5, 6) $\n\n", closing: " $" },
      { action: "pause", delay: 400 },
      { action: "type", text: "*Уравнение в строке:* $A = pi r^2$", closing: "$" },
    ]}
    typeSpeed={80}
  />,

  // 7. ЛИСТИНГИ КОДА
  <WorkshopSlide
    key="workshop-code"
    title="Листинги кода"
    subtitle="Мастерская"
    hiddenPrefix={contentPrefix}
    steps={[
      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: "  ```rust\n" },
      { action: "type", text: "    fn main() {\n", closing: "```)" },
      { action: "type", text: '      println!("Hello, World!");\n', closing: "```)" },
      { action: "type", text: "    }\n", closing: "  ```)" },
      { action: "type", text: "  ```,\n", closing: ")" },
      { action: "type", text: "  caption: [Код на Rust]\n", closing: "])" },
      { action: "type", text: ")" },
    ]}
    typeSpeed={35}
  />,

  <WorkshopSlide
    key="workshop-bibliography"
    title="Библиография"
    subtitle="Мастерская"
    largePreview={true}
    hiddenPrefix={contentPrefix}
    typeSpeed={10}
    pages={["references.bib", "main.typ"]}
    initialCode={{ "references.bib": "", "main.typ": "" }}
    steps={{
      "references.bib": [
        { action: "speed", speed: 1 },
        { action: "type", text: "@Book{gost,\n" },
        {
          action: "type",
          text: "    title = {ГОСТ 7.32–2017. Система стандартов по информации, библиотечному и издательскому делу. Отчет о научно-исследовательской работе. Структура и правила оформления},\n",
        },
        { action: "type", text: "    author = {{Стандартинформ}},\n" },
        { action: "type", text: "    year = {2017},\n" },
        { action: "type", text: "    publisher = {Стандартинформ},\n" },
        { action: "type", text: "    address = {М},\n" },
        { action: "type", text: "    pages = {32},\n" },
        { action: "type", text: "    language = {russian},\n    langid = {russian},\n" },
        { action: "type", text: "}\n\n" },

        { action: "type", text: "@misc{repo,\n" },
        { action: "type", text: "    author = {Елисеев П.А.},\n" },
        { action: "type", text: "    title = {Репозиторий проекта},\n" },
        { action: "type", text: "    note = {Github репозиторий},\n" },
        { action: "type", text: "    year = {2024},\n" },
        { action: "type", text: "    url = {https://github.com/f0rgenet/phone-table},\n" },
        { action: "type", text: "    media = {eresource},\n" },
        { action: "type", text: "    language = {russian},\n    langid = {russian},\n" },
        { action: "type", text: "}\n" },
        { action: "wait" },
      ],
      "main.typ": [
        { action: "speed", speed: 100 },
        { action: "type", text: "Проверка ссылки @gost и ещё одной ссылки @repo.\n\n", closing: "" },
        { action: "pause", delay: 500 },
        { action: "type", text: '#bibliography("', closing: '")' },
        { action: "type", text: 'references.bib")' },
        { action: "pause", delay: 200 },
        { action: "wait" }
      ]
    }}
  />,


  // 8. ПРИЛОЖЕНИЯ
  <WorkshopSlide
    key="workshop-appendixes"
    title="Приложения"
    subtitle="Мастерская"
    largePreview={true}
    assets={["nature.jpg", "home.jpg", "abstract.jpg"]}
    hiddenPrefix={contentPrefix}
    typeSpeed={10}
    steps={[
      // Включаем режим приложений
      { action: "type", text: "#show: appendixes\n\n", closing: "" },
      { action: "type", text: "= Приложение с элементами\n", closing: "" },

      // === РИСУНОК 1 ===
      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: '  image("nature.jpg", width: 50%),\n', closing: "))" },
      { action: "type", text: '  caption: "Пример изображения",\n', closing: ")" },
      { action: "type", text: ") <example-image>\n\n", closing: "" },
      { action: "type", text: "Ссылка на рисунок @example-image.\n\n", closing: "" },

      // === РИСУНОК 2 ===
      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: '  image("home.jpg", width: 50%),\n', closing: "))" },
      { action: "type", text: '  caption: "Пример изображения",\n', closing: '")' },
      { action: "type", text: ") <another-image>\n\n", closing: "" },
      { action: "type", text: "Ссылка на рисунок @another-image.\n\n", closing: "" },

      { action: "wait" },

      { action: "put", text: "#show: appendixes\n\n= Приложение с элементами\n" },
      { action: "type", text: "== Некоторая таблица\n" },

      // === ТАБЛИЦА ===
      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: "  table(\n", closing: "))" },
      { action: "type", text: "    columns: 4,\n", closing: "))" },
      // Хедер таблицы
      { action: "type", text: "    table.header([Заголовок 1], [Заголовок 2], [Заголовок 3], [Заголовок 4]),\n", closing: ")))" },
      // Тело таблицы
      { action: "type", text: "    [Элемент 1], [Элемент 2], [Элемент 3], [Элемент 4],\n", closing: "))" },
      { action: "type", text: "    [Элемент 5], [Элемент 6], [Элемент 7], [Элемент 8],\n", closing: "))" },
      { action: "type", text: "    [Элемент 9], [Элемент 10], [Элемент 11], [Элемент 12],\n", closing: "))" },
      { action: "type", text: "  ),\n", closing: ")" },
      { action: "type", text: '  caption: "Таблица с заголовками",\n', closing: '")' },
      { action: "type", text: ") <example-table>\n\n", closing: "" },
      { action: "type", text: "Ссылка на таблицу @example-table.\n\n", closing: "" },

      { action: "type", text: "== Некоторый код\n" },

      // === ЛИСТИНГ КОДА ===
      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: "  ```cpp\n", closing: "```)" }, // Закрываем raw блок и фигуру
      { action: "type", text: "  #include <iostream>\n\n", closing: "```)" },
      { action: "type", text: "  int main() {\n", closing: "```" },
      { action: "type", text: '      std::cout << "Hello, world!" << std::endl;\n', closing: "```)" },
      { action: "type", text: "      return 0;\n", closing: "```)" },
      { action: "type", text: "  }\n", closing: "```)" },
      { action: "type", text: "  ```,\n", closing: ")" },
      { action: "type", text: "  caption: [Пример кода на C++],\n", closing: '])' },
      { action: "type", text: ") <example-code>\n\n", closing: "" },
      { action: "type", text: "Ссылка на листинг @example-code.\n\n", closing: "" },
      { action: "wait" },

      // === ВЛОЖЕННЫЕ ЗАГОЛОВКИ И СТАТУСЫ ===
      { action: "put", text: "#show: appendixes\n\n= Заголовок приложений второго уровня\n" },
      { action: "type", text: "== Некоторое приложение\n\n", closing: "" },

      { action: "type", text: "#figure(\n", closing: ")" },
      { action: "type", text: '  image("abstract.jpg", width: 50%),\n', closing: "))" },
      { action: "type", text: '  caption: "Пример изображения",\n', closing: '")' },
      { action: "type", text: ") <third-image>\n\n", closing: "" },
      { action: "type", text: "Ссылка на рисунок @third-image.\n\n", closing: "" },

      { action: "type", text: "= Заголовок приложения\n\n", closing: "" },
      { action: "type", text: "== Очередной заголовок приложения\n\n", closing: "" },

      // Специфичные функции appendix-heading
      { action: "type", text: "#appendix-heading(\n", closing: ")[]" }, // Добавляем [] для контента
      { action: "type", text: '  "вспомогательное",\n', closing: ")[]" },
      { action: "type", text: "  level: 2,\n", closing: ")[]" },
      { action: "type", text: ")[Приложение с указанием статуса второго уровня]\n\n", closing: "]" },

      { action: "type", text: '#appendix-heading("основное", level: 1)[Приложение с указанием статуса]', closing: "]" },
    ]}
  />

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

            // Переход ко второму примеру
            { action: "wait" },
            { action: "clear" },

            // Пример 2: Игра Soviet Matrix
            { action: "type", text: "#import \"@preview/soviet-matrix:0.2.1\": game\n" },
            { action: "type", text: "#show: game.with(seed: 123)\n\n" },
            { action: "type", text: "aaeadeffdddfdddeaeafaaafaadfaaeddeddeddfdddfdedddddfaaef\n" },
            { action: "type", text: "aeedededddfsaceeedfceafeaaafeefdddfddddfdddfaaaddddafadd\n" },
            { action: "type", text: "ddddfaeafeaaaaf" },
          ]}
          typeSpeed={50}
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
            { icon: Users, title: "Список исполнителей", description: "Автоматическое оформление списка исполнителей" },
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
