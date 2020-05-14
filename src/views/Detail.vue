<template>
  <div class="detail" v-if="show">
    <div class="head">
      <img src="./../assets/icon-logo.png" class="head-logo" />
      <img src="./../assets/detail-bg.png" class="head-bg" />
      <div class="head-content">
        <p class="content-title">{{ data.courseName }}</p>
        <p class="content-text title-state">
          打造适合小白的编程学习方式，零基础也能轻松入门
        </p>
        <p class="content-text title-fa">
          用有趣好玩的方式学编程
        </p>
        <button class="content-btn" @click="handleStudy">开始学习</button>
      </div>
      <!-- <button class="head-login" >登录</button> -->
      <button class="head-login" @click="handleLogin">{{ text }}</button>
    </div>
    <div class="body">
      <div class="body-show">
        <div class="show1">
          <div class="left">
            <p>交互式课堂——作业实操</p>
            <ul>
              <li>· 全面学习Python编写所需语法</li>
              <li>· 快速掌握编程思维和编写技巧</li>
              <li>· 开始你的第一行人工智能代码</li>
            </ul>
          </div>
          <div class="right"><img src="./../assets/detail-chat.png" /></div>
        </div>
        <div style="clear:both"></div>
        <div class="show2">
          <div class="left">
            <img src="./../assets/detail-chat.png" />
          </div>
          <div class="right">
            <p>交互式课堂——作业实操</p>
            <ul>
              <li>· 全面学习Python编写所需语法</li>
              <li>· 快速掌握编程思维和编写技巧</li>
              <li>· 开始你的第一行人工智能代码</li>
            </ul>
          </div>
        </div>
        <div style="clear:both;margin-bottom: 147px;"></div>
      </div>
      <div class="img-container">
        <img src="./../assets/projectlist.png" class="curriculum-img" />
      </div>
      <div class="curriculum">
        <ul>
          <li
            class="menu"
            v-for="(item, index) of data.courseChapters"
            :key="index"
            @click="handleShow(item)"
          >
            <div class="menu-title">
              <span>{{ item.detailName }}</span>
              <i class="iconfont icon-up" v-show="item.show"></i>
              <i class="iconfont icon-down" v-show="!item.show"></i>
            </div>
            <ul class="child-ul" v-show="item.show">
              <li
                class="child-menu"
                v-for="(child, childIndex) of item.courseSections"
                :key="childIndex"
              >
                <div>{{ childIndex + 1 }}</div>
                <span>{{ child.detailName }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>{{ data.courseName }}</p>
      <button @click="handleStudy">现在开始学习</button>
    </div>
    <login :dialogVisible.sync="dialogVisible"></login>
  </div>
</template>

<script>
/* eslint-disable */
import { getProgrammingCourseById } from "./../api/index";
import Login from "./../components/Login";
export default {
  name: "Detail",
  components: { Login },
  data () {
    return {
      data: {},
      show: false,
      text: "登录",
      dialogVisible: false
    };
  },
  watch: {
    dialogVisible () {
      if (localStorage.getItem("userId")) {
        this.text = "退出";
      } else {
        this.text = "登录";
      }
    }
  },
  created () {
    if (localStorage.getItem("userId")) {
      this.text = "退出";
    } else {
      this.text = "登录";
    }
    this.getDetail();
  },
  methods: {
    handleShow (item) {
      item.show = !item.show;
    },
    async handleLogin () {
      if (this.text === "登录") {
        this.dialogVisible = true;
      } else {
        this.text = "登录";
        localStorage.clear();
      }
    },
    // 开始学习
    handleStudy () {
      this.$router.push({ name: "study" });
    },
    // 开始学习
    async getDetail () {
      const res = await getProgrammingCourseById({
        courseId: this.$route.query.courseId
      });
      this.show = true;
      if (res.courseChapters) {
        this.data = res || {};
        if (this.data.courseChapters) {
          let list = this.data.courseChapters || [];
          list.map(item => {
            this.$set(item, "show", true);
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("./../styles/variables.scss");
.detail {
  background: #f7f4f8;
  .head {
    overflow: hidden;
    background: #ffffff;
    position: relative;
    img {
      width: 100%;
    }
    .head-bg {
      height: 541px;
    }
    .head-content {
      position: absolute;
      width: 100%;
      top: 182.5px;
      left: 218px;
      .content-title {
        font-size: 28px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 43px;
      }
      .content-text {
        /*font-size: 23px;*/
        margin-bottom: 24px;
        color: #ffffff;
      }
      .title-state {
        /*font-size: 24px;
        font-weight: 600;
        color: #ffc8a3;*/
        font-size: 24px;
        font-weight: 600;
        color: #ffc8a3;
      }
      .title-fa {
        /* font-size: 40px;
        font-weight: 700;
        color: #ffffff;*/
        font-size: 40px;
        letter-spacing: 9.3px;
        font-weight: 700;
      }
      .content-btn {
        border: none;
        width: 260px;
        height: 52px;
        border-radius: 26px;
        background-color: #48f4cb;
        font-size: 22px;
        font-weight: 600;
        color: #361c90;
        margin-top: 35px;
        cursor: pointer;
      }
    }
    .head-login {
      width: 80px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16.5px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: #6c48ea;
      font-size: 16px;
      position: absolute;
      top: 59px;
      right: 213px;
      cursor: pointer;
      font-weight: 600;
    }
    .head-logo {
      position: absolute;
      top: 59px;
      left: 213px;
      width: 140px;
      height: 60px;
    }
  }
  .body {
    .body-show {
      background: #ffffff;
      text-align: center;
      .show1 {
        padding-top: 158px;
        .left {
          width: 50%;
          float: left;
          p {
            margin-top: 28px;
            font-size: 26px;
            font-weight: 600;
            color: #31285d;
            padding-left: 40px;
          }
          ul {
            margin-top: 38px;
            li {
              list-style: none;
              font-size: 18px;
              color: #777478;
              padding-bottom: 24px;
            }
          }
        }
        .right {
          width: 50%;
          float: left;
          text-align: left;
          img {
            padding-left: 110px;
            width: 423px;
            height: 233px;
          }
        }
      }
      .show2 {
        margin-top: 158px;
        .left {
          width: 50%;
          text-align: left;
          float: left;
          img {
            width: 423px;
            height: 233px;
            padding-left: 230px;
          }
        }
        .right {
          width: 50%;
          float: left;
          text-align: left;
          p {
            margin-top: 28px;
            font-size: 26px;
            font-weight: 600;
            color: #31285d;
            padding-left: 110px;
          }
          ul {
            padding-left: 110px;
            margin-top: 38px;
            li {
              list-style: none;
              font-size: 18px;
              color: #777478;
              padding-bottom: 24px;
            }
          }
        }
      }
    }
  }
  .img-container {
    text-align: center;
    margin-top: 96px;
    .curriculum-img {
      width: 202px;
      height: 44px;
    }
  }

  .curriculum {
    display: flex;
    justify-content: center;
    background: #f7f4f8;
    padding-bottom: 75px;
    padding-top: 80px;
    ul {
      .menu {
        font-size: 18px;
        width: 955px;
        cursor: pointer;
        margin-bottom: 13px;
        .menu-title {
          height: 64px;
          line-height: 64px;
          background: #f0edf1;
          padding-left: 35px;
          padding-right: 25px;
          border-radius: 8px;
          i {
            float: right;
          }
        }
        .child-ul {
          .child-menu {
            padding-left: 36px;
            padding-top: 33px;
            div {
              background: #d8d8d8;
              width: 26px;
              height: 26px;
              line-height: 26px;
              border-radius: 26px;
              color: #848484;
              text-align: center;
              display: inline-block;
              margin-right: 16px;
            }
            span {
              color: #848484;
              font-size: 17px;
            }
          }
        }
      }
    }
  }
  .footer {
    text-align: center;
    background: #ffffff;
    padding-top: 133px;
    padding-bottom: 45px;
    p {
      font-size: 40px;
    }
    button {
      margin-top: 42px;
      width: 256px;
      height: 57px;
      background: linear-gradient(
        180deg,
        rgba(79, 44, 201, 1) 0%,
        rgba(111, 73, 233, 1) 100%
      );
      border-radius: 28px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
