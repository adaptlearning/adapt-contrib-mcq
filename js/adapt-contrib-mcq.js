define([
    'core/js/adapt',
    './mcqView',
    'core/js/models/itemsQuestionModel'
], function(Adapt, McqView, ItemsQuestionModel) {

    return Adapt.register("mcq", {
        view: McqView,
        model: ItemsQuestionModel.extend({})
    });

});
