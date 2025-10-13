export const buscarUsuarios = async (token, query) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/buscar/?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Error al buscar usuarios");
  return await res.json();
};

export const enviarSolicitud = async (token, usuarioId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/enviar/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario_recibe: usuarioId }),
    }
  );
  if (!res.ok) throw new Error("Error al enviar solicitud");
  return await res.json();
};

export const responderSolicitud = async (token, solicitudId, respuesta) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/responder/${solicitudId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ respuesta }),
    }
  );
  if (!res.ok) throw new Error("Error al responder solicitud");
  return await res.json();
};

export const listarAmigos = async (token) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/lista/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Error al listar amigos");
  return await res.json();
};

export const solicitudesPendientesRecibidas = async (token) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/pendientes/recibidas/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Error al cargar solicitudes recibidas");
  return await res.json();
};

export const solicitudesPendientesEnviadas = async (token) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/amistades/pendientes/enviadas/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Error al cargar solicitudes enviadas");
  return await res.json();
};
