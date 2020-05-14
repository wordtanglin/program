import { post, get } from "./../utils/http";

let getAllProgrammingCourse = data =>
  post("/programmingCourse/getAllProgrammingCourses", data);

// 创建管理员图片
let createProgrammingAdmin = data =>
  post("/programmingUser/createProgrammingAdmin", data);

// 编辑管理员图片
let updateProgrammingAdmin = data =>
  post("/programmingUser/updateProgrammingAdmin", data);

let getProgrammingCourseById = data =>
  get("/programmingCourse/getProgrammingCourseById", data);

// 获取系统管理员
let getProgrammingAdmin = data =>
  get("/programmingUser/getProgrammingAdmin", data);

// 登录
let login = data => post("/programmingUser/login", data);

// 注册
let register = data => post("/programmingUser/registeredProgrammingUser", data);

// 文件下载
let download = data => get("/download", data);

// 我购买的课程
let myBuyProgrammingCourses = data =>
  post("/programmingBuyCourse/myBuyProgrammingCourses", data);

// 学习进度
let queryProgrammingCourseLearningProcess = data =>
  post("/programmingBuyCourse/queryProgrammingCourseLearningProcess", data);

let getProgrammingCourseContentTitlesByContentId = data =>
  get(
    "/programmingCourseContent/getProgrammingCourseContentTitlesByContentId",
    data
  );
let getProgrammingCourseDetailWithSectionId = data =>
  get("/programmingCourse/getProgrammingCourseDetailWithSectionId", data);

// 发布课程
let createProgrammingCourse = data =>
  post("/programmingCourse/createProgrammingCourse", data);
// 修改课程
let updateProgrammingCourse = data =>
  post("/programmingCourse/updateProgrammingCourse", data);
let upload = data => post("/upload", data);
// 创建章
let createProgrammingCourseDetailWithChapter = data =>
  post("/programmingCourse/createProgrammingCourseDetailWithChapter", data);

let deleteProgrammingCourse = data =>
  get("/programmingCourse/deleteProgrammingCourse", data);
// 删除章
let deleteProgrammingCourseDetailWithChapter = data =>
  get("/programmingCourse/deleteProgrammingCourseDetailWithChapter", data);
// 编辑章
let updateProgrammingCourseDetailWithChapter = data =>
  post("/programmingCourse/updateProgrammingCourseDetailWithChapter", data);
// 创节
let createProgrammingCourseDetailWithSection = data =>
  post("/programmingCourse/createProgrammingCourseDetailWithSection", data);
// 修改节
let updateProgrammingCourseDetailWithSection = data =>
  post("/programmingCourse/updateProgrammingCourseDetailWithSection", data);
// 删除节
let deleteProgrammingCourseDetailWithSection = data =>
  get("/programmingCourse/deleteProgrammingCourseDetailWithSection", data);
//保存学习进度
let saveProgrammingLearnInfo = data =>
  post("/programmingLearn/saveProgrammingLearnInfo", data);
////接口埋点保存日志
let saveProgrammingLog = data =>
  post("/programmingLog/saveProgrammingLog", data);
// 发送验证码
let sendSms = data => get("/programmingUser/sendSms", data);

export {
  getAllProgrammingCourse,
  getProgrammingCourseById,
  myBuyProgrammingCourses,
  queryProgrammingCourseLearningProcess,
  getProgrammingCourseContentTitlesByContentId,
  createProgrammingCourse,
  updateProgrammingCourse,
  upload,
  createProgrammingCourseDetailWithChapter,
  deleteProgrammingCourse,
  deleteProgrammingCourseDetailWithChapter,
  updateProgrammingCourseDetailWithChapter,
  createProgrammingCourseDetailWithSection,
  updateProgrammingCourseDetailWithSection,
  deleteProgrammingCourseDetailWithSection,
  getProgrammingCourseDetailWithSectionId,
  saveProgrammingLearnInfo,
  saveProgrammingLog,
  download,
  login,
  register,
  createProgrammingAdmin,
  getProgrammingAdmin,
  updateProgrammingAdmin,
  sendSms
};
