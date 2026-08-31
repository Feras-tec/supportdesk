import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getTicketById, updateTicket } from "../services/api";
import TicketSelect from "../components/TicketSelect";

const ticketSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 characters"),

  message: z.string().min(5, "Message must contain at least 5 characters"),

  email: z.string().email("Please enter a valid email"),

  status: z.enum(["open", "in-progress", "closed"]),

  priority: z.enum(["low", "medium", "high"]),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const statusOptions = [
  {
    value: "open",
    label: "Open",
    badgeClass: "badge-warning",
  },
  {
    value: "in-progress",
    label: "In Progress",
    badgeClass: "badge-info",
  },
  {
    value: "closed",
    label: "Closed",
    badgeClass: "badge-success",
  },
];

const priorityOptions = [
  {
    value: "low",
    label: "Low",
    badgeClass: "badge-success",
  },
  {
    value: "medium",
    label: "Medium",
    badgeClass: "badge-warning",
  },
  {
    value: "high",
    label: "High",
    badgeClass: "badge-error",
  },
];

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),

    defaultValues: {
      title: "",
      message: "",
      email: "",
      status: "open",
      priority: "medium",
    },
  });

  const ticketQuery = useQuery({
    queryKey: ["ticket", id],

    queryFn: () => getTicketById(id!),

    enabled: Boolean(id),
  });

  useEffect(() => {
    if (ticketQuery.data?.data) {
      const ticket = ticketQuery.data.data;

      reset({
        title: ticket.title,
        message: ticket.message,
        email: ticket.email,
        status: ticket.status,
        priority: ticket.priority,
      });
    }
  }, [ticketQuery.data, reset]);

  const mutation = useMutation({
    mutationFn: (data: TicketFormData) => updateTicket(id!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["ticket", id],
      });

      navigate(`/tickets/${id}`);
    },
  });

  const onSubmit = (data: TicketFormData) => {
    mutation.mutate(data);
  };

  if (ticketQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (ticketQuery.isError) {
    return <div className="alert alert-error">Failed to load ticket.</div>;
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
      className="mx-auto w-full max-w-3xl"
    >
      {/* Header */}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(`/tickets/${id}`)}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to Ticket
        </button>

        <h1 className="text-2xl font-bold sm:text-3xl">Edit Ticket</h1>

        <p className="mt-1 text-base-content/60">Update ticket information</p>
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
        {/* Title */}

        <div>
          <label className="label">
            <span className="label-text font-medium">Title</span>
          </label>

          <input
            {...register("title")}
            type="text"
            className={`input input-bordered w-full transition ${
              errors.title ? "input-error" : ""
            }`}
          />

          {errors.title && (
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
              {errors.title.message}
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

        {/* Message */}

        <div>
          <label className="label">
            <span className="label-text font-medium">Message</span>
          </label>

          <textarea
            {...register("message")}
            className={`textarea textarea-bordered min-h-36 w-full transition ${
              errors.message ? "textarea-error" : ""
            }`}
          />

          {errors.message && (
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
              {errors.message.message}
            </motion.p>
          )}
        </div>

        {/* Status + Priority */}

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TicketSelect
                label="Status"
                value={field.value}
                onChange={field.onChange}
                options={statusOptions}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TicketSelect
                label="Priority"
                value={field.value}
                onChange={field.onChange}
                options={priorityOptions}
              />
            )}
          />
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
            Failed to update ticket.
          </motion.div>
        )}

        <div className="divider" />

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={() => navigate(`/tickets/${id}`)}
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

export default EditTicket;
