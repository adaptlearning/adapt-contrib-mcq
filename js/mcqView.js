define([
  'core/js/adapt',
  'core/js/views/questionView'
], function(Adapt, QuestionView) {

  class McqView extends QuestionView {

    events() {
      return {
        'focus .js-item-input': 'onItemFocus',
        'blur .js-item-input': 'onItemBlur',
        'change .js-item-input': 'onItemSelect',
        'keyup .js-item-input': 'onKeyPress'
      };
    }

    initialize() {
      QuestionView.prototype.initialize.apply(this, arguments);
      this.isCorrectAnswerShown = false;
      this.update = _.debounce(this.update.bind(this), 1);
      this.listenTo(this.model, {
        'change:_isEnabled change:_isComplete change:_isSubmitted': this.update
      });
      this.listenTo(this.model.getChildren(), {
        'change:_isActive': this.update
      });
    }

    resetQuestionOnRevisit() {
      this.resetQuestion();
    }

    setupQuestion() {
      this.model.setupRandomisation();
    }

    onQuestionRendered() {
      this.setReadyStatus();
      this.update();
    }

    onKeyPress(event) {
      if (event.which !== 13) return;
      // <ENTER> keypress
      this.onItemSelect(event);
    }

    onItemFocus(event) {
      if (!this.model.isInteractive()) return;

      this.$('.js-item-label[for=' + $(event.currentTarget).attr('id') + ']').addClass('is-highlighted');
    }

    onItemBlur(event) {
      this.$('.js-item-label[for=' + $(event.currentTarget).attr('id') + ']').removeClass('is-highlighted');
    }

    onItemSelect(event) {
      if (!this.model.isInteractive()) return;

      const index = $(event.currentTarget).data('adapt-index');
      const itemModel = this.model.getItem(index);
      let shouldSelect = !itemModel.get('_isActive');

      if (this.model.isSingleSelect()) {
        // Assume a click is always a selection
        shouldSelect = true;
        this.model.resetActiveItems();
      } else if (shouldSelect && this.model.isAtActiveLimit()) {
        // At the selection limit, deselect the last item
        this.model.getLastActiveItem().toggleActive(false);
      }

      // Select or deselect accordingly
      itemModel.toggleActive(shouldSelect);
    }

    // Blank method to add functionality for when the user cannot submit
    // Could be used for a popup or explanation dialog/hint
    onCannotSubmit() {}

    // This is important and should give the user feedback on how they answered the question
    // Normally done through ticks and crosses by adding classes
    showMarking() {
      this.update();
    }

    // Used by the question view to reset the look and feel of the component.
    resetQuestion() {
      this.model.resetActiveItems();
      this.model.resetItems();
    }

    showCorrectAnswer() {
      this.isCorrectAnswerShown = true;
      this.update();
    }

    hideCorrectAnswer() {
      this.isCorrectAnswerShown = false;
      this.update();
    }

    update() {
      this.updateSelection();
      this.updateMarking();
    }

    updateSelection() {

      const isEnabled = this.model.get('_isEnabled');

      this.model.getChildren().each((itemModel) => {

        const isSelected = this.isCorrectAnswerShown ?
          itemModel.get('_shouldBeSelected') :
          itemModel.get('_isActive');

        const index = itemModel.get('_index');
        this.$('.js-item-label').filter('[data-adapt-index="' + index + '"]')
          .toggleClass('is-selected', isSelected)
          .toggleClass('is-disabled', !isEnabled);

        this.$('.js-item-input').filter('[data-adapt-index="' + index + '"]')
          .prop('checked', isSelected)
          .prop('disabled', !isEnabled);

      });

    }

    updateMarking() {

      const isInteractive = this.model.isInteractive();
      const canShowMarking = this.model.get('_canShowMarking');
      const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

      this.model.getChildren().each((itemModel) => {

        const index = itemModel.get('_index');
        const $itemInput = this.$('.js-item-input').filter('[data-adapt-index="' + index + '"]');
        const $item = $itemInput.parents('.js-mcq-item');

        if (isInteractive || !canShowMarking) {
          // Remove item marking
          $item.removeClass('is-correct is-incorrect');
          $itemInput.attr('aria-label', $.a11y_normalize(itemModel.get('text')));
          return;
        }

        // Mark item
        const shouldBeSelected = itemModel.get('_shouldBeSelected');
        const isCorrect = Boolean(itemModel.get('_isCorrect'));
        const isActive = Boolean(itemModel.get('_isActive'));

        $item
          .toggleClass('is-correct', isCorrect)
          .toggleClass('is-incorrect', !isCorrect);

        $itemInput.attr('aria-label', [
          (shouldBeSelected ? ariaLabels.correct : ariaLabels.incorrect),
          ', ',
          (isActive ? ariaLabels.selectedAnswer : ariaLabels.unselectedAnswer),
          '. ',
          $.a11y_normalize(itemModel.get('text'))
        ].join(''));

      });

    }

  };

  return McqView;

});
