<template>
  <div>
    <QuillEditor
      ref="myQuillEditor"
      theme="snow"
      v-model:content="content"
      :options="data.editorOption"
      contentType="html"
      @update:content="setValue()"
    />
    <!-- 使用自定义图片上传 -->
    <input
      type="file"
      hidden
      accept=".jpg,.png"
      ref="fileBtn"
      @change="handleUpload"
    />
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, onMounted, ref, toRaw } from 'vue'
// import { backsite } from '@/api'

const props = defineProps(['value'])
const emit = defineEmits(['updateValue'])
const content = ref('')
const myQuillEditor = ref()
// watch(() => props.value, (val) => {
//   console.log(toRaw(myQuillEditor.value))
//   toRaw(myQuillEditor.value).setHTML(val)
// }, { deep: true })
const fileBtn = ref()
const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ font: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ header: 1 }, { header: 2 }],
        ['image'],
        [{ direction: 'rtl' }],
        [{ color: [] }, { background: [] }]
      ]
    },
    placeholder: '请输入内容...'
  }
})
const imgHandler = (state) => {
  if (state) {
    fileBtn.value.click()
  }
}
const setValue = () => {
  const text = toRaw(myQuillEditor.value).getHTML()
  emit('updateValue', text)
}
const handleUpload = (event) => {
  const file = event.target.files[0] // 获取选定的文件
  if (file) {
    const reader = new FileReader() // 创建一个新的 FileReader 对象
    reader.onload = (e) => {
      // 当文件加载完成时，此函数会被调用
      const base64String = e.target.result // 获取完整的 Base64 数据
      const range = quill.getSelection(true) // 获取当前的选择范围或插入点
      quill.insertEmbed(range.index, 'image', base64String) // 在当前位置插入图片
      quill.setSelection(range.index + 1) // 移动光标到图片之后
    }

    // 将文件读取为 Data URL（Base64 格式）
    reader.readAsDataURL(file)
  }
}
let quill
onMounted(() => {
  quill = toRaw(myQuillEditor.value).getQuill()
  if (myQuillEditor.value) {
    quill.getModule('toolbar').addHandler('image', imgHandler)
  }
  toRaw(myQuillEditor.value).setHTML(props.value)
  content.value = props.value
})
</script>
<style scoped lang="scss">
:deep(.ql-editor) {
  min-height: 180px;
}

:deep(.ql-formats) {
  height: 21px;
  line-height: 21px;
}
</style>
