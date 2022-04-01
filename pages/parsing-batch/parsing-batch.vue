<template>
	<view class="parsing">
		<view class="parsing-addr">
			<!-- 提示语 -->
			<view class="parsing-addr-nian">粘贴或输入一整段地址信息，自动识别姓名、电话、地址；多个收件人之间用" ； "隔开。</view>
			<!-- 文本解析 -->
			<textarea class="parsing-addr-textarea" :placeholder="placeholder" v-model="batchAddress" />
		</view>
		<view class="parsing-button">
			<ButtonBox :title="'智能解析'" :radius="'35rpx'" height="70rpx" width="700rpx" @hanldChange="ChangeBtn">
			</ButtonBox>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholder: '例如：张三，130****1234，广东省深圳市宝安区**街道**小区**楼**号，文件；李四，181****1234，广东省深圳市宝安区**街道**小区**楼**号，衣服',
				batchAddress: ''
			};
		},
		methods: {
			// 智能解析
			ChangeBtn() {
				let self = this;
				if(this.batchAddress == ''){uni.showToast({icon:"none",title:"请输入要解析数据"});return;};
				let _data = { address:this.$Reg.stripscript(this.$Reg.removeHTMLTag(this.batchAddress))};
				this.$api.getAddressAnalyList(_data).then(res => {
					console.log(res);
					if(res.code == 200) {
						let { data } = res
						uni.navigateTo({
							url: '/pages/excelMail/orderExcel?order=' + JSON.stringify(data)+'&pageId=batch'
						})
					} else {
						uni.showToast({icon:'none',title:res.message,duration:2500})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.parsing {
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		
		&-addr {
			background-color: $ztd-color-white;
			padding: 20rpx;
			
			&-nian {
				background-color: $ztd-color-block;
				color: $ztd-color-primary;
				font-size: 30rpx;
				border-radius: 8rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
			}
			
			&-textarea {
				width: 100%;
				background-color: #EAEBEA;
				height: 500rpx;
				border-radius: 8rpx;
				padding: 20rpx;
			}
		}
		
		&-button {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: $ztd-color-white;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 18rpx 18rpx 0 0;
			font-weight: bold;
		}
	}
</style>
