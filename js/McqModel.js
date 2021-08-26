import ItemsQuestionModel from 'core/js/models/itemsQuestionModel';

export default class McqModel extends ItemsQuestionModel {
  init() {
    super.init();
    this.set('_isCorrectAnswerShown', false);
  }
}
