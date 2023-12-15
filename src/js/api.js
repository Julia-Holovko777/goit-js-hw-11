import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41206300-e7b4ce28395152b107a61eaa1';

export async function fetchImage(q, page = 1) {
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = 'true';
  const per_page = 40;

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
