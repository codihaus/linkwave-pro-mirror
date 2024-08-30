export async function useSocket() {
    const client = useRealtime()
    const socket = useState<any>('socket')
    
    
    async function connectSocket() {
        if( ! socket.value ) {
            socket.value = client
        }
        console.log('socket.value', socket)
        await socket.value?.connect();
    }

    async function disconnectSocket() {
        await socket.value?.disconnect();
    }

    onMounted(async () => {
        await connectSocket()
        console.log('onMount socket')
    })

    onUnmounted(async () => {
        console.log('onUnmounted')
        await disconnectSocket()
    })

    return {
        socket,
        connectSocket,
        disconnectSocket
    }
}