'use strict';

(function () {

  /* Объект описывает попап с большой картинкой, комментариями, описанием и т.п. */
  window.BigPictureRenderer = {
    element: document.querySelector('.big-picture'),

    renderPreview: function (pictureData) {
      this.element.querySelector('.big-picture__img img').src = pictureData.url;
      this.element.querySelector('.likes-count').textContent = pictureData.likes;
      this.element.querySelector('.comments-count').textContent = pictureData.comments.length;
      this.element.querySelector('.social__caption').textContent = pictureData.description;

      this.element.querySelector('.comments-loader').classList.add('visually-hidden');
    },

    renderComments: function (pictureData) {
      var $this = this;

      /* Нарезаем массивы комметариев*/
      var lastCommentIndex = 0;
      var COMMENTS_TO_ADD_NUMBER = 5;

      var sliceCommentsToAdd = function () {
        var commentsToAdd = pictureData.comments.slice(lastCommentIndex, lastCommentIndex + COMMENTS_TO_ADD_NUMBER);
        lastCommentIndex += commentsToAdd.length;
        return commentsToAdd;
      };

      /* создаем fragment с n комментариев*/
      var fragment = document.createDocumentFragment();

      var commentContainer = this.element.querySelector('.social__comments');
      var commentTemplate = commentContainer.querySelector('.social__comment');

      /* Удаляем старые комментарии из поста*/
      commentContainer.innerHTML = '';

      /* Создаем новые комментарии*/
      var addComments = function () {
        sliceCommentsToAdd().forEach(function (comment) {
          var newComment = commentTemplate.cloneNode(true);

          newComment.querySelector('.social__picture').src = comment.avatar;
          newComment.querySelector('.social__text').textContent = comment.message;

          fragment.appendChild(newComment);
        });

        commentContainer.appendChild(fragment);

        $this.element.querySelector('.comments-count-rendered').textContent = lastCommentIndex;
        if (lastCommentIndex >= pictureData.comments.length) {
          $this.element.querySelector('.comments-loader').classList.add('visually-hidden');
        } else {
          $this.element.querySelector('.comments-loader').classList.remove('visually-hidden');
        }
      };

      addComments();

      this.element.querySelector('.comments-loader').addEventListener('click', function () {
        addComments();
      });

    },

    show: function (pictureData) {
      this.renderPreview(pictureData);
      this.renderComments(pictureData);
      this.element.classList.remove('hidden');
      window.addEventListener('keydown', this.onEscape);
    },

    hide: function () {
      this.element.classList.add('hidden');
      window.removeEventListener('keydown', this.onEscape);
    },

    onEscape: function (ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        window.BigPictureRenderer.hide();
      }
    },

    bindEvents: function () {
      var $this = this;
      if (this.__eventsBinded__) {
        return;
      }
      this.__eventsBinded__ = true;

      this.element.querySelector('.big-picture__cancel').addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        $this.hide();
      });

    }
  };

})();
