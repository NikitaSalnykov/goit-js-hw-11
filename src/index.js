import './css/style.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;


const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`

const formEl = document.querySelector('.search-form');
const listEL = document.querySelector('.search-list-js')

function onClickSubmit(event) {

    listEL.innerHTML = ''

    event.preventDefault();

    const input = event.currentTarget.elements['searchQuery']
    const searchResponse = input.value.split(' ').join('+')

    axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then((response) => {
            if (response.data.hits.length === 0) {
                Notiflix.Notify.failure(`Oooops! No images found for query <i>'${input.value}</i>'`);
                listEL.innerHTML = `<p>Oooops! No images found for query <i>'${input.value}</i>'. Try again!</p>`
                return
            }
            Notiflix.Notify.success(`Hooray! We found ${response.data.total} images`);
            console.log(response.data);
            listEL.insertAdjacentHTML('beforeEnd', createMarkup(response.data.hits))
        })
        .catch((erorr) => {
            console.error(erorr)
        })

}

function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
 `  <li class="serch-item">
     <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" class="serch-image">
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
    </div>
  </li>`
    ).join('')
}

formEl.addEventListener('submit', onClickSubmit);


