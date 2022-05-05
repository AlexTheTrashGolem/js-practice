export function getAuthForm(){
    return`
    <form class="mui-form" id="authForm">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="email" id="email-input" required>
            <label for="email-input">Email</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
            <input type="password" id="password" required>
            <label for="password">Password</label>
        </div>
        <button
                id="confirm-login"
                type="submit"
                class="mui-btn mui-btn--raised mui-btn--primary login"
        >
            Login 
        </button>
        <button
                id="confirm-register"
                type="submit"
                class="mui-btn mui-btn--raised mui-btn--primary register"
        >
            Register 
        </button>
    </form>
    <div id="auth-error-window"></div>
    `
}
