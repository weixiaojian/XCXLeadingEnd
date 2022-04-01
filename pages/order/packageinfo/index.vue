<template>
	<!-- 下单页面物品信息选择 -->
	<view class="packageinfo">
		<view class="goodsbox">
			<view class="row flexsb paddlr6" v-if="pageId=='sends'">
				<view class="name">
					是否用于所有批量收件人
				</view>
				<view class="content">
					<switch color='#FDD605' style="transform:scale(0.8)"  @change="switchChange" />
				</view>
			</view>
			<view class="row flexsb">
				<view class="name">
					预估重量
				</view>
				<view class="content">
					<uni-number-box :value="weight" :type="'KG'" :min="1"  @change="bindChange" ></uni-number-box>
				</view>
			</view>
			<view class="row flexsb">
				<view class="name">
					预估件数
				</view>
				<view class="content">
					<uni-number-box :value="packingPiece" :type="'件'" :min="minNumber" :max="maxNumber" @change="bingdPackingPiece" ></uni-number-box>
				</view>
			</view>
			<view class="row">
				<view class="name">
					物品类型
				</view>
				<view class="type">
					<text class="wptype" :class="index==type.current?'ischoice':''" v-for="(item,index) in type.list" :key="index" @click="clickType(index)"  >{{item}}</text>
				</view>
				<view class="input-o" v-if="type.current==5">
					<input class="uni-input" v-model="typeOrther" type="text" value="" placeholder-class="placeholderStyle" placeholder="请输入物品类型" />
				</view>
			</view>
			<view class="row">
				<view class="name">
					给快递员捎话 
				</view>
				<view class="talk">
					<text class="wptalk" :class="item.selected?'ischoice':''" v-for="(item,index) in talk" :key="index" @click="clickTalk(index)"  >{{item.value}}</text>
				</view>
				<view class="input-o" >
					<textarea class="uni-textarea"  v-model="talkOrther" maxlength="50" type="text" value="" placeholder-class="placeholderStyle" placeholder="补充说明(小于50个字)~" />
				</view>
				<view class="add">
					<!-- <view class="imgeDef"  @tap="addReamrk">
						<image  :src="addremark?'../../../static/img/order-Ok.png' :'../../../static/img/circle.png'" ></image>
					</view> -->
					<button @click="addQuicknote"  type="default" size="mini">添加快捷备注</button>
					<!-- <text class="text">添加快捷备注</text> -->
				</view>
				<view class="history">
					<view class="item" v-for="(item,index) in remarkHistory" :key="index" >
						<text @click="historyItem(item,index)">{{item.remark}}</text>
						<uni-icons @click="deletes(item.guid)"  class="history_icon" type="trash" size="20"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<view class="submit-button" @tap="confirm">确定</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		data() {
			return {
				type:{ 
					list:['文件','数据产品','生活用品','服饰','食品','其他'],
					current:0
				},
				talk: [{ value: '请带纸箱', selected: false }, { value: '需要爬楼', selected: false }, { value: '缺文件袋', selected: false }, { value: '来前电话', selected: false }, { value: '请带面单', selected: false }, { value: '请带胶带', selected: false }],
				weight:1,
				optionType:'',
				typeOrther:'',
				talkOrther:'',
				pageId:'',
				packingPiece:1,
				allSelect:false,
				minNumber:1,
				maxNumber:1,
				optionData:{},
				// addremark:false,
				remarkHistory:[],
				textArr: []
				
			}
		},
		onLoad(option) {
			let data = JSON.parse(option.data)
			this.optionType = data.type
			this.pageId = option.pageId
			if(data.item){
				this.optionData = data.item
			}
			this.echoData(data.item);
			this.getWxRemarks()
			for(let i=0; i<this.talk.length; i++) {
				if(this.talk[i].selected==true){
					this.textArr.push(this.talk[i].value)
					this.talkOrther = this.textArr.join(', ')
				}
			}
			this.talkOrther = data.item.remark
		},
		components: {
				uniNumberBox
			 },
		methods: {
			//物品数量和重量条件(韵达项目暂时没用到)
			getOrderConstant(){
				this.$api.getOrderConstant().then(res =>{
					console.log(res)
					console.log(this.optionData.goodsWeight==0)
					if(res.code ==200){
							if(res.data.weight&&this.optionData.goodsWeight==0){
								this.weight = res.data.weight
							}
							if(res.data.number){
								if(res.data.number !=1){
									this.packingPiece = res.data.number;
									this.minNumber = res.data.number;
									this.maxNumber = res.data.number;
								}else{
									this.packingPiece =1;
									this.minNumber = 1;
									this.maxNumber = 1;
								}
							}else{
								this.packingPiece =1;
								this.minNumber = 1;
								this.maxNumber = 1;
							}
					}
				})
			},
			bindChange(e){
				let self = this
				self.weight = e
			},
			bingdPackingPiece(e){
				let self = this
				self.packingPiece = e
			},
			switchChange(e){
				let self = this
				self.allSelect = e.detail.value
			},
			//回写物品信息
			echoData(item){
				let self = this;
				self.weight = item.goodsWeight||1;
				self.packingPiece = item.packingPiece||1;
				if(item.goodsName){
					if(self.type.list.indexOf(item.goodsName)==-1){
						self.type.current = 5;
						self.typeOrther = item.goodsName
					}else{
						self.type.current = self.type.list.indexOf(item.goodsName)
					}
				}
				if(item.remark){
					let tempTalk = item.remark.split(', ');
					let orTalk='';
					for(let tempKey of tempTalk) {
						console.log(tempKey)
					    let _index=self.talk.findIndex(c=>c.value==tempKey)
					    if(_index>-1){
					      self.talk[_index].selected = true
					    }else{
								orTalk += tempKey+' '
							}
					}
					self.talkOrther = orTalk||'';
				}
			},
			//获取历史备注信息
			getWxRemarks(){
				let self = this;
				self.$api.getWxRemarks().then(res =>{
					 if(res.code == 200&&res.data.length>0){
						 self.remarkHistory = res.data
					 }
				})
			},
			
			// 添加快捷备注
			addQuicknote(){
				let self = this
				if(self.talkOrther == ''){uni.showToast({icon:"none",title:"请填写备注信息~"});return;};
				let _talk='';
				// for(let i =0;i<self.talk.length;i++){
				// 	if(self.talk[i].selected){
				// 		_talk = self.talk[i].value+' '
				// 	}
				// }
				_talk += self.talkOrther
				let _Data = {
					remark:_talk
				}
				self.$api.addWxRemark(_Data).then(res =>{
					if(res.code = 200) {
						this.getWxRemarks()
					}
				})
			},
			group(array, subGroupLength) {
			      let index = 0;
			      let newArray = [];
			      while(index < array.length) {
			          newArray.push(array.slice(index, index += subGroupLength));
			      }
			      return newArray;
			  },
			//使用历史备注信息
			historyItem(item, index){
				let self = this;
				
				let remarkArr = []
				// 循环遍历将remark放在数组中，index下表
				let remarks = self.remarkHistory.map( item => {
					return remarkArr.concat(item.remark)
				})
				if(self.talkOrther.length>0) {
					self.talkOrther = item.remark.slice(0,50);
					let remass = item.remark.replace(/,/g, "")
					let res = remass.split(" ")
					// self.textArr = [...self.textArr,...res]
				}else{
					self.talkOrther = item.remark.slice(0,50);
				}
				for(let i =0;i<self.talk.length;i++){
					self.talk[i].selected = false
				}
				
			},
			//物品信息确认
			confirm(){
				let self = this
				if(self.weight == 0){uni.showToast({icon:"none",title:"重量不能为0~"});return;};
				let _talk='';
				_talk += self.talkOrther
				let data = {
					goodsWeight:self.weight,
					goodsName:self.type.current =='5'?self.typeOrther:self.type.list[self.type.current],
					goodsType:self.type.list[self.type.current],
					packingPiece:self.packingPiece,
					remark:_talk
				}
				data.type = self.optionType
				if(self.pageId =='sends'){
					data.allSelect = self.allSelect
				}
				uni.$emit('packageinfo',data)
				uni.navigateBack({
					delta:1
				})
			},
			clickType(index){
				let self = this
				self.type.current = index
			},
			clickTalk(index){
				let self = this
				if(self.talk[index].selected==false){
					if(self.talkOrther.length > 45){uni.showToast({icon:"none",title:"超过字数限制~"});return;};
					if(self.talkOrther == ""){
						self.talkOrther = `${self.talkOrther}${self.talk[index].value}`
					}else{
						self.talkOrther = `${self.talkOrther}, ${self.talk[index].value}`
					}
					self.talk[index].selected=true
				}else{
					
					let arrs = self.talkOrther.split(", ").reverse()
					let textIndex = arrs.indexOf(self.talk[index].value)
					arrs.splice(textIndex,1)
					self.talkOrther = arrs.reverse().join(", ")
					self.talk[index].selected=false
				}
			},
			// 删除快捷备注
			deletes(index) {
				let self = this
				let _id = {
					"id": index
				}
				self.$api.deleteRemarks(_id).then(res => {
					if (res.code == 200) {
						self.remarkHistory = self.remarkHistory.filter(x => x.guid !== index)
					}

				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.packageinfo{
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		overflow-y: auto;
		padding: 0 20rpx 100rpx;
		.row{
			background-color: $ztd-color-white;
			height: auto;
			padding:20rpx 36rpx;
			margin:16rpx 0;
			border-radius: 10rpx;
			border: 2rpx solid $ztd-color-line;
			.name{
				color: #000;
				font-weight: bold;
				font-size: 28rpx;
			}
			.type,.talk{
				display: flex;
				justify-content: space-between;
				align-items:flex-start;
				flex-wrap: wrap;
				width: 100%;
				padding-top:26rpx;
				.wptype{
					display: inline-block;
					width: 180rpx;
					height: 50rpx;
					line-height: 50rpx;
					border-radius: 25rpx;
					text-align: center;
					border: 2rpx solid $ztd-color-line;
					color:#222;
					margin-bottom: 20rpx;
					font-size: 26rpx;
				}
				.wptalk{
					display: inline-block;
					width: 130rpx;
					height: 44rpx;
					line-height: 44rpx;
					border-radius: 22rpx;
					text-align: center;
					border: 2rpx solid $ztd-color-line;
					color:#222;
					margin-bottom: 20rpx;
					font-size: 24rpx;
					margin-right: 16rpx;
				}
				text.ischoice{
					color:$ztd-color-primary;
					border:2rpx solid $ztd-color-primary;
				}
			}
			.talk{
				justify-content: flex-start;
			}
			.input-o{
				background-color:$ztd-color-bgcolor;
				padding: 0 20rpx;
				border-radius: 6rpx;
				margin: 6rpx 0;
				.uni-input{
					height:70rpx;
				}
				.uni-textarea{
					height: 150rpx;
					padding: 10rpx 0;
				}
				.placeholderStyle{
					color:#999;
				}
			}
			.add{
				width: 100%;
				margin-top: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10rpx 0;
				button{
					color: #F6F6F6;
					background-color: #555555;
					padding: 0 50rpx;
				}
				/* .imgeDef{
					width:40rpx;
					height:40rpx;
					margin-right: 10rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.text{
					color: #999;
				} */
			}
			.history{
				max-height:500rpx;
				overflow-y: auto;
				.item{
					display: flex;
					padding: 20rpx 0;
					justify-content: space-between;
					border-bottom: 2rpx solid $ztd-color-line;
					text{
						flex: 1;
						font-size: 26rpx;
						color:#3d3d3d;
						font-weight: bold;
					}
				}
				.item:first-child{
					border-top: 2rpx solid $ztd-color-line;
				}
			}
		}
		.row.flexsb{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.paddlr6{
			padding: 12rpx 36rpx;
		}
		.submit{
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
			&-button{
				width: 80%;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius:35rpx;
				border: 2rpx solid $ztd-color-primary;
				color:$ztd-color-white ;
				background-color:$ztd-color-primary ;
			}
		}
	}
</style>
