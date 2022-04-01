<template>
	<!-- 地址簿 -->
	<view class="myaddress">
		<view class="myaddress-nav">
			<!-- 搜索 -->
			<view class="myaddress-nav-search">
				<InputSearch 
				   :isLeft="true" 
					 :isRight="false" 
				   :itype="'text'"
				   :boxStyle="boxStyle"
				   v-model="search_val"
				   :placeholder="'请输入姓名或电话号码'"
					 @touchLeft="search_valMethod"
					 @confirm ="confirm_search"
				 ></InputSearch>
			</view>
			
			<!-- tab -->
			<view class="myaddress-nav-tab">
				<view class="tab-title" :class="tabIndex==0? 'linesel':''" @click="tabsChange(0)">
					寄件人
				</view>
				<view class="tab-title" :class="tabIndex==1? 'linesel':''" @click="tabsChange(1)">
					收件人
				</view>
			</view>
	
		</view>
		<swiper class="swiper" :current="tabIndex" @change="swiperChange">
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-view">
					<AddressList 
							:defaultAddress = 'true'
					   @selectAddress="selectAddress"
						 @sendsAddress="sendsAddress"
					   @delte_address="delte_address"
						 @editDefault="editDefault" 
					   @editor_address="operation_address" 
					   :addressData="addressDataJJ"/>
						 <view class="margin-bot">
						 	
						 </view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-view">
					<AddressList 
							:defaultAddress = 'false'
					   @selectAddress="selectAddress"
						 @sendsAddress="sendsAddress"
					   @delte_address="delte_address"
						 @editDefault="editDefault" 
					   @editor_address="operation_address" 
					   :addressData="addressDataSJ"/>
						 <view class="margin-bot">
						 	
						 </view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- btn -->
		<view class="myaddress-btn">
			<!-- <ButtonBox :title="'新增地址'" fontSize="28rpx" :radius="'35rpx'" :width="'80%'"  :height="'70rpx'"   ></ButtonBox> -->
			<view class="send" v-if="type=='jjr'||pageId=='send'">
				<view class="submit" @click="operation_address({type:'tj'})">新增地址</view>
			</view>
			<view class="sends" v-else>
				<view class="submit" @click="operation_address({type:'tj'})">新增地址</view>
				<view class="submit confirm " @click="confirm">确认({{sendsRecData.length}})</view>
			</view>
		</view>
	</view>
</template>

<script>
	let self,timer=null;
	import AddressList from "./components/address-list.vue";
	export default {
		data() {
			return {
				search_val:"",
				tabList:[{name:"寄件人",id:0},{name:"收件人",id:1}],
				tabIndex:0,
				boxStyle:{"border-radius":"40rpx"},
				pageId:"jjr",
				addressDataJJ:[],
				copy_addressDataJJ:[],
				addressDataSJ:[],
				copy_addressDataSJ:[],
				// sendsRecData:[],
				type:'',//这个type判断是否为寄件人
				guidArry:[]
			};
		},
		onLoad(options){
			 self = this;
			 console.log(options)
			 this.pageId = options.pageId;
			 let _data = JSON.parse(options.data);
			 this.tabIndex = _data.tabIndex;
			 this.type = _data.tabIndex=='1'?'sjr':'jjr';
			 if(_data.guidArry){
				 self.guidArry = _data.guidArry
			 }
		},
		onShow(){
			this.getAddress(); //根据类型查询地址薄	
		},
		components:{ 
			AddressList
		},
		computed:{
			 sendsRecData:function(){
				 let obj ={
					 '0':this.addressDataJJ,
					 '1':this.addressDataSJ
				 }
				 console.log(obj[this.tabIndex])
				 return obj[this.tabIndex].filter(item =>{
					 return  item.ck==true
				 })
			 },
			 
		},
		
		onUnload(){
			uni.hideLoading();
		},
		methods:{
			// 确认
			confirm(){
				uni.navigateBack({delta:1});
				uni.$emit('selectAddress',this.sendsRecData)
			},
			selectAddress(obj){
				let self = this	
				let {index,item} = obj;
				if(self.type=='jjr'||self.pageId=='send'){
					uni.navigateBack({delta:1});
					uni.$emit('selectAddress',item)
				}else{
						let obj ={
							 '0':this.addressDataJJ,
							 '1':this.addressDataSJ
						}
						obj[this.tabIndex][index].ck = !obj[this.tabIndex][index].ck
						let tempObj = obj[this.tabIndex][obj[this.tabIndex].length-1]
						obj[this.tabIndex].pop();
						obj[this.tabIndex].push(tempObj)
						// if(this.tabIndex =='0'){
						// 	self.addressDataJJ[index].ck = !self.addressDataJJ[index].ck
						// 	let tempObj = this.addressDataJJ[this.addressDataJJ.length-1]
						// 	this.addressDataJJ.pop();
						// 	this.addressDataJJ.push(tempObj)
						// }else if(this.tabIndex =='1'){
						// 	self.addressDataSJ[index].ck = !self.addressDataSJ[index].ck
						// 	let tempObj = this.addressDataSJ[this.addressDataSJ.length-1]
						// 	this.addressDataSJ.pop();
						// 	this.addressDataSJ.push(tempObj)
						// }
				}
			},
			// 搜索
			search_valMethod(val){
				if(timer != null){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					let obj = {
							blType:this.tabIndex,
							pageNum:1,
							pageSize:100,
							name:self.search_val,
							phone:self.search_val
						};
					this.getAddressUrl(obj)
				},500);
			},
			confirm_search(){
				this.search_valMethod()
			},
			//默认地址
			editDefault(obj){
				let self = this;
				let {index,item} = obj;
				console.log(obj)
				let _data = {
					guid:item.guid
				}
				self.$api.editDefault(_data).then(res =>{
					if(res.code ==200){
						uni.showToast({icon:"none",title:'修改成功~'});
						self.getAddress()
					}else{
						uni.showToast({icon:"none",title:'修改失败~'});
					}
				})
			},
			// 删除地址
			delte_address(obj){
				let self = this;
				let {index,item} = obj;
				uni.showModal({
					title:"提示",
					content:"确定要删除该地址吗?",
					success:function(res) {
						if(res.confirm) {
							self.$api.delAddress({guid:item.guid}).then(res=>{
								if(res.code ==200){
									if(self.tabIndex == '0'){
										//寄件人
										self.addressDataJJ.splice(index,1);
									}else if(self.tabIndex == '1'){
										//收件人
										self.addressDataSJ.splice(index,1);
									}
								}
							})
						}
					}
				})
			},
			//添加,编辑地址
			operation_address(obj){
				let addId ;
				if(this.tabIndex == '0'){
					//寄件人
					addId = 'jjr';
				}else if(this.tabIndex == '1'){
					//收件人
					addId = 'sjr'
				}
				uni.navigateTo({
					url:"/pages/newaddress/index?pageId="+addId+'&data='+JSON.stringify(obj)
				})
			},
			getAddressUrl(obj){
				let self = this;
				this.$api.getAddress(obj).then(res=>{
						console.log(res)
					if(res.code == 200){
						if(self.tabIndex == '0'){
							self.addressDataJJ = res.data.data;
							self.copy_addressDataJJ = res.data.data;
							if(this.type=='sjr'&&this.pageId=='sends'){
								res.data.data.forEach(item =>{
									if(self.guidArry.length>0&&self.guidArry.indexOf(item.guid) != -1){
											item.ck = true
									}else{
										item.ck = false
									}
								})
								self.addressDataJJ = res.data.data;
								self.copy_addressDataJJ = res.data.data;
							}
						}else if(self.tabIndex == '1'){
							self.addressDataSJ = res.data.data;
							self.copy_addressDataSJ = res.data.data;
							if(this.type=='sjr'&&this.pageId=='sends'){
								res.data.data.forEach((item,index) =>{
									console.log('self.guidArry',self.guidArry)
									if(self.guidArry.length>0&&self.guidArry.indexOf(item.guid) != -1){
											item.ck = true
									}else{
										item.ck = false
									}
								})
								self.addressDataSJ = res.data.data;
								self.copy_addressDataSJ = res.data.data;
							}
						}
					}
				})
			},
			// 查询地址
			getAddress(){
			    let obj = {
							blType:this.tabIndex,
							pageNum:1,
							pageSize:80,
						};
				this.getAddressUrl(obj)
			},
		
			swiperChange(event){
				let detail = event.detail;
				this.tabIndex = detail.current;
				this.getAddress();
				// if(!(this.addressDataJJ.length && this.addressDataSJ.length)){
					
				// }
			},
			tabsChange(index){
				this.tabIndex = index;
				console.log(this.tabIndex)
				// if(!(this.addressDataJJ.length && this.addressDataSJ.length)){
					
				// }
				this.getAddress();
			},
			selectTabItem(item){
				this.tabIndex = item.id;
				this.getAddress();
				// if(!(this.addressDataJJ.length && this.addressDataSJ.length)){
					
				// }
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{height: 100%;}
.myaddress{
	width: 100%;
	height: 100%;
	overflow: hidden;
	padding-bottom: 100rpx;
	background-color: $ztd-color-bgcolor;
	&-nav{
		// height: 120rpx;
		background-color: $ztd-color-white;
		width: 100%;
		z-index: 9999;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		&-search{
			width: 100%;
			height: 110rpx;
			padding:10rpx 20rpx;
		}
		&-tab{
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.tab-title{
				width: 50%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
			}
			
		}
	}
	.linesel{
		border-bottom: 2rpx solid $ztd-color-primary;
		color: $ztd-color-primary;
	}
	&-btn{
		position: fixed;
		background-color: $ztd-color-white;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		z-index: 999;
		.send,.sends{
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			
		}
		.send{
			justify-content: center;
			.submit{
				width: 80%;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 35rpx;
				font-size: 28rpx;
				color: $ztd-color-block;
				background-color:$ztd-color-primary;
			}
		}
		.sends{
			justify-content: space-around;
			padding: 0 50rpx;
			.submit{
				width: 250rpx;
				height: 70rpx;
				border: 2rpx solid $ztd-color-primary;
				border-radius: 35rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color:$ztd-color-primary;
				font-size: 28rpx;
			}
			.submit.confirm{
				color: $ztd-color-white;
				background-color:$ztd-color-primary;
			}
		}
	}
	.swiper{
		width: 100%;
		// height: calc(100% - 300rpx);
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
		swiper-item{
			height: 100%;
		}
	}
	.scroll-view{
	}
	.margin-bot{
		height: 1rpx;
	}
	.swiper{
		height: calc(100% - 200rpx);
		box-sizing: border-box;
	}
}
</style>
