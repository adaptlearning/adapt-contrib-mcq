define(function(require) {
  var QuestionView = require('coreViews/QuestionView');
  var Adapt = require('coreJS/adapt');

    var Mcq = QuestionView.extend({

        events: {
            'click .button.submit':'onSubmitClicked',
            'click .button.reset':'onResetClicked',
            'focus .item input':'onItemFocus',
            'blur .item input':'onItemBlur',
            'change .item input':'onItemSelected'
        },

        preRender:function(){
            QuestionView.prototype.preRender.apply(this);
            if(this.model.get('_isRandom') && this.model.get('_isEnabled')) this.model.set("items", _.shuffle(this.model.get("items")));
        },

        postRender: function() {
            QuestionView.prototype.postRender.apply(this);

            this.setResetButtonEnabled(false);
    
            this.setReadyStatus();
        },
        
        canSubmit: function() {
            return !!this.model.get("_selectedItems")[0];
        },

        canReset: function() {
            return !this.$('.widget, .button.reset').hasClass('disabled');
        },

        forEachAnswer: function(callback) {
            _.each(this.model.get('items'), function(item, index) {
                var correctSelection = item.selected && item.correct;
                if(correctSelection) this.model.set('_isAtLeastOneCorrectSelection', true);
                callback(!!item.selected == item.correct, item);
            }, this);
        },

        resetItems: function() { 
            this.$('.item label').removeClass('selected');
            this.$('input').prop('checked', false);
            this.deselectAllItems();
            this.setAllItemsEnabled(true);
        },
        
        deselectAllItems: function() {
            _.each(this.model.get('items'), function(item){
                item.selected = false;
            });
        },

        // TODO: consider moving to super
        setAllItemsEnabled: function(enabled) {
            _.each(this.model.get('items'), function(item, index){
                var $itemLabel = this.$('label').eq(index);
                var $itemInput = this.$('input').eq(index);

                $itemLabel.toggleClass('disabled', !enabled);
                $itemInput.prop('disabled', !enabled);
            });
        },

        setResetButtonEnabled: function(enabled) {
            this.$('.button.reset').toggleClass('disabled', !enabled);
        },

        onItemFocus: function(event) {
            $(event.currentTarget).prev('label').addClass('highlighted');
        },
        
        onItemBlur: function(event) {
            $(event.currentTarget).prev('label').removeClass('highlighted');
        },
        
        onItemSelected: function(event) {
            var selectedItemObject = this.model.get('items')[$(event.currentTarget).parent('.item').index()];
            
            if(this.model.get('_isEnabled') && !this.model.get('_isSubmitted')){
                this.toggleItemSelected(selectedItemObject, event);
            }
        },

        toggleItemSelected:function(item, clickEvent) {
            var selectedItems = this.model.get('_selectedItems'),
                itemIndex = _.indexOf(this.model.get('items'), item),
                $itemLabel = this.$('label').eq(itemIndex),
                $itemInput = this.$('input').eq(itemIndex),
                selected = !$itemLabel.hasClass('selected');
            
            if(selected) {
                if(this.model.get('_isSelectable') === 1){
                    this.$('label').removeClass('selected');
                    this.$('input').prop('checked', false);
                    this.deselectAllItems();
                    selectedItems[0] = item;
                } else if(selectedItems.length < this.model.get('_isSelectable')) {
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
            }
            else {
                if(event) event.preventDefault(); 
            }
        },

        onSubmitClicked: function(event) {
            QuestionView.prototype.onSubmitClicked.apply(this, arguments);

            this.setAllItemsEnabled(false);

            this.setResetButtonEnabled(!this.model.get('_isComplete'));
        }
    });
    
    Adapt.register("mcq", Mcq);
    
});