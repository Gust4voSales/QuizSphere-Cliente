import React, { useState, useEffect, createContext } from 'react';


const PlayQuizContext = createContext({
    quiz: {},
    questionIndex: 0,
    questionTitle: '',
    options: [],
    correctAnswers: 0,
    answeredQuestions: [],
});


export default PlayQuizContext;