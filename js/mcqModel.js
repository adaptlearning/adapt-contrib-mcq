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
            // for compatibility with framework v2
            var title = this.getFeedbackTitle ?
                this.getFeedbackTitle(this.get('_feedback')) :
                this.get('title');

            this.set({
                feedbackTitle: title,
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
        },

        getInteractionObject: function() {
            var interactions = {
                correctResponsesPattern: [],
                choices: []
            };

            interactions.choices = this.get('_items').map(function(item) {
                return {
                    id: (item._index + 1).toString(),
                    description: item.text
                };
            });

            var correctItems = _.filter(this.get('_items'), function(item) {
                return item._shouldBeSelected;
            });

            interactions.correctResponsesPattern = [
                _.pluck(correctItems, '_index')
                    .map(function(index) {
                        return (index + 1).toString();
                    })
                    .join('[,]')
            ];

            return interactions;
        },

        /**
        * used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
        * returns the user's answers as a string in the format "1,5,2"
        */
        getResponse: function() {
            var selected = _.where(this.get('_items'), {_isSelected: true});
            var selectedIndexes = _.pluck(selected, '_index');
            // indexes are 0-based, we need them to be 1-based for cmi.interactions
            for (var i = 0, count = selectedIndexes.length; i < count; i++) {
                selectedIndexes[i]++;
            }
            return selectedIndexes.join(',');
        },

        /**
        * used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
        */
        getResponseType: function() {
            return 'choice';
        }

    });

    return McqModel;

});
