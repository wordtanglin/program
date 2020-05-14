<template>
  <div class="study" v-if="show">
    <div class="head">
      <div class="head-top">
        <span style="cursor: pointer;"
          @click="handleBack"
          ><i class="iconfont icon-left"></i
          >&nbsp;&nbsp;返回主页</span
        >
      </div>
    </div>
    <div class="body">
      <!-- <div>
        <p class="body-title">我正在学习</p>
      </div> -->
      <template v-for="(item, index) of list">
        <!-- 课程 start -->
        <div class="project-show" :key="'p' + index">
          <div class="project-show_container">
            <!-- <img src="./../assets/python.png" />
            <div class="project-center">
              <p>{{ item.courseName }}</p>
              <ul>
                <li
                  v-for="(desc, descIndex) of item.courseSummaryJSON"
                  :key="descIndex"
                >
                  {{ desc }}
                </li>
              </ul>
            </div>
            <div class="project-right">
              <span>已学习{{ item.learningProcess }}%</span>
              <div class="progress">
                <div
                  class="progress-done"
                  :style="{ width: item.learningProcess + '%' }"
                ></div>
              </div>
              <button @click="handleCode(item, index)">继续学习</button>
            </div> -->
            <section class="top-wrapper">
              <div class="left-box">
                <div class="title-wrapper">
                  <span class="title">{{ item.courseName }}</span> 
                  <!-- <div class="btn-center btn-trial">试学期</div> -->
                </div>
              </div>
            </section> 
            <section class="bottom-wrapper">
              <div class="unfrozen-wrapper">
                <div class="progress-wrapper">
                  <span class="progress-title">课程进度</span> 
                  <div class="app-progress">
                    <div class="current-progress" :style="'width:'+ item.learningProcess+'%'">
                      <img src="./../assets/section-progress.svg" class="progress-bg"> 
                      <div class="tips">{{ item.learningProcess }}%</div>
                    </div>
                  </div>
                </div> 
                <div class="app-recently-level head-app">
                  <div class="words-wrapper"><div>
                    <span class="title">最近解锁关卡：</span> 
                    <span class="sub-title">{{curlearning ? curlearning.detailName : ''}}</span> 
                  </div>
                </div>
              <div class="btn-center btn-action" @click="handleCode(item, index)">继续闯关</div>
            </div>
            </div>
            </section>
          </div>
        </div>
        <!-- 课程 end -->

        <div class="project-ing" :key="'project' + index">
          <ul>
            <li
              class="menu"
              v-for="(itemChild, childIndex) of item.list"
              :key="childIndex"
            >
              <div class="menu-title" @click="handleShow(itemChild)">
                <span>{{ itemChild.detailName }}</span>
                <i class="iconfont icon-up" v-show="itemChild.show"></i>
                <i class="iconfont icon-down" v-show="!itemChild.show"></i>
              </div>
              <div v-show="itemChild.show">
                <!-- <template v-for="(courseSectionsItem,
                  courseSectionsIndex) of itemChild.courseSections"> -->
                <!-- <p class="child-title" :key="'1-' + courseSectionsIndex">
                    {{ courseSectionsItem.detailName }}
                  </p> -->
                <ul class="child-ul" :key="'2+' + childIndex">
                  <li
                    :class="[
                      (courseContentsIndex > 0 &&
                        itemChild.courseSections[courseContentsIndex - 1] &&
                        itemChild.courseSections[courseContentsIndex - 1]
                          .leaningProcess < 100) ||
                      (item.list[childIndex - 1] &&
                        item.list[childIndex - 1].courseSections.length &&
                        item.list[childIndex - 1].courseSections[
                          item.list[childIndex - 1].courseSections.length - 1
                        ].leaningProcess < 100)
                        ? 'child-menu card-disable'
                        : 'child-menu'
                    ]"
                    v-for="(courseContentsItem,
                    courseContentsIndex) of itemChild.courseSections"
                    :key="courseContentsIndex"
                    @click="
                      handleItem(
                        item,
                        itemChild,
                        courseContentsItem,
                        courseContentsIndex,
                        index,
                        childIndex
                      )
                    "
                  >
                    <img class="icon-finish" src='./../assets/finish.svg' v-if="courseContentsItem.leaningProcess == 100"/>
                    <!-- <template v-if="courseContentsIndex === 0"> -->
                    <img class="sectionBackImage"
                      :src="
                        courseContentsItem.sectionBackImageUrl ||
                          './../assets/file1.png'
                      "
                    />
                    <div>
                      <p class="title">
                        {{ courseContentsItem.detailName }}
                      </p>
                      <p class="desc">
                        {{ courseContentsItem.leaningProcess || 0 }}%
                      </p>
                      <div class="child-ul-progress">
                        <div
                          class="child-ul-progress-done"
                          :style="
                            'width: ' + courseContentsItem.leaningProcess + '%'
                          "
                        ></div>
                      </div>
                    </div>
                    <!-- </template> -->
                    <!-- <template v-else>
                      <img :src="
                          courseContentsItem.sectionBackImageUrl ||
                            './../assets/file.png'
                        " class="file" />
                      <div>
                        <p class="title">
                          {{ courseContentsItem.courseContent }}
                        </p>
                        <p class="desc">必做练习</p>
                      </div>
                      <img src="./../assets/lock1.png" class="lock" />
                    </template> -->
                  </li>
                </ul>
                <!-- </template> -->
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  myBuyProgrammingCourses,
  queryProgrammingCourseLearningProcess
} from "./../api/index";
import { baidu_btn } from '../utils/baidu';

export default {
  name: "Study",
  components: {},
  data () {
    return {
      show: false,
      list: [],
      userName: localStorage.getItem('userName'),
      curlearning: ''
    };
  },
  created () {
    this.getProgram();
  },
  methods: {
    handleShow (item) {
      item.show = !item.show;
      this.$forceUpdate();
    },
    handleDetail (item) {
      this.$router.push({ name: "detail", query: { courseId: item.courseId } });
    },
    async getProgram () {
      const res = await myBuyProgrammingCourses({
        pageSize: 1000,
        pageIndex: 1,
        userId: localStorage.getItem('userId')
      });
      this.show = true;
      if (res) {
        this.list = res || [];
        let list = this.list || [];
        list.map(async item => {
          let result = await queryProgrammingCourseLearningProcess({
            courseId: item.courseId,
            userId: localStorage.getItem('userId')
          });
          this.$set(item, "list", result.courseChapters);
          this.$set(item, "show", true);
          this.$set(item, "courseSummaryJSON", JSON.parse(item.courseSummary));

          //设置最近解锁章节
          let list2 = result.courseChapters;
          let curlist = {}, curlearning = '', learning = [];
          //找到没学完的节
          for (let i = 0; i < list2.length; i++) {
            let courseSections = list2[i].courseSections;
            learning = courseSections.filter(a => a.leaningProcess < 100);
            if (learning.length) {
              curlist = list2[i];
              curlearning = learning[0];
              break;
            }
          }
          this.curlearning = curlearning;
        });
      }
    },
    handleCode (item, index) {
      let list = item.list;
      let curlist = {}, curlearning = '', learning = [];
      //找到没学完的节
      for (let i = 0; i < list.length; i++) {
        let courseSections = list[i].courseSections;
        learning = courseSections.filter(a => a.leaningProcess < 100);
        if (learning.length) {
          curlist = list[i];
          curlearning = learning[0];
          break;
        }
      }
      this.curlearning = curlearning;
      if (!curlearning) {
        this.$message({
          message: '课程已经学完啦！',
          type: 'success'
        });
        return;
      };
      baidu_btn('enter_lesson', curlist.detailOrder + '-' + curlearning.detailOrder, localStorage.getItem('userId'), '');
      this.$router.push({
        name: "code",
        query: {
          courseId: item.courseId,
          chapterId: curlist.chapterId,
          sectionId: curlearning.sectionId,
          detailName: curlearning.detailName,
          detailOrder: curlist.detailOrder
        }
      });
    },
    handleItem (item, itemChild, courseContentsItem, courseContentsIndex, index, childIndex) {
      if ((courseContentsIndex > 0 && itemChild.courseSections[courseContentsIndex - 1].leaningProcess < 100) || (item.list[childIndex - 1] && item.list[childIndex - 1].courseSections.length && item.list[childIndex - 1].courseSections[item.list[childIndex - 1].courseSections.length - 1].leaningProcess < 100)) {
        return;
      }
      baidu_btn('enter_lesson', itemChild.detailOrder + '-' + courseContentsItem.detailOrder, localStorage.getItem('userId'), '');
      this.$router.push({
        name: "code",
        query: {
          courseId: item.courseId,
          chapterId: itemChild.chapterId,
          sectionId: courseContentsItem.sectionId,
          detailName: courseContentsItem.detailName,
          detailOrder: itemChild.detailOrder
        }
      });
    },
    // 开始学习
    handleStudy () {
      this.$router.push({ name: "study" });
    },
    handleBack () {
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("./../styles/variables.scss");
.study {
  background: #f7f5f6;
  .head {
    background: #ffffff;
    .head-top {
      height: 43px;
      line-height: 43px;
      width: 1128px;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.13px;
      color: rgba(49, 40, 93, 0.7);

      .head-logo {
        margin-left: 204px;
        height: 38px;
        width: 38px;
      }
    }
    .head-bottom {
      height: 126px;
      background: #633edc;
      display: flex;
      align-items: center;
      .head-avatar {
        margin-left: 204px;
        height: 48px;
        width: 48px;
      }
      .head-text {
        font-size: 18px;
        color: #ffffff;
        margin-left: 17px;
      }
    }
  }
  .body {
    padding-bottom: 58px;
    background: #f7f4f8;

    .body-title {
      margin-left: 205px;
      font-size: 26px;
    }
    .project-show {
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      margin-bottom: 50px;
      padding-top: 24px;
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      .project-show_container {
        width: 1128px;
        background: #ffffff;
        border-radius: 8px;
        position: relative;
        width: 1128px;
        margin: 0 auto;
        max-height: 321px;
        border-radius: 8px;
        -webkit-box-shadow: 0 2px 10px 0 rgba(56, 35, 219, 0.07);
        box-shadow: 0 2px 10px 0 rgba(56, 35, 219, 0.07);
        background-color: #fff;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

      }
      .sectionBackImage {
        width: 214px;
        height: 171px;
        margin-top: 27px;
        margin-left: 43px;
      }
      .project-center {
        display: inline-block;
        position: absolute;
        margin-top: 59px;
        p {
          font-size: 26px;
          padding-left: 35px;
        }
        ul {
          padding-left: 35px;
          margin-top: 37px;
          li {
            list-style: none;
            font-size: 13px;
            color: #777478;
            padding-bottom: 14px;
          }
        }
      }
      .project-right {
        position: absolute;
        right: 0;
        margin-top: 60px;
        top: 0;
        span {
          color: #6f49e9;
          font-size: 13px;
          margin-left: 59px;
        }
        .progress {
          background-color: #eeeeee;
          border-radius: 7px;
          position: relative;
          margin: 0 10px;
          height: 9px;
          width: 178px;
          margin-top: 13px;
          .progress-done {
            background: linear-gradient(
              90deg,
              rgba(79, 44, 201, 1) 0%,
              rgba(111, 73, 233, 1) 100%
            );
            border-radius: 7px;
            height: 9px;
            width: 0;
            transition: width 1s ease 0.3s;
          }
        }
        button {
          border: none;
          cursor: pointer;
          margin-top: 45px;
          margin-left: 38px;
          width: 142px;
          height: 43px;
          border-radius: 25px;
          font-size: 17px;
          color: #ffffff;
          background-color: #6741ef;
        }
        button:hover {
          background-color: #7d5af8;
        }
        button:active {
          background-color: #6741ef;
        }
      }
    }
    .project-ing {
      display: flex;
      justify-content: center;
      background: #f7f4f8;
      padding-bottom: 30px;
      ul {
        .menu {
          font-size: 18px;
          width: 1128px;
          cursor: pointer;
          margin-bottom: 13px;
          .menu-title {
            height: 64px;
            line-height: 64px;
            background: #e5e4f0;
            padding-left: 35px;
            padding-right: 25px;
            font-size: 18px;
            color: #545253;
            border-radius: 8px 8px 0 0;
            i {
              float: right;
            }
          }
          .child-title {
            background: #ffffff;
            padding-top: 40px;
            padding-bottom: 28px;
            padding-left: 36px;
            color: #545253;
            font-size: 17px;
          }
          .child-ul {
            background: #f1f1f7;
            padding-left: 36px;
            // display: flex;
            padding-bottom: 40px;
            padding-top: 28px;
            border-radius: 0 0 8px 8px;
            .child-menu {
              background: #ffffff;
              margin-bottom: 20px;
              padding-top: 28px;
              flex-shrink: 0;
              width: 550px;
              height: 151px;
              box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              position: relative;
              img {
                width: 113px;
                height: 113px;
                margin-left: 27px;
                border-radius: 8px;
              }
              .icon-finish{
                width: 28px;
                height: 28px;
                position: absolute;
                right: 8px;
                top: 8px;
                z-index: 1;
              }
              div {
                display: inline-block;
                padding-left: 30px;
                position: absolute;
                height: 114px;
                margin-right: 16px;
                p {
                  font-size: 17px;
                  font-weight: bold;
                }
              }
              .desc {
                margin-top: 55px;
                font-size: 12px;
                color: #545253;
              }
              .child-ul-progress {
                background-color: #eeeeee;
                border-radius: 2px;
                position: relative;
                margin: 0 10px;
                height: 9px;
                width: 158px;
                padding-left: 0;
                margin-top: 13px;
                margin-left: 0;
                .child-ul-progress-done {
                  padding-left: 0;
                  background-image: linear-gradient(
                    90deg,
                    #5f61f0 45%,
                    #6ccfff
                  );
                  border-radius: 2px;
                  height: 9px;
                  width: 0;
                  transition: width 1s ease 0.3s;
                }
              }

              // .child-ul-progress {
              //   background-color: #eeeeee;
              //   border-radius: 7px;
              //   position: absolute;
              //   height: 9px;
              //   width: 160px;
              //   margin-top: 13px;
              //   padding-left: 0;
              //   .child-ul-progress-done {
              //     background: linear-gradient(
              //       90deg,
              //       rgba(79, 44, 201, 1) 0%,
              //       rgba(111, 73, 233, 1) 100%
              //     );
              //     border-radius: 7px;
              //     height: 9px;
              //     width: 0;
              //     transition: width 1s ease 0.3s;
              //   }
              // }
              span {
                color: #848484;
                font-size: 17px;
              }
            }
            .card-disable {
              cursor: not-allowed;
            }
            .child-menu2 {
              margin-left: 17px;
              padding-top: 17px;
              flex-shrink: 0;
              width: 280px;
              height: 91px;
              box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              position: relative;
              .file {
                width: 57px;
                height: 57px;
                margin-left: 17px;
              }
              .lock {
                width: 23px;
                position: absolute;
                right: 17px;
                height: 23px;
              }
              div {
                display: inline-block;
                padding-left: 11px;
                position: absolute;
                height: 57px;
                p {
                  font-size: 17px;
                }
              }
              .desc {
                margin-top: 14px;
                font-size: 12px;
                color: #545253;
                display: inline-block;
                width: 58px;
                height: 19px;
                background: rgba(246, 246, 246, 1);
                border-radius: 9px;
                line-height: 19px;
                text-align: center;
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
  }
}
.top-wrapper {
    position: relative;
    min-height: 124px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
            justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    border-radius: 8px 8px 0 0;
    padding-left: 40px;
    background: url(./../assets/section.svg);
    
}
.top-wrapper .left-box .title-wrapper {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
            -ms-flex-align: center;
                align-items: center;
}
.top-wrapper .left-box .title-wrapper .title {
          font-size: 28px;
          font-weight: 600;
          color: #fff;
}
.top-wrapper .left-box .title-wrapper .btn-trial {
          padding: 5px 16px;
          border-radius: 19px;
          background-color: #87d6be;
          font-size: 16px;
          font-weight: 600;
          color: #31285d;
          margin-left: 16px;
}
.top-wrapper .left-box .title-wrapper .btn-trial-over {
          background-color: #fff;
}
.top-wrapper .left-box .pre-wrapper {
        margin-top: 10px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
            -ms-flex-align: center;
                align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        z-index: 4;
        position: relative;
}
.top-wrapper .left-box .pre-wrapper .btn-pre {
          padding: 4px 6px 4px 16px;
          margin-right: 10px;
          border-radius: 14px;
          background-color: rgba(46, 29, 92, .6);
          font-size: 14px;
          font-weight: 600;
          color: #ffcb7c;
          cursor: pointer
}
.top-wrapper .left-box .pre-wrapper .btn-pre:hover {
  background-color: rgba(46, 29, 92, .4);
}
.top-wrapper .right-box {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
          -ms-flex-align: center;
              align-items: center;
}
.top-wrapper .right-box .tag-complete-app {
        width: 118px;
        height: 37px;
        margin-left: 9px;
        padding: 6px 13px 6px 15px;
        border-radius: 100px 0 0 100px;
        background-color: #ffcb7c;
        font-size: 18px;
        font-weight: 600;
        color: #31285d;
}
.unlock-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 124px;
    background-color: rgba(227, 226, 229, .84);
    border-radius: 8px 8px 0 0;
    z-index: 3;
}
.bottom-wrapper {
    border-radius: 0 0 8px 8px;
}
.bottom-wrapper .unfrozen-wrapper {
      margin: 0 40px 32px 40px;
}
.bottom-wrapper .unfrozen-wrapper .progress-wrapper {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
            -ms-flex-direction: column;
                flex-direction: column;
}
.bottom-wrapper .unfrozen-wrapper .progress-wrapper .progress-title {
          margin: 23px 0 10px;
          font-size: 14px;
          color: rgba(27, 18, 67, .5);
}
.bottom-wrapper .unfrozen-wrapper .head-app {
        margin-top: 33px;
}
@media screen and (max-width: 1300px) {
.app-head {
    width: 962px;
}
.top-wrapper {
      height: 107px;
      padding: 37px 32px;
      font-size: 24px;
      padding: 21px 0 16px 32px;
}
.top-wrapper .left-box .title-wrapper .title {
            font-size: 24px;
}
.top-wrapper .left-box .title-wrapper .btn-center {
            height: 28px;
            padding: 0 14px;
            border-radius: 14px;
            font-size: 14px;
}
.top-wrapper .left-box .pre-wrapper {
          font-size: 14px;
}
.top-wrapper .left-box .pre-wrapper .btn-pre {
            padding: 4px 4px 4px 14px;
            font-size: 12px;
            margin-right: 8px;
}
.top-wrapper .right-box img {
          width: 37px;
          height: 44px;
}
.top-wrapper .right-box .tag-complete-app {
          width: 101px;
          height: 32px;
          padding: 5px 8px 5px 13px;
          border-radius: 16px 0 0 16px;
          font-size: 16px;
}
.bottom-wrapper .unfrozen-wrapper .progress-wrapper .progress-title {
          font-size: 12px;
          margin-bottom: 8px;
}
}
.app-progress {
  width: 1048px;
  height: 24px;
  border-radius: 4px;
  background-color: #ededf5;
}
.app-progress .current-progress {
    width: 650px;
    height: 32px;
    border-radius: 4px;
    background-image: -webkit-gradient(linear, left top, right top, color-stop(45%, #5f61f0), to(#6ccfff));
    background-image: -webkit-linear-gradient(left, #5f61f0 45%, #6ccfff);
    background-image: linear-gradient(to right, #5f61f0 45%, #6ccfff);
    margin-top: -4px;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    position: relative;
}
.app-progress .current-progress .progress-bg {
      float: right;
      margin-right: 10px;
      opacity: 0.4;
}
.app-progress .current-progress .tips {
      padding: 5px 8px;
      border-radius: 4px;
      background-color: #ffcb7c;
      position: absolute;
      right: -22px;
      top: -41px;
      font-weight: 600;
      font-size: 14px
}
.app-progress .current-progress .tips::after {
  content: ' ';
  position: absolute;
  left: 50%;
  top: 100%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
  width: 0px;
  height: 0px;
  border-width: 6px;
  border-style: solid;
  border-color: #ffcb7c transparent transparent transparent;
}
@media screen and (max-width: 1300px) {
.app-progress {
    width: 898px;
    height: 21px;
    border-radius: 3px;
}
.app-progress .current-progress {
      margin-top: -3.5px;
      height: 28px;
      border-radius: 3px;
}
}
.app-recently-level .words-wrapper .title {
      font-size: 20px;
      font-weight: 600;
      color: #31285d;
      margin-right: 8px;
}
.app-recently-level .words-wrapper .sub-title {
      margin-right: 8px;
      font-size: 18px;
      color: #1b1243;
      opacity: 0.5;
}
.app-recently-level .btn-action {
    width: 200px;
    height: 48px;
    border-radius: 24px;
    background-color: #6741ef;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    cursor: pointer
}
.app-recently-level .btn-action:hover {
  opacity: 0.9;
}
@media screen and (max-width: 1300px) {
.app-recently-level .words-wrapper .title {
        font-size: 18px;
}
.app-recently-level .words-wrapper .sub-title {
        font-size: 16px;
        margin-right: 6px;
}
.app-recently-level .btn-action {
      width: 172px;
      height: 40px;
      border-radius: 20px;
}
}
.app-recently-level {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
}
.btn-center {
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
}
</style>
