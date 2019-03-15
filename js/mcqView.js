define([
  'core/js/adapt',
  'core/js/views/questionView'
], function(Adapt, QuestionView) {

  var McqView = QuestionView.extend({

    events: {
      'focus .component-item input':'onItemFocus',
      'blur .component-item input':'onItemBlur',
      'change .component-item input':'onItemSelect',
      'keyup .component-item input':'onKeyPress'
    },

    isCorrectAnswerShown: false,

    initialize: function() {
      QuestionView.prototype.initialize.apply(this, arguments);
      this.update = _.debounce(this.update.bind(this), 1);
      this.listenTo(this.model, {
        "change:_isEnabled change:_isComplete change:_isSubmitted": this.update
      });
      this.listenTo(this.model.getChildren(), {
        "change:_isActive": this.update
      });
    },

    resetQuestionOnRevisit: function() {
      this.resetQuestion();
    },

    setupQuestion: function() {
      this.model.setupRandomisation();
    },

    onQuestionRendered: function() {
      this.setReadyStatus();
      this.update();
    },

    onKeyPress: function(event) {
      if (event.which !== 13) return;
      //<ENTER> keypress
      this.onItemSelect(event);
    },

    onItemFocus: function(event) {
      if (!this.model.isInteractive()) return;

      $('label[for='+$(event.currentTarget).attr('id')+']').addClass('highlighted');
    },

    onItemBlur: function(event) {
      $('label[for='+$(event.currentTarget).attr('id')+']').removeClass('highlighted');
    },

    onItemSelect: function(event) {
      if (!this.model.isInteractive()) return;

      var index = $(event.currentTarget).data('adapt-index');
      var itemModel = this.model.getItem(index);
      var shouldSelect = !itemModel.get("_isActive");

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
    },

    // Blank method to add functionality for when the user cannot submit
    // Could be used for a popup or explanation dialog/hint
    onCannotSubmit: function() {},

    // This is important and should give the user feedback on how they answered the question
    // Normally done through ticks and crosses by adding classes
    showMarking: function() {
      this.update();
    },

    // Used by the question view to reset the look and feel of the component.
    resetQuestion: function() {
      this.model.resetActiveItems();
      this.model.resetItems();
    },

    showCorrectAnswer: function() {
      this.isCorrectAnswerShown = true;
      this.update();
    },

    hideCorrectAnswer: function() {
      this.isCorrectAnswerShown = false;
      this.update();
    },

    update: function() {
      this.updateSelection();
      this.updateMarking();
    },

    updateSelection: function() {

      var isEnabled = this.model.get("_isEnabled");

      this.model.getChildren().each(function(itemModel) {

        var isSelected = this.isCorrectAnswerShown ?
          itemModel.get("_shouldBeSelected") :
          itemModel.get("_isActive");

        var index = itemModel.get('_index');
        this.$('label').filter('[data-adapt-index="' + index + '"]')
          .toggleClass('selected', isSelected)
          .toggleClass('disabled', !isEnabled);

        this.$('input').filter('[data-adapt-index="' + index + '"]')
          .prop('checked', isSelected)
          .prop('disabled', !isEnabled);

      }.bind(this));

    },

    updateMarking: function() {

      var isInteractive = this.model.isInteractive();
      var canShowMarking = this.model.get('_canShowMarking');
      var ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

      this.model.getChildren().each(function(itemModel) {

        var index = itemModel.get('_index');
        var $itemInput = this.$('input').filter('[data-adapt-index="' + index + '"]');
        var $item = $itemInput.parents('.component-item');

        if (isInteractive || !canShowMarking) {
          // Remove item marking
          $item.removeClass('correct incorrect');
          $itemInput.attr('aria-label', $.a11y_normalize(itemModel.get("text")));
          return;
        }

        // Mark item
        var shouldBeSelected = itemModel.get("_shouldBeSelected");
        var isCorrect = Boolean(itemModel.get("_isCorrect"));
        var isActive = Boolean(itemModel.get("_isActive"));

        $item
          .toggleClass('correct', isCorrect)
          .toggleClass('incorrect', !isCorrect);

        $itemInput.attr('aria-label', [
          (shouldBeSelected ? ariaLabels.correct : ariaLabels.incorrect),
          ", ",
          (isActive ? ariaLabels.selectedAnswer : ariaLabels.unselectedAnswer),
          ". ",
          $.a11y_normalize(itemModel.get("text"))
        ].join(""));

      }.bind(this));

    }

  });

  return McqView;

});
