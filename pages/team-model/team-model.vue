<template>
	<view class="team">
		<view class="team-img"><image src="/static/img/notYeteam.png"></image></view>
		<view class="team-button">
			<ButtonBox 
				:title="'创建团队'" 
				:radius="'35rpx'" 
				height="70rpx" 
				width="650rpx" 
				@hanldChange="createTeam"></ButtonBox>
		</view>
		<view class="team-button">
			<ButtonBox 
				:title="'加入团队'" 
				:radius="'35rpx'" 
				:buttonborder="'1px solid #FDD605'" 
				buttonBgColor="#FFF" 
				height="70rpx" 
				width="650rpx" 
				@hanldChange="joinTeam"></ButtonBox>
		</view> 
		<uni-popup ref="showpopup" type="center" :animation="false">
			<view class="showModal" v-if="teamType=='creat'">
				<view class="showModal-title">设置团队名称</view>
				<view class="showModal-main flexW">
					<view class="input-box">
						<input class="showModal-main-input" maxlength="20" v-model="teamsiteCode" type="text" placeholder="请输入网点编码" />
					</view>
					<view class="input-box">
						<input class="showModal-main-input" maxlength="20" v-model="teamsiteName" type="text" placeholder="请输入网点名称" />
					</view>
					<view class="input-box">
						<input class="showModal-main-input" maxlength="20" v-model="teamName" type="text" placeholder="请输入团队名称" />
					</view>
				</view>
				<view class="showModal-btn">
					<view class="view" @click="selectCancel">取消</view>
					<view class="active" @click="selectConfirm">确定</view>
				</view>
			</view>
			<view class="showModal" v-else>
				<view class="showModal-title">申请加入团队</view>
				<view class="showModal-main">
					<view class="input-box">
						<input class="showModal-main-input" maxlength="20" v-model="teamId" type="text"  placeholder="请输入团队号或团队名称" />
					</view>
				</view>
				<view class="teamInfo" v-if="teamInfo.groupName">
					{{teamInfo.groupName}}
				</view>
				<view class="showModal-btn">
					<view class="view" @click="selectCancel">取消</view>
					<view class="active" @click="selectConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teamName:'',
				teamType:'',
				teamId:'',
				groupId:'',
				teamInfo:{},
				teamsiteCode:'',
				teamsiteName:'',
			};
		},
		onLoad() {
			let self = this;
			self.getWxGroupByOpenId()
		},
		watch: {
				teamId(newTxt){
					this.throttle(this.searcch, null, 500, newTxt);
				}
		},
		methods: {
			throttle(fn,context,delay,text){
					clearTimeout(fn.timer);
					fn.timer=setTimeout(() => {
							fn.call(context,text);
					},delay);
			},
			searcch(){
				let self = this;
				let _data ={
					groupId:self.teamId
				}
				self.$api.getWxGroupByIdOrName(_data).then(res =>{
					if(res.code ==200&&res.data!=null){
						self.teamInfo = res.data
						self.teamName = res.data.groupName;
						self.groupId = res.data.groupId;
						console.log(res.data)
						self.teamsiteCode=res.data.siteCode;
						self.teamsiteName=res.data.siteName;
					}else{
						uni.showToast({
							icon:'none',
							duration:1500,
							title:'未搜索到团队~'
						})
						self.teamInfo = {};
						self.teamName = '';
						self.groupId = '';
						self.teamsiteCode='';
						self.teamsiteName='';
					}
				})
			},
			getWxGroupByOpenId(){
				let self = this;
				self.$api.getWxGroupByOpenId().then(res =>{
					console.log(res)
					if(res.code ==200&&res.data!=null){
						self.$setStorageSync('teamInfo',res.data)
						// 创建成功跳转到个人团队列表
						let data = {
							groupId:res.data.groupId
						}
						uni.redirectTo({
							url: 'create-team?pageId=cjtd&data='+ JSON.stringify(data)
						})
					}
				})
			},
			createTeam() {
				this.teamType = 'creat'
				this.$nextTick(() => {
					this.$refs['showpopup'].open();
				})
			},
			joinTeam() {
				this.teamType = 'join'
				this.$nextTick(() => {
					this.$refs['showpopup'].open();
				})
			},
			selectCancel() {
				this.$refs['showpopup'].close();
			},
			selectConfirm() {
				let self = this;
				let openId = self.$getStorageSync('token')
				let userData = JSON.parse(self.$getStorageSync('userData'))
				console.log(userData)
				let _data={
					groupId:self.groupId,
					groupName:self.teamName,
					openId:openId,
					phone:userData.phone,
					nickName:userData.nickName,
					headimgurl:userData.headimgurl,
					status:1,
					blShare:0,
					createDate:'',
					updateDate:'',
					siteCode:self.teamsiteCode,
					siteName:self.teamsiteName,
					customerCode:'',
					customerName:''
				}
				if(self.teamType =='creat'){
					self.$api.createWxGroup(_data).then(res =>{
						console.log(res)
						if(res.code ==200){
							// 创建成功跳转到个人团队列表
							let _data ={
								groupId:res.data
							}
							uni.redirectTo({
								url: 'create-team?pageId=cjtd&data='+ JSON.stringify(_data)
							})
							this.$refs['showpopup'].close();
						}
					})
				}else{
					self.$api.addWxGroup(_data).then(res =>{
						console.log(res)
						if(res.code ==200){
							// 创建成功跳转到个人团队列表
							let _data ={
								groupId:res.data
							}
							uni.redirectTo({
								url: 'create-team?pageId=cjtd&data='+ JSON.stringify(_data)
							})
							this.$refs['showpopup'].close();
						}
					})
				}
			
			},
		}
	}
</script>

<style lang="scss">
	.team {
		width: 100%;
		
		&-img {
			width: 300rpx;
			height: 300rpx;
			margin: 100rpx auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
		&-button {
			margin-bottom: 40rpx;
			display: flex;
			justify-content: center;
		}
		
		.showModal {
			background-color: #FFFFFF;
			margin: 80rpx;
			padding: 20rpx 0;
			border-radius: 8rpx;
			
			&-title {
				text-align: center;
				color: $ztd-color-titlefont;
				font-size: 32rpx;
				margin-bottom: 50rpx;
			}
			
			&-main {
				display: flex;
				margin: 0 40rpx;
				.input-box{
					width: 100%;
					height: 80rpx;
					margin-bottom: 6rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				&-input {
					padding-left: 5rpx;
					width: 100%;
					height: 100%;
					border: 2rpx solid #999;
					display: inline-block;
				}
			}
			&-main.flexW{
				flex-wrap: wrap;
			}
			.teamInfo{
				margin: 0 40rpx;
			}
			&-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 80rpx;
				margin-left: 40rpx;
				margin-right: 40rpx;
				padding-bottom: 20rpx;
				.view {
					flex: 1;
					font-size: 32rpx;
				}
				.active {
					flex: 1;
					font-size: 32rpx;
					color: $ztd-color-primary;
					text-align: right;
				}
			}
		}
	}
</style>
