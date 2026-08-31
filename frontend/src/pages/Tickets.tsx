import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { getTickets } from "../services/api";
import TicketSelect from "../components/TicketSelect";
import type { Ticket } from "../types/ticket";

const statusOptions = [
  {
    value: "",
    label: "All Statuses",
    badgeClass: "badge-ghost",
  },
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
    value: "",
    label: "All Priorities",
    badgeClass: "badge-ghost",
  },
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

const sortOptions = [
  {
    value: "",
    label: "Default Order",
    badgeClass: "badge-ghost",
  },
  {
    value: "newest",
    label: "Newest",
    badgeClass: "badge-info",
  },
  {
    value: "oldest",
    label: "Oldest",
    badgeClass: "badge-neutral",
  },
];

function Tickets() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") ?? "";

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState(initialStatus);

  const [priority, setPriority] = useState("");

  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  /*
    إذا انتقلنا من Dashboard إلى:
    /tickets?status=open

    أو إلى status آخر بينما صفحة Tickets
    ما زالت مفتوحة، نحدّث الفلتر تلقائياً.
  */

  useEffect(() => {
    const currentStatus = searchParams.get("status") ?? "";

    setStatus(currentStatus);
    setPage(1);
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tickets", search, status, priority, sort, page],

    queryFn: () =>
      getTickets({
        search,
        status,
        priority,
        sort,
        page,
        limit,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-error">Failed to load tickets.</div>;
  }

  const tickets: Ticket[] = data?.data ?? [];

  const totalPages = data?.totalPages ?? 1;

  const total = data?.total ?? tickets.length;

  const getStatusBadge = (ticketStatus: Ticket["status"]) => {
    switch (ticketStatus) {
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

  const getPriorityBadge = (ticketPriority: Ticket["priority"]) => {
    switch (ticketPriority) {
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

  const getStatusLabel = (ticketStatus: Ticket["status"]) => {
    if (ticketStatus === "in-progress") {
      return "In Progress";
    }

    if (ticketStatus === "open") {
      return "Open";
    }

    return "Closed";
  };

  const getPriorityLabel = (ticketPriority: Ticket["priority"]) => {
    return ticketPriority.charAt(0).toUpperCase() + ticketPriority.slice(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSort("");
    setPage(1);

    navigate("/tickets");
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
    >
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-ghost btn-sm mb-3"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold sm:text-3xl">Tickets</h1>

          <p className="mt-1 text-base-content/60">Manage support tickets</p>
        </div>

        <Link
          to="/tickets/create"
          className="btn btn-primary w-full shadow sm:w-auto"
        >
          + New Ticket
        </Link>
      </div>

      {/* Summary */}

      <div className="mb-5">
        <div className="badge badge-lg badge-neutral">{total} Tickets</div>
      </div>

      {/* Filters */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 0.1,
        }}
        className="
          mb-6
          rounded-box
          border
          border-base-300
          bg-base-100
          p-4
          shadow
        "
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Filters</h2>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}

          <div>
            <label className="label">
              <span className="label-text font-medium">Search</span>
            </label>

            <input
              type="text"
              placeholder="Search tickets..."
              className="input input-bordered w-full"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                setPage(1);
              }}
            />
          </div>

          {/* Status */}

          <TicketSelect
            label="Status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statusOptions}
          />

          {/* Priority */}

          <TicketSelect
            label="Priority"
            value={priority}
            onChange={(value) => {
              setPriority(value);

              setPage(1);
            }}
            options={priorityOptions}
          />

          {/* Sort */}

          <TicketSelect
            label="Sort"
            value={sort}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            options={sortOptions}
          />
        </div>
      </motion.div>

      {/* Mobile Cards */}

      <div className="space-y-4 md:hidden">
        {tickets.map((ticket, index) => (
          <motion.button
            type="button"
            key={ticket._id}
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
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-primary">
                  {ticket.title}
                </h3>

                <p className="mt-1 break-all text-sm text-base-content/60">
                  {ticket.email}
                </p>
              </div>

              <span className="text-base-content/40">→</span>
            </div>

            <div className="my-4 h-px bg-base-300" />

            <div className="flex flex-wrap gap-2">
              <span className={`badge ${getStatusBadge(ticket.status)}`}>
                {getStatusLabel(ticket.status)}
              </span>

              <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                {getPriorityLabel(ticket.priority)}
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

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
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
              <th>Title</th>

              <th>Email</th>

              <th>Status</th>

              <th>Priority</th>

              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket, index) => (
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
                  delay: 0.25 + index * 0.04,
                }}
                className="
                    cursor-pointer
                    transition-colors
                    hover:bg-base-200
                  "
                onClick={() => navigate(`/tickets/${ticket._id}`)}
              >
                <td className="font-medium">
                  <span className="link link-primary">{ticket.title}</span>
                </td>

                <td className="break-all">{ticket.email}</td>

                <td>
                  <span className={`badge ${getStatusBadge(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${getPriorityBadge(ticket.priority)}`}
                  >
                    {getPriorityLabel(ticket.priority)}
                  </span>
                </td>

                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Empty State */}

      {tickets.length === 0 && (
        <div className="mt-6 rounded-box border border-base-300 bg-base-100 p-8 text-center shadow">
          <h3 className="text-lg font-semibold">No tickets found</h3>

          <p className="mt-1 text-base-content/60">
            Try changing your filters or create a new ticket.
          </p>
        </div>
      )}

      {/* Pagination */}

      <div className="mt-5 grid grid-cols-3 items-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm sm:btn-md"
          disabled={page <= 1}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          <span className="hidden sm:inline">← Previous</span>

          <span className="sm:hidden">←</span>
        </button>

        <div className="text-center">
          <p className="text-sm font-medium sm:text-base">
            Page {page} of {totalPages}
          </p>

          <p className="hidden text-xs text-base-content/50 sm:block">
            {total} total tickets
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm sm:btn-md"
          disabled={page >= totalPages}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          <span className="hidden sm:inline">Next →</span>

          <span className="sm:hidden">→</span>
        </button>
      </div>
    </motion.div>
  );
}

export default Tickets;
