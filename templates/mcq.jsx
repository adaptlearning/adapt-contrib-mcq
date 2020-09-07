import Adapt from 'core/js/adapt';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const isInteractive = model.isInteractive();
  const shouldShowMarking = !isInteractive && data._canShowMarking;

  return (
    <div className='component__inner mcq__inner'>

      {templates.component(model, view)}

      <div
        className={classes([
          'component__widget',
          'mcq__widget',
          !data._isEnabled && 'is-disabled',
          data._isInteractionComplete && 'is-complete is-submitted show-user-answer',
          data._isCorrect && 'is-correct'
        ])}
        role={data._isRadio ? 'radiogroup' : 'group'}
      >

        {data._items.map(({ text, _index, _isActive, _shouldBeSelected, _isHighlighted }, index) =>

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
              id={`${data._id}-${index}-input`}
              name={data._isRadio ? `${data._id}-item` : null}
              type={data._isRadio ? 'radio' : 'checkbox'}
              disabled={!data._isEnabled}
              aria-label={!shouldShowMarking ?
                Adapt.a11y.normalize(text) :
                `${_shouldBeSelected ? ariaLabels.correct : ariaLabels.incorrect}, ${_isActive ? ariaLabels.selectedAnswer : ariaLabels.unselectedAnswer}. ${Adapt.a11y.normalize(text)}`}
              data-adapt-index={_index}
              onKeyPress={(event) => view.onKeyPress(event)}
              onChange={(event) => view.onItemSelect(event)}
              onFocus={(event) => view.onItemFocus(event)}
              onBlur={(event) => view.onItemBlur(event)}
            />

            <label
              className={classes([
                'mcq__item-label',
                !data._isEnabled && 'is-disabled',
                _isHighlighted && 'is-highlighted',
                (data._isCorrectAnswerShown ? _shouldBeSelected : _isActive) && 'is-selected'
              ])}
              aria-hidden={true}
              htmlFor={`${data._id}-${index}-input`}
              data-adapt-index={_index}
            >

              <div className='mcq__item-state'>
                <div
                  className={classes([
                    'mcq__item-icon',
                    'mcq__item-answer-icon',
                    data._isRadio ? 'is-radio' : 'is-checkbox'
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
