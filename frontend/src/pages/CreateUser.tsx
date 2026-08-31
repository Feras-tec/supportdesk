import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { createUser } from "../services/api";

const userSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type UserFormData = z.infer<typeof userSchema>;

function CreateUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),

    defaultValues: {
      name: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      navigate("/users");
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

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
          onClick={() => navigate("/users")}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to Users
        </button>

        <h1 className="text-2xl font-bold sm:text-3xl">Create User</h1>

        <p className="mt-1 text-base-content/60">Add a new SupportDesk user</p>
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
            placeholder="Max Mustermann"
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
            placeholder="max@example.com"
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
            Failed to create user.
          </motion.div>
        )}

        <div className="divider" />

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={() => navigate("/users")}
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
                Creating...
              </>
            ) : (
              "+ Create User"
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default CreateUser;
