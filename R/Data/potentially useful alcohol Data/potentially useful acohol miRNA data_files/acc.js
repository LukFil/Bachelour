var loadNATracks = function( acc ){

    if ( acc.match("^GSE") ){
        series = true;
    } 
    else{ 
        series = false;
    }

    var add_viewer_link = function (){
        var na = $('td').filter( function(){
            return $(this).text() == 'Named Annotation';
        }).next();
        
        //for series (no Named Annotation)
        var main_table = $( '#ViewOptions' ).next().find('table').first();
        
        var html = '<button class="jig-ncbibutton ui-ncbibutton-blue ui-button-text-only" id="gdv_button" >'+
                    '<span class="ui-button-text">See on Genome Data Viewer</span></button>';
        var url = '/genome/gdv/browser/?context=GEO&amp;acc=' + acc;
        
        if ( na.length ){
            na.parent().css('display','none');
            main_table.after(html);
        }
        else if ( series ){
            main_table.after(html);
        }
        $('#gdv_button').ncbibutton();
        $('#gdv_button').click( function(){
            window.location.href = url;
        });
        
    }
    
    // Check for viewer link for series
    if ( series ){
        $.ajax({
            type: "get", url: "/entrez/eutils/esearch.fcgi?db=gds&term=GSE[etype] AND " + acc + "[ACCN] AND track[filter]",
            dataType: "xml", timeout: 5000,
            success: function(xml) {
                if ($(xml).find('eSearchResult').children('Count').text() > 0){
                    add_viewer_link();
                }
           }
        });
    }
    else{
        add_viewer_link();
    }

};

jQuery(document).ready(function(){
    $.ajaxSetup({ cache: false });
    
    var acc = $('.acc').attr('id');
    loadNATracks( acc );
    
    // PubMed title
    $('.pubmed_id').each(function() {
        var pmObj = $(this);
        var pmId = pmObj.attr('id');
        if (pmId.length) {
            $.ajax({
                type: "get", url: "/sites/PubmedCitation?id=" + pmId,
                dataType: "text",
                success: function(text) {
                    if (text.indexOf('class="title"') > 0) pmObj.html(text);
                }
            });
        }
    });
    
    // Link to bioproject
    var bioproject_link = function(bioObj, bioId){
        $.ajax({
            type: "get", url: "/entrez/eutils/esummary.fcgi?db=bioproject&id=" + bioId,
            dataType: "xml",
            success: function(xml) {
                var html = "<ul>";
                $(xml).find('DocumentSummary').each(function(){
                    var title = $(this).find('Project_Title').text();
                    var acc = $(this).find('Project_Acc').text();
                    if( acc ){
                        html+='<li><a href="/bioproject/'+acc+'">'+acc+'</a> '
                            +(title.length?title:'')+'</li>';
                    }
                    else{
                        html+='<li>'+bioAcc+'</li>';
                    }
                });
                html+='</ul>';
                bioObj.html(html);
            }
        });
    };
    
    // BioProject title
    $('.gp_id').each(function() {
        var bioObj = $(this);
        var bioAcc = bioObj.attr('id');
        var bioId = bioAcc.substring(5);
        var bioPrefix = bioAcc.substring(0,5).toUpperCase();

        if (bioId.length) {
            if(bioPrefix == 'PRJNA'){
                bioproject_link(bioObj, bioId);
            }
            else{
                $.ajax({
                    type: "get", url: "/entrez/eutils/esearch.fcgi?db=bioproject&term=" + bioAcc + "[Project%20Accession]",
                    dataType: "xml", 
                    success: function(xml) {
                        if ($(xml).find('eSearchResult').children('Count').text() == 1){
                            bioId = $(xml).find('IdList').find('Id').text();
                            bioproject_link(bioObj, bioId);
                        }
                   }
                });
            }
        }
    });

    
    // Geo2R link on series
    $('#geo2r').each(function() {
        var geo2rObj = $(this);
        $.getJSON("/geo/tools/geoinfo.cgi?mode=validate&acc=" + acc, function(data) {
            if (data.GEO_Info.accession.series.geo2r.status == 0) {
                var html = '<button class="jig-ncbibutton ui-ncbibutton-blue ui-button-text-only" id="geo2r_button">' +
                            '<span class="ui-button-text">Analyze with GEO2R</span></button>'
                var url = '/geo/geo2r/?acc='+acc;
                
                if($('#gdv_button').length){
                    $('#gdv_button').after(html);
                }
                else{
                    geo2rObj.prev('br').remove();
                    geo2rObj.append(html);
                }
                
                $('#geo2r_button').ncbibutton();
                $('#geo2r_button').click( function(){
                    window.location.href = url;
                });
            }
        });
    });
    
    // Custom series supplementary download
    $('#customDl').click(function() {
        var customDl = $('#customDlArea');
        var x = customDl.offset().top;
        $('html,body').animate({scrollTop: customDl.offset().top},'fast');
        customDl.html("<img src='/geo/img/loading_blue.gif'/>Please wait...");
        $.ajax({
            type: "get", url: "/geo/download/?format=xml&acc="+acc,
            dataType: "xml", timeout: 15000,
            success: function(xml) {
                var htmlRows = '';
                var height = 0;
                $(xml).find('file').each(function(){
                    htmlRows += '<tr><td valign="top" bgcolor="'+($(this).attr('id') % 2 ? '#eeeeee' : '#deebdc')+
                        '"><input class="customDlGroup" id="'+$(this).attr('id')+'" type="checkbox"'+
                        ' style="border:none" onClick="CustomDlCount()" dlsize="'+$(this).attr('size')+'">'+
                        $(this).text()+'</input></td>'+
                        '<td align="right" bgcolor="'+($(this).attr('id') % 2 ? '#eeeeee' : '#deebdc')+
                        '" nowrap="nowrap">'+CustomDlBytes($(this).attr('size'))+'</td></tr>';
                    height += 24;
                });
                if (height > 450) { height = 450; }
                var html = '<br>&nbsp;Custom '+acc+'_RAW.tar archive:'+
                    '<br><table cellpadding="2" cellspacing="2" width="600"><thead><tr>'+
                    '<td align="center" bgcolor="#cccccc" width="440px"><strong>Supplementary file</strong></td>'+
                    '<td align="center" bgcolor="#cccccc" width="160px"><strong>File size</strong></td>'+
                    '</tr></thead><tbody><tr><td colspan="2" style="padding:0">'+
                    '<div style="overflow: auto; width: 600px; height: '+height+'px;">'+
                    '<table cellpadding="2" cellspacing="0" width="'+(height<450?600:580)+'">'+
                    '<tbody>'+htmlRows+'</tbody>'+
                    '</table></div></td></tr></tbody><tfoot><tr><td>'+
                    '<form id="customDlForm" method="post" action="/geo/download/">'+
                    '<input id="customDlAll" type="checkbox" style="border:none"'+
                    ' onClick="CustomDlAll()"><strong>Select All</strong></input>'+
                    '<input type="hidden" name="acc" value="'+acc+'"/>'+
                    '<input type="hidden" name="format" value="file"/>'+
                    '<input type="hidden" id="customDlId" name="id" value=""/>'+
                    '<input type="button" value="Cancel" onClick="CustomDlCancel()" style="margin:0 2px 0 180px"/>'+
                    '<input type="submit" id="customDlSubmit" value="Download"'+
                    ' disabled="disabled" onClick="CustomDlSubmit()"/>'+
                    '</form></td><td style="padding:6px 0;white-space:nowrap;'+
                    'vertical-align:top;text-align:right" id="customDlSize"/></tr></tfoot></table>';
                customDl.html(html);
                CustomDlCount();
            },
            error: function() {
                customDl.html("Request is taking too long. Please try again later.");
            }
        });
        return false;
    });
    
    // Pubmed Link update
    $('#pmidEdit').click(function() {
        EditPmId();
        return false;
    });
    
    // Reviewer access token
    $('#rvtknLink').click(function() {
        CheckRvToken();
        return false;
    });
    
    set_grant_lookup();
    
    // Survey when logged in
    if($('#username').length>0){
        if (typeof (jQuery) != 'undefined') {
            (function ($) {
                $(function () {           
                    var min = Math.ceil(1);
                    var max = Math.floor(100000);
                    var randomNum = Math.floor(Math.random() * (max - min)) + min;
                    var surveyUrl = "/projects/Gene/portal/surveys/seqdbui-survey.js?rando=" + randomNum.toString();
                    $.getScript(surveyUrl, function () {
                        try {
                            ncbi.seqDbUISurvey.init();   
                        } catch (err) {
                            console.info(err);
                        }
         
                    }).fail(function (jqxhr, settings, exception) {
                        console.info('Cannot load survey script', jqxhr);
                    });;
                });
            })(jQuery);
        }
    };
});

var set_grant_lookup = function(){
    grants_html = '<div id="grants_content">'+

    '<div id="grants_table"/><div id="grants_msg"/>'+
    '<button class="jig-ncbibutton ui-state-default ui-corner-all ui-button-text-only ui-ncbibutton ui-ncbibutton-gray" value="Add grant" id="edit_grants_btn"' +
        'role="button" aria-disabled="false">' +
        '<span class="ui-button-text">Add grant</span>' +
    '</button>'+
    '<a id="launchDialog" style="display:none" class="jig-ncbidialog" href="#grantsDialog">Click to add grants</a><br/>'+
        '<div id="grants_buttons" style="display:none">'+
            '<button class="jig-ncbibutton ui-ncbibutton-blue" value="save" id="save_grants_btn"' +
                'name="saveGrantsAssociationBtn" role="button" aria-disabled="false">' +
                '<span class="ui-button-text">Save</span>' +
            '</button>' +
            '<button class="jig-ncbibutton ui-ncbibutton-gray" value="Cancel" id="cancel_grants_btn"' +
                'role="button" aria-disabled="false">' +
                '<span class="ui-button-text">Cancel</span>' +
            '</button>' +
        '</div>'+
        
        '<div id="grantsDialog" style="display:none"> '+
            '<div id="GrantHub">' +
                    
            '</div>' +
    '</div></div>';
    
    if ($('#grantEdit').length){
        $('#grantEdit').remove();
        $('#grantCell').append(grants_html);
        
        $("#GrantHub").granthubsearch({authority_codes: "era|hra"});
        $('.ghs-search-button').addClass('ui-corner-all');
        $('.ghs-search-button').addClass('ui-ncbibutton-blue');
        $('.ui-button:contains("Add")').addClass('ui-ncbibutton-blue');
        $('.ui-button:contains("Add")').addClass('ui-ncbibutton-blue');
        $('.ghs-clear-button').addClass('ui-corner-all');
        
    }
    if( $.trim($('#grants_table').text()).length==0 ){
        $('#edit_grants_btn').ncbibutton();
        $('#save_grants_btn').ncbibutton().ncbibutton("disable");
        $('#save_grants_btn').attr("title", "Please add at least one grant");
        $('#cancel_grants_btn').ncbibutton();
    }

    $('#edit_grants_btn').click( function (){
        $('#orig_grantstable').hide();
        $('#grants_msg').html('');
        $('#edit_grants_btn').hide();
        $('#grants_buttons').show();
        $('#launchDialog').show();
        $('#save_grants_btn').ncbibutton().ncbibutton("disable");
        $('#save_grants_btn').attr("title", "Please add at least one grant");
    });
    $('#cancel_grants_btn').click( function(){
        $('#orig_grantstable').show();
        $('#grants_table table').remove();
        grants = [];
        $('#edit_grants_btn').show();
        $('#grants_buttons').hide();
        $('#launchDialog').hide();
        
    });
    $('#save_grants_btn').click( function(){
        $('#edit_grants_btn').show();
        $('#grants_buttons').hide();
        $('#launchDialog').hide();
        save_grants();
    });
    
    function save_grants(){
        $('#grantstable').remove();
        $.ajax({
            type: 'post',
            url:'/geo/submission/update/',
            dataType: 'json',
            async: false,
            data: {acc: $('.acc').attr('id'), key: 'grant', value: JSON.stringify(grants)},
            success: function(data, status){
                if (data && data.GeoUpdate.status == 'OK') {
                    $('#grants_msg').html('<b>Grant information was saved to database. Please refresh the page after few moments to verify.</b>');
                } else {
                    message = '<b>Grants not saved</b><br/>';
                    if(data){
                        message+= 'Error: '+data.GeoUpdate.message+'<br/>';
                    }
                    $('#grants_msg').html(message);
                    grants = [];
                }
            }
        });
    }
    
    var grants = [];
    
    $("#launchDialog").click( function(e){
        $("#grantsDialog").dialog({
            title: 'Select grants',
            resizable: false,
            autoOpen: false,
            modal: true,
            width: $(document).width() - 400,
            position: ['center',80],
            buttons: [
                {
                    text: "Add",
                        click: function () {
                            console.log(grants);
                            $.merge(grants, $("#GrantHub").granthubsearch("checked_items"));
                            $(this).dialog("close");
                            $('.ghs-result').empty().hide();
                            grants_to_table();
                            console.log(grants);
                            $('.ghs-clear-button').trigger('click');
                        }
                },
                {
                    text: "Cancel",
                    click: function () {$('.ghs-clear-button').trigger('click');$(this).dialog("close");}
                }
            ]
        }).dialog('open');
        
        helpText = '<div id="grantsNote">'+
                    '<p>Note:'+ 
                    '<p>If you can’t retrieve the correct grant using this system, you can email grant information to <a href="mailto:geo@ncbi.nlm.nih.gov">geo@ncbi.nlm.nih.gov</a> – please include the grant ID, grant title, and name of the funding source.</p>' +
                    '<p>Note that adding a new grant will overwrite any existing grants, so please make sure to include the original grant in updates, as necessary.</p>' +
                    '<p>To delete grants, please contact <a href="mailto:geo@ncbi.nlm.nih.gov">geo@ncbi.nlm.nih.gov</a>.</p>' +
                '</div>';
        if(!($('#grantsNote').length)){$('#GrantHub').after(helpText);}
        
        addButton = $(".ui-dialog-buttonset button:contains('Add')");
        addButton.button("disable");
        $('.ghs-count').bind("DOMSubtreeModified",function(){
            $('.ghs-result-checkbox').change(function(){
                if($('.ui-state-checked').length){
                    addButton.button("enable");
                }else{
                    addButton.button("disable");
                }
            });
        });
        return false;
    });
    
    function grants_to_table(){
        var gtablehtml = '<table id="grantstable"><thead><tr><th>Grant ID</th><th>Grant title</th><th>Affiliation</th><th>Name</th><th>Remove</th></tr></thead><tbody>';
        $.each(grants,function(){
            gtablehtml += '<tr><td class="gid_cell">'+this['award']['number']+'</td><td>'+this['award']['title']+'</td><td>'+this['award']['awardee']['name']+'</td><td>'+this['person']['given_names']+' '+this['person']['last_name']+'</td><td><a href="" class="removegrant">remove</a></td></tr>';
        });
        gtablehtml+='</tbody><table>'
        $('#grants_table').html(gtablehtml);
        $('#save_grants_btn').ncbibutton("enable");
        $('#save_grants_btn').removeAttr("title");
        remove_grants_events();
    }
    
    function remove_grants_events(){
        $('.removegrant').click( function( e ){
            e.preventDefault();
            var gid = $(this).parent().parent().find('.gid_cell').first().text();
            index = -1;
            $.each(grants, function( i ){
                if (this['award']['number'] == gid){
                    index = i;
                }
            })
            if(index >= 0){
                grants.splice(index, 1);
            }
            grants_to_table();
            if($('#grantstable').find('tbody').find('tr').length < 1){
                $('#grantstable').remove();
                $('#save_grants_btn').ncbibutton("disable");
                $('#save_grants_btn').attr("title", "Please add at least one grant");
            }
        });
    }
}


var pmidCellText = '';
var pmidCancelText = ' <a onclick="return CancelPmId()" href="">Cancel</a>';

function EditPmId() {
    var pmidCell = $('#pmidCell');
    if (!pmidCellText.length) pmidCellText = pmidCell.html();
    pmidCell.html('PubMed ID: <input id="pmidValue" type="text" onkeydown="if (event.keyCode == 13) CheckPmId()" '+
                    'onmouseover="onLinkOver(\'HelpMessage\' , geoaxema_pubmed)" onmouseout="onLinkOut(\'HelpMessage\' , geo_empty_help)"'+
                    '> <input onclick="CheckPmId()" type="button" value="Preview">'+pmidCancelText)
            .addClass('edit');
}

function CheckPmId() {
    var pmidValue = $('#pmidValue').val();
    if (pmidValue) {
        $.ajax({
            type: "get", url: "/sites/PubmedCitation?id="+pmidValue,
            dataType: "text", timeout: 3000,
            success: function(text) {
                if (text.indexOf('class="title"') > 0) {
                    $('#pmidCell').html(text+' <span id="pmidConfirm"><input onclick="UpdatePmId(\''+
                                        pmidValue+'\')" type="button" value="Save">'+pmidCancelText);
                } else {
                    $('#pmidCell').html('Cannot find PubMed ID:'+pmidValue+pmidCancelText);
                }
            },
            error: function() {
                $('#pmidCell').html('Error processing request. Please try again later.'+pmidCancelText);
            }
        });
    }
}

function UpdatePmId(pmid) {
    $('#pmidConfirm').css('display', 'none');
    $('#pmidCell').removeClass('edit');
    $.getJSON('/geo/submission/update/?acc='+$('.acc').attr('id')+'&key=pubmed_id&value='+pmid, function(data) {
        if (data.GeoUpdate.status == 'OK') {
            $('#pmidCell').prev().html('Citation(s)');
            window.location.reload();
        } else {
            $('#pmidCell').html(data.GeoUpdate.message+'. Please try again later.'+pmidCancelText);
        }
    });
}

function CancelPmId() {
    if (pmidCellText.length) {
        $('#pmidCell').html(pmidCellText).removeClass('edit');
        $('#pmidEdit').click(function() {
            EditPmId();
            return false;
        });
        return false;
    } else {
        return true;
    }
}

function CustomDlBytes(bytecount) {
    var str = '';
    if (Number(bytecount) > 1073741824) { str = (bytecount/1073741824).toFixed(1)+' Gb'; }
    else if (Number(bytecount) > 1048576) { str = (bytecount/1048576).toFixed(1)+' Mb'; }
    else if (Number(bytecount) > 1024) { str = (bytecount/1024).toFixed(1)+' Kb'; }
    else { str = bytecount+' b'; }
    return str; 
};

function CustomDlCancel() {
    $('#customDlArea').html("");
};

function CustomDlSubmit() {
    var idlist = '';
    $('.customDlGroup').each(function() {
        if ($(this).attr('checked')) {
            idlist += (idlist ? ',' : '') + $(this).attr('id');
        }
    });
    $('#customDlId').val(idlist);
};

function CustomDlAll() {
    if ($('#customDlAll').attr('checked')) {
        $('.customDlGroup').attr('checked', 'checked');
    } else {
        $('.customDlGroup').removeAttr('checked');
    }
    CustomDlCount();
};

function CustomDlCount() {
    var size = 0;
    var count = 0;
    $('.customDlGroup').each(function() {
        if ($(this).attr('checked')) {
            count++;
            size+=parseInt($(this).attr('dlsize'));
        }
    });
    if (!count) {
        $('#customDlSubmit').attr('disabled', 'disabled');
    } else {
        $('#customDlSubmit').removeAttr('disabled');
    }
    $('#customDlSize').html('<strong>'+count+' file(s), '+CustomDlBytes(size)+'</strong>');
};

function CheckRvToken() {
    var acc = $('.acc').attr('id');
    $.getJSON('/geo/tools/geoinfo.cgi?mode=validate&acc='+acc, function(data) {
        if (data.GEO_Info.accession.series.hasOwnProperty('tokens')) {
            var tokens = data.GEO_Info.accession.series.tokens;
            if (!tokens.length) {
                SetMsgInfo(
                    'Click <a id="rvtknCreate" href="">here</a> to create a reviewer access token.'+
                    ' The token will be e-mailed to your e-mail address');
                $('#rvtknCreate').click(function() {
                    CreateRvToken(acc);
                    return false;
                });
            } else if (tokens.length>1) {
                var token_list='';
                for (var i = 0; i < tokens.length; i++) {
                    token_list+=' '+tokens[i];
                }
                SetMsgInfo(
                    'Multiple reviewer access tokens found for this record:<b>'+token_list+
                    '</b>. Please <a href="mailto:geo@ncbi.nlm.nih.gov">contact GEO</a> to remove extra tokens.');
            } else {
                SetMsgInfo(
                    'The following secure token has been created to allow review of record '+acc+
                    ' while it remains in private status: <b>'+tokens[0]+
                    '</b>. Click <a id="rvtknDelete" href="">here</a> to revoke the access.');
                $('#rvtknDelete').click(function() {
                    DeleteRvToken(acc);
                    return false;
                });
            }
        } else {
            SetMsgErr('Unable to retrieve reviewer access token information.'+
                ' Please try again later or <a href="mailto:geo@ncbi.nlm.nih.gov">notify GEO</a>.');
        }
    });
}

function CreateRvToken(acc) {
    $.getJSON('/geo/submission/update/?key=rv_token&value=new&acc='+acc, function(data) {
        if (data.GeoUpdate.status == 'OK') {
            var token = data.GeoUpdate.value;
            SetMsgInfo(
                'The following secure token has been created to allow review of record '+acc+
                ' while it remains in private status: <b>'+token+
                '</b>. A copy of this information has been mailed to your e-mail address.');
        } else {
            SetMsgErr('Unable to update reviewer access token.'+
                ' Please try again later or <a href="mailto:geo@ncbi.nlm.nih.gov">notify GEO</a>.');
        }
    });
}

function DeleteRvToken(acc) {
    $.getJSON('/geo/submission/update/?key=rv_token&value=delete&acc='+acc, function(data) {
        if (data.GeoUpdate.status == 'OK') {
            SetMsgInfo('Reviewer access token access is revoked.');
        } else {
            SetMsgErr('Unable to update reviewer access token.'+
                ' Please try again later or <a href="mailto:geo@ncbi.nlm.nih.gov">notify GEO</a>.');
        }
    });
}

function SetMsgInfo(text) {
    $('#msg_info').html('<br/>'+text+'<br/><br/>');
}
function SetMsgErr(text) {
    $('#msg_err').html('<br/>'+text+'<br/><br/>');
}