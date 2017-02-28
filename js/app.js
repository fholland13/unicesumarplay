$(document).ready(function(){

	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){

	//para o canal
	var channel = "Cesumaroficial";

	// limpa o chace do localStorage
	if(localStorage.getItem('maxresults') != 10){
		//alert(localStorage.getItem('maxresults'));
		localStorage.setItem('maxresults', 10);
		localStorage.setItem('channel', channel);
	}

	//mostra o texto de publicações
	textoTopo();
	//funcao para pegar a playlist
	getPlayList(channel);

	$(document).on('click', '#vidList li', function(){
		showVideo($(this).attr('videoid'));
		$('html, body').animate({
			scrollTop: $("#main").offset().top
		}, 500);
	});

	$('#saveOptions').click(function(){
		saveOptions();
		$('#textoTopo').html('');
		textoTopo();
	});
}

function getPlayList(channel, maxResults = 10){
	//limpar a lista de videos
	$('#vidList').html('');
	//faz a requisicao get na API do youtube
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", 
		{
			//tipo de requisicao
			part: 'contentDetails',
			//define o nome do canal a ser mostrado dinamicamente
			forUsername: channel,
			//insere a chave publica de acesso da API
			key: 'AIzaSyA6tAyLzd4uc4dTAKjXLx1ut0fY2gY_6r8'
		},
		// funcao para tratar o resultado
		function(data){
			//para cada item do resultado retornado
			$.each(data.items, function(i, item){
				//mostra no console.log
				console.log(item);
				//cria uma variavel playlistId para armazenar todos os videos
				playlistId = item.contentDetails.relatedPlaylists.uploads;
				//chama a funcao getVideos(), recebendo a variavel playlistId e 
				//a qtde de videos a ser exibidos
				getVideos(playlistId, maxResults);
			});
		}
	);
}
// cria o metodo getVideos, recebe como parâmetro todos os videos e a qtde de videos
function getVideos(playlistId, maxResults){
	// faz uma requisição get na playList
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playlistId,
			key: 'AIzaSyA6tAyLzd4uc4dTAKjXLx1ut0fY2gY_6r8'
		}, function(data){
			var output;
			$.each(data.items, function(i, item){
				console.log(item);
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				published = item.snippet.publishedAt;
				thumb = item.snippet.thumbnails.default.url;
				$('#vidList').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'<p>'+converterDataPublicada(published)+'</p></h3></li>');
				$('#vidList').listview().listview('refresh');
			});
		} 
		);
}

function textoTopo(){
	var maxResults = localStorage.getItem('maxresults');
	var channel = localStorage.getItem('channel');
	var output = 'Confira as últimas ' + maxResults + ' publicações do canal ' + channel;
	$('#textoTopo').html(output);
}

function showVideo(id){
	console.log('Showing Video ' + id);
	$('#logo').remove();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showVideo').html(output);
}

function setChannel(channel){
	localStorage.setItem('channel', channel);
	console.log('Channel Set: '+channel);
}

function setMaxResults(maxResults){
	localStorage.setItem('maxresults', maxResults);
	console.log('Max Results Changed: '+maxResults);
}

function saveOptions(){
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResults = $('#maxResultsOptions').val();
	setMaxResults(maxResults);
	$('body').pagecontainer('change', '#main', {options});
	getPlayList(channel, maxResults);
}

function converterDataPublicada(dataPublicada){

    data = new Date(dataPublicada);
    ano = data.getFullYear('yyyy');
    mes = data.getMonth('MMM')+1;
    dia = data.getDate();

    if(dia < 10){
        dia = '0' + dia;
    }
    switch(mes){
        case 1:
        mes = 'jan';
        break;
        case 2:
        mes = 'fev';
        break;
        case 3:
        mes = 'mar';
        break;
        case 4:
        mes = 'abr';
        break;
        case 5:
        mes = 'mai';
        break;
        case 6:
        mes = 'jun';
        break;
        case 7:
        mes = 'jul';
        break;
        case 8:
        mes = 'ago';
        break;
        case 9:
        mes = 'set';
        break;
        case 10:
        mes = 'out';
        break;
        case 11:
        mes = 'nov';
        break;
        case 12:
        mes = 'dez';
        break;
    	default:
        mes = ''
    }
    
	dataPulicadaCompleta = "Publicado em " + dia + ' de ' + mes + ' de ' + ano;
    
    return(dataPulicadaCompleta);

}