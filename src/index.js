import './css/styles.css';
import { fetchCountries } from './fetchData/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const ref = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

ref.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(name) {
  name = ref.input.value.trim();
  if (name === '') {
    return clearMarkup();
  }

  fetchCountries(name).then(renderElement).catch(alertNotFound);
}
function createMarkupInfo(countries) {
  return countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
       <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
       <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
       <li class="country-info__item"><p><b>Languages: </b>${Object.values(
         languages
       ).join(', ')}</p></li>
   </ul>`;
    })
    .join('');
}
function createMarkupList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `
               <li class="country-list__item">
               <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
               <h2 class="country-list__name">${name.official}</h2>
           </li>`;
    })
    .join('');
}
function clearMarkup() {
  ref.countryList.innerHTML = '';
  ref.countryInfo.innerHTML = '';
}

function renderElement(countries) {
  clearMarkup();
  if (countries.length === 1) {
    ref.countryList.insertAdjacentHTML(
      'beforeend',
      createMarkupList(countries)
    );
    ref.countryInfo.insertAdjacentHTML(
      'beforeend',
      createMarkupInfo(countries)
    );
  } else if (countries.length >= 10) {
    alertManyFound();
  } else {
    ref.countryList.insertAdjacentHTML(
      'beforeend',
      createMarkupList(countries)
    );
  }
}

function alertManyFound() {
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
function alertNotFound() {
  Notify.failure('"Oops, there is no country with that name');
}
