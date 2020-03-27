function onLinkOver(message_id , message) {
    
		if ((message_id) && (message)) {
	
		if (document.all||document.getElementById) {
                if (document.getElementById) {
				
                        document.getElementById(message_id).innerHTML = message;
                }
                else {
//                        message_id.innerHTML = message;
						  return;
				      }
			   }
		}
}
function onLinkOut(message_id , message ) {
		if (message_id) {
        if (document.all||document.getElementById) {

			if (!message) { message='&nbsp;'; }
                if (document.getElementById) {
                        document.getElementById(message_id).innerHTML = message;
          		}
                else {
                        
//						message_id.innerHTML = message;
						return;
				      }
				   }
			}
}
