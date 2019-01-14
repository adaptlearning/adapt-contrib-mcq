define([
  'core/js/adapt',
  './mcqView',
  'core/js/models/itemsQuestionModel'
], function(Adapt, McqView, ItemsQuestionModel) {

  return Adapt.register("mcq", {
    view: McqView,
    // Extend ItemsQuestionModel to distinguish McqModel in
    // the inheritance chain and allow targeted model extensions.
    model: ItemsQuestionModel.extend({})
  });

});
