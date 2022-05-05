export function getAnswerForm(event){
    console.log(event)
    return`
    <h1 class='${event.target.parentElement.id}'>${event.target.previousSibling.data}</h1>
    <form class="mui-form" id="answerForm">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="text" id="answer-input" required>
            <label for="answer-input">Your answer</label>
        </div>
        <button
                type="submit"
                class="mui-btn mui-btn--raised mui-btn--primary"
        >
            Answer 
        </button>
    </form>
    `
}

export function answerWithToken(answer, questionId){
    const user = JSON.parse(localStorage.getItem('user'))
    const token = user.stsTokenManager.accessToken
    return fetch(`https://learning-backend-18ff6-default-rtdb.europe-west1.firebasedatabase.app/questions/${questionId}/answer.json?auth=${token}`, {
        method: 'PATCH',
        body:JSON.stringify({
            date: new Date().toJSON(),
            text: answer.trim(),
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
}