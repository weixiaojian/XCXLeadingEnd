<template>
	<!-- v-if="addressDatas.length>0 && isShowArr" -->
	<view >
		<view class="swiper-box"  v-for="(item,index) in addressData" :key="index">
			<view class="mark" v-if="item.ck"></view>
			<view class="swiper-box-info" @tap="selectAddress(index,item)">
				<view class="swiper-box-info-list">
					<view class="l bold">{{item.name}}</view>
					<view class="r bold">{{item.phone}}</view>
				</view>
				<view class="swiper-box-info-list" v-if="item.company">
					<view class="l">公司:</view>
					<view class="r">{{item.company}}</view>
				</view>
				<view class="swiper-box-info-list">
					<view class="l">地址:</view>
					<view class="r address">{{item.provice}}{{item.city||''}}{{item.country||''}}{{item.townName||''}}{{item.detailAddress}}</view>
				</view>
			</view>
			<view class="swiper-box-btns">
				<view class="box-btns-l" >
					<view class="wraper-cks" v-if="defaultAddress">
						<view class="imgeDef"  @tap="editDefault(index,item)">
							<image  :src="item.defaultValue=='0'?'../../../static/img/circle.png':'../../../static/img/order-Ok.png'" ></image>
						</view>
						<text>设为默认寄件地址</text>
					</view>
				</view>
				<view class="box-btns-r">
					<view class="swiper-box-btns-list" @tap="editor_address('bj',item)">
						<i class="iconfont" v-html="'&#xe62b;'"></i>
						<text class="name" >编辑</text> 
					</view>
					<view class="swiper-box-btns-list" @tap="delte_address(index,item)">
						<i class="iconfont" v-html="'&#xe641;'">&#xe61f;</i>
						<text class="name">删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
  export default {
	  name:"address-list",
	  props:{
		  addressData:{
			  type:Array,
			  default:()=>{
				  return [];
			  }
		  },
			defaultAddress:{
			  type:Boolean,
			  default:()=>{
				  return false;
			  }
			},
	  },
	  data(){
		  return {
			}
	  },
		// watch: { // 加个监听的，，防止父级数据改变，子组件没有跟着改变
		//     addressData: {
		//       handler (val, oldVal) {
		//         let self = this
		//         if (val) {
		// 					self.addressDatas = val;
		//           self.isShowArr = false;
		// 					self.isShowArr = true;
		// 					this.$forceUpdate();
		//         } else {
		          
		//         }
		//       },
		//       deep: true,
		//       immediate: true
		//     }
		// },
		onLoad(option){
		},
	  methods:{
			editDefault(index,item){
				let obj = {index,item};
				this.$emit('editDefault',obj);
			},
		  editor_address(type,item){
			  let obj = {type,item};
			  this.$emit('editor_address',obj);
		  },
		  delte_address(index,item){
			  let obj = {index,item};
			  this.$emit('delte_address',obj);
		  },
		  selectAddress(index,item){
				let obj = {index,item}
				this.$emit('selectAddress',obj);
		  }
	  }
  }
</script>

<style lang="scss" scoped>
.swiper-box{
	position: relative;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
    margin-bottom: 20rpx;
		background-color: #ffff;
		border-radius: 10rpx;
		.mark{
			width: 0px;
			height: 0px;
			border-top: 40rpx solid #FDD605;
			border-right: 40rpx solid transparent;
			position: absolute;
		}
	&-info {
		display: flex;
		padding: 10rpx 40rpx;
		flex-direction: column;
		border-bottom: 2rpx solid $ztd-color-bgcolor;
		&-list {
			display: flex;
			// height: 50rpx;
			padding: 10rpx 0rpx;
			.l,
			.r {
				font-size:26rpx;
			}
			.l {
				flex-wrap: nowrap;
				width: 140rpx;
			}
			.lflex {
				flex: 1;
			}
			.bold {
				font-weight: bold;
			}
		}
	}
	&-btns {
		height: 76rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10rpx;
		.box-btns-r,.box-btns-l,.swiper-box-btns-list{
			display: flex;
			align-items: center;
			.wraper-cks{
				display: flex;
				align-items: center;
				.imgeDef{
					width:40rpx;
					height: 40rpx;
					margin-right: 10rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.name {
			padding-left: 10rpx;
			padding-right: 20rpx;
		}
	}
}
</style>
