<template>
        
    <div class="_base-count-down">
        <p v-if="!$slots.default">还剩{{state.days}}天{{state.hours}}:{{state.mins}}:{{state.seconds}}</p>
        <slot :timeObj="{
          d: state.days, 
          h: state.hours, 
          m: state.mins, 
          s: state.seconds,
          hh: `00${state.hours}`.slice(-2),
          mm: `00${state.mins}`.slice(-2),
          ss: `00${state.seconds}`.slice(-2),
      }"></slot>

    </div>
 

  </template>
  <script setup lang='ts'>
  import { computed, onMounted, reactive, watch } from 'vue'

  let props = defineProps({
    isMilliSecond: { type: Boolean, default: false },   // 单位 ms/s
    time: { type: [Number, String], default: 0 },
    end: { type: [Number, String], default: 0 }
  })

  // 计算出剩余时间
  const duration = computed(() => {
    if (props.end) {
        let end = String(props.end).length >= 13 ? +props.end : +props.end * 1000;
        end -= Date.now();
        return end;
      }

    // +props.time 如果是字符串的话也能转化为数字
        const time = props.isMilliSecond ? Math.round(+props.time / 1000) : Math.round(+props.time);
      return time;
  })
  // 监听duration，如果发现duration变化，说明新的时间time传入组件，这时就要重新调用this.countDown()。
  // 因为如果一个页面有两个调用了倒计时，onMounted只会执行一次
  watch(duration, () => {
      console.log('duration改变就执行')
    countDown()
  })

  interface State {
    curTime:  number | null,
    days: string,
    hours: string,
    mins: string,
    seconds: string,
    timer: string | null,
  }

  let state: State = reactive({
    curTime: null,
    days: '0',
    hours: '00',
    mins: '00',
    seconds: '00',
    timer: null,
  })


  // 计算 秒， 分钟，时钟，天数，倒着算的
  const durationFormatter = (time: number) => {
    if (!time) return { ss: 0 };
    let t = time;
    const ss = t % 60;
    t = (t - ss) / 60;
    if (t < 1) return { ss };
    const mm = t % 60;
    t = (t - mm) / 60;
    if (t < 1) return { mm, ss };
    const hh = t % 24;
    t = (t - hh) / 24;
    if (t < 1) return { hh, mm, ss };
    const dd = t;
    return { dd, hh, mm, ss };
  }
  const getTime = (duration: number) => {
      state.timer && clearTimeout(state.timer);
      if (duration < 0) {
        return;
      }
      const { dd, hh, mm, ss } = durationFormatter(duration);
      state.days = dd || 0;
      state.hours = hh || 0;
      state.mins = mm || 0;
      state.seconds = ss || 0;
      state.timer = setTimeout(() => {
        const now = Date.now();
        const diffTime = Math.floor((now - state.curTime) / 1000);
        state.curTime = now;
        getTime(duration - diffTime);
      }, 1000);

  }

    const countDown = () => {
      state.curTime = Date.now()
      getTime(duration.value)
    }



  onMounted(() => {
    countDown()
  })

  </script>
  <style lang='scss' scoped>
  ._base-count-down{
    color: red
  }
  </style>
  

  