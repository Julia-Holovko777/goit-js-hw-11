import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/makeup';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let page = 1;
let currentSum = 0;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
  captionPosition: 'top',
});
searchForm.addEventListener('submit', onValueSubmit);
btnLoadMore.addEventListener('click', onLoadMore);

function onValueSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';

  const enteredValue = event.currentTarget[0].value.trim();
  if (enteredValue === '') {
    return Notiflix.Notify.warning('Please type something to search');
  }
  localStorage.setItem('key', enteredValue);
  render();
  searchForm.reset();
}

async function fetchImage(page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '41206300-e7b4ce28395152b107a61eaa1';
  const q = localStorage.getItem('key');
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = 'true';
  const per_page = 60;

  const queryParams = new URLSearchParams({
    key: API_KEY,
    q,
    image_type,
    page,
    orientation,
    safesearch,
    per_page,
  });
  try {
    const res = await axios.get(`${BASE_URL}?${queryParams}`);
    return await res.data;
  } catch (error) {
    throw new Error(error);
  }
}

async function render() {
  try {
    const data = await fetchImage(page);
    if (!data.hits.length > 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    check(data.hits.length, data.totalHits);
    lightbox.refresh();
  } catch (error) {
    console.log('error', error);
  }
}

async function onLoadMore() {
  try {
    page += 1;
    const data = await render();
  } catch (error) {
    console.log('error', error);
  }
  lightbox.refresh();
}

function check(current, total) {
  currentSum += current;
  if (currentSum >= total) {
    btnLoadMore.classList.add('visibility-hidden');
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  Notiflix.Notify.success(`Hooray! We found ${currentSum} of ${total}images.`);
  btnLoadMore.classList.remove('visibility-hidden');
}
