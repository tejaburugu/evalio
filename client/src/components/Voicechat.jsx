import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

export default function VoiceChat({ roomId, username }) {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef([]);
  const audioRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      // Play your own stream (optional mute)
      audioRef.current.srcObject = stream;
      audioRef.current.muted = true;

      socketRef.current.emit("join-voice", { roomId, username });

      socketRef.current.on("all-users", (users) => {
        const peersArr = [];
        users.forEach((userId) => {
          const peer = createPeer(userId, socketRef.current.id, stream);
          peersRef.current.push({ peerID: userId, peer });
          peersArr.push(peer);
        });
        setPeers(peersArr);
      });

      socketRef.current.on("user-joined", (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({ peerID: payload.callerID, peer });
        setPeers((prev) => [...prev, peer]);
      });

      socketRef.current.on("receiving-returned-signal", (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending-signal", { userToSignal, callerID, signal });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning-signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div className="bg-gray-900 text-white p-3 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">🎤 Voice Chat</h3>
      <audio ref={audioRef} autoPlay />
      {peers.map((peer, index) => (
        <AudioPlayer key={index} peer={peer} />
      ))}
    </div>
  );
}

function AudioPlayer({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <audio playsInline autoPlay ref={ref} />;
}
