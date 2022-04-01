<template>
	<view class="expectTime">
		<view class="tile">
			<text>期望上门</text>
			<i class="iconfont rightIcon" v-html="'&#xe66d;'" @click="cancel"></i>
		</view>
	 <view class="dateTime">
			<view class="days-wraper">
					<view class="dayItem" :class="dayItem==0?'active':''"  @click="selectDayItem(0)" >今天</view>
					<view class="dayItem" :class="dayItem==1?'active':''"  @click="selectDayItem(1)" >明天</view>
			</view>
			<view class="hour-wraper">
				<scroll-view class="main" scroll-y="true"  >
						<view v-for="(item,index) in hourList" :key="index" :class="selectHour==index?'active':''"  @click="clickHour(item,index)" class="hourItem">{{item}}</view>
				</scroll-view>
			</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hourMould:['09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'],
				dayItem:0,
				selectHour:null,
				hourList:[],
				canToday:true
			}
		},
		mounted() {
			let self = this;
			self.computerToday()
			if(self.hourList.length<1){
				self.dayItem = 1
				self.hourList = self.hourMould
				self.canToday = false
			}
		},
		watch:{
		     dayItem(val, oldVal){//普通的watch监听
				 this.hourList = []
				 val==1?this.hourList = this.hourMould:this.computerToday()
		     },
		 },
		methods: {
			selectDayItem(num){
				let self = this;
				self.selectHour = null;
				if(!self.canToday){
					this.dayItem = 1;
					uni.showToast({
						icon:"none",
						title:"请预约明天~",
						duration:1500,
						mask:true
					})
				}else{
					this.dayItem = num
					
				}
			},
			computerToday(){
				let self = this;
				let curTime = self.$momm.getdatetime().replace(/\-/g, '/')
				let curDay = self.$momm.getdate().replace(/\-/g, '/')
				self.hourMould.forEach((item,index) =>{
					if(!self.$momm.compareDate(curTime,curDay+' '+item.split('-')[0])){
						self.hourList.push(item)
					}
				})
			},
			cancel(){
				let self = this;
				self.$emit('timeCancel')
			},
			clickHour(item,index){
				let self = this;
				self.selectHour = index
				let _time = {
					dayItem:this.dayItem==0?'今天':'明天',
					hour:item
				}
				self.$emit('getExpectTime',_time)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.expectTime{
		width: 100%;
		height: auto;
		z-index: 999;
		background-color: #fff;
		.tile{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:26rpx 30rpx;
			border-bottom: 2rpx solid #fbf8f8;
			text{
				font-weight: bold;
				font-size: 28rpx;
				color: #000;
			}
			.rightIcon{
				font-size: 26rpx;
				color: #444;
			}
		}
		.dateTime{
		  background-color: #fff;
		  height: 400rpx;
		  display: flex;
		  justify-content: flex-start;
		  align-items: center;
			.days-wraper{
			  flex: 1;
			  height: 100%;
			  background-color: #F2F2F2;
				.dayItem{
				  height: 120rpx;
				  width: 100%;
				  display: flex;
				  justify-content: center;
				  align-items: center;
				  padding-left: 20rpx;
				  font-size: 30rpx;
				  color: #444;
				}
				.dayItem.active{
				  background-color: #fff
				}
			}
			.hour-wraper{
			  flex: 1;
			  height: 100%;
			  overflow-y: auto;
				.main{
					width: 100%;
					height: 100%;
				}
				.hourItem{
				  position: relative;
				  height: 90rpx;
				  width: 100%;
				  display: flex;
				  align-items: center;
				  justify-content: flex-start;
				  padding-left: 40rpx;
				  font-size: 28rpx;
				}
				.hourItem.active{
				  color: $ztd-color-primary;
				}
			}
		}
	}
</style>
