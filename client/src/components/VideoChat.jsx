// // client/src/components/VideoChat.jsx
// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import SimplePeer from "simple-peer";

// export default function VideoChat({ roomId }) {
//   const [peers, setPeers] = useState([]);
//   const socketRef = useRef();
//   const userVideo = useRef();
//   const peersRef = useRef([]);

//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000");

//     // get local media (video + audio)
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         userVideo.current.srcObject = stream;
//         userVideo.current.muted = true;

//         socketRef.current.emit("join-media", { roomId });

//         socketRef.current.on("all-users", (users) => {
//           const peersArr = [];
//           users.forEach((userId) => {
//             const peer = createPeer(userId, socketRef.current.id, stream);
//             peersRef.current.push({ peerID: userId, peer });
//             peersArr.push({ peerID: userId, peer });
//           });
//           setPeers(peersArr);
//         });

//         socketRef.current.on("user-joined", (payload) => {
//           const peer = addPeer(payload.signal, payload.callerID, stream);
//           peersRef.current.push({ peerID: payload.callerID, peer });
//           setPeers((prev) => [...prev, { peerID: payload.callerID, peer }]);
//         });

//         socketRef.current.on("receiving-returned-signal", (payload) => {
//           const item = peersRef.current.find((p) => p.peerID === payload.id);
//           item?.peer.signal(payload.signal);
//         });

//         socketRef.current.on("user-left", (id) => {
//           const peerObj = peersRef.current.find((p) => p.peerID === id);
//           if (peerObj) peerObj.peer.destroy();
//           peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
//           setPeers((prev) => prev.filter((p) => p.peerID !== id));
//         });
//       });

//     return () => socketRef.current.disconnect();
//   }, [roomId]);

//   function createPeer(userToSignal, callerID, stream) {
//     const peer = new SimplePeer({ initiator: true, trickle: false, stream });
//     peer.on("signal", (signal) => {
//       socketRef.current.emit("sending-signal", { userToSignal, callerID, signal });
//     });
//     return peer;
//   }

//   function addPeer(incomingSignal, callerID, stream) {
//     const peer = new SimplePeer({ initiator: false, trickle: false, stream });
//     peer.on("signal", (signal) => {
//       socketRef.current.emit("returning-signal", { signal, callerID });
//     });
//     peer.signal(incomingSignal);
//     return peer;
//   }

//   return (
//     <div className="flex flex-wrap gap-2 p-2 bg-gray-900">
//       <video
//         ref={userVideo}
//         autoPlay
//         playsInline
//         className="w-1/3 rounded-lg border-2 border-green-600"
//       />
//       {peers.map((p) => (
//         <Video key={p.peerID} peer={p.peer} />
//       ))}
//     </div>
//   );
// }

// function Video({ peer }) {
//   const ref = useRef();

//   useEffect(() => {
//     peer.on("stream", (stream) => {
//       ref.current.srcObject = stream;
//     });
//   }, [peer]);

//   return (
//     <video
//       ref={ref}
//       autoPlay
//       playsInline
//       className="w-1/3 rounded-lg border-2 border-blue-600"
//     />
//   );
// }
// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import SimplePeer from "simple-peer";

// export default function VideoChat({ roomId }) {
//   const [peers, setPeers] = useState([]);
//   const socketRef = useRef();
//   const userVideo = useRef();
//   const peersRef = useRef([]);

//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000");

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // ✅ Show your video locally (bottom-right)
//         userVideo.current.srcObject = stream;
//         userVideo.current.muted = true;

//         // Join the signaling room
//         socketRef.current.emit("join-media", { roomId });

//         // Receive other users
//         socketRef.current.on("all-users", (users) => {
//           const peersArr = [];
//           users.forEach((userID) => {
//             const peer = createPeer(userID, socketRef.current.id, stream);
//             peersRef.current.push({ peerID: userID, peer });
//             peersArr.push({ peerID: userID, peer });
//           });
//           setPeers(peersArr);
//         });

//         // When new user joins
//         socketRef.current.on("user-joined", (payload) => {
//           const peer = addPeer(payload.signal, payload.callerID, stream);
//           peersRef.current.push({ peerID: payload.callerID, peer });
//           setPeers((prev) => [...prev, { peerID: payload.callerID, peer }]);
//         });

//         // When we receive answer
//         socketRef.current.on("receiving-returned-signal", (payload) => {
//           const item = peersRef.current.find((p) => p.peerID === payload.id);
//           if (item) item.peer.signal(payload.signal);
//         });

//         // When a user leaves
//         socketRef.current.on("user-left", (id) => {
//           const peerObj = peersRef.current.find((p) => p.peerID === id);
//           if (peerObj) peerObj.peer.destroy();
//           peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
//           setPeers((prev) => prev.filter((p) => p.peerID !== id));
//         });
//       });

//     return () => socketRef.current.disconnect();
//   }, [roomId]);

//   // Create outbound peer connection
//   function createPeer(userToSignal, callerID, stream) {
//     const peer = new SimplePeer({
//       initiator: true,
//       trickle: false,
//       stream,
//     });
//     peer.on("signal", (signal) => {
//       socketRef.current.emit("sending-signal", { userToSignal, callerID, signal });
//     });
//     return peer;
//   }

//   // Add inbound peer connection
//   function addPeer(incomingSignal, callerID, stream) {
//     const peer = new SimplePeer({
//       initiator: false,
//       trickle: false,
//       stream,
//     });
//     peer.on("signal", (signal) => {
//       socketRef.current.emit("returning-signal", { signal, callerID });
//     });
//     peer.signal(incomingSignal);
//     return peer;
//   }

//   return (
//     <div className="relative h-full w-full bg-[#121212] overflow-hidden">
//       {/* Remote peers grid */}
//       <div className="grid grid-cols-2 gap-2 p-2 h-full">
//         {peers.map((p) => (
//           <Video key={p.peerID} peer={p.peer} />
//         ))}
//       </div>

//       {/* Your own small preview */}
//       <video
//         ref={userVideo}
//         autoPlay
//         playsInline
//         muted
//         className="absolute bottom-4 right-4 w-32 h-24 border-2 border-green-500 rounded-lg shadow-lg"
//       />
//     </div>
//   );
// }

// function Video({ peer }) {
//   const ref = useRef();

//   useEffect(() => {
//     peer.on("stream", (stream) => {
//       ref.current.srcObject = stream;
//     });
//   }, [peer]);

//   return (
//     <video
//       ref={ref}
//       autoPlay
//       playsInline
//       className="w-full h-full object-cover rounded-lg border-2 border-blue-500"
//     />
//   );
// }
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

/**
 * VideoChat Component — handles peer-to-peer video/audio calling using WebRTC + Socket.IO
 */
export default function VideoChat({ roomId }) {
  const socketRef = useRef();
  const userVideoRef = useRef();
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    // ✅ Connect to signaling server
    socketRef.current = io("http://localhost:5000");

    // ✅ Ask for media permissions
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display your own video preview (bottom-right corner)
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.muted = true;
        }

        // Join room
        socketRef.current.emit("join-media", { roomId });

        // When you get the list of already connected users
        socketRef.current.on("all-users", (users) => {
          const peersArr = [];
          users.forEach((userId) => {
            const peer = createPeer(userId, socketRef.current.id, stream);
            peersRef.current.push({ peerID: userId, peer });
            peersArr.push({ peerID: userId, peer });
          });
          setPeers(peersArr);
        });

        // When a new user joins
        socketRef.current.on("user-joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({ peerID: payload.callerID, peer });
          setPeers((prev) => [...prev, { peerID: payload.callerID, peer }]);
        });

        // When your offer gets answered
        socketRef.current.on("receiving-returned-signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item) item.peer.signal(payload.signal);
        });

        // When a user disconnects
        socketRef.current.on("user-left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) peerObj.peer.destroy();

          peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
          setPeers((prev) => prev.filter((p) => p.peerID !== id));
        });
      })
      .catch((err) => {
        console.error("Camera/mic permission error:", err);
      });

    return () => {
      socketRef.current.disconnect();
      peersRef.current.forEach(({ peer }) => peer.destroy());
    };
  }, [roomId]);

  // === WebRTC Helper Functions ===
  function createPeer(userToSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending-signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div className="relative w-full h-full bg-[#121212] overflow-hidden">
      {/* Remote users grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 h-full">
        {peers.map(({ peerID, peer }) => (
          <Video key={peerID} peer={peer} />
        ))}
      </div>

      {/* Local preview (bottom-right) */}
      <video
        ref={userVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-4 right-4 w-32 h-24 border-2 border-green-500 rounded-lg shadow-lg bg-black object-cover"
      />
    </div>
  );
}

/**
 * Renders individual remote video stream
 */
function Video({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-full h-full rounded-lg object-cover border-2 border-blue-500"
    />
  );
}
