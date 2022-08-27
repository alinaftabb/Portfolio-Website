import setAuthToken from "./setAuthToken";

export function runLogoutTimer(dispatch, timer, history) {
    setTimeout(() => {
        dispatch(logout(history))
    }, timer)
}

function checkAutoLogin(dispatch, history) {
    const tokenDetailsString = localStorage.getItem("userDetails")
    let tokenDetails = ""
    if (!tokenDetailsString) {
        dispatch(logout(history))
        return
    }

    tokenDetails = JSON.parse(tokenDetailsString)
    let expireDate = new Date(tokenDetails.expireDate)
    let todaysDate = new Date()

    if (todaysDate > expireDate) {
        dispatch(logout(history))
        return
    }

    if (tokenDetails.company_profile === true && tokenDetails.verified === true) {
        dispatch(loginConfirmedAction(tokenDetails))
    } else {
        dispatch(loginInCompleteData(tokenDetails))
        setTimeout(() => history.push("/register"), 900)
    }

    const timer = expireDate.getTime() - todaysDate.getTime()
    runLogoutTimer(dispatch, timer, history)
}

export default checkAutoLogin;