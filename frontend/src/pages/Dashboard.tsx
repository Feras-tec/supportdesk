import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getTickets, getUsers } from "../services/api";
import type { Ticket } from "../types/ticket";

function Dashboard() {
  const navigate = useNavigate();

  const ticketsQuery = useQuery({
    queryKey: ["tickets", "dashboard"],
    queryFn: () =>
      getTickets({
        sort: "newest",
        page: 1,
        limit: 10,
      }),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  if (ticketsQuery.isLoading || usersQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (ticketsQuery.isError || usersQuery.isError) {
    return (
      <div className="alert alert-error">Failed to load dashboard data.</div>
    );
  }

  const tickets: Ticket[] = ticketsQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];

  const totalTickets = ticketsQuery.data?.total ?? tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress",
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "closed",
  ).length;

  const recentTickets = tickets.slice(0, 5);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-1 text-base-content/60">SupportDesk overview</p>
      </motion.div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -7,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            delay: 0.05,
          }}
          onClick={() => navigate("/tickets")}
          className="
            stat
            cursor-pointer
            rounded-box
            border
            border-primary/20
            bg-primary/10
            shadow
            transition-shadow
            hover:shadow-xl
          "
        >
          <div className="stat-title">Total Tickets</div>

          <div className="stat-value text-primary">{totalTickets}</div>

          <div className="stat-desc">All support tickets</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -7,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            delay: 0.1,
          }}
          onClick={() => navigate("/tickets?status=open")}
          className="
            stat
            cursor-pointer
            rounded-box
            border
            border-warning/30
            bg-warning/10
            shadow
            transition-shadow
            hover:shadow-xl
          "
        >
          <div className="stat-title">Open</div>

          <div className="stat-value text-warning">{openTickets}</div>

          <div className="stat-desc">Waiting for support</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -7,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            delay: 0.15,
          }}
          onClick={() => navigate("/tickets?status=in-progress")}
          className="
            stat
            cursor-pointer
            rounded-box
            border
            border-info/30
            bg-info/10
            shadow
            transition-shadow
            hover:shadow-xl
          "
        >
          <div className="stat-title">In Progress</div>

          <div className="stat-value text-info">{inProgressTickets}</div>

          <div className="stat-desc">Currently being handled</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -7,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            delay: 0.2,
          }}
          onClick={() => navigate("/tickets?status=closed")}
          className="
            stat
            cursor-pointer
            rounded-box
            border
            border-success/30
            bg-success/10
            shadow
            transition-shadow
            hover:shadow-xl
          "
        >
          <div className="stat-title">Closed</div>

          <div className="stat-value text-success">{closedTickets}</div>

          <div className="stat-desc">Resolved tickets</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -7,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            delay: 0.25,
          }}
          onClick={() => navigate("/users")}
          className="
            stat
            cursor-pointer
            rounded-box
            border
            border-secondary/20
            bg-secondary/10
            shadow
            transition-shadow
            hover:shadow-xl
          "
        >
          <div className="stat-title">Users</div>

          <div className="stat-value text-secondary">{users.length}</div>

          <div className="stat-desc">Registered users</div>
        </motion.div>
      </div>

      {/* Recent Tickets */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: 0.35,
        }}
        className="mt-8"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Recent Tickets</h2>

            <p className="text-sm text-base-content/60">
              Latest support requests
            </p>
          </div>

          <Link to="/tickets" className="btn btn-ghost btn-sm">
            View All
          </Link>
        </div>

        {/* Mobile Cards */}

        <div className="space-y-4 md:hidden">
          {recentTickets.map((ticket, index) => (
            <motion.button
              type="button"
              key={ticket._id}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
                delay: 0.4 + index * 0.05,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => navigate(`/tickets/${ticket._id}`)}
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
                <h3 className="min-w-0 truncate font-bold text-primary">
                  {ticket.title}
                </h3>

                <span className="text-base-content/40">→</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`badge ${getStatusBadge(ticket.status)}`}>
                  {ticket.status}
                </span>

                <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-base-content/50">Created</span>

                <span className="font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow md:block">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {recentTickets.map((ticket, index) => (
                <motion.tr
                  key={ticket._id}
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
                    delay: 0.4 + index * 0.05,
                  }}
                  className="
                    cursor-pointer
                    transition-colors
                    hover:bg-base-200
                  "
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <td>
                    <span className="link link-primary font-medium">
                      {ticket.title}
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${getPriorityBadge(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentTickets.length === 0 && (
          <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center text-base-content/60 shadow">
            No tickets found.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
