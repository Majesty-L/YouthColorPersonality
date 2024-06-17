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

export const schoolNewTest = (params) => {
  return api.post(`paper/newTest`, params);
};



// 学校获取档案层级信息（全部、全年级、全班级）
export const schoolArchive = (params) => {
  return api.post(`school/archive`, params);
};

// 学校获取学生信息（单个班级）
export const schoolStudentInfo = (params) => {
  // this.dataSource = [
  //     { id: 1, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
  //     { id: 2, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
  //     { id: 3, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
  // ];
  return api.post(`school/studentInfo`, params);
};

// 获取学校信息
export const schoolInfo = (params) => {
  return api.post(`school/info`, params);
};

// -------------性格测试系统学生接口--------------------   

// 学生登陆
export const studentLogin = (params) => {
  return api.post(`student/login`, params);
};

// 单个学生报告
export const studentReport = (params) => {
  // this.baseInfo = { id: 1, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 };
  // this.reportInfos = [
  //   { reportId: 1, reportTime: '2024-06-06', animal: 1, characteristic: [4, 7, -6, 5, 0], personInfo: 'xxxxxx', studyInfo: '学习学习', commuInfo: '沟通沟通', socialInfo: '人际人际' },
  //   { reportId: 2, reportTime: '2023-06-06', animal: 2, characteristic: [-4, -7, 6, 9, 2], personInfo: 'xxxxxx', studyInfo: '学习1学习', commuInfo: '沟通2沟通', socialInfo: '人际人际' },
  // ];
  return api.post(`student/report`, params);
};




// 登录后台
export const getAuth = (params) => {
  return api.post(`admin/login`, params);
};
// 获取所有问卷
export const getPapers = (params) => {
  return api.post(`paper/getAllPapers`, params);
};

export const getPaperAllQuestions = (params) => {
  return api.post(`paper/getPaperAllQuestions`, params);
};

export const getAllOneQuesOptions = (params) => {
  return api.post(`options/getAllOneQuesOptions`, params);
};

export const getChartData = (params) => {
  return api.post(`answer/chartData`, params);
};

export const uploadImg = (params) => {
  return api.post(`admin/upload`, params);
};
// 用户提交问卷
export const userCommit = (params) => {
  return api.post(`user/userCommit`, params);
};
// 新建问卷
export const addPaper = (params) => {
  return api.post(`paper/addPaper`, params);
};
// 编辑问卷
export const updatePaper = (params) => {
  return api.post(`paper/updatePaper`, params);
};
// 启用/停用问题
export const releasePaper = (params) => {
  return api.post(`paper/releasePaper`, params);
};
// 删除问题
export const deletePaper = (params) => {
  return api.post(`paper/deletePaper`, params);
};
// 新建问题
export const addQuestion = (params) => {
  return api.post(`question/addQuestion`, params);
};
// 批量新建问题
export const addQuestions = (params) => {
  return api.post(`question/addQuestions`, params);
};
// 编辑问题
export const updateQuestion = (params) => {
  return api.post(`question/updateQuestion`, params);
};
// 批量编辑问题
export const updateQuestions = (params) => {
  return api.post(`question/updateQuestions`, params);
};
// 删除问题
export const deleteQuestion = (params) => {
  return api.post(`question/deleteQuestion`, params);
};
// 批量删除问题
export const deleteQuestions = (params) => {
  return api.post(`question/deleteQuestions`, params);
};

export const test = (params) => {
  return api.get(`color/getAllColor`, params);
};
// 获取所有结果
export const selectedChartData = (params) => {
  return api.post(`answer/selectedChartData`, params);
};

// 获取用户名
export const getUsers = (params) => {
  return api.post(`admin/getUsers`, params);
};
