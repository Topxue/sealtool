/*
 * @Author: ives-xue
 * @Date: 2020-08-05 15:28:50
 * @LastEditTime: 2020-08-24 19:54:41
 */
'use strict'

import $ from 'jquery'
import 'babel-polyfill'
import './lib/css/index.css'
import './lib/css/cropper.min.css'

import uploadTpl from './components/upload'
import controlTpl from './components/control'
import sealTpl from './components/seal'

import Cropper from './lib/js/cropper.min.js'
import Clipboard from 'clipboard'

import SELECT_IMG from './images/check.png'
import UPLOAD_SVG from './images/upload.svg'
import LOAD_SVG from './images/load.svg'
import REPLACE_SVG from './images/replace.svg'

import {
  setWandH,
  setImgTrans,
  selectTheme,
  binarize,
  replaceTpl,
} from './lib/utils'

// 印章颜色
let themeColor = 'rgb(61, 59, 60)'

@selectTheme
class Sealtool {
  constructor(params) {
    this.defaultParams = {
      elem: '#sealConatiner',
    }
    this.params = Object.assign(this.defaultParams, params)

    this.render()
  }
  // 初始化DOM-渲染
  render() {
    const { elem } = this.params

    $(elem).append(replaceTpl(uploadTpl(), { uploadSvg: UPLOAD_SVG }))
    $(elem).append(
      replaceTpl(controlTpl(), {
        check: SELECT_IMG,
        loadSvg: LOAD_SVG,
        replace: REPLACE_SVG,
      })
    )

    // 获取进度条-DOM
    this.selectDom = {
      oi: document.querySelector('.bar i'),
      op: document.querySelector('.bar p'),
      obar: document.querySelector('.bar'),
    }

    this.init()
  }

  init() {
    this.handleEvent()
  }
  // 初始化事件
  handleEvent() {
    const { oi } = this.selectDom

    // 监听图片上传
    $('#imgFile').change(this.handleImgPrview.bind(this))
    // 更换img
    $('#changeImg').change(this.handleImgPrview.bind(this))
    // 监听进度条
    oi.addEventListener('mousedown', this.onProgress.bind(this))
    // 设置印章宽度
    $('#sealWigth').on('change', this.setSealWidth.bind(this))
    // 设置印章高度
    $('#sealHeight').on('change', this.setSealHeight.bind(this))
    // 图片旋转角度设置
    $('#setTrans').on('click', 'button', this.setImgTansRotate.bind(this))
    $('.set-trans input').on('blur', this.setImgTansRotate.bind(this))
    // 印章颜色切换
    $('#selectColor').on('click', 'div', this.checkSignColor.bind(this))
    // 查看印章设置
    $('#seeSeal').on('click', this.renderSeal.bind(this))
    // 重置
    $('#resetBtn').on('click', this.reset.bind(this))
  }

  // 监听上传图片预览
  handleImgPrview(event) {
    let files = event.target.files,
      file
    if (files && files.length > 0) {
      // 获取目前上传的文件
      file = files[0]
      // 获取window的 URL工具
      let URL = window.URL || window.webkitURL
      // 通过 file生成目标 url
      let imgURL = URL.createObjectURL(file)
      // $('#image').attr('src', imgURL)

      let hasIamg = $('#image').attr('src')
      if (hasIamg) {
        this.cropper.replace(imgURL, true)
      } else {
        // 用这个URL产生一个 <img> 将其显示出来
        $('#image').attr('src', imgURL)
      }

      // 初始化剪切容器
      this.initCropper(imgURL)
      // 隐藏其他容器
      this.hidenContainer()
    }
  }

  // 初始化剪切容器
  async initCropper() {
    const _this = this
    _this.cropper = await new Cropper(image, {
      aspectRatio: 7 / 7,
      viewMode: 1,
      autoCropArea: 0.5,
      dragMode: 'move',
    })
    _this.cropper.setCropBoxData(setWandH())
  }

  // 控制容器的显示隐藏
  hidenContainer() {
    // 上传容器隐藏
    $('.hiden').css('display', 'none')
    // 操作容器显示
    $('.default-style').css('display', 'block')
  }

  setSealWidth(event) {
    let value = event.target.value
    if (value > 100) {
      alert('宽度最大值为100mm')
      event.target.value = 100
      if (this.cropper) this.cropper.setCropBoxData(setWandH(100))
      return false
    }
    if (value < 10) {
      alert('宽度最小值为10mm')
      event.target.value = 10
      if (this.cropper) this.cropper.setCropBoxData(setWandH(10))
      return false
    }
    if (this.cropper) this.cropper.setCropBoxData(setWandH(value))
  }

  setSealHeight(event) {
    let value = event.target.value
    if (value > 100) {
      alert('高度最大值为100mm')
      event.target.value = 100
      if (this.cropper) this.cropper.setCropBoxData(setWandH(100, 50))
      return false
    }
    if (value < 10) {
      alert('高度最小值为10mm')
      event.target.value = 10
      if (this.cropper) this.cropper.setCropBoxData(setWandH(50, 10))
      return false
    }
    if (this.cropper) this.cropper.setCropBoxData(setWandH(50, value))
  }

  // 监听旋转进度条
  onProgress(eve) {
    const _this = this
    const { oi, obar, op } = _this.selectDom
    // 按下时获取按下的事件对象，准备稍后获取按下时的坐标
    let e1 = eve || window.event
    // 阻止默认事件
    e1.preventDefault()

    document.addEventListener('mousemove', move)

    function move(eve) {
      let e2 = eve || window.event
      // 移动时利用鼠标相对于屏幕的坐标，减去，按下时的坐标，减去，所在框的距离坐标屏幕的距离
      let l = e2.clientX - e1.offsetX - obar.offsetLeft
      // 边界限定
      if (l < 0) l = 0
      if (l > obar.offsetWidth - oi.offsetWidth) {
        l = obar.offsetWidth - oi.offsetWidth
      }
      // 生效滑块
      oi.style.left = l + 'px'
      // 生效进度条
      op.style.width = l + 10 + 'px'
      // 计算比例
      let transCount = parseInt((l / (obar.offsetWidth - oi.offsetWidth)) * 360)
      $('#setTrans .trans-val').val(transCount)
      // 设置图片旋转
      setImgTrans(_this.cropper, transCount)
    }
    document.addEventListener('mouseup', up)

    function up() {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
  }

  // 设置旋转角度
  setImgTansRotate(elem) {
    if (elem.target.value) {
      setImgTrans(this.cropper, Number(elem.target.value))
      return false
    }
    const CUREN_OPS = $(elem.currentTarget).attr('data-ops')
    let tarnsVal = Number($('#setTrans .trans-val').val())
    this.curenLeft = Number(oi.style.left.split('px')[0])
    // 生效滑块
    oi.style.left =
      CUREN_OPS === 'plus'
        ? this.curenLeft + 1 + 'px'
        : this.curenLeft - 1 + 'px'
    // 生效进度条
    op.style.width =
      CUREN_OPS === 'plus'
        ? this.curenLeft + 10 + 'px'
        : this.curenLeft - -3 + 'px'

    let transCount = CUREN_OPS === 'plus' ? tarnsVal + 1 : tarnsVal - 1
    $('#setTrans .trans-val').val(transCount)
    setImgTrans(this.cropper, transCount)
  }

  // 切换印章颜色
  checkSignColor(elem) {
    let curenElem = $(elem.currentTarget)
    let isCheck = curenElem.children()
    let theme = curenElem.attr('data-theme')
    // 当前是否选中
    if (!isCheck.length) curenElem.prepend(`<img src="${SELECT_IMG}"  alt=""/>`)
    curenElem.siblings('div').children().remove('img')

    // 赋值印章颜色
    themeColor = this[theme]()
  }

  // 隐藏印章相关操作
  hideSealops() {
    $('.bottom-none').css('display', 'none')
    $('.sealeffectx').css('display', 'block')
  }

  // 查看-渲染印章效果
  renderSeal() {
    const SEAL_VAGUE = [40, 60, 80, 100]
    $('.sealeffectx').children().remove()

    SEAL_VAGUE.forEach((item) => {
      const { url } = this.getSeal(item)
      $('.sealeffectx').append(
        replaceTpl(sealTpl(), { imgUrl: url, vague: item })
      )
    })

    // 注册模糊度修改事件
    $('.seale-list').on('click', 'button', this.setSealVague.bind(this))
    $('.seale-list').on('change', 'input', this.setSealVague.bind(this))
    // 复制事件注册初始化
    let clipboard = new Clipboard('#copy')
    clipboard.on('success', function (e) {
      e.clearSelection()
    })

    this.hideSealops()
  }

  getSeal(vague) {
    console.log(this.cropper)
    let canvas = this.cropper.getCroppedCanvas(),
      e = canvas.getContext('2d')

    return (
      (e.fillStyle = themeColor),
      (e = binarize(vague, e, canvas.width, canvas.height, themeColor)),
      {
        threshold: vague,
        checked: !1,
        url: canvas.toDataURL(),
      }
    )
  }

  // 重置
  reset() {
    // 重置图片/剪切框
    if (this.cropper) this.cropper.reset()
    // 重置印章尺寸设置
    $('#sealWigth').val(42)
    $('#sealHeight').val(42)
    // 印章颜色重置
    $('.default').click()
    $('.bottom-none').css('display', 'block')
    $('.sealeffectx').css('display', 'none')
  }

  // 印章修改模糊度
  setSealVague(event) {
    const target = $(event.currentTarget)
    const CUREN_OPS = $(target).attr('data-ops')
    const parentsUntil = $(target).parentsUntil()
    let targetVal = $(target).val()

    // input-change
    if (!CUREN_OPS) {
      const { url } = this.getSeal(targetVal)
      $(parentsUntil[1]).find('img').attr('src', url)

      return false
    }

    let input = CUREN_OPS == 'plus' ? target.prev() : target.next()

    if (CUREN_OPS == 'plus') {
      if (input.val() >= 99) target.attr('disabled', true)
      $(parentsUntil[1]).find('.reduce').attr('disabled', false)
    }

    if (CUREN_OPS == 'reduce') {
      if (input.val() <= 1) target.attr('disabled', true)
      $(parentsUntil[1]).find('.plus').attr('disabled', false)
    }

    input.val(CUREN_OPS == 'plus' ? +input.val() + 1 : +input.val() - 1)

    const { url } = this.getSeal(input.val())
    $(parentsUntil[1]).find('img').attr('src', url)
  }
}

// 初始化
new Sealtool()

// if(!window.Upload) window.Upload = Upload
window.Sealtool = Sealtool

export default Sealtool
