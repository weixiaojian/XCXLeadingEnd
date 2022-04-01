<template>
	<view class="uni-steps">
		<view class="uni-steps__column">
			<view class="uni-steps__column__list" 
			    v-for="(item,index) in options.problemInfoList" 
				:key="index" 
				v-if="pageId === 'wtjcx' || pageId === 'psrw'"
				@tap="replymessage(options)"
			>
				<view class="timer-list-box">
					<view class="timer-list">{{item.siteCode}}{{item.siteName}}</view>
					<view class="timer-list">{{item.manCode}}{{item.man}}</view>
				</view>
				
				<view class="uni-steps__column-line-item" >
					<!-- <view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--before':'uni-steps__row-line--before']" :style="{backgroundColor:index<=active&&index!==0?activeColor:index===0?'transparent':deactiveColor}"></view> -->
					<!-- <view :class="[direction==='column'?'uni-steps__column-check':'uni-steps__row-check']" v-if="index === active">
					</view> -->
					<i class="iconfont state_icon" :class="[index<=active?'activeColor':'deactiveColor']" v-html="index<=active ? '&#xe650;':'&#xe6b3;'"></i>
					<!-- <view :class="[direction==='column'?'uni-steps__column-circle':'uni-steps__row-circle']" v-else :style="{backgroundColor:index<active?activeColor:deactiveColor}"></view> -->
					<view 
					   :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--after':'uni-steps__row-line--after']" 
					   :style="{backgroundColor:index<active&&index!==options.problemInfoList.length-1?activeColor:index===options.problemInfoList.length-1?'transparent':deactiveColor}"
					 ></view>
				</view>
				<view class="uni-steps__column-text">
					<text class="uni-steps__column-desc">{{item.remark}}</text>
					<text class="uni-steps__column-title">{{item.date}}</text>
				</view>
			</view>
			<view class="uni-steps__column__list" v-for="(item,index) in options" :key="index" v-if="pageId !== 'wtjcx' && pageId !== 'psrw'">
				<view class="column-list-timer">
					<view class="timer">{{item.scanDate}}</view>
				</view>
				<view class="uni-steps__column-line-item">
					<!-- <view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--before':'uni-steps__row-line--before']" :style="{backgroundColor:index<=active&&index!==0?activeColor:index===0?'transparent':deactiveColor}"></view> -->
					<!-- <view :class="[direction==='column'?'uni-steps__column-check':'uni-steps__row-check']" v-if="index === active">
					</view> &#xe650;-->
					<i class="iconfont state_icon" :class="[index<=active?'activeColor':'deactiveColor']" v-html="index<=active ? '&#xe650;':'&#xe6b3;'"></i>
					<!-- <view :class="[direction==='column'?'uni-steps__column-circle':'uni-steps__row-circle']" v-else :style="{backgroundColor:index<active?activeColor:deactiveColor}"></view> -->
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--after':'uni-steps__row-line--after']" :style="{backgroundColor:index<active&&index!==options.length-1?activeColor:index===options.length-1?'transparent':deactiveColor}"></view>
				</view>
				<view class="uni-steps__column-text">
					<text class="uni-steps__column-title">{{item.scanType}}</text>
					<text class="uni-steps__column-desc">{{item.remark}}</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	// import uniIcons from '../uni-icons/uni-icons.vue'

	/**
	 * Steps 步骤条
	 * @description 评分组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=34
	 * @property {Number} active 当前步骤
	 * @property {String} direction = [row|column] 当前步骤
	 * 	@value row 横向
	 * 	@value column 纵向
	 * @property {String} activeColor 选中状态的颜色
	 * @property {Array} options 数据源，格式为：[{title:'xxx',desc:'xxx'},{title:'xxx',desc:'xxx'}]
	 */

	export default {
		// name: 'UniSteps',
		components: {
			// uniIcons
		},
		props: {
			pageId:{
				type:String,
				default:""
			},
			direction: {
				// 排列方向 row column
				type: String,
				default: 'row'
			},
			activeColor: {
				// 激活状态颜色
				type: String,
				default: '#1aad19'
			},
			deactiveColor: {
				// 未激活状态颜色
				type: String,
				default: '#999999'
			},
			active: {
				// 当前步骤
				type: Number,
				default: 0
			},
			options: {
				type: [Object,Array],
				default () {
					return []
				}
			} // 数据
		},
		data() {
			return {}
		},
		methods:{
			replymessage(item){
				this.$emit('replymessage',item);
			}
		}
	}
</script>

<style scoped lang="scss">
	// .timer{
	// 	display: flex;
	// 	flex-direction: column;
	// 	&-list{
	// 		flex:1;
	// 		padding-top: 10rpx;
	// 	}
	// }
	.state_icon{
		font-size: 40rpx;
	}
	.timer-list-box{
		width: 200rpx;
		display: flex;
		flex-direction: column;
		// justify-content:flex-end;
		align-items: flex-end;
	}
	.timer-list{
		display: flex;
		// justify-content:flex-end;
		// text-align: right;
		
		font-size: 20rpx;
		color: $ztd-color-listfont;
	}
	.column-list-timer{
		display: flex;
		justify-content:flex-end;
		.timer{
			text-align: right;
			font-size: 20rpx;
			color: $ztd-color-listfont;
			width: 140rpx;
		}
	}
	.uni-steps {
		display: flex;
		width: 100%;
		flex-direction: column;
		border-bottom-left-radius:$ztd-border-radius;
		border-bottom-right-radius: $ztd-border-radius;
		background-color: $ztd-color-white;
		padding:20rpx 40rpx 0 40rpx;
	}
    .activeColor{
		color: $ztd-color-primary;
	}
	.deactiveColor{
		color:$ztd-color-jj;
	}
	.uni-steps__row {
		flex-direction: column;
	}

	.uni-steps__column {
		display: flex;
		flex-direction: column;
		// flex-direction: row-reverse;
	}
    .uni-steps__column__list{
		display: flex;
		height: auto;
	}
	.uni-steps__row-text-container {
		flex-direction: row;
	}

	.uni-steps__column-text-container {
		flex-direction: column;
		flex: 1;
	}

	.uni-steps__row-text {
		flex: 1;
		flex-direction: column;
	}

	.uni-steps__column-text {
		// padding: 6px 0px;
		padding-bottom: 40rpx;
		display: flex;
		flex:1;
		flex-direction: column;
	}

	// .uni-steps__row-title {
	// 	font-size: 14px;
	// 	line-height: 16px;
	// 	text-align: center;
	// }

	.uni-steps__column-title {
		font-size: 24rpx;
		text-align: left;
		line-height: 18px;
	}

	// .uni-steps__row-desc {
	// 	font-size: 12px;
	// 	line-height: 14px;
	// 	text-align: center;
	// }

	.uni-steps__column-desc {
		font-size: 20rpx;
		text-align: left;
		// line-height: 18px;
	}

	.uni-steps__row-container {
		display: flex;
		flex-direction: row;
	}

	.uni-steps__column-container {
		display: inline-flex;
		width: 30px;
		flex-direction: column;
	}

	.uni-steps__row-line-item {
		display: inline-flex;
		flex-direction: row;
		flex: 1;
		height: 14px;
		line-height: 14px;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__column-line-item {
		display: flex;
		flex-direction: column;
		// flex: 1;
		align-items: center;
		// padding-top:10rpx;
		width: 80rpx;
		justify-content: center;
		// justify-content: center;
	}

	.uni-steps__row-line {
		flex: 1;
		height: 1px;
		background-color: #999;
	}

	.uni-steps__column-line {
		width: 1px;
		background-color: #999;
	}

	.uni-steps__row-line--after {
		transform: translateX(1px);
	}

	.uni-steps__column-line--after {
		flex: 1;
		transform: translate(0px, 1px);
	}

	.uni-steps__row-line--before {
		transform: translateX(-1px);
	}

	.uni-steps__column-line--before {
		height: 6px;
		transform: translate(0px, -1px);
	}

	// .uni-steps__row-circle {
	// 	width: 5px;
	// 	height: 5px;
	// 	border-radius: 100px;
	// 	background-color: #999;
	// 	margin: 0px 3px;
	// }

	// .uni-steps__column-circle {
	// 	width: 5px;
	// 	height: 5px;
	// 	border-radius: 100px;
	// 	background-color: #999;
	// 	margin: 4px 0px 5px 0px;
	// }

	.uni-steps__row-check {
		margin: 0px 6px;
	}

	.uni-steps__column-check {
		height: 14px;
		line-height: 14px;
		margin: 2px 0px;
	}
</style>