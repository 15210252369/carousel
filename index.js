
let handleRender = (function () {
    let container = document.querySelector('#container'),
        wrapper = container.querySelector('.wrapper'),
        focus = container.querySelector('.focus'),
        arrowLeft = container.querySelector('.arrowLeft'),
        arrowRight = container.querySelector('.arrowRight')
    let slideList = null
    let focusList = null
    //定于轮播图参数
    let interval = 1000
    let stepIndex = 0
    let autoTimer = null

    //获取后台数据
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
    let bindHTML = function (data) {
        let strSlide = ``
        let strFocus = ``
        data.forEach((item, index) => {
            let { img, desc } = item
            strSlide += `
           <div class="slide">
            <img src="${img}" alt="${desc}">
            </div>
           `
            strFocus += `
            <li class="${index === 0 ? 'active' : null}"></li>
           `
        })
        wrapper.innerHTML = strSlide
        focus.innerHTML = strFocus

        slideList = wrapper.querySelectorAll('.slide')
        focusList = focus.querySelectorAll('li')

        wrapper.appendChild(slideList[0].cloneNode(true))
        slideList = wrapper.querySelectorAll('.slide')

        utils.css(wrapper, 'width', slideList.length * 1000)
    }
    //实现动画 
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
    //实现焦点切换
    let changeFocus = function () {
        let tempIndex = stepIndex
        tempIndex === slideList.length - 1 ? tempIndex = 0 : null
        Array.prototype.forEach.call(focusList, (item, index) => {
            item.className = index === tempIndex ? 'active' : ''
        })
    }
    //鼠标进入
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
    //点击arrow
    let handleArrow = function () {
        arrowRight.onclick = function () {
            autoMove()
        }
        arrowLeft.onclick = function () {
            stepIndex--
            if (stepIndex < 0) {
                utils.css(wrapper, 'left', -(slideList.length - 1) * 1000)
                stepIndex = slideList.length - 2
            }
            animate(wrapper, {
                left: -stepIndex * 1000
            }, 200)
            changeFocus()
        }
    }
    let handleFocus=function(){
        Array.prototype.forEach.call(focusList,(item,index)=>{
            item.onclick=function(){
                stepIndex=index
                animate(wrapper,{
                    left:-stepIndex*1000
                },200)
                changeFocus()
            }
        })
    }
    return {
        init: function () {
            let promise = queryData()
            promise.then(bindHTML).then(() => {
                autoTimer = setInterval(autoMove, interval)
            }).then(() => {
                handleContainer()
                handleArrow()
                handleFocus()
            })
        }
    }
})()
handleRender.init()