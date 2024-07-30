
const checkRun = async (openai:any, thread_id: string, run: any) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const retrieveRun = await openai.beta.threads.runs.retrieve(
                thread_id,
                run.id
            )

            console.log('Run status: ', retrieveRun.status)

            if (retrieveRun.status === 'completed') {
                console.log('Run completed: ', retrieveRun)

                clearInterval(interval)
                resolve(retrieveRun)
            } else {
                console.log(retrieveRun.last_error)
            }
        }, 3000)
    })
}


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {
        openai,
        assistant_id
    } = event.context

    console.log({
        body
    })

    const threadMessages = await openai.beta.threads.messages.create(
        body.thread_id,
        {
            role: "user",
            content: body.content
        }
    );

    const run = await openai.beta.threads.runs.create(body.thread_id, {
        assistant_id: assistant_id,
    })

    await checkRun(openai, body.thread_id, run)

    const messages = await openai.beta.threads.messages.list(body.thread_id)

    const answer = (messages.data ?? []).find((m) => m?.role === 'assistant')?.content as any

    return {
        statusCode: 200,
        message: threadMessages,
        reply: answer
    }
})
