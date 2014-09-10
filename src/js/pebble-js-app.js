var load = 0;
var host = JSON.parse(localStorage.getItem('host')) || [];

function HTTPGET(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	if (req.status = 200) {
		load = 1;
		return req.responseText;
	};
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
	var swap_percent = Percent(dynamic_json.swap_used, static_json.swap_total);
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
	var upgrade = "Package(s) to be: " + dynamic_json.upgrade;
	var version = processor + "\n" + distribution + "\n" + kernel_version + "\n" + firmware + "\n" + upgrade;

	var dict = {"OK" : load, "CPU" : cpu, "MEMORY" : memory, "MEMORY_P" : Math.round(memory_percent), "SWAP" : swap, "SWAP_P" : Math.round(swap_percent), "SDCARD" : sdcard, "SDCARD_P" : Math.round(sdcard_percent), "NET" : net, "VERSION" : version};

	Pebble.sendAppMessage(dict);
};

Pebble.addEventListener("ready",
	function(e) {
		if (host) {
			console.log(host);
			getData();
		};
	}
);

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