var urlOrigin = "http://sandboxes";
$(document).ready(function(){

    $("#pie_pane").hide();
    $("#session_pane").hide();
    $('input[name="data_perspective"]').change(change_view);
    $('input[name="BRC_select"]').change(populateWithJobs);
    $('input[name="test_select"]').change(populateWithArchs);

    $.ajax({
        type: "GET",
        url: urlOrigin+"/sandbox/skondred/workspaces/cgi/activeclusters.cgi",
        dataType: "xml",
        success: function (xml) {
            populateWithClusters(xml);
        },
        error: function() {
            alert("The XML File could not be processed correctly.");
        }
    });
});

function change_view() {

  var current_view = $ (this).prop ("value");
$(".view_pane").hide();
  $("#"+current_view).show();
}

function populateWithClusters(xml) {

    $(xml).find('clusters').find('data').each(function(){
        var clusterName = $(this).attr('id');
        $('#cluster_dropdown').append(
                 $('<option></option>')
                        .val(clusterName)
                        .text(clusterName)
                        );
   }
    );
        $('#cluster_dropdown.combobox').combobox('refresh');
        $('#cluster_dropdown').change(function () {
            var saveDefArch = $('#arch_dropdown #defArch').detach();
            $('#arch_dropdown').empty().append(saveDefArch);
            populateWithJobs();

        } );
}

function populateWithJobs() {
    var saveDefJob = $('#job_dropdown #defJob').detach();
    $('#job_dropdown').empty().append(saveDefJob);
    var clusterVal = document.getElementById("cluster_dropdown").value;
    var brcVal = $("input:radio[name ='BRC_select']:checked").val();
    $.ajax({
        type: "GET",
        url: urlOrigin+"/sandbox/skondred/workspaces/cgi/gettrdbjobs.cgi?brc="+brcVal+"&cluster="+clusterVal,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('jobs').find('job').each(function(){
                var jobName = $(this).attr('id');
                $('#job_dropdown').append(
                    $('<option></option>')
                        .val(jobName)
                        .text(jobName)
                );

            });
            $('#job_dropdown.combobox').combobox('refresh');
            $('#job_dropdown').change(function () {
               populateWithArchs();
            });
        },
        error: function() {
            alert("job list could not be retrieved for "+brcVal);
        }
    });
}

function populateWithArchs() {
    var clusterVal = document.getElementById("cluster_dropdown").value;
    var brcVal = $("input:radio[name ='BRC_select']:checked").val();
    var testVal = $("input:radio[name ='test_select']:checked").val();
    var jobVal = document.getElementById("job_dropdown").value;
    $.ajax({
        type: "GET",
        url: urlOrigin+"/sandbox/skondred/workspaces/cgi/querytrdb.cgi?brc="+brcVal+"&cluster="+clusterVal+"&job="+jobVal+"&query=getPlatforms&stage="+testVal,
        dataType: "xml",
        success: function (xml) {
           var saveDefArch = $('#arch_dropdown #defArch').detach();
           $('#arch_dropdown').empty().append(saveDefArch);
            $(xml).find('data').find('arch').each(function(){
                var archName = $(this).attr('id');
                $('#arch_dropdown').append(
                    $('<option></option>')
                        .val(archName)
                        .text(archName)
                );
            });
            $('#arch_dropdown.combobox').combobox('refresh');
        },
        error: function() {
            alert("arch list could not be retrieved for "+jobVal);
        }
    });
}