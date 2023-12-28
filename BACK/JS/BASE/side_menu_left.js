// Requires jQuery

$(document).on('click','.js-menu_toggle.closed',function(e){
    //e.preventDefault(); $('.list_load, .list_item').stop();
    $('.js-menu_toggle.closed').removeClass('closed').addClass('opened');
    $('.side_menu').css({ 'left':'0px' });
});

$(document).on('click','.js-menu_toggle.opened',function(e){
    //e.preventDefault(); $('.list_load, .list_item').stop();
    $('.js-menu_toggle.opened').removeClass('opened').addClass('closed');
    $('.side_menu').css({ 'left':'-350px' });
});

function open_side_menu()
{
  $('.js-menu_toggle.closed').removeClass('closed').addClass('opened');
  $('.side_menu').css({ 'left':'0px' });
}

function close_side_menu()
{
  $('.js-menu_toggle.opened').removeClass('opened').addClass('closed');
  $('.side_menu').css({ 'left':'-350px' });
}
