
agent = navigator.userAgent

browserVer = 2;

    if (agent.substring(0,7) == "Mozilla")

     {

     if (parseInt(agent.substring(8,9)) >= 3) {browserVer = 1;}

     }

	if ( (navigator.userAgent.indexOf("Opera")!=-1) && (navigator.userAgent.indexOf("7.")!=-1)) 						

		{ browserVer = 1; }

   if (browserVer == 1) {

	unl_menu_noa=new Image(1,1);
    unl_menu_noa.src="https://www.ncbi.nlm.nih.gov/coreweb/images/template1/top3_ulm_no_a.gif";
	
	
	unl_menu_home_a=new Image(1,1);
    unl_menu_home_a.src="https://www.ncbi.nlm.nih.gov/coreweb/images/template1/top3_ulm_home_a.gif";

	unl_menu_search_a=new Image(1,1);
    unl_menu_search_a.src="https://www.ncbi.nlm.nih.gov/coreweb/images/template1/top3_ulm_search_a.gif";

	unl_menu_sitemap_a=new Image(1,1);
    unl_menu_sitemap_a.src="https://www.ncbi.nlm.nih.gov/coreweb/images/template1/top3_ulm_sitemap_a.gif";
	
	

  }

  function changpics(ImgIn, ImgOut) {

   if (browserVer == 1) {

   ImgIn.src = ImgOut.src;

//  document.images[ImgIn].src = eval(ImgOut + ".src")

	 }
}

   function switchpics(Img_Name, ImgOpen , ImgClose ) {

   if (browserVer == 1) {
   
   var current_gif = Img_Name.src;

   if (current_gif.indexOf("open.gif") == -1 )
   {
// Replace with mgOpen 'OPEN' image    
   Img_Name.src = ImgOpen.src;
   } else {
// Replace with ImgClose 'CLOSE' image       
   Img_Name.src = ImgClose.src;
   }

	 }

  }

