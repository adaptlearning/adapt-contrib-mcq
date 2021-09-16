import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function Mcq(props) {
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _id,
    _isEnabled,
    _isInteractionComplete,
    _isCorrect,
    _isCorrectAnswerShown,
    _canShowMarking,
    _isRadio,
    displayTitle,
    body,
    instruction,
    onKeyPress,
    onItemSelect,
    onItemFocus,
    onItemBlur,
    isInteractive
  } = props;

  const shouldShowMarking = !isInteractive() && _canShowMarking;

  return (
    <div className='component__inner mcq__inner'>

      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'mcq__widget',
          !_isEnabled && 'is-disabled',
          _isInteractionComplete && 'is-complete is-submitted show-user-answer',
          _isCorrect && 'is-correct'
        ])}
        role={_isRadio ? 'radiogroup' : 'group'}
        aria-labelledby={(displayTitle || body || instruction) && `${_id}-header`}
      >

        {props._items.map(({ text, _index, _isActive, _shouldBeSelected, _isHighlighted }, index) =>

          <div
            className={classes([
              `mcq__item item-${index}`,
              shouldShowMarking && _shouldBeSelected && 'is-correct',
              shouldShowMarking && !_shouldBeSelected && 'is-incorrect'
            ])}
            key={_index}
          >

            <input
              className='mcq__item-input'
              id={`${_id}-${index}-input`}
              name={_isRadio ? `${_id}-item` : null}
              type={_isRadio ? 'radio' : 'checkbox'}
              disabled={!_isEnabled}
              aria-label={!shouldShowMarking ?
                Adapt.a11y.normalize(text) :
                `${_shouldBeSelected ? ariaLabels.correct : ariaLabels.incorrect}, ${_isActive ? ariaLabels.selectedAnswer : ariaLabels.unselectedAnswer}. ${Adapt.a11y.normalize(text)}`}
              data-adapt-index={_index}
              onKeyPress={onKeyPress}
              onChange={onItemSelect}
              onFocus={onItemFocus}
              onBlur={onItemBlur}
            />

            <label
              className={classes([
                'mcq__item-label',
                !_isEnabled && 'is-disabled',
                _isHighlighted && 'is-highlighted',
                (_isCorrectAnswerShown ? _shouldBeSelected : _isActive) && 'is-selected'
              ])}
              aria-hidden={true}
              htmlFor={`${_id}-${index}-input`}
              data-adapt-index={_index}
            >

              <div className='mcq__item-state'>
                <div
                  className={classes([
                    'mcq__item-icon',
                    'mcq__item-answer-icon',
                    _isRadio ? 'is-radio' : 'is-checkbox'
                  ])}
                >

                  <div className='icon'></div>

                </div>

                <div className='mcq__item-icon mcq__item-correct-icon'>
                  <div className='icon'></div>
                </div>

                <div className='mcq__item-icon mcq__item-incorrect-icon'>
                  <div className='icon'></div>
                </div>
              </div>

              <div className='mcq__item-text'>
                <div className='mcq__item-text-inner'>
                  {html(compile(text))}
                </div>
              </div>

            </label>

          </div>
        )}

      </div>

      <div className='btn__container'></div>

    </div>
  );
}
