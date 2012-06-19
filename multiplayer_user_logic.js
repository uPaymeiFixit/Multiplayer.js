var cID = [], client = [], sID = [];

function connect(data, socketid){
	cID[socketid] = client.push(data)-1;
	sID.push(socketid);
}

function message(data, socketid){
	client[cID[socketid]] = data;
}

function disconnect(socketid){
	client.splice(cID[socketid],1);
	sID.splice(cID[socketid],1);
	var n = cID[socketid];
	delete cID[socketid];
	for (var i = n; i < sID.length; i++) {
		--cID[sID[i]];
	}
}


connect("start13",13);
connect("start42",42);
connect("start19",19);
connect("start20",20);


message("test13",13);
message("test42",42);
message("test19",19);
message("test20",20);

disconnect(42);

var cID = [],
	client = ["start13", "start42", "start19", "start20"],
 	sID = [13, 42, 19, 20],
cID[13]=0;cID[42]=1;cID[19]=2;cID[20]=3;