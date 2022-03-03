// 使用iframe下载，传url, 和a标签下载有什么区别？

export function DOWNLOAD(url = null) {
    let ifr = document.createElement('iframe')

    if (!url) return 

    ifr.src = url;
    ifr.style.visibility = 'hidden';
    ifr.style.width = 0;
    ifr.style.height = 0;
    ifr.style.position = 'fixed';
    ifr.style.top = '-999999';
    ifr.style.left = '-999999';
    ifr.style.border = 'none';

    ifr.onload = () => {
        document.body.removeChild('ifr')
        ifr = null
    }

    document.body.appendChild(ifr)

    return ifr
}