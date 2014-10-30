jQuery( document ).ready(function( $ ) {

	var pid = uuid.v4();
	var cookie_pid = $.cookie('prelaunchr[id]');
	var email;
	var rid;

	/**
	 * If no cookie_pid set a new cookie with pid
	 */
	if ( cookie_pid == undefined ) {

		$.cookie( 'prelaunchr[id]' , pid , { expires: 730, path: '/' });

	}

	/**
	 * Hide the response/validation div
	 */
	$('.prelaunchr .response').hide();

	/**
	 * Handle form submission
	 */
	$('.pform').submit(function(e){

		e.preventDefault();

		email = $.trim( $(this).find("input[type='email']").val() );

		rid = getUrlParameter('ref');

		if ( email ) {

			$.ajax({

				type: 'POST',
				url: PrelaunchrSubmit.ajaxurl,
				data: {
					'action'		: 'prelaunchr-submit', 
					'pid'			: pid,
					'cookie_pid'	: cookie_pid,
					'email'			: email,
					'rid'			: rid
				},
				dataType: 'JSON',
				success: function( response, textStatus, XMLHttpRequest ) {

					//console.log( response );

					/**
					 * If email passes server validation and is stored
					 */
					if ( response.success ) {
						$('body').trigger('prelaunchr_response_success');
						window.location.href = '/'+PrelaunchrSubmit.return+'/'+response.data.pid;
						return;
					} else {
						$('body').trigger('prelaunchr_response_fail');
						$('.prelaunchr .response').html(response.data).fadeIn();
						return;
					}

				},
				error: function( XMLHttpRequest, textStatus, errorThrown) {
					console.log( errorThrown );
				},
				complete: function( XMLHttpRequest, textStatus) {
					//something
				}

			});

		}

	});

});

/**
 * Get a specific url paramater
 *
 * http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
 */
function getUrlParameter(sParam) {

	var sPageURL = window.location.search.substring(1);

	var sURLVariables = sPageURL.split('&');

	for (var i = 0; i < sURLVariables.length; i++) {

		var sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] == sParam) {

			return sParameterName[1];

		}

	}

}