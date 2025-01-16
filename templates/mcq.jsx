import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';
import React from 'react';
import { templates, classes, compile } from 'core/js/reactHelpers';

export default function Mcq(props) {
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _id,
    _isEnabled,
    _isInteractionComplete,
    _isCorrect,
    _isCorrectAnswerShown,
    _shouldShowMarking,
    _canShowModelAnswer,
    _canShowCorrectness,
    _isRadio,
    displayTitle,
    body,
    instruction,
    ariaQuestion,
    onKeyDown,
    onItemSelect,
    onItemFocus,
    onItemBlur
  } = props;

  return (
    <div className='component__inner mcq__inner'>

      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'mcq__widget',
          !_isEnabled && 'is-disabled',
          _isInteractionComplete && 'is-complete is-submitted',
          _isInteractionComplete && !_canShowCorrectness && !_isCorrectAnswerShown && 'show-user-answer',
          _isInteractionComplete && _canShowModelAnswer && _isCorrectAnswerShown && 'show-correct-answer',
          _isInteractionComplete && _canShowCorrectness && 'show-correctness',
          _isCorrect && 'is-correct'
        ])}
        role={_isRadio ? 'radiogroup' : 'group'}
        aria-labelledby={ariaQuestion ? null : (displayTitle || body || instruction) && `${_id}-header`}
        aria-label={ariaQuestion || null}
      >

        {props._items.map(({ text, altText, _index, _isActive, _shouldBeSelected, _isHighlighted }, index) =>

          <div
            className={classes([
              `mcq-item item-${index}`,
              _shouldShowMarking && _shouldBeSelected && 'is-correct',
              _shouldShowMarking && !_shouldBeSelected && 'is-incorrect'
            ])}
            key={_index}
          >

            <input
              className='mcq-item__input'
              id={`${_id}-${index}-input`}
              name={_isRadio ? `${_id}-item` : null}
              type={_isRadio ? 'radio' : 'checkbox'}
              aria-disabled={!_isEnabled}
              checked={_isActive}
              aria-label={!_shouldShowMarking ?
                a11y.normalize(altText || text) :
                `${_shouldBeSelected ? ariaLabels.correct : ariaLabels.incorrect}, ${_isActive ? ariaLabels.selectedAnswer : ariaLabels.unselectedAnswer}. ${a11y.normalize(altText || text)}`}
              data-adapt-index={_index}
              onKeyDown={onKeyDown}
              onChange={onItemSelect}
              onFocus={onItemFocus}
              onBlur={onItemBlur}
            />

            <label
              className={classes([
                'mcq-item__label',
                'u-no-select',
                !_isEnabled && 'is-disabled',
                _isHighlighted && 'is-highlighted',
                (_isCorrectAnswerShown ? _shouldBeSelected : _isActive) && 'is-selected'
              ])}
              aria-hidden={true}
              htmlFor={`${_id}-${index}-input`}
              data-adapt-index={_index}
            >

              <span className='mcq-item__state'>
                <span
                  className={classes([
                    'mcq-item__icon',
                    'mcq-item__answer-icon',
                    _isRadio ? 'is-radio' : 'is-checkbox'
                  ])}
                >

                  <span className='icon'></span>

                </span>
              </span>

              <span className='mcq-item__text'>
                <span className='mcq-item__text-inner' dangerouslySetInnerHTML={{ __html: compile(text) }}>
                </span>
              </span>

              <span className='mcq-item__state mcq-item__state-correctness'>
                <span className='mcq-item__icon mcq-item__correct-icon'>
                  <span className='icon'></span>
                </span>

                <span className='mcq-item__icon mcq-item__incorrect-icon'>
                  <span className='icon'></span>
                </span>
              </span>

            </label>

          </div>
        )}

      </div>

      <div className='btn__container'></div>

    </div>
  );
}
