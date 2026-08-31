import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getUserById, updateUser } from "../services/api";

const userSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),

  email: z.string().email("Please enter a valid email"),
});

type UserFormData = z.infer<typeof userSchema>;

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),

    defaultValues: {
      name: "",
      email: "",
    },
  });

  const userQuery = useQuery({
    queryKey: ["user", id],

    queryFn: () => getUserById(id!),

    enabled: Boolean(id),
  });

  useEffect(() => {
    if (userQuery.data?.data) {
      const user = userQuery.data.data;

      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [userQuery.data, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(id!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user", id],
      });

      navigate(`/users/${id}`);
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  if (userQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (userQuery.isError) {
    return <div className="alert alert-error">Failed to load user.</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="mx-auto w-full max-w-2xl"
    >
      {/* Header */}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(`/users/${id}`)}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to User
        </button>

        <h1 className="text-2xl font-bold sm:text-3xl">Edit User</h1>

        <p className="mt-1 text-base-content/60">Update user information</p>
      </div>

      {/* Form */}

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{
          opacity: 0,
          scale: 0.99,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 0.1,
        }}
        className="
          space-y-6
          rounded-box
          border
          border-base-300
          bg-base-100
          p-4
          shadow
          sm:p-6
        "
      >
        {/* Name */}

        <div>
          <label className="label">
            <span className="label-text font-medium">Name</span>
          </label>

          <input
            {...register("name")}
            type="text"
            className={`input input-bordered w-full transition ${
              errors.name ? "input-error" : ""
            }`}
          />

          {errors.name && (
            <motion.p
              initial={{
                opacity: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-1 text-sm text-error"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email */}

        <div>
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>

          <input
            {...register("email")}
            type="email"
            className={`input input-bordered w-full transition ${
              errors.email ? "input-error" : ""
            }`}
          />

          {errors.email && (
            <motion.p
              initial={{
                opacity: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-1 text-sm text-error"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* API Error */}

        {mutation.isError && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="alert alert-error"
          >
            Failed to update user.
          </motion.div>
        )}

        <div className="divider" />

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={() => navigate(`/users/${id}`)}
          >
            Cancel
          </button>

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            type="submit"
            className="btn btn-primary w-full sm:w-auto sm:min-w-36"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default EditUser;
