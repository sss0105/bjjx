/**
 * @file 正在绘制
 * @author musicode
 */

import State from './State'
import Emitter from '../Emitter'

export default class Drawing extends State {

  constructor(props, emitter, painter) {

    super(props, emitter)

    let me = this, drawingShape, moving, saved, startX, startY

    // 提供两种清空画布的方式
    // 1. 还原鼠标按下时保存的画布
    // 2. 全量刷新画布
    const restore = function () {
      if (!saved) {
        saved = painter.save()
      }
      else {
        painter.restore(saved)
      }
    }

    const drawing = function () {
      emitter.fire(
        Emitter.SHAPE_DRAWING
      )
    }

    me.mouseDownHandler = function (event) {
      if (event.inCanvas) {
        moving = 0
        startX = Math.floor(event.x)
        startY = Math.floor(event.y)
        drawingShape = new me.createShape()
        if (drawingShape.startDrawing
          && drawingShape.startDrawing(painter, emitter, event) === false
        ) {
          drawingShape = null
        }
        else {
          // 鼠标down时存下当前canvas
          painter.save();
          emitter.fire(
            Emitter.SHAPE_DRAWING_START,
            {
              cursor: 'crosshair'
            }
          )
        }
      }
    }
    me.mouseMoveHandler = function (event) {
      if (drawingShape && drawingShape.drawing) {
        moving++
        drawingShape.drawing(painter, startX, startY, Math.floor(event.x), Math.floor(event.y), restore)
      }
    }
    me.mouseUpHandler = function () {
      if (saved) {
        saved = null
      }
      if (drawingShape) {
        if (drawingShape.endDrawing) {
          drawingShape.endDrawing()
          return
        }
        // 鼠标释放后恢复之前canvas并添加新shape
        painter.restore()
        emitter.fire(
          Emitter.SHAPE_DRAWING_END,
          {
            shape: moving > 0 ? drawingShape : null
          }
        )
        drawingShape = null
      }
    }

    me
    .on(Emitter.MOUSE_DOWN, me.mouseDownHandler)
    .on(Emitter.MOUSE_MOVE, me.mouseMoveHandler)
    .on(Emitter.MOUSE_UP, me.mouseUpHandler)
    .on(Emitter.RESET, me.mouseUpHandler)

  }

  destroy() {
    this
    .off(Emitter.MOUSE_DOWN, this.mouseDownHandler)
    .off(Emitter.MOUSE_MOVE, this.mouseMoveHandler)
    .off(Emitter.MOUSE_UP, this.mouseUpHandler)
    .off(Emitter.RESET, this.mouseUpHandler)
  }

  isPointInPath(painter, x, y) {
    return false
  }

}
