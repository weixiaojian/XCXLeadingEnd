// import Vue from 'vue';
import $momm from '../allMethods/momm.js';
import {baseUrl} from '../url/index.js'
export default {
	//初始数据配置
	config: {
		baseUrl: baseUrl,
		header: {},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		name:"file",
		formData: {},
		filePath: "",
		isShow:false, //是否显示请求toast
		// isToken: true, //是否添加token
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	//请求响应内容 : 返回 new Promise
	request(options) {
		// console.log(options)
		let self = this;
		if (!options) {
			options = {}
		};
		options.baseUrl = options.baseUrl || this.config.baseUrl; //请求的ip
		options.dataType = options.dataType || this.config.dataType; //请求数据类型
		options.url = options.baseUrl + options.url; //请求url
		options.data = options.data || {}; //请求数据
		options.method = options.method || this.config.method; //请求方法
		return new Promise((resolve, reject) => {
			let _config = null
			//请求失败或成功都会触发
			options.complete = (response) => {
				// console.log(response)
				let statusCode = response.statusCode;
				response.config = _config;
				//请求后响应拦截
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}

				/*统一的响应日志记录*/
				_reslog(response)

				// 判断是否请求失败或成功
				if (statusCode === 200) { //成功
					resolve(response.data);
				} else {
					reject(response);
					//request:fail  --- 请求失败
					uni.showToast({
						icon: "none",
						title: "网络不给力,请重新操作~"
					})
				}
			}

			//对象拷贝 --- options 合并 初始config配置 并覆盖相同key
			_config = Object.assign({}, this.config, options);
			//添加请求时间戳
			_config.requestId = $momm.getdatetime();
			_reqlog(_config);
			// 触发请求拦截
			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			/*统一的请求日志记录*/
			delete _config.isShow;
			// delete _config.isToken;
			delete _config.baseUrl;
			delete _config.formData;
			delete _config.name;
			global.requestTask = uni.request(_config);
		});
	},
	// 图片上传
	uploadFile(options) {
		if (!options) {options = {};}
		if (!options.filePath) return console.log('缺少图片路径');
		options.baseUrl = options.baseUrl || this.config.baseUrl; //请求的ip
		options.url = options.baseUrl + options.url; //请求url
		options.data = options.filePath;
		return new Promise((resolve, reject) => {
			let _config = null
			//请求失败或成功都会触发
			options.complete = (response) => {
				let statusCode = response.statusCode;
				response.config = _config;
				//请求后响应拦截
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				_reslog(response);
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response);
					//request:fail  --- 请求失败
					uni.showToast({
						icon: "none",
						title: "请求错误!"
					})
				}
			}
			//对象拷贝 --- options 合并 初始config配置 并覆盖相同key
			_config = Object.assign({}, this.config, options);
			//添加请求时间戳
			_config.requestId = $momm.getdatetime();
			_reqlog(_config);
			// 触发请求拦截
			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			delete _config.isShow;
			// delete _config.isToken;
			delete _config.baseUrl;
			delete _config.method;
		    delete _config.dataType;
			uni.uploadFile(_config);
		})
	}
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			// console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		// console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	// switch (_statusCode) {
	// 	case 200:
	// 		break;
	// 	case 401:
	// 		break;
	// 	case 404:
	// 		break;
	// 	case 500:
	// 	default:
	// 		break;
	// }
}
