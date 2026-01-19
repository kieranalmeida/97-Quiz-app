import React from "react"
import { decode } from "html-entities"

export default function App() {
    // Controls the page
    const [page, setPage] = React.useState("quiz") // Revert to "start"
    // Controls whether or not the quiz is in progress
    const [isQuizOver, setIsQuizOver] = React.useState(false)
    // Stores the 5 random questions obtained from OTDB
    const [allQuestions, setAllQuestions] = React.useState([])

    // Automatically start the quiz once only
    React.useEffect( () => {
        startQuiz()
    }, [])
    
    // Starts or restarts the quiz when called. 5 random questions are obtained from OTDB and the results are stored in state
    function startQuiz() {
        try {
            fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
                .then(res => res.json() )
                .then(data => {
                    setAllQuestions(data.results)
                    setIsQuizOver(false)
                    console.log("Data obtained")
                    console.log(data)
                })
        }
        catch(error) {
            console.error(`There was an error fetching the data: ${error}`)
        }
    }
    
    // Iterate through each question and create a H2 element for each one
    const questionsHtml = allQuestions.map( ({question}) => {
        return (
            <h2>{question}</h2>
        )
    })

    console.log("Results below")
    console.log(allQuestions)

    const allAnswersHtml = allQuestions.map( ({incorrect_answers, correct_answer}, index) => {
        // Get a random index up to the length of incorrect_answers + 1
        const randomIndex = Math.floor(Math.random() * incorrect_answers.length + 1)
        // Insert the correct answer into incorrect_answers at the random index
        incorrect_answers.splice(randomIndex, 0, correct_answer)

        // Get a label and radio input for each of the four answers inside each answer set
        return incorrect_answers.map( (answer) => {
            return (
                <>
                    <label 
                        htmlFor={`answer-${incorrect_answers.indexOf(answer)}`}
                    >
                        {answer}
                    </label>

                    <input 
                        id={`answer-${incorrect_answers.indexOf(answer)}`} 
                        type="radio" 
                        name={`answerSet-${index + 1}`} 
                        required
                    >
                    </input>
                </>
            )
        })
    })

    console.log(allAnswersHtml)

    const allHtml = questionsHtml.map( (question, index) => {
        return (
            <>
                {question}
                {allAnswersHtml[index]}
            </>
        )
    })

    // Use index parameter to match the questions to each answer set
    // Render each chunk of HTML in the form if the quiz is not over

    // Handles quiz submission
    function handleQuizSubmit(e) {
        e.preventDefault()
        console.log("Quiz submitted")

        if (isQuizOver) {
            // If submitted and quiz is over, restart the quiz
        }
    }

    return (
        <>
        {page == "start" &&
            <main className="start-page">
                <h1 className="start-page-title">Quizzical</h1>
                <h2 className="start-page-desc">Answer 5 random trivia questions</h2>
                <button className="start-btn" onClick={startQuiz}>Start quiz</button>
                <img className="blob-top" src="images/blob-top.png"></img>
                <img className="blob-bottom" src="images/blob-bottom.png"></img>
            </main>}

        {page == "quiz" &&
            <main className="quiz-page">
                <form onSubmit={handleQuizSubmit}>
                    {allHtml}
                    <button>{isQuizOver ? "Play again" : "Check answers"}</button>
                </form>
            </main>}
        </>
    )
}