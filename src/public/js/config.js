var areYouReallySure = false;
function areYouSure() {
  if (allowPrompt) {
    if (!areYouReallySure && true) {
      areYouReallySure = true;
      return "¿Seguro que quieres salir?";
    }
  } else {
    allowPrompt = true;
  }
}

var allowPrompt = true;
window.onbeforeunload = areYouSure;

$(document).ready(function () {
  $("ul.tabs").tabs({
    swipeable: false,
    responsiveThreshold: Infinity,
  });
});

$(document).ready(function () {
  $(".sidenav").sidenav();
});

$(document).ready(function () {
  $(".tooltipped").tooltip();
});

$(document).ready(function () {
  $(".collapsible").collapsible();
});
