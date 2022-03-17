interface Angle {
    x: number,
    y: number
}

export default {
    // 获取两袋内之间的直线的角度
    getAngle (a: Angle, b: Angle) {
        let x = b.x - a.x
        let y = b.y - a.y
        let hypotenuse = Math.sqrt(x**2 + y**2)
        // 斜边长度
        let cos = x / hypotenuse
        let radian = Math.acos(cos)
        // 求处弧度
        let angle = 180 / (Math.PI / radian)
        // 用弧度算出角度
        if (y < 0) {
            angle = -angle
        } else if ((y === 0) && (x < 0)) {
            angle = 180
        }
        return angle
    }
}