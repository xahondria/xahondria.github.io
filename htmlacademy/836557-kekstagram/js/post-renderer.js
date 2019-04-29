'use strict';

(function () {

  /* Класс описывает превью картинки на главной странице */
  var PostRenderer = function PostRenderer(picture) {
    this.element = PostRenderer.template.cloneNode(true);
    this.picture = picture;

    this.element.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      window.BigPictureRenderer.show(picture);
    });
  };

  /* Метод отрисовывает превью картинок */
  PostRenderer.prototype.renderPreview = function () {
    this.element.querySelector('.picture__img').src = this.picture.url;
    this.element.querySelector('.picture__likes').textContent = this.picture.likes;
    this.element.querySelector('.picture__comments').textContent = this.picture.comments.length;
  };

  /* Шаблон разметки картинки*/
  PostRenderer.template = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  /**
   *
   * @param {Object} pictureData
   * @param {string} pictureData.url
   * @param {string} pictureData.description
   * @param {number} pictureData.likes
   * @param {Object[]} pictureData.comments
   *
   * @return {HTMLElement}
   */
  PostRenderer.addPicture = function (pictureData) {

    var postRenderer = new PostRenderer(pictureData);
    postRenderer.renderPreview();

    return postRenderer.element;
  };

  window.PostRenderer = PostRenderer;

})();
