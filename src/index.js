import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './script/list-photos-markup';
import smoothScroll from './script/smooth-scroll'

// variables

const axios = require('axios').default;

const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`

const formEl = document.querySelector('.search-form');
const listEL = document.querySelector('.search-list-js')
const inputEl = document.querySelector('input[name="searchQuery"]')
const target = document.querySelector('.js-guard');

let perPage = 40
let gallerySlider;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

let observer = new IntersectionObserver(onLoad, options);
let currentPage = 1

// Functions

formEl.addEventListener('submit', onClickSubmit);

function onClickSubmit(event) {

  event.preventDefault();
  currentPage = 1
  getImages(1, 40)
}

async function getFetch(page, perPage) {    
  try {
    const params = new URLSearchParams({
      image_types: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: perPage,
      page,
    })
    const searchResponse = inputEl.value.trim()
    const response = axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&${params}`)
    return response
  } catch (error) {
    console.error(error);
  }
  }

async function getImages(page, perPage) {

  if (inputEl.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
}

  try {
    const response = await getFetch(page, perPage);
    
        if (response.data.hits.length === 0) {
          Notiflix.Notify.failure(`Oooops! No images found for query <i>'${inputEl.value}</i>'`);
          listEL.innerHTML = `<p>Oooops! No images found for query <i>'${inputEl.value}</i>'. Try again!</p>`
          return
        }
        
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images`);
        
        console.log(response.data);
        
        listEL.innerHTML = createMarkup(response.data.hits)
        
        observer.observe(target);
            
        gallerySlider = new SimpleLightbox('.gallery a',
          { captionsData: 'alt', captionDelay: 950, navText: ['❮', '❯'] });

      } catch(erorr) {
            console.error(erorr)
        }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      currentPage += 1
      getFetch(currentPage, perPage)
          .then(response => {
          console.log();
              listEL.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
            gallerySlider.refresh()
              if (currentPage * perPage >= response.data.totalHits && currentPage !== 2) {
              setTimeout(() => {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
              }, 2000);
                observer.unobserve(target)
                return
            }
            
            observer.observe(target);
            
            smoothScroll()
            
          })
  .catch(err => console.log(err));
  }
  })
  }