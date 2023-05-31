import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios').default;


const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`
const perPage = 40

const formEl = document.querySelector('.search-form');
const listEL = document.querySelector('.search-list-js')
const inputEl = document.querySelector('input[name="searchQuery"]')
const target = document.querySelector('.js-guard');
let gallerySlider;

function onClickSubmit(event) {


    event.preventDefault();

    getImages(1)

}

function getImages(page, perPage) {
    
    getFetch(page, perPage)
        .then((response) => {
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

        })
        .catch((erorr) => {
            console.error(erorr)
        })
}

function getFetch(page, perPage) {
    
    const params = new URLSearchParams({ image_types: 'photo', orientation: 'horizontal', safesearch: 'true', per_page: perPage, page, })
    const searchResponse = inputEl.value.split(' ').join('+')
    return axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&${params}`)
}

function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
 `  <li class="serch-item photo-card">
      <a class="gallery__link" href=${largeImageURL}>
      <img src="${webformatURL}" alt="${tags}" class="serch-image">
      </a>
     <div class="info">
    <p  class="info-item">
       <b>Likes</b> ${likes}
    </p>
    <p  class="info-item">
    <b>Views</b> ${views}
    </p>
    <p  class="info-item">
    <b>Comments</b> ${comments}
    </p>
    <p  class="info-item">
     <b>Downloads</b> ${downloads}
    </p>
    </div>
  </li>`
    ).join('')
  
}

formEl.addEventListener('submit', onClickSubmit);

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

let observer = new IntersectionObserver(onLoad, options);
let currentPage = 1


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
              if (currentPage * perPage >= response.data.totalHits) {
              setTimeout(() => {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
              }, 2000);
          observer.unobserve(target)
              }
              
})
  .catch(err => console.log(err));
  }
  })
  }