import { defineNuxtModule, extendPages, useNuxt } from "@nuxt/kit"
import { resolve } from "path"
import routes from '../../../app/routers'
import { layers } from  '../../../config';
import { fileExists } from '../../utils/file'

export default defineNuxtModule({
    setup() {
        extendPages(async (pages: any) => {
            routes?.page?.forEach((route) => {
                route.file = parseRouteFile(route.file)
                let filePath = `app/views/${route.file}`
                if( fileExists(filePath) ) {
                    route.file = resolve(`app/views/${route.file}`)
                    pages.push(route)
                }
            })

            layers?.forEach((layer: string) => {
                const layerName = layer.replace('./layers/', '');
                [
                    ...routes?.[layerName] ?? []
                ].forEach((route) => {
                    route.file = parseRouteFile(route.file)
                    const layerFilePath = `layers/${layerName}/views/${route.file.replace(`/${layerName}`, '')}`
                    const appFilePath = `app/views/${route.file}`
                    route.file = fileExists(appFilePath) ? resolve(appFilePath) : resolve(layerFilePath);
                    pages.push(route)
                })
            });
        })
    },
})

function parseRouteFile(file:string) {
    return !file.includes('.vue') ? `${file}/index.vue` : file
}
