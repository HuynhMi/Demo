// DESKTOP
if(!isMobile()) {
    if(confirm("Your device is not a mobile. \n\ Do you want to open the Desktop site?")) {
        window.location.href = "./Desktop/desktop.html";
    }
}

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
    var ctlLocate;
    var ctlHome;
    var objBase;
    var objOverlay;
    var icnKio;
    var icnSW;
    var icnGW;
    var icnStart;
    var icnLocate;
    var slideIndex = 1;
    var jsnKio;
    var jsnWtp;
    var jsnPeopleComittee;
    var jsnHamlet;
    var jsnBrDis;
    var jsnBrComm;
    var jsnBrPro;
    

$(document).ready(() => {
    //  **********  Map Initialization  **********
    mymap = L.map('mymap', {
        center: [9.787807, 105.616158], 
        zoom: 10, 
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
    if(localStorage.getItem('jsnBrPro')) {
        jsnBrPro = JSON.parse(localStorage.getItem('jsnBrPro'));
        lyrBrPro = L.geoJSON(jsnBrPro, {style: styleProvince}).addTo(mymap);
        jsnKio = JSON.parse(localStorage.getItem('jsnKio'));
        lyrKio = L.geoJSON(jsnKio, {pointToLayer: styleKio}).addTo(mymap);
        jsnWtp = JSON.parse(localStorage.getItem('jsnWtp'));
        lyrWtp = L.geoJSON(jsnWtp, {pointToLayer: styleWtp}).addTo(mymap);
        jsnPeopleComittee = JSON.parse(localStorage.getItem('jsnPeopleComittee'));
        lyrPeopleComittee = L.geoJSON(jsnPeopleComittee, {pointToLayer: stylePeopleCommittee}).addTo(mymap);
        jsnHamlet = JSON.parse(localStorage.getItem('jsnHamlet'));
        lyrHamlet = L.geoJSON(jsnHamlet, {pointToLayer: styleHamlet});
        jsnBrDis = JSON.parse(localStorage.getItem('jsnBrDis'));
        lyrBrDis = L.geoJSON(jsnBrDis, {style: styleDistrict}).addTo(mymap);
        jsnBrComm = JSON.parse(localStorage.getItem('jsnBrComm'));
        lyrBrComm = L.geoJSON(jsnBrComm, {style: styleComm}).addTo(mymap);
        alert('Loaded data from localStorage');
    } else {
        refreshData();
        lyrBrPro.addTo(mymap);
        lyrKio.addTo(mymap);
        lyrWtp.addTo(mymap);
        lyrPeopleComittee.addTo(mymap);
        lyrBrDis.addTo(mymap);
        lyrBrComm.addTo(mymap);
        alert('Downloaded data from server');
    }
    
    //  **********  Layer Group  **********
    objBase = {
        "Topo Map": lyrTopo,
        "Osm": lyrOSM,
        "Satellite": lyrSatellite,
        "OSM France": lyrOSMFrance
    }

    objOverlay = {
        "Kiosk": lyrKio,
        "People committee": lyrPeopleComittee,
        "WTP": lyrWtp,
        "Hamlet": lyrHamlet
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

    ctlLocate = L.easyButton('fas fa-map-marker-alt btnLocate', () => {
        // if($('#btnLocate').style.color == 'red')
        var clrBtnLocate = $('.btnLocate').css("color");
        if(clrBtnLocate == 'rgb(0, 0, 0)') {
            $('.btnLocate').css("color", 'red');
            mymap.locate();
        } else {
            $('.btnLocate').css("color", 'black');
            mymap.removeLayer(featureCollect);
        }
    }).addTo(mymap);
    ctlHome = L.easyButton('fas fa-home btnHome', () => {
        mymap.setView([9.787807, 105.616158],10);
    }).addTo(mymap);

    // Handler event: BTN
    $('#btnOverlayToggle').click(function() {
        $('#svgOverlayGroup').toggle();
    })

    $('#btnBasemapToggle').click(function() {
        $('#svgBasemapGroup').toggle();
    })
    $('#btnRefreshData').click(() => {
        if(isOnline()) {
            alert('Refreshing data from server');
            refreshData();
        } else {
            alert('No internet connection is available \n\Try again later when you have a internet connection');
        }
    })
    
    // HANDLER EVENT: MAP
    mymap.on('contextmenu', (e) => {
        $('#txtMouseLocation').html(setLL(e));
    })
    $('#txtZoomLevel').html(mymap.getZoom());
    mymap.on('zoomend', e => {
        $('#txtZoomLevel').html(mymap.getZoom());
    })
    
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
        alert('Not found your location!');
    })

})



function refreshData() {
    // Kiosk
    lyrKio = L.geoJSON.ajax('./assets/data/lyrKiosk.geojson', {
        pointToLayer: styleKio
    });
    
    lyrKio.on('data:loaded', () => {
        jsnKio = lyrKio.toGeoJSON();
        localStorage.setItem('jsnKio', JSON.stringify(jsnKio));
    })
    // wtp
    lyrWtp = L.geoJSON.ajax('./assets/data/lyrWtp.geojson', {
        pointToLayer: styleWtp
    })

    lyrWtp.on('data:loaded', () => {
        jsnWtp = lyrWtp.toGeoJSON();
        localStorage.setItem('jsnWtp', JSON.stringify(jsnWtp));
    })

    lyrPeopleComittee = L.geoJSON.ajax('./assets/data/lyrPeopleComittee.geojson', {
        pointToLayer: stylePeopleCommittee
    })

    lyrPeopleComittee.on('data:loaded', () => {
        jsnPeopleComittee = lyrPeopleComittee.toGeoJSON();
        localStorage.setItem('jsnPeopleComittee', JSON.stringify(jsnPeopleComittee));
    })

    lyrHamlet = L.geoJSON.ajax('./assets/data/lyrHamlet.geojson', {
        pointToLayer: styleHamlet
    })

    lyrHamlet.on('data:loaded', () => {
        jsnHamlet = lyrHamlet.toGeoJSON();
        localStorage.setItem('jsnHamlet', JSON.stringify(jsnHamlet));
    })

    lyrBrDis = L.geoJSON.ajax('./assets/data/lyrBrDistrict.geojson', {
        style: styleDistrict
    })

    lyrBrDis.on('data:loaded', () => {
        jsnBrDis = lyrBrDis.toGeoJSON();
        localStorage.setItem('jsnBrDis', JSON.stringify(jsnBrDis));
    })

    lyrBrComm = L.geoJSON.ajax('./assets/data/lyrBrCommune.geojson', {
        style: styleComm
    })

    lyrBrComm.on('data:loaded', () => {
        jsnBrComm = lyrBrComm.toGeoJSON();
        localStorage.setItem('jsnBrComm', JSON.stringify(jsnBrComm));
    })

    lyrBrPro = L.geoJSON.ajax('./assets/data/lyrBrProvince.geojson', {
        style: styleProvince
    })

    lyrBrPro.on('data:loaded', () => {
        jsnBrPro = lyrBrPro.toGeoJSON();
        localStorage.setItem('jsnBrPro', JSON.stringify(jsnBrPro));
    })


}
    
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
    return L.circleMarker(ll, {color: '#8bf51b', radius: 5, fillColor: '#c6ff8a', weight: 2, dashArray: '3,1,3'})
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