<template>
	<!-- 创建团队列表 -->
	<view class="createTeam">
		<!-- 吸顶团队名称 -->
		<view class="createTeam-info">
			<view class="createTeam-info-head" :class="myTeamInfo.status==0?'mb62':''">
				<view>{{teamInfo.groupName||''}}（{{memberList.length||''}}）</view>
				<view>团队号: {{teamInfo.groupId||''}}</view>
				<view class="width100" v-if="myTeamInfo.status!=0">面单余额: <text  class="text-weight" > {{myTeamInfo.quantity||0}}</text> </view>
			</view>
			<view class="createTeam-info-btn">
				<view class="createTeam-info-btn-menu" style="position: relative;" v-for="(item,index) in createTeamList" :key="index" @click="createPath(item)">
					<image class="" :src="item.icon"></image>
					<button v-if="item.pageId =='yqhyjr'"  open-type='share'  style="position:absolute;top:0;width:160rpx;height:100rpx;opacity: 0;left:15%;"></button>
					<view class="">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 队员列表 --> 
		<view class="nav-search">
			<InputSearch 
			   :isLeft="true" 
				 :isRight="false" 
			   :itype="'text'"
			   :boxStyle="boxStyle"
				  @touchLeft="search_Member"
			   v-model="search_val"
			   :placeholder="'请输入团员名称'"
			 ></InputSearch>
		</view>
		<view class="main-view">
		
			<scroll-view class="createTeam-scroll" scroll-y>
				<view class="createTeam-scroll-list" v-for="(item,index) in memberList" :key="index">
					<view class="list">
						<image class="list-img" :src="item.headimgurl"></image>
						<view class="list-main">
							<view class="list-main-lie">
								<text>{{item.nickName}}</text>
								<text class="Super" v-if="item.status==0">待审核</text>
								<text class="Super" v-if="item.status==1">超级管理员</text>
								<text class="Super" v-if="item.status==2">管理员</text>
								<text class="Super" v-if="item.status==3">普通成员</text>
								<text class="mi" v-if="item.openId==accountId">我</text>
							</view>
							<view class="list-main-time">最后操作时间：{{item.updateDate}}</view>
						</view>
					</view>
					<view class="operating" @click.stop="moreMenu(item,'setMore')" v-if="myTeamInfo.status==1&&item.openId!=accountId&&item.status!=0">
						<image class="operate" src="../../static/img/operate.png"   mode=""></image>
					</view> 
					<view class="operating" @click.stop="moreMenu(item,'setMyself')"  v-if="item.openId==accountId&&item.status!=0" >
						<image class="operate" src="../../static/img/operate.png"  mode=""></image>
					</view>
					<view class="red" v-if="item.status==0&&myTeamInfo.status==1" @click="auditMember(item)">审核</view>
				</view>
			</scroll-view>
		</view>
		<uni-popup :type="'bottom'" ref="showpopup1">
			<AlertMenu :menuList='menuList' @selectOperat="selectOperat"  @cancel = 'cancelMenu'></AlertMenu>
		</uni-popup>
		<uni-popup type="center" ref="showpopup2">
			<view class="wraper">
				<view class="title">{{teamInfo.groupName}}</view>
				<view class="mainImg">
					<image :src="'data:image/png;base64,'+ewmUrl" mode=""></image>
				</view>
				<view class="text">微信扫码加入团队</view>
			</view>
		</uni-popup>
		<uni-popup ref="showpopup" type="center" :animation="false">
			<view class="showModal">
				<view class="type-wraper" v-if="operate=='szbz'">
					<view class="showModal-title">设置备注</view>
					<view class="showModal-main">
						<input class="showModal-main-input" maxlength="20" v-model="memberName" type="text" placeholder="请输入备注名称" />
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='szqx'">
					<view class="showModal-title">设置权限<view class="tips">设置 {{selectItem.nickName}} 的权限</view></view>
					<view class="showModal-main">
						<view class="row">
							<view class="radio-box" @click.stop="selectRadio(2)">
								<image src="/static/img/radio-check.png" v-if="memberStatus==2"></image>
								<image src="/static/img/check.png" v-else></image>
							</view>
							<view class="content">
								<view class="text">管理员</view>
								<view class="text">可查看管理团队内所有订单信息</view>
							</view>
						</view>
						<view class="row">
							<view class="radio-box" @click.stop="selectRadio(3)">
								<image src="/static/img/radio-check.png" v-if="memberStatus==3"></image>
								<image src="/static/img/check.png" v-else></image>
							</view>
							<view class="content">
								<view class="text">普通权限</view>
								<view class="text">仅可查看管理自己的订单信息</view>
							</view>
						</view>
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='yctd'">
					<view class="showModal-title">移除团队</view>
					<view class="showModal-main" style="justify-content: center;">
						确定要将 {{selectItem.nickName}} 移除团队吗?
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='sh'">
					<view class="showModal-title">{{selectItem.nickName}}申请加入</view>
					<view class="showModal-main">
						<input class="showModal-main-input" maxlength="20"  v-model="memberName" type="text" placeholder="设置备注(非必填)" />
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='jstd'">
					<view class="showModal-title">解散团队</view>
					<view class="showModal-main">
						<input class="showModal-main-input" v-model="teamName" type="text" placeholder="请输入该团队名称" />
					</view>
					<view class="mainTips" >团队所有订单将无法找回，请谨慎操作</view>
				</view>
				<view class="type-wraper" v-if="operate=='xgtdmc'">
					<view class="showModal-title">修改团队名称</view>
					<view class="showModal-main">
						<input class="showModal-main-input" maxlength="20" v-model="teamName" type="text" placeholder="请输入该团队名称" />
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='szgxdzmd'">
					<view class="showModal-title">设置共享电子面单</view>
					<view class="showModal-main flexSb">
						<view class="name">是否共享电子面单</view>	
						<view class="switch"> <switch  class='list-switch' color="#FFD500" :checked="hasShare"  @click="setUseMail"/></view>
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='sfxyrtsp'">
					<view class="showModal-title">设置是否需要入团审批</view>
					<view class="showModal-main flexSb">
						<view class="name">是否需要入团审批</view>	
						<view class="switch"> <switch  class='list-switch' color="#FFD500" :checked="hasAudit"  @click="setAudit"/></view>
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='tctd'">
					<view class="showModal-title">退出团队</view>
					<view class="showModal-main">
						退出之后将不能查看团队订单，确定要退出 {{myTeamInfo.groupName}} 团队吗？
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='ghtd'">
					<view class="showModal-title">加入团队确认</view>
					<view class="showModal-main">
						您已加入【{{oldTeam.groupName}}】团队，是否退出后加入【{{teamInfo.groupName}}】？
					</view>
				</view>
				<view class="type-wraper" v-if="operate=='fxtd'">
					<view class="showModal-title">申请加入团队</view>
					<view class="showModal-main">
						您是否想要加入 {{teamInfo.groupName}} 团队吗？
					</view>
				</view>
				<view class="showModal-btn">
					<view class="view" @click="selectCancel">{{operate=='sh'?'拒绝':'取消'}}</view>
					<view class="active" @click="selectConfirm" v-if="operate!='jstd'">{{operate=='sh'?'同意':'确定'}}</view>
					<view class="active" @click="selectConfirm" v-if="operate=='jstd'">确认解散</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import AlertMenu from '@/components/alert-menu/alert-menu.vue'
	export default {
		components: {
			AlertMenu
		},
		data() {
			return {
				menuList:[
					{name:'修改团队名称',id:'xgtdmc'},
					{name:'设置权限',id:'szqx'},
					{name:'设置备注',id:'szbz'},
					{name:'移除团队',id:'yctd'},
				],
				createTeamList: [
					{
						icon: '/static/img/QRCode.png',
						name: '团队二维码',
						path: '',
						pageId: 'tdewm'
					},
					{
						icon: '/static/img/invite.png',
						name: '邀请好友加入',
						path: '',
						pageId: 'yqhyjr'
					},
					{
						icon: '/static/img/set.png',
						name: '设置',
						path: '',
						pageId: 'tdsz'
					},
				],
				memberList:[],
				teamInfo:{},
				operate:'',
				memberName:'',
				memberStatus:3,
				selectItem:{},
				currentState:null,
				accountId:'',
				myTeamInfo:{},
				teamName:'',
				hasShare:false,
				hasAudit:true,
				ewmUrl:'',
				shareId:'',
				pageId:'',
				oldTeam:{},
				search_val:''
			}
		},
		onLoad(options) {
			let self = this;
			let userData = self.$getStorageSync('userData')
			if(typeof(userData) == "undefined"){
				uni.showModal({
					title:"提示",
					content:"请先登录授权~",
					success:function(res) {
						if(res.confirm) {
							uni.switchTab({
								url:"/pages/tabbar/my/index?pageId=send"
							})
						}else if(res.cancel){
							uni.switchTab({
								url:"/pages/tabbar/home/index?pageId=send"
							})
						}
					}
				})
				return false;
			}
			if(options.q){
				let ewmDataStr = decodeURIComponent(options.q);
				console.log('ewmDataStrD',ewmDataStr)
				let index = ewmDataStr.indexOf("scanGroup/");
				ewmDataStr = ewmDataStr.substring(index + 10, ewmDataStr.length);
				self.shareId = ewmDataStr;
				self.pageId = 'fxtd';
				self.getWxGroupByIdOrName(self.shareId);
			}
			let _data;
			 try{
				_data = JSON.parse(options.data);
			}catch(err){
				console.log(err)
			}
			self.accountId = self.$getStorageSync('token')
			self.getWxGroupByOpenId()
			self.shareId = _data.teamCode;
			self.pageId = options.pageId
			if(options.pageId !='fxtd'){
				self.getWxGroupList(_data.groupId)
				self.getWxGroupByIdOrName(_data.groupId)
			}else{
				self.getWxGroupByIdOrName(self.shareId);
			}
			uni.hideShareMenu()
		},
		onShow() {
			
		},
		  /**
		   * 用户点击右上角分享
		   */
		onShareAppMessage: function (e) {
			let self =this;
			let _data ={
				teamCode:self.teamInfo.groupId
			}
				return {
				title: '邀请你加入'+self.teamInfo.groupName+'团队',
				path: 'pages/team-model/create-team?pageId=fxtd&data='+JSON.stringify(_data),//分享携带参数
				// imageUrl: imgurl + '/team/teamShareIcon.png'
			} 
		},
		methods: {
			getWxGroupByOpenId(){
				let self = this;
				self.$api.getWxGroupByOpenId().then(res =>{
					console.log(res)
					if(res.code ==200){
						if(res.data!=null){
							if(self.pageId=='fxtd'){
								if(res.data.status !=0){
									uni.showToast({
										icon:'none',
										duration:1500,
										title:'您已加入团队：'+res.data.groupName
									})
									setTimeout(()=>{
										uni.switchTab({
											url:'/pages/tabbar/home/index'  
										})
									},1500)
								}else{
									self.oldTeam = res.data;
									self.operate = 'ghtd'//更换团队
									self.$refs['showpopup'].open();
								}
							}else{
								self.myTeamInfo = res.data
								// self.$setStorageSync('teamInfo',res.data)
							}
						}else{
							if(self.pageId=='fxtd'){
								self.operate = 'fxtd'
								self.$refs['showpopup'].open();
							}
						}
						
					}else{
						
					}
				})
			},
			search_Member(){
				let self = this;
				self.getWxGroupList(self.teamInfo.groupId,self.search_val)
			},
			setUseMail(){
				let self = this;
				self.hasShare = !self.hasShare
			},
			setAudit(){
				let self = this;
				self.hasAudit = !self.hasAudit
			},
			// 获取个人团队信息
			// getWxGroupByOpenId(){
			// 	let self = this;
			// 	self.$api.getWxGroupByOpenId().then(res =>{
			// 		console.log(res)
			// 		if(res.code ==200&&res.data!=null){
			// 			// 创建成功跳转到个人团队列表
						
			// 		}
			// 	})
			// },
			addTeam() {
				let self = this;
				let openId = self.$getStorageSync('token')
				let userData;
				 try{
						userData = JSON.parse(self.$getStorageSync('userData'))
					}catch(err){
						console.log(err)
					}
				// console.log(userData)
				console.log('teamInfo',self.teamInfo)
				let _data={
					groupId:self.teamInfo.groupId,
					groupName:self.teamInfo.groupName,
					openId:openId,
					phone:userData.phone,
					nickName:userData.nickName,
					headimgurl:userData.headimgurl,
					status:1,
					blShare:0,
					blAudit:1,
					createDate:'',
					updateDate:'',
					siteCode:self.teamInfo.siteCode,
					siteName:self.teamInfo.siteName,
					customerCode:'',
					customerName:''
				}
				self.$api.addWxGroup(_data).then(res =>{
					console.log(res)
					if(res.code ==200){
						// 创建成功跳转到个人团队列表
						self.getWxGroupList(self.teamInfo.groupId)
						self.$refs['showpopup'].close();
					}
				})
			},
			// 点击取消
			selectCancel(){
				let self = this;
				self.teamName = '';
				self.memberName = '';
				if(self.pageId =='fxtd'){
					uni.switchTab({
						url:'/pages/tabbar/home/index'
					})
					self.$refs['showpopup'].close();
				}else if(self.operate =='sh'){
					let _data = {
						openId:self.selectItem.openId,
						groupId:self.teamInfo.groupId
					}
					self.$api.turnDownWxGroup(_data).then(res =>{
						if(res.code ==200){
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'拒绝成功~'
							})
							self.getWxGroupList(self.teamInfo.groupId)
							self.memberName = '';
							self.$refs['showpopup'].close();
						}
					})
				}else{
					self.$refs['showpopup'].close();
				}
			},
			selectRadio(num){
				let self = this;
				self.memberStatus = num;
			},
			//订单更多操作
			moreMenu(item,type){
				let self = this;
				if(type=='setMore'){
					self.menuList = [{name:'设置备注',id:'szbz'},{name:'设置权限',id:'szqx'},{name:'移除团队',id:'yctd'}]
				}else if(type=='setMyself'){
					self.menuList = [{name:'设置备注',id:'szbz'}]
				}
				self.$refs['showpopup1'].open();
				self.selectItem = item;
			},
			cancelMenu(){
				let self = this;
				self.$refs['showpopup1'].close();
			},
			// 选项提交
			selectConfirm(){
				let self = this;
				if(self.operate == 'szbz'){
					let _data = {
						openId:self.selectItem.openId,
						nickName:self.memberName,
						groupId:self.teamInfo.groupId
					}
					self.$api.updateNickName(_data).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.memberName = '';
							self.$refs['showpopup'].close();
						}
					})
				}else if(self.operate == 'szqx'){
					let _data = {
						openId:self.selectItem.openId,
						status:self.memberStatus,
						groupId:self.teamInfo.groupId
					}
					self.$api.updateSatus(_data).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.$refs['showpopup'].close();
						}
					})
				}else if(self.operate == 'yctd'){
					let _delete = {
						openId:self.selectItem.openId,
						groupId:self.teamInfo.groupId
					}
					self.$api.deleteWxGroup(_delete).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.$refs['showpopup'].close();
							// uni.redirectTo({
							// 	url: 'team-model?pageId=td'
							// })
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'移除团队失败~'
							})
						}
					})
				}else if(self.operate == 'sh'){
					let _data ={
						openId:self.selectItem.openId,
						groupId:self.teamInfo.groupId
					}
					self.$api.auditWxGroup(_data).then(res =>{
						if(res.code == 200){
							if(self.memberName!=''){
								let addName = {
									openId:self.selectItem.openId,
									nickName:self.memberName,
									groupId:self.teamInfo.groupId
								}
								self.$api.updateNickName(addName).then(res =>{
									if(res.code ==200){
										self.getWxGroupList(self.teamInfo.groupId)
										self.memberName = '';
										self.$refs['showpopup'].close();
									}
								})
							}else{
								self.getWxGroupList(self.teamInfo.groupId)
								self.memberName = '';
								self.$refs['showpopup'].close();
							}
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'审核失败，请重试~'
							})
						}
					})
				}else if(self.operate == 'jstd'){
						if(self.myTeamInfo.groupName == self.teamName){
							let _empty = {
									groupId:self.myTeamInfo.groupId
								}
								self.$api.emptyWxGroup(_empty).then(res =>{
									if(res.code ==200){
										self.$removeStorageSync('teamInfo')
										self.$setStorageSync('teamModel','2')
										uni.switchTab({
											url:'/pages/tabbar/home/index'  
										})
									}else{
										uni.showToast({
											icon:'none',
											duration:1500,
											title:'解散团队失败~'
										})
									}
							})
					}else{
						uni.showToast({
							icon:'none',
							duration:1500,
							title:'团队名称不一致~'
						})
					}
				}else if(self.operate == 'xgtdmc'){
					let _data = {
						groupId:self.selectItem.groupId,
						groupName:self.teamName,
						groupId:self.teamInfo.groupId
					}
					self.$api.editGroupName(_data).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.getWxGroupByIdOrName(_data.groupId)
							self.teamName = '';
							self.$refs['showpopup'].close();
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'修改团队名称失败~'
							})
						}
					})
				}else if(self.operate == 'szgxdzmd'){
					let _data = {
						groupId:self.selectItem.groupId,
						blShare:self.hasShare?1:0
					}
					self.$api.editGroupBlShare(_data).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.$refs['showpopup'].close();
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'面单共享失败~'
							})
						}
					})
				}else if(self.operate == 'sfxyrtsp'){
					let _data = {
						groupId:self.selectItem.groupId,
						blAudit:self.hasAudit?1:0
					}
					self.$api.editGroupBlAudit(_data).then(res =>{
						if(res.code ==200){
							self.getWxGroupList(self.teamInfo.groupId)
							self.$refs['showpopup'].close();
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'入团审批开关失败~'
							})
						}
					})
				}else if(self.operate == 'tctd'){
					let _delete = {
						openId:self.selectItem.openId,
						groupId:self.teamInfo.groupId
					}
					self.$api.deleteWxGroup(_delete).then(res =>{
						if(res.code ==200){
							self.$refs['showpopup'].close();
							self.$removeStorageSync('teamInfo')
							self.$setStorageSync('teamModel','2')
							uni.switchTab({
								url:'/pages/tabbar/home/index'  
							})
						}else{
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'退出团队失败~'
							})
						}
					})
				}else if(self.operate =='fxtd'){
					// self.$refs['showpopup'].close();
					self.addTeam()
				}else if(self.operate =='ghtd'){
					// self.$refs['showpopup'].close();
					let _delete = {
						openId:self.oldTeam.openId,
						groupId:self.oldTeam.groupId
					}
					self.$api.deleteWxGroup(_delete).then(res =>{
						if(res.code ==200){
							self.addTeam()
						}else{ 
							uni.showToast({
								icon:'none',
								duration:1500,
								title:'更换团队失败~'
							})
						}
					})
				}
			},
			auditMember(item){
				let self = this;
				console.log(item)
				self.operate = 'sh';
				self.$refs['showpopup'].open();
				self.selectItem = item;
			},
			// 菜单选择
			selectOperat(data){
				let self = this;
				switch(data.item.id) {
				  case 'szbz':
						self.operate = 'szbz';
						self.$refs['showpopup'].open();
						self.memberName = self.selectItem.nickName
				    break;
				  case 'szqx':
						self.operate = 'szqx';
						self.$refs['showpopup'].open();
						self.memberStatus = self.selectItem.status
						break;
				  case 'yctd':
						self.operate = 'yctd';
						self.$refs['showpopup'].open();
					  break;
					case 'jstd':
						self.operate = 'jstd';
						self.$refs['showpopup'].open();
						break;
					case 'tctd':
						self.operate = 'tctd';
						self.$refs['showpopup'].open();
						break;
					case 'xgtdmc':
						self.operate = 'xgtdmc';
						self.$refs['showpopup'].open();
						self.teamName = self.selectItem.groupName
						break;
					case 'szgxdzmd':
						self.operate = 'szgxdzmd';
						self.$refs['showpopup'].open();
						break;
					case 'sfxyrtsp':
						self.operate = 'sfxyrtsp';
						self.$refs['showpopup'].open();
						break;
				  default:
					
				}
				self.$refs['showpopup1'].close();
			},
			// 获取团队列表
			getWxGroupList(data,nickName){
				let self = this;
				let _data;
				if(nickName){
					 _data ={
						groupId:data,
						nickName:nickName?nickName:null
					}
				}else{
					 _data ={
						groupId:data,
					}
				}
				self.$api.getWxGroupList(_data).then(res =>{
					if(res.code ==200&&res.data.length>0){
						self.memberList = res.data.map(item =>{
							if(item.status==3){
								item.sort = 1
							}
							if(item.status==0){
								item.sort = 2
							}
							if(item.openId==self.accountId){
								item.sort = 3
							}
							if(item.status==2){
								item.sort = 4
							}
							if(item.status==1){
								item.sort = 5
							}
							return item
						}).sort((a,b) =>{return b.sort - a.sort;});
						console.log(self.memberList)
					}
				})
			},
			// 获取团队信息
			getWxGroupByIdOrName(data){
				let self = this;
				let _data ={
					groupId:data
				}
				self.$api.getWxGroupByIdOrName(_data).then(res =>{
					if(res.code ==200&&res.data!=null){
						self.teamInfo = res.data;
						self.hasShare =  res.data.blShare==0?false:true;
						self.hasAudit =  res.data.blAudit==1?true:false;
					}else{
						uni.showToast({
							icon:'none',
							duration:1500,
							title:'未搜索到团队~'
						})
					}
				})
			},
			// 选项
			createPath(item) {
				let self = this;
				if(item.pageId == 'tdewm') {
					// 团队二维码 -- 弹窗显示团队二维码
					self.$refs['showpopup2'].open();
					let _data = {
						groupId:self.teamInfo.groupId
					}
					self.$api.generateGroupQrCode(_data).then(res =>{
						if(res.code == 200){
							self.ewmUrl = res.data
						}
					})
					
				} else if(item.pageId == 'yqhyjr') {
					// 邀请好友加入 -- 分享
					
				} else {
					// 设置
					if(self.myTeamInfo.status ==1){
						self.menuList = [{name:'设置共享电子面单',id:'szgxdzmd'},{name:'解散团队',id:'jstd'},{name:'修改团队名称',id:'xgtdmc'},{name:'设置是否需要入团审批',id:'sfxyrtsp'}]
					}else{
						self.menuList = [{name:'退出团队',id:'tctd'}]
					}
					self.$refs['showpopup1'].open();
					self.selectItem = self.myTeamInfo;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.createTeam {
		background-color: $ztd-color-bgcolor;
		// height: 100%;
		.text-weight{
			font-size: 28rpx;
			font-weight: bold;
			margin-left: 10rpx;
		}
		.width100{
			width: 100%;
			height:50rpx;
			line-height: 50rpx;
			margin:6rpx 0;
		}
		.mb62{
			margin-bottom: 62rpx;
		}
		&-info {
			padding: 20rpx;
			background-color: $ztd-color-white;
			border-bottom: 2rpx solid $ztd-color-block;
			position: fixed;
			left: 0;
			right: 0;
			z-index: 999;
			&-head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
			}
			&-btn {
				display: flex;
				align-items: center;
				&-menu {
					width: 33%;
					text-align: center;
					image {
						width: 40rpx;
						height: 40rpx;
						margin-bottom: 10rpx;
					}
					view {
					}
				}
			}
		}
		.operating{
			width: 50rpx;
			height: 50rpx;
		}
		.nav-search{
			position: fixed;
			top: 226rpx;
			left: 0;
			width: 100%;
			height: 100rpx;
			padding:10rpx 20rpx;
			z-index: 9;
			background-color: #f5f5f5;
		}
		.main-view{
			padding-top: 320rpx;
			height:100%;
			width: 100%;
		}
		&-scroll {
			height: 100%;
			width: 100%;
			&-list {
				margin:0 20rpx 20rpx;
				background-color: $ztd-color-white;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				
				.list {
					display: flex;
					align-items: center;
					&-img {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
					}
					&-main {
						&-lie {
							font-size: 30rpx;
							margin-bottom: 10rpx;
							
							.Super {
								color: $ztd-color-primary !important;
								margin: 0 20rpx;
							}
							
							.mi {
								display: inline-block;
								width: 40rpx;
								line-height: 40rpx;
								text-align: center;
								border-radius: 8rpx;
								background-color: $ztd-color-primary;
								color: $ztd-color-block;
							}
						}
						&-time {
							font-size: 26rpx;
							color: $ztd-color-listfont;
						}
						
					}
				}
				.red {
					color: $ztd-color-warning;
				}
			}
		}
		.wraper{
			width: 560rpx;
			height: 700rpx;
			background-color: #fff;
			margin: 0 auto;
			padding: 0 30rpx;
			text-align: center;
			.title{
				padding: 20rpx 0;
				font-size:30rpx;
			}
			.mainImg{
				width: 500rpx;
				height: 500rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.text{
			}
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
				.tips{
					color: #777;
					font-size: 26rpx;
					margin-top: 10rpx;
				}
			}
			.mainTips{
				font-size: 26rpx;
				margin: 10rpx 40rpx;
				color: #777;
			}
			&-main {
				display: flex;
				flex-wrap: wrap;
				margin: 0 40rpx;
				.list-switch {
				  transform: scale(0.7);
				}
				.row{
					display: flex;
					justify-content: flex-start;
					width: 100%;
					.content{
						margin-left: 20rpx;
						.text{
							font-size: 28rpx;
							margin-bottom: 20rpx;
						}
					}
					.radio-box{
						width: 40rpx;
						height: 40rpx;
					}
				}
				&-input {
					padding-left: 5rpx;
					width: 100%;
					height: 80rpx;
					border: 2rpx solid $ztd-color-block;
				}
				
			}
			.flexSb{
				justify-content: space-between;
				align-items: center;
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
