function click_droit_icone_web()
{
  //var url = document.getElementById("NAV-ICONE-WEB-LINK").href;
  var title = document.getElementById("NAV-ICONE-WEB-LINK").title;
  var rightclick;
  var e = window.event;
  if (e.which) rightclick = (e.which == 3);
  else if (e.button) rightclick = (e.button == 2);
  //CHARGEMENT DE l'INFORMATION RELATIVE A LA PAGE

  document.getElementById("content_popup").innerHTML = title+"<br>"+"Type :";
  document.location.href="#popup1";

}
