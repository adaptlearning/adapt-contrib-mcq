define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var Mcq = QuestionView.extend({

        events: {
            'focus .mcq-item input':'onItemFocus',
            'blur .mcq-item input':'onItemBlur',
            'change .mcq-item input':'onItemSelected',
            "click .mcq-widget .button.submit": "onSubmitClicked",
			"click .mcq-widget .button.reset": "onResetClicked",
			"click .mcq-widget .button.model": "onModelAnswerClicked",
			"click .mcq-widget .button.user": "onUserAnswerClicked"
        },

        initialize:function() {
            QuestionView.prototype.initialize.apply(this, arguments);

            this.model.set('_selectedItems', []);
        },

        preRender:function(){
            QuestionView.prototype.preRender.apply(this);

            if (this.model.get('_isRandom') && this.model.get('_isEnabled')) {
                this.model.set("_items", _.shuffle(this.model.get("_items")));
            }
        },

        postRender: function() {
            QuestionView.prototype.postRender.apply(this);

            this.setResetButtonEnabled(false);
            this.setReadyStatus();
        },

        resetQuestion: function(properties) {
        	QuestionView.prototype.resetQuestion.apply(this, arguments);

        	_.each(this.model.get('_items'), function(item) {
                item.selected = false;
            }, this);
        },

        canSubmit: function() {
            return this.getNumberOfOptionsSelected() > 0;
        },

        canReset: function() {
            return !this.$('.mcq-widget, .button.reset').hasClass('disabled');
        },

        forEachAnswer: function(callback) {
            _.each(this.model.get('_items'), function(item, index) {
                var correctSelection = item.selected == item._shouldBeSelected;
                if(item.selected && correctSelection) {
                	this.model.set('_isAtLeastOneCorrectSelection', true);
                }
                callback(correctSelection, item);
            }, this);
        },

        markQuestion: function() {
        	this.forEachAnswer(function(correct, item) {
        		item.correct = correct;
        	});
        	QuestionView.prototype.markQuestion.apply(this);
        },

        resetItems: function() { 
            this.$('.mcq-item label').removeClass('selected');
            this.$('input').prop('checked', false);
            this.deselectAllItems();
            this.setAllItemsEnabled(true);
        },

        getNumberOfOptionsSelected:function() {
        	var count = 0;

        	_.each(this.model.get('_items'), function(item) {
        		if (item.selected) count++;
        	}, this);

        	return count;
        },
        
        deselectAllItems: function() {
            _.each(this.model.get('_items'), function(item) {
                item.selected = false;
            }, this);
        },

        setAllItemsEnabled: function(enabled) {
            _.each(this.model.get('_items'), function(item, index){
                var $itemLabel = this.$('label').eq(index);
                var $itemInput = this.$('input').eq(index);

                $itemLabel.toggleClass('disabled', !enabled);
                $itemInput.prop('disabled', !enabled);
            }, this);
        },

        setResetButtonEnabled: function(enabled) {
            this.$('.button.reset').toggleClass('disabled', !enabled);
        },

        setOptionSelected:function(index, selected) {
        	var $itemLabel = this.$('label').eq(index);
            var $itemInput = this.$('input').eq(index);

            $itemLabel.toggleClass('selected', selected);
            $itemInput.prop('checked', selected);
        },

        storeUserAnswer:function() {
        	var userAnswer = [];
        	_.each(this.model.get('_items'), function(item, index) {
        		userAnswer.push(item.selected);
        	}, this);
        	this.model.set('_userAnswer', userAnswer);
        },

        onItemFocus: function(event) {
            $(event.currentTarget).prev('label').addClass('highlighted');
        },
        
        onItemBlur: function(event) {
            $(event.currentTarget).prev('label').removeClass('highlighted');
        },
        
        onItemSelected: function(event) {
            var selectedItemObject = this.model.get('_items')[$(event.currentTarget).parent('.mcq-item').index()];
            
            if(this.model.get('_isEnabled') && !this.model.get('_isSubmitted')){
                this.toggleItemSelected(selectedItemObject, event);
            }
        },

        toggleItemSelected:function(item, clickEvent) {
            var selectedItems = this.model.get('_selectedItems');
            var itemIndex = _.indexOf(this.model.get('_items'), item),
                $itemLabel = this.$('label').eq(itemIndex),
                $itemInput = this.$('input').eq(itemIndex),
                selected = !$itemLabel.hasClass('selected');
            
                if(selected) {
                    if(this.model.get('_selectable') === 1){
                        this.$('label').removeClass('selected');
                        this.$('input').prop('checked', false);
                        this.deselectAllItems();
                        selectedItems[0] = item;
                    } else if(selectedItems.length < this.model.get('_selectable')) {
                     selectedItems.push(item);
                 } else {
                    clickEvent.preventDefault();
                    return;
                }
                $itemLabel.addClass('selected');
            } else {
                selectedItems.splice(_.indexOf(selectedItems, item), 1);
                $itemLabel.removeClass('selected');
            }
            $itemInput.prop('checked', selected);
            item.selected = selected;
            this.model.set('_selectedItems', selectedItems);
        },

        onResetClicked: function(event) {
            if (this.canReset()) {
                QuestionView.prototype.onResetClicked.apply(this, arguments);
            } else {
                if (event) {
                    event.preventDefault();
                }
            }
        },

        onSubmitClicked: function(event) {
        	QuestionView.prototype.onSubmitClicked.apply(this, arguments);

            if (this.canSubmit()) {
               this.setAllItemsEnabled(false);
               this.setResetButtonEnabled(!this.model.get('_isComplete'));
            }
        },

        onModelAnswerShown: function() {
        	_.each(this.model.get('_items'), function(item, index) {
        		this.setOptionSelected(index, item._shouldBeSelected);
        	}, this);
        },

        onUserAnswerShown: function(event) {
        	_.each(this.model.get('_items'), function(item, index) {
        		this.setOptionSelected(index, this.model.get('_userAnswer')[index]);
        	}, this);
        }

    });

    Adapt.register("mcq", Mcq);

    return Mcq;
});
