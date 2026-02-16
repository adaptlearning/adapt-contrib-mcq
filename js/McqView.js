import logging from 'core/js/logging';
import QuestionView from 'core/js/views/questionView';

class McqView extends QuestionView {

  initialize(...args) {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyPress = (...args) => {
      logging.deprecated('McqView onKeyPress is deprecated, please change to onKeyDown');
      this.onKeyDown(...args);
    };
    this.onItemSelect = this.onItemSelect.bind(this);
    super.initialize(...args);
  }

  setupQuestion() {
    this.model.setupRandomisation();
  }

  onQuestionRendered() {
    this.setReadyStatus();
  }

  onKeyDown(event) {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    this.onItemSelect(event);
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
