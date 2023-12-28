// QUAND ON ECRIT SUR LA BARRE DE RECHERCHE


/** JE DESACTIVE CAR SA RALENTIS

function ecriture() {
      $("#input").autocomplete({
        source: function(request, response) {
          if (request.term.length > 0 )
    {
          $.ajax({
            url: "https://fr.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
              'action': "opensearch",
              'format': "json",
              'search': request.term
            },
            success: function(data) {
              response(data[1]);
            }
          });

    }
    }
    });

};

*/


// EVENEMENT ON SUBMIT
function recherche()
{
  event.preventDefault();
  var searchTerm = $('#input').val();

  $('form').toggleClass('open');
  $('#wiki').fadeToggle('fast', 'swing');
  $('.typed-cursor').toggleClass('display-none');
  $('#data').toggleClass('display-none');

  //FindIData(searchTerm);
}

/*

// RECHERCHE DE L'ID WIKIDATA
function FindIData(searchTerm)
{
  $.ajax({
    dataType: "jsonp",
    url: "https://fr.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=" + searchTerm + "&formatversion=2&format=json",
    type: "GET",
    success: function(wikiData) {

      // Clear old results
      $('#data').empty();

      // If no results, error msg
      if (wikiData.query.pages[0].missing == true) {
        $('#data').append('<div id="search-item"><h1>Sorry, no results.</h1></div>');
      }
      else if (wikiData.query.pages[0].pageprops === undefined) {
        alert("Indéfinis car la Redirection est impossible depuis l'API Wiki");
      }
      else {
        var IData = wikiData.query.pages[0].pageprops.wikibase_item;
        wikidataJSON(IData);
      }


    },
    error: function() {
      console.log('Wiki Data Error');
    }
  });
}


// RECHERCHE DANS WIKIDATA
function wikidataJSON(IData)
{
  //alert("Recherche dans WikiData de "+IData);
  $.ajax({
    dataType: "jsonp",
    url: "https://www.wikidata.org/w/api.php?action=wbgetentities&ids="+IData+"&languages=fr&format=json",
    type: "GET",
    success: function(wikidata) {

      if (wikidata.success == 1 )
{
     if (wikidata.entities[IData].claims.P31 === undefined)
     {
       alert("P31 indéfinis ");
     }
     else
      var P31 = wikidata.entities[IData].claims.P31[0].mainsnak.datavalue.value.id;
      findBalise(P31);
}

else alert("Aucun résultat");

    },
    error: function() {
      alert('Wiki Data Error');
    }
  });
}


// REHCERCHE BALISE
function findBalise(P31)
{
  window.open('https://www.wikidata.org/wiki/'+P31, "MsgWindow", "width=800,height=500");
  document.hasFocus();
}

*/
