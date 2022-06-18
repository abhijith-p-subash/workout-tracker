import axios from 'axios';

const instance = axios.create({baseURL: 'https://exercisedb.p.rapidapi.com/exercises'});
instance.defaults.headers.common['X-RapidAPI-Key'] = '5cbb122e72msh37765a89629d9b6p12ccddjsnde4131095a6f';
instance.defaults.headers.common['X-RapidAPI-Host'] = 'exercisedb.p.rapidapi.com';

export default instance