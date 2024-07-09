window.addEventListener('scroll', () => {
  const box = document.getElementById('largeiconbox');
  const svg = document.getElementById('largeicon');
  const text = document.getElementById('titlename');
  const message = document.getElementById('frontmessage');
  const button = document.getElementById('button_holder');
  const arrow = document.getElementById('arrow');

  const scrollTop = window.scrollY;

  const vh = (scrollTop / window.innerHeight) * 100;

  // console.log(vh);

  const svgStyle = window.getComputedStyle(svg);
  const svgmargin = svgStyle.getPropertyValue('margin-left');
  const marginLeftNumber = parseFloat(svgmargin);

  const messageStyle = window.getComputedStyle(message);
  const messagePadding = messageStyle.getPropertyValue('padding-top');
  const paddingtopNumber = parseFloat(messagePadding);

  const scrollProgress =
    (scrollTop * 3) /
    (document.documentElement.scrollHeight - window.innerHeight);
  const scrollProgress2 =
    scrollTop / (document.documentElement.scrollHeight - window.innerHeight);
  let top = 0;

  if (marginLeftNumber > -755 && vh > 0) {
    svg.style.marginTop = `${50 - vh * 1.05}vh`;
    svg.style.marginLeft = `${-vh * 1.05}vh`;
    svg.style.width = `${30 - vh * 0.6}vh`;
    svg.style.height = `${30 - vh * 0.6}vh`;

    text.style.opacity = scrollProgress;
    button.style.opacity = scrollProgress2;
    arrow.style.opacity = 1 - scrollProgress;
  }

  // console.log(vh);

  if (marginLeftNumber <= -755) {
    svg.style.marginTop = `${10}vh`;
    svg.style.marginLeft = `${-80}vw`;
    svg.style.width = `${30 - 38 * 0.6}vh`;
    svg.style.height = `${30 - 38 * 0.6}vh`;
    text.style.opacity = 100;
  }

  console.log(paddingtopNumber);

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;

  if (paddingtopNumber > screenHeight / 4 && top == 0) {
    message.style.paddingTop = `${50 - vh}vh`;
    console.log(vh);
  } else {
    top = 1;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const title = document.getElementById('titlename');
  const button = document.getElementsByClassName('front_page_button');

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  console.log(screenHeight);
  console.log(screenWidth);

  //2124 980
  if (screenHeight < screenWidth) {
    title.style.marginLeft = `${-5}vw`;
    button[0].style.width = '30vw';
    button[0].style.height = '10vh';
    button[0].style.marginLeft = '35vw';
    button[0].style.fontSize = '3vh';
    button[1].style.width = '30vw';
    button[1].style.height = '10vh';
    button[1].style.marginLeft = '35vw';
    button[1].style.marginTop = '5vh';
    button[1].style.fontSize = '3vh';
  }
});
