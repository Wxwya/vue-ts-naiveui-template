
const cancelerMap = new Map<string, AbortController>()
export class RequestCancel {
    private static instance?: RequestCancel
    static createInstance() {
        return this.instance ?? (this.instance = new RequestCancel())
    }
    add(url: string, requestTask: AbortController) {
        this.remove(url)
        if (cancelerMap.has(url)) {
            cancelerMap.delete(url)
        }
        cancelerMap.set(url, requestTask)
    }
    remove(url: string) {
        if (cancelerMap.has(url)) {
            const requestTask = cancelerMap.get(url)
            requestTask && requestTask.abort()
            cancelerMap.delete(url)
        }
    }
}

const requestCancel = RequestCancel.createInstance()

export default requestCancel
