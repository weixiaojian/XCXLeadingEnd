<template>
	<view class="mycourier">
		<view class="bg-20">
			<view class="bg-color">
				<view class="textType"><text>问题类型:</text></view>
				<radio-group class="radio-box" @change="radioChange">
					<label v-for="(item, index) in items" :key="index">
							<radio color="#FDD605" :value="item.value" style="transform:scale(0.7)" :checked="index === current" />{{item.name}}
					</label>
				</radio-group>
				<view class="youMind">
					<text>您的声音:</text>
					<textarea @input="inputText" value="" v-model="texts" maxlength="800" />
				</view>
				<view class="btn">
					<button @click="resets" class="cancel" type="warn" size="mini">取消</button>
					<button @click="submitSuggest" class="determine" type="primary" size="mini">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				// 类型
				types: 0,
				// 文本值
				texts: '',
				timer: null,
				items: [{
					value: '0',
					name: '系统问题'
				},
				{
					value: '1',
					name: '用户需求'
				},
				{
					value: '2',
					name: '其他'
				}]
			}
		},
		onLoad() {
		},
		methods: {
			inputText(e) {
				clearTimeout(this.timer)
				  // 重新启动一个延时器，并把 timerId 赋值给 this.timer
				  this.timer = setTimeout(() => {
				    // 如果 500 毫秒内，没有触发新的输入事件，则为文本框赋值
				    this.texts = e.detail.value
				  }, 500)
			},
			radioChange(e) {
				this.types = Number(e.detail.value)
			},
			submitSuggest() {
				let userData = JSON.parse(this.$getStorageSync('userData'))
				let openid = userData.openId
				let textlength = this.texts.trim()
				if(textlength.length <= 0) {
					return uni.showToast({
						title:"内容不能为空",
						icon: "error",
						mask:false
					})
				}
				let _data = {
					"openId": openid,
					"type": this.types,
					"content": this.texts
				}
				this.$api.addWxAdvices(_data).then( res => {
					if(res.code == 200) {
						uni.showToast({
							title:"建议提交成功",
							icon: "none",
							mask:false
						})
						this.texts = ''
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			},
			resets() {
				// this.current = 0
				this.texts = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mycourier{
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background-color:#fff;
		.bg-20{
			width: 100%;
			height: auto;
			padding: 10rpx 20rpx;
			.bg-color{
				background-color: #fff;
				padding: 40rpx;
				.textType{
					margin: 20rpx 0;
				}
				.radio-box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 500rpx;
					padding: 0;
					margin: 0;
					label{
						 radio .wx-radio-input.wx-radio-input-checked{
						   background: #3c77ed;
						   border: 1px solid #3c77ed;
						   transform:scale(0.7)
						 }
						text{
							margin-right: 40rpx;
						}
					}
					
				}
				.youMind{
					margin: 60rpx 0 0 0;
					text{
						display: block;
						margin: 0 0 18rpx 0;
					}
					textarea{
						width: 600rpx;
						height: 500rpx;
						border: 1px solid #a9a9a9;
					}
				}
				.btn{
					text-align: center;
					.determine{
						background-color: #000;
						margin:  40rpx -50rpx 0 0;
					}
					.cancel{
						background-color: #fdd605;
						margin: 40rpx 100rpx 0 -100rpx;
					}
				}
			}
		}
	}
</style>
