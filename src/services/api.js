import axios from 'axios';

export default axios.create({
    baseURL: 'https://quiz-sphere-backend.herokuapp.com'
});

