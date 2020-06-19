import axios from 'axios';

export default axios.create({
    // baseURL: 'http://192.168.1.103:3333/'
    baseURL: 'https://quiz-sphere-backend.herokuapp.com'
});

