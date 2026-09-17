import React from "react"
import { Fragment } from "react"
import { clsx } from "clsx"
import { decode } from "html-entities"

export default function App() {
    // Controls the page
    const [page, setPage] = React.useState("quiz") // Revert to "start"
    // Controls whether or not the quiz is in progress
    const [isQuizOver, setIsQuizOver] = React.useState(false)
    // Stores the 5 random questions obtained from OTDB
    const [allQuestions, setAllQuestions] = React.useState([])
    // Store the selected answers to each question (each index holds the one answer for each answer set)
    const [selectedAnswers, setSelectedAnswers] = React.useState(["placeholder", "placeholder", "placeholder", "placeholder", "placeholder"])
    // Store the correct answers to each question
    const correctAnswers = allQuestions.map( ({correct_answer}) => {
        return correct_answer
    })

    // Automatically start the quiz once only
    React.useEffect( () => {
        startQuiz()
    }, [])
    
    // Starts or restarts the quiz when called. 5 random questions are obtained from OTDB and the necessary data is stored in state
    function startQuiz() {
            fetch("https://opentdb.com/api.php?amount=5&type=multiple")
                .then(res => res.json() )
                .then(data => {
                    const questionsAndAnswers = data.results.map( (question) => {     

                        // Contains each question, its three incorrect answers and the correct answer separately solely to obtain the correctAnswers array
                        const questionObject = {
                            question: question.question,
                            answers: [...question.incorrect_answers],
                            correct_answer: question.correct_answer
                        }
                        
                        // Get a random index from 0 up to the length of incorrect_answers + 1, rounded down
                        const randomIndex = Math.floor(Math.random() * (question.incorrect_answers.length + 1) )
                        // Insert the correct answer into the random index
                        questionObject.answers.splice(randomIndex, 0, question.correct_answer)

                        return questionObject
                    })

                    setAllQuestions(questionsAndAnswers)
                    setIsQuizOver(false)
                    console.log("Data obtained: ", questionsAndAnswers)
                })
                .catch( (error) => {
                    console.error(`There was an error fetching the data: ${error}`)
                })
    }

    // Add an answer to selectedAnswers. Each answerSetNum targets the corresponding index in selectedAnswers, allowing only one selected answer for each answer set
    function selectAnswer(answer, answerSetNum) {
        setSelectedAnswers( (prevSelectedAnswers) => {
            const newAnswers = [...prevSelectedAnswers]
            newAnswers[answerSetNum] = answer
            return newAnswers
        })
    }

    console.log("Selected answers: ", selectedAnswers)

    // Dynamic class for each answer radio label
    function getAnswerClass(answer, answerSetNum) {
        return clsx({
            // Quiz is not over and the answer is not chosen but is being hovered over (apply lighter blue border from selected styling)
            unselected: !isQuizOver && selectedAnswers[answerSetNum] !== answer,
            // Quiz is not over and the answer is the one chosen for the current answer set (apply blue background)
            selected: !isQuizOver && selectedAnswers[answerSetNum] === answer,
            // Quiz is over and the answer is the correct one for the current answer set, regardless if was the one chosen or not (apply green background)
            correct: isQuizOver && correctAnswers[answerSetNum] === answer,
            // Quiz is over and the answer is not the correct one for the current answer set but is chosen (apply red background + fade out)
            incorrect: isQuizOver && correctAnswers[answerSetNum] !== answer && selectedAnswers[answerSetNum] === answer,
            // Quiz is over and the answer is  not the correct one for the current answer set and is not chosen (apply grey background + fade out)
            other: isQuizOver && correctAnswers[answerSetNum] !== answer && selectedAnswers[answerSetNum] !== answer
        })
    }

    // Get HTML for each answer set
    const allAnswersHtml = allQuestions.map( ({answers}, index) => {
        // Gets the number of the current answer set (from 0-4)
        const answerSetNum = index

        // Get a label and radio input for each of the four answers inside each answer set
        return answers.map( (answer) => {
            return (
                <Fragment
                    key={answer}
                >
                    <label 
                        htmlFor={`answer-${answerSetNum}-${answers.indexOf(answer)}`}
                        className={"answer-label " + getAnswerClass(answer, answerSetNum)}
                    >
                        {decode(answer)}
                    </label>

                    <input
                        id={`answer-${answerSetNum}-${answers.indexOf(answer)}`}
                        className="answer-radio"
                        type="radio" 
                        name={`answerSet-${index + 1}`} 
                        onChange={() => selectAnswer(answer, answerSetNum)}
                        required
                        disabled={isQuizOver}
                    >
                    </input>
                </Fragment>
            )
        })
    })

    // Creates the HTML containing each question and matching answer set
    const allHtml = allQuestions.map( ({question}, index) => {
        return (
            <Fragment
                key={`answerSet-${index + 1}`} 
            >
                <h2 className="question">{decode(question)}</h2>
                <div className="answer-container">
                    {allAnswersHtml[index]}
                </div>
            </Fragment>
        )
    })

    // Handles quiz submission
    function handleQuizSubmit(e) {
        e.preventDefault()
        console.log("Quiz submitted")

        // If the quiz is over, the submit button changes to "play again" and can now be clicked to restart the quiz
        if (isQuizOver) {
            startQuiz()
            return
        }

        // Sets quiz state to over on first submit, causing state re-render and revealing correct answers. On second submit, the quiz is restarted by the above
        setIsQuizOver(!isQuizOver)
    }

    return (
        <>
        {page == "start" &&
            <main className="start-container">
                <h1 className="start-page-title">Quizzical</h1>
                <h2 className="start-page-desc">Answer 5 random trivia questions</h2>
                <button className="start-btn" onClick={startQuiz}>Start quiz</button>
                <img className="start-blob-top" src="/images/blob-top.png"></img>
                <img className="start-blob-bottom" src="/images/blob-bottom.png"></img>
            </main>}

        {page == "quiz" &&
            <main className="quiz-container">
                <form onSubmit={handleQuizSubmit}>
                    {allHtml}
                    <div className="form-end-container">
                        {isQuizOver && <p className="quiz-tally">You scored {
                            selectedAnswers.filter( (answer) => correctAnswers.includes(answer) ).length
                            }/5 correct answers</p>}
                        <button className="form-submit">{isQuizOver ? "Play again" : "Check answers"}</button>
                    </div>
                </form>
                <img className="quiz-blob-top" src="/images/blob-top.png"></img>
                <img className="quiz-blob-bottom" src="/images/blob-bottom.png"></img>
            </main>}
        </>
    )
}