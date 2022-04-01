<template>
	<!-- 
		横向滑动的tab 列表
		Author: DaiZuHua
		time: 2021.5.11
	 -->
	<view>
		<scroll-view class="scroll-h" :scroll-x="true" :show-scrollbar="false">
			<view 
				v-for="(tab, index) in tabBars" 
				:key="tab.id" class="uni-tab-item" 
				:data-current="index" 
				@click="onTabTap"
				:style="{width: tabItemWidth}">
				<text class="uni-tab-item-title" :class="tabIndexInit == index ? 'uni-tab-item-title-active' : ''"
					:style="[tabIndexInit == index ? { color: tabItemTitleActiveColor} : { color: tabItemTitleColor }]">
					{{ tab.name }} <text class="uni-tab-item-title order uni-ellipsis" :class="tabIndexInit == index ? 'uni-tab-item-title-active' : ''" v-if="pageId=='order'" :style="[tabIndexInit == index ? { color: tabItemTitleActiveColor} : { color: tabItemTitleColor }]">{{ tab.total||0}}</text> 
				</text>
				<view v-if="pageId!='order'" :class="tabIndexInit == index ? 'uni-tab-item-line' : ''" :style="{left: tabItemLeft}"></view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		name: 'scrollViewTab',
		props: {
			// tab列表
			tabBars: {
				type: Array,
				require: true
			},

			// 默认选中的tab 下标
			tabIndexInit: {
				type: Number,
				default: 0
			},

			// tabItem标题文字默认颜色
			tabItemTitleColor: {
				type: String,
				default: '#CBCCCB'
			},
			// tabItem标题文字默认底边颜色
			tabViewBorderColor: {
				type: String,
				default: '#dddddd'
			},
			// Item宽度
			tabItemWidth: {
				type: String,
				default: '20%'
			},
			// 以默认的五个子元素配置
			tabItemLeft: {
				type: String,
				default: '62rpx'
			},
			// tabItem标题选中文字颜色
			tabItemTitleActiveColor: {
				type: String,
				default: '#FDD605'
			},
			pageId: {
				type: String,
				default: 'order'
			}
		},
		data() {
			return {};
		},
		methods: {
			onTabTap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.$emit('onTabTap', this.tabBars[index]);
			}
		}
	};
</script>

<style lang="scss">
	.scroll-h {
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		.uni-tab-item {
			display: inline-block;
			// width: 20%;
			flex: 1;
			text-align: center;
			position: relative;
			
			&-title {
				font-size: 30rpx;
			}
			
			&-line {
				width: 60rpx;
				height: 2px;
				position: absolute;
				// left: 62rpx;
				bottom: -15rpx;
				background-color: $ztd-color-primary;
			}
		}
		.order {
			width: 100%;
			display: inline-block;
			font-size: 28rpx;
		}
	}
</style>
