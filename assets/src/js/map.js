// DESKTOP
if(!isMobile()) {
    if(confirm("Your device is not a mobile. \n\ Do you want to open the Desktop site?")) {
        window.location.href = "./Desktop/desktop.html";
    }
}

// if(isOnline()) {
//     alert('You are online!');
// } else {
//     alert('You are offline!');
// }


    var mymap;
    var lyrOSM;
    var lyrTopo;
    var lyrSatellite;
    var lyrOSMFrance;
    var lyrKio;
    var lyrBrPro;
    var lyrBrDis;
    var lyrBrComm;
    var lyrPeopleComittee;
    var lyrHamlet;
    var lyrWtp;
    var ctlScale;
    var ctlLayers;
    var ctlSidebar;
    var ctlEasyButton;
    var objBase;
    var objOverlay;
    var icnKio;
    var icnSW;
    var icnGW;
    var icnStart;
    var icnLocate;
    var slideIndex = 1;
    

$(document).ready(() => {
    //  **********  Map Initialization  **********
    mymap = L.map('mymap', {
        center: [9.787807, 105.616158], 
        zoom: 11, 
        attributionControl: false
    });

    //  **********  ICON Initialization  **********
    icnKio = L.icon({
        iconUrl: './assets/img/watertap.png',
        iconSize: [20,20]
    })

    icnSW = L.icon({
        iconUrl: './assets/img/SW.png',
        iconSize: [25,25]
    })

    icnGW = L.icon({
        iconUrl: './assets/img/GW.png',
        iconSize: [25,25]
    })

    icnLocate = L.icon({
        iconUrl: './assets/img/location.png',
        iconSize: [25,25]
    })

    //  **********  Basemap Layer Initialization  **********
    lyrOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
    lyrTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    lyrSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');
    lyrOSMFrance = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png');
    //  **********  Overlay Layer Initialization  **********
    lyrKio = L.geoJSON.ajax('./assets/data/lyrKiosk.geojson', {
        pointToLayer: styleKio
    }).addTo(mymap);

    
    lyrWtp = L.geoJSON.ajax('./assets/data/lyrWtp.geojson', {
        pointToLayer: styleWtp
    }).addTo(mymap)

    lyrPeopleComittee = L.geoJSON.ajax('./assets/data/lyrPeopleComittee.geojson', {
        pointToLayer: stylePeopleCommittee
    }).addTo(mymap)

    lyrHamlet = L.geoJSON.ajax('./assets/data/lyrHamlet.geojson', {
        pointToLayer: styleHamlet
    })

    lyrBrDis = L.geoJSON.ajax('./assets/data/lyrBrDistrict.geojson', {
        style: styleDistrict
    }).addTo(mymap)

    lyrBrComm = L.geoJSON.ajax('./assets/data/lyrBrCommune.geojson', {
        style: styleComm
    }).addTo(mymap)

    lyrBrPro = L.geoJSON.ajax('./assets/data/lyrBrProvince.geojson', {
        style: styleProvince
    }).addTo(mymap)


    //  **********  Layer Group  **********
    objBase = {
        "Topo Map": lyrTopo,
        "Osm": lyrOSM,
        "Satellite": lyrSatellite,
        "OSM France": lyrOSMFrance
    }

    objOverlay = {
        // "Kiosk": lyrKio,
        "People committee": lyrPeopleComittee,
        "WTP": lyrWtp
    }


    //  **********  Control Initialization  **********
    ctlScale = L.control.scale({imperial: false}).addTo(mymap);
    ctlLayers = L.control.layers(objBase, objOverlay, {collapsed: true}).addTo(mymap);
    ctlSidebar = L.control.sidebar('sidebar', {
        position: 'left'
    }).addTo(mymap)

    // ctlSidebar.show()

    ctlEasyButton = L.easyButton('fas fa-exchange-alt', () => {
        ctlSidebar.toggle();
    }).addTo(mymap)

    // Handler event
    $('#btnOverlayToggle').click(function() {
        $('#svgOverlayGroup').toggle();
    })

    $('#btnBasemapToggle').click(function() {
        $('#svgBasemapGroup').toggle();
    })

    // HANDLER EVENT
    mymap.on('mousemove', (e) => {
        $('#txtMouseLocation').html(setLL(e));
    })
    $('#txtZoomLevel').html(mymap.getZoom());
    mymap.on('zoomend', e => {
        $('#txtZoomLevel').html(mymap.getZoom());
    })

    // Status Browser
    if(isOnline()) {
        $('#txtStatusBrowser').html('Online');
    } else {
        $('#txtStatusBrowser').html('Offline');
    } 
    
    // LOCATE
    var featureCollect = L.layerGroup();
    mymap.on('locationfound', e => {
        featureCollect.clearLayers();
        // console.log(e);
        var ll = e.latlng;
        L.marker(ll, {icon: icnLocate}).addTo(featureCollect);
        L.circleMarker(ll, {radius:30, color: 'red'}).addTo(featureCollect);
        mymap.flyTo(ll, 18);
        featureCollect.addTo(mymap);        
    })

    mymap.on('locationerror', e => {
        console.log('Not found your location!');
    })

    $('#btnLocate').click(() => {
        if($('#btnLocate').html() == 'Locate') {
            mymap.locate();
            $('#btnLocate').html('Remove Locate');
        } else {
            mymap.removeLayer(featureCollect);
            $('#btnLocate').html('Locate');
        }
    })

})


    
function setLL(ll){
    var strLL = '[' + ll.latlng.lat.toFixed(5) + ';' + ll.latlng.lng.toFixed(5) + ']';
    return strLL;
}

//  **********  Function Initialization  **********
function styleProvince(jsn) {
    return {color: '#636363', weight: 2}
}

function styleKio(jsn,ll) {
    var att = jsn.properties;
    var strPopup = '<div class="divPopupKiosk">'
    + '<div class="divPopupKiosk__img"><image class="kioskImg" src="./assets/img/view1.jpg"></image></div>'
    + '<div class="divPopupKiosk__img"><image class="kioskImg" src="./assets/img/view2.jpg"></image></div>'
    + '<div class="divPopupKiosk__img"><image class="kioskImg" src="./assets/img/view1.jpg"></image></div>'
    + '<div class="divPopupKiosk__rightIcon" onclick="plusSlides(1)"><i class="fas fa-chevron-right"></i></div>'
    + '<div class="divPopupKiosk__leftIcon" onclick="minusSlides(1)"><i class="fas fa-chevron-left"></i> </div>'
    + '<h3 class="txtKiosk">' + att.Ten + '</h3>'
    + '<p class="contentKiosk">' + att.Address +'</p>'
    +'</div>';
    var lyr = L.marker(ll, {icon: icnKio});
    
    lyr.bindPopup(strPopup).on('popupopen', () => {
        showSlides(slideIndex);
    });
    return lyr;
}


function styleDistrict(jsn) {
    var att = jsn.properties;
    var clr;
    switch(att.VARNAME_2) {
        case "Chau Thanh":
            clr = '#d7191c';
            break;
        case "Chau Thanh A":
            clr = '#ea633e';
            break;
        case "Long My":
            clr = '#fdae61';
            break;
        case "Long My(TX)":
            clr = '#fed790';
            break;
        case "Nga Bay":
            clr = '#ffffbf';
            break;
        case "Phung Hiep":
            clr = '#d5eeb2';
            break;
        case "Vi Thanh":
            clr = '#abdda4';
            break;
        case "Vi Thuy":
            clr = '#6bb0af';
            break;
    }
    return {color: clr, fillOpacity: 0.5, weight: 1};
}

function styleComm(jsn) {
    return {color: '#838383', fill: false, weight: 0.5, dashArray: '5,1,5'}
}

function styleHamlet(jsn, ll) {
    return L.circleMarker(ll, {color: '#ff2929', radius: 1, fillOpacity: 1})
}

function styleWtp(jsn, ll) {
    var att = jsn.properties;
    var icn;
    if(att.Sources == 'Nước Mặt') {
        icn = icnSW;
    } else {
        icn = icnGW;
    };

    return L.marker(ll, {icon: icn}).bindPopup('<div class="wtpPopup"><h3>'+att.Name +'</h3><p>Year Built: ' + att.Years + '</p><p>Design Capacity: ' +att.Capacity + ' m3/d</p><p>Technology: '+att.Technology+'</p></div>');
}

function stylePeopleCommittee(jsn, ll) {
    var att = jsn.properties;
    var icn;
    if(att.Level == "0") {
        icn = returnIcnStart([25,25])
    } else {
        icn = returnIcnStart([15,15])
    };
    return L.marker(ll,{icon: icn}).bindPopup('<div class="peopleCommitteePopup">'+att.Name+'</div>');
}

function plusSlides(n) {
    showSlides(slideIndex+=1);
}

function minusSlides(n) {
    showSlides(slideIndex -=1);
}

function showSlides(n) {
    var slides = document.getElementsByClassName("divPopupKiosk__img");
    var iconSlideRight = document.getElementsByClassName('divPopupKiosk__rightIcon');
    var iconSlideLeft = document.getElementsByClassName('divPopupKiosk__leftIcon');
    for(var i=0; i<slides.length; i++) {
        slides[i].style.display = "none";
    }

    if(n == 1) {
        iconSlideLeft[0].style.display = "none";
    } else if(n == 3) {
        iconSlideRight[0].style.display = "none";
    } else {
        iconSlideLeft[0].style.display = "block";
        iconSlideRight[0].style.display = "block";
    }

    slides[n-1].style.display = "block";
}

function isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}



function returnIcnStart(size) {
    return icnStart = L.icon({iconUrl: './assets/img/People_Comittee.png',iconSize: size})
}

function isOnline() {
    return navigator.onLine;
}