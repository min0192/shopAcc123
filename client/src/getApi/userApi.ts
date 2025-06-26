import { User } from "@/types/user";
import axios from "axios";
import { getCookie } from "cookies-next/client";

// Define a type for the data needed to create a user
interface CreateUserPayload {
  name: string;
  email: string;
  password?: string; // Password might be optional depending on your backend logic
  phone?: string;
  balance?: number;
  role?: "user" | "admin" | "seller";
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Define the expected response type for successful login and potentially error responses
type LoginResponse = {
  token?: string; // Token is expected on success
  role?: string; // Role is expected on success
  message?: string; // Message could be success or error message
  // Add other properties returned by your backend on success
};

// Refined custom type guard to check if an error object has a nested message property
function hasMessageProperty(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

// Refined custom type guard to check if an error is like an Axios error with a response containing data and message
function isAxiosErrorLike(
  error: unknown
): error is { response: { data?: { message?: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response: unknown }).response === "object" &&
    (error as { response: unknown }).response !== null &&
    "data" in (error as { response: { data: unknown } }).response &&
    typeof (error as { response: { data: unknown } }).response.data ===
      "object" &&
    (error as { response: { data: unknown } }).response.data !== null
  );
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(`${API_URL}/users/login`, {
      email,
      password,
    });
    return res.data; // res.data should now be of type LoginResponse
  } catch (error: unknown) {
    // Catch as unknown
    let errorMessage = "An unknown error occurred during login.";

    // Check if it's an Axios error with nested data.message
    if (isAxiosErrorLike(error) && error.response.data?.message) {
      // Use optional chaining here
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      // Check if it has a top-level message property
      errorMessage = error.message;
    } else if (typeof error === "string") {
      // Handle case where a string is thrown
      errorMessage = error;
    }

    throw new Error(errorMessage);
  }
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const res = await axios.post(`${API_URL}/users/register`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data: CreateUserPayload) => {
  try {
    const token = getCookie("infor");
    const res = await axios.post(`${API_URL}/users`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: unknown) {
    // Catch as unknown
    let errorMessage = "An unknown error occurred during user creation.";
    if (isAxiosErrorLike(error) && error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
};

export async function getAllUsers() {
  try {
    const token = getCookie("infor");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const params = new URLSearchParams();
    const url = `${API_URL}/users${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred while fetching users.";
    if (isAxiosErrorLike(error) && error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
}

export const getUserProfile = async () => {
  try {
    const res = await axios.get("/api/users/profile");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user: User) => {
  const token = getCookie("infor");
  const res = await fetch(`${API_URL}/users/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...user, id: user._id }),
  });
  let data = null;
  try {
    if (res.headers.get("Content-Type")?.includes("application/json")) {
      data = await res.json();
    }
  } catch (err) {
    console.warn("Không thể parse JSON từ response:", err);
  }

  if (!res.ok) {
    throw new Error(data?.error || "Failed to update product");
  }

  return data?.data || data; 
};

export const deleteUser = async (userId: string) => {
  try {
    const token = getCookie("infor");
    const response = await axios.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    // Catch as unknown
    let errorMessage = "An unknown error occurred during user deletion.";
    if (isAxiosErrorLike(error) && error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
};

export const updateUserProfile = async (data: User) => {
  try {
    const token = getCookie("infor");
    const res = await axios.put(`${API_URL}/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: unknown) {
    // Catch as unknown
    let errorMessage = "An unknown error occurred during profile update.";
    if (isAxiosErrorLike(error) && error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
};

export const updateUserBalance = async (amount: number) => {
  try {
    const token = getCookie("infor"); 
    const res = await axios.put(
      `${API_URL}/users/balance`,
      { amount },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred during balance update.";
    if (isAxiosErrorLike(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (hasMessageProperty(error)) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
};

