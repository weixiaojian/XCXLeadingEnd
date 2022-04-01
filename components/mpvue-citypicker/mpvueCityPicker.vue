<template>
	<div class="mpvue-picker">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<div class="mpvue-picker__hd" catchtouchmove="true">
				<div class="mpvue-picker__action" @click="pickerCancel">取消</div>
				<div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
			</div>
			<picker-view indicator-style="height: 40px;font-size:24rpx" mode="selector"  class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
				<block>
					<picker-view-column  style='flex:2'>
						<div class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</div>
					</picker-view-column  >
					<picker-view-column  style='flex:2'>
						<div class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label||''}}</div>
					</picker-view-column>
					<picker-view-column  style='flex:2'>
						<div class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label||''}}</div>
					</picker-view-column>
					<picker-view-column style='flex:3'>
						<div class="picker-item" v-for="(item,index) in townDataList" :key="index">{{item.label||''}}</div>
					</picker-view-column>
				</block>
			</picker-view>
		</div>
	</div>
</template>

<script>
	let provinceData,cityData,areaData;
	export default {
		data() {
			return {
				pickerValue: [0, 0, 0,0],
				provinceData:[],
				cityData:[],
				areaData:[],
				town:[],
				// provinceDataList: provinceData,
				// cityDataList: cityData[0],
				// areaDataList: areaData[0][0],
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				townDataList:[],
				province_data:[],
				/* 是否显示控件 */
				showPicker: false,
			};
		},
		created() {
			this.initProvince();
			// this.init();
			
		},
		onLoad() {
			
		},
		onShow() {
			this.$forceUpdate();
		},
		props: {
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0,0,0,0]
				}
			},
			/* 主题色 */
			themeColor: {
				type:String,
				default:"#007AFF"
			}
		},
		watch: {
			pickerValueDefault() {
				this.initProvince();
			}
		},
		methods: {
			initProvince(){
				let provinceDataList = [],cityDataList=[],areaDataList=[];
				this.province_data = JSON.parse(this.$getStorageSync('province'));
				//省
				this.province_data.forEach((item,index)=>{
					// console.log(index);
					let provincelist = {label:item.province,code:item.provinceCode};
					provinceDataList.push(provincelist);
					// 市
					if(item.cityList){
						// [[[],[]]]
						let cityListArr = [];
						let areaListArr = [];
						
						item.cityList.forEach((citem,num)=>{
							// console.log(num);
							let citylist = {label:citem.cityName||'',code:citem.cityCode||''};
						    cityListArr.push(citylist);
							if(citem.countyList){
								let countyList = citem.countyList.map((litem)=>{
									return {
										label:litem.countyName||'',
										code:litem.countyCode||''
									}
								})
								areaListArr.push(countyList);
							}else{
								areaListArr.push([]);
							}
						});
						
						areaDataList[index] = areaListArr;
						cityDataList.push(cityListArr);
					}else{
						cityDataList.push([]);
					}
					
				})
				// this.$nextTick(function(){
					this.provinceData = provinceDataList;
					this.cityData = cityDataList;
					this.areaData = areaDataList;
					const pickerValueDefault = this.pickerValueDefault
					this.provinceDataList = provinceDataList;
					this.cityDataList = cityDataList[pickerValueDefault[0]];
					this.areaDataList = areaDataList[pickerValueDefault[0]][pickerValueDefault[1]];
					this.getTownData(pickerValueDefault[2],this.areaDataList)
					  setTimeout(() => {
					        this.pickerValue = pickerValueDefault;
					    },500)
					this.handPickValueDefault();
				// })
			
			},
			init() {
				// this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
               
				// const pickerValueDefault = this.pickerValueDefault
				// this.cityDataList = this.cityData[pickerValueDefault[0]];
				// this.areaDataList = this.areaData[pickerValueDefault[0]][pickerValueDefault[1]];
				// this.pickerValue = pickerValueDefault;
			},
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			showPickerView() {
				this.showPicker = true;
			},
			handPickValueDefault() {
				const pickerValueDefault = this.pickerValueDefault
				console.log(pickerValueDefault)
				let provinceIndex = pickerValueDefault[0]
				let cityIndex = pickerValueDefault[1]
				const areaIndex = pickerValueDefault[2]
				if (
					provinceIndex !== 0 ||
					cityIndex !== 0 ||
					areaIndex !== 0
				) {
					if (provinceIndex > this.provinceData.length - 1) {
						this.pickerValueDefault[0] = provinceIndex = this.provinceData.length - 1;
					}
					if (cityIndex > this.cityData[provinceIndex].length - 1) {
						this.pickerValueDefault[1] = cityIndex = this.cityData[provinceIndex].length - 1;
					}
					if (areaIndex > this.areaData[provinceIndex][cityIndex].length - 1) {
						this.pickerValueDefault[2] = this.areaData[provinceIndex][cityIndex].length - 1;
					}
				}
			},
			pickerChange(e) {
				console.log('e',e);
				let changePickerValue = e.mp.detail.value;
				if (this.pickerValue[0] !== changePickerValue[0]) {
					// 第一级发生滚动
					if(this.cityData[changePickerValue[0]].length>0){
						this.cityDataList = this.cityData[changePickerValue[0]];
						this.areaDataList = this.areaData[changePickerValue[0]][0];
					}else{
							this.cityDataList = []
							this.areaDataList = []
					}
					changePickerValue[1] = 0;
					changePickerValue[2] = 0;
					this.getTownData(changePickerValue[2],this.areaDataList)
				} else if (this.pickerValue[1] !== changePickerValue[1]) {
					// 第二级滚动
					this.areaDataList = this.areaData[changePickerValue[0]][changePickerValue[1]];
					changePickerValue[2] = 0;
					this.getTownData(changePickerValue[2],this.areaDataList)
				}else if (this.pickerValue[2] !== changePickerValue[2]) {
					// 第三级滚动
					this.getTownData(changePickerValue[2],this.areaDataList)
					changePickerValue[3] = 0;
				}
				this.pickerValue = changePickerValue;
				this._$emit('onChange');
			},
			getTownData(area,list){
				console.log(list[area])
				let _data = {
					countyCode:list[area].code
				}
				this.$api.getTown(_data).then(res =>{
					console.log(res)
					if(res.code == '200'){
						let townDataList = [];
						if(res.data.length>1){
							townDataList = res.data.map(town =>{
								return {
									label:town.townName||'',
									code:town.townCode||''
								}
							})
							townDataList.unshift({label:'请选择',code:''})
							this.townDataList = townDataList
						}else{
							this.townDataList = []
						}
						// this.townDataList = res.data
					}
				})
			},
			_$emit(emitName) {
				let pickObj = {
					label: this._getLabel(),
					code:this._getCode(),
					value: this.pickerValue,
					// cityCode: this._getCityCode()
				};
				this.$emit(emitName, pickObj);
			},
			_getLabel() {
				let areaLabel = this.areaDataList[this.pickerValue[2]] ? '-' +this.areaDataList[this.pickerValue[2]].label : "";
				let cityLabel = this.cityDataList[this.pickerValue[1]]? '-'+this.cityDataList[this.pickerValue[1]].label:'';
				let townLabel = this.townDataList[this.pickerValue[3]]? '-'+this.townDataList[this.pickerValue[3]].label:'';
				console.log(townLabel)
				if(townLabel=='-请选择'){
					townLabel =''
				}
				let pcikerLabel = 
					this.provinceDataList[this.pickerValue[0]].label +
					cityLabel+
					areaLabel+
					townLabel
					console.log(pcikerLabel)
				return pcikerLabel;
			},
			_getCode() {
				let areaCode = this.areaDataList[this.pickerValue[2]] ? '-' +this.areaDataList[this.pickerValue[2]].code : "";
				let cityCode = this.cityDataList[this.pickerValue[1]] ? '-' +this.cityDataList[this.pickerValue[1]].code : "";
				let townCode;
				if(this.townDataList[this.pickerValue[3]].label=='请选择'){
					 townCode = ''
				}else{
					 townCode = this.townDataList[this.pickerValue[3]] ? '-' +this.townDataList[this.pickerValue[3]].code : "";
				}
				
				let pcikerCode = 
					this.provinceDataList[this.pickerValue[0]].code +
					cityCode +
					areaCode+
					townCode
					console.log(pcikerCode)
				return pcikerCode;
			},
			_getCityCode() {
				return this.areaDataList[this.pickerValue[2]].value;
			}
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 18rpx 30rpx;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 34rpx;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 2rpx;
		border-bottom: 2rpx solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 80rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 26rpx;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 476rpx;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
