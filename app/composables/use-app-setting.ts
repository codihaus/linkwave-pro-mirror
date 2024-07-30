import { readSingleton } from "@directus/sdk"

export async function useAppSetting() {
    
    const { data: app_settings, pending, refresh } = await useAsyncData(
        'app_settings',
        () => useAPI(() => readSingleton('app_settings', {
            fields: [ 'term_and_privacy', 'file_template.analysis_file.id', 'file_template.analysis_file.filesize', 'file_template.3d_file']
        })), 
        {
            transform: (response) => response?.items
        }
    )

    return {
        app_settings,
        pending,
        refresh
    }
}