////////////////////////////////////////////////////////////////////////
///////////////////////////// VERY IMPORTANT ///////////////////////////
////////////////////////////////////////////////////////////////////////
// (.document) and (.navigator) can only be accessed by node (normal javascript)
//
//  (require) can only be access by web (app.js)
        // in order to use require, one needs to browserify the javascript file
        // a bundle.js file is created (has to be added using a script)
        // command: browserify videoServer.js -o bundle.js
        // source: https://scotch.io/tutorials/getting-started-with-browserify
////////////////////////////////////////////////////////////////////////


// Get access to the camera and video!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
    //This is used for Signaling the Peer    
        const signalhub = require("signalhub");
        const createSwarm = require("webrtc-swarm");
    //Creates the Signal rub running in the mentioned port
        const hub = signalhub('videochat', ['https://realworldone-test.herokuapp.com']);
        const swarm = createSwarm(hub, {
            stream: stream
        });

        var first = document.getElementById('video1');
        var second = document.getElementById('video2');
        // First user to get to this route is always video1 (left side)
        first.srcObject = stream;
        first.play(); 

        swarm.on('connect', function (peer, id) {  
            peer.on('data', function (data) {
                data = JSON.parse(data.toString())
            })
            second.srcObject = stream;
            second.play(); 
        })
    // //On webRTC Disconnets
    //     swarm.on('disconnect', function (peer, id) {
    //             players[id].element.parentNode.removeChild(players[id].element)
    //             delete players[id]
    //     })
    
        setInterval(function () {
            console.log("Interval Call");
        
            const youString = JSON.stringify(first)
            swarm.peers.forEach(function (peer) {
                peer.send(youString)
            })
        }, 100)
    });
}