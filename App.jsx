import React from "react"

export default function App() {
    // Controls the state of the quiz (whether or not it has started)
    const [quizStarted, setQuizStarted] = React.useState(false)

    // Starts the quiz
    function startQuiz() {
        setQuizStarted(true)
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
        </>
    )
}