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

    <!-- 页面content部分 -->
    <div class="portlet">

      <!-- content的title部分 -->
      <div class="portlet-title">
        <div class="caption">
          <Icon type="ios-gear-outline"></Icon>  产品列表
        </div>
        <div align='right'>
          <!-- <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="addProduct">添加产品</Button> -->
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="portlet-body">
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
    <!-- 添加指导奖励 -->
  <Modal 
    title='添加产品' 
    v-model='modal1'
    @on-cancel='addCancel'
    >
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
        <myUpload :picNum='1' @upload='addpic(1,$event)'></myUpload>
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
      <FormItem label='产品介绍' prop='content'>
        <Input v-model='addReward.param.content' style='width:200px'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='addSubmit' :loading='loading'>保存</Button>
      <Button @click='addCancel'>取消</Button>
    </div>
  </Modal>

  <!-- 编辑 -->
  <Modal 
    title='编辑产品' 
    v-model='modal2'
    @on-cancel='editCancel'
    >
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
    <div slot='footer'>
      <Button type='primary' @click='editSubmit' :loading='loading'>保存</Button>
      <Button @click='editCancel'>取消</Button>
    </div>
  </Modal>
  
  <Modal title='生成产品码' v-model='modal3' @on-cancel='modal3=false'  >
    <Form ref='createForm' :label-width='100' :model='create.param'>
      <FormItem label='生成数量' prop='createNumber'>
        <Input v-model='create.param.createNumber'></Input>
      </FormItem>
      <FormItem label='批次' prop='batch'>
        <Input v-model='create.param.batch'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='createSubmit'>保存</Button>
      <Button @click='modal3=false'>取消</Button>
    </div>
  </Modal>
  </div>
</template>
<script>
import util from '@/libs/util'
import upload from '@/views/baseComponents/upload'

export default {
  components: {
    myUpload:upload
  },
  data() {
    return {
      loading: false,
      modal1: false,
      modal2: false,
      modal3: false,
      editPicShow:false,
      editDefImgs:[],
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
          name:[
            { required: true, message: '不能为空'}
          ],
          // image:[
          //   { required: true, message: '不能为空'}
          // ],
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
          // image:[
          //   { required: true, message: '不能为空'}
          // ],
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
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '积分兑换产品名称',
          key: 'scoreProductName',
        },
        {
          title: '兑换积分',
          key: 'score'
        },
        {
          title: '兑换日期',
          key: 'createdAt'
        }
      ]
    }
  },
  computed: {
    contentSize() {
      return this.$store.state.contentSize
    }
  },
  watch: {
    contentSize(val) {
      this.changeTableColumnConfig()
    }
  },
  methods: {
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
        .post('api/score_product/exchange', param)
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
          this.editReward.param.name=data.scoreProductName
          this.editReward.param.image=data.image
          this.editReward.param.score=data.score
          this.editReward.param.originalPrice=data.originalPrice
          this.editReward.param.onShelf=data.onShelf
          this.editReward.param.number=data.number
          this.editReward.param.content=data.content
          this.editReward.param.scoreProductId=data.scoreProductId
          this.editDefImgs=[{name:'',url:data.image}]
          this.editPicShow=true;
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
  }
}
</script>