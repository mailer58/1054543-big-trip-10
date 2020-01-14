import {
  EditEventFormComponent,
}
from './../components/forms.js';

import {
  MarkUpForPointOfRouteComponent,
  OffersComponent
}
from './../components/cards-of-points-of-route.js';

import
FormsCommonListeners, {} from './../utils/forms-common-listeners.js';

import {
  replace,
  render,
  RenderPosition,
} from './../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const pageBody = document.querySelector(`body`);

export default class PointController extends FormsCommonListeners {
  constructor(container, onDataChange, onViewChange) {
    super();
    this._container = container;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._onEscKeyDownCloseEditForm = this._onEscKeyDownCloseEditForm.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPageBodyClickToCloseEventList = super._onPageBodyClickToCloseEventList.bind(this);
    this._onEscKeyDownCloseEventsList = super._onEscKeyDownCloseEventsList.bind(this);
  }

  render(event) {

    this._pointComponent = new MarkUpForPointOfRouteComponent(event);
    this._editPointComponent = new EditEventFormComponent(event);

    // render a point of route:
    render(this._container, this._pointComponent.getElement(event), RenderPosition.APPEND);

    // render offers:
    const offersHeader = this._pointComponent.getElement().querySelector(`.event > h4`);
    const offersComponent = new OffersComponent(event.offers);
    const offersMarkUp = offersComponent.getElement();
    render(offersHeader, offersMarkUp, RenderPosition.AFTER);

    // add listeners:
    this._pointComponent.setRollUpBtnHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
    });

    this._editPointComponent.setSubmitBtnHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
    });

    this._editPointComponent.setFavoriteBtnClickHandler(() => {
      // update array of model:
      this._onDataChange(this, event, Object.assign({}, event, {
        favorite: !event.favorite,
      }));
      // update event of pointController:
      event = Object.assign({}, event, {
        favorite: !event.favorite,
      });
      // update event in edit form:
      this._editPointComponent._event = event;
      console.log(event.favorite);

    });

    this._editPointComponent.setEventListBtnClickHandler((evt) => {
      evt.preventDefault();
      const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
      const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
      eventTypeToggle.checked = !eventTypeToggle.checked;
      eventTypeList.style.display = eventTypeToggle.checked ? `block` : `none`;
      document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
      pageBody.addEventListener(`click`, this._onPageBodyClickToCloseEventList);
      document.addEventListener(`keydown`, this._onEscKeyDownCloseEventsList);
    });
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._editPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = Mode.DEFAULT;

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _onEscKeyDownCloseEditForm(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    const editForm = this._editPointComponent.getElement().querySelector('.event__header');
    if (isEscKey && editForm) {
      // reset edit form:
      this._editPointComponent._destination = null;
      this._editPointComponent._description = null;
      this._editPointComponent._offers = null;
      this._editPointComponent._price = null;
      this._editPointComponent._icon = null;
      this._editPointComponent._eventType = null;

      // remove listeners:
      document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
      this._editPointComponent.getElement().querySelector(`.event__type-btn`).removeEventListener(`click`, this._setEventListBtnClickHandler);

      this._replaceEditToCard();
      this._editPointComponent.removeElement();
      this._editPointComponent.recoveryListeners();

    }
  }

}
