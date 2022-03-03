export default class Circle {
  constructor (opts) {
    this.x = opts.x
    this.y = opts.y
    this.radius = opts.radius || 30
    this.color = opts.color
    this.isSelected = false
    this.filterText = ['过滤', '字段']
    this.start = 0
    this.end = 2
    this.font = '16px Microsoft yahei'
    this.fillStyle = '#fff'
    this.textAlgin = 'center'
    this.textBaseInline = 'middle'
  }
}
