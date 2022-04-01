<template>
	<view>
		<!-- 日期控件 -->
		<view class="date" @tap="opencalendar" v-if="isShow">
			<view class="iconfont dicon">&#xe65c;</view>
			<view class="date-item">
				<view class="date-item-list">{{before}}</view>
				<view class="date-item-list">至</view>
				<view class="date-item-list">{{after}}</view>
			</view>
		</view>
		
		<!-- 日历控件 -->
		<uni-calendar
		   ref="calendar" 
		   :clear-date="true" 
		   :insert="insert" 
		   :lunar="lunar" 
		   :startDate="startDate" 
		   :endDate="endDate" 
		   :range="range" 
		   @confirm="confirm" 
		   @close="close" />
	</view>
</template>

<script>
	let self;
	export default {
		props:{
			before:{
				type:String,
				default:""
			},
			after:{
				type:String,
				default:""
			},
			lunar:{
				type:Boolean,
				default:false
			},
			range:{
				type:Boolean,
				default:true
			},
			insert:{
				type:Boolean,
				default:false
			},
			selected:{
				type:Array,
				default:()=>{
					return []
				}
			},
			isShow:{
				type:Boolean,
				default:false
			 },
			startDate:{
				type:String,
				default:""
			},
			endDate:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				// lunar: false, //是否显示农历
				// range: true, //范围选择
				// insert: false,
				// selected: [],
				// startDate:"",
				// endDate:"2020-10-21"
			};
		},
		mounted(){
			self = this;
		},
		methods:{
			opencalendar() {
				this.$refs.calendar.open()
			},
			close() {
				console.log('弹窗关闭');
			},
			confirm(e) {
				// console.log('confirm 返回:', e)
				this.$emit('confirm',e.range);
			}
		}
	}
</script>

<style lang="scss" scoped>
.date{
	display: flex;
	height: 100%;
	align-items: center;
	
	.dicon{
		font-size: 30rpx;
		color:$ztd-color-primary;
	}
	&-item{
		display: flex;
		align-items: center;
		
		&-list{
			font-size:24rpx;
			color:$ztd-color-primary;
		}
		&-list:nth-child(2){
			padding:10rpx;
		}
	}
	
}
</style>
