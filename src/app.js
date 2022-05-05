import './style.css'
import {createModal, isValid} from "./utils";
import {Question} from "./question";
import {authWithEmailAndPassword, getAuthForm} from "./auth";
import {getAnswerForm} from "./answer";
import {answerWithToken} from "./answer";
import { getAuth,
        signOut,
        onAuthStateChanged,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        AuthErrorCodes
        } from "firebase/auth";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC4mnSoFMTwHzDZPqBFYq6Pv5WeWMa65NQ",
    authDomain: "learning-backend-18ff6.firebaseapp.com",
    databaseURL: "https://learning-backend-18ff6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "learning-backend-18ff6",
    storageBucket: "learning-backend-18ff6.appspot.com",
    messagingSenderId: "359118294058",
    appId: "1:359118294058:web:fde6c77f77b5cec89cc753"
};
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const logoutBtn = document.getElementById('logout-btn')
const modalBtn = document.getElementById('modal-btn')

//loginBtn.addEventListener('click', openModal)
//modalBtn.addEventListener('click', openModal)
//window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)

// hiding questions, showing auth form
document.getElementById('question-form').style.display = 'none'
document.getElementById('questions-list').style.display = 'none'
document.getElementById('auth-form-container').innerHTML = getAuthForm()
const authForm = document.getElementById('authForm')
authForm.addEventListener('submit',authFormHandler)




input.addEventListener('input', ()=>{
    submitBtn.disabled = input.value.length<10
})
function submitFormHandler(event){
    event.preventDefault()
    if (isValid(input.value)){
        let uid = JSON.parse(localStorage.getItem('user')).uid
        let question = {
            text: input.value.trim(),
            date: new Date().toJSON(),
            userId: uid
        }
        submitBtn.disabled = true
        Question.create(question).then( () => {
            input.value = ''
            input.className =''
            submitBtn.disabled = false
        })
        console.log(question)
    }

}
function authFormHandler(event){
    event.preventDefault()
    const regBtn    = event.target.querySelector('#confirm-register')
    const loginBtn  = event.target.querySelector('#confirm-login')
    const email     = event.target.querySelector('#email-input').value
    const pass      = event.target.querySelector('#password').value
    const submitter = event.submitter.id
    console.log(submitter)
    loginBtn.disabled = true
    regBtn.disabled = true
    if(submitter === "confirm-register"){
        createUserWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                const user = userCredential.user
                loginHandler(user)
            })
            .catch((error) => {
                if (error.code === AuthErrorCodes.INVALID_PASSWORD){
                    document.getElementById('auth-error-window').innerHTML = "Wrong Password, please try again"
                }
                else {
                    document.getElementById('auth-error-window').innerHTML = `Error: ${error.message}`
                }
                loginBtn.disabled = false
                regBtn.disabled = false
            })
    }
    else if (submitter === "confirm-login"){
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                const user = userCredential.user
                loginHandler(user)
            })
            .catch((error) => {
                if (error.code === AuthErrorCodes.INVALID_PASSWORD){
                    document.getElementById('auth-error-window').innerHTML = "Wrong Password, please try again"
                }
                else {
                    document.getElementById('auth-error-window').innerHTML = `Error: ${error.message}`
                }
                loginBtn.disabled = false
                regBtn.disabled = false
            })
    }
    logoutBtn.style.display = 'inline-block'
    logoutBtn.addEventListener('click', logoutHandler)
    // authWithEmailAndPassword(email,pass)
    //     .then(token => {localStorage.setItem('token', token)
    //                     return token} )
    //     .then(Question.fetch) // равносильно  token => {return Question.fetch(token)}
    //     .then(renderAllQuestions)
    //     .then(() => btn.disabled = false)

}

function renderAllQuestions(content){
    if (typeof content === "string"){
        return {title:"Ошибка", content}
    } else {

        Array.from(document.querySelectorAll(".answer-start"))
            .map((node)=>node.addEventListener('click', openAnswerForm))
        return {title:'Question list', content:Question.listToHTML(content)}
    }

}
// function openModal(){
//     const token = localStorage.getItem("token")
//     if(token){
//         Question.fetch(token)
//             .then(renderAllQuestions)
//     }
//     else {
//         createModal('Authorization', getAuthForm())
//         document
//             .getElementById('authForm')
//             .addEventListener('submit', authFormHandler, {once: true})
//
//     }
//
// }
function openAnswerForm(event){
    createModal('Answer', getAnswerForm(event))
    document
        .getElementById('answerForm')
        .addEventListener('submit', answerFormHandler, {once: true})

}
async function answerFormHandler(event){
    event.preventDefault()
    console.log(event)
    const questionId = event.target.previousSibling.previousSibling.className
    const modal = document.querySelector('modal')


    console.log(questionId)
    const btn   = event.target.querySelector('button')
    const answer = event.target.querySelector('#answer-input').value
    const token = localStorage.getItem('token')

    btn.disabled = true
    await answerWithToken(answer, questionId)
    btn.disabled = false
    mui.overlay('off', modal)

    /*
    authWithEmailAndPassword(email,pass)
        .then(Question.fetch) // равносильно  token => {return Question.fetch(token)}
        .then(renderAllQuestions)
        .then(() => btn.disabled = false)

     */

}

async function loginHandler(user){
    localStorage.setItem('user', JSON.stringify(user))
    document.getElementById('auth-form-container').style.display = 'none'
    const questions = document.getElementById('questions-list')
    questions.style.display = 'block'

    if (user.uid === '6YIgvt5RtZQuC6oetY6aBCJoV2O2'){
        let questionContent = await Question.fetch()
        questions.innerHTML = Question.listToHTML(questionContent)
        document.querySelectorAll('.answer-start').forEach(
            q =>
            q.addEventListener('click', openAnswerForm))
    } else {
        document.getElementById('question-form').style.display = 'block'
        await Question.renderList()
    }
}

function logoutHandler(){
    signOut(auth)
    logoutBtn.style.display = 'none'
    document.getElementById('questions-list').style.display = 'none'
    document.getElementById('question-form').style.display = 'none'
    document.getElementById('auth-form-container').style.display = 'block'
    document.getElementById('confirm-login').disabled = false
    document.getElementById('confirm-register').disabled = false

}


export {auth, app}