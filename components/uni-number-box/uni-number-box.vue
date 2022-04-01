<template>
	<view class="uni-numbox">
		<view @click="_calcValue('minus')" class="uni-numbox__minus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }">-</text>
		</view>
		<view class="uni-numbox__value">
				<input :disabled="disabled" @blur="_onBlur"  type="number" v-model="inputValue" />
				<text>{{type}}</text>
		</view>
		<view @click="_calcValue('plus')" class="uni-numbox__plus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }">+</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			type: {
				type:String,
				default: 'KG'
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 10000
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value =Number(this.Subtr(value,step)) 
					if (value < this.min) {
						return;
					}
					if(value > this.max){
						value = this.max
					}
				} else if (type === "plus") {
					value += step;
					if (value > this.max) {
						return;
					}
					if(value < this.min){
						value = this.min
					}
				}

				this.inputValue = String(value / scale);
			},
			 //减法 
			Subtr(arg1,arg2){
			     let r1,r2,m,n;
			     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
			     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
			     m=Math.pow(10,Math.max(r1,r2));
			     n=(r1>=r2)?r1:r2;
			     return ((arg1*m-arg2*m)/m).toFixed(n);
			 },
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 50rpx;
	/* #ifdef APP-NVUE */
	$box-line-height: 50rpx;
	/* #endif */
	$box-line-height: 26px;
	$box-width: 60rpx;

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: $box-height;
		line-height: $box-height;
		width: 300rpx;
	}

	.uni-numbox__value {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 20rpx;
		background-color: $uni-bg-color;
		width: 160rpx;
		height: $box-height;
		text-align: center;
		font-size: $uni-font-size-lg;
		margin: 0 10rpx;
		// border-width: 1rpx;
		// border-style: solid;
		// border-color: $uni-border-color;
		// border-left-width: 0;
		// border-right-width: 0;
		background-color: $uni-bg-color-grey;
		input{
			font-size: $uni-font-size-lg;
		}
		text{
			color: #474747;
		}
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		// line-height: $box-line-height;
		// text-align: center;
		font-size: 40rpx;
		color: $uni-text-color;
		// background-color: $uni-bg-color-grey;
		// border-width: 1rpx;
		// border-style: solid;
		// border-color: $uni-border-color;
		// border-top-left-radius: $uni-border-radius-base;
		// border-bottom-left-radius: $uni-border-radius-base;
		// border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		// border-width: 1rpx;
		// border-style: solid;
		// border-color: $uni-border-color;
		// border-top-right-radius: $uni-border-radius-base;
		// border-bottom-right-radius: $uni-border-radius-base;
		// background-color: $uni-bg-color-grey;
		// border-left-width: 0;
	}

	.uni-numbox--text {
		font-size: 40rpx;
		color: $uni-text-color;
	}

	.uni-numbox--disabled {
		color: $uni-text-color-disable;
	}
</style>
