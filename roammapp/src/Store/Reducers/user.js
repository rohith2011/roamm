

const initialState = {
    isLoggedIn: false,
    info:{}
}

export default function user(state=initialState, action){
    switch(action.type){

        case "USER_LOGIN_SUCCESS":
            return {...state,isLoggedIn:true,info:{...action.data}}

        default:
            return state;
    }
}