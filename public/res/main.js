let ticks, thisTick, nextTick, state, current = 0,
    delay = 2000,
    speed = 20,
    value = 1,
    stop = false;
const nooftweets = 6;

function getTimePeriod(timestamp) {
  const now = Date.now();
  const timeDifference = (now - timestamp) / 1000 / 60; // 时间差，单位为分钟
  let result = '';
  if (timeDifference < 60) {
    result = `about ${Math.floor(timeDifference)}m ago`;
  } else if (timeDifference / 60 < 24) {
    result = `about ${Math.floor(timeDifference / 60)}h ago`;
  } else {
    result = `about ${Math.floor(timeDifference / 60 / 24)}d ago`;
  }
  return result;
}

async function rotateNews() {
  const ticker = document.getElementById("front_news_text");
  const tlist = await showitems(nooftweets);
  ticker.innerHTML = tlist + `
    <li id="tick" style="display:none">
      Powered by <a href="mailto:liuweinan85[a]gmail.com" target="_self" onmouseover="stop=true" onmouseout="stop=false">
        <b>Vivian Liu</b>
      </a> &copy; 2006-${new Date().getFullYear()}
    </li>`;
  
  ticks = ticker.getElementsByTagName("li");
  Array.from(ticks).forEach((tick, i) => {
    tick.style.opacity = (i === 0) ? 1 : 0;
    tick.style.filter = (i === 0) ? 'alpha(opacity=1)' : 'alpha(opacity=0)';
    tick.style.display = (i === 0) ? 'block' : 'none';
  });

  loopNews();
}

function loopNews() {
  if (current >= ticks.length) current = 0;
  thisTick = nextTick || ticks[current];
  nextTick = ticks[++current] || ticks[0];
  
  thisTick.style.display = "block";
  state = "on";
  value = 1;
  setTimeout(fader, delay);
}

function fader() {
  if (stop) {
    setTimeout(fader, speed);
    return;
  }

  if (state === "on") {
    value -= 0.1;
    if (value > 0) {
      updateOpacity(thisTick, value);
      setTimeout(fader, speed);
    } else {
      thisTick.style.display = "none";
      nextTick.style.display = "block";
      state = "off";
      setTimeout(fader, speed);
    }
  } else {
    value += 0.1;
    if (value < 1) {
      updateOpacity(nextTick, value);
      setTimeout(fader, speed);
    } else {
      loopNews();
    }
  }
}

function updateOpacity(element, value) {
  element.style.opacity = value;
  element.style.filter = `alpha(opacity=${value * 100})`;
}

async function fetchAndProcessData(nooftweets) {
  const url = "https://isso.fly.dev/?uri=%2Fmoments";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const replies = data.replies || [];
    const sortedReplies = replies.sort((a, b) => b.created - a.created);
    return sortedReplies.slice(0, nooftweets).map(({ id, text, created }) => `
      <li id="tick${id}" style="display:none">
        <a href="/moments/${id}" target="_blank" onmouseover="stop=true" onmouseout="stop=false">${text.replace(/<[^>]*>/g, '')}</a>
        ${getTimePeriod(created * 1000)}
      </li>
    `).join("");
  } catch (error) {
    console.error("Error fetching data:", error);
    return "";
  }
}

async function showitems(nooftweets) {
  const tlist = await fetchAndProcessData(nooftweets);
  return tlist;
}

// Event Listener Initialization
document.addEventListener("DOMContentLoaded", rotateNews);

// 使用jQuery事件绑定时减少选择器的重复
$(document).ready(function() {
  // open menu
  $('.cd-menu-trigger').on('click', function(event) {
    event.preventDefault();
    $('#cd-main-content').addClass('move-out');
    $('#main-nav').addClass('is-visible');
    $('.cd-shadow-layer').addClass('is-visible');
  });

  // close menu
  $('.cd-close-menu').on('click', function(event) {
    event.preventDefault();
    $('#cd-main-content').removeClass('move-out');
    $('#main-nav').removeClass('is-visible');
    $('.cd-shadow-layer').removeClass('is-visible');
  });

  // clipped image - blur effect
  set_clip_property();
  $(window).on('resize', set_clip_property);
});

function set_clip_property() {
  const $header_height = $('.cd-header').height(),
        $window_height = $(window).height(),
        $header_top = $window_height - $header_height,
        $window_width = $(window).width();
  $('.cd-blurred-bg').css('clip', `rect(${ $header_top }px, ${ $window_width }px, ${ $window_height }px, 0px)`);
}
