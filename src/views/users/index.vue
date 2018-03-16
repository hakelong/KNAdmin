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
}
.search-bar span {
  font-size: 12px;
  color: #495060;
}
</style>
<template>
  <div class="menu">

    <!-- 页面标题部分 -->
    <h1 class="page-title"> 用户管理 </h1>

    <!-- 页面content部分 -->
    <div class="portlet">

      <!-- content的title部分 -->
      <div class="portlet-title">
        <div class="caption">
          <Icon type="ios-gear-outline"></Icon>  用户管理
        </div>
        <div align='right'>
          <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="addGuideRewardClick">添加现场指导奖励</Button>
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
    title='添加现场指导奖励' 
    v-model='modal1'
    @on-cancel='addCancel'
    >
    <Form ref='addForm' :label-width='100' :model='addReward.param' :rules='addReward.ruleValidate'>
      <FormItem label='奖励金额' prop='reward'>
        <Input v-model='addReward.param.reward' style='width:200px'></Input>
      </FormItem>
      <FormItem label='生效日期' prop='effectiveDate'>
        <DatePicker type='date' v-model='addReward.param.effectiveDate' :editable='false'></DatePicker>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='addSubmit' :loading='loading'>保存</Button>
      <Button @click='addCancel'>取消</Button>
    </div>
  </Modal>
  </div>
</template>
<script>
import util from '@/libs/util'

export default {
  components: {},
  data() {
    return {
      loading:false,
      modal1:false,
      //添加指导奖励
      addReward:{
        param:{
          reward:null,
          effectiveDate:'',
        },
        ruleValidate:{
          reward:[
            {required:true,message:'不能为空'}
          ],
          effectiveDate:[
            {type:'date',required:true,message:'不能为空',trigger:'blur'}
          ]
        }
      },
      //
      table: {
        page: 1,
        perPage: 10
      },

      //
      isLoading: false,
      // 表格
      from: 1,
      to: 1,
      total: 1,
      tableData1: [],
      tableColumns: [],
      tableColumnsConfig: [
        {
          title: '奖励金额',
          key: 'reward',
          fixed: '',
          _fixed: 'left',
          _min_width: 300
        },
        {
          title: '生效日期',
          key: 'effectiveDate',
          width: 0,
          fixed: '',
          _fixed: 'right',
          _min_width: 255
        }
      ]
    }
  },
  computed:{
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
    addCancel(){
      this.modal1=false;
      this.$refs['addForm'].resetFields();
    },
    addSubmit(){
      this.$refs['addForm'].validate((valid)=>{
        if(valid){
          this.loading=true;
          this.addGuideReward(()=>{
            this.loading=false;
            this.modal1=false;
            this.getData();
          },()=>{
            this.loading=false;
          })
        }else{
          this.$Message.error('表单验证有错误')
        }
      })
    },

    addGuideRewardClick() {
      this.modal1=true;
    },

    //添加奖励
    addGuideReward(callback,callback2){
      let param=this.addReward.param;
      let url='api/backstage/guide_reward/add';
      util.ajax.post(url,param)
      .then((res)=>{
        if(res.data.status){
          this.$Message.success('添加现场指导奖励成功！');
          if(callback){
            callback();
          }
        }else{
          this.$Message.error('添加现场指导奖励失败！');
          callback2()
        }
      }).catch((err)=>{
        this.$Message.error('添加现场指导奖励失败！');
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
        .post('api/backstage/guide_reward', param)
        .then(response => {
          var data = response.data

          this.tableData1 = data.items
          this.from = data.from
          this.to = data.to
          this.total = data.total
          this.isLoading = false
        })
        .catch(err => {
          this.tableData1=[];
          this.from = 0
          this.to = 0
          this.total = 0
          this.isLoading = false;
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
    this.changeTableColumnConfig()
    this.getData()
  }
}
</script>