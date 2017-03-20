$(() => {

	$(".photos.agrandir").click(e => {

		let index = $(e.currentTarget).index()+1

		let total = $(e.currentTarget).parent().children().length

		let html = $(`<div id="over"><div id="previous">Précédent</div>

					 	<img class="fullscale" src="${$(e.currentTarget).attr('src')}">

					 <div id="next">Suivant</div>

					 	<p>

					 		${$(e.currentTarget).data('sujet')} -
					 		${$(e.currentTarget).data('commentaire')}<br>
					 		<small>Image ${index} sur ${total}</small>
					 	</p>

					 </div>`)

		$("body").append(html)

		$("#over").click((e) => {

			$(e.currentTarget).remove()

		})

		$("#previous").click(function(e){

			$("#over").click()

			$(".photos.agrandir:nth-of-type("+((index-1)%total+1)+")").click()

		})

		$("#next").click(function(e){

			$("#over").click()

			$(".photos.agrandir:nth-of-type("+((index+1)%total+1)+")").click()

		})

	})

	$(".tooltip-trigger").hover(e => {

		$(".tooltip").remove()

		let html = $(`<div class="tooltip">
						<img src="/images/loader.gif">
						<b>Chargement...</b>
						<p>Veuillez patienter...</p>
					 `).css({
						left: $(e.currentTarget).offset().left - 150,
        				top: $(e.currentTarget).offset().top + 30
        			})

		$("body").append(html)

		$.getJSON(`/api/vip/${$(e.currentTarget).data('id')}`, data => {

			$(".tooltip img").attr("src", `/images/vip/${data.vip.photo.adresse}`)
			$(".tooltip b").text(`${data.vip.prenom} ${data.vip.nom}`)
			$(".tooltip p").text(data.vip.biographie)

		})

	}, e => {

		$(".tooltip").remove()

	})

	$("#vipPhotoDelete").on("change", function(e){
		$(".listePhotos").hide();
		$(".listePhotos#photos"+$(this).val()).show();
	})

})