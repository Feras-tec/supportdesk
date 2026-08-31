import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getUsers } from "../services/api";
import type { User } from "../types/user";

function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-error">Failed to load users.</div>;
  }

  const users: User[] = data?.data ?? [];

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost btn-sm mb-3"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">Users</h1>

          <p className="mt-1 text-base-content/60">Manage SupportDesk users</p>
        </div>

        <Link
          to="/users/create"
          className="btn btn-primary w-full shadow sm:w-auto"
        >
          + New User
        </Link>
      </div>

      {/* Summary */}

      <div className="mb-5">
        <div className="badge badge-lg badge-secondary">
          {users.length} Users
        </div>
      </div>

      {/* Search */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.1,
        }}
        className="mb-6 rounded-box border border-base-300 bg-base-100 p-4 shadow"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Search Users</h2>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSearch("")}
          >
            Reset
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </motion.div>

      {/* Mobile Cards */}

      <div className="space-y-4 md:hidden">
        {filteredUsers.map((user, index) => (
          <motion.button
            type="button"
            key={user._id}
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
              delay: 0.15 + index * 0.05,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => navigate(`/users/${user._id}`)}
            className="
              w-full
              rounded-box
              border
              border-base-300
              bg-base-100
              p-4
              text-left
              shadow
              transition-shadow
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-primary">
                  {user.name}
                </h3>

                <p className="mt-1 break-all text-sm text-base-content/60">
                  {user.email}
                </p>
              </div>

              <span className="text-base-content/40">→</span>
            </div>

            <div className="my-4 h-px bg-base-300" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/50">Created</span>

              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Desktop Table */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: 0.2,
        }}
        className="
          hidden
          overflow-x-auto
          rounded-box
          border
          border-base-300
          bg-base-100
          shadow
          md:block
        "
      >
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: 0.25 + index * 0.04,
                }}
                whileHover={{
                  scale: 1.005,
                }}
                className="
                  cursor-pointer
                  transition-colors
                  hover:bg-base-200
                "
                onClick={() => navigate(`/users/${user._id}`)}
              >
                <td className="font-medium">
                  <span className="link link-primary">{user.name}</span>
                </td>

                <td>{user.email}</td>

                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Empty State */}

      {filteredUsers.length === 0 && (
        <div className="mt-6 rounded-box border border-base-300 bg-base-100 p-8 text-center shadow">
          <h3 className="text-lg font-semibold">No users found</h3>

          <p className="mt-1 text-base-content/60">
            Try another search or create a new user.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default Users;
