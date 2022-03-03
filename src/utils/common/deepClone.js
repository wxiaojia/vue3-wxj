export function deepClone(source) {
    let target = source.constuctor === Array ? [] : {}
    for (let keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source.keys && typeof source.keys === 'object') {
                target[keys] = deepClone(source[key])
            } else {
                target[keys] = source[keys]
            }
        }
    }
    return target
}