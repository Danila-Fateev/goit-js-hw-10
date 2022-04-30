import './css/styles.css';
import Notiflix from 'notiflix'

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    ul: document.querySelector('.country-list'),
    div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries() {
    const inputValue = refs.input.value.trim();
    if (!inputValue) {
        refs.ul.innerHTML = "";
        return;
    }
    fetch(`https://restcountries.com/v2/name/${inputValue}?fields=name,capital,population,flags,languages`)
        .then((r) => {
            if (r.status === 200) {
            return r.json()
            } else {
                Notiflix.Notify.failure("Oops, there is no country with that name")
                throw new Error("Oops, there is no country with that name")
        }
        }).then((r) => {
            if (r.length === 1) {
                const list = r.map((el) => `<li><img src="${el.flags.svg}" alt="flag"></img><b>${el.name}</b><p><b>Capital:<b> ${el.capital}</p><p><b>Population:</b> ${el.population}</p><p><b>Languages:</b> ${el.languages.map(el => `${el.name}`).join('')}</p></li>`).join('');
                refs.ul.innerHTML = list;
                return;
            } if (r.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
                refs.ul.innerHTML = ""
            }
            else {
                const list = r.map((el) => `<li><img src="${el.flags.svg}" alt="flag"></img><b>${el.name}</b></li>`).join('');
                refs.ul.innerHTML = list;
        }
        }
        )
        .catch(r => {
            console.log(r)
            refs.ul.innerHTML = "";
        })
}