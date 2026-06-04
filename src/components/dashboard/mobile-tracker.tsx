"use client";

import { Smartphone, Wifi } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MobileTracker() {
  const [peerId, setPeerId] = useState("AURA-DEMO");
  const [status, setStatus] = useState("Ready");

  async function startPeer() {
    try {
      setStatus("Connecting");
      const { Peer } = await import("peerjs");
      const peer = new Peer();
      peer.on("open", (id) => {
        setPeerId(id);
        setStatus("Live");
        toast.success("Mobile tracker session started.");
      });
      peer.on("connection", (connection) => {
        connection.on("data", async (data) => {
          await fetch("/api/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          }).catch(() => undefined);
        });
      });
    } catch {
      setStatus("Demo");
      toast.info("PeerJS is ready after dependencies are installed.");
    }
  }

  return (
    <div className="glass-surface rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="cyan">{status}</Badge>
          <h2 className="mt-3 font-display text-xl font-semibold text-white">Mobile Tracker</h2>
          <p className="mt-2 text-sm leading-6 text-muted">PeerJS sync code for realtime steps and active minutes.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400/15 text-cyan-100">
          <Smartphone className="h-5 w-5" aria-hidden />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/55 p-4 font-mono text-lg text-white">
        {peerId}
      </div>
      <Button className="mt-4 w-full" variant="secondary" onClick={() => void startPeer()}>
        <Wifi className="h-4 w-4" aria-hidden />
        Start sync
      </Button>
    </div>
  );
}
