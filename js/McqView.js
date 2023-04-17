import QuestionView from 'core/js/views/questionView';

class McqView extends QuestionView {

  initialize(...args) {
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onItemFocus = this.onItemFocus.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    super.initialize(...args);
  }

  setupQuestion() {
    this.model.setupRandomisation();
  }

  onQuestionRendered() {
    this.setReadyStatus();
  }

  onKeyPress(event) {
    if (event.which !== 13) return;
    // <ENTER> keypress
    this.onItemSelect(event);
  }

  onItemFocus(event) {
    if (!this.model.isInteractive()) return;
    if (this.model.get('_isRadio')) {
      this.onItemSelect(event);
      return;
    }
    const index = parseInt($(event.currentTarget).data('adapt-index'));
    const item = this.model.getChildren().findWhere({ _index: index });
    item.set('_isHighlighted', true);
  }

  onItemBlur(event) {
    const index = $(event.currentTarget).data('adapt-index');
    const item = this.model.getChildren().findWhere({ _index: index });
    item.set('_isHighlighted', false);
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
    this.model.resetItems();
  }

}

McqView.template = 'mcq.jsx';

export default McqView;
