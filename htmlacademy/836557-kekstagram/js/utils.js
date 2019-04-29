'use strict';

(function () {

  window.utils = {

    /*
   *
   * Returns a number whose value is limited to the given range.
   *
   * Example: limit the output of this computation to between 0 and 255
   * (x * 255).clamp(0, 255)
   *
   * @param {Number} min The lower boundary of the output range
   * @param {Number} max The upper boundary of the output range
   * @returns A number in the range [min, max]
   * @type Number
   */
    clamp: function (value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    /* функция возвращает значение от 0 до 1 при перетаскивании пина мышью*/
    moveSliderPin: function (sliderElement, sliderPin, cb) {
      sliderPin.addEventListener('mousedown', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var sliderWidth = sliderElement.getBoundingClientRect().width;
        var sliderCoordX = sliderElement.getBoundingClientRect().left;

        var onMouseMove = function (moveEv) {
          moveEv.preventDefault();
          var newCoordX = moveEv.clientX;

          var sliderValue = (newCoordX - sliderCoordX) / sliderWidth;

          cb(window.utils.clamp(sliderValue, 0, 1));

        };

        var onMouseUp = function (upEv) {
          upEv.preventDefault();
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

      });

    },

    /* Функция выбирает заданное количество случайных элементов из массива и формирует из них новый массив*/
    getRandomPictures: function (inputArrayOfElements, maxNumberOfElements) {
      inputArrayOfElements = inputArrayOfElements.slice();

      if (inputArrayOfElements.length < maxNumberOfElements) {
        maxNumberOfElements = inputArrayOfElements.length;
      }

      var randomElements = [];

      while (randomElements.length < maxNumberOfElements) {
        var randomIndex = Math.floor(Math.random() * inputArrayOfElements.length);
        randomElements.push(inputArrayOfElements[randomIndex]);
        inputArrayOfElements.splice(randomIndex, 1);
      }
      return randomElements;
    },

    /* Функция создает фрагмент разметки и вставляет его в заданное место*/
    createDomElements: function (dataArray, elementGenerator, positionInDom) {
      var fragment = document.createDocumentFragment();

      dataArray.forEach(function (data) {
        fragment.appendChild(elementGenerator(data));
      });

      positionInDom.appendChild(fragment);
    },

    /* отправляем форму*/
    makeFormAjax: function (form, cb) {
      var URL = form.action;

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var formData = new FormData(form);

        window.backend.postData(URL, formData)
          .then(function () {
            return cb(null);
          })
          .catch(function (error) {
            return cb(error);
          });

      });
    },

    /* проверка на наличие одинаковых элементов в массиве*/
    findDuplicates: function (array, cb) {
      var values = {};
      array.forEach(function (element) {
        if (element in values) {
          return cb();
        }
        values[element] = true;
        return false;
      });
    },

    //  удаляем элемент по клику
    removeElementByClick: function (ev, element) {
      ev.preventDefault();
      ev.stopPropagation();
      element.remove();
    },

    //  удаляем элемент по Esc
    removeElementByEsc: function (ev, element) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        element.remove();
      }
    },

    // «устранение дребезга». debounceInterval в ms
    debounce: function (f, delay) {
      var lastTimeout;
      return function () {

        if (lastTimeout) {
          clearTimeout(lastTimeout);
        }
        var args = Array.from(arguments);
        lastTimeout = setTimeout(function () {
          f.apply(null, args);
        }, delay);
      };
    },

  };

})();
