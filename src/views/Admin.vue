<template>
  <div class="admin-content">
    <div class="admin-logo-cont">
      <!-- <img src="./../assets/logo.png" alt="" class="admin-logo-img" /> -->
      <img src="./../assets/icon-logo.png" class="admin-logo-img" v-cloak />
    </div>
    <div class="admin-middle-content">
      <div class="admin-middle-content-title">
        课程管理
        <div class="admin-middle-content-btn" @click="handleAddCourse">
          新建课程
        </div>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="admin-item-name" @click="handleShowItem(item)">
          {{ item.courseName }}
          <span class="admin-item-clear" @click.stop="handleDelCourse(item)"
            >删除</span
          >
          <span
            class="admin-item-clear"
            style="margin-right: 10px;"
            @click.stop="handleAddChapter(item)"
            >新建章</span
          >
          <span
            class="admin-item-clear"
            style="margin-right: 10px;"
            @click.stop="handleEditCourse(item)"
            >编辑</span
          >
        </div>
        <div class="admin-tree" v-show="item.show">
          <div
            v-for="(chaptersItem, chaptersIndex) in item.courseChaptersList"
            :key="chaptersIndex"
            style="margin-top:10px;"
          >
            <span
              class="node-text"
              @click.stop.prevent="hanldeSectionShow(chaptersIndex, index)"
              @mouseover="handleChapterMask(chaptersIndex, index)"
              @mouseout="handleChapterMask2(chaptersIndex, index)"
            >
              {{ chaptersItem.detailOrder }}.{{ chaptersItem.detailName }}
              <span
                v-show="chaptersItem.clearShow"
                @click.stop="hanldeAddSection(item, chaptersItem)"
                class="admin-name-add-btn"
                style="margin-left:30px;"
                >新建节</span
              >
              <span
                v-show="chaptersItem.clearShow"
                @click.stop="hanldeEditChapter(item, chaptersItem)"
                class="admin-name-add-btn"
                >编辑</span
              >
              <span
                v-show="chaptersItem.clearShow"
                @click.stop="hanldeDelChapter(item, chaptersItem)"
                class="admin-name-add-btn"
                >删除</span
              >
            </span>
            <ul v-show="!chaptersItem.ishow" class="admin-item-ul">
              <li
                v-for="(sectionItem,
                sectionsIndex) in chaptersItem.courseSections"
                :key="sectionsIndex"
                @mouseover="
                  hanldeSectionsMask(chaptersIndex, index, sectionsIndex)
                "
                @mouseout="
                  hanldeSectionsMask2(chaptersIndex, index, sectionsIndex)
                "
              >
                {{ sectionItem.detailOrder }}.{{ sectionItem.detailName }}
                <span
                  v-show="
                    sectionItem.sectionShow && sectionItem.sectionContentUrl
                  "
                  @click.stop="hanldePreview(sectionItem)"
                  style="margin-left:30px;"
                  class="admin-name-add-btn"
                  >预览</span
                >
                <span
                  v-show="sectionItem.sectionShow"
                  @click.stop="
                    handleEditSection(item, chaptersItem, sectionItem)
                  "
                  style="margin-left:10px;"
                  class="admin-name-add-btn"
                  >编辑</span
                >
                <span
                  v-show="sectionItem.sectionShow"
                  @click.stop="
                    hanldeDelSection(item, chaptersItem, sectionItem)
                  "
                  class="admin-name-add-btn"
                  >删除</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建课程 -->
    <el-dialog
      :title="!isEditCourse ? '新建课程' : '编辑课程'"
      :visible.sync="dialogCourseForm"
      width="30%"
      :show-close="false"
    >
      <el-form :model="courseForm" ref="courseForm">
        <el-form-item label="课程名称" label-width="80px">
          <el-input
            v-model="courseForm.courseName"
            autocomplete="off"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="简要概述" label-width="80px">
          <el-input
            v-model="courseForm.courseSummary"
            autocomplete="off"
            placeholder='格式：["描述1","描述2"]'
          ></el-input>
        </el-form-item>
        <el-form-item label="课程图片" label-width="80px">
          <el-upload
            class="avatar-uploader"
            :action="url + 'uploadImage'"
            :show-file-list="false"
            :on-success="handleCourseUploadSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="courseForm.courseImage"
              :src="courseForm.courseImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCourseForm = false">取 消</el-button>
        <el-button type="primary" @click="hanldeSaveCourse">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建章-->
    <el-dialog
      :title="!isEditChapter ? '新建章' : '编辑章'"
      :visible.sync="dialogChapterForm"
      width="30%"
      :show-close="false"
    >
      <el-form :model="chapterForm" ref="chapterForm">
        <el-form-item label="序号" label-width="80px">
          <el-input
            v-model="chapterForm.detailOrder"
            autocomplete="off"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="80px">
          <el-input
            v-model="chapterForm.detailName"
            autocomplete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input
            v-model="chapterForm.remark"
            autocomplete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterForm = false">取 消</el-button>
        <el-button type="primary" @click="hanldeSaveChapter">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建节-->
    <el-dialog
      :title="!isEditSection ? '新建节' : '编辑节'"
      :visible.sync="dialogSectionForm"
      width="30%"
      :show-close="false"
    >
      <el-form
        :model="sectionForm"
        ref="sectionForm"
        enctype="multipart/form-data"
      >
        <el-form-item label="序号" label-width="80px">
          <el-input
            v-model="sectionForm.detailOrder"
            autocomplete="off"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="80px">
          <el-input
            v-model="sectionForm.detailName"
            autocomplete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input
            v-model="sectionForm.remark"
            autocomplete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="80px">
          <el-upload
            class="avatar-uploader"
            :action="url + 'uploadImage'"
            :show-file-list="false"
            :on-success="handleSectionUploadSuccess"
            :before-upload="beforeSectionUpload"
          >
            <img
              v-if="sectionForm.sectionBackgroundImage"
              :src="sectionForm.sectionBackgroundImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件" label-width="80px">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            ref="upload"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :on-change="handleChange"
          >
            <el-button size="small" type="primary" @click="handleUp"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <!-- <el-form-item
          label=""
          label-width="80px"
          v-if="sectionForm.sectionContentUrl"
        >
          <el-button
            size="small"
            type="primary"
            @click="hanldePreview(sectionForm)"
            >预览</el-button
          >
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSectionForm = false">取 消</el-button>
        <el-button type="primary" @click="hanldeSaveSection('sectionForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <div class="upload-qrCode">
      <el-upload
        class="qrCode-uploader"
        :action="url + 'uploadImage'"
        :show-file-list="false"
        :on-success="handleAdminUploadSuccess"
        :before-upload="beforeAdminUpload"
      >
        <img v-if="adminImg" :src="adminImg" class="qrCode" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getAllProgrammingCourse,
  createProgrammingCourseDetailWithSection,
  getProgrammingCourseById,
  createProgrammingCourseDetailWithChapter,
  createProgrammingCourse,
  updateProgrammingCourse,
  deleteProgrammingCourse,
  upload,
  deleteProgrammingCourseDetailWithChapter,
  updateProgrammingCourseDetailWithChapter,
  updateProgrammingCourseDetailWithSection,
  deleteProgrammingCourseDetailWithSection,
  download,
  getProgrammingAdmin,
  updateProgrammingAdmin,
  createProgrammingAdmin
} from "./../api/index";
import marked from "marked";
export default {
  name: "tree",
  data () {
    return {
      list: [],
      adminImg: '',
      url: process.env.VUE_APP_BASE_URL + '/',
      dialogCourseForm: false, //
      fileList: [],
      courseForm: {
        "courseImage": "",
        "courseName": "",
        "coursePrice": 0,
        "courseSummary": "",
        "courseType": 0
      },
      dialogChapterForm: false,
      chapterForm: {
        "detailName": "",
        "detailOrder": 0,
        "remark": "",
      },
      isEditCourse: false,
      isEditChapter: false,
      dialogSectionForm: false,
      sectionForm: {
        detailName: "",
        detailOrder: 0,
        remark: "",
        sectionContentUrl: '',
        sectionBackgroundImage: '',
        sectionContentTotals: ''
      },
      isEditSection: false,
      contentDataList: [],
      treeList: [],
      isEdit: false
    };
  },
  async created () {
    this.getAllProgrammingCourseList();
    const res = await getProgrammingAdmin({
      type: -1
    })
    if (res.adminImageUrl) {
      this.isEdit = true
      this.adminImg = res.adminImageUrl
    } else {
      this.isEdit = false
    }
  },
  methods: {
    //查询课程
    async getAllProgrammingCourseList () {
      const res = await getAllProgrammingCourse({
        pageIndex: 1,
        pageSize: 1000
      });
      if (res) {
        this.list = res || [];
        this.list.map(async item => {
          let result = await getProgrammingCourseById({
            courseId: item.courseId
          });
          this.$set(item, "courseChaptersList", result.courseChapters);
          this.$set(item, "show", true);
          result.courseChapters.map(chaptersItem => {
            this.$set(chaptersItem, "ishow", false);
            this.$set(chaptersItem, "clearShow", false);
            chaptersItem.courseSections.map(sectionItem => {
              this.$set(sectionItem, "sectionShow", false);
            });
          });
        });
      }
    },
    // 课程展示
    handleShowItem (item) {
      item.show = !item.show;
      this.$forceUpdate();
    },
    // 新建课程
    handleAddCourse () {
      this.dialogCourseForm = true
      this.courseForm = {
        "courseImage": "",
        "courseName": "",
        "coursePrice": 0,
        "courseSummary": "",
        "courseType": 0
      }
    },
    // 新建章
    handleAddChapter (item) {
      this.isEditChapter = false
      this.dialogChapterForm = true
      this.chapterForm = {
        "detailName": "",
        "detailOrder": 0,
        "remark": "",
      }
      this.chapterForm.courseId = item.courseId
    },
    // 新建节
    hanldeAddSection (item, chaptersItem) {
      this.isEditSection = false
      this.dialogSectionForm = true
      this.sectionForm = {
        detailName: "",
        detailOrder: 0,
        remark: "",
        sectionContentUrl: '',
        sectionBackgroundImage: '',
        sectionContentTotals: ''
      }
      this.fileList = []
      this.sectionForm.courseId = item.courseId
      this.sectionForm.chapterId = chaptersItem.chapterId
    },
    // 删除课程
    handleDelCourse (item) {
      if (item.courseChaptersList && item.courseChaptersList.length > 0) {
        this.$message({
          message: '只能删除不含章节的课程',
          type: 'warning'
        });
      } else {
        this.$confirm('确定删除该课程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteProgrammingCourse({ courseId: item.courseId })
          this.getAllProgrammingCourseList()
        })
      }
    },
    // 删除章
    hanldeDelChapter (item, chapterItem) {
      if (chapterItem.courseSections && chapterItem.courseSections.length > 0) {
        this.$message({
          message: '只能删除不含节的章',
          type: 'warning'
        });
      } else {
        this.$confirm('确定删除该章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteProgrammingCourseDetailWithChapter({ chapterId: chapterItem.chapterId, courseId: item.courseId })
          this.getAllProgrammingCourseList()
        })
      }
    },
    // 删除节
    hanldeDelSection (item, chapterItem, sectionItem) {
      this.$confirm('确定删除该节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteProgrammingCourseDetailWithSection({ chapterId: chapterItem.chapterId, courseId: item.courseId, sectionId: sectionItem.sectionId })
        this.getAllProgrammingCourseList()
      })
    },
    handleEditCourse (item) {
      this.isEditCourse = true
      this.dialogCourseForm = true
      this.courseForm = {
        courseImage: item.courseImage,
        courseName: item.courseName,
        coursePrice: item.coursePrice || 0,
        courseSummary: item.courseSummary,
        courseType: item.courseType || 0,
      }
      this.courseForm.courseId = item.courseId;
    },
    // 编辑章
    hanldeEditChapter (item, chapterItem) {
      this.isEditChapter = true
      this.dialogChapterForm = true
      this.chapterForm = {
        detailOrder: chapterItem.detailOrder,
        detailName: chapterItem.detailName,
        remark: chapterItem.remark,
        chapterId: chapterItem.chapterId
      }
      this.chapterForm.courseId = item.courseId
    },
    // 编辑节
    handleEditSection (item, chaptersItem, sectionItem) {
      this.isEditSection = true
      this.dialogSectionForm = true
      this.sectionForm = JSON.parse(JSON.stringify(sectionItem))
      this.sectionForm.sectionBackgroundImage = sectionItem.sectionBackImageUrl
      this.fileList = []
      this.sectionForm.courseId = item.courseId
      this.sectionForm.chapterId = chaptersItem.chapterId
    },
    // 保存课程
    async hanldeSaveCourse (formName) {
      if (!this.courseForm.courseName || !this.courseForm.courseSummary || !this.courseForm.courseImage) {
        this.$message.warning(`请完善课程信息`);
        return false
      }
      if (this.courseForm.courseId) {
        await updateProgrammingCourse(this.courseForm);
      } else {
        await createProgrammingCourse(this.courseForm);
      }
      this.dialogCourseForm = false
      this.getAllProgrammingCourseList()
    },
    // 保存章
    async hanldeSaveChapter (formName) {
      if (!this.chapterForm.detailName || !this.chapterForm.detailOrder || !this.chapterForm.remark) {
        this.$message.warning(`请完善章信息`);
        return false
      }
      this.chapterForm.sectionBackgroundImage = ''
      this.chapterForm.sectionContentTotals = 0
      this.chapterForm.sectionContentUrl = ''
      let res = {}
      if (this.chapterForm.chapterId) {
        res = await updateProgrammingCourseDetailWithChapter(this.chapterForm)
      } else {
        res = await createProgrammingCourseDetailWithChapter(this.chapterForm)
      }
      if (res.returnCode === '6007') {
        this.$message({
          message: res.returnMessage,
          type: 'warning'
        });
        return false
      }
      this.dialogChapterForm = false
      this.getAllProgrammingCourseList()

    },
    handleUp () {
      // this.$refs.upload.clearFiles();
    },
    // 保存节
    async hanldeSaveSection (formName) {
      console.log(this.fileList)
      let upfileList = this.fileList;
      if (upfileList.filter(a => a.url).length) {
        this.saveSection();
        return;
      }
      if (upfileList.length) {
        const formData = new FormData();
        upfileList.forEach((file) => {
          formData.append('file', file.raw);
        });

        const successFn = (response) => {
          var data = eval('(' + xhr.responseText + ')');
          if (data.data) {
            this.sectionForm.sectionContentUrl = data.data;
            this.saveSection();
          } else {
            this.$message.warning(data.returnMessage);
          }
        }
        const errorFn = (response) => {
          this.$message.warning('上传失败!');
        }

        let uploadUrl = `${this.url}upload`;
        const xhr = new XMLHttpRequest
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)
        xhr.open('POST', uploadUrl, true)
        //xhr.responseType
        xhr.send(formData);

      } else {
        this.$message.warning(`请选择文件`);
        return;
      }

    },
    async saveSection () {
      if (!this.sectionForm.detailOrder || !this.sectionForm.detailName || !this.sectionForm.remark || !this.sectionForm.sectionBackgroundImage || !this.sectionForm.sectionContentUrl) {
        this.$message.warning(`请完善节信息`);
        return false
      }
      const content = await download({ filePath: this.sectionForm.sectionContentUrl });
      this.initMarkdown(marked(content));
      let res = {}
      this.sectionForm.sectionContentTotals = this.contentDataList.length || 0
      if (this.sectionForm.sectionId) {
        res = await updateProgrammingCourseDetailWithSection(this.sectionForm)
      } else {
        res = await createProgrammingCourseDetailWithSection(this.sectionForm)
      }
      if (res.returnCode === '6007') {
        this.$message({
          message: res.returnMessage,
          type: 'warning'
        });
        return false
      }
      this.dialogSectionForm = false
      this.getAllProgrammingCourseList()
    },
    // 节展示
    hanldeSectionShow (ind, index) {
      //点击展示隐藏
      this.list[index].courseChaptersList[ind].ishow = !this.list[index]
        .courseChaptersList[ind].ishow;
    },
    // 章展示
    handleChapterMask (zindex, index) {
      this.list[index].courseChaptersList[zindex].clearShow = true;
    },
    // 章展示
    handleChapterMask2 (zindex, index) {
      this.list[index].courseChaptersList[zindex].clearShow = false;
    },
    // 节展示
    hanldeSectionsMask (zindex, index, jieIndex) {
      this.list[index].courseChaptersList[zindex].courseSections[
        jieIndex
      ].sectionShow = true;
    },
    // 节展示
    hanldeSectionsMask2 (zindex, index, jieIndex) {
      this.list[index].courseChaptersList[zindex].courseSections[
        jieIndex
      ].sectionShow = false;
    },
    // 课程图片
    handleCourseUploadSuccess (res, file) {
      this.courseForm.courseImage = res.data
      this.$forceUpdate()
    },
    // 图片检查
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    // 节图片
    beforeSectionUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    // 节图片
    beforeSectionFileUpload (file) {
      return true;
    },
    // 节图片
    handleSectionUploadSuccess (res, file) {
      this.sectionForm.sectionBackgroundImage = res.data
      this.$forceUpdate()
    },
    // 节文件
    handleSectionUploadFileSuccess (res, file) {
      this.sectionForm.sectionContentUrl = res.data
    },
    // 管理源图片
    async handleAdminUploadSuccess (res, file) {
      this.adminImg = res.data
      if (this.isEdit) {
        await updateProgrammingAdmin({
          adminImageUrl: this.adminImg,
          type: -1
        })
      } else {
        await createProgrammingAdmin({
          adminImageUrl: this.adminImg,
          type: -1
        })
      }

    },
    beforeAdminUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    // 预览
    hanldePreview (sectionForm) {
      let host = window.location.host;
      window.open(`//${host}/#/code?url=${sectionForm.sectionContentUrl}`, "_blank");
    },
    handleRemove (file, fileList) {
      this.fileList = fileList;
      this.sectionForm.sectionContentUrl = ''
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`只能上传1个文件`);
    },
    handleChange (file, fileList) {
      this.fileList = fileList;
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 解析
    initMarkdown (content) {
      let div = document.createElement("div");
      div.innerHTML = content;
      let menuList = [];
      let contentList = [];
      let avatarList = [];
      if (div.children.length !== 0) {
        for (let i = 0; i < div.children.length; i++) {
          let child = div.children[i];
          let tagName = child.tagName.toUpperCase();
          switch (tagName) {
            case "H1":
              menuList.push({ type: 'h1', content: child.innerHTML });
              contentList.push({ type: 'h1', name: 'h1' + i, content: child.innerHTML });
              break;
            case "H2":
              menuList.push({ type: 'h2', content: child.innerHTML });
              contentList.push({ type: 'h2', name: 'h2' + i, content: child.innerHTML });
              break;
            case "PRE":
              contentList.push({
                type: "code",
                content: child.innerHTML
              });
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

            default:
              break;
          }
        }
      }

      this.contentDataList = JSON.parse(JSON.stringify(contentList))
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
        if (item !== 'title') {
          resultList.push(tmpObj[item]);
        }
      });
      return {
        result: tmpObj["title"].desc,
        title: tmpObj["title"].text,
        list: resultList
      };
    },
  }
};
</script>
<style lang="scss" scoped>
@import url("./../styles/variables.scss");

.upload-qrCode {
  position: fixed;
  right: 0;
  top: 48%;
}
.qrCode-uploader {
  width: 120px !important;
  height: 120px !important;
  // line-height: 120px !important;
}

.qrCode {
  width: 120px !important;
  height: 120px !important;
}

.qrCode-uploader ::deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.qrCode-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader ::deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.admin-content {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 30px;
  background: #f7f4f8;
  .allTitle {
    position: fixed;
    top: 45%;
    left: 45%;
    height: 40px;
    width: 150px;
    background: #48469b;
    color: #fff;
    text-align: center;
    line-height: 40px;
    z-index: 999;
  }
  .model-img-shang {
    display: block;
    width: 150px;
    height: 150px;
    margin-left: 80px;
  }
  .model-cont {
    border-radius: 4px;
    width: 494px;
    // height: 390px;
    position: fixed;
    top: 17%;
    left: 30%;
    background: #ffffff;
    z-index: 99;
    opacity: 1;
    overflow: hidden;
    .sizeInput {
      width: 211px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(222, 225, 231, 1);
      font-size: 14px;
      padding-left: 5px;
    }
    .bigInput {
      width: 211px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(222, 225, 231, 1);
      font-size: 14px;
      padding-left: 5px;
    }
    .chuanBtn {
      display: inline-block;
      width: 90px;
      height: 30px;
      border: 1px solid #413ed9;
      box-sizing: border-box;
      text-align: center;
      line-height: 30px;
      vertical-align: middle;
      font-size: 13px;
      color: #413ed9;
      cursor: pointer;
      border-radius: 3px;
      color: #413ed9;
    }
    .model-ul {
      display: block;
      padding-left: 40px;
      li {
        display: block;
        height: 40px;
        margin-top: 15px;
        span {
          margin-right: 20px;
          color: #71757b;
          font-size: 14px;
        }
        .chuanBtn {
          margin-right: 30px;
        }
      }
    }
    .model-div-content {
      width: 100%;
      // height: 250px;
    }
    .model-btn-cont {
      height: 70px;
      text-align: right;
      box-sizing: border-box;
      padding-top: 15px;
    }
    .model-btn {
      width: 73px;
      background: rgba(217, 225, 222, 1);
      display: inline-block;
      width: 73px;
      height: 34px;
      border-radius: 3px;
      line-height: 34px;
      text-align: center;
      background: #eeeeee;
      cursor: pointer;
      margin-right: 10px;
      color: #ffffff;
      font-size: 14px;
    }
    .model-btns {
      border-radius: 3px;
      background: linear-gradient(
        180deg,
        rgba(79, 44, 201, 1) 0%,
        rgba(111, 73, 233, 1) 100%
      );
      color: #fff;
    }
    .clear {
      display: block;
      float: right;
      font-size: 24px;
      line-height: 45px;
      margin-right: 15px;
      cursor: pointer;
      text-align: left;
      color: #666666;
    }
  }
  .model-conts {
    height: 150px;
    .cleartitle {
      height: 50px;
      line-height: 50px;
      padding: 13px 30px;
    }
  }
  .model-title {
    color: #333333;
    font-size: 16px;
    height: 50px;
    background: #fff;
    width: 100%;
    line-height: 50px;
    box-sizing: border-box;
    padding-left: 25px;
    border-bottom: 1px solid #dee1e7;
  }
  .model-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000;
    opacity: 0.6;
  }
  .admin-logo-cont {
    width: 100%;
    height: 60px;
    background: #2c196f;
    color: #969696;
    font-size: 16px;
    line-height: 50px;
    .admin-logo-img {
      display: inline-block;
      margin-left: 14px;
      // margin-top: 5px;
      vertical-align: top;
      margin-left: 204px;
      height: 60px;
      width: 140px;
    }
  }
  .admin-middle-content {
    width: 800px;
    margin: 0 auto;
    margin-top: 50px;
    height: calc(100% - 50px);
    overflow: visible;
    .admin-middle-content-title {
      width: 100%;
      font-size: 24px;
      line-height: 34px;
      color: #000000;
    }
    .admin-middle-content-btn {
      width: 95px;
      text-align: center;
      float: right;
      height: 34px;
      color: #413ed9;
      border: 1px solid #413ed9;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 34px;
      cursor: pointer;
      border-radius: 3px;
    }
  }
  .admin-item-name {
    width: 800px;
    height: 50px;
    background: #e9e9ec;
    font-size: 18px;
    color: #16141f;
    line-height: 50px;
    margin: 20px 0;
    box-sizing: border-box;
    padding: 0 20px;
    cursor: pointer;
    user-select: none;
    .admin-item-clear {
      display: inline-block;
      font-size: 14px;
      line-height: 50px;
      color: #675c5c;
      float: right;
      cursor: pointer;
    }
  }
  .admin-item-addbtn {
    width: 95px;
    height: 34px;
    border: 1px solid #16141f;
    box-sizing: border-box;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    margin-left: 40px;
  }
  .admin-tree {
    margin: 20px 0;
    font-size: 14px;
    cursor: pointer;
    margin-left: 40px;
  }
  .add-img {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 10px;
    vertical-align: top;
    cursor: pointer;
  }
  .admin-item-ul {
    display: block;
    margin-top: 10px;
    padding-left: 50px;
    color: #777478;
    line-height: 30px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
  }
  .admin-name-add-btn {
    color: #413ed9;
    font-size: 14px;
    margin-left: 15px;
  }
  .node-text {
    font-size: 17px;
    color: #777478;
    user-select: none;
  }
}

.file {
  width: 95px;
  text-align: center;
  /* float: right; */
  height: 34px;
  color: #413ed9;
  border: 1px solid #413ed9;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 34px;
  cursor: pointer;
  border-radius: 3px;
  position: relative;
  display: inline-block;
  /* background: #d0eeff; */
  /* border: 1px solid #99d3f5; */
  /* border-radius: 4px; */
  /* padding: 4px 12px; */
  /* overflow: hidden; */
  /* color: #1e88c7; */
  text-decoration: none;
  text-indent: 0;
  cursor: pointer;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
</style>
