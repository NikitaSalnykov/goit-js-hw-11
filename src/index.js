import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './script/list-photos-markup';


// variables

const axios = require('axios').default;

const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`
const perPage = 40

const formEl = document.querySelector('.search-form');
const listEL = document.querySelector('.search-list-js')
const inputEl = document.querySelector('input[name="searchQuery"]')
const target = document.querySelector('.js-guard');

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
    getImages(1)
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

    const searchResponse = inputEl.value.split(' ').join('+')
    const response = axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&${params}`)
    return response
  } catch (error) {
    console.error(error);
  }
  }

async function getImages(page, perPage) {
  try {
    const response = await getFetch(page, perPage);
    
        if (response.data.hits.length === 0) {
          Notiflix.Notify.failure(`Oooops! No images found for query <i>'${inputEl.value}</i>'`);
          listEL.innerHTML = `<p>Oooops! No images found for query <i>'${inputEl.value}</i>'. Try again!</p>`
          return
        }
        
        Notiflix.Notify.success(`Hooray! We found ${response.data.total} images`);
        
        console.log(response.data);
        
        listEL.innerHTML = createMarkup(response.data.hits)
        
        observer.observe(target);
            
        gallerySlider = new SimpleLightbox('.gallery a',
          { captionsData: 'alt', captionDelay: 950, navText: ['❮', '❯'] });

      } catch(erorr) {
            console.error(erorr)
        }
}

async function onLoad(entries, observer) {
  try {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
       
        console.log(entries);
        currentPage += 1;

        const response = await getFetch(currentPage, perPage);
        console.log(response);

        listEL.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
        gallerySlider.refresh();

        if (currentPage * perPage >= response.data.totalHits) {
          setTimeout(() => {
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
          }, 2000);
        }
        observer.unobserve(target);
      }
    });
  } catch (error) {
    console.error(error);
  }
}