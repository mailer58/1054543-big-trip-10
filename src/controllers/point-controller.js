import {
  EditEventFormComponent,
  getFormData
}
  from './../components/forms.js';

import {
  MarkUpForPointOfRouteComponent,
  OffersComponent
}
  from './../components/cards-of-points-of-route.js';

import
FormsCommonListeners from './../utils/forms-common-listeners.js';

import {
  replace,
  render,
  RenderPosition,
  remove
} from './../utils/render.js';

import {
  DataChange,
  ToggleButton
} from './../const.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const pageBody = document.querySelector(`body`);

export default class PointController extends FormsCommonListeners {
  constructor(container, onDataChange, onViewChange, tripController) {
    super();
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._tripController = tripController;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._onEscKeyDownCloseEditForm = this._onEscKeyDownCloseEditForm.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPageBodyClickToCloseEventList = super._onPageBodyClickToCloseEventList.bind(this);
    this._resetEditFormData = this.resetEditFormData.bind(this);
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

    // save changes in exisiting event:
    this._editPointComponent.setSubmitBtnHandler((evt) => {
      evt.preventDefault();

      this._replaceEditToCard();
      const formData = getFormData(this._editPointComponent);
      const {
        formStartTime,
        formEndTime,
        formDestination,
        formEventType,
        formIcon,
        formDescription,
        formOffers,
        formFavorite
      } = formData;

      let {
        formPrice
      } = formData;

      formPrice = formPrice ? formPrice : 0;

      const changedEvent = {
        id: event.id,
        eventType: formEventType,
        destination: formDestination,
        eventIcon: formIcon,
        startTime: formStartTime,
        endTime: formEndTime,
        price: formPrice,
        photo: event.photo,
        description: formDescription,
        offers: formOffers,
        days: ``,
        favorite: formFavorite,
      };

      this._onDataChange(DataChange.SAVE, event.id, Object.assign({}, changedEvent));
    });

    this._editPointComponent.setDeleteBtnHandler(() => {
      this._onDataChange(DataChange.REMOVE, event.id);
    });

    this._editPointComponent.setFavoriteBtnClickHandler(() => {
      // update the array of model:
      this._onDataChange(DataChange.FAVORITE, event.id, Object.assign({}, event, {
        favorite: !event.favorite,
      }));
      // update event of pointController:
      event = Object.assign({}, event, {
        favorite: !event.favorite,
      });
      // update event in edit form:
      this._editPointComponent._event = event;
    });

    this._editPointComponent.setEventListBtnClickHandler(super.onEventListBtnClick.bind(this));
  }

  destroy() {
    remove(this._editPointComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
  }

  _replaceCardToEdit() {
    // close opened editing form:
    this._onViewChange();

    // remove preceding unsaved modifications of elements in editing form:
    this._editPointComponent.removeElement();
    this._resetEditFormData();

    // restore listeners of editing form:
    this._editPointComponent.recoveryListeners();

    replace(this._editPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = Mode.DEFAULT;
    // remove listener:
    document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _onEscKeyDownCloseEditForm(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
      const eventTypeToggle = document.getElementById(`event-type-toggle-1`);

      if (eventTypeList.style.display === `block`) {
        eventTypeToggle.checked = false;
        eventTypeList.style.display = `none`;

        pageBody.removeEventListener(`click`, this._onPageBodyClickToCloseEventList);
      } else {
        // remove listener:
        document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);

        this._replaceEditToCard();
      }
    }
  }

  resetEditFormData() {
    this._editPointComponent._destination = null;
    this._editPointComponent._description = null;
    this._editPointComponent._offers = null;
    this._editPointComponent._price = null;
    this._editPointComponent._icon = null;
    this._editPointComponent._eventType = null;
  }

  toggleRollUpBtn(action) {
    const rollUpBtn = this._pointComponent.getElement().querySelector(`.event__rollup-btn`);
    switch (action) {

      case ToggleButton.DISABLE:
        rollUpBtn.disabled = true;
        break;

      case ToggleButton.ENABLE:
        rollUpBtn.disabled = false;
        break;
    }
  }

}
