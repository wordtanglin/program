<template>
  <div class="code">
    <div class="head">
      <div class="head-back_btn" @click="handleBack">
        <i class="iconfont icon-left"></i>
        <span class="head-back">返回</span>
      </div>
      <div class="head-title">
        <div class="title-container">
          <!-- <div class="head-current">1</div> -->
          <span class="title-name">{{ $route.query.detailName }}</span>
        </div>
        <!-- <div class="title-container">
                  <img src="./../assets/lock.png" style="height: 23px;width: 23px;" />
                  <span>第0关-千寻的名字</span>
                </div> -->
      </div>
      <div></div>
    </div>
    <div class="body">
      <div class="body-container" id="body-container">
        <ul v-if="list.length > 0" id="box">
          <div class="body-wrap" v-for="(item, index) of list" :key="index">
            <template v-if="item.type === 'h1'">
              <div class="avatar-bg"></div>
              <h1 class="body-li" :id="item.name">
                <div
                  style="font-size: 22px; color: rgb(255, 203, 124); font-weight: 500;padding:20px;"
                  v-html="item.content"
                ></div>
              </h1>
            </template>
            <template v-if="item.type === 'h2'">
              <div class="avatar-bg"></div>
              <h1 class="body-li" :id="item.name">
                <div
                  style="font-size: 18px; color: rgb(255, 203, 124);font-weight: 500; padding:20px;"
                  v-html="item.content"
                ></div>
              </h1>
            </template>
            <template v-if="item.type === 'text'">
              <div class="avatar-bg" v-if="item.avatar">
                <img :src="item.avatar" class="avatar" />
              </div>
              <li class="body-li">
                <pre class="text" v-html="item.content"></pre>
              </li>
            </template>
            <template v-if="item.type === 'choose'">
              <!-- <div class="avatar-bg" style="padding-top: 68px;">
                <img src="./../assets/logo.png" class="avatar" />
              </div> -->
              <li class="body-li" style="margin-top: 34px;">
                <div class="resouce-title">
                  <div class="resource-title">
                    单选题
                  </div>
                </div>
                <div class="body-li-border" style="margin-top: 30px;">
                  <p class="text-choose">
                    {{ item.content.title }}
                  </p>
                  <ul
                    class="body-choose"
                    v-if="item.content.result.length == 1"
                  >
                    <li
                      v-for="(choose, chooseIndex) of item.content.list"
                      :key="'choose' + chooseIndex"
                      :class="
                        sectionsContentNum - 1 != index &&
                        item.content.result[0] == choose.key
                          ? 'li-check'
                          : ''
                      "
                      @click="
                        selectRadio($event, item.content, chooseIndex, index)
                      "
                    >
                      {{ choose.key }}.{{ choose.text }}
                    </li>
                    <li
                      :style="
                        sectionsContentNum - 1 != index
                          ? 'opacity:1'
                          : 'opacity:0'
                      "
                    >
                      {{
                        item.content.list.filter(
                          a => a.key == item.content.result[0]
                        )[0].desc
                      }}
                    </li>
                  </ul>
                  <ul
                    class="body-choose"
                    v-if="item.content.result.length > 1"
                    style="height:inherit;"
                  >
                    <li
                      v-for="(choose, chooseIndex) of item.content.list"
                      :key="'choose' + chooseIndex"
                      :class="
                        sectionsContentNum - 1 != index &&
                        item.content.result[0] == choose.key
                          ? 'li-check'
                          : ''
                      "
                      @click="
                        selectCheckBox($event, item.content, chooseIndex, index)
                      "
                    >
                      {{ choose.key }}.{{ choose.text }}
                    </li>
                    <li
                      :style="
                        sectionsContentNum - 1 != index
                          ? 'opacity:1'
                          : 'opacity:0'
                      "
                    >
                      {{
                        item.content.list.filter(
                          a => a.key == item.content.result[0]
                        )[0].desc
                      }}
                    </li>
                  </ul>
                </div>
              </li>
            </template>
            <template v-if="item.type === 'img'">
              <!-- <div class="avatar-bg">
                <img src="./../assets/logo.png" class="avatar" />
              </div> -->
              <li class="body-li">
                <!-- <div class="avatar-container_img">
                                               <img src="./logo.png" class="avatar" />
                                             </div>-->
                <div class="body-img" v-html="item.content">
                  <!-- <img src="./../assets/python.png" class="li-img" /> -->
                </div>
              </li>
            </template>
            <template v-if="item.type === 'code'">
              <!-- <div class="avatar-bg" style="padding-top:16px">
                <img src="./../assets/logo.png" class="avatar" />
              </div> -->
              <PythonEditor
                :class="isPreview ? 'disable' : ''"
                :content="item.content.replace(/<*[^<>]*>/gi, '')"
                :index="index"
                :sectionsContentNum="sectionsContentNum"
                @run="runEvent"
                theme="tomorrow_night"
              ></PythonEditor>
            </template>
            <template v-if="item.type === 'block'">
              <div class="avatar-bg"></div>
              <!-- <PythonEditor
                class="disable"
                :content="item.content.replace(/<*[^<>]*>/gi, '')"
                :index="index"
                :sectionsContentNum="sectionsContentNum"
                @run="runEvent"
                type="block"
                theme="dracula"
              ></PythonEditor> -->
              <v-md-editor v-model="item.content" mode="preview"></v-md-editor>
            </template>
          </div>
          <div
            v-if="nextList.length && sectionsContentNum >= contentList.length"
            class="practice"
          >
            <div class="tip" @click="nextSection">【下一关 >>>>>>>>>>>>】</div>
          </div>
        </ul>
        <div class="avatar-bg"></div>
        <div class="body-footer" @click="saveStudy()">
          <img src="./../assets/enter.png" class="footer-enter" />
        </div>
      </div>
      <div class="menu-container">
        <ul>
          <li class="one-li" v-for="(list, idx) of this.treeList" :key="idx">
            <span
              @click="jumpSite(list.name)"
              :class="curH1 == list.name ? 'active' : ''"
              :name="list.name"
              >{{ idx + 1 }}.{{ list.content }}</span
            >
            <ul class="child-menu">
              <li
                class="two-li"
                v-for="(child, indx) of list.child"
                :key="indx"
              >
                <span
                  @click="jumpSite(child.name)"
                  :class="curH1 == child.name ? 'active' : ''"
                  :name="child.name"
                  >{{ indx + 1 }}.{{ child.content }}</span
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!--  <div class="footer-btn">
              <div style="width: 1004px;height: 66px;margin-left: 66px">daf</div>
            </div>-->
    </div>

    <div class="feedback-wrap" v-if="adminImg != ''">
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
  </div>
</template>

<script>
/* eslint-disable */
import {
  getProgrammingCourseDetailWithSectionId,
  download,
  saveProgrammingLearnInfo,
  saveProgrammingLog,
  queryProgrammingCourseLearningProcess,
  getProgrammingAdmin
} from "./../api/index";
import marked from "marked";
import PythonEditor from "../components/PythonEditor";
import { baidu_btn } from "../utils/baidu";

import Vue from 'vue';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-json';

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
VueMarkdownEditor.use(vuepressTheme);
VueMarkdownEditor.use(createLineNumbertPlugin());
Vue.use(VueMarkdownEditor);

export default {
  name: "Code",
  components: {
    PythonEditor
  },
  data () {
    return {
      list: [],
      sectionsContentNum: 1,
      treeList: [],
      contentList: [],
      detailOrder: "",
      isFinshEditor: false,//是否当前完成编码练习
      isPreview: false, //是否为预览功能
      isShowfeedback: false,
      nextList: [],//下一关数据
      isContinue: false, //是否可以进行下一步
      chapterId: this.$route.query.chapterId,
      curH1: "",
      adminImg: '',
      showQr: false
    };
  },
  created () {
    if (this.$route.query.url) {//判断是否为预览功能
      this.isPreview = true;
    }
    this.getCode();
    this.getImg();
    if (!this.isPreview) {
      document.onkeydown = this.keydown;
    }
  },
  methods: {
    handleShow (item) {
      item.show = !item.show;
    },
    async getImg () {
      const res = await getProgrammingAdmin({
        type: -1
      });
      if (res.adminImageUrl) {
        this.adminImg = res.adminImageUrl;
        this.showQr = true;
      }
    },

    async getCode () {
      if (this.isPreview) {//判断是否为预览功能
        const content = await download({ filePath: this.$route.query.url });
        this.initMarkdown(marked(content));
      } else {
        const res = await getProgrammingCourseDetailWithSectionId({
          chapterId: this.$route.query.chapterId,
          courseId: this.$route.query.courseId,
          sectionId: this.$route.query.sectionId,
          userId: localStorage.getItem("userId")
        });
        const content = await download({ filePath: res.sectionContentUrl });
        this.sectionsContentNum = parseInt(res.sectionsContentNum);
        // this.sectionsContentNum = 1;
        this.detailOrder = res.detailOrder;
        this.initMarkdown(marked(content));

        //拿到下一关数据
        let result = await queryProgrammingCourseLearningProcess({
          courseId: this.$route.query.courseId,
          userId: localStorage.getItem("userId")
        });
        let courseChapters = [], curChapterIndex = 0;
        result.courseChapters.map((item, index) => {
          if (item.chapterId == this.$route.query.chapterId) {
            courseChapters.push(item);
            curChapterIndex = index;
          }
        });
        let curIndex = 0, nextList = [];
        courseChapters[0].courseSections.map((item, index) => {
          if (item.sectionId == this.$route.query.sectionId) {
            curIndex = index;
          }
        });
        if (courseChapters[0].courseSections[curIndex + 1]) {
          nextList.push(courseChapters[0].courseSections[curIndex + 1]);
        }
        if (!nextList.length && result.courseChapters[curChapterIndex + 1]) {
          nextList.push(result.courseChapters[curChapterIndex + 1].courseSections[0]);
          this.chapterId = result.courseChapters[curChapterIndex + 1].chapterId;
        }
        this.nextList = nextList;
      }

    },
    // 解析
    initMarkdown (content) {
      let div = document.createElement("div");
      div.innerHTML = content;
      let menuList = [];
      let contentList = [];
      let avatarList = []
      if (div.children.length !== 0) {
        for (let i = 0; i < div.children.length; i++) {
          let child = div.children[i];
          let tagName = child.tagName.toUpperCase();
          switch (tagName) {
            case "H1":
              menuList.push({ type: "h1", name: "h1" + i, content: child.innerHTML });
              contentList.push({ type: "h1", name: "h1" + i, content: child.innerHTML });
              break;
            case "H2":
              menuList.push({ type: "h2", name: "h2" + i, content: child.innerHTML });
              contentList.push({ type: "h2", name: "h2" + i, content: child.innerHTML });
              break;
            case "PRE":
              if (child.innerHTML.indexOf("language-ide") > -1) {//编辑器
                contentList.push({
                  type: "code",
                  content: child.innerHTML
                });
              } else if (child.innerHTML.indexOf("language-python") > -1) {//代码块
                let str = "```python \n" + child.innerHTML.replace(/<*[^<>]*>/gi, '') + " \n ```"
                contentList.push({
                  type: "block",
                  content: str
                });
              }
              break;
            case "TABLE":
              contentList.push({
                type: "choose",
                content: this.getTables(child)
              });
              break;
            case "P":
              let str = child.innerHTML;
              let type = "";
              if (str.length > 0) {
                type = str.substring(0, 3);
              }
              switch (type) {
                case "<t ":
                  contentList.push({
                    type: "text",
                    content: str.substring(str.indexOf('>') + 1, str.length - 4) || "",
                    oldStr: str
                  });
                  break;
                case "<t>":
                  contentList.push({
                    type: "text",
                    content: str.substring(3, str.length - 4) || "",
                    oldStr: str
                  });
                  break;
                case "<im":
                  if (str.indexOf('img-id') > -1) {
                    avatarList.push(str)
                  } else {
                    str = str.replace('<im>', '')
                    str = str.replace('</im>', '')
                    str = str.replace('>', 'style="width: 668px;height: 344px;">')
                    contentList.push({
                      type: "img",
                      content: str || ""
                    });
                  }
                  break;
              }
              break;
          }
        }
      }

      let newList = [];
      let newItem = { child: [] };
      menuList.map(item => {
        if (item.type === "h1") {
          newItem = item;
          newItem.child = [];
        }
        if (item.type === "h2") {
          newItem.child.push(item);
        }
        if (item.type === "h1") {
          newList.push(newItem);
        }
      });
      this.treeList = newList;
      this.contentList = contentList;
      this.contentList.map(item => {
        if (item.type === 'text' && item.oldStr.indexOf('img-id') > -1) {
          let oldStr = item.oldStr || ''
          let imgIdStr = oldStr.substring(oldStr.indexOf('img-id') + 7, oldStr.indexOf('>'))
          let imgId = imgIdStr.replace(/"/g, '')
          avatarList.map(avatarItem => {
            let avatarStr = avatarItem.substring(avatarItem.indexOf('img-id') + 7, avatarItem.indexOf('>'))
            let avatarId = avatarStr.replace(/"/g, '')
            if (imgId === avatarId) {
              let imgStr = avatarItem
              imgStr = imgStr.replace('</im>', '')
              let srcStr = imgStr.substring(imgStr.indexOf('>') + 1, imgStr.length)
              let srcList = srcStr.split(' ')
              if (srcList.length === 3) {
                let src = srcList[1] || ''
                item.avatar = src.substring(5, src.length - 1)
              }
            }
          })
        }
      })
      if (this.isPreview) {//判断是否为预览
        this.sectionsContentNum = contentList.length;
      }
      let curList = contentList.slice(0, this.sectionsContentNum);
      this.list = curList;
      if (!this.isPreview) {//判断是否为预览
        setTimeout(() => {
          document.getElementById("body-container").scrollTop = 999999999;
        }, 500);
      }
      let that = this;
      document.getElementById("body-container").addEventListener("scroll", function () {
        that.setMenuStyle();
      });

    },
    setMenuStyle () {//设置菜单颜色
      let scrollTop = document.getElementById("body-container").scrollTop + document.getElementById('body-container').clientHeight;
      let hList = document.getElementsByTagName("h1");
      let hListoffsetTop = [];
      for (var i = 0; i < hList.length; i++) {
        hListoffsetTop.push({
          num: hList[i].offsetTop,
          id: hList[i].getAttribute("id")
        });
        // let offsetTop = hList[i].offsetTop;
        // let offsetTop2 = hList[i+1] ? hList[i+1].offsetTop : 0;
        // console.log(scrollTop+document.getElementById('body-container').clientHeight,offsetTop)
        // if((scrollTop+document.getElementById('body-container').clientHeight) <= offsetTop){
        //   if((scrollTop+document.getElementById('body-container').clientHeight) > offsetTop2){
        //     this.curH1 = hList[i].getAttribute("id");
        //     break;
        //   }else{
        //     this.curH1 = hList[i-1].getAttribute("id");
        //     break;
        //   }

        // }
      }

      let curKey = 0;
      let newArrar = hListoffsetTop.find((item, index) => {
        if (scrollTop <= item.num) {
          curKey = index;
          return item
        }
      })
      this.curH1 = newArrar ? hList[curKey - 1].getAttribute("id") : hList[hList.length - 1].getAttribute("id");
    },
    // 表格
    getTables (child) {
      var tabLen = child;
      var jsonT = "[";
      for (var i = 0; i < tabLen.rows.length; i++) {
        for (var j = 0; j < tabLen.rows[i].cells.length; j++) {
          if (i == 0 && j == 0) {
            jsonT += `
            { key:"${tabLen.rows[i].cells[0].innerHTML || "title"}",
            text:"${tabLen.rows[i].cells[1].innerHTML}",
            desc:"${tabLen.rows[i].cells[2].innerHTML}"}`;
          } else {
            jsonT += `,
            {key:"${tabLen.rows[i].cells[0].innerHTML || "title"}",
            text:"${tabLen.rows[i].cells[1].innerHTML}",
            desc:"${tabLen.rows[i].cells[2].innerHTML}"}`;
          }
        }
      }
      jsonT += "]";
      let tmpList = eval(jsonT);
      let tmpObj = {};
      tmpList.map(item => {
        if (!tmpObj[item.key]) {
          tmpObj[item.key] = item;
        }
      });
      let keyList = Object.keys(tmpObj);
      let resultList = [];
      keyList.map(item => {
        if (item !== "title") {
          resultList.push(tmpObj[item]);
        }
      });
      return {
        result: tmpObj["title"].desc.split("/"),
        title: tmpObj["title"].text,
        list: resultList
      };
    },
    handleCode (item) {
      this.$router.push({ name: "code", query: { courseId: item.courseId } });
    },
    // 返回
    handleBack () {
      //退出课堂
      if (!this.isPreview) {
        baidu_btn("exit_lesson", this.$route.query.detailOrder + "-" + this.detailOrder, localStorage.getItem("userId"), "");
      }
      this.$router.back(-1);
    },
    async saveStudy () {
      if (this.isPreview) return;
      if (this.list[this.list.length - 1].type == "code" || this.list[this.list.length - 1].type == "choose") {
        if (!this.isContinue) {
          this.$message({
            message: "请完成当前练习再进行下一步！",
            type: "warning"
          });
          return;
        }
      }

      let result = await saveProgrammingLearnInfo({
        courseId: this.$route.query.courseId,
        sectionId: this.$route.query.sectionId,
        sectionsContentNum: this.sectionsContentNum,
        userId: localStorage.getItem("userId")
      });
      if (result.returnStatus == false) {
        this.$message({
          message: "恭喜你过关",
          type: "success"
        });
      } else {
        this.isContinue = false;
        this.sectionsContentNum++;
        if (this.sectionsContentNum == this.contentList.length) {
          this.saveStudy();
        }
        let curList = this.contentList.slice(0, this.sectionsContentNum);
        this.list = curList;
        setTimeout(() => {
          document.getElementById("body-container").scrollTop = 999999999;
        }, 50);
      }

    },
    runEvent (content) {//百度埋点监听运行和重做
      baidu_btn(content.category, this.$route.query.detailOrder + "-" + this.detailOrder + "-" + content.block_num, localStorage.getItem("userId"), content.opt_value);
      if (content.category == "end_program") {
        this.saveProgrammingLog(content);
      }
      if (content.category == "end_program" && content.right) {
        if (content.index + 1 < this.sectionsContentNum) {
          return;
        }
        this.isContinue = true;
        this.saveStudy();//下一步
      }
    },
    async saveProgrammingLog (content) {//接口埋点保存日志
      let result = await saveProgrammingLog({
        "ts": new Date().getTime(),
        "user_id": localStorage.getItem("userId"),
        "lesson_id": this.$route.query.detailOrder + "-" + this.detailOrder,
        "item_seq": content.block_num,
        "ide_id": content.block_num,
        "code": content.code,
        "terminal_text": content.terminal_text,
        "notice": content.notice,
        "passed": content.opt_value
      });
    },
    keydown (e) {//敲回车键时
      var currKey = 0, e = e || event;
      if (e.target.nodeName != "BODY") return;
      currKey = e.keyCode || e.which || e.charCode;//支持IE、FF
      if (currKey == 13) {
        //保存
        this.saveStudy();
      }
    },
    selectRadio (e, content, chooseIndex, index) {//选择单选时
      if (this.sectionsContentNum - 1 == index) {
        var li = this.recursiveParentNode(e.target, "ul").getElementsByTagName("li");
        var opt = ["A", "B", "C"];
        for (var i = 0; i < li.length; i++) {
          li[i].classList.remove("li-check");
          li[i].classList.remove("li-error");
        }
        if (content.result[0] == opt[chooseIndex]) {//选对
          li[chooseIndex].classList.add("li-check");
        } else {
          li[chooseIndex].classList.add("li-error");//选错
        }
        li[li.length - 1].style.opacity = "1";
        li[li.length - 1].innerHTML = content.list[chooseIndex].desc;
        this.isContinue = true;
        //选择选项百度埋点
        baidu_btn("click_option", this.$route.query.detailOrder + "-" + this.detailOrder + "-" + index, localStorage.getItem("userId"), opt[chooseIndex]);
        //保存
        this.saveStudy();
      }

    },
    selectCheckBox (e, content, chooseIndex, index) {//选择多选时
      if (this.sectionsContentNum - 1 == index) {
        var li = this.recursiveParentNode(e.target, "ul").getElementsByTagName("li");
        var opt = ["A", "B", "C"];
        li[chooseIndex].classList.add("li-check");
        li[li.length - 1].style.opacity = "1";
        li[li.length - 1].innerHTML = content.list[chooseIndex].desc;
        this.isContinue = true;
        let allList = this.list;
        allList[index].content.result[0] = opt[chooseIndex];
        this.list = allList;
        //选择选项百度埋点
        baidu_btn("click_option", this.$route.query.detailOrder + "-" + this.detailOrder + "-" + index, localStorage.getItem("userId"), opt[chooseIndex]);
        //保存
        this.saveStudy();
      }

    },
    recursiveParentNode (node, target) {//递归父节点
      return node.nodeName.toLowerCase() == target ? node : this.recursiveParentNode(node.parentNode, target);
    },
    jumpSite (id) {
      document.getElementById("body-container").scrollTop = document.getElementById(id).offsetTop - 50;
      setTimeout(() => {
        this.curH1 = id;
      }, 50)
    },
    showfeedback (obj) {
      if (!this.isShowfeedback) {
        this.$refs.feedback.classList.add("active");
      } else {
        this.$refs.feedback.classList.remove("active");
      }
      this.isShowfeedback = !this.isShowfeedback;
    },
    hidefeedback () {
      this.isShowfeedback = false;
      this.$refs.feedback.classList.remove("active");
    },
    nextSection () {
      this.$router.replace({
        name: "code",
        query: {
          courseId: this.$route.query.courseId,
          chapterId: this.chapterId,
          sectionId: this.nextList[0].sectionId,
          detailName: this.nextList[0].detailName,
          detailOrder: this.detailOrder
        }
      }, () => {
        this.$router.go(0);//刷新页面
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("././../styles/reset.scss");

body,
button,
html,
input,
select,
textarea,
div,
p {
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Source Han Sans SC,
    WenQuanYi Micro Hei, sans-serif;
}

.code ::deep code {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 120%;
  background-color: #42414d;
  border-radius: 5px;
  margin: auto 3px;
}

.code {
  background: #34333cff;

  .head {
    height: 46px;
    line-height: 46px;
    padding-left: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .head-back_btn {
      display: inline-block;
      font-weight: 400;

      i {
        font-size: 18px;
        color: #c2c1c6;
        font-weight: bold;
        vertical-align: middle;
        cursor: pointer;
      }

      .head-back {
        font-size: 14px;
        color: #c2c1c6;
        margin-left: 5px;
        font-weight: 400;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .head-title {
      border-radius: 27px;
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .title-container {
        background: #48474e;
        display: flex;
        align-items: center;
        padding: 4px 0 4px 0;
        border-radius: 23px;
        height: 23px;
      }

      .head-current {
        width: 23px;
        border-radius: 23px;
        height: 23px;
        background: #6742ef;
        display: inline-block;
        text-align: center;
        line-height: 23px;
        font-size: 17px;
        color: #ffffff;
      }

      .title-name {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        padding: 6px 12px 6px 12px;
      }
    }
  }

  .body {
    display: flex;
    background: #0a080f;
    height: calc(100vh - 46px);

    /* .avatar-bg {
                       width: 66px;
                     }*/
    .footer-btn {
      width: 1073px;
      height: 66px;
      position: fixed;
      bottom: 0;
      background-color: red;
      left: 66px;
    }

    .body-container {
      overflow: hidden;
      overflow-y: auto;
      flex: 1;
      background: #0a080f;

      margin-bottom: 66px;
      /*position: relative;*/

      ul {
        /* padding-bottom: 80px;*/
        margin-left: 66px;
        background: #1f1e25;
        height: 100%;

        .body-wrap {
          display: flex;
          background: #1f1e25;
          // padding-top: 15px;
          &:last-child {
            padding-bottom: 20px;
          }

          .avatar-bg {
            width: 66px;
            text-align: center;
            position: relative;
            padding: 22px 0;
            background: #0a080f;
            margin-left: -66px;

            img {
              position: absolute;
              // margin-top: 10px;
              width: 30px;
              height: 30px;
              right: 10px;
            }
          }
        }

        .body-li {
          align-items: center;
          flex: 1;
          position: relative;
          padding: 7px 0;

          .avatar-container_choose {
            margin-top: -100px;
            text-align: center;
            width: 64px;
            margin-right: 20px;
            position: absolute;
            left: 0;
            margin-top: -100px;
          }

          .avatar-container_img {
            margin-top: -100px;
            text-align: center;
            width: 64px;
            margin-right: 20px;
            position: absolute;
            left: 0;
          }

          .text {
            padding: 0 20px;
            color: #c2c1c6;
            border-left: 2px solid #4b453e;
            white-space: normal;
            line-height: 30px;
          }

          .text-choose {
            padding-left: 20px;
            /*color: #fff;*/
            font-weight: 500;
            color: #f7f7fb;
          }

          .resouce-title {
            position: absolute;
            left: 20px;
            top: 0px;
            height: 20px;
            line-height: 20px;
            color: #201f26;
            font-size: 14px;
            font-weight: 700;

            .resource-title {
              padding-left: 6px;
              padding-right: 6px;
              background-color: #757377;
              border-radius: 2px;
            }
          }
        }

        .body-li-border {
          border-left: 2px solid #4b453e;
        }

        .body-choose {
          margin: 0 20px;

          li {
            margin-top: 20px;
            border-radius: 10px;
            background: #34333a;
            color: #fff;
            width: 640px;
            line-height: 34px;
            padding: 15px;
            cursor: pointer;
          }

          li:hover {
            background-color: #3b3a45;
          }

          .li-check {
            background: #272e30;
            border: 1px solid rgba(114, 190, 124, 1);
          }

          .li-error {
            border: 1px solid #fb5a5c;
            background-color: #35242b;
          }
        }

        .body-img {
          margin-left: 20px;
        }
      }
    }

    .menu-container {
      width: 250px;
      padding-top: 20px;
      padding-left: 45px;
      padding-bottom: 66px;

      .one-li {
        font-size: 16px;
        color: rgb(194, 193, 198);
        font-weight: 400;
        padding-top: 8px;
        span:hover {
          color: #f7f7fb !important;
        }
        .active {
          color: rgb(255, 203, 124);
        }
        span.active:hover {
          color: #ffdfb0 !important;
        }
      }

      .child-menu {
        margin-left: 2.5em;
        padding-top: 8px;

        .two-li {
          font-size: 14px;
          line-height: 30px;
          color: rgb(194, 193, 198);
        }
      }

      li {
        // color:rgba(255,255,255,1);
        color: #9997a1ff;
        cursor: pointer;
        // padding-bottom: 14px;
      }
    }

    .body-footer {
      margin-top: 140px;
      height: 66px;
      line-height: 66px;
      background: #34333c;
      text-align: center;
      font-size: 32px;
      color: #ffffff;
      position: absolute;
      bottom: 0;
      width: calc(100% - 361px);
      margin-left: 66px;
      z-index: 100;
      border-top: 4px solid #805ff5;
      cursor: pointer;
      min-width: 1005px;
    }

    .body-footer:hover {
      background-color: #3e3d47;
    }

    .icon-enter {
      font-size: 32px;
    }

    .footer-enter {
      position: absolute;
      top: 10px;
      transform: rotateY(180deg);
      width: 50px;
    }
  }

  .disable {
    // pointer-events: none;
  }

  .block-box {
    display: inline-block;
    padding: 12px;
    border-radius: 8px;
    background-color: #19171d;
    max-width: 100%;
    overflow: auto;
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
  right: 10px;
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
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Source Han Sans SC,
    WenQuanYi Micro Hei, sans-serif;
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

.practice {
  position: relative;
  padding: 20px;
  background: #1f1e25;
  padding-bottom: 70px;
  padding-top: 70px;
}

.practice .tip {
  line-height: 1;
  font-size: 22px;
  color: #805ff5;
  font-weight: bold;
  cursor: pointer;
}
.li-img {
  width: 668px;
  height: 344px;
}
.v-md-editor{
  background:#1f1d25;
  
}
.v-md-editor-preview{
code{
        display: inline !important;
  }
}
</style>
