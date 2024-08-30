import { customEndpoint } from "@directus/sdk"
import { get } from "lodash-es"

export async function useUpload(uploadField: Ref, options: any = {
    chunkSize: 1024 * 1024,

}) {
    const currentUser = useState('currentUser')
    const message = useMessage()
    const notify = useNaiveNotification()
    const api = useNAD()
    const { data: quota, refresh: refreshQuota } = await useQuota()

    const attachments = ref([])
    const files = ref([])
    const uploading = computed(() => attachments.value?.filter(({status}) => ['uploading', 'pending'].includes(status))?.length > 0 )

    const chunkSize = options?.chunkSize || 1024 * 1024

    const maxSizeUpload = computed(() => (options?.max_size_upload || quota.value?.current_plan?.max_size_upload) * chunkSize)
    
    function removeFile(file) {
        files.value = files.value?.filter(({id}) => id !== file?.id)
        attachments.value = attachments.value?.filter(({id}) => id !== file?.id)
    }
    
    function retryFile(file) {
        uploadField.value?.submit(file?.id)
    }
    
    function resetUploadField() {
        uploadField.value?.clear()
        files.value = []
        attachments.value = []
        console.log('resetUploadField file', files.value, attachments.value)
    }

    const status = {
        finished: 'success',
        uploading: 'default',
        pending: 'default',
        error: 'error'
    }

    function getFileStatus(file) {
        return get(status, file?.status)
    }

    async function beforeUpload({file}) {

    }

    async function onFileChange({ file, fileList, event }) {
        console.log('onFileChange', file, fileList)
        // files.value = fileList
        attachments.value = fileList
    }



    async function upload({
        file,
        data,
        headers,
        withCredentials,
        action,
        onFinish,
        onError,
        onProgress
    }: any) {
        console.log('upload', file)
        
        if( file?.status === 'pending' ) {
            await refreshQuota()
        }
        if( file?.file.size > maxSizeUpload.value ) {
            uploadField.value?.clear()
            // attachments.value = []
            notify.create({
                title: 'Max file size reached',
                type: 'error',
                description: `You can not upload file larger than ${quota.value?.current_plan?.max_size_upload}MB`,
                duration: 3000
            })
            return
        }

        const formData = new FormData()

        formData.append('file', file.file)

        const fileID = file.name;
        const totalChunks = Math.ceil(file.file.size / chunkSize);
        
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {

            const chunk = await sendChunk({
                file,
                chunkIndex,
                totalChunks,
                fileID,
                onProgress,
                onFinish,
                onError
            });
            if( chunk?.error ) {
                break;
            }
        }
    }

    async function sendChunk({
        file,
        chunkIndex,
        totalChunks,
        fileID,
        onProgress,
        onFinish,
        onError
    }: any) {
        const isLastChunk = chunkIndex + 1 === totalChunks;
        const start = chunkIndex * chunkSize;
        const end = (chunkIndex + 1) * chunkSize;
        const formData = new FormData();
        const blobSlice = file.file.slice(start, end);

        formData.append('file', blobSlice, file.name);
        formData.append('chunkIndex', chunkIndex);
        formData.append('totalChunks', totalChunks);
        formData.append('filedId', fileID);
        let step = (totalChunks === 1) ? 0 : chunkIndex;
        let progress = percentage(step, totalChunks);
        
        try {
            const response = await api.request(customEndpoint({
                method: 'POST',
                path: '/upload-chunk/upload',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }));
            
            progress = percentage(chunkIndex + 1, totalChunks);

            onProgress({percent: progress})

            if( isLastChunk ) {
                // message.success('File has been uploaded successfully!')
                notify.create({
                    title: 'Uploaded successfully!',
                    type: 'success',
                    description: `File: ${file?.name}`,
                    duration: 3000
                })
                onFinish()
                // setTimeout(() => {
                    let uploadedFile = {
                        ...attachments.value?.find(f => f?.id === file?.id) || {},
                        file_id: response?.file_id
                    }

                    files.value.push(uploadedFile)
                    // files.value = ?.map((f) => {
                    //     let output = f
                    //     if( response?.file_id && output?.id === file?.id ) {
                    //         output = {
                    //             ...output,
                    //             file_id: response?.file_id
                    //         }
                    //     }
                    //     console.log('output', output?.id, file?.id)
                    //     return output
                    // })
                    console.log('isLastChunk', response?.file_id, files.value)
                // })
            }

        } catch (error) {
            progress = percentage(chunkIndex, totalChunks);
            // message.error('Upload file failed! Please try again!')
            notify.create({
                title: 'Upload file failed!',
                type: 'error',
                description: `File: ${file?.name}`,
                duration: 3000
            })
            onError()
            console.log('error', error);
            return {
                error: true
            }

        }
    }

    return {
        uploadField,
        attachments,
        beforeUpload,
        onFileChange,
        upload,
        uploading,
        quota,
        files,
        removeFile,
        retryFile,
        getFileStatus,
        resetUploadField
    }
}