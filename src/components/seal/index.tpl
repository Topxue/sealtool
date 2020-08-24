<div class="seale-list">
  <figure>
      <img id="sealImg" src="{{imgUrl}}" alt="">
  </figure>
  <div class="set-trans">
      <button class="reduce" data-ops="reduce">-</button>
      <input type="number" value="{{vague}}" class="trans-val">
      <button class="plus" data-ops="plus">+</button>
  </div>
  <div class="base-btn">
      <a id="copy" data-clipboard-text="{{imgUrl}}">复制base64</a>
      <a href="{{imgUrl}}" download="seal">下载</a>
  </div>
</div>