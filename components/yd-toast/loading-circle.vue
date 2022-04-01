<template>
	<view class="progress_box"><canvas class="progress_bar" canvas-id="cpbar"></canvas></view>
</template>

<script>
export default {
	name: 'LoadingCircle',
	props: {},
	data() {
		return {
			timer: 0
		}
	},
	mounted: function() {
		this.drawCircle()
	},
	beforeDestroy: function() {
		this.clearInterval()
	},
	methods: {
		drawCircle: function() {
			const ctx = uni.createCanvasContext('cpbar', this)
			let start = 0 // 起始角度
			const limitPi = this.accDiv(this.accMul(3, Math.PI), 2)
			const resetPi = this.accMul(-2, Math.PI)
			const dotPi = this.accDiv(this.accMul(2, Math.PI), 3)
			const dotIncrease = this.accDiv(this.accMul(2, Math.PI), 225)
			const lineIncrease = this.accDiv(this.accMul(2, Math.PI), 75)
			let current = 0
			let restart = false
			let suspend = false
			let once = 0
			this.timer = setInterval(() => {
				const lineWidth = uni.upx2px(2.2)
				ctx.setLineWidth(lineWidth)
				ctx.setStrokeStyle('#FFFFFF')
				ctx.setLineCap('square')
				ctx.beginPath()
				if (!once && start >= dotPi) {
					once++
					suspend = true
					const time = setTimeout(() => {
						suspend = false
					}, 100)
				}
				const x = uni.upx2px(16.12)
				const y = uni.upx2px(16.12)
				const r = uni.upx2px(13.92)
				if (suspend) {
					ctx.arc(x, y, r, start, current, false)
					ctx.stroke()
					ctx.draw()
					return
				}
				if (start >= limitPi) {
					once = 0
					start = this.accAdd(start, resetPi)
				}
				if (start < 0) {
					restart = true
				} else if (restart) {
					start = 0
					current = 0
					restart = false
				}
				if (current >= limitPi) {
					current = this.accAdd(current, resetPi)
				} else {
					if (start >= dotPi || restart) {
						start = this.accAdd(start, lineIncrease)
					} else {
						current = this.accAdd(current, lineIncrease)
						start = this.accAdd(start, dotIncrease)
					}
				}
				ctx.arc(x, y, r, start, current, false)
				ctx.stroke()
				ctx.draw()
			}, 10)
		},
		clearInterval: function() {
			clearInterval(this.timer)
		},
		accAdd: function(arg1, arg2) {
			var r1, r2, m
			try {
				r1 = arg1.toString().split('.')[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split('.')[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2))
			return (arg1 * m + arg2 * m) / m
		},
		accMul: function(arg1, arg2) {
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString()
			try {
				m += s1.split('.')[1].length
			} catch (e) {}
			try {
				m += s2.split('.')[1].length
			} catch (e) {}
			return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
		},
		accDiv: function(arg1, arg2) {
			var t1 = 0,
				t2 = 0,
				r1,
				r2
			try {
				t1 = arg1.toString().split('.')[1].length
			} catch (e) {}
			try {
				t2 = arg2.toString().split('.')[1].length
			} catch (e) {}
			r1 = Number(arg1.toString().replace('.', ''))
			r2 = Number(arg2.toString().replace('.', ''))
			return (r1 / r2) * Math.pow(10, t2 - t1)
		}
	}
}
</script>

<style>
.progress_box {
	position: relative;
	width: 32.23rpx;
	height: 32.23rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}
.progress_bar {
	position: absolute;
	width: 32.23rpx;
	height: 32.23rpx;
}
</style>
