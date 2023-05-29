import Notiflix from 'notiflix';
const axios = require('axios').default;


const API_KEY = `36868675-d04d7da5b1942ea7b304f9f1a`;
const BASE_URL = `https://pixabay.com/api/`

const formEl = document.querySelector('.search-form');
const listEL = document.querySelector('.search-list-js')

function onClickSubmit(event) {
    event.preventDefault();

    const input = event.currentTarget.elements['searchQuery']
    const searchResponse = input.value.split(' ').join('+')

    axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then((response) => {
            console.log(response.data.hits)
            console.log(createMarkup(response.data.hits));
            listEL.insertAdjacentHTML('beforeEnd', createMarkup(response.data.hits))
        })
        .catch((erorr) => {
            console.error(erorr)
        })

}

function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
 `  <li class="serch-item">
    <img src="${webformatURL}" alt="${tags}" class="serch-image">
    <p class="info-text-image">${tags}</p>
    <p class="info-text-image">${likes}</p>
    <p class="info-text-image">${views}</p>
    <p class="info-text-image">${comments}</p>
    <p class="info-text-image">${downloads}</p>
  </li>`
    ).join('')
}

formEl.addEventListener('submit', onClickSubmit);


