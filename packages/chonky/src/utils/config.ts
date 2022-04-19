import {setupChonky} from 'chonky-engine/dist/config'
import {ChonkyConfig} from 'chonky-engine/dist/types/config.types'

export const DefaultChonkyReactConfig: Partial<ChonkyConfig> = {

}

export function setupChonkyReact (config: Partial<ChonkyConfig>) {
    setupChonky({
        components: {

        }
    })
    setupChonky(config)
}