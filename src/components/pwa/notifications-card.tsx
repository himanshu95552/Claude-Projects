"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function NotificationsCard() {
  const [supported, setSupported] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window);
    fetch("/api/push/subscribe")
      .then((r) => r.json())
      .then((data) => setConfigured(data.configured));

    navigator.serviceWorker?.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setSubscribed(Boolean(sub))),
    );
  }, []);

  async function handleSubscribe() {
    setBusy(true);
    try {
      const { publicKey } = await (await fetch("/api/push/subscribe")).json();
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setSubscribed(true);
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <Card>
      <CardBody className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Push notifications</h2>
          <Badge tone={subscribed ? "success" : "neutral"}>{subscribed ? "enabled" : "off"}</Badge>
        </div>
        {configured ? (
          !subscribed && (
            <>
              <p className="text-xs text-muted">Get a notification when your daily queue is ready.</p>
              <Button size="sm" onClick={handleSubscribe} disabled={busy}>Enable notifications</Button>
            </>
          )
        ) : (
          <p className="text-xs text-muted">
            Push isn&apos;t configured on this deployment yet — an admin needs to set VAPID_PUBLIC_KEY /
            VAPID_PRIVATE_KEY. See docs/SETUP.md.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
