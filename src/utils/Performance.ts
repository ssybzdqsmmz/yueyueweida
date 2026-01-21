/**
 * @description: 节流函数，规定指定时间内才执行 
 * @param {*} func
 * @param {*} delay
 * @return {*}
 */
function throttle(func, delay) {
	let startTime = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - startTime >= delay) {
			func.apply(this, args);
			startTime = now;
		}
	};
}

/**
 * @description: 用户停止当前操作多少秒才执行
 * @param {*} func
 * @param {*} t
 * @return {*}
 */
function debounce(func, t) {
	let timerId;
	return () => {
		let interval = t || 500;
		if (timerId == undefined) {
			timerId = setTimeout(func, interval); // 在第一次缩放更新
		} else {
			clearTimeout(timerId); // 重新开始计时
			timerId = setTimeout(func, interval);
		}
	};
}

export {
	debounce, throttle
}