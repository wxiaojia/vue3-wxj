import { reactive } from 'vue'

export function useCanvas () {

    const isExitGridId = (arr: string[], id: string) => {
        if (arr.indexOf(id) === -1) {
            arr.push(id)
        }
        return arr
    }

    return { isExitGridId,  }
}