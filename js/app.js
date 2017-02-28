$(document).ready(function(){

	window.addEventListener("orientationchange", function(){
		screen.lockOrientation('portrait');
	});

	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){

	//para o canal
	var channel = "Cesumaroficial";
	//funcao para pegar a playlist
	getPlayList(channel);

	$(document).on('click', '#vidList li', function(){
		showVideo($(this).attr('videoid'));
	});

	$('#saveOptions').click(function(){
		saveOptions();
	});

	$('#clearChannel').click(function(){
		clearChannel();
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

				console.log("A quantidade e: "+playlistId.length);
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
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;
				$('#vidList').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
				$('#vidList').listview().listview('refresh');
			});
		} 
		);
}

function showVideo(id){
	console.log('Showing Video ' + id);
	$('#logo').hide();
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