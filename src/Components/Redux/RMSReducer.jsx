import {LOGIN,SETPROFILE,DELETESTATE, SETWEBSOCKETSTATE, MENUITEM, CHANGETHEME} from "./RMSType"

const initialState = []

const RMSReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            state=action.data
            return state

        case SETPROFILE:
            state={...state,profile_pic:''}
            return {...state,profile_pic:action.data}

        case DELETESTATE:
            // state=undefined
            return undefined

        case SETWEBSOCKETSTATE:
            state={...state,SocketData:''}
            // console.log(action.data);
            return {...state,SocketData:action.data}
        case MENUITEM:
            // console.log(action.data);
            return {...state,menuitem:action.data}
        case CHANGETHEME:
            // console.log({...state,
            //     settings:{
            //         ...state.settings,
            //         defaulttheme:action.data
            //     }});
            return {...state,settings:{...state.settings,defaulttheme:action.data}}



        default:
            break;
    }
}

export default RMSReducer