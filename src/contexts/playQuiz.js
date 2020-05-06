import React, { useState, useEffect, createContext } from 'react';


const PlayQuizContext = createContext({
    questionIndex: -1,
    questionTitle: '',
    options: [],
    correctAnswers: [],
    showCorrectAnswer: false,
});


export default PlayQuizContext;