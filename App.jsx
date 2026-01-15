import React from "react"
import { decode } from "html-entities"

export default function App() {
    // Controls the state of the quiz (whether or not it has started)
    const [quizStarted, setQuizStarted] = React.useState(true) // Revert to false
    // Used only to retrigger useEffect and restart the quiz
    const [quizReset, setQuizReset] = React.useState(true)
    // Stores the 5 random questions obtained from OTDB
    const [allQuestions, setAllQuestions] = React.useState()

    let isQuizOver = false 

    // Starts the quiz
    function startQuiz() {
        setQuizStarted(true)
    }

    // Toggles the state of quizReset, which triggers useEffect again and generates 5 new questions (link to play again button later)
    function restartQuiz() {
        setQuizReset(!quizReset)
    }

    // Get 5 random questions from OTDB and store them in state
    React.useEffect( () => {
        fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
            .then(res => res.json() )
            .then(data => {
                setAllQuestions(data) 
                console.log("Data obtained")
            })
    }, [quizReset])

    // Handles quiz submission
    function handleQuizSubmit(e) {
        e.preventDefault()
        console.log("Quiz submitted")

        if (!isQuizOver) {
            // Display results if isQuizOver = true
        }
        if (isQuizOver) {
            setQuizReset(!quizReset)
        }

        isQuizOver = !isQuizOver
    }

    return (
        <>
        {!quizStarted &&
            <main className="start-page">
                <h1 className="start-page-title">Quizzical</h1>
                <h2 className="start-page-desc">Answer 5 random trivia questions</h2>
                <button className="start-btn" onClick={startQuiz}>Start quiz</button>
                <img className="blob-top" src="images/blob-top.png"></img>
                <img className="blob-bottom" src="images/blob-bottom.png"></img>
            </main>}

        {quizStarted &&
            <main className="quiz-page">
                <form onSubmit={handleQuizSubmit}>

                    <button>Check answers</button>
                </form>
            </main>}
        </>
    )
}