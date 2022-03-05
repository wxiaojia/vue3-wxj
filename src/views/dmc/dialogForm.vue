<template>
 <el-dialog v-model="props.dialogFormVisible" title="选择操作类型" ref='dataOpe'>
      <el-select v-model="opeType" placeholder="选择操作类型">
        <el-option label="+" value="+"></el-option>
        <el-option label="-" value="-"></el-option>
      </el-select>
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
const cancelOpe = () => {
    opeType.value = ''
    emit('cancelOpe')
}
const sureOpe = () => {
    emit('sureOpe'. opeType.value)
}
</script>