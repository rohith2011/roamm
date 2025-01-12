import { CognitoUserPool,CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";

export const login = (userObject) =>
    async dispatch => {
        console.log(userObject)
        dispatch({type:"USER_LOGIN_SUCCESS",data: userObject})
    }