

export function realativeToAbs(href) {
    let aEl = document.createElement('a')
    aEl.href = href

    const result = aEl.href
    aEl = null
    return result
}

// use:
// console.log("realativeToAbs", realativeToAbs("../a/b/b/index.html"));
// realativeToAbs http://127.0.0.1:5500/a/b/b/index.html