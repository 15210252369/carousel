let bannerRender = (function () {
    //获取需要操作的元素
    let container = document.querySelector('#container'),
        wrapper = container.querySelector('.wrapper'),
        focus = container.querySelector('.focus'),
        arrowLeft = container.querySelector('.arrowLeft'),
        arrowRight = container.querySelector('.arrowRight')
        slideList = null,
        focusList = null
    let stepIndex = 0
    let autoTimer = null
    let interval = 1000

    let autoMove = function () {
        stepIndex++
        if (stepIndex >= slideList.length) {
            stepIndex = 1
            utils.css(wrapper, 'left', 0)
        }
        animate(wrapper, {
            left: -stepIndex * 1000
        }, 200)
        changeFocus()
    }
    let changeFocus = function () {
        let tempIndex = stepIndex
        tempIndex === slideList.length - 1 ? tempIndex = 0 : null
        Array.prototype.forEach.call(focusList, (item, index) => {
            item.className = index === tempIndex ? 'active' : ''
        })

    }
    //基于Promise 获取数据
    let queryData = function () {
        return new Promise((resolve) => {
            let xhr = new XMLHttpRequest
            xhr.open('get', './json/banner.json')
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText)
                    resolve(data)
                }
            }
            xhr.send()
        })
    }
    //绑定数据
    let bindHTML = function bindHTML(data) {
        let strSlide = ``,
            strFocus = ``;
        data.forEach((item, index) => {
            //->解构的时候如果当前返回的数据中没有IMG,我们可以让其等于默认图片
            let { img = 'img/banner1.jpg', desc = '珠峰培训' } = item;
            strSlide += `<div class="slide">
                <img src="${img}" alt="${desc}">
            </div>`;

            //->ES6模板字符串中${}存放的是JS表达式,但是需要表达式有返回值,因为我们要把这个返回值拼接到模板字符串中
            strFocus += `<li class="${index === 0 ? 'active' : ''}">
            </li>`;
        });

        //=>把第一张克隆一份放到最末尾
        // strSlide += `<div class="slide">
        //     <img src="${data[0].img}" alt="${data[0].desc}">
        // </div>`;

        wrapper.innerHTML = strSlide;
        focus.innerHTML = strFocus;

        //->获取所有的SLIDE和LI
        slideList = wrapper.querySelectorAll('.slide');
        focusList = focus.querySelectorAll('li')

        //->把现有的第一张克隆一份放到容器的末尾（由于querySelectorAll不存在DOM映射，新增加一个原有集合中还是之前的SLIDE，所以我们需要重新获取一遍）
        wrapper.appendChild(slideList[0].cloneNode(true));
        slideList = wrapper.querySelectorAll('.slide');
        focusList = focus.querySelectorAll('li')

        //->根据SLIDE的个数动态计算WRAPPER的宽度
        utils.css(wrapper, 'width', slideList.length * 1000);
    };
    let handleContainer = function () {
        container.onmouseenter = function () {
            clearInterval(autoTimer)
            arrowLeft.style.display = arrowRight.style.display = 'block'
        }
        container.onmouseleave = function () {
            autoTimer = setInterval(autoMove, interval)
            arrowLeft.style.display = arrowRight.style.display = 'none'
        }
    }
    let handleFocus = function () {
        Array.prototype.forEach.call(focusList, (item, index) => {
            item.onclick = function () {
                stepIndex = index
                animate(wrapper, {
                    left: -stepIndex * 1000
                }, 200)
                changeFocus()
            }
        })
    }
    let handleArrow = function () {
        arrowRight.onclick = function () {
            autoMove()
        }
        arrowLeft.onclick = function () {
            stepIndex--
            if (stepIndex < -0) {
                utils.css(wrapper, 'left', -(slideList.length - 1) * 1000)
                stepIndex = slideList.length - 2
            }
            animate(wrapper, {
                left: -stepIndex * 1000
            }, 200)
            changeFocus()
        }
    }
    return {
        init: function () {
            let promise = queryData();
            promise.then(bindHTML).then(() => {
                autoTimer = setInterval(autoMove, interval)
            }).then(() => {
                handleContainer()
                handleFocus()
                handleArrow()
            })
        }
    }
})()
bannerRender.init()