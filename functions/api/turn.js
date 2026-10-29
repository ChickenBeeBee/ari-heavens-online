export async function onRequestGet({ env }) {
  const ident = env.XIRSYS_IDENT;
  const secret = env.XIRSYS_SECRET;
  const channel = env.XIRSYS_CHANNEL;

  if (!ident || !secret || !channel) {
    return Response.json(
      { error: "Xirsys settings are missing on the hosting platform." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const auth = btoa(`${ident}:${secret}`);
    const url = `https://global.xirsys.net/_turn/${encodeURIComponent(channel)}?webrtc=1&expire=3600`;
    const upstream = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });

    const body = await upstream.json();
    const iceServers = body?.v?.iceServers;

    if (!upstream.ok || body?.s !== "ok" || !Array.isArray(iceServers) || iceServers.length === 0) {
      // Do not log or return secrets or the upstream authorization header.
      return Response.json(
        { error: "Xirsys did not return ICE server credentials." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    // The game client expects the /api/turn response body to be the ICE server array.
    return Response.json(iceServers, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return Response.json(
      { error: "Unable to retrieve TURN credentials." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
