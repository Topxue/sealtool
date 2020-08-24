// 替换模板

const replaceTpl = (tpl, params = {}) => {
  return tpl.replace(/{{(.*?)}}/g, (node, key) => {
    // return {
    //   [key]: params[key]
    // }
    return params[key] || ''
  })
}


// 设置剪切容器宽高
const setWandH = (w, h) => {
  return {
    width: Number(w * 4),
    height: Number(h * 4)
  }
}

// 设置图片旋转
const setImgTrans = (cropper, rotate) => {
  if (cropper) {
    cropper.setData({
      rotate
    })
  }
}

// 颜色主题-装饰器
const selectTheme = (target) => {
  target.prototype.default = () => 'rgb(61, 59, 60)'
  target.prototype.redcolor = () => 'rgb(255, 0, 0)'
  target.prototype.bluecolor = () => 'rgb(0, 0, 255)'
  target.prototype.blackcolor = () => 'rgb(0, 0, 0)'
}

// 设置图片颜色RGBA
const rgb2gray = (t, i) => {
  return parseInt(.3 * t[i] + .59 * t[i + 1] + .11 * t[i + 2])
}

// 获取颜色
const getRgba = (t) => {
  if (t.startsWith("rgb"))
    return t.match(/\d+/g);
  if (t.startsWith("#")) {
    var e = 2,
      o = [];
    4 == t.length && (e = 1);
    for (var i = 1, r = t.length; i < r;) {
      var n = t.substr(i, e);
      n = n.repeat(3 - e),
        o.push(parseInt(n, 16)),
        i += e
    }
    return o
  }
}

// 设置图片模糊度
const binarize = (t, e, o, r, themeColor) => {
  var n = e.getImageData(0, 0, o, r),
    data = n.data,
    l = getRgba(themeColor),
    c = 100 / t * 128;
  c = c > 255 ? 230 : c;
  for (var i = 0, h = data.length; i < h; i += 4) {
    var v = rgb2gray(data, i) >= c ? 255 : 0;
    data[i] = l[0],
      data[i + 1] = l[1],
      data[i + 2] = l[2],
      v && (data[i + 3] = 0)
  }
  return e.clearRect(0, 0, o, r),
    e.putImageData(n, 0, 0),
    e
}

export {
  setWandH,
  setImgTrans,
  selectTheme,
  binarize,
  replaceTpl
}