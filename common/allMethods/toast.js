import Vue from 'vue'
import ToastComponent from '@/components/yd-toast/yd-toast.vue'

const Toast = {};
// 注册Toast
Toast.install = function (Vue) {
// 生成一个Vue的子类
// 同时这个子类也就是组件
const ToastConstructor = Vue.extend(ToastComponent)
// 生成一个该子类的实例
const instance = new ToastConstructor();
// 将这个实例挂载在我创建的p上
// 并将此p加入全局挂载点内部
instance.$mount(document.createElement('p'))
document.body.appendChild(instance.$el)
// 通过Vue的原型注册一个方法
// 让所有实例共享这个方法
Vue.prototype.$zdytoast = (msg) => {
		instance.show({title:msg})
}
}

export default Toast
