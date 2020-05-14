<template>
  <div>
    <el-dialog
      title="登录"
      :visible.sync="dialogVisible"
      width="372px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="customerMobile" label-width="20px">
          <el-input
            placeholder="请输入手机号"
            prefix-icon="el-icon-phone"
            v-model.number="ruleForm.customerMobile"
            clearable
            maxlength="11"
            style="width:300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="code" label-width="20px">
          <el-input
            placeholder="请输入验证码"
            prefix-icon="el-icon-key"
            v-model="ruleForm.code"
            clearable
            maxlength="4"
            style="width:190px"
          >
          </el-input>
          <el-button
            type="primary"
            style="background:#5138d0;width:100px;margin-left:10px;"
            @click="handleSendMsg"
            >{{ timeStr }}</el-button
          >
        </el-form-item>
        <!-- <p v-show="!isRegister">
          <span class="register" @click="handleRegister">立即注册</span>
        </p> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleLogin('ruleForm')"
          style="background:#5138d0"
          >登 录</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { login, register, sendSms } from "./../api/index";
export default {
  name: "Login",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  watch: {
    dialogVisible (val) {
      if (val) {
        setTimeout(() => {
          this.ruleForm.customerMobile = ''
          this.ruleForm.code = ''
          this.$refs['ruleForm'].resetFields();
        }, 0);
      }
    }
  },
  data () {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        let reg = new RegExp(/^1[3-9]\d{9}$/)
        let flag = reg.test(this.ruleForm.customerMobile)
        if (!flag) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
    };
    return {
      isRegister: false,
      timeStr: '获取验证码',
      ruleForm: {
        customerMobile: "",
        code: ''
      },
      time:60,
      rules: {
        customerMobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    };
  },
  created () { },
  methods: {
    // 发送验证码
    async handleSendMsg () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          if(this.time!==60 ){
            return false
          }
          const res = await sendSms({ customerMobile: this.ruleForm.customerMobile })
          var timer = setInterval(() => {
            this.time--;
            this.timeStr = this.time + ' 秒';
            if (this.time === 0) {
              this.time = 60
              clearInterval(timer);
              this.timeStr = '重新获取';
            }
          }, 1000)
        }
      });
    },
    handleClose () {
      this.$emit("update:dialogVisible", false);
    },
    handleRegister () {
      this.isRegister = true
      this.ruleForm.customerMobile = ''
      this.ruleForm.code = ''
      this.$refs['ruleForm'].resetFields();
    },
    async handleLogin (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = {}
          res = await login({ customerMobile: this.ruleForm.customerMobile, code: this.ruleForm.code })
          if (res.returnCode === '6007') {
            this.$message({
              message: res.returnMessage,
              type: 'warning'
            });
          } else {
            let mobile = res.customerMobile
            localStorage.setItem('mobile', mobile)
            localStorage.setItem('userId', res.userId)
            localStorage.setItem('userName', mobile.substring(mobile.length - 4))
            // this.$router.push({ name: "study" });
            this.$emit('update:dialogVisible', false)
          }
        } else {
          return false;
        }
      });

    }
  }
};
</script>

<style scoped lang="scss">
.register {
  float: right;
  margin-right: 10px;
  color: #2c7bd0;
  cursor: pointer;
}


</style>
