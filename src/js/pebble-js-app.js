var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
var load = 0;
var host = JSON.parse(localStorage.getItem('host')) || [];
var user = JSON.parse(localStorage.getItem('host')) || [];
var pass = JSON.parse(localStorage.getItem('host')) || [];
var auth = JSON.parse(localStorage.getItem('host')) || [];

function HTTPGET(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	if (auth){
		req.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass)); 
	}
	req.send(null);
	if (req.status == 200) {
		load = 1;
		return req.responseText;
	}
}

function Pad(n){
  return n<10 ? '0'+n : n
}

function Plural(n){
  return n>1 ? 's ' : ' '
}

function Uptime(value){
  uptimetext='';
  years = Math.floor(value / 31556926);
  rest = value % 31556926;
  days = Math.floor( rest / 86400);
  rest = value % 86400;
  hours = Math.floor(rest / 3600);
  rest = value % 3600;
  minutes = Math.floor(rest / 60);
  seconds = Math.floor(rest % 60);
  if ( years != 0 ) { uptimetext += uptimetext + years + " year" + Plural(years) }
  if ( ( years != 0 ) || ( days != 0) ) { uptimetext += days + " day" + Plural(days)}
  if ( ( days != 0 ) || ( hours != 0) ) { uptimetext += Pad(hours) + " hour" + Plural(hours)}
  uptimetext += Pad(minutes) + " minute" + Plural(minutes);
  uptimetext += Pad(seconds) + " second" + Plural(seconds);
  return uptimetext;
}

function KMG(value, initPre){
  unit = 1024;
  prefix = "kMGTPE";
  if (initPre){
    value *= Math.pow(unit,prefix.indexOf(initPre)+1);
  }
  try {
    if (Math.abs(value) < unit) { return value + "B" };
    exp = Math.floor(Math.log(Math.abs(value)) / Math.log(unit));
    pre = prefix.charAt(exp-1);
    return (value / Math.pow(unit, exp)).toFixed(2) + pre + "B";
  }
  catch (e) {
    return "Error"
  }
}

function Percent(value,total){
  return (100*value/total).toFixed(2);
}

var getData = function() {
	var response = HTTPGET(host + "/dynamic.json");
	var dynamic_json = JSON.parse(response);

	var response = HTTPGET(host + "/static.json");
	var static_json = JSON.parse(response);

	
	var loads = "Loads: " + dynamic_json.load1 + " - " + dynamic_json.load5 + " - " + dynamic_json.load15;
	var cpu_frecuency = "CPU frequency: " + dynamic_json.cpu_frequency + "MHz";
	var cpu_voltage = "Voltage: " + dynamic_json.cpu_voltage + "V";
	var cpu_temperature = "CPU Temperature: " + dynamic_json.soc_temp + "\u00B0C";	
	var uptime = "Uptime: " + Uptime(dynamic_json.uptime);
	var cpu = loads + "\n" + cpu_frecuency + "\n" + cpu_voltage + "\n" + cpu_temperature + "\n" + uptime;

	var memory_total = "Total: " + KMG(static_json.memory_total, "M");
	var memory_available = "Available: " + KMG(dynamic_json.memory_available, "M");
	var memory_percent = Percent((static_json.memory_total-dynamic_json.memory_available), static_json.memory_total) ;
	var memory_used = "Used: " + KMG((static_json.memory_total-dynamic_json.memory_available), "M") + " (" + memory_percent + "%)";
	var memory = memory_used + "\n" + memory_available + "\n" + memory_total;

	var swap_free = "Free: " + KMG((static_json.swap_total-dynamic_json.swap_used), "M");
	var swap_percent = (Percent(dynamic_json.swap_used, static_json.swap_total) == "NaN") ? 0 : Percent(dynamic_json.swap_used, static_json.swap_total);
	var swap_used = "Used: " + KMG(dynamic_json.swap_used, "M") + " (" + swap_percent + "%)";
	var swap_total = "Total: " + KMG(static_json.swap_total, "M");
	var swap = swap_used + "\n" + swap_free + "\n" + swap_total;

	var sdcard_total = "Total: " + KMG(static_json.sdcard_root_total, "M");
	var sdcard_percent = Percent(dynamic_json.sdcard_root_used, static_json.sdcard_root_total);
	var sdcard_used = "Used: " + KMG(dynamic_json.sdcard_root_used, "M") + " (" + sdcard_percent + "%)";
	var sdcrad_free = "Free: " + KMG((static_json.sdcard_root_total-dynamic_json.sdcard_root_used), "M");
	var sdcard = sdcard_used + "\n" + sdcrad_free + "\n" + sdcard_total;

	var net_send = "Ethernet Sent: " + KMG(dynamic_json.net_send);
	var net_received = "Received: " + KMG(Math.abs(dynamic_json.net_received));
	var net = net_send + "\n" + net_received;

	var processor = static_json.processor;
	var distribution = static_json.distribution;
	var kernel_version = static_json.kernel_version;
	var firmware = "Firmware: " + static_json.firmware;
	var upgrade = "Package(s): " + dynamic_json.upgrade;
	var version = processor + "\n" + distribution + "\n" + kernel_version + "\n" + firmware + "\n" + upgrade;

	var dict = {"OK" : load, "CPU" : cpu, "MEMORY" : memory, "MEMORY_P" : Math.round(memory_percent), "SWAP" : swap, "SWAP_P" : Math.round(swap_percent), "SDCARD" : sdcard, "SDCARD_P" : Math.round(sdcard_percent), "NET" : net, "VERSION" : version};
	
	Pebble.sendAppMessage(dict);
};

Pebble.addEventListener("showConfiguration",
  function(e) {
    Pebble.openURL("http://kropochev.com/pebble/rpi_monitor/index.html");
  }
);

Pebble.addEventListener("webviewclosed",
  function(e) {
    options = JSON.parse(decodeURIComponent(e.response));
    localStorage.setItem('host', JSON.stringify(options.host));
  }
);

Pebble.addEventListener("ready", function(e) {
		"use strict";
		if (host) {
			//console.log(host);
			getData();
		};
	
});