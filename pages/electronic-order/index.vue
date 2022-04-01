<template>
	<view class="electronic-order">
		<view class="electronic-list" :hidden="isCheckHadOrder">
			  <view v-if="isTeamMode" class="mail-type-tabs">
			    <view data-index="0" class="mail-type-tab " :class="tabData.tabIndex===0?'active':''" @click="tabChanged">全部（{{20}}）</view>
			   <!-- <view data-index="1" class="mail-type-tab {{tabData.tabIndex===1?'active':''}}" bindtap="tabChanged">个人（{{tabData.mine}}）</view>
			    <view data-index="2" class="mail-type-tab {{tabData.tabIndex===2?'active':''}}" bindtap="tabChanged">团队共享（{{tabData.team}}）</view> -->
			  </view>
			  <view v-if="false">
			    <view class="no-order-tip"><image src="/electronic-order/empty-order.png"></image><view>暂无面单</view></view>
			  </view>
			  <view class="order-list-box" :class="isTeamMode?'team-mode':''" v-else>
			    <view class="account-item"  >
			      <view class="account-info">
			        <view class="list-title">
			    <!--      <text wx:if="{{item.mail_platform=='qrcode'}}">二维码系统电子面单帐号</text>
			          <text wx:if="{{item.mail_platform=='baima'}}">白马电子面单账号</text>
			          <text wx:if="{{item.mail_platform=='bmzd'}}">专属快递员</text> -->
			          <text >同城电子面单账号</text>
								<!-- <text wx:if="{{item.mail_platform=='city_go'}}">同城电子面单账号</text> -->
			          <!-- <text wx:if="{{isTeamMode && item.mail_platform!=='bmzd'}}">{{item.owner===1?'（个人）':'（团队）'}}</text> -->
			        </view>
			        <!-- <view class="list-btn del-btn" data-account="{{item.platform_nickname}}" data-platform="{{item.mail_platform}}" bindtap="deleteMail" wx:if="{{item.owner===1}}"><image src="{{imagePath}}/set-bluetooth/delete.png"></image></view> -->
			      </view>
			      <view class="account-info">
			        <view class="left-text">网点账号</view>
			        <view>AAAAAAAAAAA</view>
			      </view>
			      <view class="account-info">
			        <view class="left-text">面单余量</view>
			        <view>222</view>
			      </view>
			      <view class="account-info" bindtap="toUseRecord">
			        <view>面单使用记录</view>
			        <view>
			          <view class="list-btn arrow-btn"><image src='/selfCenter/icon-arrowright.png'></image></view>
			        </view>
			      </view>
			<!--      <view class="account-info" wx:if="{{ isTeamMode && item.owner===1 && item.mail_platform!=='bmzd' }}">
			        <view>共享面单给团队成员使用</view>
			        <view>
			          <switch data-account="{{item.platform_nickname}}" data-platform="{{item.mail_platform}}" class='list-switch' checked="{{item.share_mail===1}}" bindchange="setShareMail"/>
			        </view>
			      </view> -->
			      <view class="account-info">
			        <view>是否使用该面单</view>
			        <view>
			          <switch :data-account="aaaaa" color="#FFD500" :data-platform="basdasda" class='list-switch' :checked="true"  @click="setUseMail"/>
			        </view>
			      </view>
			    </view>
			  </view>
			  <view class="bom-btn-box ">
			    <view bindtap="toAdd">新增电子面单号</view>
			    <!-- <view>申请快递员面单</view> -->
			  </view>
		</view>
		
		<!-- 添加网点帐号 -->
		<view class="add-account" :hidden="isAddaAcount">
		  <view class="add-account-tip">
		    <text v-if="accountType==='TwoAccount'">新增二维码系统电子面单帐号</text>
<!-- 		    <text wx:if="{{accountType==='BmAccount'}}">新增白马电子面单账号</text>
		    <text wx:if="{{accountType==='TcAccount'}}">新增同城电子面单账号</text> -->
		  </view>
		  <view class="add-account-box">
		      <view>
				    <view class='account-prompt'>账号</view>
		        <input class="account-input" placeholder-style="color:#ccc" type="number" maxlength="20" bindinput="enterAccount" :value="accountStr" placeholder="输入合作网点账号"/>
		      </view>
		      <view class="t-b">
				    <view class='account-prompt'>密码</view>
		        <input class="account-input" placeholder-style="color:#ccc" maxlength="50" bindinput="enterPass" :value="passStr" placeholder="输入电子面单接口联调密码"/>
		      </view>
		  </view>
		  <view class="account-btn" bindtap="bindAccount">提交</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAddaAcount:false,//添加帐号 
				isCheckHadOrder:true,//面单页
				isHadList:false,//是否有帐号
				isTeamMode:false,
				accountType:'TwoAccount',
				accountStr:'',
				passStr:'',
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.electronic-order{
		width: 100%;
		height: 100%;
		background-color: #F0F5F5;
		color: #444;
		position: relative;
		font-size: 26rpx;
		.no-order-tip{
		  width: 100%;
		  padding-top: 230rpx;
		  color: #888;
		  text-align: center;
		}
		.no-order-tip>image{
		  width: 260rpx;
		  height: 260rpx;
		}
		.electronic-list{
			
		}
		/* 列表 */
		.order-list-box{
		  width: 100%;
		  padding: 20rpx 30rpx 130rpx;
	
			.account-item {
			  background: white;
			  border-radius: 16rpx;
			  margin-bottom: 30rpx;
			  padding-left: 30rpx;
			}
			.account-info {
			  display: flex;
			  height: 100rpx;
				>view:nth-child(1) {
				  flex: 1;
				  color: #999;
				  line-height: 100rpx;
				}
				>view:nth-child(2) {
				  color: #222;
				  line-height: 100rpx;
				  display: flex;
				  align-items: center;
				}
				>view.left-text {
				  flex: none;
				  width: 200rpx;
				}
				>view.list-title text {
				  font-weight: bold;
				  font-size: 32rpx;
				  color: #222;
				}
				.list-btn {
				  width: 100rpx;
				  height: 100rpx;
				  text-align: right;
				  padding: 28rpx;
				  line-height: 0;
					
					image {
					  width: 44rpx;
					  height: 44rpx;
					}
				}
				.list-btn.del-btn {
				  transform: scale(0.8);
				}
				.list-switch {
				  transform: scale(0.7);
				}
			}
			.account-info:not(:last-child) {
			  border-bottom: solid 1rpx #eee;
			}
		}
		
		.bom-btn-box{
			width: 100%;
			padding: 20rpx 30rpx 40rpx;
			background: #fff;
			overflow: hidden;
			position: fixed;
			left: 0;
			bottom: 0;
			>view{
			  /* width: 48%; */
			  width: 100%;
			  height: 80rpx;
			  line-height: 80rpx;
			  border-radius: 40rpx;
			  text-align: center;
			  background: #FFD500;
			  float: left;
			}
			>view:nth-child(1){
			  margin-right: 4%;
			}
		}
		.mail-type-tabs {
		  display: flex;
		  padding: 20rpx 30rpx 0;
		  width: 100%;
		  position: fixed;
		  background-color: #f2f2f2;
		}
		.mail-type-tab {
		  height: 50rpx;
		  line-height: 50rpx;
		  border-radius: 25rpx;
		  padding: 0 10rpx 0 20rpx;
		  font-size: 24rpx;
		}
		.mail-type-tab.active {
		  color: #FFD500;
		  background-color: white;
		}
		.order-list-box.team-mode {
		  padding-top: 90rpx;
		}
		.add-account{
			/* 添加网点帐号 */
			.add-account-tip{
			  line-height: 120rpx;
			  text-align: center;
				text{
					font-size: 32rpx;
					color: #222;
				}
			}
			.add-account-box{
				width: 93%;
				height: 220rpx;
				background: #fff;
				box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.08);
				border-radius: 16rpx;
				padding: 0 20rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
				position: relative;
				margin-left: 30rpx;
				>view{
				  width: 100%;
				  height: 110rpx;
				  line-height: 110rpx;
				  overflow: hidden;
				}
				.t-b{
				  border-top: 1rpx solid #ededed;
				}
				.account-prompt,.account-input{
				  height: 110rpx;
				  line-height: 110rpx;
				  float: left;
				}
				.account-prompt{
				  color: #888;
				  margin-right: 60rpx;
					font-size: 30rpx;
				}
				.account-input{
				  width: 80%;
					font-size: 30rpx;
				}
			}
			.account-btn{
			  width: 93%;
			  text-align: center;
			  height: 80rpx;
			  line-height: 80rpx;
			  background: #FFD500;
			  border-radius: 40rpx;
			  font-weight: bold;
			  margin-top: 50rpx;
			  margin-left: 30rpx;
				font-size: 30rpx;
			}
		}
	
	}
</style>
