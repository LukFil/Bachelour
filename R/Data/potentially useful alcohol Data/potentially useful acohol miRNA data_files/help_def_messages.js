<!-- Browser Check -->

var RPopUpWindow_title4layer=""
var RPopUpWindow_inheight        //menu Height , will be calculated dep. on how may links
var RPopUpWindow_inwidth        //menu width
var RPopUpWindow_offsetx = 2
var RPopUpWindow_offsety = 2
var RPopUpWindow_HideSec = 1;

var RPopUpWindow_menu_possible=false;
RPopUpWindow_ns4=(document.layers)?true:false
RPopUpWindow_ns6=(navigator.userAgent.indexOf("Gecko")!=-1)?true:false
RPopUpWindow_mac45=(navigator.appVersion.indexOf("MSIE 4.5")!=-1)?true:false
if(RPopUpWindow_ns6||RPopUpWindow_ns4)mac=false
RPopUpWindow_opera=(navigator.userAgent.indexOf("Opera")!=-1)?true:false
RPopUpWindow_icab=(navigator.userAgent.indexOf("iCab")!=-1)?true:false
RPopUpWindow_ie55=((navigator.appVersion.indexOf("MSIE 9")!=-1||navigator.appVersion.indexOf("MSIE 8")!=-1||navigator.appVersion.indexOf("MSIE 7")!=-1||navigator.appVersion.indexOf("MSIE 6.0")!=-1||navigator.appVersion.indexOf("MSIE 5.5")!=-1))?true:false;
RPopUpWindow_ie5mac=((navigator.appVersion.indexOf("MSIE 5")!=-1&&navigator.appVersion.indexOf("Mac")!=-1))?true:false;

if ((RPopUpWindow_ie5mac&&RPopUpWindow_icab) || (RPopUpWindow_ie5mac&&RPopUpWindow_opera)) {RPopUpWindow_ie5mac=false;}
RPopUpWindow_iens6 = RPopUpWindow_ns6 || RPopUpWindow_ie55 || RPopUpWindow_ie5mac ;
if ( RPopUpWindow_iens6 || RPopUpWindow_ns4 || RPopUpWindow_ie55 || RPopUpWindow_ie5mac ) { RPopUpWindow_menu_possible=true;}


<!--DEFAULT VARIABLES-->

RPopUpWindow_boxposLR_def='right';
RPopUpWindow_boxposTB_def='bottom';
RPopUpWindow_inboxcolor_def='#E1E6EB';
RPopUpWindow_tfontcolor_def='white';
RPopUpWiMoundow_bordercolor_def='#32787A';


<!--GLOBAL VARIABLES-->
var PopUpMenuHelpLink = "";
var RPopUpWindow_doNOThide = false
var RPopUpWindow_linkArray_sum;
var RPopUpWindow_thename;
var RPopUpWindow_theobj;
var RPopUpWindow_thetext;
var RPopUpWindow_winHeight;
var RPopUpWindow_winWidth;
var RPopUpWindow_tableColor;
var RPopUpWindow_timerID;
var RPopUpWindow_seconds=0;
var RPopUpWindow_x=0;
var RPopUpWindow_y=0;
var RPopUpWindow_first_time=false;


if(RPopUpWindow_ns4) {
	document.captureEvents(Event.MOUSEMOVE)
}
document.onmousemove=RgetMouseXY

function RgetMouseXY(e)
{

	if(RPopUpWindow_ns4||RPopUpWindow_ns6)
			{
	RPopUpWindow_x=e.pageX;
	RPopUpWindow_y=e.pageY;
			}else{
	RPopUpWindow_x=event.clientX;
	RPopUpWindow_y=event.clientY
			}
	if(RPopUpWindow_ie55){
	RPopUpWindow_x=RPopUpWindow_x+document.body.scrollLeft;
	RPopUpWindow_y=RPopUpWindow_y+document.body.scrollTop;
		}

	return true
}

/*
function Print_Html_Links(RPopUpWindow_links)
{

RPopUpWindow_linkArraytmp = new Array
RPopUpWindow_linkArray_sum =" ";
RPopUpWindow_linkArraytmp = RPopUpWindow_links;
for(var i = 0; i < RPopUpWindow_linkArraytmp.length; i++) {

	if (RPopUpWindow_linkArraytmp[i]) {

RPopUpWindow_linkArray_sum+=" "+RPopUpWindow_linkArraytmp[i]+" ";
		}
	}
// menu Height calc.
return RPopUpWindow_linkArray_sum
}
*/

function RPopUpWindow_BuildLinks(RPopUpWindow_links,RPopUpWindow_inheight,RPopUpWindow_text_style)
{


// menu Height and Width calc.
var RPopUpWindow_message_inheight = RPopUpWindow_inheight - 19;

RPopUpWindow_linkArray_sum = "<tr><td width=1><img src='/coreweb/template1/pix/pixel.gif' width='1' height='"+RPopUpWindow_message_inheight+"' alt=''  border='0'></td><td align=left valign=top><font size=2 face='arial, geneva, helvetica' class='"+RPopUpWindow_text_style+"'>"+RPopUpWindow_links+"</font></td></tr>";

}

function RbuildText(RPopUpWindow_tcolor,RPopUpWindow_bcolor,RPopUpWindow_inboxcolor) {
// !!! SINGLE QUOTES INSIDE DOUBLE QUOTES.

RPopUpWindow_text="<table width='100%' border='0' cellspacing='0' cellpadding='1' >"
RPopUpWindow_text+="<tr><td nowrap bgcolor='"+RPopUpWindow_bcolor+"' ><center><font face='arial, geneva, helvetica' size='1' color='"+RPopUpWindow_tcolor+"' class='menutitle'> "+RPopUpWindow_title4layer+" &nbsp;</font></center></td>"
RPopUpWindow_text+="</tr></table>"
RPopUpWindow_text+="<table width='100%' border='0' cellspacing='0' cellpadding='1' bgcolor='"+RPopUpWindow_bcolor+"'>"
RPopUpWindow_text+="<tr><td>"
RPopUpWindow_text+="<table border='0' cellspacing='0' cellpadding='0' width='100%'>"
RPopUpWindow_text+="<tr><td bgcolor='"+RPopUpWindow_bcolor+"' align='center' valign='top'>"
RPopUpWindow_text+="<table width='100%' border='0' cellspacing='0' cellpadding='1' bgcolor='"+RPopUpWindow_inboxcolor+"'>"
RPopUpWindow_text+=RPopUpWindow_linkArray_sum
RPopUpWindow_text+="</table></td></tr></table></td></tr></table>"

return RPopUpWindow_text
}

function RPopUpWindow_Set(RPopUpWindow_links_ids_line,RPopUpWindow_inwidth,RPopUpWindow_inheight,RPopUpWindow_boxposLR,RPopUpWindow_boxposTB,RPopUpWindow_inboxcolor,RPopUpWindow_tfontcolor,RPopUpWindow_bordercolor,RPopUpWindow_text_style) {

	if (!RPopUpWindow_menu_possible) {  return; }
	if (!RPopUpWindow_boxposLR) { RPopUpWindow_boxposLR=RPopUpWindow_boxposLR_def }
	if (!RPopUpWindow_boxposTB) { RPopUpWindow_boxposTB=RPopUpWindow_boxposTB_def }
	if (!RPopUpWindow_inboxcolor) { RPopUpWindow_inboxcolor=RPopUpWindow_inboxcolor_def }
	if (!RPopUpWindow_tfontcolor) { RPopUpWindow_tfontcolor=RPopUpWindow_tfontcolor_def }
	if (!RPopUpWindow_bordercolor) { RPopUpWindow_bordercolor=RPopUpWindow_bordercolor_def }

	RPopUpWindow_first_time=true;
	RPopUpWindow_BuildLinks(RPopUpWindow_links_ids_line,RPopUpWindow_inheight,RPopUpWindow_text_style)
	clearTimeout(RPopUpWindow_timerID)
	RPopUpWindow_winWidth=RPopUpWindow_inwidth
	RPopUpWindow_winHeight=RPopUpWindow_inheight
	RPopUpWindow_thetext=RbuildText(RPopUpWindow_tfontcolor,RPopUpWindow_bordercolor,RPopUpWindow_inboxcolor)

	if (RPopUpWindow_iens6){ RPopUpWindow_browserWidth=document.body.clientWidth; RPopUpWindow_browserHeight=document.body.clientHeight;
				RPopUpWindow_ScrOffX=document.body.scrollLeft; RPopUpWindow_ScrOffY=document.body.scrollTop;
				}
	if (RPopUpWindow_ns4 || RPopUpWindow_ns6){ RPopUpWindow_browserWidth=window.innerWidth; RPopUpWindow_browserHeight=window.innerHeight;
				RPopUpWindow_ScrOffX=window.pageXOffset; RPopUpWindow_ScrOffY=window.pageYOffset; }

	RPopUpWindow_boxPrePositionLR=RPopUpWindow_boxposLR;
	RPopUpWindow_boxPrePositionTB=RPopUpWindow_boxposTB;

        RPopUpWindow_x = RPopUpWindow_browserWidth+RPopUpWindow_ScrOffX-RPopUpWindow_inwidth - 25

	if ( RPopUpWindow_browserHeight+RPopUpWindow_ScrOffY < RPopUpWindow_y+RPopUpWindow_inheight ) { RPopUpWindow_boxPrePositionTB="top" }
	if ( RPopUpWindow_y-RPopUpWindow_inheight < 0 ) { RPopUpWindow_boxPrePositionTB = "bottom" }
	if ( RPopUpWindow_browserWidth+RPopUpWindow_ScrOffX < RPopUpWindow_x+RPopUpWindow_inwidth ) { RPopUpWindow_boxPrePositionLR="left" }
	if ( RPopUpWindow_x-RPopUpWindow_inwidth < 0 ) { RPopUpWindow_boxPrePositionLR = "right" }
	RPopUpWindow_boxPosition=RPopUpWindow_boxPrePositionTB+RPopUpWindow_boxPrePositionLR;


	if (RPopUpWindow_boxPosition == "bottomright") {
		RPopUpWindow_x=RPopUpWindow_x+RPopUpWindow_offsetx
		RPopUpWindow_y=RPopUpWindow_y+RPopUpWindow_offsety
	}
	if (RPopUpWindow_boxPosition == "bottomleft") {
		RPopUpWindow_x=RPopUpWindow_x-(RPopUpWindow_offsetx+2)-RPopUpWindow_winWidth
		RPopUpWindow_y=RPopUpWindow_y-RPopUpWindow_offsety
	}
	if (RPopUpWindow_boxPosition == "topright") {
		RPopUpWindow_x=RPopUpWindow_x+RPopUpWindow_offsetx
		RPopUpWindow_y=RPopUpWindow_y+RPopUpWindow_offsety-RPopUpWindow_winHeight
	}
	if (RPopUpWindow_boxPosition == "topleft") {
		RPopUpWindow_x=RPopUpWindow_x-(RPopUpWindow_offsetx+2)-RPopUpWindow_winWidth
		RPopUpWindow_y=RPopUpWindow_y+RPopUpWindow_offsety-RPopUpWindow_winHeight
	}

	if(RPopUpWindow_iens6){

		RPopUpWindow_thename = "viewer"
		RPopUpWindow_theobj=document.getElementById? document.getElementById(RPopUpWindow_thename):document.all.RPopUpWindow_thename
		RPopUpWindow_theobj.style.width=RPopUpWindow_winWidth+"px"
		RPopUpWindow_theobj.style.height=RPopUpWindow_winHeight+"px"
		RPopUpWindow_theobj.style.left=RPopUpWindow_x+"px"
		RPopUpWindow_theobj.style.top=RPopUpWindow_y+"px"
			if(RPopUpWindow_iens6&&document.all) {
				RPopUpWindow_theobj.innerHTML = ""
				RPopUpWindow_theobj.insertAdjacentHTML("BeforeEnd","<table cellspacing=0 width="+RPopUpWindow_winWidth+" height="+RPopUpWindow_winHeight+" border=0><tr><td width=100% valign=top><font type='arial' size='2' style='color:black;font-weight:normal'>"+RPopUpWindow_thetext+"</font></td></tr></table>")

			}
			if(RPopUpWindow_iens6&&!document.all) {
				RPopUpWindow_theobj.innerHTML = ""
				RPopUpWindow_theobj.innerHTML="<table cellspacing=0 width="+RPopUpWindow_winWidth+" height="+RPopUpWindow_winHeight+" border=0><tr><td width='100%' valign=top><font type='arial' size='2' style='color:black;font-weight:normal'>"+RPopUpWindow_thetext+"</font></td></tr></table>"
			}
	}
	if(RPopUpWindow_ns4){
		RPopUpWindow_thename = "nsviewer"
		RPopUpWindow_theobj = eval("document."+RPopUpWindow_thename)
		RPopUpWindow_theobj.left=RPopUpWindow_x
		RPopUpWindow_theobj.top=RPopUpWindow_y
		RPopUpWindow_theobj.width=RPopUpWindow_winWidth
		RPopUpWindow_theobj.clip.width=RPopUpWindow_winWidth
		RPopUpWindow_theobj.height=RPopUpWindow_winHeight
		RPopUpWindow_theobj.clip.height=RPopUpWindow_winHeight
		RPopUpWindow_theobj.document.write("<table cellspacing=0 width="+RPopUpWindow_winWidth+" height="+RPopUpWindow_winHeight+" border=0><tr><td width=100% valign=top>"+RPopUpWindow_thetext+"</td></tr></table>")
		RPopUpWindow_theobj.document.close()
		RPopUpWindow_theobj.captureEvents(Event.MOUSEOVER);
	    RPopUpWindow_theobj.onmouseover=RPopUpWindow_KeepShowNS4Obj;
	}
	RPopUpWindow_viewIt()
}

function RPopUpWindow_KeepShowNS4Obj(){
    clearTimeout(RPopUpWindow_timerID)
  }

function RPopUpWindow_viewIt() {
		if(RPopUpWindow_iens6) {
			RPopUpWindow_theobj.style.visibility="visible"
			}
		if(RPopUpWindow_ns4) {
			RPopUpWindow_theobj.visibility = "visible"
		}
}

function RPopUpWindow_doNOThideFunc() {
RPopUpWindow_doNOThide = true;
}

function RPopUpWindow_Stop() {
if (RPopUpWindow_first_time){
	if(RPopUpWindow_iens6 && !RPopUpWindow_doNOThide) {
		RPopUpWindow_theobj.innerHTML = ""
		RPopUpWindow_theobj.style.visibility="hidden"
		RPopUpWindow_theobj.style.width=1;
		RPopUpWindow_theobj.style.height=1;
		RPopUpWindow_theobj.style.left=1;
		RPopUpWindow_theobj.style.top=1;
		}
	if(RPopUpWindow_ns4) {
		RPopUpWindow_theobj.document.write("")
		RPopUpWindow_theobj.document.close()
		RPopUpWindow_theobj.visibility="hidden"
		RPopUpWindow_theobj.left=1;
		RPopUpWindow_theobj.top=1;
		RPopUpWindow_theobj.width=1;
		RPopUpWindow_theobj.clip.width=1;
		RPopUpWindow_theobj.height=1;
		RPopUpWindow_theobj.clip.height=1;


		}
	RPopUpWindow_doNOThide=false;
	}
}



function RPopUpWindow_Hide_Layer() {
	RPopUpWindow_Hide_It(RPopUpWindow_HideSec)
	}

function RPopUpWindow_Hide(sec) {
	if (!sec) { sec=RPopUpWindow_HideSec; }
	RPopUpWindow_HideSec = sec;
	RPopUpWindow_Hide_It(RPopUpWindow_HideSec)
	}

function RPopUpWindow_Hide_It(sec) {
	RPopUpWindow_seconds=parseInt(sec)
	if(RPopUpWindow_seconds>0) {
		RPopUpWindow_seconds--;
		RPopUpWindow_timerID=setTimeout("RPopUpWindow_Hide_It(RPopUpWindow_seconds)",1000)
	}else{
		RPopUpWindow_Stop()
	}
}

function RPopUpWindow_showpopuphelp() {

eval (PopUpMenuHelpLink);

}

function RPopUp2WindowOpen(url,name,attributes) {
	var RPopUpWindowHandle;
    RPopUpWindowHandle = window.open(url,name,attributes);
}


if (RPopUpWindow_iens6){
document.write("<div id='viewer' style='background-color:#cccccc;marginleft:0;visibility:hidden;position:absolute;width:0;height:0;z-index:1;overflow:hidden' onmouseover='clearTimeout(RPopUpWindow_timerID)' onClick='RPopUpWindow_doNOThideFunc()' onmouseout='RPopUpWindow_Hide_Layer()'></div>")
}
if (RPopUpWindow_ns4){
	document.write("<layer z-index=27 visibility=hidden id=nsviewer bgcolor=#cccccc width=0 height=0 onmouseout='RPopUpWindow_Hide_Layer()'></layer>");
	hideobj = eval("document.nsviewer")
	hideobj.visibility="hidden"
}




// the following are seen on many pages
var geo_default_help = "GEO help: Mouse over screen elements for information";
var geo_empty_help = "&nbsp;";
var geopager_columnheader = "Click the column name to <strong>sort</strong> on that column. Click again to change the sort direction"
var geopager_first = "Go to the <strong>first</strong> page"
var geopager_prev = "Go to <strong>previous</strong> page"
var geopager_next = "Go to the <strong>next</strong> page"
var geopager_last = "Go to the <strong>last</strong> page"
var geopager_pageno = "Go to the selected page <strong>number</strong>"
var geopager_pgsize = "Enter the page <strong>size</strong> in rows here"
var geopager_go = "<strong>Go</strong> to the indicated page"
var geologinbar_login = "Click here to <strong>login</strong>. You need to do this only if you want to edit the contact information, submit data, see your unreleased data, or work with data already submitted by you. You do not need to login if you are here just to browse through public holdings"
var geologinbar_mysubmissions = "Click here to view <strong>your submissions</strong>, both public and unreleased"
var geologinbar_myinfo = "View your <strong>account information</strong>. You can also edit account information from here"
var geologinbar_logout = "Click here to <strong>logout</strong>"
var geologinbar_location = "This is your current <strong>location</strong>. Click on any point on the left to backtrack"
var geologinbar_path = "This is a step in the <strong>path</strong> to your current location. Click here to return to this step"

// Browse Tree
var geo_browse_msg = "<b>Browse</b> public holdings...";
var browse_geo_accessions_msg = "Browse GEO's public collection of submitter-supplied Platform, Sample, or Series records";
var browse_geo_accessions_platforms_msg = "A GEO Platform record describes array specifications and/or defines the set of elements that may be detected and quantified in an experiment";
var browse_geo_accessions_samples_msg = "A GEO Sample record details biological source characteristics, experimental parameters, and the derived gene expression measurements for each element on the array";
var browse_geo_accessions_series_msg = "A GEO Series record defines a set of related Samples and provides a focal point and overall summary description of a study";
var browse_datasets_msg = "Browse GEO DataSet, Series and Platform records"

// Query Tree

var geo_query_msg = "<b>Query</b> public holdings...";
var query_geo_accession_msg = "Retrieve a specific record by entering a valid GEO accession number (GPLxxx, GSMxxx, GSExxx, GDSxxx)";
var query_gene_gene_profiles_msg = "Enter search term(s) to locate and view individual, DataSet-specific, gene expression profiles of interest. Search for gene names, gene symbols, experiment keywords, etc";
var query_datasets_msg = "Enter search term(s) to locate GEO Series, DataSets, or Platforms of interest. Search for experiment keywords, authors, etc";
var query_geo_blast_msg = "Query for gene expression profiles of interest based on nucleotide sequence similarity"

// Submit Tree
var geo_submit_msg = "<b>Submit</b> to GEO...";
var submit_direct_deposit_update_msg = "Batch submit multiple data records using SOFTmatrix spreadsheets, SOFT files, MINiML files, etc. Batch updates to existing records may also be performed";
var submit_web_deposit_update_msg = "Submit individual Platform, Sample or Series records using simple, step-by-step interactive web forms. Updates to existing records may also be performed";
var submit_create_new_account_msg = "<strong>Create</strong> a new GEO account. This is only necessary for data deposit, not for data retrieval";
var submit_view_account_msg = "<strong>View</strong> your account. You can also edit your account. If you want to create an entirely new account, please logout first";

var geoactionselect_new_button = "<strong>Start submission</strong> process for a record type that you have selected on the left of this button"
var geoactionselect_update_button = "<strong>Update</strong> a record that you have already submitted; the record type is selected on the left of this button"
var geoactionselect_platform_radio = "<strong>Platform</strong>: provides the array definition. Submission requires a plain text tab-delimited data table of the array template, and description of the array.  Platform submission is not necessary if your array is already deposited with GEO or if submitting SAGE data"
var geoactionselect_sample_radio = "<strong>Sample</strong>: a single hybridization or SAGE library. Submission requires a plain text tab-delimited data table containing measurement data and a description of the biological source and treatment protocols.  The corresponding Platform record must exist in GEO before Sample records can be submitted"
var geoactionselect_series_radio = "<strong>Series</strong>: groups your Samples into a common publication reference, and provides a description of the overall study aim and design.  A Series submission is required to complete the submission process. You must have submitted your Samples before creating a Series"

var geologin_userid = "Enter your GEO account <strong>User ID</strong> here. If you do not have a GEO account, create one at the <i>Create a new account</i> link below. If you have forgotten your User ID, you can recover it at the <i>Recover a Used ID or password</i> link below"
var geologin_password = "Enter your <strong>password</strong> here. If you don't have a password, sign in with <strong>My NCBI</strong> instead. If you have forgotten your password, you can recover it at the <i>Recover a User ID or password</i> link below"
var geologin_persistent = "Keeps you permanently logged in for <strong>31</strong> days or until you explicitly <strong>log out</strong>"
var geologin_login = "Click to login with entered credentials"
var geologin_create = "Create a new GEO account here - you must sign in with My NCBI to create GEO account."
var geologin_recover = "If you already have a GEO account, but forgot the User ID and/or password required to access it, you can recover your account details here"
var geologin_myncbi = "If you have My NCBI account, you can sign in and then link it with your GEO account on the <strong>Contact Information</strong> page. Once linked, GEO will recognize your My NCBI credentials."

var geologin_recoveremail = "Enter the e-mail address you supplied when you created the account. Information about all accounts registered with this e-mail will be sent to that address"
var geologin_recoversubmit = "Click to have the account information e-mailed to you"
var geologin_recovercreate = "If you do not remember the e-mail address you supplied when creating the account, or if that e-mail is no longer available, you can create a new account and work with it. Please contact GEO staff at geo@ncbi.nlm.nih.gov if you need additional assistance with accounts"

var geoactionselect2_platformtype = "Select the category that describes the Platform <strong>distribution</strong>.  Microarrays are 'commercial', 'non-commercial', or 'custom-commercial' in accordance with how the array was manufactured . Choose 'virtual' only if creating a virtual definition for MS, MPSS, SARST, or RT-PCR data."
var geoactionselect2_next = "Go to the next step of your submission"
var geoactionselect2_sampleissage = "Specify if this submission represents traditional Serial Analysis of Gene Expression (SAGE) data"
var geoactionselect2_samplechannelsingle = "Submit a single channel Sample. A single channel Sample represents a hybridization in which cDNA or cRNA derived from one biosource is hybridized with the array. A typical example would be an Affymetrix GeneChip hybridization"
var geoactionselect2_samplechanneldual = "Submit a dual channel Sample. A dual channel Sample represents a hybridization in which cDNA or cRNA derived from two biosources are differentially labeled and hybridized with the same array"
var geoactionselect2_samplechannelmulti = "If your Sample has more than two channels, select this choice and enter the number of channels"
var geoactionselect2_platformselected = "If your Sample is based on a Platform you submitted previously, you may select it here, or you may enter any existing Platform accession in the entry field below. If you are going to use an Affymetrix CHP file, please use the respective line here"
var geoactionselect2_platformentered = "Enter the Platform accession number that your Sample is based on. The Platform must already be submitted to GEO; if not, please go back and submit the Platform first"
var geoactionselect2_platformfind = "Click this button to <strong>search</strong> for a Platform accession"
var geoactionselect2_platformview = "Click this button to <strong>view</strong> the entered Platform"

var geoactionselect3_accession = "Click the accession to <strong>update</strong> that record"
var geoactionselect3_baseplatformaccession = "Click the base Platform accession to <strong>see</strong> that Platform information"

var geoedituser_userid = "Enter a <strong>user ID</strong>; you will use it to refer to your account. The user ID must be unique and contain only letters, numbers, underscores (_), dots (.), dashes (-) or @-signs"
var geoedituser_entryfieldoptional = "Enter the requested information; you may leave this field empty; the information you enter here will be displayed on your records"
var geoedituser_entryfieldmandatory = "Enter the requested information; you must enter something here; the information you enter here will be displayed on your records"
var geoedituser_entryfieldemail = "Enter the <strong>e-mail</strong> associated with this account. This field may be hidden from the general public if you choose. Please make sure the e-mail is correct, otherwise you will not be able to recover your account"
var geoedituser_showemail = "Check here if you want your e-mail to be shown to the general public. If unchecked, only you and GEO staff will be able to see your e-mail"
var geoedituser_entryfieldphone = "Enter the <strong>phone number</strong> associated with this account. This field may be hidden from the general public if you choose"
var geoedituser_showphone = "Check here if you want your phone number to be shown to the general public. If unchecked, only you and GEO staff will be able to see your phone number"
var geoedituser_entryfieldfax = "Enter the <strong>fax number</strong> associated with this account. This field may be hidden from the general public if you choose"
var geoedituser_showfax = "Check here if you want your fax number to be shown to the general public. If unchecked, only you and GEO staff will be able to see your fax number"
var geoedituser_persontocontact = "Provide details here about the person responsible for submitting the data to GEO if different from above (e.g., microarray facility personnel). GEO staff will contact this person should any submission problems arise. These contact details will not be displayed on GEO records."
var geoedituser_save = "Click to <strong>save</strong> the information you have entered. If this is a new account, you will also be automatically logged in as the newly created contact so you can start your submissions right away"
var geoedituser_cancel = "Does <strong>not</strong> save the changes"

var geouserinfo_edit = "Click to <strong>edit</strong> your contact account information"
var geouserinfo_newreviewer = "Click to <strong>add</strong> a new global read-only reviewer linked to your account; this reviewer account provides global read access to all your data.  Limited access to individual submissions may be given from any of your private Series."
var geouserinfo_rmreviewer = "Click to <strong>remove</strong> this reviewer account"

var geofindplatform_title = "Enter a word that is part of the title here; only Platforms which titles contain this word will be returned. Leave this field empty if the title in not important for your search"
var geofindplatform_selectcompanyname = "Select the company that manufactured the Platform or select N/A if this is not important for your search"
var geofindplatform_selectdistribution = "Select the Platform distribution. Select N/A if the distribution is not important for your search."
var geofindplatform_selectorganism = "Select the organism that is associated with the Platform. Select N/A if the organism is not important for your search. You can also type the organism in the field below if it is not present in the selection list"
var geofindplatform_enterorganism = "Enter a part of the organism name that is associated with the Platform. Enter N/A or leave blank if the organism is not important for your search"
var geofindplatform_find = "Click to <strong>find</strong> all Platforms that satisfy all the criteria entered on the left"
var geofindplatform_close = "Do not perform the search, close the window"
var geofindplatform_select = "Select this Platform to be used as the reference for your Sample submission. This window will close and the selected Platform accession number will be inserted in the relevant place in the Sample submission page"
var geofindplatform_open = "View the Platform in a new window"

var geobrosta_publictotal = "Information about the number of public and unreleased records"
var geobrosta_publicbrowse = "Click on a line to browse through all public data of the respective type"
var geobrosta_mytotal = "Information about the number of public and unreleased records that were submitted by you"
var geobrosta_mybrowse = "Click on a line to browse through all data submitted by you. You will see both public and unreleased records"

var geobrosubmi_name = "Click on the <strong>contact</strong> name to see public information"
var geobrosubmi_platforms = "Click to see all public <strong>Platforms</strong> submitted by this contact"
var geobrosubmi_samples = "Click to see all public <strong>Samples</strong> submitted by this contact"
var geobrosubmi_series = "Click to see all public <strong>Series</strong> submitted by this contact"
var geobrosubmi_forcelogin = "<strong>Login</strong> as this contact; no password needed"

var geobroobje_viewaccession = "View this accession in the accession viewer"
var geobroobje_viewbaseplatform = "View the reference Platform for this Sample"
var geobroobje_bysubmitter = "View all data submitted by this contact"
var geobroobje_organismus = "View this <strong>organism</strong> in the taxonomy browser"
var geobroobje_dlrawdata = "Download this raw data file"
var geobroobje_approvecheckbox = "Click to change the approval status of the record"
var geobroobje_releasecheckbox = "Click here to move the release date of the record to today"
var geobroobje_save = "Use this button to save the approval/release date changes you have made on this page"
var geobroobje_platformfind = "Click this button to <strong>search</strong> for a Platform"
var geobroobje_metafilter = "Use this box to browse only accessions containing only the specified string in their descriptive part (data tables and supplementary data will not be searched)"

var geoaxema_scope = "Select <strong>Self</strong> to see only this record, <strong>Platform</strong> to see all Platforms related to the current record, same for <strong>Samples</strong> and <strong>Series</strong>; select <strong>Family</strong> to see all records related to this accession"
var geoaxema_format = "Select whether you want to see the HTML rendition of the record or download the record as a SOFT-formatted file"
var geoaxema_amount = "Select amount of data you want to see: <strong>Brief</strong> shows overall information about the record, <strong>Quick</strong> adds the first 20 lines of all data tables associated with the accession, <strong>Full</strong> adds complete data tables, and <strong>Data</strong> retrieves only the data tables. Note that the Full and Data options are available only when exporting to a SOFT file and can lead to extended download times due to volume of data involved"
var geoaxema_acc = "Enter any valid accession number here (GPLxxx, GSMxxx, GSExxx, GDSxxx)"
var geoaxema_go = "Click to redisplay this screen with the newly selected options"
var geoaxema_recenter = "Click the accession to see it in the accession viewer"
var geoaxema_gds = "Search <strong>Entrez GEO DataSets</strong> for this accession"
var geoaxema_organismus = "View this <strong>organism</strong> in the taxonomy browser"
var geoaxema_update = "Click here if you want to update this record"
var geoaxema_mkreview = "Click here if you want to generate a <strong>reviewer token</strong> for private access to this Series and for all accessions contained within it as well."
var geoaxema_famsoft = "SOFT family files are text files that incorporate complete data and metadata for all Platform, Sample and Series records in the family."
var geoaxema_famminiml = "MINiML family files are XML files that incorporate complete data and metadata for all Platform, Sample and Series records in the family."
var geoaxema_fammatrix = "Series_matrix files are text files that include a tab-delimited value-matrix table generated from the 'VALUE' column of each Sample, headed by Sample and Series metadata. These files are suitable for loading into spreadsheet applications such as Excel.<br><strong>CAUTION:</strong> data are extracted directly from the original records with no consideration as to whether the values are directly comparable."
var geoaxema_pubmed = "Enter one or more PubMed ID(s). Separate multiple entries with comma."
var geoaxema_srarun = "Use the SRA Run Selector to list and select runs to be downloaded or analyzed with the SRA Toolkit."

var geodesli_softtext = "Select this if you are uploading a file in <strong>SOFT</strong> format. If supplementary files are part of your submission, zip or tar them together with your SOFT file. Do not include any sub-directories or sub-folders in the zip or tar archive."
var geodesli_geoarchive = "Select this if you are uploading a file in <strong>GEOarchive</strong> format. All spreadsheets and raw data files should be zipped or tarred together"
var geodesli_softmatrix = "Select this if you are uploading a file in <strong>SOFTmatrix</strong> spreadsheet format. If supplementary files are part of your submission, zip or tar them together with your spreadsheet file."
var geodesli_miniml = "Select this if you are uploading a file in <strong>MINiML</strong> format. If external and/or supplementary files are part of your submission, zip or tar them together with your MINiML file. Do not include any sub-directories or sub-folders in the zip or tar archive."
var geodesli_other = "Select this if you are uploading updates or files requested by the GEO staff"
var geodesli_browsefile = "Type in the location of the file you are uploading on your machine or use the <strong>Browse</strong> button to select the file"
var geodesli_nextupload = "Click <strong>Next</strong> to upload the file and proceed to the next screen. If you experience browser timeouts during the file upload, please contact GEO staff at geo@ncbi.nlm.nih.gov for assistance."
var geodesli_holddate = "Enter a hold until date. A minimum hold of 2 days will be applied to any submission that has not yet been approved by the GEO staff."
var geodesli_maxerrors = "Enter maximum amount of reported errors in case your file has any."
var geodesli_neworupdate = "Choose whether you are making an entirely new submission or updating an existing one."
var geodesli_actsubmit = "Choose whether you want to submit the file or just check its validity"
var geodesli_clientfilename = "This tell you the local path to the file you have just uploaded"
var geodesli_upduseexistdate = "Do not change the release date for the object that you are updating"
var geodesli_releaseimmeddate = "Release as soon as possible (subject to GEO curators approval)"
var geodesli_comment = "Enter an optional comment here, the GEO staff person who processes your submission will see this comment"
var geodesli_submitnext = "Click here to make another submission using direct deposit"

var geosubri_selectsoftfile = "Select the SOFT-formatted file; do not select any of the supplementary files. If you have created the SOFT file correctly, the supplementary files will be included automatically"
var geosubri_selectminimlfile = "Select the MINiML-formatted file; do not select any of the supplementary files. If you have created the MINiML file correctly, the supplementary files will be included automatically"

var geosesu_title = "Provide a unique title that describes the overall study (maximum 120 characters)"
var geosesu_pmid = "Specify a valid PubMed identifier (PMID) that references a published article describing this study. Multiple PMIDs can be added using a comma separator, e.g. 12345678, 12345679"
var geosesu_url = "Specify a Web link that directs users to supplementary information about the study"
var geosesu_descr = "Summarize the goals and objectives of this study. The abstract from the associated publication may be suitable. You can include as much text as you need to thoroughly describe the study"
var geosesu_overalldesign = "Provide a brief description of the experimental design. Indicate how many samples are analyzed, if replicates are included, are there control and/or reference samples, dye-swaps, etc.. You can include as much text as you need to thoroughly describe the experimental design"
var geosesu_seriestype = "Enter keyword(s) that generally describe the type of study. Examples include: time course, dose response, comparative genomic hybridization, ChIP-chip, cell type comparison, disease state analysis, stress response, genetic modification, etc."
var geosesu_listcontribs = "List contributors associated with this study"


var geowesu_specifysmtitle = "Provide a unique title that describes this sample (maximum 120 characters). We suggest that you use the system [biomaterial]_[condition(s)]_[replicate number], e.g. \'Muscle_exercised_60min_rep2.\'"
var geowesu_specifypltitle = "Provide a unique title that describes your array (maximum 120 characters). We suggest that you use the system [institution/lab]_[species]_[number of features]_[version], e.g. \'FHCRC_Mouse_15K_v1.0\'"
var geowesu_datareleasedate = "Specify the date on which data can be released to the public. This submission can be held private for up to three years from today (the date can be extended later should the need arise). All submissions are kept private until reviewed/approved by a GEO curator (usually within 2 days)"
var geowesu_sampletagcount = "Specify the total number of tags extracted from library. A whole, non-zero number is required. The reciprocal of this number is used for SAGE library normalization."
var geowesu_hybrprotocol = "Describe the protocols used for hybridization, blocking and washing, and any post-processing steps such as staining. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_scanprotocol = "Describe the scanning and image acquisition protocols, hardware, and software. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_selectorgs_pl = "Identify the organism(s) from which the elements on the array were designed or derived. Multiple organisms can be specified by holding down the Ctrl key during selection."
var geowesu_specotherorgs_pl = "Use this box if one or more of the array organisms are missing from the above list. Text is required if OTHER was selected from the menu above. Multiple organism names should be separated with a comma"
var geowesu_manufacturer = "Provide the name of the company, facility or laboratory where the array was manufactured or produced"
var geowesu_manuprotocol = "Describe the array manufacture protocol. Include as much detail as possible, e.g., clone/primer set identification and preparation, spotting protocols. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_catalognumber = "Provide the manufacturer catalog number for commercially-available arrays"
var geowesu_platformsupport = "Choose the surface type of the array"
var geowesu_coating = "Choose the coating on the array"
var geowesu_addsampleinfo = "Include any additional information not provided in the other fields, or paste in broad descriptions that cannot be easily dissected into the other fields"
var geowesu_addinfo = "Provide any additional descriptive information not captured in another field, e.g., array and/or feature physical dimensions, element grid system"
var geowesu_dataprocessing = "Provide details of how data in the VALUE column of your table were generated and calculated, i.e. normalization method, data selection procedures and parameters, transformation algorithm (e.g. MAS5.0). You can include as much text as you need to thoroughly describe the procedures"
var geowesu_url = "Specify a Web link that directs users to supplementary information about the array"
var geowesu_pmid = "Specify a valid PubMed identifier (PMID) that references a published article that describes the array. Multiple PMIDs can be added using a comma separator, e.g. 12345678, 12345679"
var geowesu_listcontribs = "List contributors associated with this array design"
var geowesu_namingsource = "Briefly identify the biological material and the experimental variable(s), e.g. \'vastus lateralis muscle, exercised, 60 min.\'"
var geowesu_selectorgs_sm = "Identify the organism(s) from which the biological material was derived. Multiple organisms can be specified by holding down the Ctrl key during selection"
var geowesu_specotherorgs_sm = "Use this box if one or more of the biological material organisms are missing from the above list. Text is required if OTHER was selected from the menu above. Multiple organism names should be separated with a comma"
var geowesu_samplecharacteristics = "List all available characteristics of the biological source e.g., \'Strain: C57BL/6\', \'Gender: female\', \'Age: 45 days\', \'Tissue:bladder tumor\', \'Tumor stage: Ta\'. You can include as much text as you need to thoroughly describe the biological material"
var geowesu_provider = "Specify the name of the company, laboratory or person that provided the biological material"
var geowesu_treatmentprotocol = "Describe any treatments applied to the biological material prior to extract preparation. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_growthprotocol = "Describe the conditions that were used to grow or maintain organisms or cells prior to extract preparation. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_specmolecule = "Specify the type of molecule that was extracted from the biological material"
var geowesu_extractprotocol = "Describe the protocol used to isolate the extract material. You can include as much text as you need to thoroughly describe the protocol"
var geowesu_speclabel = "Specify the compound used to label the extract e.g., biotin, Cy3, Cy5, 33P"
var geowesu_labelprotocol = "Describe the protocol used to label the extract. You can include a s much text as you need to thoroughly describe the protocol"
var geowesu_supplfile = "Upload supplementary raw data for this submission. Most typically this will be the spot intensity files derived from the images, e.g. Affymetrix CEL files, GenePix GPR files, and Agilent TXT files. If this Sample has more than one raw file you will need to package them into a ZIP (or similar) archive file before uploading. Note that raw data provision is required for MIAME compliance"
var geowesu_plsupplfile = "Upload supplementary raw data for this Platform submission. A supplementary Platform file typically represents the complete annotation template for a condensed Platform submission, for example, an Affymetrix .CDF or .PSI file. No expression measurement data should be included in this file. If you need to upload several files, you will need to package them into a ZIP (or similar) archive file before uploading"
var geowesu_listcontribs = "List contributors associated with this study"

var geosudata_selectpltechnology = "Select the category that best describes the array technology. Contact us at geo@ncbi.nlm.nih.gov for help with technologies not listed"
var geosudata_supplyplatformdatafile = "Supply a plain text tab-delimited data table that represents the array template. Use the \'Browse\' button to select the local file to be uploaded. Refer to the \'Web Deposit Guide\' link above for Platform data table requirements and guidelines"
var geosudata_selectsmtechnology = "Select the anchoring enzyme used in your SAGE protocol, e.g., NlaIII or Sau3A. Protocol selection in SAGE libraries replaces platform selection.<br>A selection is required"
var geosudata_otherprotocol = "Specify an alternative anchor enzyme not listed in the Protocol menu above. Text is required if OTHER was selected from the menu above"
var geosudata_taglength = "Specify the base pair length of the tags (excluding anchor sequence)"
var geosudata_supplysampledatafile = "Supply a plain text tab-delimited data table that contains quantification data for one Sample. You can also use a CHP file instead (make sure it has .chp extension). Use the \'Browse\' button to select the local file to be uploaded. Refer to the \'Web Deposit Guide\' link above for Sample data table requirements and guidelines"
var geosudata_datafiletype = "<ul><li>We request that processed/normalized data be provided in the VALUE column<li>Raw data can be included in the table upload under additional (non-VALUE) column headers<li>We require that raw data be provided for all submissions. Although raw data may be included in your uploaded data table here, we recommend that supplemental raw data files are deposited for all submissions. Supplemental files may include the image files themselves (e.g. TIFF or JPG) and/or the quantification results files derived from the images (e.g. GPR, TXT, CEL). You will be given the opportunity to upload your supplemental files in a subsequent step</ul>"
var geosudata_skip = "If you do not want to upload a new data table, click this button to proceed directly to updating data field definitions"



