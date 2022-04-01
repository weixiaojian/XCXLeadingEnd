<template>
	<view class="agreement">
		<view class="title">
			《快递服务协议》
		</view>
		<view class="content" @touchmove.stop>
			<scroll-view class="main" scroll-y="true"  >
				<!-- <view class="p">
					<text class="tips">特别提示：</text>
				</view> -->
				<view class="p">
					<text class="tips">一、快递服务法律关系和服务范围：</text>
					本协议经寄件人签名、收寄员收取快件后成立生效，由在运单上印制企业名称全称或者盖章的收寄快递企业与寄件人建立快递服务合同关系并提供快递服务（代收货款须另签协议），承诺及时安全地交付快件。
				</view>
				<view class="p">
					<text class="tips">二、运单填写：</text>
					寄件人须用力工整地手写或打印运单，清楚、准确、完整、如实地填写寄件人和收件人的姓名、地址、联系电话以及内件品名、数量、付费方式和赔偿约定（保价时还须填写申报内件价值即保价价值）等内容并签名。寄件人不得隐瞒或虚报内件的性质、品名、数量、内件价值等真实情况，否则须承担相应责任 。
				</view>
				<view class="p">
					<text class="tips">三、包装：</text>
					寄件人应根据内件性质，在满足装卸、运送、派送投递等快递环节要求的情况下对快件进行必要和足够的包装，并保证快件不会污染和损害其他快件。
				</view>
				<view class="p">
					<text class="tips">一、快递服务法律关系和服务范围：</text>
					本协议经寄件人签名、收寄员收取快件后成立生效，由在运单上印制企业名称全称或者盖章的收寄快递企业与寄件人建立快递服务合同关系并提供快递服务（代收货款须另签协议），承诺及时安全地交付快件。
				</view>
				<view class="p">
					<text class="tips">四、禁寄：</text>
					寄件人承诺不得交寄以下禁寄物品和危险品（详细可查阅国家邮政局《禁寄物品指导目录及处理办法》），违者须承担相应责任：
				</view>
				<view class="p-text">
					<text class="red">1、武器、弹药及仿真武器、管制刀具；</text>
				</view>
				<view class="p-text">
					<text class="red">2、易燃、易爆、易腐蚀性物品；</text>
				</view>
				<view class="p-text">
					<text class="red">3、放射性物质；</text>
				</view>
				<view class="p-text">
					<text class="red">4、烈性毒药、生化制品、传染性物品；</text>
				</view>
				<view class="p-text">
					<text class="red">5、毒品、麻醉药物；</text>
				</view>
				<view class="p-text">
					<text class="red">6、危害国家安全和社会政治稳定以及淫秽的出版物、宣传品、印刷品、光盘制品等；</text>
				</view>
				<view class="p-text">
					<text class="red">7、妨害公共卫生的物品；</text>
				</view>
				<view class="p-text">
					<text class="red">8、包装不妥，可能危害人身和其他快件的物品；</text>
				</view>
				<view class="p-text">
					<text class="red">9、流通货币和有价证券；</text>
				</view>
				<view class="p-text">
					<text class="red">10、国家法律法规规章明令禁止寄递的其他物品。</text>
				</view>
				<view class="p">
					<text class="tips">五、验视及安全检查：</text>
					快递企业收寄员对信件可开拆验视但不得检查内容，对信件以外快件按国家规定当场验视，确认不属禁寄物品且内件性质、品名与所填报内容相符后由收寄员签名。国家禁寄物品、寄件人拒绝验视的，收寄员不得收寄。国家有关司法机关和执法机关出于安全或办理案件需要可依法对快件进行相应检查。
				</view>
				<view class="p">
					<text class="tips">六、快递服务收费：</text>
					快递费是指快递企业向寄件人或收件人收取的用于提供快件收取、中转、运输和派送投递等快递服务的费用，收费金额由双方按市场价协商后填写在运单上，月结时可另签收费协议。快件经二次派送投递因收件人原因仍无法投交时由收件人自取或收件人支付每次人民币30元的逾期派送投递费后由快递企业再进行派送投递。
				</view>
				<view class="p">
					<text class="tips">七、保价及保险：</text>
					寄件人可自愿对快件向商业保险机构办理保险，对贵重物品和单票内件价值超过人民币壹仟元的快件应尽量向快递企业办理保价。保价快件除支付快递费外还须支付保价费，保价费为申报内件价值的3%（双方另有约定的按约定收取保价费）。保价费须当场支付。未申报保价、未填写内件价值以及未当场支付保价费的视为未保价。
				</view>
				<view class="p">
					<text class="tips">八、快递及签收：</text>
					快件按收件人姓名地址当面投递交付和验收。快件外包装破损且收件人查验内件发现存在丢失、损毁或不符等异常情况而拒收时须与派送投递员共同签字注明该情况，收件人拒绝签字的，派送投递员注明情况后退件给寄件人。收件人如不在现场等原因无法签收时，派送投递员可电话联系收件人（寄件人）并征得其同意后可由其指定的人代为签收，代收时派送投递员须核实代收人的身份并记载其身份证件号码或联系电话等必要信息。代收人应及时向收件人转交快件。
				</view>
				<view class="p">
					<text class="tips">九、投递时限：</text>
					汽车公路运输（简称汽运）的按《快递服务》国家标准执行，航空运输的由双方另行约定，同城当天快递按运单正面承诺执行。
				</view>
				<view class="p">
					<text class="tips">十、查询方式：</text>
					寄件人可自快件交寄之日起一年内持快递运单通过运单上载明的查询电话或网站查询快件信息，逾期后不再受理查询服务。运单上印制的查询电话及网站仅用于寄件人查询其所寄快件的信息、协调寄件人与收寄快件的快递企业就快递服务所发生的争议或纠纷。
				</view>
				<view class="p">
					<text class="tips">十一、赔偿标准：</text>
					在寄递过程中发生快件延误、丢失、损毁、内件不符时，寄件人有权追究快递企业的违约责任或侵权损害赔偿责任（双方另有约定的按约定执行）：
				</view>
				<view class="p-text">
					1、快件延误的赔偿标准：免除本次快递费（不含保价费）。由于延误导致内件直接价值丧失的，由快递企业按照快件损毁赔偿标准进行赔偿。由于收件人姓名、地址、电话等信息错误或变更以及因收件人外出、无法联系等原因致使快件无法按时交付的，不属于快件延误，快递企业不承担延误责任。
				</view>
				<view class="p-text">
					2、快件丢失、损毁、内件不符的赔偿标准：
				</view>
				<view class="p-text">
					<text class="red">（1）免除本次快递费（不含保价费）；</text>
				</view>
				<view class="p-text">
					<text class="red">（2）保价快件按寄件人在运单填写的保价价值即申报内件价值范围内赔偿内件实际损失；</text>
				</view>
				<view class="p-text">
					<text class="red">（3）未保价快件按寄件人在运单上选填的本次实际支付快递费的合理倍数赔偿，寄件人未选填赔偿标准的，视为同意按本次实际支付快递费的五倍赔偿。</text>
				</view>
				<view class="p">
					<text class="tips">十二、免责声明：</text>
					快递企业依据《中华人民共和国邮政法》、《快递服务》国家标准等对因下列原因之一造成的快件损失不承担赔偿责任：
				</view>
				<view class="p-text">
					1、不可抗力（保价快件除外）；
				</view>
				<view class="p-text">
					2、所寄物品本身的自然性质或者合理损耗；
				</view>
				<view class="p-text">
					3、寄件人或收件人的过错。
				</view>
				<view class="p">
					<text class="tips">十三、争议解决方式：</text>
					寄件人与快递企业就快递服务协议发生争议的，可先协商解决；协商不成或不愿意协商的，可依法选择投诉、仲裁或诉讼等方式解决。
				</view>
				<view class="p">
					<text class="tips">十四、法律适用：</text>
					本协议适用《中华人民共和国邮政法》、《中华人民共和国合同法》等相关法律法规，未尽事宜按适用法律法规执行。
				</view>
				
				<!-- <view class="p">
					<text class="tips">信息收集与保护：</text>
					寄递过程中产生的信息，<text class="red">包括但不限于寄件人及收件人的姓名/名称、地址、电话，会被收集储存，并会被用于服务的改善或推广。</text>
				</view> -->
				
				<!-- <view class="p">
					<text class="tips">（上述内容详见协议相应条款）</text>
				</view>
				<view class="p">
					<text class="tips">1.定义、生效及适用范围</text>
				</view>
				<view class="p">
					<text class="tips">1.1定义</text>
				</view>
				<view class="p-text">
					（1）寄件人系指委托寄送快件的一方。
				</view>
				<view class="p-text">
					（2）收件人系指由寄件人指定收取快件的一方。
				</view>
				<view class="p-text">
					（3）哪吒速运有限公司系指依法设立、取得快递业务经营许可证，拥有“哪吒速运”注册商标，从事快递业务的有限公司。
				</view>
				<view class="p-text">
					（4）快递服务组织系指依法设立，经哪吒速运有限公司授权使用“哪吒速运”注册商标，从事快递业务，自主承担快递服务法律责任的企业法人，是本协议项下实际提供快件揽收和派送服务的快递营业机构。
				</view>
				<view class="p-text">
					（5）保价服务，系指快递服务组织或第三方保价机构（“保价服务提供方”）提供的一项服务，即寄件人向快递服务组织交寄物品时申报物品价值，并根据申报价值支付保价费；若保价快件在寄递过程中因快递服务组织原因发生损毁、遗失的，保价服务提供方按照交寄物品的实际价值损失在申报价值的限额内进行赔偿。
				</view>
				<view class="p">
					<text class="tips">1.2生效</text>
				</view>
				<view class="p-text">
					寄件人通过填写快递面单（电子面单或纸质面单）提交订单并向快递服务组织交付须寄递的快件后，视为寄件人与快递服务组织签署本协议并即时生效。快递面单是本协议的组成部分。
				</view>
				<view class="p">
					<text class="tips">1.3适用范围</text>
				</view>
				<view class="p-text">
					本协议适用于快递服务组织揽收的寄件地址及收件地址均位于中华人民共和国境内（为本协议之目的，不包括香港、澳门及中国台湾地区）的快递业务。
				</view>
				<view class="p">
					<text class="tips">2.双方的权利与义务</text>
				</view>
				<view class="p">
					<text class="tips">2.1禁寄物品</text>
				</view>
				<view class="p-text">
					<text class="red">寄件人不得交寄法律法规或相关政府主管部门规定禁止和限制寄递的物品以及本公司不予收寄或限制收寄的物品。快递服务组织在寄递过程中发现前述物品的，有权根据实际情况，采取包括但不限于退件、扣押、转交相关主管部门等措施。</text>
					因交寄禁寄物品造成快递服务组织或第三人人身财产损害及其他损失的，寄件人应当予以赔偿。
				</view>
				<view class="p">
					<text class="tips">2.2实名验证</text>
				</view>
				<view class="p-text">
					寄件人应准确、完整、如实地填写快递面单并提供有效身份证件进行实名验证；寄件人为法人的，应提供法人证照及法定代表人或相关负责人的身份证件进行实名验证。寄件人同意快递服务组织记录、留存相关证件信息。
				</view>
				<view class="p">
					<text class="tips">2.3验视</text>
				</view>
				<view class="p-text">
					快递服务组织有权对寄件人交寄物品进行开箱验视；对于无法判定内件属性的交寄物品，有权要求寄件人出具有效证明。寄件人不配合验视的，快递服务组织有权不予揽收或退回已揽收快件。			
				</view>
				<view class="p">
					<text class="tips">2.4包装</text>
				</view>
				<view class="p-text">
					寄件人应妥善包装交寄物品，确保符合寄递要求<text class="blue">（包装注意事项）</text>,因快件包装不善造成快件损毁、遗失的，快递服务组织不予赔偿；因此造成快递服务组织或第三方人身财产损害的，寄件人应当予以赔偿。寄件人委托快递服务组织进行包装的，快递服务组织有权收取相应的包装费用。
				</view>
				<view class="p">
					<text class="tips">2.5服务费</text>
				</view>
				<view class="p-text">
					（1）寄件人应按快递服务组织公示的或双方约定的计费方式、费率及时支付相应的服务费及相关费用。如寄件人选择到付服务但收件人拒绝支付费用的，则费用应由寄件人承担。如涉及退件的，相应费用亦由寄件人承担。如寄件人选择保价、代收货款、尊享等其他服务的，应按照约定支付相应费用。
				</view>
				<view class="p-text">
					（2）寄件人逾期支付服务费及相关费用的，每逾期一日，应按逾期金额千分之一支付违约金，但双方另有约定的除外。
				</view>
				<view class="p-text">
					（3）<text class="red">寄件人拖欠服务费及相关费用的，快递服务组织除按照上述约定收取违约金外，还有权留置交寄物品</text>。留置期超过70天寄件人仍未付清拖欠款项的，快递服务组织有权通过变卖、拍卖等合理方式处置留置物品，所获收益扣除处置费用、拖欠服务费用后仍有剩余的，返还寄件人。
				</view>
				<view class="p">
					<text class="tips">2.6价值申报和保价</text>
				</view>
				<view class="p-text">
					（1）单票交寄物价值超过人民500元的快件，寄件人应如实申报并办理保价；单票交寄物价值超过人民币30000元的快件，寄件人应拆分至单票交寄物价值人民币30000元以下分别寄件，并分别进行保价。如因所寄递的快件性质无法拆分，请寄件人采取其他运输方式以保障安全。
						保价费计费方式及费率以哪吒速运官方网站公布的为准，未支付保价费的则视为未保价。
				</view>
				<view class="p-text">
					（2）以下为本公司不予提供保价服务的寄递物品：
				</view>
				<view class="p">
					①法律法规或相关主管部门规定的禁止和限制寄递的物品；
				</view>
				<view class="p-text">
					②价值不易确定或者价值变化较大的物品；
				</view>
				<view class="p-text">
					③易损易耗的物品；
				</view>
				<view class="p-text">
					④其他本公司在哪吒速运官网等渠道上公布的不予保价的物品。
				</view>
				<view class="p-text">
					<text class="red">对于上述不予保价物品但实际已完成保价且寄件人已支付保价费的，则在寄递过程中因快递服务组织原因造成快件发生损毁、遗失的，按照该票快件交寄物实际价值损失赔偿，但最高不超过该票快件交寄物申报价值的50%。</text>
				</view>
				<view class="p">
					<text class="tips">2.7查询</text>
				</view>
				<view class="p-text">
					本公司官方网站、APP、微信公众号及查询热线等提供自交寄之日起一年内的快件查询服务。
				</view>
				<view class="p">
					<text class="tips">2.8送达时限</text>
				</view>
				<view class="p-text">
					快件送达时限以哪吒速运官方网站等渠道公示的信息为准。
				</view>
				<view class="p">
					<text class="tips">2.9签收</text>
				</view>
				<view class="p-text">
					寄件人同意并促使收件人同意快递服务组织可以根据实际情况的便利，按如下方式之一，安全、合理地投递快件：
				</view>
				<view class="p-text">
					（1）交由收件人本人签收；
				</view>
				<view class="p-text">
					（2）交由收件人的同住人或指定的代收人签收；
				</view>
				<view class="p-text">
					（3）投递至收件地址范围内的代收点或自提柜；
				</view>
				<view class="p-text">
					（4）按收件人或寄件人指定的其他方式投递。
					快递服务组织按以上方式之一投递快件且快件外包装完好的，视为该次快递服务履行完毕。
				</view>
				<view class="p">
					<text class="tips">2.10退件</text>
				</view>
				<view class="p-text">
					收件地址不详无法送达的、收件人拒收的或非因快递服务组织原因两次派送未成功的，快递服务组织有权退回快件或按寄件人明示的合理要求处理，相应费用由寄件人承担。寄件人未明示快件处置要求且拒绝退件、不支付退件或处置费用或快件无法投递且无法退回的，快递服务组织有权按相关规定处置快件，处置后所得收益扣除服务费与处置费后，剩余部分返还寄件人。
				</view>
				<view class="p">
					<text class="tips">3.赔偿标准</text>
				</view>
				<view class="p">
					<text class="tips">3.1</text>因快递服务组织原因导致快件延误、损毁与遗失的，按以下方式处理：
				</view>
				<view class="p-text">
					（1）快件未按约定或承诺的时限内送达的，免除相应的快递服务费用；
				</view>
				<view class="p-text">
					<text class="red">（2）快件发生损毁、遗失（包括全部或部分损毁、遗失）的，按以下方式赔偿：</text>
				</view>
				<view class="p-text">
					<text class="red">① 未保价快件，按照实际价值损失赔偿，但最高不超过人民币500元（含）；</text>
				</view>
				<view class="p-text">
					<text class="red">② 已保价快件，按照实际价值损失赔偿，但最高不超过申报价值；如快件未足额保价的，则赔偿金额按保价率折扣，即赔偿金额=实际价值损失*申报价值/实际价值；</text>
				</view>
				<view class="p-text">
					<text class="red">③ 除本协议另有约定外，未保价且无法提供有效价值证明的，则按照该票快件的快递服务费的3倍赔偿。无论在何种情况下，快递服务组织均不对预期收益、利润、商业机会等任何间接损失进行赔偿。
					</text>
				</view>
				<view class="p-text">
					<text class="red">3.2寄件人或寄件人指定的第三方在知晓或应当知晓快件发生损毁、遗失后30天之内应向快递服务组织提出理赔要求并附上相应证明材料，逾期则快递服务组织有权不予受理且将不再承担任何责任。
					</text>
				</view>
				<view class="p-text">
					<text class="tips">3.3</text>寄件人或寄件人指定的第三方向快递服务组织提出理赔时，应提供以下证明材料：
				</view>
				<view class="p-text">
					（1）寄件人或寄件人指定的第三方的有效身份证明材料、授权书、含保价服务的寄件面单、发票、付款凭证及寄递物品的清单以及物品的损毁报告或检测报告等有效证明材料；
				</view>
				<view class="p-text">
					（2）其他有效证明材料。寄件人或寄件人指定的第三方在上述30天的理赔期限内未及时提供有关证明材料导致快递服务组织无法核实证明材料的真实性以及无法核实交寄物实际价值损失的责任由寄件人自行承担。
				</view>
				<view class="p-text">
					<text class="tips">3.4</text>寄件人或寄件人指定的第三方要求快递服务组织将保价快件剩余的物品或损毁的物品返还的，快递服务组织可直接在赔偿金额中扣除该票保价快件的物品残值及相应的返件等相关费用。寄件人或寄件人指定的第三方未明示处置要求或不同意返还的，快递服务组织按照协议中的退件要求处理。
				</view>
				<view class="p-text">
					<text class="tips">3.5</text>寄件人或寄件人指定的第三方有且仅能针对单票快件提出一次理赔要求，且对于该票快件丢失或损毁的结算是全额且终局的。
				</view>
				<view class="p">
					<text class="tips">4.信息收集及使用</text>
				</view>
				<view class="p-text">
					<text class="red">寄件人同意并遵守哪吒速运官网（nz-ex.com）所公示的信息保护和隐私政策及其不定期修订的内容，确保其向快递服务组织提供的收件人姓名/名称、地址、电话、证件等信息为合法获取并经有效授权使用。哪吒速运有限公司及其关联公司、快递服务组织有权收集、存储、编辑、传输寄件人和收件人提供的或在相关服务中形成的各项信息，并为提供、改善、推广快递服务及衍生产品和服务而使用或授权他人使用该等信息。
					</text>
				</view>
				<view class="p">
					<text class="tips">5.法律适用</text>
				</view>
				<view class="p-text">
					本协议适用《中华人民共和国邮政法》、《中华人民共和国合同法》等相关法律法规，未尽事宜按适用法律法规执行。
				</view>
				<view class="p">
					<text class="tips">6.争议解决</text>
				</view>
				<view class="p-text">
					本协议履行过程中如发生争议，应友好协商解决；如协商不成的，任一方均有权向快件寄出地有管辖权的人民法院提起诉讼。
				</view>
				<view class="p">
					（包装注意事项）
				</view>
				<view class="p">
					<text class="tips">1.包装基本常识</text>
				</view>
				<view class="p-text">
					包装是否符合要求，对保证快件安全、准确、迅速的传递，起着极为重要的作用。尤其是流质和易碎物品，如果包装不妥，不但快件自身容易遭受损毁，而且还会污损其他快件，危及工作人员的安全。判断包装是否牢固，主要要看经过包装后的快件是否能够经受长途运输和正常碰撞、摩擦、震荡、压力以及气候变化，而不致损毁。因此一定要按照物品性质、大小、轻重、寄递路程以及运输情况等，选用适当的包装材料对快件进行妥善包装。
				</view>
				<view class="p">
					<text class="tips">2.包装原则</text>
				</view>
				<view class="p-text">
					<text class="tips">2.1</text>适合运输原则快件包装应坚固、完好，能够防止在运输过程中发生包装破裂、内物漏出、散失；能够防止因摆放、摩擦、震荡或因气压、气温变化而引起快件损毁或者变质；能够防止伤害操作人员或污染运输设备、地面设备及其他物品。
				</view>
				<view class="p-text">
					<text class="tips">2.2</text>便于装卸原包装材料除应适合快件的性质、状态和重量外，还要整洁、干燥、没有异味和油渍；包装外表面不能有凸出的钉、钩、刺等，要便于搬运、装卸和摆放。
				</view>
				<view class="p-text">
					<text class="tips">2.3</text>适度包装原则根据快件尺寸、重量和运输特性选择合适大小的外包装及填充物，不足包装和过度包装都不可取。不足包装容易造成快件损毁，过度包装造成包装材料浪费。
				</view>
				<view class="p">
					<text class="tips">3.包装材料的选择</text>
				</view>
				<view class="p-text">
					<text class="tips">3.1</text>纸质类的寄递物品,厚度不超过1cm的纸质物品，使用文件封进行包装；厚度超过1cm且不易破碎、抗压类的书刊、样品等寄递物品，可选择包装袋包装。
				</view>
				<view class="p-text">
					<text class="tips">3.2</text>质脆易碎物品,如玻璃、光碟、灯饰、陶瓷等,此类快件必须在包装内部的六个面加垫防震材料，且每一件物品单独使用泡沫或其他缓冲材料进行包装。采取多层次包装方法，即快件—衬垫材料—内包装—缓冲材料—运输包装（外包装）。
				</view>
				<view class="p-text">
					<text class="tips">3.3</text>体积微小的五金配件、纽扣及其他易散落、易丢失的物品，此类快件用塑料袋作为内包装将寄递物品聚集，并严密封口，注意内包装留有适当的空隙。数量较少可使用包装袋作为外包装；数量较大可使用质地坚固、大小适中的纸箱作为外包装，并用填充材料填充箱内的空隙，使得快件在箱内相对固定，避免填充过满而导致内包装破裂引起快件散落丢失。
				</view>
				<view class="p-text">
					<text class="tips">3.4</text>重量较大的物品，如机器零件、模具、钢（铁）块等，此类快件先使用材质较软的包装材料（如气泡垫等）包裹，然后采用材质较好、耐磨性能好的塑料袋包装，或以材质较好的纸箱包装后并用打包带加固，还可使用木箱进行包装。若快件属易碎品，还须在外包装上加贴易碎标识以作警示。
				</view>
				<view class="p-text">
					<text class="tips">3.5</text>不规则（异形）、超大、超长的物品此类快件以气泡垫等材质较软的材料进行全部或局部（如两端等易损部位）包装。细长快件还应尽可能捆绑加固，减少中转或运输过程中折损的可能性。但若单件重量已达5kg，则无须将多件捆绑，以利于中转及搬运。若快件为易折损品，应在快件指定位置粘贴易碎标识。
				</view>
				<view class="p-text">
					<text class="tips">3.6</text>较大的圆柱形或原材料物品（如布匹、皮料、鞋材、泡沫等），此类快件可以先使用透明的塑料薄膜进行包裹，然后再使用胶纸对其进行缠绕包装；严禁使用各种有色的垃圾袋进行包装。
				</view>
				<view class="p-text">
					<text class="tips">3.7</text>特产类物品，如水果、月饼等，此类快件必须进行保护性包装，具体包装方法可因物而异，以既能防止破损变质，又不污染其他快件为原则，如水果采用条筐、竹笼或者竹篓包装。
				</view>
				<view class="p-text">
					<text class="tips">3.8</text>液态物品的包装（仅限全程陆路运输的非危险性物品，容器内部必须留有5%-10%的空隙，封盖必须严密，不得溢漏。若是用玻璃容器盛装的液体，则每一容器的容量不宜超过500ml。若容器本身的强度较小，则必须采用纸箱或木箱对快件进行加固包装，且箱内应使用缓冲材料填实，防止晃动或倒置搬运液体渗出污染其他快件，并在外包装上粘贴易碎标识。
				</view>
				<view class="p-text">
					<text class="tips">3.9</text>轴承内钢珠等会渗油的固体物品，此类快件必须满足液体类物品的包装要求，应使用衬垫和吸附材料填实，防止在运输过程因渗漏而污染本身运单及其他快件。 粉状物品（难以辨认成分的白色粉状物品及进出口件除外，若快件的原包装是塑料袋包装的，还应使用塑料涂膜编织袋作外包装，保证粉末不致漏出。单件快件毛重不宜超过50kg.若快件的原包装是用硬纸桶、木桶、胶合板桶盛装的，要求桶身不破、接缝严密、桶盖密封、桶箍坚固结实，桶身两端应有钢带打包带。若快件的原包装是用玻璃器皿包装的，每瓶内装物的重量不宜超过1kg。如容器本身的强度不够，则须用铁制或木制材料作外包装，且箱内应用缓冲材料填实。单件快件毛重以不超过25kg为宜。
				</view>
				<view class="p-text">
					<text class="tips">3.1</text>纸质类的寄递物品,厚度不超过1cm的纸质物品，使用文件封进行包装；厚度超过1cm且不易破碎、抗压类的书刊、样品等寄递物品，可选择包装袋包装。
				</view>
				<view class="p-text">
					<text class="tips">3.10</text>纺织类物品，此类快件可采用布袋、麻袋、纸箱包装。布袋的材料应选用坚固结实的棉布；麻袋的坯布应无破洞，具有一定强度，封口处应用封口机一次性封口。 若使用纸箱包装，必须对箱角及边缘用胶纸加固，确保其不会在运输过程中破裂。凡纸箱任何一边超过60cm，还需用打包带加固。若纸箱质量较差，还可在其外面套编织袋，以防止在搬运、装卸过程中造成部分遗失或损毁。
				</view>
				<view class="p-text">
					<text class="tips">3.11</text>精密仪器及电子产品类物品，此类快件应采用纸箱或全木箱包装，快件与箱壁应预留2cm的空隙，用缓冲材料填充。若使用纸箱包装，在检查完寄递物品后，如外包装有旧的快递运输或包装标识，须将其清除；如无法清除干净的，在体积允许的情况下，应将纸箱装入包装袋，或用包装箱重新进行包装，以避免旧的快件标识造成操作失误。 对于可以收寄的自身带电的电子类寄递物品，必须在征得寄件人同意的情况下将寄递物品自带的电池拆卸并与主体分离后方可收取；对于无法拆卸分离的快件不予收取，并向寄件人做好解释工作。
				</view>
				<view class="p-text">
					<text class="tips">3.12</text>胶纸中使用最多的是透明胶纸，用于对所收寄件人的寄递物品进行封固包装。除文件封和各款包装袋以外，其他类型包装的快件一般都需要用胶纸进行封固包装。对于外形规则类纸箱包装的快件，要求使用胶纸对纸箱上下表面进行“├┤”字形包装操作。
				</view>
				<view class="p-text">
					<text class="tips">3.13</text>使用透明胶纸沿着纸箱的中缝部位进行封粘，同时胶纸两端应延纸箱两侧面放宽5-10cm，以便将纸箱的中缝两端开口处覆盖，同时做到压紧胶纸两端，使得胶纸和箱体充分粘合。 使用透明胶纸分别对纸箱的两侧缝口进行封粘。封粘要求先对纸箱一侧的侧缝开口进行封粘，同样胶纸应延长放宽5-10cm，同时做到压紧胶纸两端和胶纸中间部位，使用胶纸和箱体充分粘合。 在完成纸箱一表面的“├┤”行包装后，还需对另一表面进行封粘。
				</view>
				<view class="p">
					<text class="tips">4.快件包装注意事项</text>
				</view>
				<view class="p-text">
					<text class="tips">4.1</text>禁止使用一切报刊类物品作为快件的外包装，如报纸、海报、书刊、杂志等；严禁使用各种有色垃圾袋和容易破损、较薄的类似垃圾袋的包装物。
				</view>
				<view class="p-text">
					<text class="tips">4.2</text>对于价值较高的快件采用包装箱进行包装，包装时应使用缓冲材料。
				</view>
				<view class="p-text">
					<text class="tips">4.3</text>对于一票多件的快件，如果是国际快件，因海关严禁寄递物品多件捆扎寄递，所以必须按照一票多件操作规范进行操作。如果是国内互寄快件，单票重量不超1kg,且每件快件外包装形状相同，体积最大的快件一侧面积小于运单的，可以多件捆扎寄递，但同时必须在连体快件上批注运单号码，并将连体快件捆扎牢固。凡是两件或两件以上合装的快件，必须要用打包带加固。例如有三个同规格鞋盒子一起寄递时，可将三个盒子进行捆扎牢固，作为一票快件寄递。
				</view>
				<view class="p-text">
					<text class="tips">4.4</text>对于重复利用的旧包装材料，均必须清除原有运单及其他特殊的快件标记后方可使用，以避免因旧包装内容而影响快件的流转。
				</view>
				<view class="p">
					<text class="tips">5.处理场地快件包装破损及不合格包装的常见情况</text>
				</view>
				<view class="p-text">
					<text class="tips">5.1</text>包装箱有2cm以上的破洞或有明显的撕裂，快件内件容易脱落或被损毁。
				</view>
				<view class="p-text">
					<text class="tips">5.2</text>快件的包装箱有水湿、油污现象。 外包装箱被压垮、折断，如纸箱包装的家用电器（零部件）的快件经常发生包装被压垮、折断。
				</view>
				<view class="p-text">
					<text class="tips">5.3</text>在搬运过程中，虽外包装完好，但能感觉到快件内容品之间有摩擦、碰撞，并伴有碰撞音或有异常已破坏的声音。
				</view>
				<view class="p-text">
					<text class="tips">5.4</text>快件外包装未损毁，但有异常的气味或强烈的刺激气味。 快件外包装为已使用过的旧包装物，表面留有旧运单、标签、地址等，或旧运单、标签、地址去除得不彻底。
				</view>
				<view class="p-text">
					<text class="tips">5.5</text>快件的外包装为海报或塑料等易破损包装物。
				</view>
				<view class="p">
					<text class="tips">6.包装的注意事项示例</text>
				</view>
				<view class="p-text">
					<text class="tips">6.1</text>绳索、带子，对于使用绳索或带子捆扎施封的包装，必须去除这些绳索或带子，使用胶带进行封箱。
				</view>
				<view class="p-text">
					<text class="tips">6.2</text>胶带，对于使用玻璃纸胶带、医用胶布施封的包装，应去除该施封胶带并使用专用胶带进行封箱。
				</view>
				<view class="p-text">
					<text class="tips">6.3</text>使用过的箱体，使用有压垮痕迹、有破洞及有油渍、水渍的使用过的箱子对保价标的物进行包装，应将其保价标的物或连同箱子一起置入合格之外包装内；对于可接受的使用过的包装，必须去除包装外侧所有标签、号码、地址信息及一切有可能影响操作人员识别的粘贴物品和信息。
				</view>
				<view class="p-text">
					<text class="tips">6.4</text>易破损材料，对于使用易破损材料作为外包装的保价标的物，如保丽龙箱、塑料等，应将其置入合格之外包装内。
				</view>
				<view class="p-text">
					<text class="tips">6.5</text>内件保护，收到包装好的物品时，稍加晃动，如能听到内件发出相互碰撞之声音，应向寄件人提出检查包裹要求，并建议寄件人使用足够的填充物，以适合长途转运操作，避免内容物相互碰撞破损。
				</view>
				<view class="p-text">
					<text class="tips">6.6</text>易碎物品，对于瓷器和玻璃制品，必须在包装内部六个面加垫防震材料，且箱体内每一件瓷器或玻璃制品必须单独使用泡沫或其他材料进行包装。
				</view>
				<view class="p-text">
					<text class="tips">6.7</text>小件物品，大量小件内容物零散至于包裹中，如螺栓、螺钉、螺母、钉子等物品，必须以麻布袋包裹后，再置入合格之外包装中。
				</view> -->
			</scroll-view>
		</view>
		<view class="submit">
			<view class="submit-button" @click="confirmAgreement">我已阅读并同意本协议</view>
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
			confirmAgreement(){
				let self = this;
				self.$emit('confirmAgreement')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.agreement{
		position: relative;
		width:88%;
		height:800rpx;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 10rpx;
		padding-bottom: 110rpx;
		z-index: 9999;
		.title{
			width: 100%;
			height: 90rpx;
			padding: 20rpx;
			font-size: 30rpx;
			font-weight: bold;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000;
			letter-spacing: 6rpx;
		}
		.content{
			width: 100%;
			height:calc(100% - 90rpx);
			overflow-y: scroll;
			padding: 0 40rpx;
			font-size: 26rpx;
			letter-spacing: 4rpx;
			.main{
				width: 100%;
				height: 100%;
			}
			.p{
				padding: 10rpx 0;
			}
			.tips{
				font-size: 26rpx;
				font-weight: bold;
			}
			.red{
				color: red;
			}
			.blue{
				color:#54c9f3;
			}
		}
		.submit{
			position: absolute;
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
				// width:500rpx;
				width: 80%;
				height: 70rpx;
				display: flex;
				font-size: 28rpx;
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
