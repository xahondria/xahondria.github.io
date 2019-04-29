'use strict';

(function () {

  /* Класс описывает редактор загружаемых изображений*/
  var PictureUploader = function PictureUploader() {
    var $this = this;
    this.element = document.querySelector('.img-upload');

    this.uploadOverlay = this.element.querySelector('.img-upload__overlay');
    this.uploadOverlayHideButton = this.element.querySelector('.img-upload__cancel');
    this.inputFile = this.element.querySelector('#upload-file');

    // масштаб увеличенного изображения
    this.scaleControlSmaller = this.element.querySelector('.scale__control--smaller');
    this.scaleControlBigger = this.element.querySelector('.scale__control--bigger');
    this.scaleControlValue = this.element.querySelector('.scale__control--value');
    this.scaleControlValueDefault = 100;
    this.scaleControlValueCurrent = 100;

    this.effectLevelPin = this.element.querySelector('.effect-level__pin');
    this.effectLevelLine = this.element.querySelector('.effect-level__line');
    this.effectLevelDepth = this.element.querySelector('.effect-level__depth');
    this.effectLevel = this.element.querySelector('.effect-level__value');

    this.effectsRadio = this.element.querySelectorAll('.effects__radio');
    this.defaultEffect = this.element.querySelector('#effect-heat');
    this.defaultEffectValue = 1;
    this.currentEffectValue = this.defaultEffect.value;

    this.slider = this.element.querySelector('.img-upload__effect-level');

    this.picture = this.element.querySelector('.img-upload__preview img');

    this.hashtagsInput = this.element.querySelector('.text__hashtags');
    this.pictureDescription = this.element.querySelector('.text__description');

    this.uploadSuccessTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');

    this.uploadErrorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

    this.main = document.querySelector('main');

    this.form = this.element.querySelector('.img-upload__form');

    window.utils.makeFormAjax(this.form, function (error) {
      if (error) {
        $this.hide();
        $this.errorPopupEvents();

      } else {
        $this.hide();
        $this.successPopupEvents();
      }

    });

  };

  PictureUploader.prototype.show = function () {
    this.uploadOverlay.classList.remove('hidden');
    window.addEventListener('keydown', this.onEscape);
  };

  PictureUploader.prototype.hide = function () {
    this.uploadOverlay.classList.add('hidden');
    this.inputFile.value = '';
    this.hashtagsInput.value = '';
    this.pictureDescription.value = '';
    window.removeEventListener('keydown', this.onEscape);
  };

  /**
   * @param {HTMLInputElement} effect checkbox element
   */
  PictureUploader.prototype.setEffect = function (effect) {
    if (!effect.checked) {
      this.picture.className = '';
      return;
    }
    this.currentEffectValue = effect.value;
    this.picture.className = 'effects__preview--' + effect.value;

    this.setEffectValue(this.defaultEffectValue);
    this.effectLevelPin.style.left = 100 * this.defaultEffectValue + '%';
    this.effectLevelDepth.style.width = 100 * this.defaultEffectValue + '%';

  };

  /* События*/
  PictureUploader.prototype.bindEvents = function () {
    if (this.__eventsBinded__) {
      return;
    }
    this.__eventsBinded__ = true;

    this.bindPopupEvents();
    this.bindEffectEvents();
    this.validateForm();
    this.bindScaleEvents();

  };

  /* События попапа*/
  PictureUploader.prototype.bindPopupEvents = function () {
    var $this = this;
    // Открываем попап
    this.inputFile.addEventListener('change', function (ev) {
      ev.preventDefault();
      if ($this.inputFile.files.length > 0) {
        $this.loadImage($this.inputFile.files[0], function (err, imgURL) {
          if (err) {
            // TODO show error
            return;
          }
          $this.picture.src = imgURL;
          $this.defaultEffect.checked = true;
          $this.setEffect($this.defaultEffect);
          $this.scaleControlValueCurrent = $this.scaleControlValueDefault;
          $this.setScaleControlValue($this.scaleControlValueDefault);
          $this.setImgScale($this.scaleControlValueDefault / 100);

          $this.show();
        });
      }
    });

    // Закрываем попап
    this.uploadOverlayHideButton.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      $this.hide();
    });

    this.onEscape = function (ev) {
      if (ev.key === 'Escape' &&
        $this.hashtagsInput !== document.activeElement &&
        $this.pictureDescription !== document.activeElement) {
        ev.preventDefault();
        $this.hide();
      }
    };
  };

  /* события эффектов на фотографиях*/
  PictureUploader.prototype.bindEffectEvents = function () {
    var $this = this;

    // Устанавливаем эффект
    this.effectsRadio.forEach(function (effect) {
      effect.addEventListener('change', function () {
        $this.setEffect(effect);

      });
    });

    // перемещаем ползунок слайдера
    window.utils.moveSliderPin(this.effectLevelLine, this.effectLevelPin, function (value) {
      $this.effectLevelPin.style.left = value * 100 + '%';
      $this.effectLevelDepth.style.width = value * 100 + '%';

      $this.setEffectValue(value);
    });
  };

  // Записываем значение уровня насыщенности в соответствующий input и в превью
  PictureUploader.prototype.setEffectValue = function (value) {
    var $this = this;

    if ($this.currentEffectValue === 'none') {
      this.slider.classList.add('hidden');
      $this.picture.style.filter = '';

    } else if ($this.currentEffectValue === 'chrome') {
      $this.picture.style.filter = 'grayscale(' + value + ')';

    } else if ($this.currentEffectValue === 'sepia') {
      $this.picture.style.filter = 'sepia(' + value + ')';

    } else if ($this.currentEffectValue === 'marvin') {
      $this.picture.style.filter = 'invert(' + 100 * value + '%)';

    } else if ($this.currentEffectValue === 'phobos') {
      $this.picture.style.filter = 'blur(' + 3 * value + 'px)';

    } else if ($this.currentEffectValue === 'heat') {
      $this.picture.style.filter = 'brightness(' + 3 * value + ')';

    }

    if ($this.currentEffectValue !== 'none') {
      this.slider.classList.remove('hidden');
      this.effectLevel.value = Math.round(100 * value);
    }

  };

  /**
   * Загружает изображение из файла в виде base64
   * @param {File} file файл с изображением
   * @param {Function} cb callback(err, base64image)
   */
  PictureUploader.prototype.loadImage = function (file, cb) {
    if (file.type.indexOf('image/') !== 0) {
      cb(new Error('FILE_NOT_IMAGE'));
      return;
    }

    cb(null, window.URL.createObjectURL(file));
  };

  /* события валидации формы*/
  PictureUploader.prototype.validateForm = function () {
    var $this = this;

    /* hashtags*/
    this.hashtagsInput.addEventListener('change', function (customValidity) {
      customValidity = '';

      var str = $this.hashtagsInput.value;
      str = str.toLowerCase();
      var arr = str.split(' ');

      window.utils.findDuplicates(arr, function () {
        customValidity = 'Один и тот же хэш-тег не может быть использован дважды';
      });

      if (arr.length > 5) {
        customValidity = 'Нельзя указать больше пяти хэш-тегов';
      } else {
        arr.forEach(function (element) {

          if (element.indexOf('#') !== 0) {
            customValidity = 'Хеш-тег должен начинаться с символа #';

          } else if (element.length < 2) {
            customValidity = 'Хеш-тег не может состоять только из одной решётки';

          } else if (element.length >= 20) {
            customValidity = 'Хеш-тег должен быть короче 20 символов';

          }

        });
      }
      $this.hashtagsInput.setCustomValidity(customValidity);
      if (customValidity !== '') {
        $this.hashtagsInput.style.borderColor = 'red';
      } else {
        $this.hashtagsInput.style.borderColor = '';
      }
    });

  };

  /* удаление попапа из DOM*/
  PictureUploader.prototype.closeUploadEventPopup = function (element, elementButton) {
    var $this = this;

    this.closeUploadEventPopup.onClick = function (ev) {
      window.utils.removeElementByClick(ev, element);
      $this.closeUploadEventPopup.removeEventListeners();
    };

    this.closeUploadEventPopup.onEscape = function (ev) {
      window.utils.removeElementByEsc(ev, element);
      $this.closeUploadEventPopup.removeEventListeners();
    };

    this.closeUploadEventPopup.removeEventListeners = function () {
      window.removeEventListener('click', $this.closeUploadEventPopup.onClick);
      window.removeEventListener('keydown', $this.closeUploadEventPopup.onEscape);
    };

    elementButton.addEventListener('click', this.closeUploadEventPopup.onClick);
    window.addEventListener('click', this.closeUploadEventPopup.onClick);
    window.addEventListener('keydown', this.closeUploadEventPopup.onEscape);
  };

  /* события успешной отправки фотографии*/
  PictureUploader.prototype.successPopupEvents = function () {
    //  добавляем элемент
    var popupSuccess = this.uploadSuccessTemplate.cloneNode(true);
    this.main.appendChild(popupSuccess);

    var element = this.main.querySelector('.success');
    var elementButton = element.querySelector('.success__button');

    this.closeUploadEventPopup(element, elementButton);
  };

  /* события ошибок при попытке отправки фотографии*/
  PictureUploader.prototype.errorPopupEvents = function () {
    //  добавляем элемент
    var popupError = this.uploadErrorTemplate.cloneNode(true);
    this.main.appendChild(popupError);

    var element = this.main.querySelector('.error');
    var elementButton = element.querySelector('.error__button');

    this.closeUploadEventPopup(element, elementButton);
  };


  // события изменения масштаба картинки
  PictureUploader.prototype.bindScaleEvents = function () {
    var $this = this;

    this.scaleControlBigger.addEventListener('click', function () {
      $this.scaleControlValueCurrent += 25;
      if ($this.scaleControlValueCurrent > 100) {
        $this.scaleControlValueCurrent = 100;
      }
      $this.setScaleControlValue($this.scaleControlValueCurrent);
      $this.setImgScale($this.scaleControlValueCurrent / 100);
    });

    this.scaleControlSmaller.addEventListener('click', function () {
      $this.scaleControlValueCurrent -= 25;
      if ($this.scaleControlValueCurrent < 25) {
        $this.scaleControlValueCurrent = 25;
      }
      $this.setScaleControlValue($this.scaleControlValueCurrent);
      $this.setImgScale($this.scaleControlValueCurrent / 100);
    });

  };

  PictureUploader.prototype.setScaleControlValue = function (value) {
    this.scaleControlValue.value = value + '%';
  };

  PictureUploader.prototype.setImgScale = function (value) {
    this.picture.style.transform = 'scale(' + value + ')';
  };

  window.PictureUploader = PictureUploader;

})();
