
const cancelerMap = new Map()
export class RequestCancel {
     static instance
    static createInstance() {
        return this.instance ?? (this.instance = new RequestCancel())
    }
    add(url, requestTask) {
        this.remove(url)
        cancelerMap.set(url, requestTask)
    }
    remove(url) {
        if (cancelerMap.has(url)) {
            const requestTask = cancelerMap.get(url)
            requestTask && requestTask.abort()
            cancelerMap.delete(url)
        }
    }
}

const requestCancel = RequestCancel.createInstance()

export default requestCancel
