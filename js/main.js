// ONE PAGE SCROLL (OPS)
const sections = $(".section");       // Все секции
const display = $(".main-content");   // То, что будем двигать
let inScroll = false;                 // Переменная состояния (флаг). false потому что при загрузке страница не прокручивается (обработчики не выполняются)

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

const setActiveMenuItem = itemEq => {         // Проставляет класс active для активной кнопки (точки) в фиксированном меню справа на странице
  $('.fixed-menu__item').
    eq(itemEq).
    addClass('active')
    .siblings().
    removeClass('active')
} 

const performTransition = sectionEq => {      // Функция перемещения с номером секции (sectionEq), к которой нужно прокрутить (операции, связаны с анимацией)
  const position = `${sectionEq * -100}%`;    // Расчёт позиции останова при прокручивании. 100% - высота одной секции

  if (inScroll) return;                       // Если прокрутка уже происходит, функция перемещения (ниже) работать не будет

  inScroll = true;                            

  sections                                      
    .eq(sectionEq)                              // Из всех секций находим нужную. sectionEq - номер секции в списке из всех секций (считая с 0)
    .addClass("active")                         // Навешивание на секцию класса active. Так мы будем отслеживать какая секция отображается на экране в данный момент. И какая секция предыдущая а какая следующая 
    .siblings()
    .removeClass("active");                     // Затирание класса active у секции, с которой мы переходим к следующей, которая теперь сама становится active (см. выше)

  display.css({                                 // Двигает скролл (tranform прописан в css-коде с добавлением свойства will-change)
    transform: `translate(0, ${position})`,
    "-webkit-transform": `translate(0, ${position})`
  });

  setTimeout(() => {                            // Функция для борьбы с проскакиванием секций при прокрутке за счёт инерции. Результат её работы: одно движение - одна секция
    inScroll = false;
    setActiveMenuItem(sectionEq);
  }, 1300);                                     // продолжительность анимации + 300мсек - потому что закончится инерция
};

const scrollToSection = direction => {          // Будем передавать этой функции направление прокрутки - вниз или вверх
  const activeSection = sections.filter(".active"); // Показывает какая секция сейчас активна и выбирает её
  const nextSection = activeSection.next();       // Следующая от активной секция
  const prevSection = activeSection.prev();       // Предыдущая от активной секция

  if (direction === "up" && prevSection.length) { // Прокручивание вверх при условии, что предыдущая по отношению к активной секция существует (prevSection.length <> 0)
    performTransition(prevSection.index());
  }

  if (direction === "down" && nextSection.length) {   // Прокручивание вниз при условии, что следующая по отношению к активной секция существует (nextSection.length <> 0)
    performTransition(nextSection.index());
  }
};

$(document).on({
  wheel: e => {
    const deltaY = e.originalEvent.deltaY;
    const direction = deltaY > 0 ? "down" : "up";

    scrollToSection(direction);
  },
  keydown: e => {                                               // Функция прокрутки секций по командам с клавиатуры (стрелками вниз и вверх)
    switch (e.keyCode) {
      case 40:                                                  // Код клавиши стрелки вниз
        scrollToSection("down");                                // Прокрутка вниз
        break;

      case 38:                                                  // Код клавиши стрелки вверх
        scrollToSection("up");                                  // Прокрутка вверх
        break;        
    }
  },

  touchmove: e => e.preventDefault()                            // touchmove - на мобильнике "нажато и двигается палец". Операция предотвращает появление белой полосы перед 1-й секцией и последующими секциями при перелистывании пальцем на тач-устройствах

  // touchstart touchend touchmove                              // Прокрутка вверх
});

$('[data-scroll-to]').on('click', e => {                        // Блок прокрутки по пунктам меню навигации
  e.preventDefault();

  const target = parseInt($(e.currentTarget).attr('data-scroll-to')); // Берётся значение атрибута data-scroll-to. parseInt из строки делает число, currentTarget определяет цель для события (оно всегда обращается к элементу, к которому присоединён обработчик собьтия, в отличие от target, который определяет элемент, с которым произошло событие)


  performTransition(target);                                    // Переход к нужной секции

})

// $(window).swipe({
//   swipe: function(event, direction) {
    // alert(direction);

//     const nextOrPrev = direction === "up" ? "next" : "prev";
//     scrollToSection(nextOrPrev);
//   }
// })

if (isMobile) {
  $(document).swipe({
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
      /**
       * плагин возвращает фактическое...
       * ...
       */
      const scrollDirection = direction === 'down' ? 'up' : 'down';
      
      scrollToSection(scrollDirection);
    }
  });
}


// МЕНЮ-ГАМБУРГЕР
const burger = document.querySelector(".hamburger-menu");
const navBlock = document.querySelector(".nav");

burger.addEventListener("click", function() {
  burger.classList.toggle("active");
  navBlock.classList.toggle("active");
  document.body.classList.toggle("hidden");
});


// КАРУСЕЛЬ
$(document).ready(function() {
  const owl = $(".owl-carousel");
  owl.owlCarousel({
    center: true,
    items: 1,
    loop: true
    // autoplay: true,
    // autoplayTimeout: 3000,
    // navSpeed: 1000
  });
  // Следующий слайд
  $(".next").click(function() {
    console.log("next");
    owl.trigger("next.owl.carousel");
  });
  //  Предыдущий слайд
  $(".prev").click(function() {
    console.log("prev");
    owl.trigger("prev.owl.carousel");
  });
});


// АККОРДЕОН СЕКЦИИ TEAM
const teamItems = document.querySelectorAll(".accordeon__item");

teamItems.forEach(el => {
  el.addEventListener("click", function() {
    addClass(el);
    removeClass(el);
  });
});

function addClass(element) {
  if (element.classList.contains("active")) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
  }
}

function removeClass(element) {
  teamItems.forEach(item => {
    if (item.dataset.member !== element.dataset.member) {
      item.classList.remove("active");
    }
  });
}


// АККОРДЕОН СЕКЦИИ MENU
const items = document.querySelectorAll(".menu__item");

for (const item of items) {
  item.addEventListener("click", handleAccordeonOpening);
}

function handleAccordeonOpening(event) {
  event.preventDefault();
  const currentItem = event.currentTarget;
  const isClosedItem = currentItem.classList.contains("active-menu");

  if (isClosedItem) {
    closeItemsAndRemoveActiveClass(items);
  } else {
    closeItemsAndRemoveActiveClass(items);
    openItem(currentItem);
  }
}

function closeItemsAndRemoveActiveClass(items) {
  Array.from(items).forEach(elements => {
    elements.classList.remove("active-menu");
  });
}

function openItem(item) {
  item.classList.add("active-menu");
}


// МОДАЛЬНОЕ ОКНО СЕКЦИИ REVIEWS
const reviewButtons = document.querySelectorAll(".reviews__btn");
const reviewPopup = document.querySelector(".popup");
const reviewClose = document.querySelector(".popup__close");
reviewClose.addEventListener("click", () =>
  reviewPopup.classList.remove("active")
);

reviewButtons.forEach(item => {
  item.addEventListener("click", function(e) {
    e.preventDefault();
    const parent = item.parentNode;
    const title = parent.querySelector(".reviews__title").innerHTML;
    const text = parent.querySelector(".review__paragraph").innerHTML;
    reviewPopup.classList.add("active");
    reviewPopup.querySelector(".popup__title").innerHTML = title;
    reviewPopup.querySelector(".popup__text").innerHTML = text;
  });
});


// ВИДЕОПЛЕЙЕР СЕКЦИИ HOW-WE-WORK (YOUTUBE API)
let player;                           // Плагин создаст iframe и сохранит его в качестве объекта в этой переменной, откуда мы сможем вызывать нужные значения
                                      // Переменная и функция ниже - кусок кода из https://developers.google.com/youtube/frame_api_reference п.3

function onYouTubeIframeAPIReady() {  // Функция зашита в JS, который подтянется по скрипту https://www.youtube.com/iframe_api
  player = new YT.Player("yt-player", {
    width: "660",
    height: "405",
    videoId: "zmg_jOwa9Fc",
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {           // Функция выполняется после того, как загружен плейер
  const duration = player.getDuration();  // Продолжительность воспроизводимого видео
  let interval;                           // Сколько прошло с начала воспроизведения видео
  updateTimerDisplay();                   // Обновление таймера (см. ниже) при запуске плейера

  $(".player").removeClass("hidden");

  clearInterval(interval);                // Очистка (удаление значения) переменной интервала перед каждым последующим обращением к нему. Мера предосторожности против появления нескольких значений одновременно

  interval = setInterval(() => {          // Опрос интервала каждую секунду (1000 мсек)
    const completed = player.getCurrentTime();  // Время прошедшее с начала воспроизведения записи
    const percents = (completed / duration) * 100;  // Процент сдвига вправо ползунка воспроизводимого видео - прошедщее время воспроизведения видео делёное на его продолжительность 

    changeButtonPosition(percents);

    updateTimerDisplay();
  }, 1000);
}

function onPlayerStateChange(event) {
  const playerButton = $(".player__start");     // Кнопка воспроизведения видео
  switch (event.data) {
    case 1:                                     // Если видео проигрывается (см. строку 284), то
      $(".player__wrapper").addClass("active"); // Путем навешивания класса active у проигрываемого видео убирается сплэш-экран
      playerButton.addClass("paused");          // ... заменить картинку воспроизведения на картинку паузы
      break;
    case 2:                                     // Если видео поставлено на паузу (см. строку 284), то
      playerButton.removeClass("paused");
      break;
  }
}

$(".player__start").on("click", e => {          // Определение состояния плейера и воспроизведение либо остановка воспроизведения видео в зависимости от него
  const playerStatus = player.getPlayerState(); // 0 - видео кончилось, 1 - видео проигрывается, 2 - видео поставлено на паузу ...

  if (playerStatus !== 1) {                     // Если видео в данный момент не проигрывается, ...
    player.playVideo();                         // ... проиграть - https://developers.google.com/youtube/frame_api_reference
  } else {
    player.pauseVideo();                        // ... поставить воспроизведение на паузу - https://developers.google.com/youtube/frame_api_reference
  }
});

$(".player__playback").on("click", e => {       // Функция перемотки через щелчок на отрезке воспроизведения видео
  e.preventDefault();
  const bar = $(e.currentTarget);               // Сам временной отрезок воспроизведения
  const newButtonPosition = e.pageX - bar.offset().left;
  const clickedPercents = (newButtonPosition / bar.width()) * 100; // Положение места клика на отрезке воспроизведение видео, рассчитаное в %-ах делением отметки, по которой был произведён клик на общую длину временного отрезка видео
  const newPlayerTime = (player.getDuration() / 100) * clickedPercents; // Установка ползунка плейера в нужное положение, используя вычесленный ранее % 

  changeButtonPosition(clickedPercents);
  player.seekTo(newPlayerTime);                 // Переход плейера на нужную секунду, исходя из выполненных ранее вычислений (см. выше)
});

$(".player__splash").on("click", e => {         // Функция начала воспроизведения видео по клику на заставке (splash screen)
  player.playVideo();
});

function changeButtonPosition(percents) {       // Функция сдвига вправо ползунка воспроизводимого видео (см. выше)
  $(".player__playback-button").css({           // Изменение свойства left в css-коде (стиле) кнопки-ползунка - сдвиг слева направо
    left: `${percents}%`                        // См. выше строку 262. Обязательно нужно указывать единицы измерения (здесь - проценты) иначе работать не будет
  });
}

function updateTimerDisplay() {                 // Вынесенная отдельная функция перезаписи временнЫх блочков
  $(".player__duration-completed").text(formatTime(player.getCurrentTime())); // Время прошедшее с начала воспроизведения видео
  $(".player__duration-estimate").text(formatTime(player.getDuration()));     // Время до конца воспроизводимого видео
}

function formatTime(time) {                     // Функция преобразования времени записи с секунд в минуты:секунды
  const roundTime = Math.round(time);           // Текущее время записи с округлением (нужно т.к. браузер считает в дробных секундах)

  const minutes = Math.floor(roundTime / 60);   // Минуты (время из предыдущей строки, делённое на 60)
  const seconds = roundTime - minutes * 60;     // Секунды (общее время в секундах минус минуты из предыдущей строки в секундах)
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds; // Если количество секунд меньше 10, перед цифрой секунд ставится 0, если больше - просто количество секунд

  return minutes + ":" + formatedSeconds;       // Возвращает минуты, ':' и отформатированные (см. выше) секунды
}


// ФОРМА ДОСТАВКИ СЕКЦИИ ORDER
// const deliveryForm = document.getElementById("order-form");

// deliveryForm.onsubmit = function(event) {
//     event.preventDefault();
//     const formData = new FormData(deliveryForm);
//     formData.append("to", "superemail@mail.ru");
//     const request = new XMLHttpRequest();
//     request.open("POST", "https://webdev-api.loftschool.com/sendmail");
//     request.send(formData);
//     request.addEventListener("load", function () {
//         const response = JSON.parse(request.response);
//         if (response.status) {
//             alert("Благодарим за Ваш заказ!");
//         };
//     });
// };


// КАРТА (ЯНДЕКС API)
ymaps.ready(init);            // ymaps - пространство имён, через которое осуществляется доступ к компонентам карты 

var placemarks = [            // JSON с метками на карте
  {
      latitude: 59.97,
      longitude: 30.31,
      hintContent: 'Это хинт',
      balloonContent: 'Это балун'
  },
  {
      latitude: 59.94,
      longitude: 30.25,
      hintContent: 'Это хинт',
      balloonContent: 'Это балун'
  },
  {
      latitude: 59.93,
      longitude: 30.34,
      hintContent: 'Это хинт',
      balloonContent: 'Это балун'
  }
],
  geoObjects= [];                           // Пустой массив

function init() {                           // Конструктор карты с привязкой к id='map'
    var map = new ymaps.Map('map', {
        center: [59.94, 30.32],             // Широта и долгота центра карты
        zoom: 12,                           // Коэффициент увеличения масштаба карты
        controls: ['zoomControl'],          // Из элементов управления картой будет доступен только ползунок масштаба карты
        behaviors: ['drag']                 // Отключается увеличение карты при прокрутке страницы. Отключено всё поведение карты по умолчанию за исключением перетаскивания удерживая нажатой левую кнопку мыши
    });

    for (var i = 0; i < placemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude],  // Координаты центра отметки на карте
            {
                hintContent: placemarks[i].hintContent,
                balloonContent: placemarks[i].balloonContent
            },
            {
                iconLayout: 'default#image',
                iconImageHref: '../img/content/map/map-marker.png',
                iconImageSize: [46, 57],               // Размеры изображения маркера 
                iconImageOffset: [-23, -57],         // Точка на карте соответствует верхнему левому углу, такое выражение заставляет иконку встать так, чтобы дому на карте соответствовала её ножка 
                // iconImageClipRect: [[415, 0], [461, 57]] // Для спрайта (область нужной иконки)
            });
    }

    var clusterer = new ymaps.Clusterer({              // Функция-конструктор. Кластер - совокупность близлежащих меток, которая может рассматриваться как самостоятельная единица, обладающая определёнными свойствами
        clusterIcons: [                                // Иконка для кластера 
            {
                href: '../img/content/hero/burger.png', // Путь к иконке
                size: [45, 42],                         // Размер иконки  
                offset: [-22.5, -21]                    // Отступ
            }
        ],
        clusterIconContentLayout: null                // Убирает видимое значение количества меток в кластере
    });

    map.geoObjects.add(clusterer);                    // Добавление объектов в кластер
    clusterer.add(geoObjects);
}