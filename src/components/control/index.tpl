<div class="seal-container container default-style">
    <div class="flex-conatiner">
      <!-- 图片视口容器 -->
      <div class="img-container">
        <!-- 显示图片 -->
        <div class="img-prview">
          <img id="image" src="" alt="">
        </div>
        <div class="bottom-w">
          |<span></span>宽<span></span>|
        </div>
        <div class="bottom-h">
          |<span></span>高<span></span>|
        </div>
      </div>
      <!-- 操作选项容器 -->
      <div class="ops-container">
        <div class="set-title">印章尺寸设置</div>
        <div class="set-size">
          <div class="set-size-list">
            <span>印章宽度</span>
            <div class="set-wight"><input type="number" value="42" id="sealWigth"></div>
            <span> mm</span>
          </div>
          <div class="set-size-list">
            <span>印章高度</span>
            <div class="set-wight"><input type="number" value="42" id="sealHeight"></div>
            <span> mm</span>
          </div>
        </div>
        <div class="set-title">其他设置</div>
        <div class="set-other">
          <div class="box">
            <div class="label">旋转角度</div>
            <div class="bar">
              <p><i></i></p>
            </div>
            <div class="set-trans" id="setTrans">
              <button class="reduce" data-ops="reduce">-</button>
              <input type="number" value="0" class="trans-val">
              <button class="plus" data-ops="plus">+</button>
            </div>
          </div>
          <div class="sign-color">
            <div class="label">印章颜色</div>
            <div class="select-color" id="selectColor">
              <div class="color-list default" data-theme="default"><img src="{{check}}" alt=""> 默认</div>
              <div class="color-list redcolor" data-theme="redcolor"></div>
              <div class="color-list bluecolor" data-theme="bluecolor"></div>
              <div class="color-list blackcolor" data-theme="blackcolor"></div>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <button id="seeSeal">查看印章效果</button>
          <button id="resetBtn">重置</button>
        </div>
      </div>
    </div>
    <div class="handle-pic-bottom">
      <div class="bottom-none">
        <img src="{{loadSvg}}" alt="">
        <p>请点击按钮“查看印章效果”获取印章效果图</p>
      </div>
      <!-- 印章效果容器 -->
      <div class="sealeffectx"></div>
    </div>
  </div>