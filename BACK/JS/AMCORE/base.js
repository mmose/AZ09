am4core.ready(function() {
am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_material);


//document.getElementById("content_popup").innerHTML = "TEST";
//document.location.href="#popup1";


var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

//Légende AMCHART qui affiche les balises en bas de BOBEN
chart.legend = new am4charts.Legend();
chart.legend.fontSize="15";


//POUR LES IMAGES
var icon = networkSeries.nodes.template.createChild(am4core.Image);
icon.propertyFields.href = "image";
icon.horizontalCenter = "middle";
icon.verticalCenter = "middle";
icon.width = 100;
icon.height = 100;




// DESACTIVER LE CLICK DROIT
document.addEventListener('contextmenu',event=> event.preventDefault());


networkSeries.maxLevels=2;
networkSeries.nodes.template.expandAll = false;

// -----------------------------------------------------------------------------
//ARBORESENCE
chart.dataSource.url = "chart_data.json";
chart.dataSource.parser = new am4core.JSONParser();

//CONFIGURATION
networkSeries.dataFields.value = "value";
networkSeries.dataFields.name = "name";
networkSeries.dataFields.children = "children";
networkSeries.dataFields.color="color";
networkSeries.dataFields.detail="detail";
networkSeries.dataFields.pointe="pointe";
networkSeries.dataFields.resultat="resultat";
networkSeries.dataFields.id = "name";


networkSeries.nodes.template.tooltipText = "{name}";
networkSeries.nodes.template.fillOpacity = 1;

// AFFICHE LE LABEL SUR LE CERCLE
networkSeries.nodes.template.label.text = "{name}";
networkSeries.nodes.template.label.fill = "black";
networkSeries.nodes.template.label.fontSize = "15";
networkSeries.fontSize = 10;
networkSeries.links.template.strokeWidth = 1;
//networkSeries.links.template.disabled = true;

//EVENEMENTS
var hoverState = networkSeries.links.template.states.create("hover");
hoverState.properties.strokeWidth = 3;
hoverState.properties.strokeOpacity = 1;


//EVENEMENT LORSQUON PASSE LA SOURIS SUR LA LEGENDE
chart.legend.events.on("out", function(event) {
event.target.opacity=0;
})

chart.legend.events.on("over", function(event) {
event.target.opacity=1;
})

//EVENEMENT DU CLICK
networkSeries.nodes.template.events.on("hit", function(event) {
selectedNode = event.target;
//selectedNode.isActive=false;
if (selectedNode == event.target) {

if (event.target.dataItem.name=="HUMAINS" || event.target.dataItem.name=="ANIMAUX"|| event.target.dataItem.name=="INSECTES")
{
  open_side_menu();
  $('#crea').next().slideDown(200);
}
else if (event.target.dataItem.name=="Etat" || event.target.dataItem.name=="Entreprise")
{
  open_side_menu();
  $('#enta').next().slideDown(200)
}

}
});


//EVENEMENT DU DOUBLE CLICK
  var selectedNode;
networkSeries.nodes.template.events.on("doublehit", function(event) {
  selectedNode = event.target;
  selectedNode.isActive=false;
  if (selectedNode == event.target) {
    if (event.target.dataItem.name!=="HOME" && event.target.dataItem.value==2000)
    {
           if(event.target.dataItem.name=="CREA") { document.location.href="crea.html"; }
      else if(event.target.dataItem.name=="MATA") { document.location.href="#popup2"; }
      else if(event.target.dataItem.name=="DATA") { document.location.href="#popup3"; }
      else if(event.target.dataItem.name=="ENTA") { document.location.href="enta.html"; }
    }
    else if (event.target.dataItem.value==1000)
    {
      selectedNode.openPopup(selectedNode.dataItem.detail,selectedNode.dataItem.name);
      if (event.target.dataItem.name=="HUMAINS")
      {
        document.getElementById("content_popup").innerHTML = "Recherche :";
        document.location.href="#popup1";
        //document.location.href="crea.html";
      }
    }
    else if (event.target.dataItem.value<1000)
    {
      selectedNode.openPopup(selectedNode.dataItem.detail,selectedNode.dataItem.name);
    }
    else if(event.target.dataItem.name=="HOME")
      {
      alert("bye bye");
      openNav();
      }
  }
});


// Add tag
var tag = networkSeries.nodes.template.createChild(am4core.Label);
tag.text = "{tag}";
tag.strokeWidth = 0;
//tag.fill = am4core.color("#fff");
tag.background.fill = am4core.color("#c44");
tag.padding(3, 6, 3, 6);
tag.verticalCenter = "bottom";
tag.adapter.add("textOutput", function(text, target) {
  if (text == "") {
    target.disabled = true;
  }
  return text;
})

//EVENEMENT DU CLIC DROIT
networkSeries.nodes.template.events.on("rightclick", function(event) {
  selectedNode = event.target;
  if (selectedNode == event.target) {
    //alert("Level de la node : "+selectedNode.dataItem.level+"\nRadius de la node : "+selectedNode.outerCircle.radius);
    alert("Résultat de la node : "+selectedNode.dataItem.resultat);
  }
});



//ENVEMENT QUAND ON APPUIE SUR ENTRER --> 13 . ECHAP--> 27 . SUPPR-->46
window.addEventListener("keydown", quand_on_appuie ,false);
function quand_on_appuie(e)
{
  var keynum = e.which;
  var texte_recherche = document.getElementById("input").value;
  if (keynum=="13" && texte_recherche.value!=="")
  {
    reset_all();
    CHERCHER(texte_recherche);
    open_side_menu();
    document.getElementById("input").value = "";
  }
else if (keynum=="46")
    {
      document.getElementById("input").value = "";
    }
else if (keynum=="27")
  {
    document.getElementById("input").value = "";
    document.getElementById("info_navigation").innerHTML = "";
    reset_all();
    start();

  }
}


function reset_all()
{
  //close_popups();
  //closeSuggestion();
  //closeNav();
  //close_add();
  reset_value_side_menu();
  close_side_menu();
  reset_node();

}
//FONCTION START
function start()
{
  networkSeries.nodes.each ((node) => {
    node.isActive=false;
    if(node.dataItem.name=="HOME")
    {
      node.isActive=true;
    }
  })
}


//FERME TOUT LES POPUPS GENERER PAR AMCHART
function close_popups()
{
  networkSeries.nodes.each ((node) => {
    node.closeAllPopups();
  })
}

function reset_node()
{
  //Je met à défaut les nodes (couleur+radius+focused)
  networkSeries.nodes.each ((node) => {
    node.label.text="";
    node.circle.fill=node.dataItem.color;
    node.outerCircle.fill = node.dataItem.color;
    if(node.dataItem.level==1) {node.outerCircle.radius=60.0916666667;}
  })
}

function reset_value_side_menu()
{
  document.getElementById("scroller_resultat_enta").innerHTML = "";
  document.getElementById("scroller_resultat_mata").innerHTML = "";
  document.getElementById("scroller_resultat_data").innerHTML = "";
  document.getElementById("scroller_resultat_crea").innerHTML = "";
  document.getElementById("scroller_resultat_all").innerHTML = "";
  $('#enta').next().slideUp(200);
  $('#crea').next().slideUp(200);
  $('#mata').next().slideUp(200);
  $('#data').next().slideUp(200);

}

//FONCTION QUI AFFICHE SUR LA BALISE MERE CE QUE L'ON A TAPE
function balise_home_affichage(texte_affiche)
{
    networkSeries.nodes.each ((node) => {
      if (node.dataItem.name=="HOME")
       {
          node.label.text=texte_affiche;
       }
    })
}

function CHERCHER(texte)
{
  balise_home_affichage(texte);
  recherche_wikipedia_wikidata(texte);
  //chercher_balise_pointe(texte);
  //Chercher_MOT(texte);
  //FindWikiData(texte);
  //dicolink(texte);
  //wikiapi(texte);
  //search_WEB_Favicon(texte);
  //search_WEB_NAV(texte);
}


function recherche_wikipedia_wikidata(saisie)
{
/*  var  https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops&list=&meta=&indexpageids=1&titles=&generator=search&ppcontinue=&ppprop=wikibase_item&gsrsearch='+saisie+'&gsrnamespace=0&gsrlimit=50&gsrqiprofile=classic&gsrprop=size%7Cwordcount%7Ctimestamp%7Csnippet&gsrsort=relevance*/

/*   AVEC disambiguation                      https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops%7Cpageimages&indexpageids=1&generator=search&ppprop=wikibase_item%7Cdisambiguation&piprop=thumbnail%7Cname%7Coriginal&pithumbsize=200&pilicense=free&gsrsearch=intitle%3A%22Ronaldinho%22&gsrlimit=50&gsrqiprofile=classic&gsrinfo=suggestion%7Crewrittenquery&gsrprop=size%7Cwordcount%7Csnippet  */
  var wikipediahomonyme = 'https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops%7Cpageimages&indexpageids=1&generator=search&ppprop=wikibase_item&piprop=thumbnail%7Cname&pithumbsize=400&gsrsearch=intitle:'+saisie+'&gsrlimit=50&gsrqiprofile=classic&gsrinfo=suggestion%7Crewrittenquery&gsrprop=size%7Cwordcount%7Csnippet';
  $.getJSON(wikipediahomonyme, function(data) {
    //var page_id = data.query.pageids;
    var pages = data.query.pages;

    $.each(pages, function() {
      console.log(this.title+" ID: "+this.pageprops.wikibase_item);
      var titre = this.title;

      if (titre.includes(saisie))
      {

      var image ;
      if (!this.thumbnail || this.thumbnail === undefined)
      {
        console.log ("Il n'y a pas de thumnail");
        image = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Ronaldinho_Ga%C3%BAcho_em_junho_de_2019.jpg/171px-Ronaldinho_Ga%C3%BAcho_em_junho_de_2019.jpg";

      }
      else
      {
        image = this.thumbnail.source;
      }

      $('#scroller_resultat_all').append(
          '<p><a onclick=click_side_menu("'+this.pageprops.wikibase_item+'","'+image+'")>'+ this.title + '</a></p>'+
          '<script>  function click_side_menu(IData,image)'+
          '{ $.ajax({dataType: "jsonp",url: "https://www.wikidata.org/w/api.php?action=wbgetentities&ids="+IData+"&languages=fr&format=json",'+
          ' type: "GET",success: function(wikidata) {   if (wikidata.success == 1 ) '+
          '  { if (wikidata.entities[IData].claims.P31 === undefined) { console.log("P31 Non définis");} '+
          ' else var titre = wikidata.entities[IData].labels.fr.value;' +
          ' var description = wikidata.entities[IData].descriptions.fr.value;'+
          ' document.getElementById("wikiprofil_titre").innerHTML = titre;  '+
          ' document.getElementById("wikiprofil_description").innerHTML = description; '+
          ' document.getElementById("wikiprofilavatar").src = image;'+
          ' document.location.href="#popup1";'+
          ' }'+
          'else console.log("Aucun résultat WIKIDATA");   },'+
          'error: function() { alert("Wiki Data Error"); } });                                     }'+
          '</script>'


      );

      wikidata_P31(this.title,this.pageprops.wikibase_item);

    } // FIN CONDITION IF TITRE.INCLUDES(SAISIE)
        });
  });
}



// RECHERCHE DANS WIKIDATA
function wikidata_P31(titre,IData)
{
  $.ajax({
    dataType: "jsonp",
    url: "https://www.wikidata.org/w/api.php?action=wbgetentities&ids="+IData+"&languages=fr&format=json",
    type: "GET",
    success: function(wikidata) {

      if (wikidata.success == 1 )
{
     if (wikidata.entities[IData].claims.P31 === undefined)
     {
       //alert("P31 indéfinis ");
     }
     else
      var P31 = wikidata.entities[IData].claims.P31[0].mainsnak.datavalue.value.id;
      trie_side_menu(titre,P31);
      chercher_balise_pointe(P31);
}

else alert("Aucun résultat");

    },
    error: function() {
      alert('Wiki Data Error');
    }
  });
}

function trie_side_menu(titre,P31)
{
  if (P31 == "Q5")
  {
    $('#scroller_resultat_crea').append(
        '<p><b>'+ titre+ '</b></p>'
    );
  }
  else if (P31 == "Q6256" || P31 == "Q3624078" || P31 == "Q6881511")
  {
    $('#scroller_resultat_enta').append(
        '<p><b>'+ titre+ '</b></p>'
    );
  }
  open_side_menu();
}

// REHCERCHE BALISE
function findBalise(texte,P31)
{
  chercher_balise(texte,P31);
  //window.open('https://www.wikidata.org/wiki/'+P31, "MsgWindow", "width=800,height=500");
  //document.hasFocus();
}

var nombre_resultat = 0;
function chercher_balise_pointe(P31)
{
  networkSeries.nodes.each ((node) => {
    if (node.dataItem.pointe)
     {
         if(node.dataItem.pointe.includes(P31))
         {

           nombre_resultat=nombre_resultat+1;
           node.dataItem.resultat = nombre_resultat;
           node.dataItem.tag = nombre_resultat;
           //node.createChild{};
           //document.getElementById("info_navigation").innerHTML = nombre_resultat+" résultat(s) pour "+"<i>"+texte+"</i>";
           //chart.legend.labels.template.text = "[bold {color}]{name}[/] :"+nombre_resultat;
           chart.legend.opacity=1;
           chart.legend.labels.template.text = "[bold {color}]{resultat}[/]";
           node.outerCircle.fill = am4core.color("black");
           node.circle.fill=am4core.color("black");

         }
     }
     console.log("PAS pointé !");
  })
}


// POUR CHERCHER EN BALISE
function chercher_balise(texte,P31)
{

  var nom_balise;
  var nombre_resultat=0;
  var recherche_resultat;
  reset_node();
  balise_home_affichage(texte);

  let recherche_item = networkSeries.getDataItemById(networkSeries.dataItems, P31);
  if (recherche_item)
  {
      console.log("trouvé");
      document.getElementById("info_navigation").innerHTML = "<i>"+texte+"</i>"+": "+recherche_item.detail;
      recherche_resultat=true;

      if (recherche_item.level==1){
      recherche_item.node.circle.fill = am4core.color("white");
      //recherche_item.node.openPopup(recherche_item.detail,recherche_item.name);

    } else if (recherche_item.level>1){
      recherche_item.parent.node.isActive=true;
      recherche_item.node.circle.fill = am4core.color("white");
      //recherche_item.node.openPopup(recherche_item.detail,recherche_item.name);
    }
  }

  //Si il ne trouve pas par ID du name on cherche par ID du tagg
  else if (!recherche_item)
{
  networkSeries.nodes.each ((node) => {
    if (node.dataItem.pointe)
     {
         if(node.dataItem.pointe.includes(texte))
         {
           recherche_resultat=true;
           nombre_resultat=nombre_resultat+1;
           node.dataItem.resultat=nombre_resultat;
           node.dataItem.tag = nombre_resultat;
          document.getElementById("info_navigation").innerHTML = nombre_resultat+" résultat(s) pour "+"<i>"+texte+"</i>";
           //chart.legend.labels.template.text = "[bold {color}]{name}[/] :"+nombre_resultat;
           chart.legend.opacity=1;
           chart.legend.labels.template.text = "[bold {color}]{resultat}[/]";
           node.outerCircle.fill = am4core.color("black");
           node.circle.fill=am4core.color("black");
           node.openPopup(node.dataItem.detail,texte);
           if(node.dataItem.level==1)
           {
             node.outerCircle.radius=70;
           }

          if (node.dataItem.level==2)
           {
             //var nomparent = node.parent.dataItem.name;
             //alert("Node parent : "+nomparent);
             //node.isActive=true;
           }

         }
     }
     console.log("PAS pointé !");
  })
}
if(recherche_resultat!=true)
{ document.getElementById("info_navigation").innerHTML = "Aucun résultat";}

}


//CHERCHE EN DICTIONNAIRE
function dicolink(mot_recherche)
{
  var resultat_synonymes= 0;
  var resultat_data=0;

  var recherche_definition = 'https://api.dicolink.com/v1/mot/'+mot_recherche+'/definitions?limite=200&api_key=svPajh708cfBQhFMqPhPs5p0oBxpjqPL';
  $.getJSON(recherche_definition, function(data) {

        $.each(data, function() {
        resultat_data=resultat_data+1;
        $('#scroller_resultat_data').append(
            '<p>'+ this.definition +'</p>'
        );
      });

      open_side_menu();
     $('#span_resultat_data').append(resultat_data);

  });

  var recherche_synonymes = 'https://api.dicolink.com/v1/mot/'+mot_recherche+'/synonymes?limite=200&api_key=svPajh708cfBQhFMqPhPs5p0oBxpjqPL';
  $.getJSON(recherche_synonymes, function(data2) {
              $.each(data2, function() {
              resultat_synonymes=resultat_synonymes+1;
              $('#scroller_resultat_synonymes').append(
                  '<p> <a class="upgrade" href="#">'
                  + this.mot
                  + '</a></p>'
              );
          });
            open_side_menu();
            $('#span_resultat_synonymes').append(
            resultat_synonymes
            );
  });

}

//CHERCHER LE WIKI
function wikiapi(mot_recherche)
{
/*
  var recherche_wiki = 'https://fr.wikipedia.org/api/rest_v1/page/summary/'+mot_recherche;
  $.getJSON(recherche_wiki, function(data) {
    var recherchewiki = data.extract_html;
    var imagewiki = data.originalimage.source;

    if (recherchewiki)
    {
    document.getElementById("content_popup").innerHTML = recherchewiki;
    document.location.href="#popup1";
    }
    else
    alert("Aucun résultat");

  });
  */

}

//CHERCHR LE FAVICON WEB
function search_WEB_Favicon(mot_recherche)
{
  // API --> I OLSH ME pour avoir les favicons
  var recherche_favicon = 'https://i.olsh.me/allicons.json?url='+mot_recherche+".com";
  $.getJSON(recherche_favicon, function(data) {
    var icon = data.icons[0].url;
    var url = data.url;
    var icon_default = document.getElementById("NAV-ICONE-WEB").src
    //var urlwiki= data.api_urls.edit_html;
    if (url)
    {
    document.getElementById("NAV-ICONE-WEB").src = icon;
    document.getElementById("NAV-ICONE-WEB-LINK").title = mot_recherche;
    document.getElementById("NAV-ICONE-WEB-LINK").href = "https://www."+url;
    }
    else
    alert("Aucun résultat");
  });
}


//CHERCHER LES PAGES WEB
function search_WEB_NAV (mot_recherche)
{
  var recherche_definition = 'https://api.serphouse.com/serp/live?q='+mot_recherche+'&domain=google.fr&lang=fr&loc=Paris,Paris,Ile-de-France,France&api_token=JnnyngkKDqxTtbd6bGWsp4mgWUy4LOS9zv49HQYY2c5dFFYWdxyDX40si6f8';
  $.getJSON(recherche_definition, function(data) {
    if (data) {
    alert("Résultat PagesWeb en cour ...");
    var page_web = data.results.results.organic;
        $.each(page_web, function() {

          $('#section-production').append(
            '<ul id="ul-page-web">'+
              '<li>'+
                '<input class="input-accordion-scrumboard" type="checkbox" />'+
                '<label>'+this.displayed_link+'</label>'+
                  '<ol>'+
                  '<li>'+this.title+'</li>'+
                '</ol>'+
              //  '<a style="font-size:10px; color:white;" target="_blank"  href='+this.link+'> Lien </a>'+
              '</li>'+
            '</ul>'
          );

      });
} else alert("Aucun résultat PagesWeb");
  });

}




}); // end am4core.ready()
