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

/**  提交测试关联内容
*   1、在个人测试结果表上记录
*   2、在支付记录表上记录已消费
*   3、
*/

// 查询个人信息
export const personInfo = (params) => {
  return api.post(`person/getInfo`, params);
};

// 获取未使用订单
export const personPay = (params) => {
  return api.post(`person/getPayList`, params);
};