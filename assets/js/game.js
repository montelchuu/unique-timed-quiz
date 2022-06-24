const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('question-counter');
const scoreText = document.getElementById('score');
const startBtn = document.querySelector("#start");
const startingCont = document.querySelector("#starting");
const gameQuestions = document.querySelector("#game");
const endCont = document.querySelector("#end");
const highscoresCont = document.querySelector("#highscores");
const containerEl = document.querySelector(".container");
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const highscoreBtn = document.querySelector("#highscore");
const highScoresList = document.getElementById('highScoresList');
const clearScrBtn = document.querySelector("#clearscores");

let currentQuestion = {};
let acceptingAnswers = false;
let sec = 100;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: 'Javascript is an _______ language?',
        choice1: 'Object-Oriented',
        choice2: 'Object-Based',
        choice3: 'Procedural',
        choice4: 'None of the above',
        answer: 1,
    },
    {
        question: 'Which of the following keywords is used to define a variable in Javascript?',
        choice1: 'var',
        choice2: 'let',
        choice3: 'Both A and B',
        choice4: 'none of the above',
        answer: 3,
    },
    {
        question: 'Which of the following methods can be used to display data in some form using Javascript?',
        choice1: 'document.write()',
        choice2: 'console.log()',
        choice3: 'window.alert()',
        choice4: 'All of the above',
        answer: 4,
    },
    {
        question: 'When an operaters value is NULL, the typeof returned by the unary operator is:',
        choice1: 'Boolean',
        choice2: 'Undefined',
        choice3: 'Object',
        choice4: 'Integer',
        answer: 3,
    },
    {
        question: 'What does the Javascript “debugger” statement do?',
        choice1: 'It will debug all the errors in the program at runtime.',
        choice2: 'It acts as a breakpoint in a program.',
        choice3: 'It will debug error in the current statement if any.',
        choice4: 'All of the above',
        answer: 2,
    },
    {
        question: 'Which function is used to serialize an object into a JSON string in Javascript?',
        choice1: 'stringify()',
        choice2: 'parse()',
        choice3: 'convert()',
        choice4: 'None of the above',
        answer: 1,
    },
    {
        question: 'Which of the following are closures in Javascript',
        choice1: 'Variables',
        choice2: 'Functions',
        choice3: 'Objects',
        choice4: 'All of the above',
        answer: 4,
    },
    {
        question: 'Which of the following is not a Javascript framework?',
        choice1: 'Node',
        choice2: 'Vue',
        choice3: 'React',
        choice4: 'Cassandra',
        answer: 4,
    },
];

const totalQuestions = 8;

function startQuiz() {
    startingCont.style.display = "none";
    gameQuestions.style.display = "block";
    questionCounter = 0;
    availableQuestions = [...questions];
    alert("Rules \n\nCorrect answer +10 sec. \nIncorrect answer -10 sec. \nTotal score = remaining sec.")
    getNewQuestion();
    timer();
}

function viewHighScores () {
    startingCont.style.display = "none";
    highscoresCont.style.display = "flex";
    endCont.style.display = "none";
    containerEl.style.display = "block";
    gameQuestions.style.display = "none";
}
function timer () {
    let timer = setInterval(function () {
        document.getElementById('score').innerHTML = sec;
        sec--;
        if (sec === 0 || questionCounter === questions.length + 1) {
            clearInterval(timer);
            alert("Quiz over!");
            endCont.style.display ="flex";
            finalScore.innerText = sec;
            gameQuestions.style.display = "none";
        }
    }, 1000);
}

getNewQuestion = () => {
    questionCounter++;
    if (questionCounter === questions.length + 1) {
        return;
    }
    questionCounterText.innerText = `${questionCounter}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = 'incorrect';
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct';
        };

        if(classToApply === 'correct') {
            sec = sec + 10;
            scoreText.innerHTML = sec;
        }

        if(classToApply === 'incorrect') {
            sec = sec - 10;
            scoreText.innerHTML = sec;
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500);
    });
});

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: sec,
        name: username.value
    };
    highScores.push(score);
    highScores.sort((a,b) => b.score - a.score)
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign("./index.html");
};

highScoresList.innerHTML = highScores
    .map(score => {
        return `<li class="high-score">${score.name} - ${score.score}</li>`;
    })
    .join("");

function clearScores() {
    localStorage.clear();
    highScoresList.innerHTML="";
}

startBtn.addEventListener("click", startQuiz);
highscoreBtn.addEventListener("click", viewHighScores);
clearScrBtn.addEventListener("click", clearScores);