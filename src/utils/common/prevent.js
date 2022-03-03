['contextmenu', 'selectstart', 'copy'].forEach(function(ev){
    document.addEventListener(ev, function(ev){
        ev.preventDefault();
        ev.returnValue = false;
    })
});

// 或者css方案：
// body {
//     -moz-user-select: none;
//     -webkit-user-select: none;
//     -ms-user-select: none;
//     -khtml-user-select: none;
//     user-select: none;
// }
