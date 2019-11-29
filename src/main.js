'use strict';

const tripControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(1)`);
const filterControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(2)`);
const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
const pageBody = document.querySelector('body');
const ESC_KEYCODE = 27;

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
  );
};

const createFilterTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
     <div class="trip-filters__filter">
       <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked="">
       <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
     </div>

     <div class="trip-filters__filter">
       <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
       <label class="trip-filters__filter-label" for="filter-future">Future</label>
     </div>

     <div class="trip-filters__filter">
       <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
       <label class="trip-filters__filter-label" for="filter-past">Past</label>
     </div>

     <button class="visually-hidden" type="submit">Accept filter</button>
   </form>`
  );
};

const createNewEventForm = () => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
     <header class="event__header">
       <div class="event__type-wrapper">
         <label class="event__type  event__type-btn" for="event-type-toggle-1">
           <span class="visually-hidden">Choose event type</span>
           <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
         </label>
         <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

         <div class="event__type-list">
           <fieldset class="event__type-group">
             <legend class="visually-hidden">Transfer</legend>

             <div class="event__type-item">
               <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
               <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
               <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
               <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
               <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
               <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
               <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked="">
               <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
             </div>
           </fieldset>

           <fieldset class="event__type-group">
             <legend class="visually-hidden">Activity</legend>

             <div class="event__type-item">
               <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
               <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
               <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
             </div>

             <div class="event__type-item">
               <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
               <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
             </div>
           </fieldset>
         </div>
       </div>

       <div class="event__field-group  event__field-group--destination">
         <label class="event__label  event__type-output" for="event-destination-1">
           Sightseeing at
         </label>
         <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
         <datalist id="destination-list-1">
           <option value="Amsterdam"></option>
           <option value="Geneva"></option>
           <option value="Chamonix"></option>
           <option value="Saint Petersburg"></option>
         </datalist>
       </div>

       <div class="event__field-group  event__field-group--time">
         <label class="visually-hidden" for="event-start-time-1">
           From
         </label>
         <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
         —
         <label class="visually-hidden" for="event-end-time-1">
           To
         </label>
         <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
       </div>

       <div class="event__field-group  event__field-group--price">
         <label class="event__label" for="event-price-1">
           <span class="visually-hidden">Price</span>
           €
         </label>
         <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
       </div>

       <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
       <button class="event__reset-btn" type="reset">Cancel</button>
     </header>
   </form>`
  );
};

const createEventsCards = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day">Day</span>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked="">
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
              <label class="trip-sort__btn" for="sort-time">
                Time
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
                </svg>
              </label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
              <label class="trip-sort__btn" for="sort-price">
                Price
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
                </svg>
              </label>
            </div>

            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>
          <ul class="trip-days">
            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">1</span>
                <time class="day__date" datetime="2019-03-18">MAR 18</time>
              </div>

              <ul class="trip-events__list">
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Taxi to airport</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
                        —
                        <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
                      </p>
                      <p class="event__duration">1H 30M</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">20</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Order Uber</span>
                        +
                        €&nbsp;<span class="event__offer-price">20</span>
                       </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/flight.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Flight to Geneva</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-18T12:25">12:25</time>
                        —
                        <time class="event__end-time" datetime="2019-03-18T13:35">13:35</time>
                      </p>
                      <p class="event__duration">1H 30M</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">160</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Add luggage</span>
                        +
                        €&nbsp;<span class="event__offer-price">50</span>
                       </li>
                       <li class="event__offer">
                         <span class="event__offer-title">Switch to comfort</span>
                         +
                         €&nbsp;<span class="event__offer-price">80</span>
                        </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Drive to Chamonix</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-18T14:30">14:30</time>
                        —
                        <time class="event__end-time" datetime="2019-03-18T16:05">16:05</time>
                      </p>
                      <p class="event__duration">1H 10M</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">160</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Rent a car</span>
                        +
                        €&nbsp;<span class="event__offer-price">200</span>
                       </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/check-in.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Check into hotel</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-18T12:25">12:25</time>
                        —
                        <time class="event__end-time" datetime="2019-03-18T13:35">13:35</time>
                      </p>
                      <p class="event__duration">1H 30M</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">600</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Add breakfast</span>
                        +
                        €&nbsp;<span class="event__offer-price">50</span>
                       </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>
              </ul>
            </li>

            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">2</span>
                <time class="day__date" datetime="2019-03-19">MAR 19</time>
              </div>

              <ul class="trip-events__list">
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Drive to Geneva</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-19T10:00">10:00</time>
                        —
                        <time class="event__end-time" datetime="2019-03-19T11:00">11:00</time>
                      </p>
                      <p class="event__duration">1H</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">20</span>
                    </p>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/sightseeing.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Natural History Museum</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-19T11:20">11:20</time>
                        —
                        <time class="event__end-time" datetime="2019-03-19T13:00">13:00</time>
                      </p>
                      <p class="event__duration">1H 20M</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">50</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Book tickets</span>
                        +
                        €&nbsp;<span class="event__offer-price">40</span>
                       </li>
                       <li class="event__offer">
                         <span class="event__offer-title">Lunch in city</span>
                         +
                         €&nbsp;<span class="event__offer-price">30</span>
                        </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Drive to Chamonix</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-19T18:00">18:00</time>
                        —
                        <time class="event__end-time" datetime="2019-03-19T19:00">19:00</time>
                      </p>
                      <p class="event__duration">1H</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">20</span>
                    </p>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>
              </ul>
            </li>

            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">3</span>
                <time class="day__date" datetime="2019-03-18">MAR 20</time>
              </div>

              <ul class="trip-events__list">
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Drive to airport</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-20T08:25">08:25</time>
                        —
                        <time class="event__end-time" datetime="2019-03-20T09:25">09:25</time>
                      </p>
                      <p class="event__duration">1H</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">20</span>
                    </p>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>

                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/flight.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Flight to Amsterdam</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-20T11:15">11:15</time>
                        —
                        <time class="event__end-time" datetime="2019-03-20T12:15">12:15</time>
                      </p>
                      <p class="event__duration">1H</p>
                    </div>

                    <p class="event__price">
                      €&nbsp;<span class="event__price-value">180</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      <li class="event__offer">
                        <span class="event__offer-title">Add luggage</span>
                        +
                        €&nbsp;<span class="event__offer-price">30</span>
                       </li>
                       <li class="event__offer">
                         <span class="event__offer-title">Switch to comfort</span>
                         +
                         €&nbsp;<span class="event__offer-price">100</span>
                        </li>
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>
              </ul>
            </li>
          </ul>`
  );
};

const createEditEventForm = () => {
  return (
    `<form class="event  event--edit" action="#" method="post">
         <header class="event__header">
           <div class="event__type-wrapper">
             <label class="event__type  event__type-btn" for="event-type-toggle-1">
               <span class="visually-hidden">Choose event type</span>
               <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
             </label>
             <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

             <div class="event__type-list">
               <fieldset class="event__type-group">
                 <legend class="visually-hidden">Transfer</legend>

                 <div class="event__type-item">
                   <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                   <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                   <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                   <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                   <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                   <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                   <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked="">
                   <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                 </div>
               </fieldset>

               <fieldset class="event__type-group">
                 <legend class="visually-hidden">Activity</legend>

                 <div class="event__type-item">
                   <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                   <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                   <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                 </div>

                 <div class="event__type-item">
                   <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                   <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                 </div>
               </fieldset>
             </div>
           </div>

           <div class="event__field-group  event__field-group--destination">
             <label class="event__label  event__type-output" for="event-destination-1">
               Sightseeing at
             </label>
             <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Saint Petersburg" list="destination-list-1">
             <datalist id="destination-list-1">
               <option value="Amsterdam"></option>
               <option value="Geneva"></option>
               <option value="Chamonix"></option>
             </datalist>
           </div>

           <div class="event__field-group  event__field-group--time">
             <label class="visually-hidden" for="event-start-time-1">
               From
             </label>
             <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
             —
             <label class="visually-hidden" for="event-end-time-1">
               To
             </label>
             <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
           </div>

           <div class="event__field-group  event__field-group--price">
             <label class="event__label" for="event-price-1">
               <span class="visually-hidden">Price</span>
               €
             </label>
             <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
           </div>

           <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
           <button class="event__reset-btn" type="reset">Delete</button>

           <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked="">
           <label class="event__favorite-btn" for="event-favorite-1">
             <span class="visually-hidden">Add to favorite</span>
             <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
               <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
             </svg>
           </label>

           <button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
           </button>
         </header>

         <section class="event__details">

           <section class="event__section  event__section--offers">
             <h3 class="event__section-title  event__section-title--offers">Offers</h3>

             <div class="event__available-offers">
               <div class="event__offer-selector">
                 <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked="">
                 <label class="event__offer-label" for="event-offer-luggage-1">
                   <span class="event__offer-title">Add luggage</span>
                   +
                   €&nbsp;<span class="event__offer-price">30</span>
                 </label>
               </div>

               <div class="event__offer-selector">
                 <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked="">
                 <label class="event__offer-label" for="event-offer-comfort-1">
                   <span class="event__offer-title">Switch to comfort class</span>
                   +
                   €&nbsp;<span class="event__offer-price">100</span>
                 </label>
               </div>

               <div class="event__offer-selector">
                 <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
                 <label class="event__offer-label" for="event-offer-meal-1">
                   <span class="event__offer-title">Add meal</span>
                   +
                   €&nbsp;<span class="event__offer-price">15</span>
                 </label>
               </div>

               <div class="event__offer-selector">
                 <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
                 <label class="event__offer-label" for="event-offer-seats-1">
                   <span class="event__offer-title">Choose seats</span>
                   +
                   €&nbsp;<span class="event__offer-price">5</span>
                 </label>
               </div>

               <div class="event__offer-selector">
                 <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
                 <label class="event__offer-label" for="event-offer-train-1">
                   <span class="event__offer-title">Travel by train</span>
                   +
                   €&nbsp;<span class="event__offer-price">40</span>
                 </label>
               </div>
             </div>
           </section>

           <section class="event__section  event__section--destination">
             <h3 class="event__section-title  event__section-title--destination">Destination</h3>
             <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

             <div class="event__photos-container">
               <div class="event__photos-tape">
                 <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
                 <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
                 <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
                 <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
                 <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
               </div>
             </div>
           </section>
         </section>
       </form>`
  );
};

// utility:
const setUpperCase = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

// render html:
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// set event type:
const setEventTypeText = (evt) => {
  // set an text for an event:
  let eventText = setUpperCase(evt.currentTarget.value);
  switch (eventText) {
    case `Taxi`:
    case `Bus`:
    case `Train`:
    case `Ship`:
    case `Transport`:
    case `Drive`:
    case `Flight`:
      eventText = eventText + ` to`;
      break;
    case `Check-in`:
      eventText = `Check into`;
      break;
    case `Sightseeing`:
    case `Restaurant`:
      eventText = eventText + ` at`;
      break;
  }
  const eventTypeTextForm = document.getElementsByClassName(`event__type-output`)[0];
  eventTypeTextForm.textContent = eventText;
};

const setEventTypeIcon = (evt) => {
  const labelsCollection = document.getElementsByTagName(`label`);
  // find corresponding input and label by comparing id and for attiubutes:
  let eventTypeId = evt.currentTarget.id;
  for (let j = 0; j < labelsCollection.length; j++) {
    let labelForAttr = labelsCollection[j].getAttribute(`for`);
    if (labelForAttr === eventTypeId) {
      // find an image for the event:
      let checkedEventImgSrc = window.getComputedStyle(
        labelsCollection[j], `:before`
      ).getPropertyValue(`background-image`);
      // get source of image:
      let splitSymbol = `public/`;
      checkedEventImgSrc = checkedEventImgSrc.split(splitSymbol);
      checkedEventImgSrc = checkedEventImgSrc[1];
      checkedEventImgSrc = checkedEventImgSrc.split(`")`);
      checkedEventImgSrc = checkedEventImgSrc[0];
      // set an new image:
      const eventImg = document.getElementsByClassName(`event__type-icon`)[0];
      eventImg.setAttribute(`src`, checkedEventImgSrc);
      break;
    }
  }
};

// toggle listeners of the event list:
const toggleListenersOfEventListOptions = (action) => {
  const eventTypeCollection = document.getElementsByClassName(`event__type-input`);
  for (let i = 0; i < eventTypeCollection.length; i++) {
    switch (action) {
      case `addListeners`:
        eventTypeCollection[i].addEventListener(`click`, onEventListOptionClick);
        break;
      case `removeListeners`:
        eventTypeCollection[i].removeEventListener(`click`, onEventListOptionClick);
    }
  }
};
// remove newEventForm:
const removeNewEventForm = () => {
  const eventResetButton = document.getElementsByClassName(`event__reset-btn`)[0];
  const eventSaveButton = document.getElementsByClassName(`event__save-btn`)[0];
  const tripEventsForm = document.getElementsByClassName(`event--edit`)[0];
  eventResetButton.removeEventListener(`click`, removeNewEventForm);
  eventSaveButton.removeEventListener(`click`, onSaveButtonClick);
  tripEventsForm.remove();
  newEventBtn.toggleAttribute(`disabled`);
  createPromptText();
};

// create the prompt:
const createPromptText = () => {
  const events = document.getElementsByClassName(`trip-sort`)[0];
  const promptText = document.getElementsByClassName(`prompt`)[0];
  if (!events && !promptText) {
    const prompt = document.createElement(`h2`);
    prompt.classList.add(`prompt`);
    prompt.textContent = `Click New Event to create your first point`;
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.append(prompt);
  }
};

// remove the prompt:
const removePromptText = () => {
  const promptText = document.getElementsByClassName(`prompt`)[0];
  if (promptText) {
    promptText.remove();
  }
};

// handlers:
const onEventListOptionClick = (evt) => {
  setEventTypeIcon(evt);
  setEventTypeText(evt);
  const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
  const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
  eventTypeList.style.display = `none`;
  eventTypeToggle.toggleAttribute(`checked`);
  document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);
  pageBody.removeEventListener('click', onPageBodyClickToCloseEventList);
};

const onEventListBtnClick = (evt) => {
  evt.preventDefault();
  const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
  const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
  eventTypeToggle.toggleAttribute(`checked`);
  eventTypeList.style.display = eventTypeToggle.checked ? `block` : `none`;
  if (eventTypeToggle.checked) {
    document.removeEventListener(`keydown`, onEscKeyDownCloseForm);
    document.addEventListener(`keydown`, onEscKeyDownCloseEventsList);
  } else {
    document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
    document.addEventListener(`keydown`, onEscKeyDownCloseForm);
  }
  pageBody.addEventListener('click', onPageBodyClickToCloseEventList);
};

// hide eventList by click on the page:
const onPageBodyClickToCloseEventList = (evt) => {
  const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
  const closingEventListDiv = document.getElementsByClassName('closingEventListDiv')[0];
  const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
  if (!evt.target.matches('.event__type-label') &&
    !evt.target.matches('.event__type-btn') &&
    !evt.target.matches('.event__type-icon') &&
    !evt.target.matches('.event__type-input')) {

    if (eventTypeToggle && eventTypeList) {
      eventTypeToggle.toggleAttribute(`checked`);
      eventTypeList.style.display = `none`;
    }
    pageBody.removeEventListener('click', onPageBodyClickToCloseEventList);
  }
};

const onNewEventBtnClick = () => {
  onCloseEditFormBtnClick();
  removePromptText();
  const events = document.getElementsByClassName(`trip-sort`)[0];
  // if there are no events add an first event:
  if (!events) {
    render(tripEventsHeader, createNewEventForm(), `afterend`);
  } else {
    render(events, createNewEventForm(), `afterend`);
  }
  toggleListenersOfEventListOptions(`addListeners`);
  newEventBtn.toggleAttribute(`disabled`);
  const eventResetButton = document.getElementsByClassName(`event__reset-btn`)[0];
  const eventSaveButton = document.getElementsByClassName(`event__save-btn`)[0];
  eventResetButton.addEventListener(`click`, removeNewEventForm);
  eventSaveButton.addEventListener(`click`, onSaveButtonClick);
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);

  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  eventListBtn.addEventListener(`click`, onEventListBtnClick);
  const eventTypeTextForm = document.getElementsByClassName(`event__type-output`)[0];
  eventTypeTextForm.textContent = `Flight to`;
};

const onRollUpBntClick = (evt) => {
  // close current form:
  onCloseEditFormBtnClick();
  // check if an roll-up button has openEditForm class:
  if (evt.target.matches(`.openEditForm`)) {
    // show editEventForm:
    const eventDiv = evt.target.closest(`.event`);
    render(eventDiv, createEditEventForm(), `afterend`);
    // disable roll-up button that had opened an edit form:
    evt.target.disabled = true;
    evt.target.classList.add(`disabledRollUpBtn`);
  }
  // add eventListener for close edit form:
  const editEventForm = document.getElementsByClassName(`event--edit`)[0];
  const closeEditFormBtn = editEventForm.getElementsByClassName(`event__rollup-btn`)[0];
  closeEditFormBtn.addEventListener(`click`, onCloseEditFormBtnClick);
};

const onCloseEditFormBtnClick = () => {
  const editEventForm = document.getElementsByClassName(`event--edit`)[0];
  if (editEventForm) {
    let closeEditFormBtn = editEventForm.getElementsByClassName(`event__rollup-btn`)[0];
    if (closeEditFormBtn) {
      closeEditFormBtn.removeEventListener(`click`, onCloseEditFormBtnClick);
    }
    editEventForm.remove();
    // enable an disabled roll-up button:
    const disabledRollUpBtn = document.getElementsByClassName(`disabledRollUpBtn`);
    for (let i = 0; i < disabledRollUpBtn.length; i++) {
      disabledRollUpBtn[i].disabled = false;
    }
  }
  // activate newEventBtn:
  newEventBtn.disabled = false;

  toggleListenersOfEventListOptions(`removeListeners`);
  document.removeEventListener(`keydown`, onEscKeyDownCloseForm);
  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  if (eventListBtn) {
    eventListBtn.removeEventListener(`click`, onEventListBtnClick);
  }
};

const onEscKeyDownCloseForm = (evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    onCloseEditFormBtnClick();
    createPromptText();
  }
};

const onEscKeyDownCloseEventsList = (evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
    const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
    eventTypeToggle.toggleAttribute(`checked`);
    eventTypeList.style.display = `none`;
    document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
    document.addEventListener(`keydown`, onEscKeyDownCloseForm);
    pageBody.removeEventListener('click', onPageBodyClickToCloseEventList);
  }
};

const onSaveButtonClick = (evt) => {
  evt.preventDefault();
  // show event:
  render(tripEventsHeader, createEventsCards(), `afterend`);
  const rollupBtnCollection = document.getElementsByClassName(`event__rollup-btn`);
  // add eventListeners on roll-up buttons:
  for (let i = 0; i < rollupBtnCollection.length; i++) {
    rollupBtnCollection[i].classList.add(`openEditForm`);
    rollupBtnCollection[i].addEventListener(`click`, onRollUpBntClick);
  }
  // remove the form:
  removeNewEventForm();
};

// render components:
render(tripControlsHeader, createSiteMenuTemplate(), `afterend`);
render(filterControlsHeader, createFilterTemplate(), `afterend`);

createPromptText();

newEventBtn.addEventListener(`click`, onNewEventBtnClick);
