<template>
  <div>
    <div v-if='(readonly&&(defaultList.length==0))'>
      无图片
    </div>
    <div class="demo-upload-list" v-for="item in uploadList" :style="'width:'+width+'px;height:'+height+'px;'+'line-height:'+height+'px'">
      <template v-if="item.status === 'finished'">
        <div class='layout'>
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.url)" :style='"line-height:"+(height-2)+"px"'></Icon>
            <Icon type="ios-trash-outline" v-if='!readonly' @click.native="handleRemove(item)" :style='"line-height:"+(height-2)+"px"'></Icon>
          </div>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload v-show='!readonly&&upShow' :data='upParam' ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="//upload.qiniu.com/" :style="'display: inline-block;width:'+width+'px'">
      <div :style="'width:'+width+'px;height:'+height+'px;'+'line-height:'+height+'px'">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="查看图片" v-model="visible" width='700'>
      <img :src='imgUrl' v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import util from '@/libs/util'
export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    identity: {
      type: String
    },
    imgs: {
      type: Array
    },
    picNum: Number,
    width: {
      default: 58
    },
    height: {
      default: 58
    }
  },
  data() {
    return {
      upParam: {
        token: '',
        key: ''
      },
      uptoken: '',
      domain: '',

      defaultList: this.imgs,
      imgUrl: '',
      visible: false,
      uploadList: [],
      upShow: true,
      resUrls: []
    }
  },
  methods: {

    handleView(url) {
      this.imgUrl = url
      this.visible = true
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList
      // console.log(this.$refs.upload.fileList)
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      if (this.$refs.upload.fileList.length < this.picNum) {
        this.upShow = true
      }

      // 删除时向外发送
      this.resUrls = this.$refs.upload.fileList.map(function(item) {
        return item.url
      })
      this.$emit('upload', this.resUrls)
    },
    handleSuccess(res, file, fileList) {
      file.url = this.domain + res.key
      file.name = res.key
      if (this.picNum && fileList.length >= this.picNum) {
        this.upShow = false
      }

      // 添加时向外发送
      this.resUrls = this.$refs.upload.fileList.map(function(item) {
        return item.url
      })

      this.$emit('upload', this.resUrls)
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
    },
    handleBeforeUpload(file) {
      let newDate = new Date()
      let time = newDate.getTime()
      let key = (this.identity ? this.identity : '') + '/' + time + '_' + file.name
      this.upParam.token = this.uptoken
      this.upParam.key = key
      return true
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList

    if (this.picNum && this.$refs.upload.fileList.length >= this.picNum) {
      this.upShow = false
    }

    let url = 'api/qiniu/uptoken'
    util.ajax.post(url, {})
      .then(
        (data) => {
          this.uptoken = data.data.uptoken
          this.domain = data.data.domain
        }
      )
  }
}
</script>
<style scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list .layout {
  display: flex;
  height: 100%;
  align-items: center;
}

.demo-upload-list img {
  width: 100%;
  align-items: center;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
