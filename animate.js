~function () {
    window.utils = (function () {
        //=>获取样式
        let getCss = (ele, attr) => {
            let val = null,
                reg = /^-?\d+(\.\d+)?(px|rem|em)?$/;
            if ('getComputedStyle' in window) {
                val = window.getComputedStyle(ele)[attr];
                if (reg.test(val)) {
                    val = parseFloat(val);
                }
            }
            return val;
        };

        //=>设置样式
        let setCss = (ele, attr, value) => {
            if (!isNaN(value)) {
                if (!/^(opacity|zIndex)$/.test(attr)) {
                    value += 'px';
                }
            }
            ele['style'][attr] = value;
        };

        //=>批量设置样式
        let setGroupCss = (ele, options) => {
            for (let attr in options) {
                if (options.hasOwnProperty(attr)) {
                    setCss(ele, attr, options[attr]);
                }
            }
        };

        //=>合并为一个
        let css = (...arg) => {
            let len = arg.length,
                fn = getCss;
            if (len >= 3) {
                fn = setCss;
            }
            if (len === 2 && typeof arg[1] === 'object') {
                fn = setGroupCss;
            }
            return fn(...arg);
        };

        return { css }
    })();
    let effect = {
        linear: (t, d, c, b) => t / d * c + b
    }
    window.animate = (ele, target = {}, duration = 1000,callback=new Function()) => {
        let begin = {},
            change = {},
            time = 0;
        for (let attr in target) {
            if (target.hasOwnProperty(attr)) {
                begin[attr] = utils.css(ele, attr);
                change[attr] = target[attr] - begin[attr];
            }
        }
        clearInterval(ele.animateTimer)
        ele.animateTimer = setInterval(() => {
            time += 17
            if (time >= duration) {
                utils.css(ele, target)
                clearInterval(ele.animateTimer)
                callback.call(ele)
                return
            }
            let cur = {}
            for (let attr in target) {
                if (target.hasOwnProperty(attr)) {
                    cur[attr] = effect.linear(time, duration, change[attr], begin[attr])
                }
            }
            utils.css(ele, cur)
        }, 17)
    }
}()
