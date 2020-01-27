import {
  EditEventFormComponent,
  getFormData,
  checkDestinationValidity,
  setData
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

import {
  toRAW
} from './../utils/common.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const pageBody = document.querySelector(`body`);

export default class PointController extends FormsCommonListeners {
  constructor(container, onDataChange, onViewChange, tripController) {
    super();
    this._id = null;

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
    this._id = event.id;
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

    // set handlers for roll-up buttons:
    this._pointComponent.setRollUpBtnHandler(() => {

      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
    });

    // set handlers for submit button:
    // save changes of exisiting event:
    this._editPointComponent.setSubmitBtnHandler((evt) => {

      evt.preventDefault();

      // get data of form:
      const formData = getFormData(this._editPointComponent);

      // get data for format of server:
      const changedEvent = toRAW(event.id, formData);

      // change a text of save button:
      setData(this._editPointComponent, {
        saveButtonText: `Saving...`,
      }, formData);

      // block save and delete buttons:
      this.blockEditFormButtons();

      // save data:
      this._onDataChange(DataChange.SAVE, event.id, changedEvent);
    });

    this._editPointComponent.setDeleteBtnHandler((evt) => {
      evt.preventDefault();

      // get data of form:
      const formData = getFormData(this._editPointComponent);

      // change a text of save button:
      setData(this._editPointComponent, {
        deleteButtonText: `Deleting...`,
      }, formData);

      // block save and delete buttons:
      this.blockEditFormButtons();

      this._onDataChange(DataChange.REMOVE, event.id);
    });

    // set handler of favorite button:
    this._editPointComponent.setFavoriteBtnClickHandler((evt) => {
      evt.preventDefault();
      const favoriteInput = this._editPointComponent.getElement().querySelector(`#event-favorite-1`);
      const destinationInput = this._editPointComponent.getElement().querySelector(`#event-destination-1`);
      const saveBtn = this._editPointComponent.getElement().querySelector(`.event__save-btn`);
      const deleteBtn = this._editPointComponent.getElement().querySelector(`.event__reset-btn`);

      // check validity of destination:
      const isValidDestination = checkDestinationValidity(destinationInput.value);

      if (isValidDestination && saveBtn.textContent === `Save` && deleteBtn.textContent === `Delete` &&
        !favoriteInput.classList.contains(`disabled`)
      ) {
        // get data of form:
        const formData = getFormData(this._editPointComponent);

        favoriteInput.classList.add(`disabled`);

        // get data for format of server:
        const changedEvent = toRAW(event.id, formData);

        // set favorite:
        changedEvent[`is_favorite`] = !changedEvent[`is_favorite`];

        // update favorite:
        this._onDataChange(DataChange.FAVORITE, event.id, changedEvent);
      }
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

  shake() {
    this._editPointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  }

  blockEditFormButtons() {
    const saveBtn = this._editPointComponent.getElement().querySelector(`.event__save-btn`);
    saveBtn.disabled = true;

    const deleteBtn = this._editPointComponent.getElement().querySelector(`.event__reset-btn`);
    deleteBtn.disabled = true;
  }

}
