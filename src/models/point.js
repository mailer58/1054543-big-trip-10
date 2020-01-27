import moment from 'moment';

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.startTime = new Date(Date.parse(data[`date_from`]));
    this.endTime = new Date(Date.parse(data[`date_to`]));
    this.destination = data[`destination`];
    this.favorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.price = data[`base_price`];
    this.eventType = data.type;

    this.setCheckedOffers();
  }

  setCheckedOffers() {
    this.offers.forEach((offer) => {
      offer.isChecked = true;
    });
  }

  toRAW() {
    const formatTime = `YYYY-MM-DDTHH:mmZ`;
    const startTime = moment(this.startTime).format(formatTime);
    const endTime = moment(this.endTime).format(formatTime);

    const rawOffers = [];
    // clone offers objects:
    this.offers.forEach((offer) => rawOffers.push(JSON.parse(JSON.stringify(offer))));
    const savedPoint = {
      'id': this.id,
      'destination': this.destination,
      'date_from': startTime,
      'date_to': endTime,
      'offers': rawOffers,
      'base_price': this.price,
      'type': this.eventType,
      'is_favorite': this.favorite
    };

    return savedPoint;
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
