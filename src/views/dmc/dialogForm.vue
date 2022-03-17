<template>
 <el-dialog v-model="props.dialogFormVisible" title="选择操作类型" ref='dataOpe'>
    <div>
      <el-radio v-model="opeType" label="1" size="large">+</el-radio>
      <el-radio v-model="opeType" label="2" size="large">-</el-radio>
      <el-radio v-model="opeType" label="3" size="large">*</el-radio>
      <el-radio v-model="opeType" label="4" size="large">/</el-radio>
    </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelOpe">Cancel</el-button>
          <el-button type="primary" @click="sureOpe"
            >Confirm</el-button
          >
        </span>
      </template>
  </el-dialog>
</template>

<script lang='ts' setup>
import { defineEmits, ref } from "vue"

const emit = defineEmits(['cancelOpe', 'sureOpe'])
let opeType = ref('')
const props = defineProps({
    dialogFormVisible: Boolean,
})

const changeValue = (val) => {
  console.log(val)

}
// select__popper

const cancelOpe = () => {
    opeType.value = ''
    emit('cancelOpe')
}
const sureOpe = () => {
    emit('sureOpe', opeType.value)
}
</script>