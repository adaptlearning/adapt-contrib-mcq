import QuestionView from 'core/js/views/questionView';

class McqView extends QuestionView {

  initialize(...args) {
    super.initialize(...args);
    this.listenTo(this.model.getChildren(), 'all', this.changed);
  }

  resetQuestionOnRevisit() {
    this.resetQuestion();
  }

  setupQuestion() {
    this.model.setupRandomisation();
  }

  onQuestionRendered() {
    this.setReadyStatus();
  }

  onKeyPress(event) {
    if (event.which !== 13) return;
    //<ENTER> keypress
    this.onItemSelect(event);
  }

  onItemFocus(event) {
    if (!this.model.isInteractive()) return;

    const id = $(event.currentTarget).attr('id');
    this.$(`.js-item-label[for=${id}]`).addClass('is-highlighted');
  }

  onItemBlur(event) {
    this.$(`.js-item-label[for=${$(event.currentTarget).attr('id')}]`).removeClass('is-highlighted');
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

  // Used by the question view to reset the look and feel of the component.
  resetQuestion() {
    this.model.resetActiveItems();
    this.model.resetItems();
  }

  showCorrectAnswer() {
    this.model.set('_isCorrectAnswerShown', true);
  }

  hideCorrectAnswer() {
    this.model.set('_isCorrectAnswerShown', false);
  }

}

McqView.template = 'mcq.jsx';

export default McqView;
