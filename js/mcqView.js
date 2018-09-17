define([
    'core/js/views/questionView'
], function(QuestionView) {

    var McqView = QuestionView.extend({

        events: {
            'focus .mcq-item input':'onItemFocus',
            'blur .mcq-item input':'onItemBlur',
            'change .mcq-item input':'onItemSelected',
            'keyup .mcq-item input':'onKeyPress'
        },

        resetQuestionOnRevisit: function() {
            this.setAllItemsEnabled(true);
            this.resetQuestion();
        },

        setupQuestion: function() {
            this.model.setupRandomisation();
        },

        disableQuestion: function() {
            this.setAllItemsEnabled(false);
        },

        enableQuestion: function() {
            this.setAllItemsEnabled(true);
        },

        setAllItemsEnabled: function(isEnabled) {
            _.each(this.model.get('_items'), function(item, index){
                var $itemLabel = this.$('label').eq(index);
                var $itemInput = this.$('input').eq(index);

                if (isEnabled) {
                    $itemLabel.removeClass('disabled');
                    $itemInput.prop('disabled', false);
                } else {
                    $itemLabel.addClass('disabled');
                    $itemInput.prop('disabled', true);
                }
            }, this);
        },

        onQuestionRendered: function() {
            this.setReadyStatus();
            if (!this.model.get('_isSubmitted')) return;
            this.showMarking();
        },

        onKeyPress: function(event) {
            if (event.which === 13) { //<ENTER> keypress
                this.onItemSelected(event);
            }
        },

        onItemFocus: function(event) {
            if(this.model.get('_isEnabled') && !this.model.get('_isSubmitted')){
                $('label[for=''+$(event.currentTarget).attr('id')+'']').addClass('highlighted');
            }
        },

        onItemBlur: function(event) {
            $('label[for=''+$(event.currentTarget).attr('id')+'']').removeClass('highlighted');
        },

        onItemSelected: function(event) {
            if(this.model.get('_isEnabled') && !this.model.get('_isSubmitted')){
                var selectedItemObject = this.model.get('_items')[$(event.currentTarget).parent('.component-item').index()];
                this.toggleItemSelected(selectedItemObject, event);
            }
        },

        toggleItemSelected:function(item, clickEvent) {
            var shouldSelect = !item._isSelected;

            if (this.model.isSingleSelect()) {
                // Assume a click is always a selection
                shouldSelect = true;
                this.deselectAllItems();
            } else if (shouldSelect && this.model.isAtSelectionLimit()) {
                // At the selection limit, deselect the last item
                this.toggleItem(this.model.getLastSelectedItem(), false);
            }

            // Select or deselect accordingly
            this.toggleItem(item, shouldSelect);
        },

        // Blank method to add functionality for when the user cannot submit
        // Could be used for a popup or explanation dialog/hint
        onCannotSubmit: function() {},

        // This is important and should give the user feedback on how they answered the question
        // Normally done through ticks and crosses by adding classes
        showMarking: function() {
            if (!this.model.get('_canShowMarking')) return;

            _.each(this.model.get('_items'), function(item, i) {
                var $item = this.$('.component-item').eq(i);
                $item.removeClass('correct incorrect').addClass(item._isCorrect ? 'correct' : 'incorrect');
            }, this);
        },

        // Used by the question view to reset the look and feel of the component.
        resetQuestion: function() {
            this.deselectAllItems();
            this.resetItems();
        },

        toggleItem: function(item, selected) {
            // Change visual appearance
            var $itemLabel = this.$('label[data-adapt-index='+item._index+']');
            var $itemInput = this.$('input[data-adapt-index='+item._index+']');
            $itemLabel.toggleClass('selected', selected);
            $itemInput.prop('checked', selected);
            // Change model values
            this.model.toggleItem(item, selected);
        },

        deselectAllItems: function() {
            this.$('label').removeClass('selected');
            this.$('input').prop('checked', false);
            this.model.deselectAllItems();
        },

        resetItems: function() {
            this.$('.component-item label').removeClass('selected');
            this.$('.component-item').removeClass('correct incorrect');
            this.$('input').prop('checked', false);
            this.model.resetItems();
        },

        showCorrectAnswer: function() {
            _.each(this.model.get('_items'), function(item, index) {
                this.setOptionSelected(index, item._shouldBeSelected);
            }, this);
        },

        setOptionSelected:function(index, selected) {
            var $itemLabel = this.$('label').eq(index);
            var $itemInput = this.$('input').eq(index);
            if (selected) {
                $itemLabel.addClass('selected');
                $itemInput.prop('checked', true);
            } else {
                $itemLabel.removeClass('selected');
                $itemInput.prop('checked', false);
            }
        },

        hideCorrectAnswer: function() {
            _.each(this.model.get('_items'), function(item, index) {
                this.setOptionSelected(index, this.model.get('_userAnswer')[item._index]);
            }, this);
        }

    });

    return McqView;

});
