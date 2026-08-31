import TicketModel from "../models/TicketModel.js";

export const getAllTickets = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { message: { $regex: req.query.search, $options: "i" } },
      ];
    }

    let query = TicketModel.find(filter);

    if (req.query.sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    } else if (req.query.sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    const total = await TicketModel.countDocuments(filter);
    const tickets = await query;

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
export const createTicket = async (req, res, next) => {
  try {
    const { title, message, email, status, priority } = req.body;

    if (!title || !message || !email) {
      const error = new Error("Title, message and email are required");
      error.statusCode = 400;
      throw error;
    }

    const newTicket = await TicketModel.create({
      title,
      message,
      email,
      status,
      priority,
    });

    res.status(201).json({
      success: true,
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
      const error = new Error("Ticket not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
export const updateTicket = async (req, res, next) => {
  try {
    const { title, message, email, status, priority } = req.body;

    if (!title || !message || !email) {
      const error = new Error("Title, message and email are required");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        email,
        status,
        priority,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!ticket) {
      const error = new Error("Ticket not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await TicketModel.findByIdAndDelete(req.params.id);

    if (!ticket) {
      const error = new Error("Ticket not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
