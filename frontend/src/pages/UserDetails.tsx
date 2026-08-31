import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { deleteUser, getUserById } from "../services/api";
import type { User } from "../types/user";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      navigate("/users");
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-error">Failed to load user.</div>;
  }

  const user: User | undefined = data?.data;

  if (!user) {
    return <div className="alert alert-warning">User not found.</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="mx-auto w-full max-w-4xl"
    >
      {/* Header */}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to Users
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
              {user.name}
            </h1>

            <p className="mt-1 text-base-content/60">User details</p>
          </div>

          {/* Actions */}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              type="button"
              className="btn btn-primary w-full sm:w-auto sm:min-w-24"
              onClick={() => navigate(`/users/${user._id}/edit`)}
            >
              Edit
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              type="button"
              className="btn btn-error w-full sm:w-auto sm:min-w-24"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Delete Error */}

      {deleteMutation.isError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="alert alert-error mb-4"
        >
          Failed to delete user.
        </motion.div>
      )}

      {/* Details Card */}

      <motion.div
        whileHover={{
          y: -3,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          rounded-box
          border
          border-base-300
          bg-base-100
          p-4
          shadow
          transition-shadow
          hover:shadow-lg
          sm:p-6
        "
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Name */}

          <div className="min-w-0">
            <p className="text-sm text-base-content/60">Name</p>

            <p className="mt-1 wrap-break-word text-lg font-semibold">
              {user.name}
            </p>
          </div>

          {/* Email */}

          <div className="min-w-0">
            <p className="text-sm text-base-content/60">Email</p>

            <p className="mt-1 break-all font-medium">{user.email}</p>
          </div>

          {/* Created */}

          <div>
            <p className="text-sm text-base-content/60">Created</p>

            <p className="mt-1 font-medium">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Updated */}

          <div>
            <p className="text-sm text-base-content/60">Last Updated</p>

            <p className="mt-1 font-medium">
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserDetails;
