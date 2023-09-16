import axios from 'axios';

const api = axios.create({
  baseURL: '/api/'
});
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
// 新建问题
export const addQuestion = (params) => {
  return api.post(`question/addQuestion`, params);
};
// 编辑问题
export const updateQuestion = (params) => {
  return api.post(`question/updateQuestion`, params);
};

export const test = (params) => {
  return api.get(`color/getAllColor`, params);
};
