#adapt-contrib-mcq

An Adapt core multiple choice question.

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-mcq

This component can also be installed by adding the component to the adapt.json file before running `adapt install`:

        "adapt-contrib-mcq": "*"

##Usage

To Be Updated

##Settings overview
 
A complete example of this components settings can be found in the [example.json](https://github.com/adaptlearning/adapt-contrib-mcq/blob/master/example.json) file. A description of the core settings can be found at: [Core model attributes](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)

Further settings for this component are:

####_component

This value must be: `mcq`

####_classes

You can use this setting to add custom classes to your template and LESS file.

####_layout

This defines the position of the component in the block. Values can be `full`, `left` or `right`. 

####_attempts

Default: `1`

Specifies the number of attempts for this question.

####_isRandom

Default: `false`

Setting this value to `true` will cause the `_items` to appear in a random order each time this component is loaded.

####_selectable

Defines the number of `_items` that can be selected.

####_items

Each item represents one choice for the multiple choice question and contains values for `text` and `_shouldBeSelected`.

####text

The text for this setting will be displayed as a multiple choice option.


####_shouldBeSelected

Value can be `true` or `false`. Use `true` for items that must be selected for a correct answer. The value of `_selectable` must correspond to the number of `_items` where `_shouldBeSelected` is set to `true`.

##Limitations
 
To be completed.
 
##Browser spec
 
This component has been tested to the standard Adapt browser specification.
