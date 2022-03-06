export class Workout {
  date = new Date();
  id = String(Date.now()).slice(-10);
  clicks = 0;
  constructor(coords, distance, duration, temp, weatherIcon) {
    this.coords = coords; // [lat,long]
    this.distance = distance; //in km
    this.duration = duration; //in min
    this.temp = temp;
    this.weatherIcon = weatherIcon;
  }
  _setDescription() {
    //prettier-ignore
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

export class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence, temp, weatherIcon) {
    super(coords, distance, duration, temp, weatherIcon);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

export class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation, temp, weatherIcon) {
    super(coords, distance, duration, temp, weatherIcon);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//export { Workout, Running, Cycling };
