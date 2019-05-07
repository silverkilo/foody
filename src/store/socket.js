import io from 'socket.io-client'
const socket = io(
    process.env.SERVER_URL || 'http://localhost:3001',
)


const CONNECTED = 'CONNECTED'
const ERROR = 'ERROR'

const initialState = {
    connected: false,
    error: {
        exists: false,
        message: ''
    }
}

const connect = (connected) => ({
    type: CONNECTED,
    connected
})
const err = (message) => ({
    type: ERROR,
    error: {
        exists: true,
        message
    },
})
export const createConnection = () => dispatch => {
    socket.on('connect', () => {
        dispatch(connect(socket.connected))
        console.log('SOCKET ', socket.connected);
    })
}

export const disconnectListener = () => dispatch => {
    socket.on('disconnect', () => {
        dispatch(connect(socket.connected))
        console.log('SOCKET ', socket.connected);
    })
}

export const errorListener = () => dispatch => {
    socket.on('error', (message) => {
        dispatch(err(message))
    })
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECTED:
            return { ...state, connected: action.connected };
        case ERROR:
            return { ...state, error: action.error };
        default:
            return state
    }
}