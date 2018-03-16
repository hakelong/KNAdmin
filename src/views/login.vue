<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                  let password2 = md5(this.form.password)
                  try {
                    let response = await util.ajax.post('oauth/token', {
                      grant_type: 'password',
                      client_id: '2',
                      client_secret: 'ez0ozCZPCzgP1A1xOmsF331ZlyoEb6HvdqXs08rr',
                      username: this.form.userName,
                      password: password2
                    })
                    console.log(response)

                    Cookies.set('token_type', response.data.token_type)
                    Cookies.set('access_token', response.data.access_token)
                    Cookies.set(
                      'Authorization',
                      response.data.token_type + ' ' + response.data.access_token
                    )

                    response = await util.ajax.post('api/backstage/user/index', {
                      loginName: this.form.userName
                    })

                    const data = response.data
                    Cookies.set('userInfo', data)
                    this.$store.commit(
                      'setAvator',
                      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
                    )
                    this.$Message.success('登录成功！')
                    this.$router.push({ name: 'enterprise_manage' })
                  } catch (err) {
                    Cookies.remove('token_type')
                    Cookies.remove('access_token')
                    Cookies.remove('Authorization')
                    this.$Message.error('登录失败！')
                    console.log(err)
                  }
                } else {
                  this.$Message.error('表单验证失败!')
                }
            });
        }
    }
};
</script>

<style>

</style>
