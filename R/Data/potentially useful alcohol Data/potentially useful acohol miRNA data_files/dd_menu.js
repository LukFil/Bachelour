jQuery(document).ready( function()
{
	$ = jQuery;


   /**
    *  For sub-menu
    */
	var timeout    = 500;
	var closetimer = 0;
	var ddmenuitem = 0;

	function ddm_open()
	{
		ddm_canceltimer();
   		ddm_close();
   		ddmenuitem = $(this).find( 'ul' ).css( 'visibility', 'visible' );
	}

	function ddm_close()
	{
		if ( ddmenuitem ) ddmenuitem.css( 'visibility', 'hidden' );
	}

	function ddm_timer()
	{
		closetimer = window.setTimeout( ddm_close, timeout );
	}

	function ddm_canceltimer()
	{
		if( closetimer )
		{
			window.clearTimeout( closetimer );
      		closetimer = null;
		}
	}

	$( '#geo_nav_bar > li' ).bind( 'mouseover', ddm_open );
	$( '#geo_nav_bar > li' ).bind( 'mouseout', ddm_timer );

	document.onclick = ddm_close;

});

