import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { deleteTicket, getTicketById } from "../services/api";
import type { Ticket } from "../types/ticket";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id!),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTicket(id!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      navigate("/tickets");
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
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
    return <div className="alert alert-error">Failed to load ticket.</div>;
  }

  const ticket: Ticket | undefined = data?.data;

  if (!ticket) {
    return <div className="alert alert-warning">Ticket not found.</div>;
  }

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "badge-warning";

      case "in-progress":
        return "badge-info";

      case "closed":
        return "badge-success";

      default:
        return "badge-ghost";
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return "badge-error";

      case "medium":
        return "badge-warning";

      case "low":
        return "badge-success";

      default:
        return "badge-ghost";
    }
  };

  const getStatusLabel = (status: Ticket["status"]) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "open") {
      return "Open";
    }

    return "Closed";
  };

  const getPriorityLabel = (priority: Ticket["priority"]) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

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
          onClick={() => navigate("/tickets")}
          className="btn btn-ghost btn-sm mb-4"
        >
          ← Back to Tickets
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
              {ticket.title}
            </h1>

            <p className="mt-1 text-base-content/60">Ticket details</p>
          </div>

          {/* Desktop / Mobile Actions */}

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
              onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
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
          Failed to delete ticket.
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
          {/* Email */}

          <div className="min-w-0">
            <p className="text-sm text-base-content/60">Email</p>

            <p className="mt-1 break-all font-medium">{ticket.email}</p>
          </div>

          {/* Created */}

          <div>
            <p className="text-sm text-base-content/60">Created</p>

            <p className="mt-1 font-medium">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Status */}

          <div>
            <p className="text-sm text-base-content/60">Status</p>

            <span className={`badge mt-2 ${getStatusBadge(ticket.status)}`}>
              {getStatusLabel(ticket.status)}
            </span>
          </div>

          {/* Priority */}

          <div>
            <p className="text-sm text-base-content/60">Priority</p>

            <span className={`badge mt-2 ${getPriorityBadge(ticket.priority)}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>
        </div>

        <div className="divider" />

        {/* Message */}

        <div>
          <p className="text-sm text-base-content/60">Message</p>

          <div className="mt-2 rounded-box bg-base-200 p-4">
            <p className="wrap-break-word whitespace-pre-wrap leading-relaxed">
              {ticket.message}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TicketDetails;
