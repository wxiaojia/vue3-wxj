export function delay(fn = () => { }, delay = 5000, context = null) {
    let ticket = null;
    let runned = false;
    return {
        run(...args) {
            return new Promise((resolve, reject) => {
                if (runned === true) {
                    return;
                }
                runned = true;
                ticket = setTimeout(async () => {
                    try {
                        const res = await fn.apply(context, args);
                        resolve(res);
                    } catch (err) {
                        reject(err)
                    }
                }, delay)
            })
        },
        cancel: () => {
            clearTimeout(ticket);
        }
    }
}

// use:
// delay(function () {
//     console.log("你们好");
// }).run();

// const { run, cancel } = delay(function (name) {
//     console.log("你好：", name);
// });

// run("吉他");
// run("吉他");