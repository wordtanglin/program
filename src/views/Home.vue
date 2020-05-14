<template>
  <div class="home">
    <div class="head">
      <img src="./../assets/icon-logo.png" class="head-logo" v-cloak />
      <img src="./../assets/banner.png" style="height:543px;" v-cloak />
      <div class="head-content">
        <p class="content-text">用有趣好玩的方式学编程</p>
        <p class="content-subtext">
          打造适合小白的编程学习方式，零基础也能轻松入门
        </p>
        <button class="content-btn" @click="handleStudy">开始学习</button>
      </div>
      <button class="head-login" @click="handleLogin">{{ text }}</button>
    </div>
    <div class="body">
      <div class="special-content">
        <img src="./../assets/center-bg.png" class="special-content_bg" />
        <img src="./../assets/special.png" class="special-content_title" />
        <ul class="special-li">
          <li>
            <img src="./../assets/special1.png" />
            <p class="special-li_title">立即开始</p>
            <p class="special-li_subtitle">你的第一行人工智能代码</p>
          </li>
          <li>
            <img src="./../assets/special2.png" />
            <p class="special-li_title">交互式课堂</p>
            <p class="special-li_subtitle">更符合人类学习规律</p>
          </li>
          <li>
            <img src="./../assets/special3.png" />
            <p class="special-li_title">课后实操练习题</p>
            <p class="special-li_subtitle">每一个所学知识点都会运用</p>
          </li>
          <li>
            <img src="./../assets/special4.png" />
            <p class="special-li_title">线上助教答疑</p>
            <p class="special-li_subtitle">助教会在班级群内提供解答和辅导</p>
          </li>
        </ul>
      </div>
      <div class="all-project">
        <img src="./../assets/all-project.png" class="all-project_title" />
        <ul class="project-li">
          <li v-for="(item, index) of programList" :key="index">
            <div class="li-img"><img :src="item.courseImage" /></div>
            <div class="li-text">
              <p class="title">
                <span>{{ item.courseName }}</span
                ><span></span>
              </p>
              <div class="desc">
                <p
                  v-for="(desc, descIndex) of item.courseSummaryJSON"
                  :key="descIndex"
                >
                  ·{{ desc }}
                </p>
              </div>
            </div>
            <button class="li-btn" @click="handleDetail(item)">查看详情</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <img src="./../assets/footer-bg.png" />
      <p>
        联系我们 | 地址：北京市海淀区苏州街29号维亚大厦10层1005室 客服：187 0100
        5430 电子邮箱：xdyan_1991@163.com
      </p>
    </div>
    <!--<div class="fix-box" v-show="showImg">
      <img :src="adminImg" />
    </div>-->
    <div class="feedback-wrap" v-if="showQr">
      <div class="feedback" ref="feedback">
        <div class="feedback-entry clickable" @click="showfeedback()">
          <i
            :class="isShowfeedback ? 'el-icon-close' : 'el-icon-edit clickable'"
            style="font-size: 16px;color:#fff;"
          ></i>
          <div class="button-text">反馈</div>
        </div>
      </div>
      <div
        class="guide-popover qrcode-modal"
        x-placement="top"
        v-if="isShowfeedback"
      >
        <span @click="hidefeedback()"
          ><i
            class="el-icon-close close clickable"
            style="font-size: 16px;font-weight: bold;"
          ></i
        ></span>
        <div class="qrcode center">
          <div class="inner">
            <img :src="adminImg" />
          </div>
        </div>
        <div class="text center">微信扫一扫联系助教</div>
        <div x-arrow="" class="" style="left: 225px;"></div>
      </div>
    </div>

    <login :dialogVisible.sync="dialogVisible"></login>
  </div>
</template>

<script>
/* eslint-disable */
import { getAllProgrammingCourse, getProgrammingAdmin } from "./../api/index";
import Login from './../components/Login'

export default {
  name: "Home",
  components: {
    Login
  },
  data () {
    return {
      programList: [],
      adminImg: '',
      dialogVisible: false,
      showImg: false,
      text: '登录',
      isShowfeedback: false,
      showQr: false
    };
  },
  watch: {
    dialogVisible () {
      if (localStorage.getItem('userId')) {
        this.text = '退出'
      } else {
        this.text = '登录'
      }
    }
  },
  async created () {
    if (localStorage.getItem('userId')) {
      this.text = '退出'
    } else {
      this.text = '登录'
    }
    this.getProgram();
    const res = await getProgrammingAdmin({
      type: -1
    })
    if (res.adminImageUrl) {
      this.adminImg = res.adminImageUrl
      this.showQr = true
    }
    window.addEventListener("scroll", (event) => {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      var scrollTop = document.documentElement.scroll || window.pageYOffset || document.body.scrollTop;
      if (scrollTop < 150) {
        this.showImg = false
      } else {
        this.showImg = true
      }
    });
  },
  methods: {
    showfeedback (obj) {
      if (!this.isShowfeedback) {
        this.$refs.feedback.classList.add('active');
      } else {
        this.$refs.feedback.classList.remove('active');
      }
      this.isShowfeedback = !this.isShowfeedback;
    },
    hidefeedback () {
      this.isShowfeedback = false;
      this.$refs.feedback.classList.remove('active');
    },
    async handleLogin () {
      if (this.text === '登录') {
        this.dialogVisible = true
      } else {
        this.text = '登录'
        localStorage.clear()
      }
    },
    handleDetail (item) {
      this.$router.push({ name: "detail", query: { courseId: item.courseId } });
    },
    async getProgram () {
      const res = await getAllProgrammingCourse({
        pageSize: 100,
        pageIndex: 1
      });
      this.programList = res || [];
      this.programList.map(item => {
        this.$set(item, "courseSummaryJSON", JSON.parse(item.courseSummary));
      });
    },
    // 开始学习
    handleStudy () {
      if(this.text == '登录'){
        this.dialogVisible = true
      }else {
        this.$router.push({ name: "study" });
      }

    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
@import url("./../styles/variables.scss");
.fix-box {
  width: 120px;
  height: 120px;
  position: fixed;
  right: 0;
  top: 50%;
  img {
    width: 120px;
    height: 120px;
  }
}
.home {
  background: #f6f6f6;
  .head {
    overflow: hidden;
    background: #ffffff;
    position: relative;
    img {
      width: 100%;
    }
    .head-content {
      text-align: center;
      position: absolute;
      width: 100%;
      top: 182.5px;
      .content-text {
        font-size: 40px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 9.3px;
      }
      .content-subtext {
        margin-top: 30px;
        /* font-size: 23px;
        color: #ffffff;*/
        /*font-size: 40px;
        letter-spacing: 9.3px;
        font-weight: 700;*/
        font-size: 24px;
        font-weight: 600;
        color: #ffc8a3;
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
        margin-top: 93px;
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
    //margin-top: 67px;
    margin-bottom: 487px;
    .special-content {
      width: 100%;
      text-align: center;
      position: relative;
      .special-content_bg {
        height: 605px;
        width: 100%;
      }
      .special-content_title {
        width: 202px;
        height: 44px;
        position: absolute;
        top: 67px;
        left: 50%;
        margin-left: -101px;
      }
      .special-li {
        position: absolute;
        top: 174px;
        margin: 0;
        padding: 0;
        margin-left: -380px;
        left: 50%;
        li {
          list-style: none;
          float: left;
          margin-right: 60px;
          &:last-child {
            margin-right: 0;
          }
        }
        img {
          width: 145px;
          height: 145px;
        }
        .special-li_title {
          font-size: 18px;
          color: #000000;
        }
        .special-li_subtitle {
          font-size: 13px;
          color: #777478;
          margin-top: 8px;
        }
      }
    }
    .all-project {
      width: 100%;
      text-align: center;
      position: relative;
      height: auto;
      margin-top: 64px;
      .all-project_title {
        width: 202px;
        height: 44px;
      }
      .project-li {
        margin-top: 80px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        li {
          width: 1128px;
          height: 220px;
          padding-right: 40px;
          border-radius: 16px;
          -webkit-box-shadow: 0 2px 81px 0 rgba(56, 35, 219, 0.09);
          box-shadow: 0 2px 81px 0 rgba(56, 35, 219, 0.09);
          background-color: #fff;
          margin-top: 32px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          position: relative;
          .li-img {
            width: 404px;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 16px 0 0 16px;
            }
          }
          .li-text {
            margin-left: 48px;
            .title {
              margin-top: 40px;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -webkit-align-items: center;
              -ms-flex-align: center;
              align-items: center;
              font-size: 26px;
              font-weight: 600;
              color: #31285d;
            }
            p {
              margin: 0;
              padding: 0;
              text-align: left;
            }
            .desc {
              margin-top: 20px;
              opacity: 0.5;
              line-height: 2;
              color: #1b1243;
              /* width: 312px;*/
              height: 117px;
              overflow: hidden;
              text-overflow: clip;
            }
          }
          .li-btn {
            position: absolute;
            right: 40px;
            bottom: 40px;
            border: none;
            width: 200px;
            height: 48px;
            border-radius: 24px;
            background: #6741ef;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            cursor: pointer;
          }
        }
      }

      /* .project-li {
        width: 100%;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        margin-bottom: 30px;
        li {
          position: relative;
          margin-top: 37px;
          background: #ffffff;
          width: 896px;
          height: 199px;
          display: inline-block;
          list-style: none;
          .li-img {
            width: 287px;
            height: 201px;
            float: left;
            img {
              width: 287px;
              height: 200px;
            }
          }
          .li-text {
            padding-left: 39px;
            //width: 609px;
            text-align: left;
            padding-top: 44px;
            float: left;
            .title {
              font-size: 18px;
              padding-bottom: 30px;
            }
            p {
              margin: 0;
              padding: 0;
            }
            .desc {
              color: #777478;
              font-size: 13px;
              padding-bottom: 10px;
            }
          }
          .li-btn {
            width: 142px;
            height: 43px;
            background: linear-gradient(
              180deg,
              rgba(79, 44, 201, 1) 0%,
              rgba(111, 73, 233, 1) 100%
            );
            border-radius: 25px;
            color: #ffffff;
            font-size: 17px;
            position: absolute;
            right: 47px;
            bottom: 42px;
            cursor: pointer;
          }
        }
      }*/
    }
  }

  .footer {
    position: relative;
    height: 180px;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 180px;
    }
    p {
      position: absolute;
      text-align: center;
      width: 100%;
      top: 100px;
      font-size: 12px;
      color: #8c87a6;
    }
  }
}

.feedback-wrap {
  z-index: 20;
  line-height: normal;
}
.feedback {
  position: fixed;
  bottom: 80px;
  right: -44px;
  -webkit-transition: right 0.3s ease-in-out;
  transition: right 0.3s ease-in-out;
}
.feedback.active {
  right: 0;
}
.feedback:not(.exiting):hover {
  right: 0;
}
.feedback.entering {
  right: 0;
}
.feedback-entry {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 12px;
  line-height: 20px;
  padding-left: 16px;
  width: 60px;
  height: 38px;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  background-color: #42414d;
}
.feedback-entry:hover,
.feedback-entry:active {
  background-color: #55545f;
}
.clickable {
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.pen-icon {
  position: relative;
  top: 4px;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-origin: 0;
}
.close-icon {
  color: #ffffff;
  position: relative;
}
.button-text {
  width: 28px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}
.guide-popover {
  position: fixed;
  bottom: 130px;
  right: 0;
  display: inline-block;
  border-radius: 8px;
  color: #201f26;
  background: white;
  padding: 36px;
  padding-bottom: 24px;
  -webkit-box-shadow: 0 2px 20px 0 rgba(60, 54, 98, 0.2);
  box-shadow: 0 2px 20px 0 rgba(60, 54, 98, 0.2);
}
.guide-popover .close {
  position: absolute;
  right: 12px;
  top: 12px;
}
.guide-popover .title {
  font-size: 20px;
  font-weight: 600;
}
.guide-popover .title .index {
  margin-right: 4px;
}
.guide-popover .title .total {
  font-size: 12px;
  font-weight: 300;
  color: #969399;
}
.guide-popover .content {
  margin-top: 12px;
  font-size: 14px;
}
/* }*/
.guide-popover [x-arrow] {
  position: absolute;
  width: 12px;
  height: 12px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  border-radius: 2px;
  background-color: white;
}
/*   }*/
.guide-popover [x-arrow].hide {
  display: none;
}
.guide-popover[x-placement="bottom"] {
  margin-top: 6px;
}
.guide-popover[x-placement="bottom"] [x-arrow] {
  top: -5px;
}
.guide-popover[x-placement="left"] {
  margin-right: 6px;
}
.guide-popover[x-placement="left"] [x-arrow] {
  right: -5px;
}
.guide-popover[x-placement="top"] {
  margin-bottom: 6px;
}
.guide-popover[x-placement="top"] [x-arrow] {
  bottom: -5px;
}
.guide-popover[x-placement="right"] {
  margin-left: 6px;
}
.guide-popover[x-placement="right"] [x-arrow] {
  left: -5px;
}
.guide-popover[x-placement="right-end"] {
  margin-left: 6px;
  margin-top: 6px;
}
.guide-popover[x-placement="right-end"] [x-arrow] {
  left: -5px;
}
.fade-enter-active {
  -webkit-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
}
.fade-leave-active {
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0 !important;
}
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
.qrcode-modal {
  width: 200px;
}
.center {
  margin: 0 auto;
  text-align: center;
}
.qrcode {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  width: 160px;
  height: 160px;
  border-radius: 13.6px;
  background-color: #f2f2f2;
}
.qrcode .inner {
  width: 144.7px;
  height: 144.7px;
  border-radius: 11.9px;
  background-color: #ffffff;
  overflow: hidden;
}
.qrcode img {
  width: 144px;
  height: 144px;
}
.text {
  margin-top: 12px;
  font-size: 16px;
  /* font-weight: 600;*/
  color: #c2c1c6;
}
.symbol {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #6741ef;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  color: #ffffff;
}
</style>
