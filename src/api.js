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