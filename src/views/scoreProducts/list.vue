<style scoped>
.page-title {
  margin: 10px 0 25px 0;
  font-size: 24px;
  letter-spacing: -1px;
}

h1 {
  line-height: 1.1em;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
}

.note {
  background-color: #f5f8fd;
  color: #010407;
  margin: 0 0 20px 0;
  padding: 15px 30px 15px 15px;
  border-left: 5px solid #8bb4e7;
  border-radius: 0 4px 4px 0;
}

.note p {
  margin: 0;
  font-size: 13px;
}

.portlet {
  border: 1px solid #e7ecf1;
  border-radius: 4px;
  padding: 5px;
}

.portlet .portlet-title {
  border-bottom: 1px solid #eef1f5;
  min-height: 48px;
  padding: 0;
}

.portlet .portlet-title .caption {
  font-size: 18px;
  line-height: 18px;
  float: left;
  padding: 10px 0;
  color: #e7505a;
  font-family: 'Open Sans', sans-serif;
}

.portlet-body {
  font-size: 14px;
  color: #000;
}

.breadClass {
  padding-bottom: 10px;
  border-bottom: 1px solid #e7ecf1;
}

.search-bar {
  padding: 15px 0;
  overflow: hidden;
}
.search-bar span {
  font-size: 12px;
  color: #495060;
}
</style>
<template>
  <div class="menu">

    <!-- 页面标题部分 -->
    <h1 class="page-title"> 产品列表 </h1>
    <!-- <p v-show="tabsFlag">aaa</p> -->
    
    <!-- 页面content部分 -->
    <div class="portlet">

      <!-- content的title部分 -->
      <div class="portlet-title">
        <div class="caption">
          <Icon type="ios-gear-outline"></Icon>  产品列表
        </div>
        <div align='right'>
          <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="addProduct">添加产品</Button>
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="portlet-body">
        <div class='search-bar'>
          <Select v-model="table.productType" style="width:120px;float:right" @on-change='typeChange'>
              <Option :value="0" >全部</Option>
              <Option :value="1" >佑元茶</Option>
              <Option :value="2" >绿麒麟</Option>
          </Select>
        </div>
        
        <!--表格部分-->
        <Table ref='mainTable' :loading='isLoading' :data="tableData1" :columns="tableColumns" stripe highlight-row border></Table>
        <!-- 分页部分 -->
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" :current="table.page" @on-change="onPageChanged" @on-page-size-change="onPageSizeChanged" show-total show-sizer :page-size='table.perPage'></Page>
          </div>
          <div style='float:left;line-height:32px;'>显示第
            <span v-text='from'></span> 到
            <span v-text='to'></span> 条记录</div>
        </div>
      </div>

    </div>

  <!-- 编辑 -->
  <!-- <Modal 
    title='编辑产品' 
    v-model='modal2'
    @on-cancel='editCancel'>
    <Tabs value="name1">
        <TabPane label="标签二" name='name1'>
          <Form ref='editForm' :label-width='100' :model='editReward.param' :rules='editReward.ruleValidate'>
            <FormItem label='是否上架' prop='onShelf'>
              <Select v-model="editReward.param.onShelf" style="width:120px" >
                  <Option value="0" >未上架</Option>
                  <Option value="1" >已上架</Option>
              </Select>
            </FormItem>
            
            <FormItem label='产品名称' prop='name'>
              <Input v-model='editReward.param.name' style='width:200px'></Input>
            </FormItem>
            <FormItem label='积分产品图片' prop='image'>
              <myUpload :imgs='editDefImgs' :picNum='1' @upload='addpic(2,$event)' v-if='editPicShow'></myUpload>
            </FormItem>
            <FormItem label='兑换积分' prop='score'>
              <Input v-model='editReward.param.score' style='width:200px'></Input>
            </FormItem>
            <FormItem label='原价' prop='originalPrice'>
              <Input v-model='editReward.param.originalPrice' style='width:200px'></Input>
            </FormItem>
            <FormItem label='可兑换数量' prop='number'>
              <Input v-model='editReward.param.number' style='width:200px'></Input>
            </FormItem>
            <FormItem label='产品介绍' prop='content'>
              <Input v-model='editReward.param.content' style='width:200px'></Input>   
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="标签一" name='name2'>
          <quill-editor ref="myQuillEditor" v-model="editReward.param.content" :config="editorOption">
          </quill-editor>
        </TabPane>
    </Tabs>
    <div slot='footer'>
      <Button type='primary' @click='editSubmit' :loading='loading'>保存</Button>
      <Button @click='editCancel'>取消</Button>
    </div>
  </Modal> -->

  <Modal v-model='modal2' title='编辑产品' @on-cancel='editCancel'>
    <Tabs v-model="tabShow" >
        
        <TabPane label="基本内容" name="name1">
          <Form ref='editForm' :label-width='100' :model='editReward.param' :rules='editReward.ruleValidate'>
            <FormItem label='是否上架' prop='onShelf'>
              <Select v-model="editReward.param.onShelf" style="width:120px" >
                  <Option value="0" >未上架</Option>
                  <Option value="1" >已上架</Option>
              </Select>
            </FormItem>
            
            <FormItem label='产品名称' prop='name'>
              <Input v-model='editReward.param.name' style='width:200px' ref='focusObj' :autofocus='true'></Input>
            </FormItem>
            <FormItem label='积分产品图片' prop='image'>
              <myUpload :imgs='editDefImgs' :picNum='1' @upload='addpic(2,$event)' v-if='editPicShow'></myUpload>
            </FormItem>
            <FormItem label='兑换积分' prop='score'>
              <Input v-model='editReward.param.score' style='width:200px'></Input>
            </FormItem>
            <FormItem label='原价' prop='originalPrice'>
              <Input v-model='editReward.param.originalPrice' style='width:200px'></Input>
            </FormItem>
            <FormItem label='可兑换数量' prop='number'>
              <Input v-model='editReward.param.number' style='width:200px'></Input>
            </FormItem>
            <!-- <FormItem label='产品介绍' prop='content'>
              <Input v-model='editReward.param.content' style='width:200px'></Input>   
            </FormItem> -->
          </Form>
        </TabPane>
        <TabPane label="产品介绍" name="name2" >
          <div v-show="tabShow==='name2'">
            <quill-editor  ref="myQuillEditor" v-model='editReward.param.content' :config="editorOption">
            </quill-editor>
          </div>
          
          <Upload :data='upParam' ref="upload" 
            :on-success="upScuccess" :format="['jpg','jpeg','png']" 
            :max-size="2048" :on-format-error="handleFormatError" 
            :on-exceeded-size="handleMaxSize" 
            :before-upload="beforeUpload" multiple type="drag" 
            action="//upload.qiniu.com/" style="display:none">
            <Button type="ghost" icon="ios-cloud-upload-outline" id='imgInput'>Upload files</Button>
          </Upload>
        </TabPane>
    </Tabs>
    <div slot='footer'>
      <Button type='primary' @click='editSubmit' :loading='loading'>保存</Button>
      <Button @click='editCancel'>取消</Button>
    </div>
  </Modal>  


    <!-- 添加积分产品 -->
  <Modal 
    title='添加产品' 
    v-model='modal1'
    @on-cancel='addCancel'
    >
    <Tabs v-model="addTab">
      
      <TabPane label="基本内容" name="name1">
        <Form ref='addForm' :label-width='100' :model='addReward.param' :rules='addReward.ruleValidate'>
          <FormItem label='是否上架' prop='onShelf'>
            <Select v-model="addReward.param.onShelf" style="width:120px" >
                <Option value="0" >未上架</Option>
                <Option value="1" >已上架</Option>
            </Select>
          </FormItem>
          
          <FormItem label='产品名称' prop='name'>
            <Input v-model='addReward.param.name' style='width:200px'></Input>
          </FormItem>
          <FormItem label='积分产品图片' prop='image'>
            <myUpload :picNum='1' @upload='addpic(1,$event)' :imgs='addDefImgs' v-if='addPicShow'></myUpload>
          </FormItem>
          <FormItem label='兑换积分' prop='score'>
            <Input v-model='addReward.param.score' style='width:200px'></Input>
          </FormItem>
          <FormItem label='原价' prop='originalPrice'>
            <Input v-model='addReward.param.originalPrice' style='width:200px'></Input>
          </FormItem>
          <FormItem label='可兑换数量' prop='number'>
            <Input v-model='addReward.param.number' style='width:200px'></Input>
          </FormItem>
          <!-- <FormItem label='产品介绍' prop='content'>
            <Input v-model='addReward.param.content' style='width:200px'></Input>
          </FormItem> -->
        </Form>
      </TabPane>
      <TabPane label="产品介绍" name="name2">
        <quill-editor  ref="myQuillEditor2" v-model='addReward.param.content' :config="editorOption">
        </quill-editor>
        <Upload :data='upParam' ref="upload" 
          :on-success="upScuccess2" :format="['jpg','jpeg','png']" 
          :max-size="2048" :on-format-error="handleFormatError2" 
          :on-exceeded-size="handleMaxSize2" 
          :before-upload="beforeUpload2" multiple type="drag" 
          action="//upload.qiniu.com/" style="display:none">
          <Button type="ghost" icon="ios-cloud-upload-outline" id='imgInput2'>Upload files</Button>
        </Upload>
      </TabPane>
    </Tabs>
    
    <div slot='footer'>
      <Button type='primary' @click='addSubmit' :loading='loading'>保存</Button>
      <Button @click='addCancel'>取消</Button>
    </div>
  </Modal>


  <!-- <Input ref='test' :autofocus='true'></Input> -->
  </div>
</template>
<script>
import util from '@/libs/util'
import upload from '@/views/baseComponents/upload'
import * as Quill from 'quill'

export default {
  components: {
    myUpload:upload,
    // quillEditor
  },
  data() {
    return {
      addTab:'name1',
      tabShow:'name1',
      quill:false,
      upParam: {
        token: '',
        key: ''
      },
      uptoken:'',
      domain:'',

      loading: false,
      modal1: false,
      modal2: false,
      modal3: false,
      addDefImgs:[],
      addPicShow:false,
      editPicShow:false,
      editDefImgs:[],
      editorOption:{},
      //编辑
      create:{
        param:{
          productId:'',
          createNumber:'',
          batch:''
        }
      },
      //编辑
      editReward: {
        param: {
          name: '',
          image: '',
          score: '',
          originalPrice: '',
          onShelf: '',
          number:'',
          content:'',
        },
        ruleValidate: {
          
        }
      },
      //添加指导奖励
      addReward: {
        param: {
          name: '',
          image: '',
          score: '',
          originalPrice: '',
          onShelf: '',
          number:'',
          content:'',
        },
        ruleValidate: {
          name:[
            { required: true, message: '不能为空'}
          ],
          image:[
            { required: true, message: '不能为空',trigger:'blur'}
          ],
          score:[
            { required: true, message: '不能为空'}
          ],
          originalPrice:[
            { required: true, message: '不能为空'}
          ],
          onShelf:[
            { required: true, message: '不能为空'}
          ],
          number:[
            { required: true, message: '不能为空'}
          ],
        }
      },
      //
      table: {
        page: 1,
        perPage: 10,
        productType: 0
      },

      //
      isLoading: false,
      // 表格
      from: 1,
      to: 1,
      total: 1,
      tableData1: [],
      tableColumns: [
        {
          title: '产品名称',
          key: 'scoreProductName'
        },
        {
          title: '是否上架',
          key: 'onShelf',
          render: (h, params) => {
            let str = params.row.onShelf === '1' ? '已上架' : '未上架'
            return h('div', {}, str)
          }
        },
        {
          title: '兑换积分',
          key: 'score'
        },
        {
          title: '原价',
          key: 'originalPrice'
        },
        {
          title: '图片',
          key: 'image',
          render: (h, params) => {
            return h('img', {
              style:{
                display:'block',
                margin:'0 auto'
              },
              attrs:{
                src:params.row.image,
                width:100,
                height:100
              }
            },)
          }
        },
        {
          title: '添加时间',
          key: 'createdAt'
        },
        {
          title: '操作',
          width:'200',
          render: (h, params) => {
            let id = params.row.scoreProductId
            return h('ButtonGroup', [
              h(
                'Button',
                {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.getDetail(id)
                      this.$refs.editForm.resetFields();
                      this.modal2=true;
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认删除',
                        content: '<p>确认删除吗！？</p>',
                        loading: true,
                        onOk: () => {
                          this.del(id)
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    contentSize() {
      return this.$store.state.contentSize
    },
  },
  watch: {
    contentSize(val) {
      this.changeTableColumnConfig()
    },

  },
  methods: {
    showtabs(name){
    
    },
        // 点击图片ICON触发事件
    imgHandler2(state) {
      this.addRange = this.$refs.myQuillEditor2.quill.getSelection()
      if (state) {
        let fileInput = document.getElementById('imgInput2')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },

    // 图片上传之前调取的函数
    beforeUpload2(file) {
      let newDate = new Date()
      let time = newDate.getTime()
      let key =
        (this.identity ? this.identity : '') + '/' + time + '_' + file.name
      this.upParam.token = this.uptoken
      this.upParam.key = key
      return true
    },
    upScuccess2(e, file, fileList) {
      let vm = this
      let url = ''
      url = this.domain + e.key
      file.url = this.domain + e.key
      file.name = e.key
      console.log(file)
      if (url != null && url.length > 0) {
        // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        vm.addRange = vm.$refs.myQuillEditor2.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.myQuillEditor2.quill.insertEmbed(
          vm.addRange !== null ? vm.addRange.index : 0,
          vm.uploadType,
          value,
          Quill.sources.USER
        ) // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$Message.error(`${vm.uploadType}插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
    },
    handleFormatError2(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },

    handleMaxSize2(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
    },
    //////

    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        let fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },

    // 图片上传之前调取的函数
    beforeUpload(file) {
      let newDate = new Date()
      let time = newDate.getTime()
      let key =
        (this.identity ? this.identity : '') + '/' + time + '_' + file.name
      this.upParam.token = this.uptoken
      this.upParam.key = key
      return true
    },
    upScuccess(e, file, fileList) {
      let vm = this
      let url = ''
      url = this.domain + e.key
      file.url = this.domain + e.key
      file.name = e.key
      console.log(file)
      if (url != null && url.length > 0) {
        // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.myQuillEditor.quill.insertEmbed(
          vm.addRange !== null ? vm.addRange.index : 0,
          vm.uploadType,
          value,
          Quill.sources.USER
        ) // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$Message.error(`${vm.uploadType}插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
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
    addpic(flag,urls){
      if(flag===1){
        if(urls[0]){
          this.addReward.param.image=urls[0]
        }else{
          this.addReward.param.image=''
        }
      }else if(flag===2){
        if(urls[0]){
          this.editReward.param.image=urls[0]
        }else{
          this.editReward.param.image=''
        }
      }
      
    },
    createSubmit() {
      let param =this.create.param
      let url = 'api/product_code/create'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Message.success('成功')
            this.getData()
          } else {
            this.$Message.error('失败')
          }
        },
        err => {
          this.$Message.error('失败')
        }
      )
    },


    editCancel() {
      this.modal2 = false
      this.editPicShow=false;
      this.$refs['editForm'].resetFields()
      this.tabShow='name1'
    },
    editSubmit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.editGuideReward(
            () => {
              this.loading = false
              this.modal2 = false
              this.editPicShow=false;
              this.getData()
            },
            () => {
              this.loading = false
            }
          )
        } else {
          this.$Message.error('表单验证有错误')
        }
      })
    },
    editGuideReward(callback, callback2) {
      let param = this.editReward.param
      let url = 'api/score_product/edit'
      util.ajax
        .post(url, param)
        .then(res => {
          if (res.data.state) {
            this.$Message.success('编辑成功！')
            if (callback) {
              callback()
            }
          } else {
            this.$Message.error('编辑失败！')
            callback2()
          }
        })
        .catch(err => {
          this.$Message.error('编辑失败！')
          callback2()
          console.log(err)
        })
    },
    del(id) {
      let param = { scoreProductId: id }
      let url = 'api/score_product/del'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Modal.remove()
            this.$Message.success('删除成功')
            this.getData()
          } else {
            this.$Modal.remove()
            this.$Message.error('删除失败')
          }
        },
        err => {
          this.$Modal.remove()
          this.$Message.error('删除失败')
        }
      )
    },
    typeChange() {
      this.getData()
    },
    addCancel() {
      this.modal1 = false
      this.$refs['addForm'].resetFields()
      this.addTab='name1'
      this.addReward.param.content=''
      this.addPicShow=false;
    },
    addSubmit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.addGuideReward(
            () => {
              this.loading = false
              this.modal1 = false
              this.$refs['addForm'].resetFields()
              this.getData()
            },
            () => {
              this.loading = false
            }
          )
        } else {
          this.$Message.error('表单验证有错误')
        }
      })
    },

    addProduct() {
      this.addDefImgs=[],
      this.addPicShow=true,
      this.modal1 = true
    },

    //添加奖励
    addGuideReward(callback, callback2) {
      let param = this.addReward.param
      let url = 'api/score_product/add'
      util.ajax
        .post(url, param)
        .then(res => {
          if (res.data.state) {
            this.$Message.success('添加成功！')
            if (callback) {
              callback()
            }
          } else {
            this.$Message.error('添加失败！')
            callback2()
          }
        })
        .catch(err => {
          this.$Message.error('添加失败！')
          callback2()
          console.log(err)
        })
    },

    changeTableColumnConfig() {
      let mainTable = this.$refs['mainTable']
      let config = util.changeTableColumnConfig(
        mainTable,
        this.tableColumnsConfig
      )
      this.tableColumns = config
    },

    getData() {
      this.isLoading = true
      let param = this.table
      util.ajax
        .post('api/score_product/index', param)
        .then(response => {
          var data = response.data

          this.tableData1 = data.items
          this.from = data.from
          this.to = data.to
          this.total = data.total
          this.isLoading = false
        })
        .catch(err => {
          this.tableData1 = []
          this.from = 0
          this.to = 0
          this.total = 0
          this.isLoading = false
        })
    },
    getDetail(id) {
      let param ={scoreProductId:id}
      util.ajax
        .post('api/score_product/show', param)
        .then(response => {
          var data = response.data
          this.editReward.param.content=data.content
          this.editReward.param.name=data.scoreProductName
          this.editReward.param.image=data.image
          this.editReward.param.score=data.score
          this.editReward.param.originalPrice=data.originalPrice
          this.editReward.param.onShelf=data.onShelf
          this.editReward.param.number=data.number
          
          this.editReward.param.scoreProductId=data.scoreProductId
          this.editDefImgs=[{name:'',url:data.image}]
          this.editPicShow=true;
          // this.$refs.myQuillEditor.quill.blur()
          console.log(this.$refs.myQuillEditor.quill.hasFocus());
          // this.$refs.focusObj.focus()
        })
        .catch(err => {

        })
    },


    onPageSizeChanged(pageSize) {
      this.table.perPage = pageSize
      this.getData()
    },

    onPageChanged(num) {
      this.table.page = num
      this.getData()
    }
  },
  mounted() {
    // this.changeTableColumnConfig()
    this.getData()
    // this.$refs.test.focus()
    this.$refs.myQuillEditor.quill
      .getModule('toolbar')
      .addHandler('image', this.imgHandler)

    this.$refs.myQuillEditor2.quill
      .getModule('toolbar')
      .addHandler('image', this.imgHandler2)  

    let url = 'api/qiniu/uptoken'
    util.ajax.post(url, {}).then(data => {
      this.uptoken = data.data.uptoken
      this.domain = data.data.domain
    })
  }
}
</script>