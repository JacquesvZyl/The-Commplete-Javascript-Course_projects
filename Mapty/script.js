'use strict';

import { Running, Cycling } from './classes.js';

// prettier-ignore
const form = document.querySelector('.form');
const sort = document.querySelector('.sort');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #sort = false;
  constructor() {
    // get data from local storage
    this._getLocalStorage();
    // get user position
    this._getPosition();

    //event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    containerWorkouts.addEventListener('click', this._deleteWorkout.bind(this));
    containerWorkouts.addEventListener('click', this._sortWorkout.bind(this));
    containerWorkouts.addEventListener('click', e => {
      if (!e.target.classList.contains('form__close')) return;
      this._hideForm();
    });
    //prettier-ignore
    containerWorkouts.addEventListener('mouseover',this._toggleWorkoutButtons.bind(this));
    //prettier-ignore
    containerWorkouts.addEventListener('mouseout', this._toggleWorkoutButtons.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get current position');
        }
      );
  }

  async _getWeather(lat, lon) {
    try {
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=b6ba67cfc386c27233294b33908d06fc`;
      const result = await fetch(url);
      if (!result.ok)
        throw new Error(`${result.status}: unable to fetch api data ${url}`);
      const data = await result.json();

      return data;
    } catch (e) {
      alert(e.message);
      // Reject promise returned from async func
      throw e;
    }
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });

    this.#map.on('click', this._showForm.bind(this));
  }
  _toggleWorkoutButtons(e) {
    const workout = e.target.closest('.workout');
    if (!workout) return;
    workout.querySelector('.workout__buttons').classList.toggle('hidden');
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    sort.classList.add('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    sort.classList.remove('hidden');
    setTimeout(() => (form.style.display = 'grid'), 500);
  }
  _toggleElevationField() {
    //prettier-ignore
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    function validInputs(...inputs) {
      return inputs.every(inp => Number.isFinite(inp));
    }

    function allPositive(...inputs) {
      return inputs.every(inp => inp > 0);
    }
    e.preventDefault();
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.#mapEvent.latlng;

    let workout;
    let temp;
    let weatherIcon;

    (async function () {
      try {
        const data = await this._getWeather(lat, lng);
        temp = data.main.temp;
        weatherIcon = data.weather[0].icon;
      } catch (e) {
        console.error(e.message);
      }
      if (type === 'running') {
        const cadence = Number(inputCadence.value);

        if (
          !validInputs(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)
        ) {
          return alert('Inputs have to be positive numbers');
        }

        //prettier-ignore
        workout = new Running([lat, lng],distance,duration,cadence,temp,weatherIcon);
      }

      if (type === 'cycling') {
        const elevation = Number(inputElevation.value);
        if (
          !validInputs(distance, duration, elevation) ||
          !allPositive(distance, duration)
        ) {
          return alert('Inputs have to be positive numbers');
        }

        //prettier-ignore
        workout = new Cycling([lat, lng],distance,duration,elevation,temp,weatherIcon);
      }
      this.#workouts.push(workout);
      this._renderWorkoutMarker(workout);
      this._renderWorkout(workout);

      // Set local storage
      this._setLocalStorage();
      this._hideForm();
    }.bind(this)());
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type == 'running' ? '🏃' : '🚴'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    //prettier-ignore
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <div class="workout__top">
    <div class="workout__buttons hidden">
    <span class='delete'>Delete</span>
    </div>
    </div>

    <div class="workout__title__container">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="temp_container">
    <span>${workout.temp}°C</span>
    <img class="wicon" src="http://openweathermap.org/img/wn/${workout.weatherIcon}@2x.png"" alt="Weather icon">
    </div>
    </div>
   
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type == 'running' ? '🏃' : '🚴'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === 'running') {
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
  <div class="workout__buttons">
  
  </div>
</li>`;
    }

    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.speed.toFixed(1)}</span>
  <span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⛰</span>
  <span class="workout__value">${workout.elevation}</span>
  <span class="workout__unit">m</span>
</div>

</li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _deleteWorkout(e) {
    function deleteWorkoutHtml() {
      //prettier-ignore
      document.querySelectorAll('.workout').forEach(workout => workout.remove());
      //prettier-ignore
      document.querySelectorAll('.leaflet-popup').forEach(popup => popup.remove())
    }

    const deleteBtn = e.target;
    if (!deleteBtn.classList.contains('delete')) return;
    const id = deleteBtn.closest('.workout').dataset.id;
    deleteWorkoutHtml();
    const currentWorkout = this.#workouts.find(workout => workout.id === id);

    this.#map.eachLayer(layer => {
      //prettier-ignore
      if (layer.options && layer.options.pane === 'markerPane' && layer._latlng.lat === currentWorkout.coords[0] && layer._latlng.lng === currentWorkout.coords[1]) 
      {
        this.#map.removeLayer(layer);
      }
    });

    this.#workouts = this.#workouts.filter(workout => workout.id !== id);
    this.#workouts.forEach(workout => {
      this._renderWorkout(workout);
      this._renderWorkoutMarker(workout);
    });
    localStorage.removeItem('workouts');
    this._setLocalStorage();
  }

  _sortWorkout(e) {
    const sortBtn = e.target;
    if (!sortBtn.classList.contains('sort')) return;
    this.#sort = !this.#sort;

    document.querySelectorAll('.workout').forEach(workout => workout.remove());
    sort.textContent = this.#sort ? 'Sort by Latest' : 'Sort by Distance';
    const sortedWorkout = this.#sort
      ? this.#workouts.slice().sort((a, b) => a.distance - b.distance)
      : this.#workouts;
    sortedWorkout.forEach(workout => this._renderWorkout(workout));

    /* 
    function sortMovements(movs, dates, sort) {
  const combined = movs.map((mov, i) => {
    return [mov, dates[i]];
  });
  const finalMovs = sort ? combined.sort((a, b) => a[0] - b[0]) : combined;
  return finalMovs;
}
    */
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl || e.target.closest('.workout__buttons')) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    //workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
