'use strict';

(function () {
  var PicturesRenderer = function (data) {
    var $this = this;
    // elements
    this.filters = document.querySelector('.img-filters');
    this.filterButtons = this.filters.querySelectorAll('.img-filters__button');

    // action
    this.filters.classList.remove('img-filters--inactive');

    this.filterIdListMap = {
      'filter-popular': this.sortByPopularity.bind(this, data),
      'filter-new': this.getRandomElements.bind(this, data),
      'filter-discussed': this.sortByCommentsNumber.bind(this, data),
    };

    this.sortedData = [];

    this.debouncedRender = window.utils.debounce(function (button) {
      $this.filterIdListMap[button.id]();
      $this.renderData($this.sortedData);
    }, 500);

  };

  PicturesRenderer.prototype.bindEvents = function () {
    this.bindFilterEvents(this.filterButtons, 'img-filters__button--active');
  };

  // смена активной кнопки
  PicturesRenderer.prototype.bindFilterEvents = function (elementList, className) {
    var $this = this;
    elementList.forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.classList.contains(className) && button.id !== 'filter-new') {
          return;
        }
        elementList.forEach(function (element) {
          element.classList.remove(className);
        });
        button.classList.add(className);

        $this.debouncedRender(button);
      });
    });
  };

  PicturesRenderer.prototype.renderDefault = function () {
    var $this = this;

    this.filterButtons.forEach(function (button) {
      if (button.classList.contains('img-filters__button--active')) {
        $this.filterIdListMap[button.id]();
        $this.renderData($this.sortedData);
      }
    });
  };

  // создаем массив "Популярные — фотографии в изначальном порядке"
  PicturesRenderer.prototype.sortByPopularity = function (data) {
    this.sortedData = data.slice();
  };

  // создаем массив "Новые — 10 случайных, не повторяющихся фотографий"
  PicturesRenderer.prototype.getRandomElements = function (data) {
    this.sortedData = window.utils.getRandomPictures(data, 10);
  };

  // создаем массив "Обсуждаемые — фотографии, отсортированные в порядке убывания количества комментариев"
  PicturesRenderer.prototype.sortByCommentsNumber = function (data) {
    this.sortedData = data.slice().sort(function (left, right) {
      if (left.comments.length === right.comments.length) {
        return right.likes - left.likes;
      }
      return right.comments.length - left.comments.length;
    });
  };

  PicturesRenderer.prototype.renderData = function (dataArray) {
    PicturesRenderer.container.querySelectorAll('.picture').forEach(function (pic) {
      pic.remove();
    });
    window.utils.createDomElements(dataArray, window.PostRenderer.addPicture, PicturesRenderer.container);
  };

  PicturesRenderer.filters = {
    popular: 'filter-popular',
    new: 'filter-new',
    discussed: 'filter-discussed',
  };

  /* Сюда вставляем готовую разметку с картинками*/
  PicturesRenderer.container = document.querySelector('.pictures');

  window.PicturesRenderer = PicturesRenderer;

})();
