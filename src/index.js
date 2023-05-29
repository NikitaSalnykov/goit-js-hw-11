import Notiflix from 'notiflix';
const axios = require('axios').default;

const formEl = document.querySelector('.search-form');

function onClickSubmit(event) {
    event.preventDefault();

    const input = event.currentTarget.elements['searchQuery']
    const searchResponse = input.value

    console.log(searchResponse);
}

formEl.addEventListener('submit', onClickSubmit);

axios.get

