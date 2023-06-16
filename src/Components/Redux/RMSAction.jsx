
import {LOGIN,SETPROFILE ,DELETESTATE, SETWEBSOCKETSTATE, MENUITEM, CHANGETHEME} from "./RMSType"

export const LoginAction = (data) => {
    return {
        type: LOGIN,
        data: data
    }
}


export const SetProfileImageAction = (data) => {
    return {
        type: SETPROFILE,
        data: data
    }
}
export const DeleteStateAction = () => {
    return {
        type: DELETESTATE
    }
}

export const SetWebSocketDataAction = (data) => {
    return {
        type: SETWEBSOCKETSTATE,
        data: data
    }
}

export const SetMenuItemAction = (data) => {
    return {
        type: MENUITEM,
        data: data
    }
}
export const ChangeThemeAction = (data) => {
    return {
        type: CHANGETHEME,
        data: data
    }
}

