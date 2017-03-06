define([
    'core/js/models/questionModel'
], function(QuestionModel) {
    
    var McqModel = QuestionModel.extend({

        init: function() {
            QuestionModel.prototype.init.call(this);

            this.set("_isRadio", (this.get("_selectable") == 1) );
            
            this.set('_selectedItems', []);

            this.setupQuestionItemIndexes();
        },

        setupQuestionItemIndexes: function() {
            var items = this.get("_items");
            if (items && items.length > 0) {
                for (var i = 0, l = items.length; i < l; i++) {
                    if (items[i]._index === undefined) items[i]._index = i;
                }
            }
        },

        restoreUserAnswers: function() {
            if (!this.get("_isSubmitted")) return;

            var selectedItems = [];
            var items = this.get("_items");
            var userAnswer = this.get("_userAnswer");
            _.each(items, function(item, index) {
                item._isSelected = userAnswer[item._index];
                if (item._isSelected) {
                    selectedItems.push(item);
                }
            });

            this.set("_selectedItems", selectedItems);

            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            //this.showMarking();
            this.setupFeedback();
        },

        setupRandomisation: function() {
            if (this.get('_isRandom') && this.get('_isEnabled')) {
                this.set("_items", _.shuffle(this.get("_items")));
            }
        },

        // check if the user is allowed to submit the question
        canSubmit: function() {
            var count = 0;

            _.each(this.get('_items'), function(item) {
                if (item._isSelected) {
                    count++;
                }
            }, this);

            return (count > 0) ? true : false;

        },

        // This is important for returning or showing the users answer
        // This should preserve the state of the users answers
        storeUserAnswer: function() {
            var userAnswer = [];

            var items = this.get('_items').slice(0);
            items.sort(function(a, b) {
                return a._index - b._index;
            });

            _.each(items, function(item, index) {
                userAnswer.push(item._isSelected);
            }, this);
            this.set('_userAnswer', userAnswer);
        },

        isCorrect: function() {

            var numberOfRequiredAnswers = 0;
            var numberOfCorrectAnswers = 0;
            var numberOfIncorrectAnswers = 0;

            _.each(this.get('_items'), function(item, index) {

                var itemSelected = (item._isSelected || false);

                if (item._shouldBeSelected) {
                    numberOfRequiredAnswers ++;

                    if (itemSelected) {
                        numberOfCorrectAnswers ++;
                        
                        item._isCorrect = true;

                        this.set('_isAtLeastOneCorrectSelection', true);
                    }

                } else if (!item._shouldBeSelected && itemSelected) {
                    numberOfIncorrectAnswers ++;
                }

            }, this);

            this.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);
            this.set('_numberOfRequiredAnswers', numberOfRequiredAnswers);

            // Check if correct answers matches correct items and there are no incorrect selections
            var answeredCorrectly = (numberOfCorrectAnswers === numberOfRequiredAnswers) && (numberOfIncorrectAnswers === 0);
            return answeredCorrectly;
        },

        // Sets the score based upon the questionWeight
        // Can be overwritten if the question needs to set the score in a different way
        setScore: function() {
            var questionWeight = this.get("_questionWeight");
            var answeredCorrectly = this.get('_isCorrect');
            var score = answeredCorrectly ? questionWeight : 0;
            this.set('_score', score);
        },

        setupFeedback: function() {

            if (this.get('_isCorrect')) {
                this.setupCorrectFeedback();
            } else if (this.isPartlyCorrect()) {
                this.setupPartlyCorrectFeedback();
            } else {
                // apply individual item feedback
                if((this.get('_selectable') === 1) && this.get('_selectedItems')[0].feedback) {
                    this.setupIndividualFeedback(this.get('_selectedItems')[0]);
                    return;
                } else {
                    this.setupIncorrectFeedback();
                }
            }
        },

        setupIndividualFeedback: function(selectedItem) {
             this.set({
                 feedbackTitle: this.get('title'),
                 feedbackMessage: selectedItem.feedback
             });
        },

        isPartlyCorrect: function() {
            return this.get('_isAtLeastOneCorrectSelection');
        },

        resetUserAnswer: function() {
            this.set({_userAnswer: []});
        },

        deselectAllItems: function() {
            _.each(this.get('_items'), function(item) {
                item._isSelected = false;
            }, this);
        },

        resetItems: function() {
            this.set({
                _selectedItems: [],
                _isAtLeastOneCorrectSelection: false
            });
        }

    });

    return McqModel;

});
