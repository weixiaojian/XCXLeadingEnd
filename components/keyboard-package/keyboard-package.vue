<template>
	<view class="keyboard_layout">
		<view class="keyboardbox" >
			<view class="numkeyboard" v-if="type==='number'">
				<view class="num-area">
					<view class="row" v-for="(item,index) in numKeybordList" :key="index">
						<view :class="['item',ite===0?'z':'',(disableDot && ite==='.')?'disabled':'']" v-for="(ite,idx) in item"
						 hover-class="active" :hover-start-time="0" :hover-stay-time="5" :key="idx" @tap="input(ite)">{{ite}}</view>
					</view>
				</view>
				<view class="btn-area">
					<view :class="['item','del']" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
						删除
					</view>
					<view class="confirem item" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">
						完成
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="safe-area" v-if="safeAreaInsetBottom"></view> -->
	</view>
	<!-- <uni-popup :custom="true" :needMask="false" type="bottom" ref="keyboardPackage"> -->
		<!-- <view class="keyboardbox" >
			<view class="numkeyboard" v-if="type==='number'">
				<view class="num-area">
					<view class="row" v-for="(item,index) in numKeybordList" :key="index">
						<view :class="['item',ite===0?'z':'',(disableDot && ite==='.')?'disabled':'']" v-for="(ite,idx) in item"
						 hover-class="active" :hover-start-time="0" :hover-stay-time="5" :key="idx" @tap="input(ite)">{{ite}}</view>
					</view>
				</view>
				<view class="btn-area">
					<view :class="['item','del']" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
						删除
					</view>
					<view class="confirem item" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">
						完成
					</view>
				</view>
			</view>
		</view>
		<view class="safe-area" v-if="safeAreaInsetBottom"></view> -->
	<!-- </uni-popup> -->
</template>

<script>
	// import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			// uniPopup
		},
		props: {
			type: {
				type: String,
				default: 'number'
			},
			// safeAreaInsetBottom: { //是否设置安全区
			// 	type: Boolean,
			// 	default: false
			// },
			disableDot: { //数字键盘是否禁止点击.仅type为number生效
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				numKeybordList: [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
					[0, '.']
				],
				active: 2
			};
		},
		methods: {
			open() {
				// this.$refs.keyboardPackage.open();
			},
			confirm() {
				this.$emit('onConfirm');
			},
			deleteVal() {
				this.$emit('onDelete');
			},
			input(val) {
				if (val === '.' && this.disableDot) return;
				this.$emit('onInput', val);
				if(this.active === 2){
					this.active = 1;
				}
			},
			close() {
				// this.$refs.keyboardPackage.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
// .keyboard_layout{
	.keyboardbox {
		z-index: 999;
		width: 100%;
		background-color: $ztd-color-white;
	    position: absolute;
		bottom: 0;
		.numkeyboard {
			height: 432rpx;
			display: flex;
			background-color: #ebedf0;
	
			.btn-area {
				width: 180rpx;
				height: 100%;
				display: flex;
				flex-direction: column;
	
				.item {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-grow: 1;
				}
	
				.del {
					background-color: #ebedf0;
					color: #333;
	
					&.active {
						background-color: #f1f3f5;
					}
				}
	
				.confirem {
					background-color: #1989fa;
					color: #FFFFFF;
	
					&.active {
						background-color: #0570db;
					}
				}
			}
	
			.num-area {
				flex-grow: 1;
				display: flex;
				flex-wrap: wrap;
	
				.row {
					width: 100%;
					height: 25%;
					display: flex;
					margin-top: 1px;
	
					.item {
						flex-grow: 1;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #FFFFFF;
						border-right: 1px solid #ebedf0;
						width: 33.33%;
						
						&.active {
							background-color: #ebedf0;
						}
	
						&.z {
							flex-grow: 2;
							width: 66.66%;
						}
	
						&.disabled {
							background: #FFFFFF;
							color: #B9B9B9;
						}
					}
				}
	
			}
		}
	}
	
	.safe-area {
		padding-bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.platenumber {
		background-color: #f5f5f5;
	
		.header {
			height: 76rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			border-top: 1px solid #f5f5f5;
	
			&>view {
				padding: 0 45rpx;
				color: #00a7ea;
				height: 100%;
				display: flex;
				align-items: center;
				&.active {
					background-color: #ebedf0;
				}
			}
		}
	
		.main {
			height: 435rpx;
	
			.row {
				margin: 13rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
	
				.item {
					width: 56rpx;
					height: 94rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #FFFFFF;
					border-radius: 6rpx;
					margin: 0 7rpx;
					font-size: 24rpx;
					&.active {
						background-color: #ebedf0;
					}
	
					&.img {
						background-color: #c2cacc;
						width: 94rpx;
	
						&.active {
							background-color: #ddd;
						}
	
						&>image {
							width: 49rpx;
							height: 48rpx;
						}
					}
				}
			}
	
		}
	}
// }
	
</style>
