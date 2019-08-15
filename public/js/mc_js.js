$(document).ready(function(){

    window.onload = $("th.numberFormat").each(function () {
        $(this).html(parseInt($(this).text()).toLocaleString('en-US'))
    });
  
});