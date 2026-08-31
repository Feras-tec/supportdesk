const API_URL = import.meta.env.VITE_API_URL;

export interface TicketQuery {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getTickets(params: TicketQuery = {}) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.priority) {
    searchParams.set("priority", params.priority);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const response = await fetch(`${API_URL}/tickets${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}
export interface CreateTicketData {
  title: string;
  message: string;
  email: string;
  status?: string;
  priority?: string;
}

export async function createTicket(data: CreateTicketData) {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  return response.json();
}
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
export async function getTicketById(id: string) {
  const response = await fetch(`${API_URL}/tickets/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
}
export interface UpdateTicketData {
  title: string;
  message: string;
  email: string;
  status: string;
  priority: string;
}

export async function updateTicket(id: string, data: UpdateTicketData) {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update ticket");
  }

  return response.json();
}
export async function deleteTicket(id: string) {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete ticket");
  }

  return response.json();
}
export interface CreateUserData {
  name: string;
  email: string;
}

export async function createUser(data: CreateUserData) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}
export async function getUserById(id: string) {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
export interface UpdateUserData {
  name: string;
  email: string;
}

export async function updateUser(id: string, data: UpdateUserData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}
export async function deleteUser(id: string) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}
