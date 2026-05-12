// Ждём полной загрузки HTML-структуры перед выполнением скрипта
document.addEventListener("DOMContentLoaded", function() {

  // ПРОВЕРКА: убеждаемся, что все необходимые библиотеки загружены
  // Если хоть одной нет - отключаем JavaScript анимации (убираем класс js)
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    document.documentElement.classList.remove("js");
  } else {
    // БЛОК АНИМАЦИЙ - выполняется только если все библиотеки на месте
    const { gsap, ScrollTrigger, Lenis } = window;

    // РЕГИСТРАЦИЯ ПЛАГИНА: подключаем ScrollTrigger к GSAP
    gsap.registerPlugin(ScrollTrigger);

    // НАСТРОЙКА ПЛАВНОЙ ПРОКРУТКИ (Lenis)
    // Lenis - это библиотека, которая делает скролл очень плавным, как на iPhone
    const lenis = new Lenis({
      duration: 1.15,      // Длительность анимации скролла
      smoothWheel: true,   // Плавность при вращении колёсика мыши
      wheelMultiplier: 0.95,  // Чувствительность колёсика
      touchMultiplier: 1.2,   // Чувствительность для тачпада/телефона
      infinite: false      // Отключаем бесконечную прокрутку
    });

    // СВЯЗКА Lenis И ScrollTrigger: при скролле обновляем триггеры анимаций
    lenis.on("scroll", ScrollTrigger.update);

    // ИНТЕГРАЦИЯ Lenis В GSAP: синхронизируем их циклы анимации
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);  // raf = requestAnimationFrame
    });

    // ОПТИМИЗАЦИЯ: отключаем сглаживание задержек в GSAP
    gsap.ticker.lagSmoothing(0);

    // ОБРАБОТЧИК ЯКОРНЫХ ССЫЛОК (ссылки вида #section)
    // Находим все ссылки, которые ведут на ID элементов внутри страницы
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("href");
        
        // Защита от пустых ссылок
        if (!targetSelector || targetSelector === "#") {
          return;
        }
        
        const target = document.querySelector(targetSelector);
        
        // Если элемент с таким ID не найден - выходим
        if (!target) {
          return;
        }
        
        // Отменяем стандартное поведение браузера (мгновенный прыжок)
        event.preventDefault();
        
        // Используем Lenis для ПЛАВНОЙ прокрутки к цели
        lenis.scrollTo(target, {
          offset: -24,    // Смещение от верхнего края (чтобы шапка не перекрывала)
          duration: 1.2   // Длительность анимации прокрутки
        });
      });
    });

    // === АНИМАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ (Intro Timeline) ===
    const introTimeline = gsap.timeline({
      defaults: {
        ease: "power3.out"  // Плавная кривая ускорения
      }
    });

    // Последовательное появление элементов:
    introTimeline
      // 1. Появление шапки сайта (выезжает сверху)
      .from(".site-header", {
        y: -24,          // Начальная позиция: выше на 24px
        opacity: 0,      // Начальная прозрачность: полностью прозрачный
        duration: 0.9    // Длительность: 0.9 секунды
      })
      // 2. Появление строк заголовка (выезжают снизу с задержкой между строками)
      .from(
        ".title-line",
        {
          yPercent: 120,   // Сдвиг на 120% от своей высоты (снизу)
          opacity: 0,
          duration: 1.15,
          stagger: 0.12    // Задержка между анимацией каждой строки: 0.12с
        },
        "-=0.45"           // Начинаем за 0.45с до окончания предыдущей анимации
      )
      // 3. Появление карточек в hero-блоке
      .from(
        ".hero-card",
        {
          y: 38,           // Сдвиг вниз на 38px
          opacity: 0,
          duration: 1,
          stagger: 0.16    // Каждая следующая карточка появляется через 0.16с
        },
        "-=0.7"            // Перекрываем с предыдущей анимацией
      )
      // 4. Появление орбит (декоративных кругов)
      .from(
        ".hero-orbit",
        {
          scale: 0.86,     // Начинаем с уменьшенного размера
          opacity: 0,
          duration: 1.2,
          stagger: 0.12
        },
        "-=0.95"
      );

    // === АНИМАЦИИ ПРИ ПРОКРУТКЕ (Scroll Reveal) ===
    // Находим все элементы с атрибутом data-reveal
    // Появляются, когда пользователь доскроллит до них
    gsap.utils.toArray("[data-reveal]").forEach((element) => {
      gsap.to(element, {
        opacity: 1,        // Становятся видимыми
        y: 0,              // Возвращаются на исходную позицию
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,   // Какой элемент отслеживаем
          start: "top 86%"    // Анимация запускается, когда верх элемента доходит до 86% высоты окна
        }
      });
    });

    // === ПАРАЛЛАКС ЭФФЕКТЫ ===
    // Эффект параллакса для текста hero-блока (медленное смещение при скролле)
    gsap.to(".hero-copy", {
      yPercent: -10,       // Смещается вверх на 10% при скролле
      ease: "none",        // Без смягчения (линейно)
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",      // Начинаем, когда верх hero касается верха экрана
        end: "bottom top",     // Заканчиваем, когда низ hero доходит до верха экрана
        scrub: true            // Анимация привязана к скроллу (чем больше скролл - тем больше смещение)
      }
    });

    // Параллакс для визуальной части hero-блока
    gsap.to(".hero-visual", {
      yPercent: -14,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // УНИВЕРСАЛЬНЫЙ ПАРАЛЛАКС: для элементов с атрибутом data-parallax
    // Скорость задаётся через data-speed (чем больше число - тем быстрее)
    gsap.utils.toArray("[data-parallax]").forEach((element) => {
      const speed = Number(element.dataset.speed || 0.1);  // Берём значение из атрибута или 0.1 по умолчанию
      
      gsap.to(element, {
        yPercent: speed * -100,   // Смещение зависит от скорости
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",    // Начинаем, когда верх элемента доходит до низа окна
          end: "bottom top",      // Заканчиваем, когда низ элемента доходит до верха окна
          scrub: true
        }
      });
    });

    // Эффект градиента для контактной панели (фон перемещается при скролле)
    gsap.to(".contact-panel", {
      backgroundPosition: "100% 50%",   // Смещаем фон вправо
      ease: "none",
      scrollTrigger: {
        trigger: ".contact",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
      }
    });

    // === АДАПТИВНЫЕ АНИМАЦИИ (разное поведение на разных экранах) ===
    const mm = gsap.matchMedia();
    
    // Эта анимация работает ТОЛЬКО на экранах шире 901px
    mm.add("(min-width: 901px)", () => {
      const showcaseSection = document.querySelector(".showcase");
      const showcaseTrack = document.querySelector(".showcase-track");
      
      // Защита: если элементов нет - выходим
      if (!showcaseSection || !showcaseTrack) {
        return undefined;
      }
      
      // Функция: рассчитывает дистанцию, на которую нужно сдвинуть горизонтальный слайдер
      const getDistance = () =>
        Math.max(0, showcaseTrack.scrollWidth - showcaseSection.clientWidth);
      
      // ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА: при вертикальном скролле слайдер движется влево
      const tween = gsap.to(showcaseTrack, {
        x: () => -getDistance(),   // Сдвигаем на всю ширину контента
        ease: "none",
        scrollTrigger: {
          trigger: showcaseSection,
          start: "top top",               // Начинаем, когда секция касается верха
          end: () => `+=${getDistance() + window.innerHeight * 0.45}`, // Длительность зависит от ширины контента
          pin: true,                      // Фиксируем (pin) секцию во время скролла
          scrub: 1,                       // Анимация сцельна со скроллом, плавность 1
          invalidateOnRefresh: true       // Пересчитываем при изменении размера окна
        }
      });
      
      // АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК с лёгким наклоном
      gsap.from(".showcase-card", {
        rotate: (index) => (index % 2 === 0 ? 5 : -5),  // Чётные наклоняются вправо, нечётные - влево
        y: 30,                       // Сдвиг вниз
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,               // Каждая карточка появляется с задержкой
        ease: "power3.out",
        scrollTrigger: {
          trigger: showcaseSection,
          start: "top 60%"           // Начинаем, когда секция достигает 60% окна
        }
      });
      
      // Функция очистки (вызывается при уничтожении анимации)
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    
    // === БЕСКОНЕЧНЫЕ АНИМАЦИИ (вращение орбит) ===
    // Первая орбита вращается по часовой стрелке, полный оборот за 22 секунды
    gsap.to(".hero-orbit--one", {
      rotate: 360,
      duration: 22,
      repeat: -1,      // Бесконечное повторение
      ease: "none"     // Без ускорения (равномерное вращение)
    });
    
    // Вторая орбита вращается против часовой стрелки, медленнее (28 секунд)
    gsap.to(".hero-orbit--two", {
      rotate: -360,
      duration: 28,
      repeat: -1,
      ease: "none"
    });
    
    // === ФИНАЛЬНЫЙ РАСЧЁТ ВСЕХ ТРИГГЕРОВ ===
    // Обновляем ScrollTrigger, чтобы пересчитать все позиции (особенно после загрузки изображений)
    ScrollTrigger.refresh();
  }
});