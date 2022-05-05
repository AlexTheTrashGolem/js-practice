import './nologin.jpg'
export class Question{
    static create(question){
        const user = JSON.parse(localStorage.getItem('user'))
        const token = user.stsTokenManager.accessToken
        return fetch(`https://learning-backend-18ff6-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`, {
            method: 'POST',
            body:JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(q=> addToLocalStorage(q.id))
            .then(Question.renderList)
    }
    static async renderList(){
        const user = JSON.parse(localStorage.getItem('user'))
        const uid = user.uid
        const token = user.stsTokenManager.accessToken
        console.log("token"+token)
        let questions = await fetch(`https://learning-backend-18ff6-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}&orderBy="userId"&equalTo="${uid}"`)
            .then(response => response.json())
            .then(response =>{
                // if(!response ){
                //     return `<p class="error">No questions yet</p>`
                // }
                if(response && response.error){
                    return `<p class="error">${response.error}</p>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id:key
                })) :[]
            })
        //questions = JSON.stringify(questions)
        console.log('render list'+ questions)
        const html = questions.length
            ? toCard(questions)
            : `<div class="mui--text-headline">No questions this far</div>`
        const list = document.getElementById('questions-list')
        list.innerHTML = html


    }
    static listToHTML(questions){
        return questions.length
            ? `<ol>
                ${questions.map(q => {
                                const answered = q.answer
                                                ? "Your Answer: " + q.answer.text
                                                : ""
                                return`<li class="admin-questions" id="${q.id}">
                                        <span class="question-text">${q.text} <br> ${answered}</span>
                                        <button class="mui-btn answer-start">Answer</button>
                                      </li>
                                        `}).join('')}
                </ol>`
            : `<p>No questions </p>`
    }

    static fetch(){
        const user = JSON.parse(localStorage.getItem('user'))
        const token = user.stsTokenManager.accessToken
        if(!token){
            return Promise.resolve(`<img src='./91154c691d4dc59267b1.jpg' alt="no login?" height="400px"/>`)
        }

         return fetch(`https://learning-backend-18ff6-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
             .then(response => response.json())
             .then(response =>{
                     // if(!response ){
                     //     return `<p class="error">No questions yet</p>`
                     // }
                 if(response && response.error){
                     return `<p class="error">${response.error}</p>`
                 }
                 return response ? Object.keys(response).map(key => ({
                     ...response[key],
                         id:key
                 })) :[]
             })

    }
}

function addToLocalStorage(question){
    const all = getQuestionsFromLocalStorage()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(questions){
    return questions.map(question=> {
        let cardHtml = `<div class="mui--text-black-54">
                        ${new Date(question.date).toLocaleDateString()}
                        ${new Date(question.date).toLocaleTimeString()}
                    </div>
                    <div>${question.text}</div>
                    `

        if (question.answer) {
            cardHtml += `<div>Ответ: ${question.answer.text}</div>`
        }

        cardHtml += `<br>`
        return cardHtml
    }).join(' ')


}





