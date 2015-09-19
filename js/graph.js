var urlOrigin = "http://sandboxes";
var singleCount =0;
var nonSingleCount = 0;
var singleDuration = 0;
var nonSingleDuration = 0;
var nonSingleDuration1 = 0;
var nonSingleCount1 =0;
var exit;
var passed, failed, stalled;
var data_h_att = [], data_s_sum = [], data_s_usa = [], data_c_typ = [],
data_h_eff = [], data_t_att = [], data_c_all = [], data_a_inf = [];
var hosts;
var sessions;
var hosts;
var events;
var hostInfo;

function plotGraph() {
    var clusterVal = document.getElementById("cluster_dropdown").value;   
    var brcVal = $("input:radio[name ='BRC_select']:checked").val();
    var jobVal = document.getElementById("job_dropdown").value;     
    var archVal = document.getElementById("arch_dropdown").value; 
    var testVal = $("input:radio[name ='test_select']:checked").val();
    singleDuration = 0;
    nonSingleDuration = 0;
    singleCount =0;
    nonSingleCount = 0;
    nonSingleCount1=0;
    nonSingleDuration1=0;
    var countofhosts = 0;

    $.ajax({
        type: "GET",
        url: urlOrigin+"/sandbox/skondred/workspaces/cgi/host_allocation.cgi?arch="+archVal+"&brc="+brcVal+"&job="+jobVal+"&cluster="+clusterVal+"&stage="+testVal,       
        dataType: "xml",
        success: function (xml) {                     
            hosts = $(xml).find('data').find('hosts').find('h');
            sessions = hosts.find('session');
            events = $(xml).find('data').find('events').find('event');
            populateTornadoInfo();
            populatePieInfo (sessions, hosts);
            plotTornadoGraph();
            plotPieGraph(data_s_usa, data_h_att, data_s_sum, data_c_typ, data_a_inf, data_t_att, data_h_eff, data_c_all, data_h_eff);



        },
        //other code
        error: function() {
            alert("The host allocation log for job"+jobVal+"could not be retrieved");
        }
    });      

   // plotTornadoGraph ();
    //plotSessionGraph();
    //plotPieGraph();
}

function populatePieInfo (sessions, hosts) {
    
    populate_s_usa ();
    populate_s_sum ();
    populate_h_att ();    
    populate_c_typ ();
    populate_a_inf ();
    populate_t_att ();
    populate_c_all ();
    populate_h_eff ();

    /*                $(xml).find('data').find('hosts').find('h').find('session').not('[sattrs~="SINGLEUSE"]').each(function(){
        nonSingleCount++;
        nonSingleDuration += parseInt($(this).attr("duration")); */
    //});


    /*  
    if ($(this).attr('sattrs')~='SINGLEUSE']) {
        singleCount++;
        nonSingleDuration += 
    }
    else {
        nonSingleCount++;
    }


    find('session[sattrs~="SINGLEUSE"]').length; 
     */
    //nonSingleCount = $(xml).find('data').find('hosts').find('h').not('[attribute~="SINGLEUSE"]').length; 
    //  singleCount    = $(xml).find('data').find('hosts').find('h[attribute~="SINGLEUSE"]').length; 

    //singleCount =5;
    // nonSingleCount =10;

    // alert(data+"  "+nonSingleCount1+"  "+nonSingleDuration+ "  "+nonSingleDuration1+"  "+countofhosts);
    //});   
}
function populate_s_usa ( ) {
    data_s_usa = [];
    sessions.filter('[sattrs~="SINGLEUSE"]').each(function(){
        singleCount++;
        singleDuration += parseInt($(this).attr("duration"));
    });
    sessions.not('[sattrs~="SINGLEUSE"]').each(function(){
        nonSingleCount++;
        nonSingleDuration += parseInt($(this).attr("duration"));
    });
    
     data_s_usa.push(
        {name: 'singleuse', value: singleDuration, color: "#CC0000" },
        {name: 'non-singleuse', value: nonSingleDuration, color: "#009900"}
    ); 
}    


function populate_s_sum ( ) {
    data_s_sum = [];
    passed  = 0;
    failed  = 0;
    stalled = 0;
    sessions.each(function(){
        var exit=$(this).attr('exit_code');
        if (exit=="0") {
            passed++;
        }
        else if (exit == "9") {
            stalled++;
        }
        else {
            failed++;
        }
    });

    //var data_s_sum = [];
    if (passed!="0") {
    data_s_sum.push({name: 'passed', value: passed, color: "#009900"});  
    }
    if (failed!="0") {
    data_s_sum.push({name: 'failed', value: failed, color: "#CC0000"});  
    }
    if (stalled!="0") { 
    data_s_sum.push({name: 'stalled', value: stalled, color: "#FF9900"});  
    }      
}

function populate_h_att ( ) {
    data_h_att = [];
    //var data_h_att=[]; 
    var lookup_h_att={};    
    var count_h_att=0;
    hosts.each(function() {
      hostAttribute = $(this).attr("request_attribute");
     // alert($(this).attr("request_attribute"));
         if(hostAttribute in lookup_h_att) {
            (data_h_att[lookup_h_att[hostAttribute]]).value++;
            
        }
        else {
         data_h_att.push({name: hostAttribute, value: 1});
         lookup_h_att[data_h_att[count_h_att].name] = count_h_att;
         count_h_att++;
        }
         
    /*                     
       hostAttribute = $(this).attr("request_attribute");
    data_h_att.hostAttribute     

     obj.prop = ++obj.prop || 0;  */
       
    });    
}

function populate_c_typ () {
    data_c_typ = [];
    var lookup_c_typ={};    
    var count_c_typ = 0;
    hosts.each(function() {
        coreType = $(this).attr("cores");
     // alert($(this).attr("request_attribute"));
        if(coreType in lookup_c_typ) {
            (data_c_typ[lookup_c_typ[coreType]]).value++;
            
        } else {
            data_c_typ.push({name: coreType, value: 1});
            lookup_c_typ[data_c_typ[count_c_typ].name] = count_c_typ;
            count_c_typ++;
        }    
    }); 
}

function populate_a_inf () {
    data_a_inf = [];
    var lookup_a_inf={};    
    var count_a_inf = 0;
    var allocInfo;
    events.each(function() {
        allocInfo = $(this).attr("event");
     // alert($(this).attr("request_attribute"));
        if(allocInfo in lookup_a_inf) {
            (data_a_inf[lookup_a_inf[allocInfo]]).value++;
            
        } else {
            data_a_inf.push({name: allocInfo, value: 1});
            lookup_a_inf[data_a_inf[count_a_inf].name] = count_a_inf;
            count_a_inf++;
        }    
    }); 
}   

function populate_t_att () {
    data_t_att = [];
    var lookup_t_att={};    
    var count_t_att = 0;
    var testAttribute;
    sessions.each(function() {
        testAttribute = $(this).attr("tas");
     // alert($(this).attr("request_attribute"));
        if(testAttribute in lookup_t_att) {
            (data_t_att[lookup_t_att[testAttribute]]).value++;
            
        } else {
            data_t_att.push({name: testAttribute, value: 1});
            lookup_t_att[data_t_att[count_t_att].name] = count_t_att;
            count_t_att++;
        }    
    }); 
} 

function populate_c_all () {
    var totalCores = 0, totalCoresUsed = 0, totalCoresReused = 0, used, reused;
    for (var i = 0; i < hostInfo.length; i++) {
        used = 0;reused = 0;
        totalCores += hostInfo[i].cores;
        $.each(hostInfo[i].value, function( index, value ) {
            if (value.value.length > 0) {
                used += 1;    
            }
            if (value.value.length > 1) {
                reused+=1;
            }   
        });        
        
        hostInfo[i].used = used;
        hostInfo[i].reused = reused;
        totalCoresUsed += used;
        totalCoresReused += reused;
    }
        
    
    var totalUnusedCores = totalCores - totalCoresUsed;
    if (totalCoresReused != 0) {
    data_c_all.push({name: 'reused', value: totalCoresReused, color: "#009900"});  
    }
    if (totalUnusedCores != 0) {
    data_c_all.push({name: 'unused', value: totalUnusedCores, color: "#CC0000"});  
    }
    if (totalCoresUsed != 0) { 
    data_c_all.push({name: 'used', value: totalCoresUsed, color: "#FF9900"});  
    } 
}

function populate_h_eff ( ) {
    var vhWaste = 0, overHead = 0, hostUsa = 0, sesUsa = 0, waste;
    data_h_eff = [];
    
    sessions.each(function() {
        if ($(this).attr("sattrs")=="2TCU") {
            sesUsa += (parseInt($(this).attr("duration")))*2;
            overHead += (parseInt($(this).attr("trstart")) - parseInt($(this).attr("start")))*2;
        } else {
            sesUsa += (parseInt($(this).attr("duration")));
            overHead += (parseInt($(this).attr("trstart")) - parseInt($(this).attr("start")));                   
        }

    });
    hosts.each(function() {
        hostUsa += (parseInt($(this).attr("returned")) - parseInt($(this).attr("taken")))*parseInt($(this).attr("cores"));
        vhWaste += parseInt($(this).attr("vh"))*parseInt($(this).attr("cores")); 
        
    });    
    waste = hostUsa - sesUsa;
    data_h_eff.push({name: 'session usage', value: sesUsa, color: "#009900"}, 
                    {name: 'waste', value: waste, color: "#CC0000"},
                    {name: 'overhead', value: overHead, color: "#FF9900"},
                    {name: 'vhWaste', value: vhWaste, color: "#FF9900"});    
}  




function populateTornadoInfo () {
    var start, 
    end = 0,
    overhead,
    previousSessionEnd, 
    coreInfo = [];
    hostInfo = [];
    var hostName;
    var sid, cores;
    hosts.each(function() {
        hostName = $(this).attr('name')
        coreInfo = [];
        previousSessionEnd = Number.MAX_VALUE;
        //previousSessionEnd = null;
        cores = parseInt($(this).attr('cores'))
        for (var i = 0; i < cores; i++) {
            coreInfo.push({previousSessionEnd: 0, value: []});
        }
        $(this).find('session').each(function() {
            start = parseInt($(this).attr('start'));
            duration  = parseInt($(this).attr('duration'));
            end = parseInt(start + duration);
            overhead = parseInt($(this).attr('trstart')) - parseInt($(this).attr('start'));
            sid = $(this).attr('sid');
            var coreCount;
            (($(this).attr("sattrs")=="2TCU") ? coreCount = 2: coreCount = 1); 
            var count = 0;
            for (var i = 0; i < cores; i++) {      
                if (coreInfo[i].previousSessionEnd <= start) { 
                    coreInfo[i].value.push({LaunchOverhead: overhead, sid: sid, start: start , end: end, duration: duration}); 
                    coreInfo[i].previousSessionEnd = end;
                    count++;
                    if (count==coreCount) {
                        break;
                    }
               }
            }             
        });
       hostInfo.push({name: hostName, value: coreInfo, cores: cores, used: 0}); 
    });    
}