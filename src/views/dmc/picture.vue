<template>
    <div>
    <!-- 还没有测试过 -->
      <div style="margin-bottom: 10px; display: flex; align-items: center">
        <el-button @click="changeType('huabi')" type="primary">画笔</el-button>
        <el-button @click="changeType('rect')" type="success">正方形</el-button>
        <el-button
          @click="changeType('arc')"
          type="warning"
          style="margin-right: 10px"
          >圆形</el-button
        >
        <div>颜色：</div>
        <el-color-picker v-model="state.color"></el-color-picker>
        <el-button @click="clear">清空</el-button>
        <el-button @click="saveImg">保存</el-button>
      </div>
      <canvas
        id="canvas"
        width="800"
        height="400"
        @mousedown="canvasDown"
        @mousemove="canvasMove"
        @mouseout="canvasUp"
        @mouseup="canvasUp"
      >
      </canvas>
    </div>
  </template>
  
  <script lang='ts' setup>
  import { onMounted, reactive } from 'vue'

  const state = reactive({
        type: "huabi",
        isDraw: false,
        canvasDom: null,
        ctx: null,
        beginX: 0,
        beginY: 0,
        color: "#000",
        imageData: null,
  })

  onMounted(() => {
        state.canvasDom = document.getElementById("canvas");
        state.ctx = state.canvasDom.getContext("2d");
  })

     const changeType = (type) => {
        state.type = type;
      }

      const canvasDown = (e) => {
        state.isDraw = true;
        const canvas = state.canvasDom;
        state.beginX = e.pageX - canvas.offsetLeft;
        state.beginY = e.pageY - canvas.offsetTop;
      }
      const canvasMove = (e)  => {
        if (!state.isDraw) return;
        const canvas = state.canvasDom;
        const ctx = state.ctx;
        const x = e.pageX - canvas.offsetLeft;
        const y = e.pageY - canvas.offsetTop;
        state[`${state.type}Fn`](ctx, x, y);
      }
      const canvasUp = ()  =>{
        state.imageData = state.ctx.getImageData(0, 0, 800, 400);
        state.isDraw = false;
      }
      const huabiFn = (ctx, x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = state.color;
        ctx.fill();
        ctx.closePath();
      }
      const rectFn = (ctx, x, y) => {
        const beginX = state.beginX;
        const beginY = state.beginY;
        ctx.clearRect(0, 0, 800, 400);
        state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);
        ctx.beginPath();
        ctx.strokeStyle = state.color;
        ctx.rect(beginX, beginY, x - beginX, y - beginY);
        ctx.stroke();
        ctx.closePath();
      }
      const arcFn = (ctx, x, y) =>{
        const beginX = state.beginX;
        const beginY = state.beginY;
        state.isDraw && ctx.clearRect(0, 0, 800, 400);
        state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);
        ctx.beginPath();
        ctx.strokeStyle = state.color;
        ctx.arc(
          beginX,
          beginY,
          Math.round(
            Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY))
          ),
          0,
          2 * Math.PI
        );
        ctx.stroke();
        ctx.closePath();
      }
      const saveImg = () => {
        const url = state.canvasDom.toDataURL();
        const a = document.createElement("a");
        a.download = "sunshine";
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      const clear = () => {
          state.imageData = null
          state.ctx.clearRect(0, 0, 800, 400)
      }
  </script>
  
  <style lang="scss" scoped>
  #canvas {
    border: 1px solid black;
  }
  </style>