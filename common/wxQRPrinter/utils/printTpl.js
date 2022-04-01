
// 韵达同城联面单格式  -- 面单上的宽度和高度要乘以8
let YDTCL = [
	"! 0 200 200 980 1\r\n",
	"PW 608\r\n",
	"GAP-SENSE\r\n",
	"TEXT 24 0 480 35 同城\r\n",
	"TEXT 24 0 480 65 特快\r\n",
	"BOX 460 32 545 97 2\r\n",
	// 画整个边框()
	"LINE 0 97 550 97 2\r\n",
	"TEXT 55 11 0 80 {{registerDate}}\r\n",
	"SETMAG 3 3\r\n",
	// "SETBOLD 1\r\n",
	// 四段码并设置粗体指令：SETBOLD 、字符放大指令：<SETMAG >
	"TEXT 24 0 0 115 {{oneCode}} {{twoCode}} {{threeCode}} {{fourCode}}\r\n",
	// "SETBOLD 0\r\n",
	"SETMAG 1 1\r\n",
	// "SETBOLD 1\r\n",
	// "SETMAG 2 2\r\n",
	// "SETMAG 0 0\r\n",
	// "SETBOLD 0\r\n", 
	// "T 55 11 15 135 {{oneCode}} {{twoCode}} {{threeCode}} {{fourCode}}\n",
	"LINE 0 190 550 190 2\r\n",
	// 横向条形码及单号
	"BARCODE 128 3 40 110 5 200 {{billCode}}\r\n",
	"TEXT 24 0 172 320 {{billCode}}\r\n",
	"LINE 0 350 550 350 2\r\n",
	// 收件地址
	"SETMAG 2 2\r\n",
	// "SETBOLD 1\r\n",
	"TEXT 55 11 5 360 {{acceptManAddress}}{{recFontNum}}\r\n",
	// 四段码并设置粗体指令：SETBOLD 、字符放大指令：<SETMAG >
	// "TEXT 2 0 0 120 {{oneCode}} {{twoCode}} {{threeCode}} {{fourCode}}\r\n",
	// "SETBOLD 0\r\n",
	"SETMAG 1 1\r\n",
	"LINE 0 470 440 470 2\r\n",
	"SETMAG 3 3\r\n",
	// 集
	"TEXT 55 11 11 485 集\r\n",
	// 收
	"TEXT 55 11 11 565 收\r\n",
	"INVERSE-LINE 0 560 60 560 60\r\n",
	// 寄
	"TEXT 55 11 11 695 寄\r\n",
	"SETMAG 2 2 \r\n",
	// 集
	"BOX 0 480 60 540 2\r\n",
	// 收
	// "BOX 0 560 60 620 2\r\n",
	// 寄
	"BOX 0 690 60 750 2\r\n",
	// 派件分拨
	"SETMAG 2 2\r\n",
	"SETBOLD 1\r\n",
	"TEXT 55 11 80 490 {{destinationCenter}}\r\n",
	"SETBOLD 0\r\n",
	"SETMAG 1 1\r\n",
	"LINE 0 550 440 550 2\r\n",
	// 收件人
	"TEXT 24 0 80 555 {{acceptMan}}\r\n",
	// 收件电话
	"TEXT 24 0 240 555 {{acceptManPhone}}\r\n",
	// 收件地址
	"SETBOLD 1\r\n",
	"TEXT 24 0 80 590 {{acceptProvince}}{{acceptCity}}{{acceptCounty}}{{acceptManAddress}}{{cut|25|14}}\r\n",
	"SETBOLD 0\r\n",
	"LINE 0 680 440 680 2 \r\n",
	// 寄件人
	"TEXT 24 0 80 690 {{sendMan}}\r\n",
	// 寄件电话
	"TEXT 24 0 240 690 {{sendManPhone}}\r\n",
	// 寄件地址
	"TEXT 24 0 80 725 {{sendProvince}}{{sendCity}}{{sendCounty}}{{sendManAddress}}{{cut|25|14}}\r\n",
	"LINE 0 815 550 815 2\r\n",
	"LINE 440 350 440 815 2\r\n",  //竖线
	// 备注
	"TEXT 24 0 11 820 备注：\r\n",
	"TEXT 24 0 11 850 {{remark}}{{cut|25|14}}\r\n",
	// 物品类型
	"TEXT 24 0 380 820 物品类型：\r\n",
	"TEXT 24 0 380 850 {{goodsName}}{{cut|25|8}}\r\n",
	//已检视
	"TEXT 24 0 380 900 已验视\r\n",
	// 纵向条形码
	"VBARCODE 128 2 50 90 475  810 {{billCode}}\r\n",
	"TEXT270 24 0 470 530 {{billCode}}\r\n",
	"ENDML\r\n",
	"SETSP 0\r\n",
	"FORM\r\n",
	"PRINT\r\n"
]
module.exports = {
	'韵达同城联': YDTCL
}
