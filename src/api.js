import axios from 'axios';

const api = axios.create({
  baseURL: '/api/'
});
const status_OK = [ 20011, 20021, 20031, 20041 ];
// const status_ERROR = [ 20010, 20020, 20030, 20040 ];
// 响应拦截器
api.interceptors.response.use(
  response => {
    const res = response.data;
    if (status_OK.includes(res.code)) {
      return res.data;
    }
    return Promise.reject(res.msg || res.message);
  },
  error => {
    return Promise.reject(error);
  },
);


// -------------性格测试系统学校接口--------------------   

// 学校注册
export const schoolRegister = (params) => {
  return api.post(`school/register`, params);
};

// 学校登陆
export const schoolLogin = (params) => {
  return api.post(`school/login`, params);
};

// 学校上传学生信息
export const schoolUpload = (params) => {
  return api.post(`school/upload`, params);
};

// 学校新建一个测试
export const schoolNewTest = (params) => {
  return api.post(`paper/newTest`, params);
};

// 获取学生信息（by schoolId gradeId classId studentId）
export const schoolStudentInfo = (params) => {
  return api.post(`school/studentInfo`, params);
};

// 学校更新学生知情情况
export const schoolUploadKnown = (params) => {
  return api.post(`school/uploadKnown`, params);
};

// 学校获取问卷信息
export const schoolGetPapers = (params) => {
  return api.post(`paper/getPapers`, params);
};

// 学校发布/结束测试
export const schoolPublishPaper = (params) => {
  return api.post(`paper/publish`, params);
};

// 获取学校信息
export const schoolInfo = (params) => {
  return api.post(`school/schoolInfo`, params);
};

// 修改学生档案信息
export const modifyStudentInfo = (params) => {
  return api.post(`school/modifyStudentInfo`, params);
};

// 修改学校信息
export const modifySchoolInfo = (params) => {
  return api.post(`school/modifySchoolInfo`, params);
};

// 学校获取年度报告
export const getPaperReport = (params) => {
  return api.post(`paper/report`, params);
};

// 学校获取未完成学生名单
export const getUnfinishedStudent = (params) => {
  return api.post(`paper/unfinishedStudent`, params);
};

// -------------性格测试系统学生接口--------------------   

// 学生登陆
export const studentLogin = (params) => {
  return api.post(`student/login`, params);
};

// 学生提交问卷
export const studentCommit = (params) => {
  return api.post(`student/commit`, params);
};

// 单个学生报告
export const studentReport = (params) => {
  return api.post(`answer/report`, params);
};

// -------------性格测试系统个人接口--------------------   

// 个人提交测试
export const personCommit = (params) => {
  return api.post(`person/commit`, params);
};

// 查询个人信息
export const personInfo = (params) => {
  return api.post(`person/info`, params);
};

// 更新个人信息
export const updatePersonInfo = (params) => {
  return api.post(`person/updateInfo`, params);
};

// 获取未使用订单
export const personPay = (params) => {
  return api.post(`person/getPayList`, params);
};

// 获取测试报告
export const personReport = (params) => {
  return api.post(`person/report`, params);
};

// 个人登录
export const validateLogin = (params) => {
  return api.post(`person/login`, params);
};

// 评论反馈
export const callbackRate = (params) => {
  return api.post(`callback/emitCallBack`, params);
};

// 获取评论反馈
export const getCallback = (params) => {
  return api.post(`callback/getCallBack`, params);
};

// ------------------ 微信登录 --------------------------
export const webGetUrl = () => {
  return api.get(`wxlogin/webGetUrl`);
};
export const getPersonId = (params) => {
  return api.post(`wxlogin/callback`, params);
};

// ------------------ 微信支付 --------------------------
export const createOrder = (params) => {
  return api.post(`wxpay/createOrder`, params);
};

// ------------------ 手机验证码登录 --------------------------
export const getVerificationCode = (params) => {
  return api.post(`person/getVerificationCode`, params);
};