var FeedbackBlock__button = document.querySelector('.feedback-block__button');
var PopupFeedbackWrapper = document.querySelector('.popup-feedback-wrapper');
var PopupFeedback = document.querySelector('.popup-feedback');
var PopupFeedback__CloseButton = PopupFeedback.querySelector('.popup-feedback__close');
var PopupFeedbackName = PopupFeedback.querySelector('.popup-feedback__input[name=name]');
var PopupFeedbackEmail = PopupFeedback.querySelector('.popup-feedback__input[name=email]');
var PopupFeedbackText = PopupFeedback.querySelector('.popup-feedback__textarea');
var PopupFeedbackForm = PopupFeedback.querySelector('.popup-feedback-form');
var isStorageSupport = true;
var StorageName = "";
var StorageEmail = "";

try {
  StorageName = localStorage.getItem('PopupFeedbackName');
  StorageEmail = localStorage.getItem('PopupFeedbackEmail');
} catch (err) {
  isStorageSupport = false;
}

FeedbackBlock__button.addEventListener('click', function (evt) {
  evt.preventDefault();
  PopupFeedbackWrapper.classList.remove('hidden');
  PopupFeedback.classList.remove('hidden');
  PopupFeedbackName.focus();

  if (StorageName) {
    PopupFeedbackName.value = StorageName;
    PopupFeedbackEmail.value = StorageEmail;
    PopupFeedbackText.focus();
  } else {
    PopupFeedbackName.focus();
  }
});

PopupFeedback__CloseButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  PopupFeedbackWrapper.classList.add('hidden');
  PopupFeedback.classList.add('hidden');
  PopupFeedback.classList.remove('modal-error')
});

PopupFeedbackWrapper.addEventListener('click', function (evt) {
  evt.preventDefault();
  PopupFeedbackWrapper.classList.add('hidden');
  PopupFeedback.classList.add('hidden');
  PopupFeedback.classList.remove('modal-error')
});

window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (!PopupFeedback.classList.contains('hidden') && !PopupFeedbackWrapper.classList.contains('hidden')) {
      PopupFeedbackWrapper.classList.add('hidden');
      PopupFeedback.classList.add('hidden');
      PopupFeedback.classList.remove('modal-error')
    }
  }
});

PopupFeedbackForm.addEventListener('submit', function (evt) {
  if (!PopupFeedbackName.value || !PopupFeedbackEmail.value) {
    evt.preventDefault();
    PopupFeedback.classList.remove('modal-error');
    PopupFeedback.offsetWidth = PopupFeedback.offsetWidth;
    PopupFeedback.classList.add('modal-error');
  } else {
    if (isStorageSupport) {
      localStorage.setItem('PopupFeedbackName', PopupFeedbackName.value);
      localStorage.setItem('PopupFeedbackEmail', PopupFeedbackEmail.value);
    }
  }
});
