<template>
	<!-- 搜索框 -->
	<view class="search">
		<view class="search-box" :style="[boxStyle]">
			<slot name="left">
				<i class="iconfont searchicon" v-if="isLeft" @tap="touchLeft" :style="[leftStyle]">&#xe617;</i>
			</slot>
			<input
			   :style="[inputStyle]"
			   :type="itype"
			   :value="defaultValue" 
			   :placeholder="placeholder" 
			   :disabled="disabled" 
			   :password="itype == 'password'"
			   :focus="focus"
			   :maxlength="maxlength"
			   :data-name="dataName"
			   :confirm-type="confirmType"
			   @input="inputVal"
			   @focus="inputFocus"
			   @blur="inputBlur"
			   @confirm="inputConfirm"
			 />
			<slot name="right">
				<i class="iconfont scanicon" @tap="touchRight" v-if="isRight" :style="[rightStyle]">&#xe617;</i>
			</slot>
		</view>
	</view>
</template>
				 <!-- @keypress="inputKeypress" -->
<script>
	export default {
		props: {
			dataName:{
				type:String,
				default:""
			},
			leftColor:{
			   type:String,
			   default:""
			},
			rightColor:{
			   type:String,
			   default:""
			},
			isLeft:{
				type:Boolean,
				default:true
			},
			isRight:{
				type:Boolean,
				default:true
			},
			maxlength:{
			   type:Number,
			   default:140
			},
			//双向绑定值
			value:{
				type:[String,Number],
				default:""
			},
			itype: {
				type:String,
				default:"text"
			},
            placeholder:{
				type:String,
				default:"请输入"
			},
			disabled:{
				type:Boolean,
				default:false
			},
			focus:{  //是否自动获取焦点
				type:Boolean,
				default:false
			},
			confirmType:{  //设置键盘右下角按钮的文字，仅在 type="text" 时生效。
				type:String,
				default:"search"
			},
			inputStyle:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			boxStyle:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			searchHearch:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				defaultValue:this.value
			};
		},
		computed:{
			leftStyle(){
				let style = {};
				if(this.leftColor) style.color = this.leftColor;
				return style;
			},
			rightStyle(){
				let style = {};
				if(this.rightColor) style.color = this.rightStyle;
				return style;
			}
			// boxStyle(){
			// 	let style = {};
			// 	if(this.searchHearch) style.height = this.searchHearch;
			// 	return style;
			// }
		},
		watch:{
			value(nVal, oVal) {
				this.defaultValue = nVal;
			}
		},
		methods:{
			touchLeft(){
			   this.$emit('touchLeft');	
			},
			touchRight(){
				this.$emit('touchRight');
			},
			//输入
			inputVal(event){
				// console.log(event);
				// 当前model 赋值
				this.defaultValue = event.detail.value;
				// vue 原生的方法 return 出去
				this.$emit('input', event.detail.value);
				// this.$emit('hanldInput',event);
			},
			//聚焦
			inputFocus(e){
				this.$emit('focus');
			},
			//失焦
			inputBlur(event){
				this.$emit('blur',event.detail.value);
			},
			//键盘右下角按钮
			inputConfirm(event){
				uni.hideKeyboard();
				this.$emit('confirm',event.detail.value);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		// padding: 0 80rpx;

		&-box {
			overflow: hidden;
			display: flex;
			align-items: center;
			width: 100%;
			height: 80%;
			border: 2rpx solid $ztd-color-line;
			border-radius: 30rpx;
			background-color: $ztd-color-white;

			input {
				height: 100%;
				padding-left:20rpx;
				flex: 1;
				text-align: left;
				font-size: 28rpx;
			}

			.searchicon,
			.scanicon {
				width: 80rpx;
				// height: 80%;
				height: 100%;
				display: flex;
				align-items: center;
				font-size: 44rpx;
				justify-content: center;
				color: $ztd-color-listfont;
			}
		}
	}
</style>
