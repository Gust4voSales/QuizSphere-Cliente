import axios from 'axios';

// http://192.168.1.103:3333/
export default axios.create({
    baseURL: 'https://quiz-sphere-backend.herokuapp.com'
});

