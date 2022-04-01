<template>
	<view class="real-list">
		<view id="wraper">    
			<view class="item-box" > 
				<view class="item isSend"  bindtap="clickItem"   >   
					<view class="item-sub">
						<view class="user-info">
							<view class="view-p">
								<text class="text">姓名: {{item.REAL_NAME}}</text>   
							</view>
							<view class="view-p">
								<text class="text">电话: {{item.PHONE}}</text>
							</view>
							<view class="address-del view-p">
								<text class="text">{{item.REAL_ID_CODE}}</text>
							</view>
						</view> 
						<view class="img-wraper">
								<view class="img-line"></view>
								<image src="../images/edit.png" alt="" class="edit-img"/>
								<view class="img-line"></view>
								<image src="../images/del.png" alt="" class="remove-img"/> 
						</view> 
					</view>
				</view> 
			</view> 
			</view>
		<view class="foot_btn" >
		    <view class="address_add" bindtap="newRealId" > <a href="javascript:void(0)">新增实名</a></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.real-list{
		position: relative;
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		overflow-y: auto;
		padding-bottom: 110rpx;
		color: #444;
		font-size: 26rpx;
		
	}
	
</style>
